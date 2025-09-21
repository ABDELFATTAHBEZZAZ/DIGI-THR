const Database = require('better-sqlite3');
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

console.log('Démarrage de la migration...');

try {
  // Activer les clés étrangères
  db.pragma('foreign_keys = ON');

  // Supprimer la table si elle existe déjà
  console.log('Suppression de l\'ancienne table production_activities si elle existe...');
  db.prepare('DROP TABLE IF EXISTS production_activities').run();

  // Créer la table avec la nouvelle structure
  console.log('Création de la table production_activities...');
  db.prepare(`
    CREATE TABLE IF NOT EXISTS production_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      responsible TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Planifiée' CHECK (status IN ('Planifiée', 'En cours', 'Terminée')),
      date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Créer des index pour améliorer les performances
  console.log('Création des index...');
  db.prepare('CREATE INDEX IF NOT EXISTS idx_production_activities_date ON production_activities(date)').run();
  db.prepare('CREATE INDEX IF NOT EXISTS idx_production_activities_status ON production_activities(status)').run();

  // Insérer des données de test
  console.log('Insertion de données de test...');
  const insert = db.prepare('INSERT INTO production_activities (name, responsible, status, date) VALUES (?, ?, ?, ?)');
  
  const activities = [
    ['Extraction Zone A', 'Ahmed Benali', 'En cours', new Date().toISOString()],
    ['Transport matériaux', 'Fatima Zahra', 'Terminée', new Date(Date.now() - 86400000).toISOString()],
    ['Forage Puits 5', 'Karim El Fassi', 'Planifiée', new Date(Date.now() + 86400000).toISOString()]
  ];

  const insertMany = db.transaction((activities) => {
    for (const activity of activities) {
      insert.run(activity);
    }
  });

  insertMany(activities);

  console.log('Migration terminée avec succès !');
} catch (error) {
  console.error('Erreur lors de la migration :', error);
  process.exit(1);
} finally {
  db.close();
}
