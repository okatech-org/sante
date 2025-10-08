import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  Bed,
  Activity,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Package,
  Calendar,
  FileText,
  Settings,
  Bell,
  Ambulance,
  Stethoscope,
  Pill,
  TestTube,
  Scan,
  ClipboardList,
  UserCog
} from "lucide-react";

export default function DemoHospitalDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Données de démonstration pour CHU/CHR
  const hospitalData = {
    name: "CHU Libreville",
    type: "CHU",
    sector: "public",
    capacity: {
      totalBeds: 450,
      occupied: 312,
      available: 138,
      occupancy: 69.3
    },
    services: [
      { name: "Médecine Générale", beds: 80, occupied: 58, rate: 72.5 },
      { name: "Chirurgie", beds: 100, occupied: 75, rate: 75 },
      { name: "Maternité", beds: 60, occupied: 52, rate: 86.7 },
      { name: "Pédiatrie", beds: 70, occupied: 48, rate: 68.6 },
      { name: "Réanimation", beds: 40, occupied: 28, rate: 70 },
      { name: "Urgences", beds: 100, occupied: 51, rate: 51 }
    ],
    emergency: {
      patientsWaiting: 23,
      averageWaitTime: 45,
      triage: {
        critical: 3,
        urgent: 8,
        nonUrgent: 12
      }
    },
    operatingRooms: {
      total: 8,
      inUse: 5,
      scheduled: [
        { time: "14:00", room: 1, procedure: "Appendicectomie" },
        { time: "15:30", room: 3, procedure: "Césarienne" },
        { time: "16:00", room: 2, procedure: "Cholécystectomie" }
      ]
    },
    financials: {
      dailyRevenue: 28500000,
      monthlyRevenue: 645000000,
      sources: {
        cnamgs: 65,
        private: 20,
        insurance: 10,
        other: 5
      },
      outstanding: {
        cnamgs: 285000000,
        insurance: 78000000
      }
    },
    staff: {
      total: 856,
      present: 723,
      doctors: 134,
      nurses: 289,
      technicians: 156,
      administrative: 277
    },
    pharmacy: {
      stockValue: 125000000,
      alerts: [
        { item: "Insuline NPH", stock: 45, daysRemaining: 4, critical: true },
        { item: "Morphine", stock: 120, daysRemaining: 6, critical: true },
        { item: "Paracétamol 500mg", stock: 2400, daysRemaining: 8, critical: false }
      ]
    },
    equipment: {
      operational: 156,
      maintenance: 12,
      broken: 5,
      alerts: [
        { equipment: "IRM", status: "Maintenance prévue", date: "2025-02-15" },
        { equipment: "Scanner 2", status: "Panne", urgency: "high" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{hospitalData.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{hospitalData.type}</Badge>
                  <Badge variant="secondary">{hospitalData.sector}</Badge>
                  <span className="text-sm text-muted-foreground">Tableau de bord direction</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="emergency">Urgences</TabsTrigger>
            <TabsTrigger value="technical">Plateaux Tech.</TabsTrigger>
            <TabsTrigger value="pharmacy">Pharmacie</TabsTrigger>
            <TabsTrigger value="finance">Finances</TabsTrigger>
            <TabsTrigger value="staff">Personnel</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPIs Principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux d'occupation</CardTitle>
                  <Bed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hospitalData.capacity.occupancy}%</div>
                  <Progress value={hospitalData.capacity.occupancy} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {hospitalData.capacity.occupied}/{hospitalData.capacity.totalBeds} lits occupés
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Urgences en attente</CardTitle>
                  <Ambulance className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hospitalData.emergency.patientsWaiting}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Temps moyen: {hospitalData.emergency.averageWaitTime} min
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="destructive">{hospitalData.emergency.triage.critical} Rouge</Badge>
                    <Badge variant="outline">{hospitalData.emergency.triage.urgent} Orange</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recettes journalières</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(hospitalData.financials.dailyRevenue / 1000000).toFixed(1)}M FCFA
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {hospitalData.financials.sources.cnamgs}% CNAMGS • {hospitalData.financials.sources.private}% Privé
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Personnel présent</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {hospitalData.staff.present}/{hospitalData.staff.total}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {hospitalData.staff.doctors} médecins • {hospitalData.staff.nurses} infirmiers
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Occupation par service */}
            <Card>
              <CardHeader>
                <CardTitle>Occupation par service</CardTitle>
                <CardDescription>Répartition en temps réel des lits disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hospitalData.services.map((service) => (
                    <div key={service.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {service.occupied}/{service.beds} lits ({service.rate.toFixed(1)}%)
                        </div>
                      </div>
                      <Progress 
                        value={service.rate} 
                        className={service.rate > 85 ? "bg-red-100" : ""} 
                      />
                      {service.rate > 85 && (
                        <div className="flex items-center gap-2 text-sm text-amber-600">
                          <AlertCircle className="h-3 w-3" />
                          <span>Service proche de la saturation</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alertes et Blocs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alertes Stock Pharmacie */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Alertes Stock Pharmacie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hospitalData.pharmacy.alerts.map((alert, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          alert.critical ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{alert.item}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Stock: {alert.stock} • {alert.daysRemaining} jours restants
                            </div>
                          </div>
                          <Badge variant={alert.critical ? "destructive" : "outline"}>
                            {alert.critical ? "Critique" : "Attention"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Blocs Opératoires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Blocs Opératoires
                  </CardTitle>
                  <CardDescription>
                    {hospitalData.operatingRooms.inUse}/{hospitalData.operatingRooms.total} salles en cours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hospitalData.operatingRooms.scheduled.map((surgery, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-bold text-primary">S{surgery.room}</span>
                          </div>
                          <div>
                            <div className="font-medium">{surgery.procedure}</div>
                            <div className="text-sm text-muted-foreground">{surgery.time}</div>
                          </div>
                        </div>
                        <Badge variant="outline">Programmée</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Équipements critiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Alertes Équipements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hospitalData.equipment.alerts.map((alert, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        alert.urgency === 'high' ? 'border-red-300 bg-red-50' : 'border-blue-300 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Scan className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{alert.equipment}</div>
                          <div className="text-sm text-muted-foreground">{alert.status}</div>
                        </div>
                      </div>
                      <Badge variant={alert.urgency === 'high' ? "destructive" : "secondary"}>
                        {alert.urgency === 'high' ? 'Urgent' : alert.date}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Autres onglets */}
          <TabsContent value="admissions">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Admissions</CardTitle>
                <CardDescription>Processus d'admission et suivi des patients hospitalisés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Module en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle>Service des Urgences</CardTitle>
                <CardDescription>Gestion du flux et triage des urgences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Ambulance className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Module en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle>Plateaux Techniques</CardTitle>
                <CardDescription>Laboratoire, Imagerie, et autres services techniques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Module en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pharmacy">
            <Card>
              <CardHeader>
                <CardTitle>Pharmacie Hospitalière</CardTitle>
                <CardDescription>Gestion des stocks et dispensation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Module en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance">
            <Card>
              <CardHeader>
                <CardTitle>Gestion Financière</CardTitle>
                <CardDescription>Facturation, recouvrement et analyse financière</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Module en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Personnel</CardTitle>
                <CardDescription>Planning, gardes et ressources humaines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Module en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
