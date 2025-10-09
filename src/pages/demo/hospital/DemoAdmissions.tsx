import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserPlus, Search, Bed, FileText, Calendar, Clock, 
  AlertCircle, CheckCircle, XCircle, Eye
} from "lucide-react";
import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";

export default function DemoAdmissions() {
  const [searchTerm, setSearchTerm] = useState("");

  const pendingAdmissions = [
    {
      id: "ADM-2025-00234",
      patient: "MOUSSAVOU Marie",
      age: 39,
      gender: "F",
      cnamgs: "GAB123456789",
      service: "Médecine Générale",
      urgence: false,
      chambre: "En attente",
      arriveeLe: "2025-02-01 08:30",
      motif: "Suspicion paludisme",
      statut: "pending"
    },
    {
      id: "ADM-2025-00235",
      patient: "OBAME Jean",
      age: 52,
      gender: "M",
      cnamgs: "GAB987654321",
      service: "Cardiologie",
      urgence: true,
      chambre: "En attente",
      arriveeLe: "2025-02-01 09:15",
      motif: "Douleur thoracique",
      statut: "urgent"
    }
  ];

  const currentAdmissions = [
    {
      id: "ADM-2025-00231",
      patient: "NZENGUE Pierre",
      age: 45,
      service: "Chirurgie",
      chambre: "B-204",
      lit: "A",
      admisLe: "2025-01-30",
      medecin: "Dr OBIANG",
      diagnostic: "Post-opératoire appendicectomie",
      sortiePrevue: "2025-02-03",
      facturation: 234000,
      statut: "stable"
    },
    {
      id: "ADM-2025-00232",
      patient: "ELLA Marie",
      age: 28,
      service: "Maternité",
      chambre: "M-105",
      lit: "B",
      admisLe: "2025-01-31",
      medecin: "Dr BOUNGUENZA",
      diagnostic: "Post-partum (césarienne)",
      sortiePrevue: "2025-02-02",
      facturation: 178000,
      statut: "stable"
    },
    {
      id: "ADM-2025-00233",
      patient: "MBOUMBA Jean-Claude",
      age: 67,
      service: "Réanimation",
      chambre: "REA-02",
      lit: "1",
      admisLe: "2025-01-31",
      medecin: "Dr NZENGUE",
      diagnostic: "Décompensation cardiaque",
      sortiePrevue: "Indéterminé",
      facturation: 567000,
      statut: "critical"
    }
  ];

  const recentDischarges = [
    {
      id: "ADM-2025-00225",
      patient: "KOUMBA Sarah",
      service: "Médecine",
      sortiLe: "2025-02-01 07:30",
      duree: "5 jours",
      motif: "Guérison",
      factureReglee: true
    },
    {
      id: "ADM-2025-00226",
      patient: "OYANE Marc",
      service: "Chirurgie",
      sortiLe: "2025-01-31 16:00",
      duree: "3 jours",
      motif: "Transfert CHU",
      factureReglee: false
    }
  ];

  const availableBeds = [
    { service: "Médecine", chambres: 8, lits: 12 },
    { service: "Chirurgie", chambres: 6, lits: 9 },
    { service: "Maternité", chambres: 3, lits: 3 },
    { service: "Pédiatrie", chambres: 5, lits: 8 },
    { service: "Réanimation", chambres: 6, lits: 6 }
  ];

  const getStatutBadge = (statut: string) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
      urgent: "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30",
      stable: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
      critical: "bg-red-600/20 text-red-700 dark:text-red-300 border-red-600/30"
    };
    
    const labels = {
      pending: "En attente",
      urgent: "Urgent",
      stable: "Stable",
      critical: "Critique"
    };

    return <Badge variant="outline" className={styles[statut as keyof typeof styles]}>{labels[statut as keyof typeof labels]}</Badge>;
  };

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Admissions</h1>
            <p className="text-muted-foreground">CHU Libreville - Service Admissions</p>
          </div>
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Nouvelle Admission
          </Button>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-3xl font-bold text-foreground">2</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hospitalisés</p>
                  <p className="text-3xl font-bold text-foreground">78</p>
                </div>
                <Bed className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sorties aujourd'hui</p>
                  <p className="text-3xl font-bold text-foreground">8</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lits disponibles</p>
                  <p className="text-3xl font-bold text-foreground">38</p>
                </div>
                <Bed className="w-10 h-10 text-primary" />
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
                  placeholder="Rechercher par nom, numéro admission, CNAMGS..."
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
            <TabsTrigger value="pending">En attente ({pendingAdmissions.length})</TabsTrigger>
            <TabsTrigger value="current">Hospitalisés ({currentAdmissions.length})</TabsTrigger>
            <TabsTrigger value="discharges">Sorties récentes</TabsTrigger>
            <TabsTrigger value="beds">Disponibilité lits</TabsTrigger>
          </TabsList>

          {/* Admissions en attente */}
          <TabsContent value="pending" className="space-y-4">
            {pendingAdmissions.map((admission) => (
              <Card key={admission.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{admission.patient}</h3>
                        {getStatutBadge(admission.statut)}
                        {admission.urgence && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="w-3 h-3" />
                            URGENT
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">ID Admission</p>
                          <p className="font-medium text-foreground">{admission.id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Âge / Sexe</p>
                          <p className="font-medium text-foreground">{admission.age} ans / {admission.gender}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">CNAMGS</p>
                          <p className="font-medium text-foreground">{admission.cnamgs}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Service</p>
                          <p className="font-medium text-foreground">{admission.service}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Arrivée</p>
                          <p className="font-medium text-foreground">{admission.arriveeLe}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Motif</p>
                          <p className="font-medium text-foreground">{admission.motif}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Voir
                      </Button>
                      <Button size="sm" className="gap-2">
                        <Bed className="w-4 h-4" />
                        Attribuer chambre
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Hospitalisations en cours */}
          <TabsContent value="current" className="space-y-4">
            {currentAdmissions.map((admission) => (
              <Card key={admission.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{admission.patient}</h3>
                        {getStatutBadge(admission.statut)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Chambre / Lit</p>
                          <p className="font-medium text-foreground">{admission.chambre} - {admission.lit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Service</p>
                          <p className="font-medium text-foreground">{admission.service}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Médecin</p>
                          <p className="font-medium text-foreground">{admission.medecin}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Admis le</p>
                          <p className="font-medium text-foreground">{admission.admisLe}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Sortie prévue</p>
                          <p className="font-medium text-foreground">{admission.sortiePrevue}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Diagnostic</p>
                          <p className="font-medium text-foreground">{admission.diagnostic}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Facturation</p>
                          <p className="font-medium text-foreground">{admission.facturation.toLocaleString()} FCFA</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Dossier
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Calendar className="w-4 h-4" />
                        Planifier sortie
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Sorties récentes */}
          <TabsContent value="discharges" className="space-y-4">
            {recentDischarges.map((discharge) => (
              <Card key={discharge.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Patient</p>
                        <p className="font-medium text-foreground">{discharge.patient}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Service</p>
                        <p className="font-medium text-foreground">{discharge.service}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sorti le</p>
                        <p className="font-medium text-foreground">{discharge.sortiLe}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Durée séjour</p>
                        <p className="font-medium text-foreground">{discharge.duree}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Motif sortie</p>
                        <p className="font-medium text-foreground">{discharge.motif}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {discharge.factureReglee ? (
                        <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Facture réglée
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30">
                          <XCircle className="w-3 h-3 mr-1" />
                          Facture en attente
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Disponibilité des lits */}
          <TabsContent value="beds" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableBeds.map((bed) => (
                <Card key={bed.service}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{bed.service}</span>
                      <Bed className="w-5 h-5 text-primary" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Chambres disponibles</span>
                        <span className="text-2xl font-bold text-foreground">{bed.chambres}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Lits disponibles</span>
                        <span className="text-2xl font-bold text-foreground">{bed.lits}</span>
                      </div>
                      <Button className="w-full" size="sm">Voir détails</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HospitalDashboardLayout>
  );
}
