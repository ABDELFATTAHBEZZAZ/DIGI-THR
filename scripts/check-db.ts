import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq, count, sql } from 'drizzle-orm';

async function checkDatabase() {
  try {
    console.log('Vérification de la base de données...');
    
    // Vérifier si la table users existe
    const userCount = await db.select({ count: count() }).from(users);
    console.log(`Nombre d'utilisateurs dans la base de données: ${userCount[0]?.count || 0}`);
    
    // Afficher tous les utilisateurs
    const allUsers = await db.select().from(users);
    console.log('Utilisateurs trouvés:', allUsers);
    
    // Vérifier si la table est vide et insérer des utilisateurs de test si nécessaire
    if (userCount[0]?.count === 0) {
      console.log('Aucun utilisateur trouvé. Insertion des utilisateurs de test...');
      
      const testUsers = [
        {
          username: 'admin',
          password: 'admin123',
          name: 'Administrateur Système',
          email: 'admin@example.com',
          role: 'ADMIN',
          department: 'IT',
          isActive: 1
        },
        {
          username: 'securite',
          password: 'securite123',
          name: 'Agent de Sécurité',
          email: 'securite@example.com',
          role: 'SECURITE',
          department: 'Sécurité',
          isActive: 1
        },
        {
          username: 'maintenance',
          password: 'maintenance123',
          name: 'Technicien Maintenance',
          email: 'maintenance@example.com',
          role: 'MAINTENANCE',
          department: 'Maintenance',
          isActive: 1
        }
      ];

      for (const user of testUsers) {
        await db.insert(users).values(user);
        console.log(`Utilisateur créé: ${user.username}`);
      }
      
      console.log('Utilisateurs de test créés avec succès!');
    }
    
  } catch (error) {
    console.error('Erreur lors de la vérification de la base de données:', error);
  } finally {
    process.exit(0);
  }
}

checkDatabase();
