import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
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

// Navigation de base pour tous les utilisateurs connectés
// (seulement Accueil et Contexte, les autres pages sont ajoutées selon le rôle)
const baseNavigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Contexte", href: "/context", icon: Info },
];

// Modules de navigation par fonctionnalités
const productionNavigation = [
  { name: "Production", href: "/production", icon: Factory },
];

const maintenanceNavigation = [
  { name: "Maintenance", href: "/maintenance", icon: Settings },
];

// Navigation spécifique pour les agents de sécurité
const securityNavigation = [
  { name: "Sécurité", href: "/security", icon: Shield },
];

// Navigation spécifique pour les administrateurs
const adminNavigation = [
  { name: "Administration", href: "/admin", icon: Settings },
];

// Fonction pour obtenir la navigation en fonction du rôle
const getNavigation = (role?: string) => {
  let navigation = [...baseNavigation];

  // Aides pour composer
  const performance = { name: "Performance", href: "/performance", icon: TrendingUp };
  const dashboard = { name: "Dashboard", href: "/dashboard", icon: BarChart3 };
  const notifications = { name: "Notifications", href: "/notifications", icon: Bell };
  const map = { name: "Carte du Chantier", href: "/map", icon: Map };

  switch (role) {
    case 'ADMIN':
      navigation = [
        ...navigation,
        ...productionNavigation,
        ...maintenanceNavigation,
        performance,
        dashboard,
        notifications,
        ...securityNavigation,
        map,
        ...adminNavigation,
      ];
      break;
    case 'SUPERVISEUR':
      navigation = [
        ...navigation,
        ...productionNavigation,
        performance,
        dashboard,
        notifications,
        map,
      ];
      break;
    case 'CHEF_MAINTENANCE':
      navigation = [
        ...navigation,
        ...maintenanceNavigation,
        performance,
        map,
      ];
      break;
    case 'AGENT_SECURITE':
      navigation = [
        ...navigation,
        ...securityNavigation,
        notifications,
        map,
      ];
      break;
    default:
      // Par défaut, seul l'accès de base
      break;
  }

  return navigation;
};

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
  "/admin": { title: "Administration", subtitle: "Gestion des utilisateurs et configuration système" },
};

export default function Layout({ children }: LayoutProps) {
  const [pathname] = useLocation(); // Utilisé pour la navigation
  const { toast } = useToast();
  const { user, logout, isAdmin, isMaintenanceManager, isSecurityAgent } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get navigation items based on user role
  const navigation = getNavigation(user?.role);

  // Get the current page info or use defaults
  const currentPage = pageInfo[pathname as keyof typeof pageInfo] || {
    title: pathname.replace(/^\//, '').charAt(0).toUpperCase() + pathname.slice(2),
    subtitle: ''
  };
  
  // Type pour les éléments de navigation
  interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  // Fetch unread notifications count
  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: any) => !n.read).length : 0;

  // Update time every second
  const [currentTime, setCurrentTime] = useState(new Date());
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

  const currentPageInfo = pageInfo[pathname as keyof typeof pageInfo] || pageInfo["/"];

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
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
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-colors ${
                isActive
                  ? 'bg-green-100 text-green-800 border-r-4 border-green-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
              {item.name === "Notifications" && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
        
        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-colors ${
              pathname === "/admin"
                ? 'bg-red-100 text-red-800 border-r-4 border-red-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Shield className="h-5 w-5 mr-3" />
            Administration
          </Link>
        )}
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
          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            aria-label="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
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
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Ouvrir le menu</span>
            </button>
          </SheetTrigger>
          <div className="fixed inset-0 z-50 flex">
            <div className="w-72 max-w-sm">
              <Sidebar mobile />
            </div>
          </div>
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
                {currentTime.toLocaleTimeString()}
              </div>
              <button
                onClick={logout}
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
