import { useState, useEffect } from 'react';

interface User {
  username: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userData = localStorage.getItem('user');
      
      if (isAuthenticated && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage changes to update auth state
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

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout
  };
}