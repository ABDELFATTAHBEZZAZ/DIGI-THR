const Database = require('better-sqlite3');
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

console.log('Démarrage de la migration des tables de maintenance...');

try {
  // Activer les clés étrangères
  db.pragma('foreign_keys = ON');

  // Créer la table maintenance_schedules
  console.log('Création de la table maintenance_schedules...');
  db.prepare(`
    CREATE TABLE IF NOT EXISTS maintenance_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      machine TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('Préventive', 'Corrective', 'Urgente')),
      description TEXT NOT NULL,
      scheduled_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Planifiée' CHECK (status IN ('Planifiée', 'En cours', 'Terminée', 'Reportée')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Créer des index pour améliorer les performances
  console.log('Création des index...');
  db.prepare('CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_scheduled_date ON maintenance_schedules(scheduled_date)').run();
  db.prepare('CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_status ON maintenance_schedules(status)').run();
  db.prepare('CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_type ON maintenance_schedules(type)').run();

  console.log('Migration des tables de maintenance terminée avec succès !');
} catch (error) {
  console.error('Erreur lors de la migration :', error);
  process.exit(1);
} finally {
  db.close();
}
