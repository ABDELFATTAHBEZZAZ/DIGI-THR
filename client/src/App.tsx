import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Context from "@/pages/Context";
import Dashboard from "@/pages/Dashboard";
import Production from "@/pages/Production";
import Maintenance from "@/pages/Maintenance";
import Security from "@/pages/Security";
import SiteMap from "@/pages/SiteMap";
import Features from "@/pages/Features";
import Performance from "@/pages/Performance";
import Notifications from "@/pages/Notifications";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

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
        <Route path="/" component={Home} />
        <Route path="/context" component={Context} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/production" component={Production} />
        <Route path="/maintenance" component={Maintenance} />
        <Route path="/security" component={Security} />
        <Route path="/map" component={SiteMap} />
        <Route path="/features" component={Features} />
        <Route path="/performance" component={Performance} />
        <Route path="/notifications" component={Notifications} />
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
