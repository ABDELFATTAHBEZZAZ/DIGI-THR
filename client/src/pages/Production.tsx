import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import ProductionForm from "@/components/ProductionForm";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ProductionActivity } from "@shared/schema";

export default function Production() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading, error } = useQuery<ProductionActivity[]>({
    queryKey: ["/api/production"],
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  
  // Log des données reçues et des erreurs
  React.useEffect(() => {
    if (error) {
      console.error('Erreur lors de la récupération des activités:', error);
    }
    console.log('État de la requête:', { 
      isLoading, 
      error: error?.message, 
      activitiesCount: activities.length,
      activities: activities
    });
  }, [isLoading, error, activities]);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/production/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/production"] });
      toast({
        title: "Succès",
        description: "Activité supprimée avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Échec de la suppression",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "bg-green-100 text-green-800";
      case "Planifiée":
        return "bg-yellow-100 text-yellow-800";
      case "Terminée":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité?")) {
      deleteMutation.mutate(id);
    }
  };

  const [editingActivity, setEditingActivity] = React.useState<ProductionActivity | null>(null);

  const handleEdit = (activity: ProductionActivity) => {
    setEditingActivity(activity);
  };

  const handleCloseEdit = () => {
    setEditingActivity(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Activités de Production</h2>
        {!editingActivity && (
          <ProductionForm />
        )}
      </div>

      {editingActivity && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-4">
          <h3 className="text-lg font-medium mb-4">Modifier l'Activité</h3>
          <ProductionForm activity={editingActivity} />
          <div className="mt-4">
            <button
              onClick={handleCloseEdit}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Activité</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>État</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(activities) ? activities.map((activity: ProductionActivity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">
                    PROD_{activity.id.toString().padStart(3, '0')}
                  </TableCell>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>{activity.responsible}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                        aria-label="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        disabled={deleteMutation.isPending}
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
