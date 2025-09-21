import React from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster.js";
import { TooltipProvider } from "./components/ui/tooltip.js";
import { useAuth } from "./hooks/useAuth.js";
import Layout from "./components/Layout.js";
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import Context from "./pages/Context.js";
import Dashboard from "./pages/Dashboard.js";
import Production from "./pages/Production.js";
import Maintenance from "./pages/Maintenance.js";
import Security from "./pages/Security.js";
import SiteMap from "./pages/SiteMap.js";
import Features from "./pages/Features.js";
import Performance from "./pages/Performance.js";
import Notifications from "./pages/Notifications.js";
import Admin from "./pages/Admin.js";
import NotFound from "./pages/not-found.js";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  const role = user?.role;

  const Guard: React.FC<{ allowed: Array<'ADMIN' | 'SUPERVISEUR' | 'CHEF_MAINTENANCE' | 'AGENT_SECURITE'>; children: React.ReactNode }>
    = ({ allowed, children }) => {
      // Admin a toujours accès
      if (role === 'ADMIN') return <>{children}</>;
      if (role && allowed.includes(role as any)) return <>{children}</>;
      return (
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-2">403 - Accès refusé</h1>
          <p className="text-muted-foreground">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      );
    };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-600 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={() => (
          <Guard allowed={['SUPERVISEUR', 'CHEF_MAINTENANCE', 'AGENT_SECURITE']}>
            <Home />
          </Guard>
        )} />

        <Route path="/context" component={() => (
          <Guard allowed={['SUPERVISEUR', 'CHEF_MAINTENANCE', 'AGENT_SECURITE']}>
            <Context />
          </Guard>
        )} />

        <Route path="/dashboard" component={() => (
          <Guard allowed={['SUPERVISEUR']}>
            <Dashboard />
          </Guard>
        )} />

        <Route path="/production" component={() => (
          <Guard allowed={['SUPERVISEUR']}>
            <Production />
          </Guard>
        )} />

        <Route path="/maintenance" component={() => (
          <Guard allowed={['CHEF_MAINTENANCE']}>
            <Maintenance />
          </Guard>
        )} />

        <Route path="/security" component={() => (
          <Guard allowed={['AGENT_SECURITE']}>
            <Security />
          </Guard>
        )} />

        <Route path="/map" component={() => (
          <Guard allowed={['SUPERVISEUR', 'CHEF_MAINTENANCE', 'AGENT_SECURITE']}>
            <SiteMap />
          </Guard>
        )} />

        <Route path="/performance" component={() => (
          <Guard allowed={['SUPERVISEUR', 'CHEF_MAINTENANCE']}>
            <Performance />
          </Guard>
        )} />

        <Route path="/notifications" component={() => (
          <Guard allowed={['SUPERVISEUR', 'AGENT_SECURITE']}>
            <Notifications />
          </Guard>
        )} />

        <Route path="/features" component={() => (
          <Guard allowed={[]}> {/* Admin uniquement par défaut */}
            <Features />
          </Guard>
        )} />

        <Route path="/admin" component={() => (
          <Guard allowed={[]}> {/* Admin uniquement */}
            <Admin />
          </Guard>
        )} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
