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

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
    // Sample production activities
    const sampleActivities: ProductionActivity[] = [
      {
        id: 1,
        name: "Chargement convoyeur 3",
        responsible: "Ahmed Benali",
        status: "En cours",
        date: new Date("2025-01-15T08:00:00"),
        createdAt: new Date()
      },
      {
        id: 2,
        name: "Extraction zone B",
        responsible: "Fatima Zahra",
        status: "Planifiée",
        date: new Date("2025-01-16T09:00:00"),
        createdAt: new Date()
      }
    ];

    // Sample maintenance schedules
    const sampleMaintenance: MaintenanceSchedule[] = [
      {
        id: 1,
        machine: "Excavatrice CAT 320",
        type: "Préventive",
        description: "Révision générale",
        scheduledDate: new Date("2025-01-15T14:00:00"),
        status: "Planifiée",
        createdAt: new Date()
      },
      {
        id: 2,
        machine: "Dumper 793",
        type: "Corrective",
        description: "Changement filtre",
        scheduledDate: new Date("2025-01-16T09:00:00"),
        status: "Planifiée",
        createdAt: new Date()
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
        createdAt: new Date()
      },
      {
        id: 2,
        type: "Équipement non conforme",
        zone: "Zone 1",
        message: "Casque manquant détecté",
        severity: "medium",
        resolved: false,
        createdAt: new Date()
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
        createdAt: new Date()
      },
      {
        id: 2,
        title: "Maintenance Programmée",
        message: "Révision excavatrice CAT 320 prévue à 14:00",
        type: "warning",
        read: false,
        createdAt: new Date()
      }
    ];

    // Initialize maps
    sampleActivities.forEach(activity => this.productionActivities.set(activity.id, activity));
    sampleMaintenance.forEach(maintenance => this.maintenanceSchedules.set(maintenance.id, maintenance));
    sampleAlerts.forEach(alert => this.securityAlerts.set(alert.id, alert));
    sampleNotifications.forEach(notification => this.notifications.set(notification.id, notification));
    
    this.currentId = 100; // Start IDs from 100 to avoid conflicts
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
      createdAt: new Date()
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
      createdAt: new Date()
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
      createdAt: new Date()
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
      createdAt: new Date()
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

export const storage = new MemStorage();
