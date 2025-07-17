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
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout
  };
}