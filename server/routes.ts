import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductionActivitySchema, insertMaintenanceScheduleSchema, insertSecurityAlertSchema, insertNotificationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Production Activities routes
  app.get("/api/production", async (req, res) => {
    try {
      const activities = await storage.getProductionActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch production activities" });
    }
  });

  app.get("/api/production/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const activity = await storage.getProductionActivity(id);
      if (!activity) {
        return res.status(404).json({ error: "Production activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch production activity" });
    }
  });

  app.post("/api/production", async (req, res) => {
    try {
      const validatedData = insertProductionActivitySchema.parse(req.body);
      const activity = await storage.createProductionActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ error: "Invalid production activity data" });
    }
  });

  app.put("/api/production/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductionActivitySchema.partial().parse(req.body);
      const activity = await storage.updateProductionActivity(id, validatedData);
      if (!activity) {
        return res.status(404).json({ error: "Production activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(400).json({ error: "Invalid production activity data" });
    }
  });

  app.delete("/api/production/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProductionActivity(id);
      if (!success) {
        return res.status(404).json({ error: "Production activity not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete production activity" });
    }
  });

  // Maintenance Schedules routes
  app.get("/api/maintenance", async (req, res) => {
    try {
      const schedules = await storage.getMaintenanceSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance schedules" });
    }
  });

  app.post("/api/maintenance", async (req, res) => {
    try {
      const validatedData = insertMaintenanceScheduleSchema.parse(req.body);
      const schedule = await storage.createMaintenanceSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error) {
      res.status(400).json({ error: "Invalid maintenance schedule data" });
    }
  });

  app.put("/api/maintenance/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMaintenanceScheduleSchema.partial().parse(req.body);
      const schedule = await storage.updateMaintenanceSchedule(id, validatedData);
      if (!schedule) {
        return res.status(404).json({ error: "Maintenance schedule not found" });
      }
      res.json(schedule);
    } catch (error) {
      res.status(400).json({ error: "Invalid maintenance schedule data" });
    }
  });

  app.delete("/api/maintenance/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMaintenanceSchedule(id);
      if (!success) {
        return res.status(404).json({ error: "Maintenance schedule not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete maintenance schedule" });
    }
  });

  // Security Alerts routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getSecurityAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch security alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertSecurityAlertSchema.parse(req.body);
      const alert = await storage.createSecurityAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid security alert data" });
    }
  });

  app.put("/api/alerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSecurityAlertSchema.partial().parse(req.body);
      const alert = await storage.updateSecurityAlert(id, validatedData);
      if (!alert) {
        return res.status(404).json({ error: "Security alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid security alert data" });
    }
  });

  app.delete("/api/alerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSecurityAlert(id);
      if (!success) {
        return res.status(404).json({ error: "Security alert not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete security alert" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await storage.getNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ error: "Invalid notification data" });
    }
  });

  app.put("/api/notifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNotificationSchema.partial().parse(req.body);
      const notification = await storage.updateNotification(id, validatedData);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(400).json({ error: "Invalid notification data" });
    }
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNotification(id);
      if (!success) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const activities = await storage.getProductionActivities();
      const alerts = await storage.getSecurityAlerts();
      const maintenance = await storage.getMaintenanceSchedules();
      
      const stats = {
        productionActive: activities.filter(a => a.status === "En cours").length,
        maintenanceHours: maintenance.length * 4, // Simulate hours
        dieselUsage: 15247 + Math.floor(Math.random() * 1000),
        securityAlerts: alerts.filter(a => !a.resolved).length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
