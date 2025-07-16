import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  HardHat, 
  Calendar, 
  ClipboardList, 
  MapPin, 
  FileText, 
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Zap,
  Camera,
  Wifi,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Features() {
  const { toast } = useToast();

  const handleFeatureDemo = (featureName: string) => {
    const demoMessages = {
      "Identification des Risques": "Détection automatique activée - 3 zones à risque identifiées",
      "Gestion des Équipements de Sécurité": "Vérification EPI en cours - 2 casques manquants détectés",
      "Planification et Autorisations": "Permis de travail numérique généré pour zone A",
      "Suivi d'Incidents": "Nouvel incident enregistré - Géolocalisation sauvegardée",
      "Géolocalisation Temps Réel": "Tracking activé - 85 badges connectés détectés",
      "Génération de Rapports": "Rapport de sécurité généré - Export PDF disponible"
    };
    
    const message = demoMessages[featureName as keyof typeof demoMessages] || `Fonctionnalité ${featureName} activée`;
    
    toast({
      title: `🔄 Test: ${featureName}`,
      description: message,
      variant: "default",
    });
  };

  const handleManualAlert = () => {
    const alertTypes = [
      "⚠️ Alerte critique: Accès non autorisé détecté en Zone A",
      "🔥 Alerte incendie: Température élevée détectée - Poste 7",
      "⚡ Alerte équipement: Panne excavatrice CAT 320 - Zone B",
      "🚨 Alerte sécurité: Personnel sans EPI détecté - Zone C",
      "☣️ Alerte environnement: Fuite de carburant détectée - Station 2"
    ];
    
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    toast({
      title: "Alerte Manuelle Déclenchée",
      description: randomAlert,
      variant: "destructive",
    });
  };

  const coreFeatures = [
    {
      icon: Shield,
      title: "Identification des Risques",
      description: "Détection automatique des situations dangereuses par analyse d'images et capteurs IoT",
      color: "bg-red-500",
      status: "Actif",
      details: [
        "Analyse vidéo en temps réel",
        "Détection d'objets dangereux",
        "Reconnaissance faciale pour accès",
        "Capteurs de gaz et température"
      ]
    },
    {
      icon: HardHat,
      title: "Gestion des Équipements de Sécurité",
      description: "Vérification automatique du port d'EPI et conformité des équipements",
      color: "bg-orange-500",
      status: "Actif",
      details: [
        "Détection casque et gilet",
        "Vérification chaussures sécurité",
        "Contrôle masques et gants",
        "Alerte EPI manquant"
      ]
    },
    {
      icon: Calendar,
      title: "Planification et Autorisations",
      description: "Système de gestion des autorisations de travail et planification des interventions",
      color: "bg-blue-500",
      status: "Actif",
      details: [
        "Permis de travail numérique",
        "Validation superviseur",
        "Calendrier interventions",
        "Zones temporaires interdites"
      ]
    },
    {
      icon: ClipboardList,
      title: "Suivi d'Incidents",
      description: "Enregistrement et traçabilité complète des incidents de sécurité",
      color: "bg-purple-500",
      status: "Actif",
      details: [
        "Déclaration incident instantanée",
        "Photos géolocalisées",
        "Workflow d'enquête",
        "Mesures correctives"
      ]
    },
    {
      icon: MapPin,
      title: "Géolocalisation Temps Réel",
      description: "Localisation précise du personnel et des équipements sur site",
      color: "bg-green-500",
      status: "Actif",
      details: [
        "Badges connectés personnel",
        "Tracking véhicules",
        "Zones de sécurité dynamiques",
        "Évacuation d'urgence"
      ]
    },
    {
      icon: FileText,
      title: "Génération de Rapports",
      description: "Création automatisée de rapports de sécurité et conformité",
      color: "bg-indigo-500",
      status: "Actif",
      details: [
        "Rapports quotidiens/hebdomadaires",
        "Statistiques incidents",
        "Conformité réglementaire",
        "Export PDF/Excel"
      ]
    }
  ];

  const advancedFeatures = [
    {
      icon: Camera,
      title: "Surveillance Vidéo IA",
      description: "Réseau de caméras intelligentes avec analyse comportementale",
      color: "bg-cyan-500"
    },
    {
      icon: Wifi,
      title: "Réseau IoT",
      description: "Capteurs environnementaux et de sécurité connectés",
      color: "bg-teal-500"
    },
    {
      icon: Database,
      title: "Big Data Analytics",
      description: "Analyse prédictive des risques basée sur l'historique",
      color: "bg-pink-500"
    },
    {
      icon: MessageSquare,
      title: "Communication Intégrée",
      description: "Système de communication d'urgence multi-canal",
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Fonctionnalités DIGI THR
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Solution complète de sécurité digitale pour la supervision intelligente 
          des travaux à haut risque dans l'industrie minière
        </p>
      </div>

      {/* Core Features */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
          Fonctionnalités Principales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feature.color} mr-3`}>
                      <feature.icon className="text-white" size={20} />
                    </div>
                    <span className="text-lg">{feature.title}</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {feature.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="space-y-2 mb-4">
                  {feature.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {detail}
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => handleFeatureDemo(feature.title)}
                  className="w-full bg-ocp-blue hover:bg-blue-700"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Tester la Fonctionnalité
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Advanced Features */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <AlertTriangle className="mr-2 h-6 w-6 text-orange-500" />
          Fonctionnalités Avancées
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {advancedFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color} mb-3`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Implementation Status */}
      <Card>
        <CardHeader>
          <CardTitle>État d'Implémentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Fonctionnalités Core</div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">78%</div>
              <div className="text-sm text-gray-600">Intégration IoT</div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">60%</div>
              <div className="text-sm text-gray-600">IA Avancée</div>
              <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Testing Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-yellow-500" />
            Panneau de Test & Démonstration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Tests Automatiques</h4>
              <div className="space-y-2">
                <Button 
                  onClick={handleManualAlert}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  variant="destructive"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Déclencher Alerte Manuelle
                </Button>
                <Button 
                  onClick={() => handleFeatureDemo("Surveillance Vidéo IA")}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Test Surveillance IA
                </Button>
                <Button 
                  onClick={() => handleFeatureDemo("Réseau IoT")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Wifi className="mr-2 h-4 w-4" />
                  Test Capteurs IoT
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Simulation Scénarios</h4>
              <div className="space-y-2">
                <Button 
                  onClick={() => toast({ title: "📊 Rapport généré", description: "Rapport de sécurité hebdomadaire disponible en PDF", variant: "default" })}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Générer Rapport PDF
                </Button>
                <Button 
                  onClick={() => toast({ title: "🌍 Géolocalisation", description: "Position mise à jour: 32.8734°N, 6.9069°W", variant: "default" })}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Test Géolocalisation
                </Button>
                <Button 
                  onClick={() => toast({ title: "💬 Communication", description: "Message d'urgence envoyé à tous les superviseurs", variant: "default" })}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Test Communication
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI Section */}
      <Card>
        <CardHeader>
          <CardTitle>Retour sur Investissement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-1">-65%</div>
              <div className="text-sm text-gray-600">Incidents de sécurité</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">-40%</div>
              <div className="text-sm text-gray-600">Temps d'arrêt</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">+30%</div>
              <div className="text-sm text-gray-600">Efficacité opérationnelle</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">18 mois</div>
              <div className="text-sm text-gray-600">Retour sur investissement</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}