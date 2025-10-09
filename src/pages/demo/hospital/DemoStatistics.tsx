import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Activity, Users, Download } from "lucide-react";
import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";

export default function DemoStatistics() {
  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Statistiques</h1>
            <p className="text-muted-foreground">Indicateurs et analyses de performance</p>
          </div>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Exporter rapport
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Admissions du mois</p>
                  <p className="text-3xl font-bold">234</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +8% vs mois dernier
                  </p>
                </div>
                <Users className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taux d'occupation</p>
                  <p className="text-3xl font-bold">69.3%</p>
                  <p className="text-xs text-muted-foreground mt-1">312/450 lits</p>
                </div>
                <Activity className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Durée séjour moy.</p>
                  <p className="text-3xl font-bold">5.2j</p>
                  <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
                </div>
                <BarChart3 className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                  <p className="text-3xl font-bold">87%</p>
                  <p className="text-xs text-green-600 mt-1">+3% vs trimestre</p>
                </div>
                <TrendingUp className="w-10 h-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Services - Admissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { service: "Médecine Générale", admissions: 58, evolution: 12 },
                  { service: "Chirurgie", admissions: 75, evolution: -5 },
                  { service: "Maternité", admissions: 52, evolution: 8 },
                  { service: "Pédiatrie", admissions: 48, evolution: 15 },
                  { service: "Urgences", admissions: 51, evolution: -3 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.service}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{item.admissions}</span>
                        <Badge variant={item.evolution > 0 ? "default" : "secondary"} className="gap-1">
                          {item.evolution > 0 ? '+' : ''}{item.evolution}%
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(item.admissions / 75) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyses de laboratoire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { analyse: "NFS", nombre: 234, delai: "2h 15min" },
                  { analyse: "Glycémie", nombre: 198, delai: "1h 30min" },
                  { analyse: "Créatinine", nombre: 145, delai: "2h 45min" },
                  { analyse: "Transaminases", nombre: 123, delai: "3h 00min" },
                  { analyse: "CRP", nombre: 109, delai: "1h 45min" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.analyse}</p>
                      <p className="text-sm text-muted-foreground">Délai moyen: {item.delai}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{item.nombre}</p>
                      <p className="text-xs text-muted-foreground">analyses</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HospitalDashboardLayout>
  );
}
