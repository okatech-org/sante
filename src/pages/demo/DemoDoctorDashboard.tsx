import { DemoDashboardLayout } from "@/components/layout/DemoDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Users, FileText, Activity, Clock, TrendingUp, Video, MapPin,
  Phone, Mail, CreditCard, AlertCircle, CheckCircle, XCircle, Plus,
  Stethoscope, Pill, ClipboardList, LineChart, Settings, Bell, Building2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppointmentModal } from "@/components/professional/AppointmentModal";
import { PrescriptionModal } from "@/components/professional/PrescriptionModal";
import { PatientListModal } from "@/components/professional/PatientListModal";

export default function DemoDoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showPatientListModal, setShowPatientListModal] = useState(false);

  const stats = [
    { 
      title: "Patients aujourd'hui", 
      value: "12", 
      change: "+2 vs hier",
      trend: "up",
      icon: Users, 
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      title: "RDV en attente", 
      value: "5", 
      change: "2 urgents",
      trend: "neutral",
      icon: Clock, 
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    { 
      title: "Consultations mois", 
      value: "248", 
      change: "+18%",
      trend: "up",
      icon: Activity, 
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      title: "Téléconsultations", 
      value: "32", 
      change: "+5 cette semaine",
      trend: "up",
      icon: Video, 
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
  ];

  const todayAppointments = [
    {
      id: 1,
      patient: { name: "Marie OKOME", age: 34, cnamgs: "GAB123456789" },
      time: "09:00",
      type: "Consultation générale",
      status: "confirmé",
      paymentMode: "CNAMGS",
      reason: "Suivi diabète type 2",
      urgent: false
    },
    {
      id: 2,
      patient: { name: "Jean MBADINGA", age: 58, cnamgs: "GAB987654321" },
      time: "09:30",
      type: "Suivi post-opératoire",
      status: "en_attente",
      paymentMode: "CNAMGS",
      reason: "Contrôle après chirurgie",
      urgent: true
    },
    {
      id: 3,
      patient: { name: "Sophie NGUEMA", age: 42, cnamgs: null },
      time: "10:15",
      type: "Téléconsultation",
      status: "confirmé",
      paymentMode: "Espèces",
      reason: "Douleurs abdominales",
      urgent: false
    },
    {
      id: 4,
      patient: { name: "Pierre ONDO", age: 29, cnamgs: null },
      time: "11:00",
      type: "Certificat médical",
      status: "confirmé",
      paymentMode: "Mobile Money",
      reason: "Certificat pour emploi",
      urgent: false
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "prescription",
      action: "Prescription envoyée",
      patient: "Alice MOUSSAVOU",
      time: "Il y a 15 min",
      icon: Pill,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "consultation",
      action: "Consultation terminée",
      patient: "Marc KOMBILA",
      time: "Il y a 1h",
      icon: Stethoscope,
      color: "text-blue-600"
    },
    {
      id: 3,
      type: "appointment",
      action: "RDV programmé",
      patient: "Claire IBINGA",
      time: "Il y a 2h",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      id: 4,
      type: "result",
      action: "Résultat labo reçu",
      patient: "Daniel OVONO",
      time: "Il y a 3h",
      icon: ClipboardList,
      color: "text-orange-600"
    },
  ];

  const financialSummary = {
    today: {
      total: 240000,
      cash: 72000,
      cnamgs: 144000,
      mobileMoney: 24000
    },
    month: {
      total: 4800000,
      consultations: 248,
      average: 19355
    },
    pending: {
      cnamgs: 340000,
      patients: 85000
    }
  };

  const alerts = [
    {
      id: 1,
      type: "urgent",
      message: "Patient en salle d'attente depuis 25 min",
      patient: "Jean MBADINGA",
      action: "Voir patient"
    },
    {
      id: 2,
      type: "warning",
      message: "Résultats labo en attente de validation",
      patient: "Marie OKOME",
      action: "Valider"
    },
    {
      id: 3,
      type: "info",
      message: "Rappel: Formation télémédecine demain 14h",
      action: "Détails"
    }
  ];

  return (
    <DemoDashboardLayout demoType="doctor">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord Médecin</h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Dr. medecin.demo • Cabinet Montagne Sainte, Libreville
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              3 nouvelles
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/professional/select-establishment')}>
              <Building2 className="h-4 w-4 mr-2" />
              Mes établissements
            </Button>
            <Button onClick={() => setShowAppointmentModal(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Nouveau RDV
            </Button>
          </div>
        </div>

        {/* Alertes urgentes */}
        {alerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${
                alert.type === 'urgent' ? 'border-l-red-500 bg-red-50/50' :
                alert.type === 'warning' ? 'border-l-orange-500 bg-orange-50/50' :
                'border-l-blue-500 bg-blue-50/50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      {alert.patient && (
                        <p className="text-xs text-muted-foreground mt-1">{alert.patient}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      {alert.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="financial">Finances</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          {/* Tab: Aujourd'hui */}
          <TabsContent value="today" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rendez-vous du jour */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Rendez-vous aujourd'hui
                    </span>
                    <Badge variant="secondary">{todayAppointments.length} patients</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                      apt.urgent ? 'border-red-300 bg-red-50/50' : 'bg-background/50'
                    }`}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-center min-w-[60px]">
                          <div className="text-lg font-bold">{apt.time}</div>
                          <div className="text-xs flex items-center justify-center gap-1">
                            {apt.status === "confirmé" ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <Clock className="h-3 w-3 text-orange-600" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {apt.patient.name}
                            {apt.urgent && (
                              <Badge variant="destructive" className="text-xs">Urgent</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{apt.type}</div>
                          <div className="text-xs text-muted-foreground mt-1">{apt.reason}</div>
                          <div className="flex items-center gap-2 mt-2">
                            {apt.patient.cnamgs && (
                              <Badge variant="outline" className="text-xs">
                                <CreditCard className="h-3 w-3 mr-1" />
                                CNAMGS
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {apt.paymentMode}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Dossier
                        </Button>
                        <Button size="sm">
                          Commencer
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Activité récente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className={`rounded-full p-2 ${activity.color.replace('text-', 'bg-')}/10`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
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
          </TabsContent>

          {/* Tab: Patients */}
          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mes patients</span>
                  <Button onClick={() => setShowPatientListModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau patient
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gestion complète de vos patients avec dossiers médicaux, historique et suivi
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Finances */}
          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Revenus aujourd'hui</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{financialSummary.today.total.toLocaleString()} FCFA</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Espèces</span>
                      <span className="font-medium">{financialSummary.today.cash.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CNAMGS</span>
                      <span className="font-medium">{financialSummary.today.cnamgs.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Mobile Money</span>
                      <span className="font-medium">{financialSummary.today.mobileMoney.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Revenus ce mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{financialSummary.month.total.toLocaleString()} FCFA</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Consultations</span>
                      <span className="font-medium">{financialSummary.month.consultations}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Moyenne/consultation</span>
                      <span className="font-medium">{financialSummary.month.average.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">En attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Remboursement CNAMGS</p>
                      <p className="text-xl font-bold">{financialSummary.pending.cnamgs.toLocaleString()} FCFA</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Paiements patients</p>
                      <p className="text-xl font-bold">{financialSummary.pending.patients.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Statistiques */}
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Statistiques détaillées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Graphiques et analyses de votre activité médicale
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 p-4"
                onClick={() => setShowPrescriptionModal(true)}
              >
                <Pill className="h-6 w-6" />
                <span className="text-sm">Ordonnance</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Video className="h-6 w-6" />
                <span className="text-sm">Téléconsultation</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 p-4"
                onClick={() => setShowPatientListModal(true)}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Patients</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <ClipboardList className="h-6 w-6" />
                <span className="text-sm">Résultats</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Stats</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Paramètres</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AppointmentModal 
        open={showAppointmentModal} 
        onOpenChange={setShowAppointmentModal}
      />
      <PrescriptionModal 
        open={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
      />
      <PatientListModal 
        open={showPatientListModal}
        onClose={() => setShowPatientListModal(false)}
      />
    </DemoDashboardLayout>
  );
}
