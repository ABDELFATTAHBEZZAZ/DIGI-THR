import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Zone {
  id: string;
  name: string;
  status: "Alerte" | "Maintenance" | "Normale";
  left: string;
  top: string;
  width: string;
  height: string;
}

const zones: Zone[] = [
  {
    id: "zone-a",
    name: "Zone A",
    status: "Alerte",
    left: "15%",
    top: "20%",
    width: "80px",
    height: "60px",
  },
  {
    id: "zone-b",
    name: "Zone B",
    status: "Maintenance",
    left: "60%",
    top: "40%",
    width: "80px",
    height: "60px",
  },
  {
    id: "zone-c",
    name: "Zone C",
    status: "Normale",
    left: "30%",
    top: "60%",
    width: "80px",
    height: "60px",
  },
];

export default function SiteMap() {
  const { toast } = useToast();

  const getZoneColor = (status: string) => {
    switch (status) {
      case "Alerte":
        return "bg-red-500 bg-opacity-30 hover:bg-opacity-50";
      case "Maintenance":
        return "bg-yellow-500 bg-opacity-30 hover:bg-opacity-50";
      case "Normale":
        return "bg-green-500 bg-opacity-30 hover:bg-opacity-50";
      default:
        return "bg-gray-500 bg-opacity-30 hover:bg-opacity-50";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Alerte":
        return "bg-red-100 text-red-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Normale":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleZoneClick = (zone: Zone) => {
    if (zone.status === "Alerte") {
      toast({
        title: "⚠️ Zone à haut risque détectée",
        description: `Zone ${zone.name}: Intervention requise immédiatement!`,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Zone ${zone.name}`,
        description: `Statut: ${zone.status} - Supervision active`,
        variant: zone.status === "Maintenance" ? "default" : "default",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Carte Interactive du Chantier</CardTitle>
          <p className="text-sm text-gray-600">
            Cliquez sur les zones pour voir les détails
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative inline-block w-full">
            <img 
              src="/chantier-map.png" 
              alt="Carte du chantier" 
              className="w-full rounded-lg shadow-lg"
              style={{ minHeight: "600px", objectFit: "contain" }}
            />
            
            {/* Clickable zones overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className={`absolute rounded-lg cursor-pointer pointer-events-auto transition-all duration-200 ${getZoneColor(zone.status)}`}
                  style={{
                    left: zone.left,
                    top: zone.top,
                    width: zone.width,
                    height: zone.height,
                  }}
                  onClick={() => handleZoneClick(zone)}
                  title={`${zone.name} - ${zone.status}`}
                >
                  <div className="p-2 h-full flex flex-col justify-between">
                    <span className="text-xs font-bold text-white">
                      {zone.name}
                    </span>
                    <Badge className={`text-xs ${getStatusBadge(zone.status)}`}>
                      {zone.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Zone à risque</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Maintenance</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Zone normale</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {zones.map((zone) => (
          <Card key={zone.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{zone.name}</h3>
                <Badge className={getStatusBadge(zone.status)}>
                  {zone.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {zone.status === "Alerte" && "Surveillance renforcée requise"}
                {zone.status === "Maintenance" && "Intervention programmée"}
                {zone.status === "Normale" && "Fonctionnement normal"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
