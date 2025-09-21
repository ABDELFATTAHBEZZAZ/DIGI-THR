import type { Express, Request, Response, NextFunction } from "express";
import session from 'express-session';
import { z } from 'zod';
import { storage } from "./storage.js";
import { insertUserSchema, insertProductionActivitySchema, insertMaintenanceScheduleSchema, insertSecurityAlertSchema, insertNotificationSchema } from "@shared/schema";
import { USER_ROLES } from "../shared/schema.js";

// Configuration de la session
const sessionConfig: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || 'votre-secret-tres-securise',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 semaine
    httpOnly: true,
    sameSite: 'lax' as const
  }
};

// Interface pour l'utilisateur dans la session
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      role: string;
      name: string;
    };
  }
}

// Middleware d'authentification
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Non autorisé. Veuillez vous connecter.' });
  }
  next();
}

// Middleware pour vérifier si l'utilisateur est connecté
function requireUser(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Non autorisé. Veuillez vous connecter.' });
  }
  next();
}

// Middleware pour vérifier si l'utilisateur a un rôle spécifique
function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.user) {
      return res.status(401).json({ error: 'Non autorisé. Veuillez vous connecter.' });
    }
    
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({ 
        error: `Accès refusé. Rôle(s) requis: ${roles.join(', ')}`,
        requiredRoles: roles,
        currentRole: req.session.user.role
      });
    }
    
    next();
  };
}

// Helpers
function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@$!%*?&';
  let pwd = '';
  for (let i = 0; i < length; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd;
}

function normalizeRole(input: any): string | undefined {
  if (!input) return undefined;
  const val = String(input).trim();
  if ((USER_ROLES as readonly string[]).includes(val as any)) return val;
  const upper = val
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .toUpperCase()
    .replace(/[-\s]+/g, '_');
  const map: Record<string, string> = {
    'ADMINISTRATEUR': 'ADMIN',
    'ADMIN': 'ADMIN',
    'SUPERVISEUR': 'SUPERVISEUR',
    'CHEF_MAINTENANCE': 'CHEF_MAINTENANCE',
    'AGENT_SECURITE': 'AGENT_SECURITE',
    'AGENT_SECURITE\u0301': 'AGENT_SECURITE',
    'OPERATEUR': 'OPERATEUR',
    'OPERATOR': 'OPERATEUR'
  };
  const candidate = map[upper] || upper;
  return (USER_ROLES as readonly string[]).includes(candidate as any) ? candidate : undefined;
}

