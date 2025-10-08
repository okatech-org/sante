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
  Stethoscope,
  Pill,
  TestTube,
  Scan,
  ClipboardList,
  UserCog,
  Star,
  Clock
} from "lucide-react";

export default function DemoClinicDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Données de démonstration pour clinique privée
  const clinicData = {
    name: "Polyclinique El-Rapha",
    type: "Polyclinique",
    sector: "privé",
    capacity: {
      totalBeds: 120,
      occupied: 78,
      available: 42,
      occupancy: 65
    },
    services: [
      { name: "Médecine Générale", beds: 30, occupied: 23, rate: 76.7 },
      { name: "Chirurgie", beds: 25, occupied: 16, rate: 64 },
      { name: "Maternité", beds: 20, occupied: 17, rate: 85 },
      { name: "Pédiatrie", beds: 15, occupied: 10, rate: 66.7 },
      { name: "Réanimation", beds: 10, occupied: 4, rate: 40 },
      { name: "Urgences", beds: 20, occupied: 8, rate: 40 }
    ],
    consultations: {
      today: 67,
      scheduled: 23,
      waitingRoom: 8,
      averageWaitTime: 18
    },
    operatingRooms: {
      total: 3,
      inUse: 1,
      scheduled: [
        { time: "14:00", room: 1, procedure: "Hernie inguinale", surgeon: "Dr OBIANG" },
        { time: "16:00", room: 2, procedure: "Cholécystectomie", surgeon: "Dr ELLA" }
      ]
    },
    financials: {
      dailyRevenue: 12500000,
      monthlyRevenue: 375000000,
      yearlyTarget: 4500000000,
      sources: {
        cnamgs: 30,
        insurance: 35,
        private: 30,
        corporate: 5
      },
      outstanding: {
        cnamgs: 130000000,
        insurance: 45000000,
        corporate: 23000000
      },
      dailyBreakdown: {
        consultations: 3125000,
        hospitalizations: 4375000,
        examinations: 2500000,
        pharmacy: 1875000,
        other: 625000
      }
    },
    staff: {
      total: 234,
      present: 198,
      doctors: 45,
      specialists: 23,
      nurses: 89,
      technicians: 23,
      administrative: 54
    },
    pharmacy: {
      stockValue: 45000000,
      alerts: [
        { item: "Insuline NPH", stock: 12, daysRemaining: 3, critical: true },
        { item: "Paracétamol 500mg", stock: 500, daysRemaining: 5, critical: false }
      ],
      ordersInProgress: 3
    },
    equipment: {
      mri: {
        available: true,
        brand: "Siemens",
        model: "MAGNETOM Aera 1.5T",
        available24h: true,
        status: "optimal"
      },
      scanner: {
        available: true,
        brand: "GE",
        model: "Revolution EVO 64",
        available24h: true,
        status: "optimal"
      },
      radiology: 2,
      ultrasound: 4
    },
    quality: {
      patientSatisfaction: 4.3,
      reviewCount: 567,
      nps: 42,
      certifications: ["ISO 9001:2015", "Accréditation MSP"]
    },
    appointments: {
      today: 87,
      tomorrow: 92,
      thisWeek: 456
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
                <h1 className="text-2xl font-bold">{clinicData.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{clinicData.type}</Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    {clinicData.sector}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{clinicData.quality.patientSatisfaction}</span>
                    <span className="text-muted-foreground">({clinicData.quality.reviewCount} avis)</span>
                  </div>
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="imaging">Imagerie</TabsTrigger>
            <TabsTrigger value="pharmacy">Pharmacie</TabsTrigger>
            <TabsTrigger value="finance">Finances</TabsTrigger>
            <TabsTrigger value="quality">Qualité</TabsTrigger>
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
                  <div className="text-2xl font-bold">{clinicData.capacity.occupancy}%</div>
                  <Progress value={clinicData.capacity.occupancy} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {clinicData.capacity.occupied}/{clinicData.capacity.totalBeds} lits occupés
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Consultations du jour</CardTitle>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clinicData.consultations.today}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {clinicData.consultations.waitingRoom} en salle d'attente
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">Attente moy: {clinicData.consultations.averageWaitTime} min</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CA Journalier</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(clinicData.financials.dailyRevenue / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Objectif mensuel: {(clinicData.financials.monthlyRevenue / 1000000).toFixed(0)}M FCFA
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs">+12% vs mois dernier</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clinicData.quality.patientSatisfaction}/5</div>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(clinicData.quality.patientSatisfaction)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    NPS: {clinicData.quality.nps} • {clinicData.quality.reviewCount} avis
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Ventilation CA */}
            <Card>
              <CardHeader>
                <CardTitle>Recettes Journalières par Source</CardTitle>
                <CardDescription>Répartition du chiffre d'affaires</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Consultations</div>
                    <div className="text-2xl font-bold">
                      {(clinicData.financials.dailyBreakdown.consultations / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-green-600">25%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Hospitalisations</div>
                    <div className="text-2xl font-bold">
                      {(clinicData.financials.dailyBreakdown.hospitalizations / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-green-600">35%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Examens</div>
                    <div className="text-2xl font-bold">
                      {(clinicData.financials.dailyBreakdown.examinations / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-green-600">20%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Pharmacie</div>
                    <div className="text-2xl font-bold">
                      {(clinicData.financials.dailyBreakdown.pharmacy / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-green-600">15%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Autres</div>
                    <div className="text-2xl font-bold">
                      {(clinicData.financials.dailyBreakdown.other / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-green-600">5%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Occupation et Blocs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Occupation par service */}
              <Card>
                <CardHeader>
                  <CardTitle>Occupation par service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clinicData.services.map((service) => (
                      <div key={service.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{service.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {service.occupied}/{service.beds} ({service.rate.toFixed(0)}%)
                          </span>
                        </div>
                        <Progress value={service.rate} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Blocs opératoires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Blocs Opératoires
                  </CardTitle>
                  <CardDescription>
                    {clinicData.operatingRooms.inUse}/{clinicData.operatingRooms.total} salle(s) en cours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {clinicData.operatingRooms.scheduled.map((surgery, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-bold text-primary">B{surgery.room}</span>
                          </div>
                          <div>
                            <div className="font-medium">{surgery.procedure}</div>
                            <div className="text-sm text-muted-foreground">
                              {surgery.time} • {surgery.surgeon}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">Programmée</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Créances et Équipements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Créances en attente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Créances en attente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">CNAMGS</div>
                        <div className="text-sm text-muted-foreground">Retard moyen: 65 jours</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {(clinicData.financials.outstanding.cnamgs / 1000000).toFixed(0)}M
                        </div>
                        <Badge variant="destructive">Critique</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Assurances</div>
                        <div className="text-sm text-muted-foreground">Retard moyen: 45 jours</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {(clinicData.financials.outstanding.insurance / 1000000).toFixed(0)}M
                        </div>
                        <Badge variant="outline">Normal</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Équipements Premium */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="h-5 w-5" />
                    Équipements Techniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">IRM {clinicData.equipment.mri.brand}</div>
                        <Badge className="bg-green-100 text-green-800">
                          {clinicData.equipment.mri.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{clinicData.equipment.mri.model}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">24/7</Badge>
                        <span className="text-xs text-muted-foreground">Seul IRM 24/7 au Gabon</span>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Scanner {clinicData.equipment.scanner.brand}</div>
                        <Badge className="bg-green-100 text-green-800">
                          {clinicData.equipment.scanner.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{clinicData.equipment.scanner.model}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">24/7</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Autres onglets */}
          <TabsContent value="consultations">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Consultations</CardTitle>
                <CardDescription>Planning et suivi des consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Module en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="imaging">
            <Card>
              <CardHeader>
                <CardTitle>Service d'Imagerie</CardTitle>
                <CardDescription>IRM, Scanner, Radiologie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Module en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pharmacy">
            <Card>
              <CardHeader>
                <CardTitle>Pharmacie</CardTitle>
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
                <CardTitle>Analyse Financière</CardTitle>
                <CardDescription>Comptabilité et trésorerie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Module en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality">
            <Card>
              <CardHeader>
                <CardTitle>Qualité et Satisfaction</CardTitle>
                <CardDescription>Suivi des indicateurs qualité</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
