import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { maintenanceApi } from "@/lib/api";

// Définition des types pour éviter les erreurs de typage
interface MaintenanceSchedule {
  id: number;
  machine: string;
  type: string;
  description: string;
  scheduledDate: string;
  status: string;
}

// Type pour les données du formulaire
interface MaintenanceFormData {
  machine: string;
  type: string;
  description: string;
  scheduledDate: string; // Format YYYY-MM-DD
  scheduledTime: string; // Format HH:MM
  status: string;
}

// Type pour les données envoyées à l'API
interface MaintenanceFormSubmitData {
  machine: string;
  type: string;
  description: string;
  scheduledDate: string; // Format ISO complet (YYYY-MM-DDTHH:MM:SS.sssZ)
  status: string;
}

interface MaintenanceFormProps {
  editingId?: number | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function MaintenanceForm({ editingId, onSuccess, onCancel }: MaintenanceFormProps) {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    machine: "",
    type: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    status: "Planifiée"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Charger les données de la maintenance à éditer
  const { data: maintenanceData, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ["maintenance", editingId],
    queryFn: async (): Promise<MaintenanceSchedule | null> => {
      if (!editingId) return null;
      const response = await maintenanceApi.getById(editingId);
      return response as MaintenanceSchedule;
    },
    enabled: !!editingId
  });

  // Mettre à jour le formulaire quand les données sont chargées
  React.useEffect(() => {
    if (maintenanceData && editingId) {
      const iso = maintenanceData.scheduledDate ? new Date(maintenanceData.scheduledDate).toISOString() : '';
      const datePart = iso ? iso.split('T')[0] : '';
      const timePart = iso ? new Date(maintenanceData.scheduledDate).toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '';
      setFormData({
        machine: maintenanceData.machine,
        type: maintenanceData.type,
        description: maintenanceData.description,
        scheduledDate: datePart,
        scheduledTime: timePart,
        status: maintenanceData.status || 'Planifiée'
      });
    }
  }, [maintenanceData, editingId]);

  const { mutate: submitMaintenance, isPending: isSubmitting } = useMutation<MaintenanceSchedule, Error, MaintenanceFormSubmitData>({
    mutationFn: async (data: MaintenanceFormSubmitData) => {
      if (editingId) {
        return maintenanceApi.update(editingId, data);
      } else {
        return maintenanceApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      toast({
        title: "Succès",
        description: editingId 
          ? "Maintenance mise à jour avec succès"
          : "Maintenance programmée avec succès",
      });
      
      // Réinitialiser le formulaire uniquement en mode création
      if (!editingId) {
        setFormData({ 
          machine: "", 
          type: "", 
          description: "", 
          scheduledDate: "",
          scheduledTime: "",
          status: "Planifiée"
        });
      }
      
      // Appeler le callback onSuccess si fourni
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      console.error('Erreur détaillée:', error);
      toast({
        title: "Erreur",
        description: error.message || (editingId 
          ? "Échec de la mise à jour de la maintenance"
          : "Échec de la programmation de la maintenance"),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // S'assurer que tous les champs requis sont remplis
    if (!formData.machine || !formData.type || !formData.description || !formData.scheduledDate || !formData.scheduledTime) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires (date et heure)",
        variant: "destructive",
      });
      return;
    }
    
    // Validation de la date
    if (!formData.scheduledDate) {
      toast({
        title: "Erreur",
        description: "Date requise",
        variant: "destructive",
      });
      return;
    }

    // Validation de l'heure
    if (!formData.scheduledTime) {
      toast({
        title: "Erreur",
        description: "Heure requise",
        variant: "destructive",
      });
      return;
    }

    // Valider le format de date YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.scheduledDate)) {
      toast({
        title: "Erreur",
        description: "Format de date invalide. Utilisez le format YYYY-MM-DD",
        variant: "destructive",
      });
      return;
    }

    // Valider le format d'heure HH:MM
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(formData.scheduledTime)) {
      toast({
        title: "Erreur",
        description: "Format d'heure invalide. Utilisez le format HH:MM",
        variant: "destructive",
      });
      return;
    }

    // Combiner date et heure en ISO (en considérant l'heure locale)
    const dateTimeString = `${formData.scheduledDate}T${formData.scheduledTime}:00`;
    const dateObj = new Date(dateTimeString);
    
    // Vérifier que la date est valide
    if (isNaN(dateObj.getTime())) {
      toast({
        title: "Erreur",
        description: "Date invalide",
        variant: "destructive",
      });
      return;
    }

    // Formater les données pour l'envoi
    const dataToSend: MaintenanceFormSubmitData = {
      machine: formData.machine,
      type: formData.type,
      description: formData.description,
      scheduledDate: dateObj.toISOString(), // Convertir en ISO string avec la date + heure
      status: formData.status
    };
    
    console.log('Données envoyées au serveur:', dataToSend);
    submitMaintenance(dataToSend);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  if (editingId && isLoadingMaintenance) {
    return <div className="p-4 text-center">Chargement de la maintenance...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="machine">Machine</Label>
        <Select 
          value={formData.machine} 
          onValueChange={(value) => setFormData({ ...formData, machine: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une machine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Excavateur">Excavateur</SelectItem>
            <SelectItem value="Chargeuse">Chargeuse</SelectItem>
            <SelectItem value="Bulldozer">Bulldozer</SelectItem>
            <SelectItem value="Camion">Camion</SelectItem>
            <SelectItem value="Foreuse">Foreuse</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Type de maintenance</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => setFormData({ ...formData, type: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Préventive">Préventive</SelectItem>
            <SelectItem value="Corrective">Corrective</SelectItem>
            <SelectItem value="Urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value: string) => setFormData({ ...formData, status: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Planifiée">Planifiée</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminée">Terminée</SelectItem>
            <SelectItem value="Annulée">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="scheduledDate">Date prévue</Label>
        <Input
          id="scheduledDate"
          type="date"
          value={formData.scheduledDate}
          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
          className="w-full"
          min={!editingId ? new Date().toISOString().split('T')[0] : undefined}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheduledTime">Heure prévue</Label>
        <Input
          id="scheduledTime"
          type="time"
          value={formData.scheduledTime}
          onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
          className="w-full"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Décrivez les travaux à effectuer..."
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Enregistrement...' 
            : editingId 
              ? 'Mettre à jour' 
              : 'Créer la maintenance'}
        </Button>
      </div>
    </form>
  );
}
