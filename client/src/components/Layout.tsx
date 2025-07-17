import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  BarChart3, 
  Factory, 
  Settings, 
  Shield, 
  Map, 
  TrendingUp, 
  Bell, 
  Menu, 
  User,
  Clock,
  Info,
  Layers,
  LogOut
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Contexte", href: "/context", icon: Info },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Production", href: "/production", icon: Factory },
  { name: "Maintenance", href: "/maintenance", icon: Settings },
  { name: "Sécurité", href: "/security", icon: Shield },
  { name: "Carte du Chantier", href: "/map", icon: Map },
  { name: "Fonctionnalités", href: "/features", icon: Layers },
  { name: "Performance", href: "/performance", icon: TrendingUp },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

const pageInfo = {
  "/": { title: "Accueil", subtitle: "DIGI THR - Supervision intelligente des travaux à haut risque" },
  "/context": { title: "Contexte", subtitle: "Mine de Sidi Chennane - Problématique et solution" },
  "/dashboard": { title: "Dashboard", subtitle: "Supervision en temps réel des opérations" },
  "/production": { title: "Production", subtitle: "Gestion des activités de production" },
  "/maintenance": { title: "Maintenance", subtitle: "Planification et suivi des interventions" },
  "/security": { title: "Sécurité", subtitle: "Supervision des risques et alertes" },
  "/map": { title: "Carte du Chantier", subtitle: "Vue interactive des zones de travail" },
  "/features": { title: "Fonctionnalités", subtitle: "Capacités et modules du système DIGI THR" },
  "/performance": { title: "Performance", subtitle: "Suivi des temps et performances" },
  "/notifications": { title: "Notifications", subtitle: "Alertes et messages système" },
};

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const { user, logout } = useAuth();

  // Fetch unread notifications count
  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate IoT alerts every 30 seconds
  useEffect(() => {
    const alerts = [
      "⚠️ Travaux à haut risque détectés dans la zone 2!",
      "🔧 Maintenance requise sur l'excavatrice CAT 320",
      "⛽ Niveau de carburant faible - Station 3",
      "👷 Équipement de protection manquant détecté"
    ];

    const interval = setInterval(() => {
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      toast({
        title: "Alerte IoT",
        description: randomAlert,
        variant: "destructive",
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [toast]);

  const currentPageInfo = pageInfo[location as keyof typeof pageInfo] || pageInfo["/"];

  const Sidebar = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-ocp-green">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full p-1 flex items-center justify-center">
            <img 
              src="/ocp-logo.png" 
              alt="OCP Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-white">DIGI THR</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        <div className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Navigation
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start px-4 py-3 rounded-none transition-colors duration-200 ${
                  isActive
                    ? "bg-ocp-green text-white"
                    : "text-gray-700 hover:bg-ocp-green hover:text-white"
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
                {item.name === "Notifications" && unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
              <img 
                src="/ocp-logo.png" 
                alt="OCP Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Utilisateur'}</p>
              <p className="text-xs text-gray-500">{user?.username}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ocp-light-gray">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white shadow-lg">
          <Sidebar />
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar mobile />
          </SheetContent>
        </Sheet>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          DIGI THR
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {currentPageInfo.title}
              </h1>
              <p className="text-sm text-gray-600">
                {currentPageInfo.subtitle}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="mr-2 h-4 w-4" />
                {user?.name || 'Utilisateur'}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="mr-2 h-4 w-4" />
                {currentTime.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-red-600 hover:border-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
