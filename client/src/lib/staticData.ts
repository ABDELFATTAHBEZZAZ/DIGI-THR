// Static data for deployment without backend
export const staticData = {
  user: {
    id: "1",
    email: "abdelfattah@ocp.ma",
    firstName: "Abdelfattah",
    lastName: "Manager",
    profileImageUrl: "/ocp-logo.png",
  },
  
  dashboardStats: {
    productionActive: 8,
    maintenanceHours: 24,
    securityAlerts: 3,
    performanceScore: 92
  },
  
  notifications: [
    {
      id: 1,
      title: "Alerte Sécurité",
      message: "Accès non autorisé détecté en Zone B",
      type: "security",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Maintenance Programmée",
      message: "Maintenance excavatrice CAT 320 - 14h00",
      type: "maintenance", 
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "Production",
      message: "Objectif journalier atteint à 98%",
      type: "production",
      createdAt: new Date().toISOString()
    }
  ],
  
  production: [
    {
      id: 1,
      name: "Extraction Zone A",
      responsible: "Ahmed Benali",
      status: "active",
      progress: 75,
      target: 100,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "Transport Minerai",
      responsible: "Fatima Zahra",
      status: "active",
      progress: 60,
      target: 80,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: "Traitement Primaire",
      responsible: "Youssef Alami",
      status: "completed",
      progress: 100,
      target: 100,
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      name: "Contrôle Qualité",
      responsible: "Laila Mansouri",
      status: "pending",
      progress: 0,
      target: 100,
      createdAt: new Date().toISOString()
    }
  ],
  
  maintenance: [
    {
      id: 1,
      machine: "Excavatrice CAT 320",
      type: "preventive",
      status: "scheduled",
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: "Mohammed Tazi",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      machine: "Camion Volvo FH16",
      type: "corrective",
      status: "in-progress",
      scheduledDate: new Date().toISOString(),
      assignedTo: "Rachid Berrada",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      machine: "Convoyeur 001",
      type: "preventive",
      status: "completed",
      scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: "Karim Lazaar",
      createdAt: new Date().toISOString()
    }
  ],
  
  alerts: [
    {
      id: 1,
      type: "Équipement défaillant",
      zone: "Zone A",
      severity: "high",
      status: "active",
      description: "Panne détectée sur excavatrice CAT 320",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      type: "Accès non autorisé",
      zone: "Zone B",
      severity: "critical",
      status: "active",
      description: "Tentative d'accès sans autorisation",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      type: "Maintenance urgente",
      zone: "Zone C",
      severity: "medium",
      status: "resolved",
      description: "Réparation convoyeur terminée",
      createdAt: new Date().toISOString()
    }
  ]
};