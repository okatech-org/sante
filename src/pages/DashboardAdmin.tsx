import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, UserCog, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardAdmin() {
  const { user, isSuperAdmin } = useAuth();

  const stats = [
    { title: "Total utilisateurs", value: "1,234", icon: Users, color: "text-primary" },
    { title: "Établissements", value: "88", icon: Building2, color: "text-success" },
    { title: "Professionnels", value: "2,159", icon: UserCog, color: "text-warning" },
    { title: "En attente d'approbation", value: "15", icon: AlertCircle, color: "text-destructive" },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
          <p className="text-muted-foreground mt-2">
            {isSuperAdmin ? "Super Admin" : "Admin"} - {user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/70 backdrop-blur-lg border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/70 backdrop-blur-lg border-border">
            <CardHeader>
              <CardTitle>Demandes en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                15 professionnels en attente de validation
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-lg border-border">
            <CardHeader>
              <CardTitle>Activité récente du système</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aucune alerte système
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
