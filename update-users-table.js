import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel en tant que module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

try {
  // Activer les clés étrangères
  db.pragma('foreign_keys = ON');

  // Vérifier si la colonne 'role' existe déjà
  const tableInfo = db.pragma('table_info(users)');
  const hasRoleColumn = tableInfo.some(col => col.name === 'role');
  
  if (!hasRoleColumn) {
    console.log('Mise à jour de la structure de la table users...');
    
    // Ajouter les colonnes manquantes une par une avec gestion des contraintes SQLite
    const columnsToAdd = [
      { name: 'role', type: 'TEXT NOT NULL', defaultValue: "'AGENT_SECURITE'" },
      { name: 'name', type: 'TEXT' },
      { name: 'department', type: 'TEXT' },
      { name: 'isActive', type: 'BOOLEAN', defaultValue: '1' },
      { name: 'createdAt', type: 'TEXT' },
      { name: 'createdBy', type: 'INTEGER' }
    ];
    
    // Désactiver temporairement la vérification des contraintes
    db.pragma('foreign_keys = OFF');
    
    // Démarrer une transaction
    const transaction = db.transaction(() => {
      columnsToAdd.forEach(column => {
        const columnExists = db.pragma('table_info(users)').some(col => col.name === column.name);
        
        if (!columnExists) {
          console.log(`Ajout de la colonne ${column.name}...`);
          let sql = `ALTER TABLE users ADD COLUMN ${column.name} ${column.type}`;
          db.prepare(sql).run();
          
          // Mettre à jour les valeurs par défaut après l'ajout de la colonne
          if (column.defaultValue !== undefined) {
            console.log(`Mise à jour des valeurs par défaut pour ${column.name}...`);
            db.prepare(`UPDATE users SET ${column.name} = ${column.defaultValue} WHERE ${column.name} IS NULL`).run();
          }
        }
      });
      
      // Pour created_at, on met à jour avec la date actuelle si c'est NULL
      db.prepare(`UPDATE users SET createdAt = datetime('now') WHERE createdAt IS NULL`).run();
    });
    
    // Exécuter la transaction
    transaction();
    
    // Réactiver la vérification des contraintes
    db.pragma('foreign_keys = ON');
    
    console.log('Structure de la table users mise à jour avec succès.');
  } else {
    console.log('La structure de la table users est déjà à jour.');
  }
  
  // Mettre à jour les utilisateurs existants avec des valeurs par défaut
  console.log('\nMise à jour des utilisateurs existants...');
  
  // Mettre à jour l'administrateur
  db.prepare(`
    UPDATE users 
    SET 
      role = 'ADMIN',
      name = 'Administrateur',
      department = 'IT',
      isActive = 1
    WHERE username = 'admin'
  `).run();
  
  // Mettre à jour l'utilisateur abdelfattah
  db.prepare(`
    UPDATE users 
    SET 
      role = 'SUPERVISEUR',
      name = 'Abdel Fattah',
      department = 'Mine',
      isActive = 1
    WHERE username = 'abdelfattah'
  `).run();
  
  // Ajouter l'utilisateur sécurité s'il n'existe pas
  const existingSecurite = db.prepare("SELECT id FROM users WHERE username = 'securite'").get();
  
  if (!existingSecurite) {
    console.log("Création de l'utilisateur sécurité...");
    db.prepare(`
      INSERT INTO users (username, password, role, name, department, isActive)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('securite', 'securite123', 'AGENT_SECURITE', 'Agent Sécurité', 'Sécurité', 1);
  }
  
  console.log('\nListe des utilisateurs mis à jour :');
  const users = db.prepare('SELECT id, username, role, name, department, isActive FROM users').all();
  console.table(users);
  
} catch (error) {
  console.error('Erreur lors de la mise à jour de la base de données :', error);
} finally {
  db.close();
}
