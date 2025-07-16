import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Production from "@/pages/Production";
import Maintenance from "@/pages/Maintenance";
import Security from "@/pages/Security";
import SiteMap from "@/pages/SiteMap";
import Performance from "@/pages/Performance";
import Notifications from "@/pages/Notifications";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/production" component={Production} />
        <Route path="/maintenance" component={Maintenance} />
        <Route path="/security" component={Security} />
        <Route path="/map" component={SiteMap} />
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
