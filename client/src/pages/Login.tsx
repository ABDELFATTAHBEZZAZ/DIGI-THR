import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      if (formData.username === 'abdelfattah' && formData.password === 'abdelfattah ocp') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          username: 'abdelfattah',
          name: 'Abdelfattah'
        }));
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur DIGI THR",
        });
        setLocation('/dashboard');
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Nom d'utilisateur ou mot de passe incorrect",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">OCP</h1>
            <p className="text-sm text-gray-600 mt-1">Plateforme de Prédiction ML</p>
            <p className="text-xs text-gray-500 mt-1">Technologie Durable pour l'Exploitation Minière et...</p>
            <p className="text-xs text-gray-500">l'Agriculture</p>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">Bon Retour</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Adresse Email
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="abdelfattah"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
                className="mt-1 bg-gray-50 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mot de Passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="mt-1 bg-gray-50 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 mt-6"
            >
              {isLoading ? 'Connexion...' : 'Se Connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}