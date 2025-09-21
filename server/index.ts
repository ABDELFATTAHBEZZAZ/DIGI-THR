import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { registerRoutes } from './routes.js';
import { setupVite, serveStatic } from './vite.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http';
import crypto from 'crypto';

// Déclaration des types pour les modules CommonJS
declare const require: (module: string) => any;

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
      };
    }
  }
}

const app = express();

// Early health check (mounted before any other middleware)
app.get('/api/healthz', (_req: Request, res: Response) => {
  res.json({ ok: true, where: 'index.ts early', time: new Date().toISOString() });
});

// Ne pas modifier manuellement l'encodage du flux requête pour éviter
// l'erreur "stream encoding should not be set". Laisser Express gérer.

// Middleware pour parser le JSON avec support UTF-8
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configuration de la session
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

// Configuration CORS pour le développement
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // En développement, on accepte toutes les origines
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // En production, on restreint aux origines autorisées
      const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposedHeaders: ['set-cookie']
};

// Middleware CORS personnalisé
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  
  // Vérifier l'origine de la requête
  if (corsOptions.origin) {
    corsOptions.origin(origin || '', (err: Error | null, allow?: boolean) => {
      if (err || !allow) {
        res.status(403).json({ error: 'Not allowed by CORS' });
        return;
      }
      
      // Définir les en-têtes CORS
      if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
      res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Expose-Headers', 'set-cookie');
      
      // Répondre immédiatement aux requêtes OPTIONS
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }
      
      next();
    });
  } else {
    next();
  }
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Fonction pour démarrer le serveur
async function startServer() {
  try {
    // Middleware de logging
    app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      const path = req.path;
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
          console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
        }
      });

      next();
    });

    if (process.env.NODE_ENV === 'development' || true) {
      // Créer le serveur HTTP
      const server = http.createServer(app);
      
      // Enregistrer les routes API AVANT Vite pour garantir la priorité des routes /api
      console.log('[index] calling registerRoutes...');
      try {
        await registerRoutes(app);
        console.log('[index] registerRoutes completed');
      } catch (e) {
        console.error('[index] registerRoutes failed:', e);
      }

      // Endpoint de debug des routes API, monté ici (avant Vite)
      app.get('/api/_routes', (req: Request, res: Response) => {
        try {
          // @ts-ignore
          const stack = app._router?.stack || [];
          const routes = stack
            .filter((l: any) => l.route)
            .map((l: any) => ({ path: l.route.path, methods: Object.keys(l.route.methods) }));
          res.json({ routes });
        } catch (err) {
          res.status(500).json({ error: 'routes_debug_failed', message: err instanceof Error ? err.message : String(err) });
        }
      });

      // Configurer Vite avec le serveur et l'application Express
      const vite = await setupVite(app, server);
      
      // Gestion du routage SPA en développement (ne pas intercepter les routes API)
      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        return vite.middlewares.handle(req, res, next);
      });
      
      // Démarrer le serveur
      const PORT = process.env.PORT || 3002;
      server.listen(PORT, () => {
        console.log(`Server is running in development mode on http://localhost:${PORT}`);
        console.log('API health check: GET http://localhost:' + PORT + '/api/health');
      });
      
      return server;
    } else {
      // En production, on sert d'abord les fichiers statiques
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const publicPath = path.join(__dirname, '..', 'client', 'dist');
      
      // Servir les fichiers statiques
      app.use(express.static(publicPath));
      
      // Enregistrer les routes API
      registerRoutes(app);
      
      // Gestion du routage SPA - retourne index.html pour toutes les autres routes
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(publicPath, 'index.html'));
      });
      
      serveStatic(app);
      
      // Gestion des erreurs
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        const status = err.status || 500;
        const message = err.message || 'Internal Server Error';
        
        console.error(`Error: ${status} - ${message}`, err.stack);
        res.status(status).json({ error: message });
      });

      // Démarrer le serveur
      const PORT = process.env.PORT || 3002;
      const server = http.createServer(app);
      server.listen(PORT, () => {
        console.log(`Server is running in production mode on http://localhost:${PORT}`);
      });
      
      return server;
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Démarrer le serveur
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
