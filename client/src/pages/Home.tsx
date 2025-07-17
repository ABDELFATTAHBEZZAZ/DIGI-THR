import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { BarChart3, Factory, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          DIGI THR — Supervision intelligente des travaux à haut risque
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
          DIGI THR est une solution de sécurité digitale en temps réel dédiée aux chantiers industriels à haut risque. 
          Elle surveille les zones sensibles, envoie des alertes automatiques et améliore la réactivité face aux incidents.
        </p>
        <img 
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600" 
          alt="Mine de Sidi Chennane - Supervision digitale" 
          className="rounded-xl shadow-lg mx-auto mb-8 w-full max-w-3xl"
        />
        <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/attached_assets/OCP_Group.svg_1752775471292.png" 
              alt="OCP Logo" 
              className="w-12 h-12 object-contain mr-3"
            />
            <h3 className="text-lg font-semibold text-ocp-green">Mine de Sidi Chennane - OCP Maroc</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            Site minier stratégique nécessitant une supervision continue des risques physiques, explosions potentielles, 
            et incidents mécaniques. DIGI THR apporte une solution numérique complète pour la détection d'accès non autorisé 
            et la gestion proactive des situations à haut risque.
          </p>
        </div>
        
        <div className="text-center mb-12">
          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="bg-ocp-green hover:bg-ocp-green-dark text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Accéder au Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-ocp-green rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-4">Dashboard</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Supervision en temps réel des KPIs et indicateurs
            </p>
            <Link href="/dashboard">
              <Button className="bg-ocp-green hover:bg-ocp-green-dark text-white">
                Accéder
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-ocp-green rounded-lg flex items-center justify-center">
                <Factory className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-4">Production</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Gestion des activités de production
            </p>
            <Link href="/production">
              <Button className="bg-ocp-green hover:bg-ocp-green-dark text-white">
                Accéder
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-ocp-green rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-4">Sécurité</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Supervision des risques et alertes
            </p>
            <Link href="/security">
              <Button className="bg-ocp-green hover:bg-ocp-green-dark text-white">
                Accéder
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
