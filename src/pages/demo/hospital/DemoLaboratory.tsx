import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TestTube, Search, Clock, CheckCircle, AlertCircle, 
  TrendingUp, Download, User, Calendar, Activity
} from "lucide-react";
import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";

export default function DemoLaboratory() {
  const [searchTerm, setSearchTerm] = useState("");

  const pendingAnalyses = [
    {
      id: "LAB-2025-1234",
      patient: "MOUSSAVOU Marie",
      age: 39,
      service: "Médecine",
      medecin: "Dr NZENGUE",
      analyses: ["NFS", "CRP", "Glycémie", "Créatinine"],
      priorite: "normale",
      preleveLe: "2025-02-01 08:30",
      statut: "en_attente",
      technicien: "Non attribué"
    },
    {
      id: "LAB-2025-1235",
      patient: "OBAME Jean",
      age: 52,
      service: "Cardiologie",
      medecin: "Dr MBOUMBA",
      analyses: ["Troponine", "NT-proBNP", "D-Dimères"],
      priorite: "urgente",
      preleveLe: "2025-02-01 09:15",
      statut: "en_cours",
      technicien: "Tech. ELLA",
      progression: 65
    },
    {
      id: "LAB-2025-1236",
      patient: "BOUNGUENZA Claire",
      age: 28,
      service: "Maternité",
      medecin: "Dr OYANE",
      analyses: ["Groupe sanguin", "RAI", "Toxoplasmose", "Rubéole"],
      priorite: "normale",
      preleveLe: "2025-02-01 09:45",
      statut: "en_attente",
      technicien: "Non attribué"
    }
  ];

  const completedToday = [
    {
      id: "LAB-2025-1230",
      patient: "KOUMBA Sarah",
      analyses: ["NFS", "Glycémie"],
      termineLe: "2025-02-01 07:30",
      delai: "2h 15min",
      validePar: "Dr BOUNGUENZA",
      resultats: "Normaux",
      transmis: true
    },
    {
      id: "LAB-2025-1231",
      patient: "NZENGUE Pierre",
      analyses: ["Bilan hépatique", "Bilan lipidique"],
      termineLe: "2025-02-01 08:45",
      delai: "4h 30min",
      validePar: "Dr BOUNGUENZA",
      resultats: "Valeurs critiques",
      transmis: true,
      critique: true
    },
    {
      id: "LAB-2025-1232",
      patient: "ELLA Marie",
      analyses: ["Hémoglobine", "Ferritine"],
      termineLe: "2025-02-01 09:00",
      delai: "3h 45min",
      validePar: "Dr BOUNGUENZA",
      resultats: "Normaux",
      transmis: true
    }
  ];

  const equipment = [
    {
      nom: "Automate hématologie",
      marque: "Sysmex XN-1000",
      statut: "operationnel",
      testsJour: 45,
      capacite: 120,
      maintenance: "2025-04-15",
      reactifs: 85
    },
    {
      nom: "Automate biochimie",
      marque: "Cobas 6000",
      statut: "operationnel",
      testsJour: 78,
      capacite: 200,
      maintenance: "2025-03-20",
      reactifs: 65
    },
    {
      nom: "PCR en temps réel",
      marque: "Roche LightCycler",
      statut: "maintenance",
      testsJour: 0,
      capacite: 48,
      maintenance: "2025-02-05",
      reactifs: 45
    },
    {
      nom: "Microscope optique",
      marque: "Olympus BX43",
      statut: "operationnel",
      testsJour: 23,
      capacite: 60,
      maintenance: "2025-05-10",
      reactifs: 100
    }
  ];

  const topAnalyses = [
    { nom: "NFS (Hémogramme)", nombre: 234, delaiMoyen: "2h 15min" },
    { nom: "Glycémie", nombre: 198, delaiMoyen: "1h 30min" },
    { nom: "Créatinine", nombre: 145, delaiMoyen: "2h 45min" },
    { nom: "Transaminases", nombre: 123, delaiMoyen: "3h 00min" },
    { nom: "CRP", nombre: 109, delaiMoyen: "1h 45min" },
    { nom: "Ionogramme", nombre: 87, delaiMoyen: "2h 30min" }
  ];

  const getPrioriteBadge = (priorite: string) => {
    if (priorite === "urgente") {
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" />Urgent</Badge>;
    }
    return <Badge variant="outline">Normale</Badge>;
  };

  const getStatutBadge = (statut: string) => {
    const styles = {
      en_attente: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
      en_cours: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
      termine: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30"
    };
    
    const labels = {
      en_attente: "En attente",
      en_cours: "En cours",
      termine: "Terminé"
    };

    return <Badge variant="outline" className={styles[statut as keyof typeof styles]}>{labels[statut as keyof typeof labels]}</Badge>;
  };

  const getEquipmentBadge = (statut: string) => {
    if (statut === "operationnel") {
      return <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">Opérationnel</Badge>;
    }
    return <Badge variant="outline" className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30">Maintenance</Badge>;
  };

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Laboratoire d'Analyses</h1>
            <p className="text-muted-foreground">CHU Libreville - Laboratoire Central</p>
          </div>
          <Button className="gap-2">
            <TestTube className="w-4 h-4" />
            Nouvelle Demande
          </Button>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-3xl font-bold text-foreground">8</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En cours</p>
                  <p className="text-3xl font-bold text-foreground">12</p>
                </div>
                <Activity className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Terminés</p>
                  <p className="text-3xl font-bold text-foreground">45</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Délai moyen</p>
                  <p className="text-3xl font-bold text-foreground">2h30</p>
                </div>
                <Clock className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valeurs critiques</p>
                  <p className="text-3xl font-bold text-destructive">3</p>
                </div>
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recherche */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par patient, numéro labo, médecin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtres</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs principales */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">File d'attente ({pendingAnalyses.length})</TabsTrigger>
            <TabsTrigger value="completed">Terminés aujourd'hui ({completedToday.length})</TabsTrigger>
            <TabsTrigger value="equipment">Équipements</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          {/* File d'attente */}
          <TabsContent value="pending" className="space-y-4">
            {pendingAnalyses.map((analyse) => (
              <Card key={analyse.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{analyse.patient}</h3>
                        {getPrioriteBadge(analyse.priorite)}
                        {getStatutBadge(analyse.statut)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">ID Labo</p>
                          <p className="font-medium text-foreground">{analyse.id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Âge / Service</p>
                          <p className="font-medium text-foreground">{analyse.age} ans / {analyse.service}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Médecin prescripteur</p>
                          <p className="font-medium text-foreground">{analyse.medecin}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Prélevé le</p>
                          <p className="font-medium text-foreground">{analyse.preleveLe}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Analyses demandées :</p>
                        <div className="flex flex-wrap gap-2">
                          {analyse.analyses.map((a, idx) => (
                            <Badge key={idx} variant="secondary">{a}</Badge>
                          ))}
                        </div>
                      </div>

                      {analyse.statut === "en_cours" && analyse.progression && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="text-foreground">{analyse.progression}%</span>
                          </div>
                          <Progress value={analyse.progression} className="h-2" />
                          <p className="text-xs text-muted-foreground">Technicien : {analyse.technicien}</p>
                        </div>
                      )}

                      {analyse.statut === "en_attente" && (
                        <p className="text-sm text-muted-foreground">
                          <User className="w-4 h-4 inline mr-1" />
                          Technicien : {analyse.technicien}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    {analyse.statut === "en_attente" && (
                      <Button size="sm" className="gap-2">
                        <Activity className="w-4 h-4" />
                        Attribuer technicien
                      </Button>
                    )}
                    {analyse.statut === "en_cours" && (
                      <>
                        <Button size="sm" variant="outline" className="gap-2">
                          <TestTube className="w-4 h-4" />
                          Saisir résultats
                        </Button>
                        <Button size="sm" className="gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Valider
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Analyses terminées */}
          <TabsContent value="completed" className="space-y-4">
            {completedToday.map((analyse) => (
              <Card key={analyse.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{analyse.patient}</h3>
                        <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Validé
                        </Badge>
                        {analyse.critique && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Valeurs critiques
                          </Badge>
                        )}
                        {analyse.transmis && (
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
                            Transmis
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">ID Labo</p>
                          <p className="font-medium text-foreground">{analyse.id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Analyses</p>
                          <p className="font-medium text-foreground">{analyse.analyses.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Terminé le</p>
                          <p className="font-medium text-foreground">{analyse.termineLe}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Délai</p>
                          <p className="font-medium text-foreground">{analyse.delai}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Validé par</p>
                          <p className="font-medium text-foreground">{analyse.validePar}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Équipements */}
          <TabsContent value="equipment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipment.map((equip, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-base">{equip.nom}</span>
                      {getEquipmentBadge(equip.statut)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{equip.marque}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Tests aujourd'hui</p>
                        <p className="text-2xl font-bold text-foreground">{equip.testsJour}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Capacité max</p>
                        <p className="text-2xl font-bold text-foreground">{equip.capacite}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Utilisation</span>
                        <span className="text-foreground">{Math.round((equip.testsJour / equip.capacite) * 100)}%</span>
                      </div>
                      <Progress value={(equip.testsJour / equip.capacite) * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Réactifs</span>
                        <span className="text-foreground">{equip.reactifs}%</span>
                      </div>
                      <Progress value={equip.reactifs} className="h-2" />
                    </div>

                    <div className="pt-2 border-t text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Prochaine maintenance</span>
                        <span className="font-medium text-foreground">{equip.maintenance}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Statistiques */}
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top analyses (30 derniers jours)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topAnalyses.map((analyse, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-muted-foreground w-8">#{idx + 1}</span>
                        <div>
                          <p className="font-medium text-foreground">{analyse.nom}</p>
                          <p className="text-sm text-muted-foreground">{analyse.nombre} analyses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Délai moyen</p>
                        <p className="font-medium text-foreground">{analyse.delaiMoyen}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Taux validation J</span>
                      <span className="font-bold text-foreground">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Délai moyen</span>
                      <span className="font-bold text-foreground">2h 30min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Objectif délai</span>
                      <span className="font-bold text-foreground">3h 00min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Qualité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Taux conformité</span>
                      <span className="font-bold text-foreground">98.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Contrôles qualité</span>
                      <span className="font-bold text-green-600">OK</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Certification</span>
                      <span className="font-bold text-foreground">ISO 15189</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Activité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Analyses/jour</span>
                      <span className="font-bold text-foreground">~150</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ce mois</span>
                      <span className="font-bold text-foreground">3,456</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Évolution</span>
                      <span className="font-bold text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +8%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HospitalDashboardLayout>
  );
}
