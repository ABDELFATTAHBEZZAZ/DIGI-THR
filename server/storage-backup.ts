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
  type Notification,
  type InsertNotification
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
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
  getNotifications(): Promise<Notification[]>;
  getNotification(id: number): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, notification: Partial<InsertNotification>): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private productionActivities: Map<number, ProductionActivity>;
  private maintenanceSchedules: Map<number, MaintenanceSchedule>;
  private securityAlerts: Map<number, SecurityAlert>;
  private notifications: Map<number, Notification>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.productionActivities = new Map();
    this.maintenanceSchedules = new Map();
    this.securityAlerts = new Map();
    this.notifications = new Map();
    this.currentId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users with admin account
    const sampleUsers: User[] = [
      {
        id: 1,
        username: "admin",
        password: "admin123",
        role: "ADMIN",
        name: "Administrateur Système",
        department: "IT",
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: null
      },
      {
        id: 2,
        username: "abdelfattah",
        password: "abdelfattah ocp",
        role: "SUPERVISEUR",
        name: "Abdelfattah",
        department: "Supervision",
        isActive: true,
        createdAt: new Date().toISOString(),
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
    const sampleNotifications: Notification[] = [
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

    this.currentId = 10; // Start IDs after sample data
  }

  // Users methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.currentId++,
      username: user.username,
      password: user.password,
      role: user.role,
      name: user.name,
      department: user.department,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: null
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
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
      ...alert, 
      id,
      resolved: alert.resolved || false,
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
  async getNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values());
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.currentId++;
    const newNotification: Notification = { 
      ...notification, 
      id,
      read: notification.read || false,
      createdAt: new Date().toISOString()
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async updateNotification(id: number, notification: Partial<InsertNotification>): Promise<Notification | undefined> {
    const existing = this.notifications.get(id);
    if (!existing) return undefined;
    
    const updated: Notification = { ...existing, ...notification };
    this.notifications.set(id, updated);
    return updated;
  }

  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
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
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getProductionActivities(): Promise<ProductionActivity[]> {
    return await db.select().from(productionActivities);
  }

  async getProductionActivity(id: number): Promise<ProductionActivity | undefined> {
    const [activity] = await db.select().from(productionActivities).where(eq(productionActivities.id, id));
    return activity || undefined;
  }

  async createProductionActivity(activity: InsertProductionActivity): Promise<ProductionActivity> {
    const [newActivity] = await db
      .insert(productionActivities)
      .values(activity)
      .returning();
    return newActivity;
  }

  async updateProductionActivity(id: number, activity: Partial<InsertProductionActivity>): Promise<ProductionActivity | undefined> {
    const [updated] = await db
      .update(productionActivities)
      .set(activity)
      .where(eq(productionActivities.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProductionActivity(id: number): Promise<boolean> {
    const result = await db
      .delete(productionActivities)
      .where(eq(productionActivities.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getMaintenanceSchedules(): Promise<MaintenanceSchedule[]> {
    return await db.select().from(maintenanceSchedules);
  }

  async getMaintenanceSchedule(id: number): Promise<MaintenanceSchedule | undefined> {
    const [schedule] = await db.select().from(maintenanceSchedules).where(eq(maintenanceSchedules.id, id));
    return schedule || undefined;
  }

  async createMaintenanceSchedule(schedule: InsertMaintenanceSchedule): Promise<MaintenanceSchedule> {
    const [newSchedule] = await db
      .insert(maintenanceSchedules)
      .values(schedule)
      .returning();
    return newSchedule;
  }

  async updateMaintenanceSchedule(id: number, schedule: Partial<InsertMaintenanceSchedule>): Promise<MaintenanceSchedule | undefined> {
    const [updated] = await db
      .update(maintenanceSchedules)
      .set(schedule)
      .where(eq(maintenanceSchedules.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMaintenanceSchedule(id: number): Promise<boolean> {
    const result = await db
      .delete(maintenanceSchedules)
      .where(eq(maintenanceSchedules.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    return await db.select().from(securityAlerts);
  }

  async getSecurityAlert(id: number): Promise<SecurityAlert | undefined> {
    const [alert] = await db.select().from(securityAlerts).where(eq(securityAlerts.id, id));
    return alert || undefined;
  }

  async createSecurityAlert(alert: InsertSecurityAlert): Promise<SecurityAlert> {
    const [newAlert] = await db
      .insert(securityAlerts)
      .values(alert)
      .returning();
    return newAlert;
  }

  async updateSecurityAlert(id: number, alert: Partial<InsertSecurityAlert>): Promise<SecurityAlert | undefined> {
    const [updated] = await db
      .update(securityAlerts)
      .set(alert)
      .where(eq(securityAlerts.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteSecurityAlert(id: number): Promise<boolean> {
    const result = await db
      .delete(securityAlerts)
      .where(eq(securityAlerts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getNotifications(): Promise<Notification[]> {
    return await db.select().from(notifications);
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification || undefined;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async updateNotification(id: number, notification: Partial<InsertNotification>): Promise<Notification | undefined> {
    const [updated] = await db
      .update(notifications)
      .set(notification)
      .where(eq(notifications.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteNotification(id: number): Promise<boolean> {
    const result = await db
      .delete(notifications)
      .where(eq(notifications.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new MemStorage();
