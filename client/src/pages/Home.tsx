import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { BarChart3, Factory, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenue sur DIGI OFFICE
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Système de gestion et supervision des chantiers à haut risque
        </p>
        <img 
          src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600" 
          alt="Industrial facility with digital monitoring" 
          className="rounded-xl shadow-lg mx-auto mb-8 w-full max-w-3xl"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-ocp-blue rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-4">Dashboard</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Supervision en temps réel des KPIs et indicateurs
            </p>
            <Link href="/dashboard">
              <Button className="bg-ocp-blue hover:bg-blue-700 text-white">
                Accéder
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Factory className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-4">Production</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Gestion des activités de production
            </p>
            <Link href="/production">
              <Button className="bg-ocp-blue hover:bg-blue-700 text-white">
                Accéder
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-ocp-orange rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-4">Sécurité</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Supervision des risques et alertes
            </p>
            <Link href="/security">
              <Button className="bg-ocp-blue hover:bg-blue-700 text-white">
                Accéder
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
