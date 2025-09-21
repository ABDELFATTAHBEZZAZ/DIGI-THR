import { useState, useEffect } from 'react';

export type UserRole = 'ADMIN' | 'SUPERVISEUR' | 'CHEF_MAINTENANCE' | 'AGENT_SECURITE' | 'OPERATEUR';

export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isMaintenanceManager: boolean;
  isSecurityAgent: boolean;
  hasPermission: (requiredRole: UserRole) => boolean;
  login: (userData: Omit<User, 'id'>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifie si l'utilisateur a un rôle spécifique
  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    // L'admin a tous les droits
    if (user.role === 'ADMIN') return true;
    
    // Vérifie si le rôle correspond exactement
    return user.role === requiredRole;
  };

  // Vérifie l'état d'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userData = localStorage.getItem('user');
      
      if (isAuthenticated && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Vérifie que le rôle est valide
          if (['ADMIN', 'SUPERVISEUR', 'CHEF_MAINTENANCE', 'AGENT_SECURITE', 'OPERATEUR'].includes(parsedUser.role)) {
            // Vérifier côté serveur que la session est toujours valide
            try {
              const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include'
              });
              
              if (response.ok) {
                const serverUser = await response.json();
                setUser(serverUser);
              } else {
                // Session expirée côté serveur, déconnecter
                logout();
              }
            } catch (error) {
              console.error('Erreur lors de la vérification de la session:', error);
              // En cas d'erreur, utiliser les données du localStorage
              setUser(parsedUser);
            }
          } else {
            console.error('Rôle utilisateur invalide:', parsedUser.role);
            logout();
          }
        } catch (e) {
          console.error('Erreur de parsing des données utilisateur:', e);
          logout();
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Écoute les changements de stockage pour mettre à jour l'état d'authentification
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAuthenticated' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fonction de connexion
  const login = (userData: Omit<User, 'id'>) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData as User);
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      // Appeler la route de déconnexion côté serveur
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      // Nettoyer le localStorage et l'état local
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/';
    }
  };

  return {
    user,
    isLoading,
    isAdmin: user?.role === 'ADMIN',
    isMaintenanceManager: user?.role === 'CHEF_MAINTENANCE',
    isSecurityAgent: user?.role === 'AGENT_SECURITE',
    hasPermission,
    login,
    logout,
    isAuthenticated: !!user
  };
}