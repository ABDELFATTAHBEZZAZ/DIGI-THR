import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function checkUsers() {
  try {
    console.log('Vérification des utilisateurs dans la base de données...');
    
    // Compter le nombre d'utilisateurs
    const userCount = await db.select().from(users);
    console.log(`Nombre d'utilisateurs trouvés: ${userCount.length}`);
    
    // Afficher tous les utilisateurs
    if (userCount.length > 0) {
      console.log('Liste des utilisateurs:');
      console.table(userCount);
    } else {
      console.log('Aucun utilisateur trouvé dans la base de données.');
      
      // Créer un utilisateur admin par défaut si la table est vide
      console.log('Création d\'un utilisateur admin par défaut...');
      await db.insert(users).values({
        username: 'admin',
        password: 'admin123', // À hasher en production
        name: 'Administrateur',
        email: 'admin@example.com',
        role: 'ADMIN',
        department: 'IT',
        isActive: 1
      });
      
      console.log('Utilisateur admin créé avec succès!');
    }
    
  } catch (error) {
    console.error('Erreur lors de la vérification des utilisateurs:', error);
  } finally {
    process.exit(0);
  }
}

checkUsers();
