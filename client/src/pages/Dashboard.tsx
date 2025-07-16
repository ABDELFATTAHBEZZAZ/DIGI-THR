import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import KPICard from "@/components/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, Settings, Fuel, AlertTriangle } from "lucide-react";

interface DashboardStats {
  productionActive: number;
  maintenanceHours: number;
  dieselUsage: number;
  securityAlerts: number;
  productionRate: number;
  equipmentStatus: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    productionActive: 0,
    maintenanceHours: 0,
    dieselUsage: 0,
    securityAlerts: 0,
  });

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  useEffect(() => {
    if (dashboardData) {
      setStats(dashboardData);
    }
  }, [dashboardData]);

  // Real-time simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        productionActive: Math.max(0, prev.productionActive + Math.floor(Math.random() * 3) - 1),
        maintenanceHours: Math.max(0, prev.maintenanceHours + Math.floor(Math.random() * 5)),
        dieselUsage: Math.max(0, prev.dieselUsage + Math.floor(Math.random() * 100) - 50),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Production Active"
          value={stats.productionActive}
          icon={Factory}
          iconColor="bg-green-500"
          trend={{
            value: "+2.5%",
            label: "vs hier",
            color: "text-green-600"
          }}
        />
        <KPICard
          title="Heures Maintenance"
          value={stats.maintenanceHours}
          icon={Settings}
          iconColor="bg-blue-500"
          trend={{
            value: "+12h",
            label: "cette semaine",
            color: "text-blue-600"
          }}
        />
        <KPICard
          title="Diesel Utilisé (L)"
          value={stats.dieselUsage.toLocaleString()}
          icon={Fuel}
          iconColor="bg-yellow-500"
          trend={{
            value: "-3.2%",
            label: "vs moyenne",
            color: "text-yellow-600"
          }}
        />
        <KPICard
          title="Alertes Sécurité"
          value={stats.securityAlerts}
          icon={AlertTriangle}
          iconColor="bg-red-500"
          trend={{
            value: "2 nouvelles",
            label: "aujourd'hui",
            color: "text-red-600"
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Production Journalière</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600 mb-2">
                  {stats.productionActive * 100}
                </div>
                <div className="text-sm text-gray-500">
                  Tonnes produites aujourd'hui
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes par Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Zone A</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-red-500 rounded"></div>
                    <span className="text-sm font-medium">3</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Zone B</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-2 bg-yellow-500 rounded"></div>
                    <span className="text-sm font-medium">1</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Zone C</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-0 h-2 bg-green-500 rounded"></div>
                    <span className="text-sm font-medium">0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Zone D</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-blue-500 rounded"></div>
                    <span className="text-sm font-medium">2</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
