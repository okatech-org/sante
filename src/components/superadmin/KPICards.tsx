import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Activity, TrendingUp } from "lucide-react";

const kpiData = [
  {
    label: "Utilisateurs Total",
    value: "12,547",
    trend: "+847 ce mois",
    icon: Users,
    trendUp: true
  },
  {
    label: "Prestataires Actifs",
    value: "2,247",
    trend: "+124 ce mois",
    icon: Building2,
    trendUp: true
  },
  {
    label: "Actifs Aujourd'hui",
    value: "3,891",
    trend: "+12% vs hier",
    icon: Activity,
    trendUp: true
  },
  {
    label: "Croissance Mensuelle",
    value: "+18.2%",
    trend: "Objectif: +15%",
    icon: TrendingUp,
    trendUp: true
  }
];

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => (
        <Card key={index} className="bg-card/40 backdrop-blur-lg border-border/50 hover:border-border transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.label}
            </CardTitle>
            <kpi.icon className="h-5 w-5 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{kpi.value}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {kpi.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