export function registerRoutes(app: Express): void {
  console.log('[routes] registerRoutes mounted');
  
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
  });

  // Debug: list registered API routes
  app.get('/api/_debug', (req, res) => {
    try {
      // @ts-ignore access to private stack for debugging only
      const stack = app._router?.stack || [];
      const routes = stack
        .filter((l: any) => l.route)
        .map((l: any) => ({
          path: l.route.path,
          methods: Object.keys(l.route.methods),
        }))
        .filter((r: any) => typeof r.path === 'string' && r.path.startsWith('/api'));
      res.json({ routes });
    } catch (e) {
      res.status(500).json({ error: 'debug_failed', message: e instanceof Error ? e.message : String(e) });
    }
  });

  // Mettre à jour un utilisateur (informations générales)
  app.put("/api/users/:id", requireRole(['ADMIN']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID utilisateur invalide" });
      }

      const role = normalizeRole(req.body.role);

      // Construire le payload de mise à jour en évitant d'écraser le mot de passe avec une valeur vide
      const updateData: any = {
        username: typeof req.body.username === 'string' ? req.body.username.trim() : undefined,
        name: typeof req.body.name === 'string' ? req.body.name.trim() : undefined,
        department: typeof req.body.department === 'string' ? req.body.department.trim() : (req.body.department === null ? null : undefined),
        isActive: typeof req.body.isActive === 'boolean' ? req.body.isActive : undefined,
      };

      if (role) updateData.role = role;

      // Mot de passe: uniquement s'il est fourni et non vide
      if (typeof req.body.password === 'string' && req.body.password.trim().length > 0) {
        updateData.password = req.body.password;
      }

      // Nettoyer les clés undefined
      Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k]);

      const updated = await storage.updateUser(id, updateData);
      if (!updated) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const { password, ...userWithoutPassword } = updated as any;
      res.json(userWithoutPassword);
    } catch (error: unknown) {
      console.error("Erreur lors de la modification de l'utilisateur:", error);
      if (error instanceof Error) {
        return res.status(500).json({ 
          error: "Échec de la modification de l'utilisateur",
          message: error.message 
        });
      }
      res.status(500).json({ error: "Une erreur inconnue est survenue lors de la modification de l'utilisateur" });
    }
  });

  // Route pour vérifier l'état de la session
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      if (req.session?.user) {
        res.json(req.session.user);
      } else {
        res.status(401).json({ error: 'Non autorisé. Veuillez vous connecter.' });
      }
    } catch (error) {
      console.error("Error checking session:", error);
      res.status(500).json({ error: "Erreur lors de la vérification de la session" });
    }
  });

  // Route de déconnexion
  app.post("/api/auth/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Erreur lors de la déconnexion" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Déconnexion réussie" });
    });
  });

  // Authentication route
  // Aide: répondre proprement aux GET pour éviter le "Cannot GET" confus
  app.get("/api/auth/login", (req, res) => {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: "Utilisez POST /api/auth/login avec { username, password } en JSON."
    });
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      console.log('POST /api/auth/login received. Headers:', req.headers);
      console.log('POST /api/auth/login body:', req.body);

      const { username, password } = (req.body || {}) as { username?: unknown; password?: unknown };
      
      // Validation des entrées (types + présence)
      if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password.trim()) {
        return res.status(400).json({ error: "Nom d'utilisateur et mot de passe requis" });
      }
      
      const user = await storage.getUserByUsername(username.trim());
      
      // Vérification des identifiants (en production, utilisez bcrypt pour le hachage des mots de passe)
      if (!user) {
        // Ne pas révéler si c'est le nom d'utilisateur ou le mot de passe qui est incorrect
        return res.status(401).json({ error: "Identifiants invalides" });
      }
      
      // Comparaison des mots de passe
      if (String(user.password) !== String(password)) {
        return res.status(401).json({ error: "Identifiants invalides" });
      }
      
      // Vérifier si le compte est actif
      if (user.isActive === false) {
        return res.status(403).json({ error: "Ce compte est désactivé. Veuillez contacter un administrateur." });
      }
      
      // Mettre à jour la date de dernière connexion (best effort)
      try {
        await storage.updateUser(user.id, { /* @ts-ignore */ lastLoginAt: new Date().toISOString() });
      } catch (e) {
        console.warn('lastLoginAt update skipped:', e);
      }

      // Définir l'utilisateur dans la session
      if (!req.session) {
        console.error('Session non initialisée (req.session manquant)');
        return res.status(500).json({ error: 'Session non initialisée' });
      }

      try {
        req.session.user = {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name
        };
      } catch (e) {
        console.error('Erreur lors de l\'attribution de la session:', e);
        return res.status(500).json({ error: 'Erreur interne (session)' });
      }

      req.session.save((saveErr) => {
        if (saveErr) {
          console.error('Erreur sauvegarde session:', saveErr);
          return res.status(500).json({ error: "Erreur lors de la sauvegarde de la session" });
        }
        const { password: _pw, ...userData } = user;
        return res.json(userData);
      });

    } catch (error) {
      console.error("Error during login:", error);
      const isDev = process.env.NODE_ENV !== 'production';
      res.status(500).json({ 
        error: "Une erreur est survenue lors de la connexion",
        ...(isDev && error instanceof Error ? { message: error.message, stack: error.stack } : {})
      });
    }
  });

  // Route de déconnexion
  app.post("/api/auth/logout", (req, res) => {
    // Détruire la session côté serveur
    req.session.destroy((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({ error: "Échec de la déconnexion" });
      }
      
      // Supprimer le cookie de session côté client
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      res.json({ success: true, message: "Déconnexion réussie" });
    });
  });

  // User management routes (admin only)
  app.get("/api/users", requireRole(['ADMIN']), async (req, res) => {
    try {
      // Récupération des paramètres de requête
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as string | undefined;
      const search = req.query.search as string | undefined;
      const isActive = req.query.isActive !== undefined 
        ? req.query.isActive === 'true' 
        : undefined;
      
      // Récupération des utilisateurs avec les filtres
      const allUsers = await storage.getUsers();
      
      // Filtrage des utilisateurs
      let filteredUsers = [...allUsers];
      
      // Filtre par rôle
      if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
      }
      
      // Filtre par statut actif/inactif
      if (isActive !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
      }
      
      // Filtre de recherche (nom d'utilisateur, nom, email)
      if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.username.toLowerCase().includes(searchLower) ||
          (user.name && user.name.toLowerCase().includes(searchLower)) ||
          (user.email && user.email.toLowerCase().includes(searchLower))
        );
      }
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      // Ne pas renvoyer les mots de passe
      const usersWithoutPasswords = paginatedUsers.map(({ password, ...user }) => user);
      
      // Réponse avec métadonnées de pagination
      res.json({
        data: usersWithoutPasswords,
        pagination: {
          total: filteredUsers.length,
          page,
          limit,
          totalPages: Math.ceil(filteredUsers.length / limit)
        },
        filters: {
          role,
          search,
          isActive
        }
      });
      
    } catch (error: unknown) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      
      if (error instanceof Error) {
        return res.status(500).json({ 
          error: "Échec de la récupération des utilisateurs",
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: "Une erreur inconnue est survenue lors de la récupération des utilisateurs" 
      });
    }
  });

  // Récupérer un utilisateur spécifique par ID
  app.get("/api/users/:id", requireRole(['ADMIN']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID utilisateur invalide" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      
      // Ne pas renvoyer le mot de passe
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
      
    } catch (error: unknown) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${req.params.id}:`, error);
      
      if (error instanceof Error) {
        return res.status(500).json({ 
          error: "Échec de la récupération de l'utilisateur",
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: "Une erreur inconnue est survenue lors de la récupération de l'utilisateur" 
      });
    }
  });
  // Créer un nouvel utilisateur
  app.post("/api/users", requireRole(['ADMIN']), async (req, res) => {
    try {
      console.log('POST /api/users body:', req.body);
      const normalizedRole = normalizeRole(req.body.role) || 'OPERATEUR';
      const providedPassword = typeof req.body.password === 'string' ? req.body.password.trim() : '';
      const hasValidPassword = providedPassword.length >= 8;
      const effectivePassword = hasValidPassword ? providedPassword : generatePassword(10);
      const passwordWasGenerated = !hasValidPassword;
      // Valider les données d'entrée avec le schéma (safeParse pour renvoyer 400 avec détails)
      const parsed = insertUserSchema.safeParse({
        ...req.body,
        // S'assurer que le rôle est valide
        role: normalizedRole, // Valeur par défaut déjà appliquée ci-dessus
        // Normaliser les données
        username: typeof req.body.username === 'string' ? req.body.username.trim() : req.body.username,
        name: typeof req.body.name === 'string' ? req.body.name.trim() : req.body.name,
        email: typeof req.body.email === 'string' ? req.body.email.trim() : req.body.email,
        password: effectivePassword,
        // S'assurer que le statut actif est défini
        isActive: req.body.isActive !== undefined ? req.body.isActive : true
      });

      if (!parsed.success) {
        const issues = parsed.error.issues.map((i: { path: string[], message: string }) => ({ path: i.path.join('.'), message: i.message }));
        return res.status(400).json({ error: 'Validation error', issues });
      }

      const userData = parsed.data;
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ 
          error: "Nom d'utilisateur déjà utilisé",
          field: "username"
        });
      }
      
      // Créer l'utilisateur avec les données validées
      const newUser = await storage.createUser({
        ...userData,
        createdBy: req.session.user?.id || 1 // ID de l'admin par défaut si non défini
      });
      
      if (!newUser) {
        throw new Error("Échec de la création de l'utilisateur");
      }
      
      // Ne pas renvoyer le mot de passe dans la réponse
      const { password, ...userWithoutPassword } = newUser;
      
      return res.status(201).json({
        ...userWithoutPassword,
        ...(passwordWasGenerated ? { temporaryPassword: effectivePassword } : {})
      });
      
    } catch (error: unknown) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      
      // Gestion des erreurs de validation Zod
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Données invalides",
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
      }
      
      // Gestion des autres erreurs
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Échec de la création de l'utilisateur",
          message: error.message
        });
      }
      
      res.status(500).json({
        error: "Une erreur inconnue est survenue lors de la création de l'utilisateur"
      });
    }
  });

  app.delete("/api/users/:id", requireRole(['ADMIN']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID utilisateur invalide" });
      }
      
      // Vérifier si l'utilisateur essaie de se supprimer lui-même
      if (req.session.user?.id === id) {
        return res.status(400).json({ 
          error: "Action non autorisée",
          message: "Vous ne pouvez pas supprimer votre propre compte" 
        });
      }
      
      // Vérifier si l'utilisateur existe avant de tenter de le supprimer
      const userToDelete = await storage.getUser(id);
      if (!userToDelete) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      
      // Empêcher la suppression d'un administrateur par un autre administrateur
      if (userToDelete.role === 'ADMIN' && req.session.user?.role !== 'ADMIN') {
        return res.status(403).json({ 
          error: "Action non autorisée",
          message: "Seul un administrateur peut supprimer un autre administrateur"
        });
      }
      
      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        throw new Error("Échec de la suppression de l'utilisateur");
      }
      
      res.json({ 
        success: true, 
        message: `Utilisateur "${userToDelete.username}" supprimé avec succès`,
        userId: id
      });
    } catch (error: unknown) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      
      if (error instanceof Error) {
        return res.status(500).json({ 
          error: "Erreur lors de la suppression de l'utilisateur",
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: "Une erreur inconnue est survenue lors de la suppression de l'utilisateur" 
      });
    }
  });

  // Route pour obtenir le profil de l'utilisateur connecté
  app.get("/api/auth/me", requireUser, (req, res) => {
    res.json(req.session.user);
  });

  // Route pour mettre à jour le mot de passe de l'utilisateur
  app.put("/api/users/:id/password", requireUser, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { currentPassword, newPassword } = req.body;
      
      // Vérifier que l'utilisateur est bien le propriétaire du compte ou un admin
      if (req.session.user?.role !== 'ADMIN' && req.session.user?.id !== userId) {
        return res.status(403).json({
          error: "Non autorisé",
          message: "Vous n'êtes pas autorisé à modifier ce mot de passe"
        });
      }
      
      // Valider les entrées
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Données manquantes",
          message: "Le mot de passe actuel et le nouveau mot de passe sont requis"
        });
      }
      
      if (newPassword.length < 8) {
        return res.status(400).json({
          error: "Mot de passe invalide",
          message: "Le nouveau mot de passe doit contenir au moins 8 caractères"
        });
      }
      
      // Récupérer l'utilisateur
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({
          error: "Utilisateur non trouvé",
          message: "L'utilisateur spécifié n'existe pas"
        });
      }
      
      // Vérifier le mot de passe actuel (dans une vraie application, il faudrait utiliser bcrypt)
      if (user.password !== currentPassword) {
        return res.status(401).json({
          error: "Mot de passe incorrect",
          message: "Le mot de passe actuel est incorrect"
        });
      }
      
      // Mettre à jour le mot de passe
      await storage.updateUser(userId, { password: newPassword });
      
      res.json({
        success: true,
        message: "Mot de passe mis à jour avec succès"
      });
      
    } catch (error: unknown) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Échec de la mise à jour du mot de passe",
          message: error.message
        });
      }
      
      res.status(500).json({
        error: "Une erreur inconnue est survenue lors de la mise à jour du mot de passe"
      });
    }
  });

  // Production Activities routes
  app.get("/api/production", async (req, res) => {
    try {
      const activities = await storage.getProductionActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch production activities" });
    }
  });

  app.get("/api/production/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const activity = await storage.getProductionActivity(id);
      if (!activity) {
        return res.status(404).json({ error: "Production activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch production activity" });
    }
  });

  app.post("/api/production", async (req, res) => {
    try {
      console.log('Received POST /api/production with body:', req.body);
      
      // Vérifier si le corps de la requête est vide
      if (!req.body || Object.keys(req.body).length === 0) {
        console.error('Error: Request body is empty');
        return res.status(400).json({ error: "Le corps de la requête est vide" });
      }
      
      // Valider les données avec le schéma
      const validatedData = insertProductionActivitySchema.parse(req.body);
      console.log('Validated data:', validatedData);
      
      // Créer l'activité
      const activity = await storage.createProductionActivity(validatedData);
      console.log('Created activity:', activity);
      
      res.status(201).json(activity);
    } catch (error) {
      console.error('Error in POST /api/production:', error);
      res.status(400).json({ 
        error: "Données d'activité de production invalides",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.put("/api/production/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductionActivitySchema.partial().parse(req.body);
      const activity = await storage.updateProductionActivity(id, validatedData);
      if (!activity) {
        return res.status(404).json({ error: "Production activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(400).json({ error: "Invalid production activity data" });
    }
  });

  app.delete("/api/production/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProductionActivity(id);
      if (!success) {
        return res.status(404).json({ error: "Production activity not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete production activity" });
    }
  });

  // Maintenance Schedules routes
  app.get("/api/maintenance", async (req, res) => {
    try {
      const schedules = await storage.getMaintenanceSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance schedules" });
    }
  });

  app.get("/api/maintenance/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid maintenance ID" });
      }
      
      const schedule = await storage.getMaintenanceSchedule(id);
      if (!schedule) {
        return res.status(404).json({ error: "Maintenance schedule not found" });
      }
      
      res.json(schedule);
    } catch (error) {
      console.error("Error fetching maintenance schedule:", error);
      res.status(500).json({ error: "Failed to fetch maintenance schedule" });
    }
  });

  app.post("/api/maintenance", requireRole(['ADMIN', 'CHEF_MAINTENANCE']), async (req, res) => {
    try {
      console.log("Received maintenance data:", JSON.stringify(req.body, null, 2));
      
      // Préparer les données avec des valeurs par défaut
      const now = new Date().toISOString();
      
      // Normaliser la date si elle est au format YYYY-MM-DD
      let scheduledDate = req.body.scheduledDate;
      if (scheduledDate && /^\d{4}-\d{2}-\d{2}$/.test(scheduledDate)) {
        // Convertir YYYY-MM-DD en ISO datetime
        scheduledDate = new Date(scheduledDate + 'T00:00:00.000Z').toISOString();
      }
      
      const maintenanceData = {
        ...req.body,
        scheduledDate: scheduledDate || now,
        status: req.body.status || 'Planifiée',
        createdAt: now,
        updatedAt: now
      };
      
      // Valider les données avec le schéma
      const validatedData = insertMaintenanceScheduleSchema.parse(maintenanceData);
      
      // Vérifier si la date est valide
      const date = new Date(validatedData.scheduledDate);
      if (isNaN(date.getTime())) {
        throw new Error("Date de maintenance invalide");
      }
      
      // Créer la maintenance
      const schedule = await storage.createMaintenanceSchedule(validatedData);
      console.log("Created schedule:", JSON.stringify(schedule, null, 2));
      
      res.status(201).json({
        ...schedule,
        scheduledDate: schedule.scheduledDate || now
      });
      
    } catch (error) {
      console.error("Maintenance creation error:", error);
      
      if (error instanceof z.ZodError) {
        const issues = error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return res.status(400).json({ 
          error: "Données de planification invalides",
          details: issues
        });
      }
      
      res.status(400).json({ 
        error: "Erreur lors de la création de la maintenance",
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  });

  app.put("/api/maintenance/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMaintenanceScheduleSchema.partial().parse(req.body);
      const schedule = await storage.updateMaintenanceSchedule(id, validatedData);
      if (!schedule) {
        return res.status(404).json({ error: "Maintenance schedule not found" });
      }
      res.json(schedule);
    } catch (error) {
      res.status(400).json({ error: "Invalid maintenance schedule data" });
    }
  });

  app.delete("/api/maintenance/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMaintenanceSchedule(id);
      if (!success) {
        return res.status(404).json({ error: "Maintenance schedule not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete maintenance schedule" });
    }
  });

  // Security Alerts routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getSecurityAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch security alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertSecurityAlertSchema.parse(req.body);
      const alert = await storage.createSecurityAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid security alert data" });
    }
  });

  app.put("/api/alerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSecurityAlertSchema.partial().parse(req.body);
      const alert = await storage.updateSecurityAlert(id, validatedData);
      if (!alert) {
        return res.status(404).json({ error: "Security alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid security alert data" });
    }
  });

  app.delete("/api/alerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSecurityAlert(id);
      if (!success) {
        return res.status(404).json({ error: "Security alert not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete security alert" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await storage.getNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ error: "Invalid notification data" });
    }
  });

  app.put("/api/notifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNotificationSchema.partial().parse(req.body);
      const notification = await storage.updateNotification(id, validatedData);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(400).json({ error: "Invalid notification data" });
    }
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNotification(id);
      if (!success) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const activities = await storage.getProductionActivities();
      const alerts = await storage.getSecurityAlerts();
      const maintenance = await storage.getMaintenanceSchedules();
      
      const stats = {
        productionActive: activities.filter(a => a.status === "En cours").length,
        maintenanceHours: maintenance.length * 4, // Simulate hours
        dieselUsage: 15247 + Math.floor(Math.random() * 1000),
        securityAlerts: alerts.filter(a => !a.resolved).length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });
} // Fin de registerRoutes
