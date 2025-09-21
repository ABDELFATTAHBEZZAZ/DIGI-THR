import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';

const app = express();
const PORT = 3002;

// Middleware pour parser le JSON
app.use(express.json());

// Configuration de la base de données
const dbPath = path.join(process.cwd(), 'database.db');
const db = new Database(dbPath);

// Route pour récupérer tous les utilisateurs
app.get('/test/users', (req, res) => {
  try {
    console.log('Tentative de récupération des utilisateurs...');
    
    // Vérifier si la table users existe
    const tableExists = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    ).get();
    
    if (!tableExists) {
      console.error('La table users n\'existe pas');
      return res.status(500).json({ error: 'La table users n\'existe pas' });
    }
    
    // Récupérer tous les utilisateurs
    const users = db.prepare('SELECT * FROM users').all();
    console.log('Utilisateurs récupérés avec succès:', users);
    
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur de test en cours d'exécution sur http://localhost:${PORT}`);
  console.log(`Testez avec: curl http://localhost:${PORT}/test/users`);
});
