const { createInsertSchema } = require("drizzle-zod");
const { z } = require("zod");

// Définition des rôles disponibles
const USER_ROLES = ["ADMIN", "SUPERVISEUR", "RESPONSABLE_MAINTENANCE", "AGENT_SECURITE"];

// Schéma pour les utilisateurs
const insertUserSchema = z.object({
  username: z.string().min(3, "Nom d'utilisateur minimum 3 caractères"),
  password: z.string().min(6, "Mot de passe minimum 6 caractères"),
  role: z.enum(["ADMIN", "RESPONSABLE_MAINTENANCE", "AGENT_SECURITE"]),
  name: z.string().min(2, "Nom requis"),
  department: z.string().optional(),
  isActive: z.boolean().default(true)
});

// Schéma pour les activités de production
const insertProductionActivitySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  responsible: z.string().min(1, "Le responsable est requis"),
  status: z.enum(["Planifiée", "En cours", "Terminée"]).default("Planifiée"),
  date: z.string().datetime({ message: "Date invalide" })
});

// Schéma pour les plannings de maintenance
const insertMaintenanceScheduleSchema = z.object({
  machine: z.string().min(1, "Le nom de la machine est requis"),
  type: z.enum(["Préventive", "Corrective", "Urgente"]),
  description: z.string().min(1, "La description est requise"),
  scheduledDate: z.string().refine((date) => {
    // Accepter les formats ISO datetime et YYYY-MM-DD
    const isoDate = new Date(date);
    return !isNaN(isoDate.getTime());
  }, { message: "Date planifiée invalide" }),
  status: z.string().default("Planifiée")
});

// Schéma pour les alertes de sécurité
const insertSecurityAlertSchema = z.object({
  type: z.string().min(1, "Le type d'alerte est requis"),
  zone: z.string().min(1, "La zone est requise"),
  message: z.string().min(1, "Le message est requis"),
  severity: z.enum(["low", "medium", "high"]),
  resolved: z.boolean().default(false)
});

// Schéma pour les notifications
const insertNotificationSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  message: z.string().min(1, "Le message est requis"),
  type: z.enum(["info", "warning", "error", "success"]),
  read: z.boolean().default(false)
});

// Schéma pour la création d'utilisateur
const createUserSchema = z.object({
  username: z.string().min(3, "Nom d'utilisateur minimum 3 caractères"),
  password: z.string().min(6, "Mot de passe minimum 6 caractères"),
  name: z.string().min(2, "Nom requis"),
  role: z.enum(["ADMIN", "RESPONSABLE_MAINTENANCE", "AGENT_SECURITE"]),
  department: z.string().optional()
});

module.exports = {
  insertUserSchema,
  insertProductionActivitySchema,
  insertMaintenanceScheduleSchema,
  insertSecurityAlertSchema,
  insertNotificationSchema,
  createUserSchema
};
