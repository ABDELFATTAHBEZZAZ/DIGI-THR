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
  console.log('Liste des utilisateurs dans la base de données :');
  const rows = db.prepare('SELECT id, username, password, role, isActive FROM users').all();
  
  if (rows.length === 0) {
    console.log('Aucun utilisateur trouvé dans la base de données.');
  } else {
    console.table(rows);
  }
} catch (error) {
  console.error('Erreur lors de la lecture des utilisateurs :', error);
} finally {
  db.close();
}
