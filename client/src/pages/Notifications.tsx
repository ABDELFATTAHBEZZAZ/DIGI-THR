import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, AlertTriangle, Settings, Info, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Notification } from "@shared/schema";

export default function Notifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const sendTestNotification = useMutation({
    mutationFn: async () => {
      const testNotifications = [
        {
          title: "Test de Notification",
          message: "Ceci est une notification de test générée par le système",
          type: "info",
          read: false,
        },
        {
          title: "Alerte de Maintenance",
          message: "Maintenance programmée pour demain à 14h00",
          type: "warning",
          read: false,
        },
        {
          title: "Système Opérationnel",
          message: "Tous les systèmes fonctionnent normalement",
          type: "success",
          read: false,
        },
      ];

      const randomNotification = testNotifications[Math.floor(Math.random() * testNotifications.length)];
      const response = await apiRequest("POST", "/api/notifications", randomNotification);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Notification envoyée",
        description: "Une notification test a été générée avec succès",
      });
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PUT", `/api/notifications/${id}`, {
        read: true,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="text-red-500" size={18} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={18} />;
      case "success":
        return <CheckCircle className="text-green-500" size={18} />;
      case "info":
        return <Info className="text-blue-500" size={18} />;
      default:
        return <Bell className="text-gray-500" size={18} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "success":
        return "bg-green-50 border-green-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start p-4 border rounded-lg">
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse mr-3"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification: Notification) => (
              <div 
                key={notification.id} 
                className={`flex items-start p-4 border rounded-lg transition-all duration-200 ${
                  notification.read ? 'opacity-60' : ''
                } ${getNotificationColor(notification.type)}`}
              >
                <div className="flex-shrink-0 mr-3">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <Badge className={getTypeBadge(notification.type)}>
                      {notification.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(notification.createdAt!)}
                    </p>
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead.mutate(notification.id)}
                        disabled={markAsRead.isPending}
                      >
                        Marquer comme lu
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {notifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="mx-auto h-12 w-12 mb-4" />
                Aucune notification
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Paramètres des Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="security-alerts" className="text-sm font-medium">
                  Alertes de Sécurité
                </Label>
                <Switch id="security-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-alerts" className="text-sm font-medium">
                  Notifications de Maintenance
                </Label>
                <Switch id="maintenance-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="production-alerts" className="text-sm font-medium">
                  Alertes de Production
                </Label>
                <Switch id="production-alerts" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="system-alerts" className="text-sm font-medium">
                  Notifications Système
                </Label>
                <Switch id="system-alerts" defaultChecked />
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                onClick={() => sendTestNotification.mutate()}
                disabled={sendTestNotification.isPending}
                className="w-full bg-ocp-orange hover:bg-orange-600 text-white"
              >
                <Bell className="mr-2 h-4 w-4" />
                Envoyer Notification Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
