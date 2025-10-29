import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  Bed,
  Activity,
  AlertCircle,
  TrendingUp,
  Calendar,
  Settings,
  Bell,
  Stethoscope,
  MapPin,
  Phone
} from "lucide-react";

import { SogaraDashboardLayout } from "@/components/layout/SogaraDashboardLayout";

export default function SogaraDashboard() {

  // Données de l'Hôpital de SOGARA / Infirmerie SOGARA
  const hospitalData = {
    name: "Hôpital de SOGARA / Infirmerie SOGARA",
    type: "Hôpital d'entreprise",
    location: "Zone SOGARA, Port-Gentil",
    province: "Ogooué-Maritime",
    phone: "+241 XX XX XX XX",
    services: [
      "Urgences",
      "Consultations",
      "Maternité",
      "Chirurgie",
      "Radiologie",
      "Laboratoire",
      "Hospitalisation",
      "Médecine du travail"
    ],
    specialties: [
      "Médecine générale",
      "Gynécologie-Obstétrique",
      "Chirurgie générale",
      "Radiologie",
      "Médecine du travail"
    ],
    conventionnement: {
      cnamgs: true,
      cnss: true
    },
    stats: {
      employees: 1250,
      activeEmployees: 1180,
      beds: 85,
      occupancyRate: 68,
      consultationsToday: 42,
      emergenciesToday: 8,
      scheduledAppointments: 156,
      pendingWorkMedExams: 23
    }
  };

  return (
    <SogaraDashboardLayout>
      <div className="space-y-6">
        {/* Header avec informations de l'établissement */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{hospitalData.name}</h1>
                <p className="text-lg text-muted-foreground mt-1">{hospitalData.type}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hospitalData.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {hospitalData.phone}
                  </div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
                    24h/24, 7j/7
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
              <Button size="sm" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications (3)
              </Button>
            </div>
          </div>
        </div>

        {/* Vue d'ensemble */}
        <div className="space-y-6">
            {/* KPIs Principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Employés SOGARA</p>
                      <p className="text-3xl font-bold text-foreground">{hospitalData.stats.employees}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        {hospitalData.stats.activeEmployees} actifs
                      </p>
                    </div>
                    <Users className="w-10 h-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Lits disponibles</p>
                      <p className="text-3xl font-bold text-foreground">
                        {Math.round(hospitalData.stats.beds * (1 - hospitalData.stats.occupancyRate / 100))}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Taux d'occupation: {hospitalData.stats.occupancyRate}%
                      </p>
                    </div>
                    <Bed className="w-10 h-10 text-purple-500" />
                  </div>
                  <Progress value={hospitalData.stats.occupancyRate} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Consultations (Aujourd'hui)</p>
                      <p className="text-3xl font-bold text-foreground">{hospitalData.stats.consultationsToday}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {hospitalData.stats.scheduledAppointments} RDV planifiés
                      </p>
                    </div>
                    <Stethoscope className="w-10 h-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Urgences (Aujourd'hui)</p>
                      <p className="text-3xl font-bold text-foreground">{hospitalData.stats.emergenciesToday}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Délai moyen: 18 min
                      </p>
                    </div>
                    <Siren className="w-10 h-10 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services et Spécialités */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Services Disponibles</CardTitle>
                  <CardDescription>Services offerts par l'établissement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {hospitalData.services.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Spécialités Médicales</CardTitle>
                  <CardDescription>Spécialités pratiquées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {hospitalData.specialties.map((specialty, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm text-foreground">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertes et Actions rapides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Alertes et Rappels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Examens médecine du travail en attente</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {hospitalData.stats.pendingWorkMedExams} employés à convoquer pour visite périodique
                      </p>
                    </div>
                    <Button size="sm" variant="outline">Voir</Button>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <Package className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Stock pharmacie faible</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        12 médicaments sous le seuil d'alerte
                      </p>
                    </div>
                    <Button size="sm" variant="outline">Gérer</Button>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <TestTube className="w-5 h-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Résultats laboratoire prêts</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        8 résultats d'analyses à valider
                      </p>
                    </div>
                    <Button size="sm" variant="outline">Consulter</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => setSelectedTab("consultations")}>
                    <ClipboardList className="w-6 h-6" />
                    <span className="text-sm">Nouvelle Consultation</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => setSelectedTab("emergency")}>
                    <Siren className="w-6 h-6 text-red-500" />
                    <span className="text-sm">Urgence</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => setSelectedTab("employees")}>
                    <Users className="w-6 h-6 text-blue-500" />
                    <span className="text-sm">Rechercher Employé</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => setSelectedTab("work-medicine")}>
                    <UserCog className="w-6 h-6 text-purple-500" />
                    <span className="text-sm">Médecine Travail</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => setSelectedTab("hospitalization")}>
                    <Bed className="w-6 h-6 text-green-500" />
                    <span className="text-sm">Hospitalisation</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => setSelectedTab("technical")}>
                    <Scan className="w-6 h-6 text-orange-500" />
                    <span className="text-sm">Plateaux Tech.</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Conventionnement */}
            <Card>
              <CardHeader>
                <CardTitle>Conventionnement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {hospitalData.conventionnement.cnamgs && (
                    <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30 text-base px-4 py-2">
                      <Activity className="w-4 h-4 mr-2" />
                      Conventionné CNAMGS
                    </Badge>
                  )}
                  {hospitalData.conventionnement.cnss && (
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 text-base px-4 py-2">
                      <Activity className="w-4 h-4 mr-2" />
                      Conventionné CNSS
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </SogaraDashboardLayout>
  );
}

