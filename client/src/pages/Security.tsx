import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X, ShieldCheck } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SecurityAlert } from "@shared/schema";

export default function Security() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["/api/alerts"],
  });

  const createTestAlert = useMutation({
    mutationFn: async () => {
      const testAlerts = [
        {
          type: "Risque élevé",
          zone: "Zone 2",
          message: "Travaux à haut risque détectés",
          severity: "high",
          resolved: false,
        },
        {
          type: "Équipement non conforme",
          zone: "Zone 1",
          message: "Casque manquant détecté",
          severity: "medium",
          resolved: false,
        },
        {
          type: "Accès non autorisé",
          zone: "Zone 3",
          message: "Personnel non autorisé détecté",
          severity: "high",
          resolved: false,
        },
      ];

      const randomAlert = testAlerts[Math.floor(Math.random() * testAlerts.length)];
      const response = await apiRequest("POST", "/api/alerts", randomAlert);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alerte test générée",
        description: "Une nouvelle alerte de sécurité a été créée",
        variant: "destructive",
      });
    },
  });

  const resolveAlert = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PUT", `/api/alerts/${id}`, {
        resolved: true,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alerte résolue",
        description: "L'alerte a été marquée comme résolue",
      });
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 border-red-200";
      case "medium":
        return "bg-yellow-50 border-yellow-200";
      case "low":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="text-red-500" size={18} />;
      case "medium":
        return <AlertTriangle className="text-yellow-500" size={18} />;
      case "low":
        return <AlertTriangle className="text-blue-500" size={18} />;
      default:
        return <AlertTriangle className="text-gray-500" size={18} />;
    }
  };

  const activeAlerts = alerts.filter((alert: SecurityAlert) => !alert.resolved);
  const resolvedAlerts = alerts.filter((alert: SecurityAlert) => alert.resolved);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Supervision Sécurité</h2>
        <Button 
          onClick={() => createTestAlert.mutate()}
          disabled={createTestAlert.isPending}
          className="bg-ocp-orange hover:bg-orange-600 text-white"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Déclencher Alerte Test
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Alertes Actives ({activeAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAlerts.map((alert: SecurityAlert) => (
                <div key={alert.id} className={`flex items-start p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}>
                  <div className="flex-shrink-0 mr-3">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                      <Badge className={getSeverityBadge(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{alert.message}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      {alert.zone} - {new Date(alert.createdAt!).toLocaleString('fr-FR')}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveAlert.mutate(alert.id)}
                      disabled={resolveAlert.isPending}
                    >
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Résoudre
                    </Button>
                  </div>
                </div>
              ))}
              
              {activeAlerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ShieldCheck className="mx-auto h-12 w-12 mb-4 text-green-500" />
                  Aucune alerte active
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques Sécurité</CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300" 
              alt="Safety monitoring dashboard" 
              className="rounded-lg mb-4 w-full h-48 object-cover"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">97%</p>
                <p className="text-sm text-gray-600">Conformité EPI</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">Accidents ce mois</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">{activeAlerts.length}</p>
                <p className="text-sm text-gray-600">Alertes actives</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{resolvedAlerts.length}</p>
                <p className="text-sm text-gray-600">Alertes résolues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
