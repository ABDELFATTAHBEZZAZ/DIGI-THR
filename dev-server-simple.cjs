const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'client/dist')));

// Mock API pour la connexion
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Tentative de connexion:', { username, password });
  
  if (username === 'admin' && password === 'admin123') {
    res.json({
      id: 1,
      username: 'admin',
      name: 'Administrateur Système',
      role: 'ADMIN',
      department: 'IT',
      isActive: true
    });
  } else if (username === 'abdelfattah' && password === 'abdelfattah ocp') {
    res.json({
      id: 2,
      username: 'abdelfattah',
      name: 'Abdelfattah',
      role: 'SUPERVISEUR',
      department: 'Supervision',
      isActive: true
    });
  } else {
    res.status(401).json({ error: 'Identifiants invalides' });
  }
});

// Mock API pour les utilisateurs
app.get('/api/users', (req, res) => {
  res.json([
    {
      id: 1,
      username: 'admin',
      name: 'Administrateur Système',
      role: 'ADMIN',
      department: 'IT',
      isActive: true
    },
    {
      id: 2,
      username: 'abdelfattah',
      name: 'Abdelfattah',
      role: 'SUPERVISEUR',
      department: 'Supervision',
      isActive: true
    }
  ]);
});

// Mock API pour les activités de production
app.get('/api/production', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Chargement convoyeur 3',
      responsible: 'Ahmed Benali',
      status: 'En cours',
      date: '2025-01-15T08:00:00'
    },
    {
      id: 2,
      name: 'Extraction zone B',
      responsible: 'Fatima Zahra',
      status: 'Planifiée',
      date: '2025-01-16T09:00:00'
    }
  ]);
});

// Mock API pour la maintenance
app.get('/api/maintenance', (req, res) => {
  res.json([
    {
      id: 1,
      machine: 'Excavatrice CAT 320',
      type: 'Préventive',
      description: 'Révision générale',
      scheduledDate: '2025-01-15T14:00:00',
      status: 'Planifiée'
    },
    {
      id: 2,
      machine: 'Dumper 793',
      type: 'Corrective',
      description: 'Changement filtre',
      scheduledDate: '2025-01-16T09:00:00',
      status: 'Planifiée'
    }
  ]);
});

// Mock API pour les alertes de sécurité
app.get('/api/security', (req, res) => {
  res.json([
    {
      id: 1,
      type: 'Accès non autorisé',
      message: 'Détection d\'un accès non autorisé en Zone A',
      severity: 'high',
      zone: 'Zone A',
      resolved: false
    },
    {
      id: 2,
      type: 'Équipement défaillant',
      message: 'Capteur de température hors service - Poste 7',
      severity: 'medium',
      zone: 'Zone B',
      resolved: true
    }
  ]);
});

// Mock API pour les notifications
app.get('/api/notifications', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Alerte Sécurité',
      message: 'Nouvelle alerte de sécurité dans la Zone A',
      type: 'error',
      read: false
    },
    {
      id: 2,
      title: 'Maintenance Programmée',
      message: 'Maintenance de l\'excavatrice CAT 320 prévue demain',
      type: 'info',
      read: false
    }
  ]);
});

// Route pour toutes les autres requêtes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log('🚀 DIGI THR DocumentAnalyzer running at http://localhost:' + PORT);
  console.log('📱 Admin page: http://localhost:' + PORT + '/admin');
  console.log('🔐 Login page: http://localhost:' + PORT + '/login');
  console.log('👤 Test accounts:');
  console.log('   - admin / admin123 (ADMIN)');
  console.log('   - abdelfattah / abdelfattah ocp (SUPERVISEUR)');
});
