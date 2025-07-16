import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceFormData {
  machine: string;
  type: string;
  description: string;
  scheduledDate: string;
}

export default function MaintenanceForm() {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    machine: "",
    type: "",
    description: "",
    scheduledDate: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: MaintenanceFormData) => {
      const response = await apiRequest("POST", "/api/maintenance", {
        ...data,
        scheduledDate: new Date(data.scheduledDate).toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance"] });
      toast({
        title: "Succès",
        description: "Maintenance programmée avec succès",
      });
      setFormData({ machine: "", type: "", description: "", scheduledDate: "" });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Échec de la programmation de la maintenance",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.machine || !formData.type || !formData.description || !formData.scheduledDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Programmer Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="machine">Machine</Label>
            <Select value={formData.machine} onValueChange={(value) => setFormData({ ...formData, machine: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une machine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Excavatrice CAT 320">Excavatrice CAT 320</SelectItem>
                <SelectItem value="Dumper 793">Dumper 793</SelectItem>
                <SelectItem value="Convoyeur Principal">Convoyeur Principal</SelectItem>
                <SelectItem value="Crusher 1">Crusher 1</SelectItem>
                <SelectItem value="Loader 950">Loader 950</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de maintenance</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Préventive">Préventive</SelectItem>
                <SelectItem value="Corrective">Corrective</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledDate">Date programmée</Label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez les travaux de maintenance..."
              rows={3}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-ocp-blue hover:bg-blue-700" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Programmation..." : "Programmer Maintenance"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
