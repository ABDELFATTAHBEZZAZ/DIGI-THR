const Database = require('better-sqlite3');
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

console.log('Création de la table notifications...');

try {
  // Activer les clés étrangères
  db.pragma('foreign_keys = ON');

  // Créer une table notifications minimale
  db.prepare(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0
    )
  `).run();

  console.log('Table notifications créée avec succès !');

  console.log('Table notifications créée avec succès !');
} catch (error) {
  console.error('Erreur lors de la création de la table notifications :', error);
  process.exit(1);
} finally {
  db.close();
}
