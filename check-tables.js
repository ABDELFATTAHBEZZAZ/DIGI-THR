import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.db');
const db = new Database(dbPath);

try {
  // Vérifier les tables existantes
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'drizzle_%'").all();
  console.log('Tables dans la base de données :');
  console.table(tables);

  // Vérifier la structure de la table notifications si elle existe
  const notificationsTable = tables.some(t => t.name === 'notifications');
  if (notificationsTable) {
    const columns = db.pragma('table_info(notifications)');
    console.log('\nStructure de la table notifications :');
    console.table(columns);
  }

  // Vérifier la structure de la table users
  const usersTable = tables.some(t => t.name === 'users');
  if (usersTable) {
    const columns = db.pragma('table_info(users)');
    console.log('\nStructure de la table users :');
    console.table(columns);
  }
} catch (error) {
  console.error('Erreur lors de la vérification de la base de données :', error);
} finally {
  db.close();
}
