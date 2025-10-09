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

import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";

export default function DemoHospitalDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Données de démonstration pour CHU OWENDO
  const hospitalData = {
    name: "CHU OWENDO",
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
    <HospitalDashboardLayout>
      <div className="space-y-6">
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
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7">
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

          {/* Admissions */}
          <TabsContent value="admissions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Admissions aujourd'hui</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground mt-1">+3 vs hier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sorties prévues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground mt-1">Aujourd'hui</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Patients hospitalisés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">312</div>
                  <p className="text-xs text-muted-foreground mt-1">Sur 450 lits</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Durée séjour moyenne</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5.2 j</div>
                  <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Admissions récentes</CardTitle>
                <CardDescription>Patients admis dans les dernières 24 heures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "MOUSSAVOU Marie", age: 38, service: "Médecine Générale", time: "08:30", diagnosis: "Paludisme confirmé", cnamgs: "GAB123456789" },
                    { name: "OBAME Jean", age: 52, service: "Cardiologie", time: "10:15", diagnosis: "Insuffisance cardiaque", cnamgs: "GAB987654321" },
                    { name: "ELLA Patricia", age: 28, service: "Maternité", time: "12:45", diagnosis: "Travail en cours", cnamgs: "GAB456789123" },
                    { name: "NZENGUE Paul", age: 65, service: "Chirurgie", time: "14:20", diagnosis: "Fracture col fémur", cnamgs: "GAB321654987" },
                    { name: "BOUNGUENZA Sophie", age: 42, service: "Réanimation", time: "16:00", diagnosis: "AVC ischémique", cnamgs: "GAB789123456" }
                  ].map((patient, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{patient.name}</span>
                            <Badge variant="outline" className="text-xs">{patient.age} ans</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{patient.diagnosis}</div>
                          <div className="text-xs text-muted-foreground mt-1">CNAMGS: {patient.cnamgs}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-2">{patient.service}</Badge>
                        <div className="text-xs text-muted-foreground">{patient.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Origine des admissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { origin: "Urgences", count: 12, percentage: 52 },
                      { origin: "Consultations externes", count: 6, percentage: 26 },
                      { origin: "Programmées", count: 4, percentage: 17 },
                      { origin: "Transferts", count: 1, percentage: 5 }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.origin}</span>
                          <span className="font-medium">{item.count} patients ({item.percentage}%)</span>
                        </div>
                        <Progress value={item.percentage} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prévisions de sortie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: "Aujourd'hui", count: 18, status: "confirmed" },
                      { date: "Demain", count: 24, status: "planned" },
                      { date: "48h", count: 31, status: "planned" },
                      { date: "Cette semaine", count: 89, status: "estimated" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{item.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{item.count}</span>
                          <Badge variant={item.status === 'confirmed' ? 'default' : 'outline'}>
                            {item.status === 'confirmed' ? 'Confirmé' : item.status === 'planned' ? 'Prévu' : 'Estimé'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Urgences */}
          <TabsContent value="emergency" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Patients en attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">23</div>
                  <p className="text-xs text-muted-foreground mt-1">Temps moy: 45 min</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Urgences vitales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <Badge variant="destructive" className="mt-1">Priorité absolue</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Passages aujourd'hui</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground mt-1">+15% vs hier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taux hospitalisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42%</div>
                  <p className="text-xs text-muted-foreground mt-1">54 admissions</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    Urgences Vitales (Rouge)
                  </CardTitle>
                  <CardDescription>Prise en charge immédiate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "PATIENT A", age: 58, reason: "Arrêt cardiaque", time: "En cours", room: "Salle 1" },
                      { name: "PATIENT B", age: 34, reason: "Polytraumatisme", time: "5 min", room: "Salle 2" },
                      { name: "PATIENT C", age: 71, reason: "AVC aigu", time: "12 min", room: "Attente" }
                    ].map((patient, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-red-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{patient.name}, {patient.age}ans</span>
                          <Badge variant="destructive">{patient.room}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{patient.reason}</div>
                        <div className="text-xs text-red-600 mt-1">⏱️ {patient.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <AlertCircle className="h-5 w-5" />
                    Urgences Relatives (Orange)
                  </CardTitle>
                  <CardDescription>Prise en charge &lt; 30 min</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "NZENGUE Marie", age: 45, reason: "Douleur thoracique", time: "18 min" },
                      { name: "OBAME Jean", age: 62, reason: "Dyspnée sévère", time: "22 min" },
                      { name: "ELLA Patricia", age: 38, reason: "Hémorragie digestive", time: "25 min" },
                      { name: "MOUSSAVOU Paul", age: 51, reason: "Crise d'asthme", time: "28 min" }
                    ].map((patient, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-orange-300">
                        <div className="font-medium">{patient.name}, {patient.age}ans</div>
                        <div className="text-sm text-muted-foreground mt-1">{patient.reason}</div>
                        <div className="text-xs text-orange-600 mt-1">⏱️ Attente: {patient.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <AlertCircle className="h-5 w-5" />
                    Non Urgent (Vert)
                  </CardTitle>
                  <CardDescription>Prise en charge &lt; 2h</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "BOUNGUENZA Sophie", age: 29, reason: "Entorse cheville", time: "35 min" },
                      { name: "MBOUMBA Pierre", age: 41, reason: "Plaie superficielle", time: "42 min" },
                      { name: "NTOUTOUME Alice", age: 33, reason: "Céphalées", time: "58 min" },
                      { name: "OVONO David", age: 25, reason: "Lombalgie", time: "1h15" }
                    ].map((patient, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-green-300">
                        <div className="font-medium">{patient.name}, {patient.age}ans</div>
                        <div className="text-sm text-muted-foreground mt-1">{patient.reason}</div>
                        <div className="text-xs text-green-600 mt-1">⏱️ Attente: {patient.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Équipe de garde actuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">Dr MBOUMBA Jean</div>
                          <div className="text-sm text-muted-foreground">Urgentiste senior</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Infirmiers</div>
                        <div className="text-lg font-bold">8</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Aides-soignants</div>
                        <div className="text-lg font-bold">4</div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-900">Prochaine relève</div>
                      <div className="text-lg font-bold text-blue-900">14:00 - Équipe B</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistiques du jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Admissions</span>
                        <span className="font-medium">54 patients (42%)</span>
                      </div>
                      <Progress value={42} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Soins sur place</span>
                        <span className="font-medium">58 patients (46%)</span>
                      </div>
                      <Progress value={46} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Retours à domicile</span>
                        <span className="font-medium">15 patients (12%)</span>
                      </div>
                      <Progress value={12} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-3 border rounded-lg">
                        <div className="text-xs text-muted-foreground">Temps attente moy.</div>
                        <div className="text-xl font-bold">45 min</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-xs text-muted-foreground">Durée séjour moy.</div>
                        <div className="text-xl font-bold">3.2 h</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Plateaux Techniques */}
          <TabsContent value="technical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Laboratoire */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Laboratoire
                  </CardTitle>
                  <CardDescription>Analyses en cours et résultats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-2xl font-bold">67</div>
                        <div className="text-xs text-muted-foreground">En attente</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-2xl font-bold">23</div>
                        <div className="text-xs text-muted-foreground">En cours</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-2xl font-bold">156</div>
                        <div className="text-xs text-muted-foreground">Terminés</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Analyses en cours</div>
                      {[
                        { patient: "MOUSSAVOU M.", tests: "NFS, CRP", urgency: "Normal", time: "45 min" },
                        { patient: "OBAME J.", tests: "Glycémie, HbA1c", urgency: "Normal", time: "1h20" },
                        { patient: "ELLA P.", tests: "Hémocultures", urgency: "Urgent", time: "2h15" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{item.patient}</div>
                            <div className="text-xs text-muted-foreground">{item.tests}</div>
                          </div>
                          <div className="text-right">
                            <Badge variant={item.urgency === 'Urgent' ? 'destructive' : 'outline'} className="text-xs">
                              {item.urgency}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">{item.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
                        <AlertCircle className="h-4 w-4" />
                        Réactifs en stock limité
                      </div>
                      <div className="text-xs text-amber-800 mt-1">
                        • Réactifs hématologie: 4 jours<br />
                        • Réactifs biochimie: 6 jours
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Imagerie */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="h-5 w-5" />
                    Imagerie Médicale
                  </CardTitle>
                  <CardDescription>Planning examens et équipements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Scanner</span>
                          <Badge className="bg-green-100 text-green-800">Actif</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">3/8 créneaux occupés</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">IRM</span>
                          <Badge className="bg-red-100 text-red-800">Maintenance</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">Indisponible</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Examens programmés</div>
                      {[
                        { time: "14:00", type: "Scanner thorax", patient: "NZENGUE P.", urgency: "Normal" },
                        { time: "15:30", type: "Radio bassin", patient: "BOUNGUENZA S.", urgency: "Urgent" },
                        { time: "16:00", type: "Echo abdo", patient: "MBOUMBA J.", urgency: "Normal" }
                      ].map((exam, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium">{exam.time}</div>
                            <div>
                              <div className="text-sm font-medium">{exam.type}</div>
                              <div className="text-xs text-muted-foreground">{exam.patient}</div>
                            </div>
                          </div>
                          <Badge variant={exam.urgency === 'Urgent' ? 'destructive' : 'outline'} className="text-xs">
                            {exam.urgency}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Liste d'attente</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 border rounded text-center">
                          <div className="text-lg font-bold">12</div>
                          <div className="text-xs text-muted-foreground">Scanner</div>
                          <div className="text-xs text-amber-600">~3 jours</div>
                        </div>
                        <div className="p-2 border rounded text-center">
                          <div className="text-lg font-bold">34</div>
                          <div className="text-xs text-muted-foreground">IRM</div>
                          <div className="text-xs text-red-600">~12 jours</div>
                        </div>
                        <div className="p-2 border rounded text-center">
                          <div className="text-lg font-bold">8</div>
                          <div className="text-xs text-muted-foreground">Echo</div>
                          <div className="text-xs text-green-600">~1 jour</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>État des équipements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Opérationnels</span>
                      <span className="text-lg font-bold text-green-600">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Maintenance préventive</span>
                      <span className="text-lg font-bold text-blue-600">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">En panne</span>
                      <span className="text-lg font-bold text-red-600">5</span>
                    </div>
                    <Progress value={90} className="mt-4" />
                    <div className="text-xs text-muted-foreground text-center">
                      90% de disponibilité
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Alertes maintenance prioritaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { equipment: "IRM Siemens", issue: "Maintenance préventive trimestrielle", urgency: "medium", date: "2025-02-15" },
                      { equipment: "Scanner 2 - Salle B", issue: "Panne système injection", urgency: "high", date: "En cours" },
                      { equipment: "Automate hématologie", issue: "Calibration nécessaire", urgency: "medium", date: "2025-02-10" },
                      { equipment: "Échographe 3", issue: "Sonde défaillante", urgency: "low", date: "2025-02-20" }
                    ].map((alert, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          alert.urgency === 'high' ? 'border-red-300 bg-red-50' :
                          alert.urgency === 'medium' ? 'border-amber-300 bg-amber-50' :
                          'border-blue-300 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <AlertCircle className={`h-5 w-5 ${
                            alert.urgency === 'high' ? 'text-red-600' :
                            alert.urgency === 'medium' ? 'text-amber-600' :
                            'text-blue-600'
                          }`} />
                          <div>
                            <div className="font-medium">{alert.equipment}</div>
                            <div className="text-sm text-muted-foreground">{alert.issue}</div>
                          </div>
                        </div>
                        <Badge variant={alert.urgency === 'high' ? 'destructive' : alert.urgency === 'medium' ? 'outline' : 'secondary'}>
                          {alert.date}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pharmacie */}
          <TabsContent value="pharmacy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Valeur du stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">125M FCFA</div>
                  <p className="text-xs text-muted-foreground mt-1">+5% vs mois dernier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Alertes rupture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">12</div>
                  <p className="text-xs text-muted-foreground mt-1">3 critiques</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Commandes en cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground mt-1">45M FCFA</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Consommation/jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2M</div>
                  <p className="text-xs text-muted-foreground mt-1">Moyenne mobile</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Alertes Rupture de Stock
                  </CardTitle>
                  <CardDescription>Médicaments nécessitant une commande urgente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: "Insuline NPH 100UI", stock: 45, unit: "flacons", days: 4, critical: true, consumption: 12 },
                      { name: "Morphine 10mg", stock: 120, unit: "ampoules", days: 6, critical: true, consumption: 20 },
                      { name: "Dopamine 200mg", stock: 8, unit: "ampoules", days: 3, critical: true, consumption: 3 },
                      { name: "Paracétamol 500mg", stock: 2400, unit: "cp", days: 8, critical: false, consumption: 300 },
                      { name: "Amoxicilline 1g", stock: 1500, unit: "cp", days: 7, critical: false, consumption: 215 }
                    ].map((item, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          item.critical ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Stock actuel: {item.stock} {item.unit}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Consommation: {item.consumption} {item.unit}/jour
                            </div>
                          </div>
                          <Badge variant={item.critical ? "destructive" : "outline"}>
                            {item.days}j restants
                          </Badge>
                        </div>
                        <Progress 
                          value={(item.days / 30) * 100} 
                          className={item.critical ? "bg-red-200" : "bg-amber-200"}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Commandes en cours</CardTitle>
                  <CardDescription>Livraisons attendues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { 
                        supplier: "UbiPharm Gabon", 
                        date: "2025-02-03", 
                        amount: 12000000, 
                        items: 45,
                        status: "En transit"
                      },
                      { 
                        supplier: "Laborex Afrique", 
                        date: "2025-02-05", 
                        amount: 18000000, 
                        items: 67,
                        status: "Préparation"
                      },
                      { 
                        supplier: "Pharma Centrale", 
                        date: "2025-02-08", 
                        amount: 15000000, 
                        items: 52,
                        status: "Confirmée"
                      }
                    ].map((order, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{order.supplier}</div>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <div className="text-muted-foreground text-xs">Montant</div>
                            <div className="font-medium">{(order.amount / 1000000).toFixed(1)}M</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">Articles</div>
                            <div className="font-medium">{order.items}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">Livraison</div>
                            <div className="font-medium">{new Date(order.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button className="w-full mt-4" variant="outline">
                      <Package className="h-4 w-4 mr-2" />
                      Nouvelle commande
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top 10 Médicaments les plus consommés</CardTitle>
                <CardDescription>Derniers 30 jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Paracétamol 500mg", qty: 9000, value: 450000, trend: "+5%" },
                    { name: "Amoxicilline 1g", qty: 6450, value: 1935000, trend: "+12%" },
                    { name: "Métronidazole 500mg", qty: 4200, value: 840000, trend: "-3%" },
                    { name: "Artésunate injectable", qty: 3800, value: 5700000, trend: "+8%" },
                    { name: "Sérum physiologique 500ml", qty: 3200, value: 800000, trend: "+2%" },
                    { name: "Oméprazole 20mg", qty: 2800, value: 560000, trend: "+15%" },
                    { name: "Diazépam 10mg", qty: 2400, value: 480000, trend: "-5%" },
                    { name: "Furosémide 40mg", qty: 2100, value: 315000, trend: "+7%" },
                    { name: "Insuline Rapide", qty: 1800, value: 9000000, trend: "+10%" },
                    { name: "Morphine 10mg", qty: 1500, value: 3000000, trend: "+4%" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-lg font-bold text-muted-foreground w-8">#{idx + 1}</div>
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.qty.toLocaleString('fr-FR')} unités • {(item.value / 1000).toFixed(0)}K FCFA
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="h-4 w-4" />
                        {item.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finances */}
          <TabsContent value="finance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recettes du jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28.5M FCFA</div>
                  <p className="text-xs text-muted-foreground mt-1">+8% vs hier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recettes du mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">645M FCFA</div>
                  <p className="text-xs text-muted-foreground mt-1">82% de l'objectif</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Créances totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">363M</div>
                  <p className="text-xs text-muted-foreground mt-1">CNAMGS + Assurances</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taux recouvrement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des recettes journalières</CardTitle>
                  <CardDescription>Sources de paiement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { source: "CNAMGS", amount: 18525000, percentage: 65, color: "bg-blue-500" },
                      { source: "Paiement direct", amount: 5700000, percentage: 20, color: "bg-green-500" },
                      { source: "Assurances privées", amount: 2850000, percentage: 10, color: "bg-purple-500" },
                      { source: "Entreprises", amount: 1425000, percentage: 5, color: "bg-orange-500" }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                            <span className="font-medium">{item.source}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{(item.amount / 1000000).toFixed(1)}M FCFA</div>
                            <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ventilation par type de prestation</CardTitle>
                  <CardDescription>Aujourd'hui</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "Hospitalisations", amount: 9975000, percentage: 35 },
                      { type: "Urgences", amount: 7980000, percentage: 28 },
                      { type: "Consultations", amount: 4275000, percentage: 15 },
                      { type: "Examens", amount: 3990000, percentage: 14 },
                      { type: "Actes chirurgicaux", amount: 2280000, percentage: 8 }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.type}</span>
                          <span className="font-medium">{(item.amount / 1000000).toFixed(2)}M ({item.percentage}%)</span>
                        </div>
                        <Progress value={item.percentage} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Créances en attente de paiement
                </CardTitle>
                <CardDescription>Suivi des factures impayées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg border-red-300 bg-red-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">CNAMGS</span>
                        <Badge variant="destructive">Critique</Badge>
                      </div>
                      <div className="text-2xl font-bold text-red-700">285M FCFA</div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Retard moyen: 90 jours
                      </div>
                      <div className="mt-3 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>0-30j:</span>
                          <span className="font-medium">45M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>31-60j:</span>
                          <span className="font-medium">85M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>61-90j:</span>
                          <span className="font-medium">95M</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>&gt;90j:</span>
                          <span className="font-medium">60M</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg border-amber-300 bg-amber-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Assurances</span>
                        <Badge variant="outline">Attention</Badge>
                      </div>
                      <div className="text-2xl font-bold text-amber-700">78M FCFA</div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Retard moyen: 45 jours
                      </div>
                      <div className="mt-3 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>NSIA:</span>
                          <span className="font-medium">32M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SUNU:</span>
                          <span className="font-medium">28M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>OGAR:</span>
                          <span className="font-medium">18M</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Actions en cours</span>
                      </div>
                      <div className="space-y-2 mt-4">
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Relances (23)
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          RDV CNAMGS
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Contentieux (3)
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Activity className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <div className="font-medium text-blue-900">Stratégies de recouvrement</div>
                        <ul className="text-sm text-blue-800 mt-2 space-y-1">
                          <li>• Plan d'apurement négocié avec CNAMGS: 30M/mois</li>
                          <li>• Commission de suivi mensuelle avec assurances</li>
                          <li>• Dossiers &gt;120j transférés au service juridique</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution mensuelle des recettes</CardTitle>
                  <CardDescription>6 derniers mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { month: "Septembre", amount: 587, trend: "+3%" },
                      { month: "Octobre", amount: 612, trend: "+4%" },
                      { month: "Novembre", amount: 598, trend: "-2%" },
                      { month: "Décembre", amount: 645, trend: "+8%" },
                      { month: "Janvier", amount: 623, trend: "-3%" },
                      { month: "Février (en cours)", amount: 645, trend: "+4%" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{item.month}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold">{item.amount}M FCFA</span>
                          <Badge variant={item.trend.startsWith('+') ? 'default' : 'secondary'}>
                            {item.trend}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Indicateurs de performance</CardTitle>
                  <CardDescription>Objectifs vs réalisé</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Objectif mensuel</span>
                        <span className="font-medium">82% atteint</span>
                      </div>
                      <Progress value={82} />
                      <div className="text-xs text-muted-foreground">
                        645M / 785M FCFA
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Taux recouvrement</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <Progress value={68} className="bg-red-100" />
                      <div className="text-xs text-red-600">
                        Objectif: 85%
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Revenus CNAMGS</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <Progress value={65} />
                      <div className="text-xs text-muted-foreground">
                        Part dans le CA total
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">Coût/patient</div>
                        <div className="text-xl font-bold">145K</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">Revenue/lit/jour</div>
                        <div className="text-xl font-bold">63K</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Personnel */}
          <TabsContent value="staff" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Effectif total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">856</div>
                  <p className="text-xs text-muted-foreground mt-1">Employés permanents</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Présents aujourd'hui</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">723</div>
                  <p className="text-xs text-muted-foreground mt-1">84% du personnel</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Absences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">133</div>
                  <p className="text-xs text-muted-foreground mt-1">Congés, maladie, formation</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Gardes en cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">67</div>
                  <p className="text-xs text-muted-foreground mt-1">Équipe B - 14h-22h</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par catégorie</CardTitle>
                  <CardDescription>Effectif permanent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: "Médecins", count: 134, present: 112, color: "bg-blue-500" },
                      { category: "Infirmiers", count: 289, present: 245, color: "bg-green-500" },
                      { category: "Techniciens", count: 156, present: 132, color: "bg-purple-500" },
                      { category: "Administratifs", count: 277, present: 234, color: "bg-orange-500" }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                            <span className="font-medium">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{item.present}/{item.count}</div>
                            <div className="text-xs text-muted-foreground">
                              {((item.present / item.count) * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                        <Progress value={(item.present / item.count) * 100} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Système de gardes</CardTitle>
                  <CardDescription>Rotation 3x8</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-blue-600">En cours</Badge>
                        <span className="text-sm font-medium">Équipe B</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">14:00 - 22:00</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-muted-foreground">Médecins</div>
                          <div className="font-bold">23</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Infirmiers</div>
                          <div className="font-bold">34</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Autres</div>
                          <div className="font-bold">10</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Équipe A</div>
                          <div className="text-sm text-muted-foreground">06:00 - 14:00</div>
                        </div>
                        <Badge variant="outline">Repos</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Équipe C</div>
                          <div className="text-sm text-muted-foreground">22:00 - 06:00</div>
                        </div>
                        <Badge variant="secondary">Prochaine (22:00)</Badge>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
                        <AlertCircle className="h-4 w-4" />
                        Relève dans 5h30
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Présence par service</CardTitle>
                <CardDescription>Personnel en poste actuellement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { service: "Urgences", medical: 15, nurses: 28, support: 8, required: 52, status: "ok" },
                    { service: "Réanimation", medical: 8, nurses: 16, support: 4, required: 28, status: "ok" },
                    { service: "Chirurgie", medical: 12, nurses: 24, support: 6, required: 45, status: "warning" },
                    { service: "Médecine", medical: 18, nurses: 32, support: 8, required: 58, status: "ok" },
                    { service: "Maternité", medical: 10, nurses: 18, support: 4, required: 32, status: "ok" },
                    { service: "Pédiatrie", medical: 8, nurses: 14, support: 3, required: 25, status: "ok" }
                  ].map((service, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 border rounded-lg ${
                        service.status === 'warning' ? 'border-amber-300 bg-amber-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{service.service}</span>
                        <Badge variant={service.status === 'ok' ? 'default' : 'outline'}>
                          {service.medical + service.nurses + service.support}/{service.required}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Médecins</span>
                          <span className="font-medium">{service.medical}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Infirmiers</span>
                          <span className="font-medium">{service.nurses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Support</span>
                          <span className="font-medium">{service.support}</span>
                        </div>
                      </div>
                      {service.status === 'warning' && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-amber-700">
                          <AlertCircle className="h-3 w-3" />
                          <span>Sous-effectif</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Absences et congés</CardTitle>
                  <CardDescription>Cette semaine</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-2xl font-bold">45</div>
                        <div className="text-xs text-muted-foreground">Congés</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-2xl font-bold">23</div>
                        <div className="text-xs text-muted-foreground">Maladie</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-xs text-muted-foreground">Formation</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-2xl font-bold">8</div>
                        <div className="text-xs text-muted-foreground">Mission</div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      {[
                        { name: "Dr NZENGUE Marie", type: "Congé annuel", dates: "3-10 Fév", service: "Cardiologie" },
                        { name: "Inf. OBAME Jean", type: "Maladie", dates: "1-5 Fév", service: "Urgences" },
                        { name: "Dr ELLA Patricia", type: "Formation", dates: "5-7 Fév", service: "Pédiatrie" }
                      ].map((absence, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{absence.name}</div>
                            <div className="text-sm text-muted-foreground">{absence.service}</div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{absence.type}</Badge>
                            <div className="text-xs text-muted-foreground mt-1">{absence.dates}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Heures supplémentaires</CardTitle>
                  <CardDescription>Ce mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 border rounded-lg text-center">
                        <div className="text-3xl font-bold">2,345</div>
                        <div className="text-sm text-muted-foreground mt-1">Heures totales</div>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <div className="text-3xl font-bold">156M</div>
                        <div className="text-sm text-muted-foreground mt-1">Coût FCFA</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium mb-2">Top 5 services</div>
                      {[
                        { service: "Urgences", hours: 567, cost: 37800000 },
                        { service: "Réanimation", hours: 423, cost: 28200000 },
                        { service: "Chirurgie", hours: 389, cost: 25935000 },
                        { service: "Maternité", hours: 312, cost: 20800000 },
                        { service: "Médecine", hours: 289, cost: 19265000 }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{item.service}</span>
                          <div className="text-right">
                            <div className="text-sm font-bold">{item.hours}h</div>
                            <div className="text-xs text-muted-foreground">
                              {(item.cost / 1000000).toFixed(1)}M
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </HospitalDashboardLayout>
  );
}

