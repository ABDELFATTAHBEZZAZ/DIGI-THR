import Database from 'better-sqlite3';
import { USER_ROLES } from '../shared/schema';

// Initialize SQLite database for migration
const dbPath = process.env.DATABASE_URL?.replace('sqlite://', '') || './database.db';
const db = new Database(dbPath);

async function runMigration() {
  console.log("Creating database tables...");
  
  // Create tables with updated schema
  const createTables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('ADMIN', 'MAINTENANCE', 'SECURITE')) DEFAULT 'SECURITE',
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      department TEXT,
      is_active INTEGER DEFAULT 1,
      last_login_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )`,
    
    `CREATE TABLE IF NOT EXISTS production_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      responsible TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Planifiée' CHECK (status IN ('Planifiée', 'En cours', 'Terminée')),
      date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE INDEX IF NOT EXISTS idx_production_activities_date ON production_activities(date)`,
    `CREATE INDEX IF NOT EXISTS idx_production_activities_status ON production_activities(status)`,
    
    `CREATE TABLE IF NOT EXISTS maintenance_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      machine TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      scheduled_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Planifiée',
      created_by INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )`,
    
    `CREATE TABLE IF NOT EXISTS security_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      zone TEXT NOT NULL,
      message TEXT NOT NULL,
      severity TEXT NOT NULL,
      resolved INTEGER DEFAULT 0,
      created_by INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )`,
    
    `CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  // Execute all create table statements
  for (const stmt of createTables) {
    console.log(`Executing: ${stmt.split('(')[0]}...`);
    db.prepare(stmt).run();
  }

  console.log("Tables created successfully!");
  
  // Seed the database
  await seedDatabase();
  
  console.log("Migration completed!");
}

async function seedDatabase() {
  console.log("Seeding database...");

  // Insert sample users
  const insertUsersStmt = db.prepare(
    'INSERT OR IGNORE INTO users (username, password, role, name, department, is_active) VALUES (?, ?, ?, ?, ?, 1)'
  );
  insertUsersStmt.run(['admin', 'admin123', 'ADMIN', 'Admin User', 'Admin Department']);
  insertUsersStmt.run(['abdelfattah', 'abdelfattah ocp', 'AGENT_SECURITE', 'Abdelfattah User', 'Security Department']);

  // Insert sample production activities
  const insertActivitiesStmt = db.prepare(
    'INSERT OR IGNORE INTO production_activities (name, responsible, status, date) VALUES (?, ?, ?, ?)'
  );
  insertActivitiesStmt.run(['Extraction Zone A', 'Ahmed Benali', 'En cours', '2025-01-16']);
  insertActivitiesStmt.run(['Transport matériaux', 'Fatima Zahra', 'Terminé', '2025-01-15']);

  // Insert sample maintenance schedules
  const insertSchedulesStmt = db.prepare(
    'INSERT OR IGNORE INTO maintenance_schedules (machine, type, description, scheduled_date, status) VALUES (?, ?, ?, ?, ?)'
  );
  insertSchedulesStmt.run(['Excavatrice CAT 320', 'Préventive', 'Vérification hydraulique et changement filtres', '2025-01-18', 'Planifiée']);

  // Insert sample security alerts
  const insertAlertsStmt = db.prepare(
    'INSERT OR IGNORE INTO security_alerts (type, zone, message, severity, resolved) VALUES (?, ?, ?, ?, 0)'
  );
  insertAlertsStmt.run(['Accès non autorisé', 'Zone A', 'Détection d\'un accès non autorisé en Zone A', 'high']);

  // Insert sample notifications
  const insertNotificationsStmt = db.prepare(
    'INSERT OR IGNORE INTO notifications (title, message, type, read) VALUES (?, ?, ?, 0)'
  );
  insertNotificationsStmt.run(['Alerte Sécurité', 'Nouvelle alerte de sécurité dans la Zone A', 'error']);

  console.log("Database seeded successfully!");
}

runMigration().catch(console.error);
