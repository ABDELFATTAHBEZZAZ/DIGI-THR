import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const employees = [
  { id: 1, name: "Ahmed Benali", hours: 8.5, status: "Actif" },
  { id: 2, name: "Fatima Zahra", hours: 7.2, status: "Actif" },
  { id: 3, name: "Youssef Amrani", hours: 6.8, status: "Pause" },
  { id: 4, name: "Khalid Moussaoui", hours: 8.0, status: "Actif" },
  { id: 5, name: "Aicha Bennani", hours: 7.5, status: "Actif" },
];

const machines = [
  { name: "Excavatrice", performance: 85, status: "Excellent" },
  { name: "Dumper", performance: 92, status: "Excellent" },
  { name: "Convoyeur", performance: 78, status: "Bon" },
  { name: "Crusher", performance: 88, status: "Excellent" },
  { name: "Loader", performance: 95, status: "Excellent" },
];

export default function Performance() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800";
      case "Pause":
        return "bg-yellow-100 text-yellow-800";
      case "Inactif":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "bg-green-500";
    if (performance >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPerformanceStatus = (performance: number) => {
    if (performance >= 90) return "Excellent";
    if (performance >= 75) return "Bon";
    return "À améliorer";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Time Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Temps de Travail des Employés</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Heures</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.hours}h</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Machine Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance des Machines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {machines.map((machine) => (
                <div key={machine.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {machine.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {machine.performance}%
                      </span>
                      <Badge className={
                        machine.performance >= 90 ? "bg-green-100 text-green-800" :
                        machine.performance >= 75 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }>
                        {getPerformanceStatus(machine.performance)}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getPerformanceColor(machine.performance)}`}
                      style={{ width: `${machine.performance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des Performances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {employees.reduce((sum, emp) => sum + emp.hours, 0).toFixed(1)}h
              </p>
              <p className="text-sm text-gray-600">Total heures travaillées</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {employees.filter(emp => emp.status === "Actif").length}
              </p>
              <p className="text-sm text-gray-600">Employés actifs</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">
                {Math.round(machines.reduce((sum, machine) => sum + machine.performance, 0) / machines.length)}%
              </p>
              <p className="text-sm text-gray-600">Performance moyenne</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {machines.filter(machine => machine.performance >= 90).length}
              </p>
              <p className="text-sm text-gray-600">Machines excellentes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
