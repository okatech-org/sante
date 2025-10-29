import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Building2, Activity, DollarSign } from "lucide-react";

export default function AdminAnalytics() {
  const metrics = {
    userGrowth: { current: 12847, growth: 35, trend: "up" },
    establishmentGrowth: { current: 342, growth: 12, trend: "up" },
    consultations: { current: 8941, growth: 18, trend: "up" },
    revenue: { current: 2400000, growth: 22, trend: "up" }
  };

  const provinceStats = [
    { name: "Estuaire", users: 6500, establishments: 180, percentage: 50 },
    { name: "Ogooué-Maritime", users: 2100, establishments: 65, percentage: 20 },
    { name: "Haut-Ogooué", users: 1800, establishments: 45, percentage: 15 },
    { name: "Moyen-Ogooué", users: 900, establishments: 25, percentage: 8 },
    { name: "Autres", users: 1547, establishments: 27, percentage: 7 }
  ];

  return (
    <SuperAdminLayoutSimple>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics & Rapports</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500/10">
            <CardHeader><CardTitle className="text-sm">Utilisateurs</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.userGrowth.current.toLocaleString()}</div>
              <Badge className="mt-2 bg-green-500/20 text-green-700"><TrendingUp className="w-3 h-3 mr-1" />+{metrics.userGrowth.growth}%</Badge>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500/10">
            <CardHeader><CardTitle className="text-sm">Établissements</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.establishmentGrowth.current}</div>
              <Badge className="mt-2 bg-green-500/20 text-green-700"><TrendingUp className="w-3 h-3 mr-1" />+{metrics.establishmentGrowth.growth}%</Badge>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-500/10">
            <CardHeader><CardTitle className="text-sm">Consultations</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.consultations.current.toLocaleString()}</div>
              <Badge className="mt-2 bg-green-500/20 text-green-700"><TrendingUp className="w-3 h-3 mr-1" />+{metrics.consultations.growth}%</Badge>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg bg-gradient-to-br from-orange-500/10">
            <CardHeader><CardTitle className="text-sm">Revenus</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${(metrics.revenue.current / 1000000).toFixed(1)}M</div>
              <Badge className="mt-2 bg-green-500/20 text-green-700"><TrendingUp className="w-3 h-3 mr-1" />+{metrics.revenue.growth}%</Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Répartition Géographique</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {provinceStats.map((province, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{province.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {province.users.toLocaleString()} users • {province.establishments} établ.
                  </span>
                </div>
                <Progress value={province.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayoutSimple>
  );
}
