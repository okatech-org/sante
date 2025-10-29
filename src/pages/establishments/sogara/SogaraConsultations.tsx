import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, Clock, User, Search, Plus,
  Filter, Download, CheckCircle, XCircle, AlertCircle,
  Stethoscope, FileText, Phone
} from "lucide-react";
import { SogaraDashboardLayout } from "@/components/layout/SogaraDashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SogaraConsultations() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const stats = {
    aujourdhui: 42,
    planifies: 156,
    enAttente: 8,
    terminees: 34
  };

  const consultationsAujourdhui = [
    {
      id: "CONS-001",
      heure: "08:00",
      patient: "NZAMBA Jean-Paul",
      matricule: "EMP-SOGARA-1234",
      poste: "Technicien forage",
      motif: "Suivi post-accident",
      medecin: "Dr KOMBILA",
      statut: "terminee",
      salle: "Cabinet 1"
    },
    {
      id: "CONS-002",
      heure: "08:30",
      patient: "MOUSSAVOU Marie",
      matricule: "EMP-SOGARA-5678",
      poste: "Secrétaire direction",
      motif: "Consultation générale",
      medecin: "Dr KOMBILA",
      statut: "en_cours",
      salle: "Cabinet 1"
    },
    {
      id: "CONS-003",
      heure: "09:00",
      patient: "ELLA Pierre",
      matricule: "EMP-SOGARA-9012",
      poste: "Opérateur production",
      motif: "Visite périodique",
      medecin: "Dr KOMBILA",
      statut: "en_attente",
      salle: "Cabinet 1"
    },
    {
      id: "CONS-004",
      heure: "09:30",
      patient: "OBAME Claire",
      matricule: "EMP-SOGARA-3456",
      poste: "Comptable",
      motif: "Certificat médical",
      medecin: "Dr KOMBILA",
      statut: "en_attente",
      salle: "Cabinet 1"
    },
    {
      id: "CONS-005",
      heure: "10:00",
      patient: "NGUEMA Sylvain",
      matricule: "EMP-SOGARA-7890",
      poste: "Chauffeur",
      motif: "Renouvellement ordonnance",
      medecin: "Dr KOMBILA",
      statut: "en_attente",
      salle: "Cabinet 1"
    }
  ];

  const prochainsMedecins = [
    {
      id: "MED-001",
      nom: "Dr KOMBILA Jean-Pierre",
      specialite: "Médecine générale",
      consultations: 12,
      disponible: "08:00 - 17:00",
      salle: "Cabinet 1"
    },
    {
      id: "MED-002",
      nom: "Dr MOUSSAVOU Claire",
      specialite: "Gynécologie-Obstétrique",
      consultations: 8,
      disponible: "09:00 - 16:00",
      salle: "Cabinet 2"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "terminee":
        return <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Terminée
        </Badge>;
      case "en_cours":
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
          <Clock className="w-3 h-3 mr-1" />
          En cours
        </Badge>;
      case "en_attente":
        return <Badge variant="outline" className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          En attente
        </Badge>;
      case "annulee":
        return <Badge variant="outline" className="bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30">
          <XCircle className="w-3 h-3 mr-1" />
          Annulée
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <SogaraDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Consultations</h1>
            <p className="text-muted-foreground">Hôpital de SOGARA / Infirmerie - Port-Gentil</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau RDV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                  <p className="text-3xl font-bold text-foreground">{stats.aujourdhui}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.terminees} terminées</p>
                </div>
                <CalendarIcon className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">RDV planifiés</p>
                  <p className="text-3xl font-bold text-foreground">{stats.planifies}</p>
                  <p className="text-xs text-muted-foreground mt-1">7 prochains jours</p>
                </div>
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-3xl font-bold text-foreground">{stats.enAttente}</p>
                  <p className="text-xs text-muted-foreground mt-1">Patients</p>
                </div>
                <AlertCircle className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Médecins actifs</p>
                  <p className="text-3xl font-bold text-foreground">{prochainsMedecins.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Disponibles</p>
                </div>
                <Stethoscope className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList>
            <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            <TabsTrigger value="doctors">Médecins</TabsTrigger>
          </TabsList>

          {/* Consultations du jour */}
          <TabsContent value="today" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Consultations du jour</CardTitle>
                    <CardDescription>Planning des consultations d'aujourd'hui</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Rechercher patient..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Heure</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Matricule / Poste</TableHead>
                      <TableHead>Motif</TableHead>
                      <TableHead>Médecin</TableHead>
                      <TableHead>Salle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consultationsAujourdhui.map((consultation) => (
                      <TableRow key={consultation.id}>
                        <TableCell className="font-medium">{consultation.heure}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            {consultation.patient}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-mono text-xs text-muted-foreground">{consultation.matricule}</p>
                            <p className="text-muted-foreground">{consultation.poste}</p>
                          </div>
                        </TableCell>
                        <TableCell>{consultation.motif}</TableCell>
                        <TableCell>{consultation.medecin}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{consultation.salle}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(consultation.statut)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendrier */}
          <TabsContent value="calendar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Sélectionner une date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Planning du {selectedDate?.toLocaleDateString('fr-FR')}</CardTitle>
                  <CardDescription>Consultations prévues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Sélectionnez une date pour voir le planning</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Médecins */}
          <TabsContent value="doctors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prochainsMedecins.map((medecin) => (
                <Card key={medecin.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-primary" />
                          {medecin.nom}
                        </CardTitle>
                        <CardDescription>{medecin.specialite}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
                        Disponible
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Consultations</p>
                        <p className="text-2xl font-bold text-foreground">{medecin.consultations}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Horaires</p>
                        <p className="text-sm font-medium text-foreground">{medecin.disponible}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Salle</p>
                      <Badge variant="outline" className="mt-1">{medecin.salle}</Badge>
                    </div>
                    <Button className="w-full gap-2">
                      <Plus className="w-4 h-4" />
                      Prendre RDV
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SogaraDashboardLayout>
  );
}

