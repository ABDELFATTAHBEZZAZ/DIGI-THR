import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle, X, CheckCircle, Zap } from "lucide-react";

export default function Context() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Site Presentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-ocp-blue" />
            Mine de Sidi Chennane - Site Stratégique OCP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
                alt="Mine de Sidi Chennane" 
                className="rounded-lg shadow-md w-full h-64 object-cover"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Localisation</h3>
                <p className="text-gray-600">
                  Région de Khouribga, Maroc - Zone d'extraction de phosphate
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Caractéristiques</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Surface d'exploitation: 2,500 hectares</li>
                  <li>• Personnel: 450 employés</li>
                  <li>• Équipements lourds: 85 machines</li>
                  <li>• Production: 12,000 tonnes/jour</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problem Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Problématique Identifiée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Risques Physiques</h4>
                  <p className="text-sm text-gray-600">Chutes, écrasements, accidents mécaniques</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Risques d'Explosion</h4>
                  <p className="text-sm text-gray-600">Gaz, poussières, équipements défaillants</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Incidents Mécaniques</h4>
                  <p className="text-sm text-gray-600">Pannes d'équipements, maintenance non planifiée</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <X className="mr-2 h-5 w-5" />
              Problèmes Actuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Supervision Manuelle</h4>
                  <p className="text-sm text-gray-600">Pas de monitoring numérique temps réel</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Détection Tardive</h4>
                  <p className="text-sm text-gray-600">Alertes non automatisées, temps de réaction lent</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Accès Non Contrôlé</h4>
                  <p className="text-sm text-gray-600">Pas de système de détection d'intrusion</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solution Proposée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="mr-2 h-5 w-5" />
            Solution DIGI THR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="mx-auto h-8 w-8 text-ocp-blue mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Intelligence Artificielle</h4>
              <p className="text-sm text-gray-600">
                Détection automatique des risques par analyse d'images et capteurs IoT
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <AlertTriangle className="mx-auto h-8 w-8 text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Alertes Temps Réel</h4>
              <p className="text-sm text-gray-600">
                Notifications instantanées en cas de détection d'anomalies
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <MapPin className="mx-auto h-8 w-8 text-purple-600 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Cartographie Interactive</h4>
              <p className="text-sm text-gray-600">
                Visualisation en temps réel des zones à risque sur plan du site
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Spécifications Techniques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Fonctionnalités Core</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Module</Badge>
                  <span className="text-sm">Détection d'intrusion par IA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Module</Badge>
                  <span className="text-sm">Monitoring équipements temps réel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Module</Badge>
                  <span className="text-sm">Système d'alertes multi-canal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Module</Badge>
                  <span className="text-sm">Génération de rapports automatisés</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Architecture Technique</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Tech</Badge>
                  <span className="text-sm">Frontend: React.js + TypeScript</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Tech</Badge>
                  <span className="text-sm">Backend: Node.js + Express</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Tech</Badge>
                  <span className="text-sm">Database: PostgreSQL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Tech</Badge>
                  <span className="text-sm">IoT: Capteurs temps réel</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}