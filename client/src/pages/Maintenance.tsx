import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MaintenanceForm from "@/components/MaintenanceForm";
import type { MaintenanceSchedule } from "@shared/schema";

export default function Maintenance() {
  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ["/api/maintenance"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "bg-blue-100 text-blue-800";
      case "Planifiée":
        return "bg-yellow-100 text-yellow-800";
      case "Terminée":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Urgente":
        return "bg-red-100 text-red-800";
      case "Corrective":
        return "bg-orange-100 text-orange-800";
      case "Préventive":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityDot = (type: string) => {
    switch (type) {
      case "Urgente":
        return "bg-red-500";
      case "Corrective":
        return "bg-yellow-500";
      case "Préventive":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
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
                <div key={i} className="flex items-center p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendrier Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule: MaintenanceSchedule) => (
              <div key={schedule.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-3 h-3 rounded-full mr-3 ${getPriorityDot(schedule.type)}`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{schedule.machine}</p>
                    <Badge className={getTypeColor(schedule.type)}>
                      {schedule.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{schedule.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(schedule.scheduledDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <Badge className={getStatusColor(schedule.status)}>
                  {schedule.status}
                </Badge>
              </div>
            ))}
            
            {schedules.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune maintenance programmée
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <MaintenanceForm />
    </div>
  );
}
