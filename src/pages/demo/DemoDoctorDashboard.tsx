import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, Activity, Clock, TrendingUp, Video, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DemoDoctorDashboard() {
  const { user } = useAuth();

  const stats = [
    { title: "Patients aujourd'hui", value: "12", change: "+2", icon: Users, color: "text-blue-600" },
    { title: "RDV en attente", value: "5", change: "2 urgents", icon: Clock, color: "text-orange-600" },
    { title: "Consultations totales", value: "248", change: "+18 ce mois", icon: Activity, color: "text-green-600" },
    { title: "Téléconsultations", value: "32", change: "+5", icon: Video, color: "text-purple-600" },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: "Marie OKOME",
      time: "09:00",
      type: "Consultation générale",
      status: "confirmé",
      cnamgs: true
    },
    {
      id: 2,
      patient: "Jean MBADINGA",
      time: "09:30",
      type: "Suivi diabète",
      status: "en_attente",
      cnamgs: true
    },
    {
      id: 3,
      patient: "Sophie NGUEMA",
      time: "10:15",
      type: "Téléconsultation",
      status: "confirmé",
      cnamgs: false
    },
    {
      id: 4,
      patient: "Pierre ONDO",
      time: "11:00",
      type: "Certificat médical",
      status: "confirmé",
      cnamgs: false
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Prescription envoyée",
      patient: "Alice MOUSSAVOU",
      time: "Il y a 15 min",
      icon: FileText
    },
    {
      id: 2,
      action: "Consultation terminée",
      patient: "Marc KOMBILA",
      time: "Il y a 1h",
      icon: Activity
    },
    {
      id: 3,
      action: "RDV programmé",
      patient: "Claire IBINGA",
      time: "Il y a 2h",
      icon: Calendar
    },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord Médecin</h1>
            <p className="text-muted-foreground mt-2">
              Bienvenue Dr. {user?.email?.split('@')[0]} • Cabinet Montagne Sainte, Libreville
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Mon cabinet
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Nouvelle consultation
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/70 backdrop-blur-lg border-border hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prochains RDV */}
          <Card className="lg:col-span-2 bg-card/70 backdrop-blur-lg border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Rendez-vous aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-sm font-bold">{apt.time}</div>
                      <div className="text-xs text-muted-foreground">
                        {apt.status === "confirmé" ? "✓" : "⏳"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{apt.patient}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {apt.type}
                        {apt.cnamgs && (
                          <Badge variant="outline" className="text-xs">CNAMGS</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Voir tout l'agenda
              </Button>
            </CardContent>
          </Card>

          {/* Activité récente */}
          <Card className="bg-card/70 backdrop-blur-lg border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.patient}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card/70 backdrop-blur-lg border-border">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Nouvelle ordonnance</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Video className="h-6 w-6" />
                <span className="text-sm">Téléconsultation</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Users className="h-6 w-6" />
                <span className="text-sm">Liste patients</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Statistiques</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
