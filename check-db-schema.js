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
  console.log('Structure de la table users :');
  const tableInfo = db.pragma('table_info(users)');
  console.table(tableInfo);
  
  console.log('\nContenu de la table users :');
  const users = db.prepare('SELECT * FROM users').all();
  console.table(users);
  
} catch (error) {
  console.error('Erreur lors de la lecture de la base de données :', error);
} finally {
  db.close();
}
