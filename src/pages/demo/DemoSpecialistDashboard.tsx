import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, Users, FileText, Activity, Clock, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DemoSpecialistDashboard() {
  const { user } = useAuth();

  const stats = [
    { title: "Consultations cardiologiques", value: "8", change: "Aujourd'hui", icon: HeartPulse, color: "text-rose-600" },
    { title: "Patients en suivi", value: "45", change: "+3 ce mois", icon: Users, color: "text-blue-600" },
    { title: "ECG programmés", value: "6", change: "Cette semaine", icon: Activity, color: "text-purple-600" },
    { title: "Urgences traitées", value: "2", change: "Ce mois", icon: AlertCircle, color: "text-orange-600" },
  ];

  const criticalPatients = [
    {
      id: 1,
      name: "Jean MBADINGA",
      condition: "Insuffisance cardiaque",
      lastVisit: "Il y a 2 jours",
      urgency: "high",
      nextAction: "Ajuster traitement"
    },
    {
      id: 2,
      name: "Alice MOUSSAVOU",
      condition: "Hypertension sévère",
      lastVisit: "Il y a 5 jours",
      urgency: "medium",
      nextAction: "Contrôle tension"
    },
    {
      id: 3,
      name: "Pierre ONDO",
      condition: "Post-infarctus",
      lastVisit: "Il y a 1 semaine",
      urgency: "high",
      nextAction: "ECG de contrôle"
    },
  ];

  const upcomingExams = [
    {
      id: 1,
      patient: "Sophie NGUEMA",
      exam: "Échographie cardiaque",
      time: "14:00",
      type: "Évaluation valve mitrale"
    },
    {
      id: 2,
      patient: "Marc KOMBILA",
      exam: "ECG d'effort",
      time: "15:30",
      type: "Bilan coronarien"
    },
    {
      id: 3,
      patient: "Claire IBINGA",
      exam: "Holter ECG",
      time: "16:00",
      type: "Surveillance arythmie"
    },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord Cardiologie</h1>
            <p className="text-muted-foreground mt-2">
              Dr. {user?.email?.split('@')[0]} • Spécialiste Cardiologie • CHU Owendo
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
              Patients critiques
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Programmer examen
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patients critiques */}
          <Card className="bg-card/70 backdrop-blur-lg border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Patients à surveiller
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalPatients.map((patient) => (
                <div key={patient.id} className="p-3 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {patient.name}
                        <Badge variant={patient.urgency === "high" ? "destructive" : "secondary"} className="text-xs">
                          {patient.urgency === "high" ? "Urgent" : "Surveillance"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{patient.condition}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{patient.lastVisit}</span>
                    <span className="font-medium text-primary">{patient.nextAction}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Examens programmés */}
          <Card className="bg-card/70 backdrop-blur-lg border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Examens aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[60px]">
                      <div className="text-sm font-bold">{exam.time}</div>
                    </div>
                    <div>
                      <div className="font-medium">{exam.patient}</div>
                      <div className="text-sm text-muted-foreground">{exam.exam}</div>
                      <div className="text-xs text-muted-foreground">{exam.type}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
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
                <HeartPulse className="h-6 w-6" />
                <span className="text-sm">Nouveau bilan cardiaque</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Activity className="h-6 w-6" />
                <span className="text-sm">Programmer ECG</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Ordonnance cardio</span>
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
