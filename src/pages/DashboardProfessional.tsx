import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, FileText, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardProfessional() {
  const { user } = useAuth();

  const stats = [
    { title: "Patients aujourd'hui", value: "12", icon: Users, color: "text-primary" },
    { title: "RDV en attente", value: "5", icon: Calendar, color: "text-warning" },
    { title: "Consultations totales", value: "248", icon: Activity, color: "text-success" },
    { title: "Documents", value: "32", icon: FileText, color: "text-muted-foreground" },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord professionnel</h1>
          <p className="text-muted-foreground mt-2">
            Bienvenue Dr. {user?.email?.split('@')[0]}
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
              <CardTitle>Prochains rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aucun rendez-vous prévu pour le moment
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-lg border-border">
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aucune activité récente
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
