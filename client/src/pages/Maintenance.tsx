import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import MaintenanceForm from "@/components/MaintenanceForm";
import { maintenanceApi, MaintenanceSchedule } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Maintenance() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  
  const { data: schedules = [], isLoading, error, refetch } = useQuery<MaintenanceSchedule[], Error>({
    queryKey: ["maintenance"],
    queryFn: () => maintenanceApi.getAll()
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => maintenanceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      toast({
        title: "Succès",
        description: "La maintenance a été supprimée avec succès",
      });
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (schedule: MaintenanceSchedule) => {
    setEditingId(schedule.id);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      deleteMutation.mutate(deleteId);
    }
  };

  const handleFormSuccess = () => {
    setEditingId(null);
    refetch();
  };

  // Gestion des erreurs
  React.useEffect(() => {
    if (error) {
      console.error('Erreur lors de la récupération des plannings de maintenance:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les plannings de maintenance",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Gestion de la Maintenance</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendrier Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedules.map((schedule: MaintenanceSchedule) => (
                <div key={schedule.id} className="group relative p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className={`w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0 ${getPriorityDot(schedule.type)}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{schedule.machine}</p>
                        <div className="flex items-center space-x-2">
                          <Badge className={getTypeColor(schedule.type)}>
                            {schedule.type}
                          </Badge>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleEdit(schedule)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteClick(schedule.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{schedule.description}</p>
                      <p className="text-xs text-gray-500">
                        {schedule.scheduledDate ? (() => {
                          try {
                            const date = new Date(schedule.scheduledDate);
                            if (isNaN(date.getTime())) {
                              return 'Date invalide';
                            }
                            return date.toLocaleDateString('fr-FR');
                          } catch (error) {
                            console.error('Erreur d\'affichage de date:', error);
                            return 'Date invalide';
                          }
                        })() : 'Date non définie'}
                        {schedule.scheduledDate && (() => {
                          try {
                            const date = new Date(schedule.scheduledDate);
                            if (!isNaN(date.getTime())) {
                              return (
                                <span className="ml-2 text-gray-500">
                                  {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              );
                            }
                          } catch (error) {
                            console.error('Erreur d\'affichage de l\'heure:', error);
                          }
                          return null;
                        })()}
                      </p>
                      <Badge className={`mt-2 ${getStatusColor(schedule.status)}`}>
                        {schedule.status}
                      </Badge>
                    </div>
                  </div>
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

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">
          {editingId ? 'Modifier la maintenance' : 'Nouvelle maintenance'}
        </h3>
        <MaintenanceForm 
          editingId={editingId}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingId(null)}
        />
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette maintenance ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La maintenance sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
}
