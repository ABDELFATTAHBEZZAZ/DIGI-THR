import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProductionFormData {
  name: string;
  responsible: string;
  status: string;
  date: string;
}

interface ProductionFormProps {
  activity?: any; // For edit mode
}

export default function ProductionForm({ activity }: ProductionFormProps = {}) {
  const [open, setOpen] = useState(false);
  const isEdit = !!activity;

  const [formData, setFormData] = useState<ProductionFormData>({
    name: activity?.name || "",
    responsible: activity?.responsible || "",
    status: activity?.status || "Planifiée",
    date: activity?.date ? new Date(activity.date).toISOString() : new Date().toISOString(),
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: ProductionFormData) => {
      try {
        const postData = {
          ...data,
          date: new Date(data.date).toISOString(),
        };
        console.log('Envoi des données de production:', postData);
        const response = await apiRequest("POST", "/api/production", postData);
        const result = await response.json();
        console.log('Réponse du serveur:', result);
        return result;
      } catch (error) {
        console.error('Erreur lors de l\'envoi des données:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/production"] });
      toast({
        title: "Succès",
        description: "Activité de production ajoutée avec succès",
      });
      setOpen(false);
      if (!isEdit) {
        setFormData({ name: "", responsible: "", status: "Planifiée", date: new Date().toISOString() });
      }
    },
    onError: (error) => {
      console.error('Erreur détaillée:', error);
      toast({
        title: "Erreur",
        description: `Échec de l'ajout de l'activité de production: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProductionFormData) => {
      try {
        const putData = {
          ...data,
          date: new Date(data.date).toISOString(),
        };
        console.log('Mise à jour des données de production:', putData);
        const response = await apiRequest("PUT", `/api/production/${activity.id}`, putData);
        const result = await response.json();
        console.log('Réponse du serveur:', result);
        return result;
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/production"] });
      toast({
        title: "Succès",
        description: "Activité de production modifiée avec succès",
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error('Erreur détaillée:', error);
      toast({
        title: "Erreur",
        description: `Échec de la modification: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs requis
    if (!formData.name || !formData.responsible || !formData.date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Formatage de la date pour l'envoi
    const formattedDate = new Date(formData.date).toISOString();

    if (isEdit) {
      updateMutation.mutate({
        ...formData,
        date: formattedDate
      });
    } else {
      createMutation.mutate({
        ...formData,
        date: formattedDate
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-ocp-blue rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          {isEdit ? "Modifier" : "Nouvelle Activité"}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier l'Activité de Production" : "Nouvelle Activité de Production"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'activité</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Chargement convoyeur 3"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responsible">Responsable</Label>
            <Input
              id="responsible"
              value={formData.responsible}
              onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              placeholder="Ex: Ahmed Benali"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">État</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner l'état" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planifiée">Planifiée</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminée">Terminée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button 
              type="button" 
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-ocp-blue border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(createMutation.isPending || updateMutation.isPending) ? (isEdit ? "Modification..." : "Ajout...") : (isEdit ? "Modifier" : "Ajouter")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
