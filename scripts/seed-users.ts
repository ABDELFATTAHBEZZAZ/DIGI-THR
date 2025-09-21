import { db } from '../server/db';
import { users, type UserRole } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Fonction pour insérer des utilisateurs de test
async function seedUsers() {
  try {
    console.log('Début de l\'insertion des utilisateurs de test...');
    
    // Vider la table des utilisateurs
    await db.delete(users).run();
    console.log('Anciens utilisateurs supprimés');
    
    // Insérer des utilisateurs de test avec les 3 rôles principaux
    const testUsers: Array<{
      username: string;
      password: string;
      name: string;
      email: string;
      role: UserRole;
      department: string;
      isActive: boolean;
    }> = [
      {
        username: 'admin',
        password: 'admin123', // Dans une vraie application, ceci devrait être hashé
        name: 'Administrateur Système',
        email: 'admin@example.com',
        role: 'ADMIN',
        department: 'IT',
        isActive: true
      },
      {
        username: 'securite',
        password: 'securite123',
        name: 'Agent de Sécurité',
        email: 'securite@example.com',
        role: 'SECURITE',
        department: 'Sécurité',
        isActive: true
      },
      {
        username: 'maintenance',
        password: 'maintenance123',
        name: 'Technicien Maintenance',
        email: 'maintenance@example.com',
        role: 'MAINTENANCE',
        department: 'Maintenance',
        isActive: true
      }
    ];

    // Insérer les utilisateurs
    for (const user of testUsers) {
      await db.insert(users).values(user).run();
      console.log(`Utilisateur créé: ${user.username}`);
    }

    console.log('Insertion des utilisateurs terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des utilisateurs:', error);
  } finally {
    // Fermer la connexion à la base de données
    process.exit(0);
  }
}

// Exécuter la fonction
seedUsers();
