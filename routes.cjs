const express = require('express');
const { createServer } = require('http');
const { storage } = require('./storage.cjs');
const { 
  insertProductionActivitySchema, 
  insertMaintenanceScheduleSchema, 
  insertSecurityAlertSchema, 
  insertNotificationSchema, 
  createUserSchema 
} = require('./shared/schema.cjs');

function registerRoutes(app) {
  // Authentication route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      if (!user.isActive) {
        return res.status(401).json({ error: "Account is disabled" });
      }
      
      // Return user data without password
      const { password: _, ...userData } = user;
      res.json(userData);
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Production activities routes
  app.get("/api/production", async (req, res) => {
    try {
      const activities = await storage.getProductionActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching production activities:", error);
      res.status(500).json({ error: "Failed to fetch production activities" });
    }
  });

  app.post("/api/production", async (req, res) => {
    try {
      const validatedData = insertProductionActivitySchema.parse(req.body);
      const activity = await storage.createProductionActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating production activity:", error);
      res.status(400).json({ error: error.message || "Failed to create production activity" });
    }
  });

  // Add other routes as needed...

  // Create HTTP server
  const server = createServer(app);
  return server;
}

module.exports = { registerRoutes };
