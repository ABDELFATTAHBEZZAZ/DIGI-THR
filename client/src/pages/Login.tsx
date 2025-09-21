import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.username || !formData.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include", // Important pour les cookies de session
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Tenter de parser en JSON; fallback en texte si le serveur renvoie du HTML
        let userData: any = null;
        try {
          const ct = response.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            userData = await response.json();
          } else {
            const text = await response.text();
            throw new Error(`Réponse inattendue du serveur (non JSON): ${text.slice(0, 200)}`);
          }
        } catch (e) {
          console.error('Erreur de parsing de la réponse login:', e);
          toast({
            title: 'Erreur de connexion',
            description: e instanceof Error ? e.message : 'Réponse inattendue du serveur',
            variant: 'destructive',
          });
          return;
        }
        
        // Utilise la méthode login du hook useAuth
        login(userData);
        
        toast({
          title: "Connexion réussie !",
          description: `Bienvenue ${userData.name}`,
        });
        
        // Redirection en fonction du rôle
        switch(userData.role) {
          case 'ADMIN':
            window.location.href = "/admin";
            break;
          case 'SUPERVISEUR':
            window.location.href = "/";
            break;
          case 'CHEF_MAINTENANCE':
            window.location.href = "/maintenance";
            break;
          case 'AGENT_SECURITE':
            window.location.href = "/security";
            break;
          case 'OPERATEUR':
            window.location.href = "/production";
            break;
          default:
            window.location.href = "/";
        }
      } else {
        // Gérer proprement les réponses non-JSON (HTML d'erreur, etc.)
        const ct = response.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const error = await response.json();
          toast({
            title: 'Erreur de connexion',
            description: error.error || "Nom d'utilisateur ou mot de passe incorrect",
            variant: 'destructive',
          });
        } else {
          const text = await response.text();
          toast({
            title: 'Erreur de connexion',
            description: text.slice(0, 200) || `Statut ${response.status}`,
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4">
            <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center bg-white rounded-full p-2 shadow-md">
              <img
                src="/ocp-logo.png"
                alt="OCP Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">OCP</h1>
            <p className="text-sm text-gray-700 mt-2 font-semibold">
              DIGI THR - Supervision intelligente des travaux à haut risque
            </p>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            Bon Retour
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Adresse Email
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                required
                className="mt-1 bg-gray-50 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Mot de Passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                className="mt-1 bg-gray-50 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 mt-6"
            >
              {isLoading ? "Connexion..." : "Se Connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
