import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, UserPlus, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
}

interface CreateUserData {
  username: string;
  password: string;
  name: string;
  role: string;
  department?: string;
}

export default function Admin() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // Définition des rôles disponibles
  const availableRoles = ["ADMIN", "SUPERVISEUR", "CHEF_MAINTENANCE", "AGENT_SECURITE", "OPERATEUR"];

  const [formData, setFormData] = useState<CreateUserData>({
    username: "",
    password: "",
    name: "",
    role: "AGENT_SECURITE", // Rôle par défaut
    department: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users", { credentials: 'include' });
      if (!response.ok) throw new Error("Erreur lors du chargement des utilisateurs");
      const json = await response.json();
      // Le backend renvoie { data: User[], pagination: {...} }
      return Array.isArray(json) ? json : (json.data ?? []);
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Erreur lors de la création de l'utilisateur");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowCreateForm(false);
      setFormData({ username: "", password: "", name: "", role: "AGENT_SECURITE", department: "" });
      toast({ title: "Utilisateur créé avec succès" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la création", variant: "destructive" });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateUserData> }) => {
      // Ne pas envoyer un mot de passe vide lors de la modification
      const payload: Partial<CreateUserData> = { ...data };
      if (!payload.password) {
        delete (payload as any).password;
      }

      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let serverMessage = `Erreur lors de la modification (status ${response.status})`;
        try {
          const err = await response.json();
          if (err?.error || err?.message) {
            serverMessage = `${err.error || 'Erreur'}: ${err.message || ''}`.trim();
          }
        } catch {}
        throw new Error(serverMessage);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
      toast({ title: "Utilisateur modifié avec succès" });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({ title: `Échec de la modification: ${message}` , variant: 'destructive' });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE", credentials: 'include' });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Utilisateur supprimé" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, data: formData });
    } else {
      createUserMutation.mutate(formData);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: "",
      name: user.name,
      role: user.role,
      department: user.department || "",
    });
    setShowCreateForm(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-red-100 text-red-800";
      case "SUPERVISEUR": return "bg-yellow-100 text-yellow-800";
      case "CHEF_MAINTENANCE": return "bg-blue-100 text-blue-800";
      case "AGENT_SECURITE": return "bg-purple-100 text-purple-800";
      case "OPERATEUR": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN": return "Administrateur";
      case "SUPERVISEUR": return "Superviseur";
      case "CHEF_MAINTENANCE": return "Chef Maintenance";
      case "AGENT_SECURITE": return "Agent de Sécurité";
      case "OPERATEUR": return "Opérateur";
      default: return role;
    }
  };

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-red-600" />
            Administration des Utilisateurs
          </h1>
          <p className="text-gray-600 mt-2">Gestion des comptes et affectation des rôles</p>
        </div>
        <Button
          onClick={() => {
            setShowCreateForm(true);
            setEditingUser(null);
            setFormData({ username: "", password: "", name: "", role: "AGENT_SECURITE", department: "" });
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </div>

      {/* Create/Edit User Form */}
      {showCreateForm && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">
              {editingUser ? "Modifier l'Utilisateur" : "Créer un Nouvel Utilisateur"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Nom d'utilisateur *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    required
                    disabled={!!editingUser}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required={!editingUser}
                    placeholder={editingUser ? "Laisser vide pour ne pas changer" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Ex: Production, Maintenance..."
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="role">Rôle *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle">
                      {formData.role}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {getRoleLabel(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="submit" 
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingUser ? "Modifier" : "Créer"}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingUser(null);
                  }}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs Existants ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user: User) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-green-800">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">@{user.username}</div>
                    {user.department && (
                      <div className="text-xs text-gray-500">{user.department}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                  
                  {!user.isActive && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Inactif
                    </span>
                  )}
                  
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => deleteUserMutation.mutate(user.id)}
                      disabled={deleteUserMutation.isPending}
                      className="p-1 text-red-500 hover:text-red-700 focus:outline-none disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
