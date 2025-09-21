// Désactivation du mode statique pour permettre la communication avec le serveur backend
export const isStaticMode = false;

// Static API responses
export const staticResponses = {
  '/api/auth/user': () => Promise.resolve({
    id: "1",
    email: "abdelfattah@ocp.ma", 
    firstName: "Abdelfattah",
    lastName: "Manager",
    profileImageUrl: "/ocp-logo.png",
  }),
  
  '/api/dashboard/stats': () => Promise.resolve({
    productionActive: Math.floor(Math.random() * 10) + 5,
    maintenanceHours: Math.floor(Math.random() * 50) + 20,
    securityAlerts: Math.floor(Math.random() * 5) + 1,
    performanceScore: Math.floor(Math.random() * 20) + 80
  }),
  
  '/api/notifications': () => Promise.resolve([
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
  ]),
  
  '/api/production': () => Promise.resolve([
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
    }
  ]),
  
  '/api/maintenance': () => Promise.resolve([
    {
      id: 1,
      machine: "Excavatrice CAT 320",
      type: "preventive",
      status: "scheduled",
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: "Mohammed Tazi",
      createdAt: new Date().toISOString()
    }
  ]),
  
  '/api/alerts': () => Promise.resolve([
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
    }
  ])
};