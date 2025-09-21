import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Définition des rôles disponibles
export const USER_ROLES = ["ADMIN", "SUPERVISEUR", "CHEF_MAINTENANCE", "AGENT_SECURITE", "OPERATEUR"] as const;
export type UserRole = typeof USER_ROLES[number];

// Déclaration de la table users
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").unique(),
  role: text("role", { enum: USER_ROLES }).notNull().$type<UserRole>(),
  department: text("department"),
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  lastLoginAt: text("last_login_at"),
  createdAt: text("created_at").default('CURRENT_TIMESTAMP'),
  updatedAt: text("updated_at").default('CURRENT_TIMESTAMP'),
  createdBy: integer("created_by").references((): any => users.$inferSelect, { onDelete: 'set null' }),
});

export const productionActivities = sqliteTable("production_activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  responsible: text("responsible").notNull(),
  status: text("status").notNull(), // 'Planifiée', 'En cours', 'Terminée'
  date: text("date").notNull(),
  createdAt: text("created_at").default('CURRENT_TIMESTAMP'),
});

export const maintenanceSchedules = sqliteTable("maintenance_schedules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  machine: text("machine").notNull(),
  type: text("type").notNull(), // 'Préventive', 'Corrective', 'Urgente'
  description: text("description").notNull(),
  scheduledDate: text("scheduled_date").notNull(),
  status: text("status").notNull().default('Planifiée'),
  createdAt: text("created_at").default('CURRENT_TIMESTAMP'),
});

export const securityAlerts = sqliteTable("security_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  zone: text("zone").notNull(),
  message: text("message").notNull(),
  severity: text("severity").notNull(), // 'low', 'medium', 'high'
  resolved: integer("resolved", { mode: 'boolean' }).default(false),
  createdAt: text("created_at").default('CURRENT_TIMESTAMP'),
});

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'info', 'warning', 'error', 'success'
  read: integer("read", { mode: 'boolean' }).default(false),
  createdAt: text("created_at").default('CURRENT_TIMESTAMP'),
});

// Schéma de validation pour la création d'utilisateur
export const insertUserSchema = z.object({
  username: z.string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  name: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z.string().email("Format d'email invalide").optional(),
  role: z.enum([...USER_ROLES] as const, {
    required_error: "Le rôle est requis",
    invalid_type_error: `Le rôle doit être l'un des suivants: ${USER_ROLES.join(', ')}`
  }),
  department: z.string().optional(),
  isActive: z.boolean().default(true),
  lastLoginAt: z.string().datetime().optional(),
  createdBy: z.number().int().positive().optional()
});

export const insertProductionActivitySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  responsible: z.string().min(1, "Le responsable est requis"),
  status: z.enum(["Planifiée", "En cours", "Terminée"]).default("Planifiée"),
  date: z.string().datetime({ message: "Date invalide" })
});

export const insertMaintenanceScheduleSchema = z.object({
  machine: z.string().min(1, "Le nom de la machine est requis"),
  type: z.enum(["Préventive", "Corrective", "Urgente"], {
    required_error: "Le type de maintenance est requis",
    invalid_type_error: "Le type doit être 'Préventive', 'Corrective' ou 'Urgente'"
  }),
  description: z.string().min(1, "La description est requise"),
  scheduledDate: z.string().refine((date) => {
    // Accepter les formats ISO datetime et YYYY-MM-DD
    const isoDate = new Date(date);
    return !isNaN(isoDate.getTime());
  }, { message: "Date planifiée invalide" }),
  status: z.string().default("Planifiée")
});

export const insertSecurityAlertSchema = createInsertSchema(securityAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Types pour les données utilisateur
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Types pour les activités de production
export type ProductionActivity = typeof productionActivities.$inferSelect;
export type InsertProductionActivity = z.infer<typeof insertProductionActivitySchema>;

// Types pour les plannings de maintenance
export type MaintenanceSchedule = typeof maintenanceSchedules.$inferSelect;
export type InsertMaintenanceSchedule = z.infer<typeof insertMaintenanceScheduleSchema>;

// Types pour les alertes de sécurité
export type SecurityAlert = typeof securityAlerts.$inferSelect;
export type InsertSecurityAlert = z.infer<typeof insertSecurityAlertSchema>;

// Types pour les notifications
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
