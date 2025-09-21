const Database = require('better-sqlite3');
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Activer les clés étrangères
db.pragma('foreign_keys = ON');

const storage = {
  // User management
  async getUserByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  },

  // Production activities
  async getProductionActivities() {
    const stmt = db.prepare('SELECT * FROM production_activities ORDER BY date DESC');
    return stmt.all();
  },

  async createProductionActivity(data) {
    const { name, responsible, status, date } = data;
    const stmt = db.prepare(
      'INSERT INTO production_activities (name, responsible, status, date) VALUES (?, ?, ?, ?)'
    );
    
    const result = stmt.run(name, responsible, status, date);
    
    if (result.changes === 1) {
      const activity = await this.getProductionActivityById(result.lastInsertRowid);
      return activity;
    }
    
    throw new Error('Failed to create production activity');
  },

  async getProductionActivityById(id) {
    const stmt = db.prepare('SELECT * FROM production_activities WHERE id = ?');
    return stmt.get(id);
  },

  // Add other database operations as needed...
};

module.exports = { storage };
