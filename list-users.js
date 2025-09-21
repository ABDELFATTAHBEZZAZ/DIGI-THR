import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.db');
const db = new Database(dbPath);

try {
  // Lister tous les utilisateurs
  const users = db.prepare('SELECT * FROM users').all();
  console.log('Utilisateurs dans la base de données :');
  console.table(users);
  
  // Vérifier la structure de la table users
  const columns = db.pragma('table_info(users)');
  console.log('\nStructure de la table users :');
  console.table(columns);
  
} catch (error) {
  console.error('Erreur lors de la récupération des utilisateurs :', error);
} finally {
  db.close();
}
