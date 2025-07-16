import { db } from "./db";
import { 
  users, 
  productionActivities, 
  maintenanceSchedules, 
  securityAlerts, 
  notifications
} from "@shared/schema";

export async function seedDatabase() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(notifications);
  await db.delete(securityAlerts);
  await db.delete(maintenanceSchedules);
  await db.delete(productionActivities);
  await db.delete(users);

  // Insert sample users
  await db.insert(users).values([
    { username: "admin", password: "admin123" },
    { username: "supervisor", password: "super123" },
    { username: "operator", password: "op123" }
  ]);

  // Insert sample production activities
  await db.insert(productionActivities).values([
    {
      name: "Extraction Zone A",
      responsible: "Ahmed Benali",
      status: "En cours",
      date: new Date("2025-01-16")
    },
    {
      name: "Transport matériaux",
      responsible: "Fatima Zahra",
      status: "Terminé",
      date: new Date("2025-01-15")
    },
    {
      name: "Forage secteur B",
      responsible: "Mohamed Alaoui",
      status: "En attente",
      date: new Date("2025-01-17")
    }
  ]);

  // Insert sample maintenance schedules
  await db.insert(maintenanceSchedules).values([
    {
      machine: "Excavatrice CAT 320",
      type: "Préventive",
      description: "Vérification hydraulique et changement filtres",
      scheduledDate: new Date("2025-01-18")
    },
    {
      machine: "Camion Volvo FH16",
      type: "Corrective",
      description: "Réparation système de freinage",
      scheduledDate: new Date("2025-01-16")
    },
    {
      machine: "Chargeuse Liebherr",
      type: "Préventive",
      description: "Entretien moteur et vérification pneumatiques",
      scheduledDate: new Date("2025-01-20")
    }
  ]);

  // Insert sample security alerts
  await db.insert(securityAlerts).values([
    {
      type: "Accès non autorisé",
      message: "Détection d'un accès non autorisé en Zone A",
      severity: "high",
      zone: "Zone A",
      resolved: false
    },
    {
      type: "Équipement défaillant",
      message: "Capteur de température hors service - Poste 7",
      severity: "medium",
      zone: "Zone B",
      resolved: true
    },
    {
      type: "Personnel sans EPI",
      message: "Ouvrier détecté sans casque de sécurité",
      severity: "high",
      zone: "Zone C",
      resolved: false
    }
  ]);

  // Insert sample notifications
  await db.insert(notifications).values([
    {
      title: "Alerte Sécurité",
      message: "Nouvelle alerte de sécurité dans la Zone A",
      type: "error",
      read: false
    },
    {
      title: "Maintenance Programmée",
      message: "Maintenance de l'excavatrice CAT 320 prévue demain",
      type: "info",
      read: false
    },
    {
      title: "Production Terminée",
      message: "Transport matériaux terminé avec succès",
      type: "success",
      read: true
    }
  ]);

  console.log("Database seeded successfully!");
}

// Run seed if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedDatabase().catch(console.error);
}