import { 
  users, 
  productionActivities, 
  maintenanceSchedules, 
  securityAlerts, 
  notifications,
  type User,
  type InsertUser,
  type ProductionActivity,
  type InsertProductionActivity,
  type MaintenanceSchedule,
  type InsertMaintenanceSchedule,
  type SecurityAlert,
  type InsertSecurityAlert,
  type Notification as AppNotification,
  type InsertNotification as AppInsertNotification,
  USER_ROLES
} from "../shared/schema.js";
import { db } from "./db.js";
import { eq } from "drizzle-orm";

interface RunResult {
  rowsAffected: number;
  lastInsertRowid: number;
}

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Production Activities
  getProductionActivities(): Promise<ProductionActivity[]>;
  getProductionActivity(id: number): Promise<ProductionActivity | undefined>;
  createProductionActivity(activity: InsertProductionActivity): Promise<ProductionActivity>;
  updateProductionActivity(id: number, activity: Partial<InsertProductionActivity>): Promise<ProductionActivity | undefined>;
  deleteProductionActivity(id: number): Promise<boolean>;
  
  // Maintenance Schedules
  getMaintenanceSchedules(): Promise<MaintenanceSchedule[]>;
  getMaintenanceSchedule(id: number): Promise<MaintenanceSchedule | undefined>;
  createMaintenanceSchedule(schedule: InsertMaintenanceSchedule): Promise<MaintenanceSchedule>;
  updateMaintenanceSchedule(id: number, schedule: Partial<InsertMaintenanceSchedule>): Promise<MaintenanceSchedule | undefined>;
  deleteMaintenanceSchedule(id: number): Promise<boolean>;
  
  // Security Alerts
  getSecurityAlerts(): Promise<SecurityAlert[]>;
  getSecurityAlert(id: number): Promise<SecurityAlert | undefined>;
  createSecurityAlert(alert: InsertSecurityAlert): Promise<SecurityAlert>;
  updateSecurityAlert(id: number, alert: Partial<InsertSecurityAlert>): Promise<SecurityAlert | undefined>;
  deleteSecurityAlert(id: number): Promise<boolean>;
  
  // Notifications
  getNotifications(): Promise<AppNotification[]>;
  getNotification(id: number): Promise<AppNotification | undefined>;
  createNotification(notification: AppInsertNotification): Promise<AppNotification>;
  updateNotification(id: number, notification: Partial<AppInsertNotification>): Promise<AppNotification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private productionActivities: Map<number, ProductionActivity>;
  private maintenanceSchedules: Map<number, MaintenanceSchedule>;
  private securityAlerts: Map<number, SecurityAlert>;
  private notifications: Map<number, AppNotification>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.productionActivities = new Map();
    this.maintenanceSchedules = new Map();
    this.securityAlerts = new Map();
    this.notifications = new Map();
    this.currentId = 1;
    
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users with admin account
    const sampleUsers: User[] = [
      {
        id: 1,
        username: "admin",
        password: "admin123",
        name: "Administrateur Système",
        email: "admin@ocp.ma",
        role: "ADMIN",
        department: "IT",
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: null
      },
      {
        id: 2,
        username: "abdelfattah",
        password: "abdelfattah ocp",
        name: "Abdelfattah",
        email: "abdelfattah@ocp.ma",
        role: "SUPERVISEUR",
        department: "Supervision",
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 1
      },
      {
        id: 3,
        username: "securite",
        password: "securite123",
        name: "Agent de Sécurité",
        email: "securite@ocp.ma",
        role: "AGENT_SECURITE",
        department: "Sécurité",
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 1
      }
    ];

    // Sample production activities
    const sampleActivities: ProductionActivity[] = [
      {
        id: 1,
        name: "Chargement convoyeur 3",
        responsible: "Ahmed Benali",
        status: "En cours",
        date: "2025-01-15T08:00:00",
        createdAt: "2025-01-15T08:00:00"
      },
      {
        id: 2,
        name: "Extraction zone B",
        responsible: "Fatima Zahra",
        status: "Planifiée",
        date: "2025-01-16T09:00:00",
        createdAt: "2025-01-16T09:00:00"
      }
    ];

    // Sample maintenance schedules
    const sampleMaintenance: MaintenanceSchedule[] = [
      {
        id: 1,
        machine: "Excavatrice CAT 320",
        type: "Préventive",
        description: "Révision générale",
        scheduledDate: "2025-01-15T14:00:00",
        status: "Planifiée",
        createdAt: "2025-01-15T14:00:00"
      },
      {
        id: 2,
        machine: "Dumper 793",
        type: "Corrective",
        description: "Changement filtre",
        scheduledDate: "2025-01-16T09:00:00",
        status: "Planifiée",
        createdAt: "2025-01-16T09:00:00"
      }
    ];

    // Sample security alerts
    const sampleAlerts: SecurityAlert[] = [
      {
        id: 1,
        type: "Risque élevé",
        zone: "Zone 2",
        message: "Travaux à haut risque détectés",
        severity: "high",
        resolved: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        type: "Équipement non conforme",
        zone: "Zone 1",
        message: "Casque manquant détecté",
        severity: "medium",
        resolved: false,
        createdAt: new Date().toISOString()
      }
    ];

    // Sample notifications
    const sampleNotifications: AppNotification[] = [
      {
        id: 1,
        title: "Alerte Sécurité",
        message: "Travaux à haut risque détectés dans la zone 2",
        type: "error",
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "Maintenance Programmée",
        message: "Révision excavatrice CAT 320 prévue à 14:00",
        type: "warning",
        read: false,
        createdAt: new Date().toISOString()
      }
    ];

    // Store sample data
    sampleUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    sampleActivities.forEach(activity => {
      this.productionActivities.set(activity.id, activity);
    });

    sampleMaintenance.forEach(schedule => {
      this.maintenanceSchedules.set(schedule.id, schedule);
    });

    sampleAlerts.forEach(alert => {
      this.securityAlerts.set(alert.id, alert);
    });

    sampleNotifications.forEach(notification => {
      this.notifications.set(notification.id, notification);
    });

    this.currentId = 10;
  }

  // Users methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    // Valider les champs obligatoires
    if (!user.username || !user.password || !user.name) {
      throw new Error('Tous les champs obligatoires doivent être renseignés');
    }

    // Créer l'utilisateur avec des valeurs par défaut pour les champs optionnels
    const newUser: User = {
      id: this.currentId++,
      username: user.username,
      password: user.password,
      name: user.name,
      email: user.email || null,
      role: user.role || 'AGENT_SECURITE',
      department: user.department || null,
      isActive: user.isActive !== undefined ? user.isActive : true,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.createdBy || null
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      ...userData, 
      updatedAt: new Date().toISOString() 
    } as User;
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Production Activity methods
  async getProductionActivities(): Promise<ProductionActivity[]> {
    return Array.from(this.productionActivities.values());
  }

  async getProductionActivity(id: number): Promise<ProductionActivity | undefined> {
    return this.productionActivities.get(id);
  }

  async createProductionActivity(activity: InsertProductionActivity): Promise<ProductionActivity> {
    const id = this.currentId++;
    const newActivity: ProductionActivity = { 
      ...activity, 
      id,
      createdAt: new Date().toISOString()
    };
    this.productionActivities.set(id, newActivity);
    return newActivity;
  }

  async updateProductionActivity(id: number, activity: Partial<InsertProductionActivity>): Promise<ProductionActivity | undefined> {
    const existing = this.productionActivities.get(id);
    if (!existing) return undefined;
    
    const updated: ProductionActivity = { ...existing, ...activity };
    this.productionActivities.set(id, updated);
    return updated;
  }

  async deleteProductionActivity(id: number): Promise<boolean> {
    return this.productionActivities.delete(id);
  }

  // Maintenance Schedule methods
  async getMaintenanceSchedules(): Promise<MaintenanceSchedule[]> {
    return Array.from(this.maintenanceSchedules.values());
  }

  async getMaintenanceSchedule(id: number): Promise<MaintenanceSchedule | undefined> {
    return this.maintenanceSchedules.get(id);
  }

  async createMaintenanceSchedule(schedule: InsertMaintenanceSchedule): Promise<MaintenanceSchedule> {
    const id = this.currentId++;
    const newSchedule: MaintenanceSchedule = { 
      ...schedule, 
      id,
      status: schedule.status || 'Planifiée',
      createdAt: new Date().toISOString()
    };
    this.maintenanceSchedules.set(id, newSchedule);
    return newSchedule;
  }

  async updateMaintenanceSchedule(id: number, schedule: Partial<InsertMaintenanceSchedule>): Promise<MaintenanceSchedule | undefined> {
    const existing = this.maintenanceSchedules.get(id);
    if (!existing) return undefined;
    
    const updated: MaintenanceSchedule = { ...existing, ...schedule };
    this.maintenanceSchedules.set(id, updated);
    return updated;
  }

  async deleteMaintenanceSchedule(id: number): Promise<boolean> {
    return this.maintenanceSchedules.delete(id);
  }

  // Security Alert methods
  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    return Array.from(this.securityAlerts.values());
  }

  async getSecurityAlert(id: number): Promise<SecurityAlert | undefined> {
    return this.securityAlerts.get(id);
  }

  async createSecurityAlert(alert: InsertSecurityAlert): Promise<SecurityAlert> {
    const id = this.currentId++;
    const newAlert: SecurityAlert = { 
      id,
      type: alert.type,
      zone: alert.zone,
      message: alert.message,
      severity: alert.severity,
      resolved: false, // Par défaut non résolu
      createdAt: new Date().toISOString()
    };
    this.securityAlerts.set(id, newAlert);
    return newAlert;
  }

  async updateSecurityAlert(id: number, alert: Partial<InsertSecurityAlert>): Promise<SecurityAlert | undefined> {
    const existing = this.securityAlerts.get(id);
    if (!existing) return undefined;
    
    const updated: SecurityAlert = { ...existing, ...alert };
    this.securityAlerts.set(id, updated);
    return updated;
  }

  async deleteSecurityAlert(id: number): Promise<boolean> {
    return this.securityAlerts.delete(id);
  }

  // Notification methods
  async getNotifications(): Promise<AppNotification[]> {
    return Array.from(this.notifications.values());
  }

  async getNotification(id: number): Promise<AppNotification | undefined> {
    return this.notifications.get(id);
  }

  async createNotification(notification: AppInsertNotification): Promise<AppNotification> {
    const id = this.currentId++;
    const newNotification: AppNotification = { 
      ...notification, 
      id,
      read: notification.read || false,
      createdAt: new Date().toISOString()
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async updateNotification(id: number, notification: Partial<AppInsertNotification>): Promise<AppNotification | undefined> {
    const existing = this.notifications.get(id);
    if (!existing) return undefined;
    
    const updated: AppNotification = { ...existing, ...notification };
    this.notifications.set(id, updated);
    return updated;
  }

  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  // Users methods
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // S'assurer que les champs requis sont présents
    if (!insertUser.username || !insertUser.password || !insertUser.name) {
      throw new Error('Tous les champs obligatoires doivent être renseignés');
    }

    // Créer un objet avec les valeurs par défaut et les valeurs fournies
    const userData = {
      username: insertUser.username,
      password: insertUser.password,
      name: insertUser.name,
      role: insertUser.role || 'AGENT_SECURITE',
      isActive: insertUser.isActive !== undefined ? insertUser.isActive : true,
      department: insertUser.department || null,
      createdBy: insertUser.createdBy || null
    };
    
    try {
      const inserted = await db
        .insert(users)
        .values(userData)
        .returning() as unknown;
      const user = Array.isArray(inserted) ? inserted[0] as User : undefined;
      if (!user) throw new Error('Insertion utilisateur non supportée');
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Erreur lors de la création de l\'utilisateur');
    }
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const { role, department, ...rest } = userData;
    
    // Vérifier si le rôle est valide s'il est fourni
    if (role && !(USER_ROLES as readonly string[]).includes(role)) {
      throw new Error('Rôle utilisateur invalide');
    }
    
    // Créer un objet avec uniquement les champs définis
    const updateData: Record<string, any> = {};
    
    // Ajouter les champs mis à jour s'ils sont définis
    if (role !== undefined) updateData.role = role;
    if (department !== undefined) updateData.department = department || null;
    
    // Ajouter les autres champs mis à jour
    if (rest.username !== undefined) updateData.username = rest.username;
    if (rest.password !== undefined) updateData.password = rest.password;
    if (rest.name !== undefined) updateData.name = rest.name;
    if (rest.isActive !== undefined) updateData.isActive = rest.isActive;
    
    // Vérifier s'il y a des champs à mettre à jour
    if (Object.keys(updateData).length === 0) {
      return this.getUser(id);
    }
    
    try {
      const rows = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning() as unknown;
      const updated = Array.isArray(rows) ? rows[0] as User : undefined;
      return updated || undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(users)
        .where(eq(users.id, id));
      return (result as unknown as RunResult).rowsAffected > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Erreur lors de la suppression de l\'utilisateur');
    }
  }

  // Production Activity methods
  async getProductionActivities(): Promise<ProductionActivity[]> {
    return await db.select().from(productionActivities);
  }

  async getProductionActivity(id: number): Promise<ProductionActivity | undefined> {
    const [activity] = await db.select().from(productionActivities).where(eq(productionActivities.id, id));
    return activity || undefined;
  }

  async createProductionActivity(activity: InsertProductionActivity): Promise<ProductionActivity> {
    const rows = await db
      .insert(productionActivities)
      .values(activity)
      .returning() as unknown;
    const newActivity = Array.isArray(rows) ? rows[0] as ProductionActivity : undefined;
    if (!newActivity) throw new Error('Insertion activité non supportée');
    return newActivity;
  }

  async updateProductionActivity(id: number, activity: Partial<InsertProductionActivity>): Promise<ProductionActivity | undefined> {
    const rows = await db
      .update(productionActivities)
      .set(activity)
      .where(eq(productionActivities.id, id))
      .returning() as unknown;
    const updated = Array.isArray(rows) ? rows[0] as ProductionActivity : undefined;
    return updated || undefined;
  }

  async deleteProductionActivity(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(productionActivities)
        .where(eq(productionActivities.id, id));
      return (result as unknown as RunResult).rowsAffected > 0;
    } catch (error) {
      console.error('Error deleting production activity:', error);
      throw new Error('Erreur lors de la suppression de l\'activité de production');
    }
  }

  // Maintenance Schedule methods
  async getMaintenanceSchedules(): Promise<MaintenanceSchedule[]> {
    return await db.select().from(maintenanceSchedules);
  }

  async getMaintenanceSchedule(id: number): Promise<MaintenanceSchedule | undefined> {
    const [schedule] = await db.select().from(maintenanceSchedules).where(eq(maintenanceSchedules.id, id));
    return schedule || undefined;
  }

  async createMaintenanceSchedule(schedule: InsertMaintenanceSchedule): Promise<MaintenanceSchedule> {
    const rows = await db
      .insert(maintenanceSchedules)
      .values(schedule)
      .returning() as unknown;
    const newSchedule = Array.isArray(rows) ? rows[0] as MaintenanceSchedule : undefined;
    if (!newSchedule) throw new Error('Insertion planning non supportée');
    return newSchedule;
  }

  async updateMaintenanceSchedule(id: number, schedule: Partial<InsertMaintenanceSchedule>): Promise<MaintenanceSchedule | undefined> {
    const rows = await db
      .update(maintenanceSchedules)
      .set(schedule)
      .where(eq(maintenanceSchedules.id, id))
      .returning() as unknown;
    const updated = Array.isArray(rows) ? rows[0] as MaintenanceSchedule : undefined;
    return updated || undefined;
  }

  async deleteMaintenanceSchedule(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(maintenanceSchedules)
        .where(eq(maintenanceSchedules.id, id));
      return (result as unknown as RunResult).rowsAffected > 0;
    } catch (error) {
      console.error('Error deleting maintenance schedule:', error);
      throw new Error('Erreur lors de la suppression du planning de maintenance');
    }
  }

  // Security Alert methods
  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    return await db.select().from(securityAlerts);
  }

  async getSecurityAlert(id: number): Promise<SecurityAlert | undefined> {
    const [alert] = await db.select().from(securityAlerts).where(eq(securityAlerts.id, id));
    return alert || undefined;
  }

  async createSecurityAlert(alert: InsertSecurityAlert): Promise<SecurityAlert> {
    const rows = await db
      .insert(securityAlerts)
      .values(alert)
      .returning() as unknown;
    const newAlert = Array.isArray(rows) ? rows[0] as SecurityAlert : undefined;
    if (!newAlert) throw new Error('Insertion alerte non supportée');
    return newAlert;
  }

  async updateSecurityAlert(id: number, alert: Partial<InsertSecurityAlert>): Promise<SecurityAlert | undefined> {
    const rows = await db
      .update(securityAlerts)
      .set(alert)
      .where(eq(securityAlerts.id, id))
      .returning() as unknown;
    const updated = Array.isArray(rows) ? rows[0] as SecurityAlert : undefined;
    return updated || undefined;
  }

  async deleteSecurityAlert(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(securityAlerts)
        .where(eq(securityAlerts.id, id));
      return (result as unknown as RunResult).rowsAffected > 0;
    } catch (error) {
      console.error('Error deleting security alert:', error);
      throw new Error('Erreur lors de la suppression de l\'alerte de sécurité');
    }
  }

  // Notification methods
  async getNotifications(): Promise<AppNotification[]> {
    return await db.select().from(notifications) as unknown as AppNotification[];
  }

  async getNotification(id: number): Promise<AppNotification | undefined> {
    const rows = await db.select().from(notifications).where(eq(notifications.id, id));
    const notification = Array.isArray(rows) ? rows[0] as AppNotification : undefined;
    return notification || undefined;
  }

  async createNotification(notification: AppInsertNotification): Promise<AppNotification> {
    const rows = await db
      .insert(notifications)
      .values(notification)
      .returning() as unknown;
    const newNotification = Array.isArray(rows) ? rows[0] as AppNotification : undefined;
    if (!newNotification) throw new Error('Insertion notification non supportée');
    return newNotification;
  }

  async updateNotification(id: number, notification: Partial<AppInsertNotification>): Promise<AppNotification | undefined> {
    const rows = await db
      .update(notifications)
      .set(notification)
      .where(eq(notifications.id, id))
      .returning() as unknown;
    const updated = Array.isArray(rows) ? rows[0] as AppNotification : undefined;
    return updated || undefined;
  }

  async deleteNotification(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(notifications)
        .where(eq(notifications.id, id));
      return (result as unknown as RunResult).rowsAffected > 0;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Erreur lors de la suppression de la notification');
    }
  }
}

// Utiliser MemStorage pour débloquer rapidement l'appli (admin/admin123 préconfiguré)
export const storage = new MemStorage();
