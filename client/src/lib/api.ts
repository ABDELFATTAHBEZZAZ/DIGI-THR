import { apiRequest } from "./queryClient.js";

export interface MaintenanceSchedule {
  id: number;
  machine: string;
  type: string;
  description: string;
  scheduledDate: string;  // Modifié de scheduled_date à scheduledDate
  status: string;
  createdAt: string;      // Modifié de created_at à createdAt
  updatedAt: string;      // Modifié de updated_at à updatedAt
}

export const maintenanceApi = {
  // Récupérer tous les plannings de maintenance
  getAll: async (): Promise<MaintenanceSchedule[]> => {
    try {
      const response = await apiRequest('GET', '/api/maintenance');
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des plannings de maintenance:', error);
      throw error;
    }
  },

  // Créer un nouveau planning de maintenance
  create: async (data: Omit<MaintenanceSchedule, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceSchedule> => {
    try {
      const response = await apiRequest('POST', '/api/maintenance', data);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du planning de maintenance:', error);
      throw error;
    }
  },

  // Mettre à jour un planning de maintenance
  update: async (id: number, data: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule> => {
    try {
      const response = await apiRequest('PUT', `/api/maintenance/${id}`, data);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du planning de maintenance:', error);
      throw error;
    }
  },

  // Supprimer un planning de maintenance
  delete: async (id: number): Promise<void> => {
    try {
      await apiRequest('DELETE', `/api/maintenance/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du planning de maintenance:', error);
      throw error;
    }
  },

  // Récupérer une maintenance par son ID
  getById: async (id: number): Promise<MaintenanceSchedule> => {
    try {
      const response = await apiRequest('GET', `/api/maintenance/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de la maintenance:', error);
      throw error;
    }
  }
};

export default {
  maintenance: maintenanceApi
};
