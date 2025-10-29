import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertCircle, Clock, Siren, UserPlus, Activity, 
  Stethoscope, Heart, TrendingUp, CheckCircle, Search,
  Phone, User
} from "lucide-react";
import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SogaraEmergency() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newPatientOpen, setNewPatientOpen] = useState(false);

  const triagePatients = {
    rouge: [
      {
        numero: "URG-SOGARA-001",
        patient: "NZAMBA Jean-Paul, 52 ans",
        employeeId: "EMP-SOGARA-1234",
        poste: "Technicien forage",
        arrive: "08:45",
        motif: "Accident de travail - Fracture ouverte jambe",
        constantes: "TA: 140/90, FC: 110, SpO2: 94%, Douleur: 9/10",
        medecin: "Dr KOMBILA",
        salle: "Salle de réanimation",
        status: "en_cours"
      }
    ],
    orange: [
      {
        numero: "URG-SOGARA-003",
        patient: "MOUSSAVOU Marie, 34 ans",
        employeeId: "EMP-SOGARA-5678",
        poste: "Secrétaire direction",
        arrive: "09:15",
        motif: "Brûlure chimique main",
        constantes: "TA: 125/80, FC: 95, SpO2: 98%, Douleur: 6/10",
        attente: "20 min",
        box: "Box 2",
        status: "attente"
      },
      {
        numero: "URG-SOGARA-005",
        patient: "ELLA Pierre, 45 ans",
        employeeId: "EMP-SOGARA-9012",
        poste: "Opérateur production",
        arrive: "09:45",
        motif: "Inhalation produits toxiques",
        constantes: "TA: 135/85, FC: 105, SpO2: 91%",
        attente: "5 min",
        box: "En attente O2",
        status: "attente"
      }
    ],
    vert: [
      {
        numero: "URG-SOGARA-002",
        patient: "OBAME Claire, 28 ans",
        employeeId: "EMP-SOGARA-3456",
        poste: "Comptable",
        arrive: "08:55",
        motif: "Entorse cheville",
        attente: "35 min",
        status: "attente"
      },
      {
        numero: "URG-SOGARA-004",
        patient: "NGUEMA Sylvain, 38 ans",
        employeeId: "EMP-SOGARA-7890",
        poste: "Chauffeur",
        arrive: "09:30",
        motif: "Céphalées intenses",
        attente: "15 min",
        status: "attente"
      }
    ]
  };

  const stats = {
    passages: {
      aujourdhui: 23,
      moyenne: 18,
      evolution: +28
    },
    enCours: 5,
    attenteMoyenne: 18,
    accidentsTravail: 8
  };

  const equipeGarde = {
    urgentiste: "Dr KOMBILA Jean-Pierre",
    infirmiers: ["Inf. MOUSSAVOU Claire", "Inf. NZAMBA Marie"],
    aidesSoignants: ["AS OBIANG Paul"],
    releve: "14:00"
  };

  const ambulances = [
    { numero: "AMB-SOGARA-01", statut: "disponible", localisation: "Infirmerie" },
    { numero: "AMB-SOGARA-02", statut: "en_mission", localisation: "Site forage - Accident", eta: "15 min" }
  ];

  const getTotalPatients = () => {
    return triagePatients.rouge.length + triagePatients.orange.length + triagePatients.vert.length;
  };

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Service des Urgences</h1>
            <p className="text-muted-foreground">Hôpital de SOGARA / Infirmerie - Port-Gentil • Temps réel</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Siren className="w-4 h-4" />
              Ambulances ({ambulances.filter(a => a.statut === "disponible").length})
            </Button>
            
            <Dialog open={newPatientOpen} onOpenChange={setNewPatientOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Nouveau Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Enregistrer un patient aux urgences</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>N° Matricule Employé</Label>
                      <div className="flex gap-2">
                        <Input placeholder="EMP-SOGARA-XXXX" />
                        <Button size="icon" variant="outline">
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Statut</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employé SOGARA</SelectItem>
                          <SelectItem value="dependant">Ayant droit</SelectItem>
                          <SelectItem value="external">Externe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom complet</Label>
                      <Input placeholder="NOM Prénom" />
                    </div>
                    <div className="space-y-2">
                      <Label>Âge</Label>
                      <Input type="number" placeholder="35" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Poste / Service</Label>
                    <Input placeholder="Ex: Technicien forage, Production, Administration..." />
                  </div>

                  <div className="space-y-2">
                    <Label>Motif de consultation</Label>
                    <Textarea placeholder="Décrire le motif de la visite aux urgences..." rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label>Type d'urgence</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accident_travail">Accident du travail</SelectItem>
                        <SelectItem value="maladie">Maladie</SelectItem>
                        <SelectItem value="traumatisme">Traumatisme</SelectItem>
                        <SelectItem value="intoxication">Intoxication</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Constantes vitales</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>TA (mmHg)</Label>
                        <Input placeholder="120/80" />
                      </div>
                      <div className="space-y-2">
                        <Label>FC (bpm)</Label>
                        <Input placeholder="72" />
                      </div>
                      <div className="space-y-2">
                        <Label>SpO2 (%)</Label>
                        <Input placeholder="98" />
                      </div>
                      <div className="space-y-2">
                        <Label>Température (°C)</Label>
                        <Input placeholder="37.0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Douleur (/10)</Label>
                        <Input type="number" min="0" max="10" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Niveau de triage</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Évaluer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rouge">🔴 Rouge - Vital</SelectItem>
                            <SelectItem value="orange">🟠 Orange - Urgent</SelectItem>
                            <SelectItem value="vert">🟢 Vert - Non urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewPatientOpen(false)}>Annuler</Button>
                  <Button onClick={() => setNewPatientOpen(false)}>Enregistrer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Passages aujourd'hui</p>
                  <p className="text-3xl font-bold text-foreground">{stats.passages.aujourdhui}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    +{stats.passages.evolution}% vs moyenne
                  </p>
                </div>
                <Activity className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Patients en cours</p>
                  <p className="text-3xl font-bold text-foreground">{getTotalPatients()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {triagePatients.rouge.length} rouge, {triagePatients.orange.length} orange
                  </p>
                </div>
                <Stethoscope className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attente moyenne</p>
                  <p className="text-3xl font-bold text-foreground">{stats.attenteMoyenne}</p>
                  <p className="text-xs text-muted-foreground mt-1">minutes</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accidents du travail</p>
                  <p className="text-3xl font-bold text-foreground">{stats.accidentsTravail}</p>
                  <p className="text-xs text-muted-foreground mt-1">35% des passages</p>
                </div>
                <AlertCircle className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Équipe de garde et Ambulances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Équipe de garde</span>
                <Badge variant="outline" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Relève à {equipeGarde.releve}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Urgentiste</p>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-primary" />
                    <p className="font-medium text-foreground">{equipeGarde.urgentiste}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Infirmiers ({equipeGarde.infirmiers.length})</p>
                  {equipeGarde.infirmiers.map((inf, idx) => (
                    <p key={idx} className="text-sm text-foreground">{inf}</p>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Aides-soignants ({equipeGarde.aidesSoignants.length})</p>
                  {equipeGarde.aidesSoignants.map((as, idx) => (
                    <p key={idx} className="text-sm text-foreground">{as}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Siren className="w-5 h-5" />
                État des ambulances
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ambulances.map((amb, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{amb.numero}</span>
                    {amb.statut === "disponible" ? (
                      <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
                        Disponible
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30">
                        En mission
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{amb.localisation}</p>
                  {amb.eta && (
                    <p className="text-xs text-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ETA: {amb.eta}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Triage par couleur */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rouge - Urgence vitale */}
          <Card className="border-red-500">
            <CardHeader className="bg-red-500/10">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <Heart className="w-5 h-5" />
                ROUGE - Urgence Vitale ({triagePatients.rouge.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {triagePatients.rouge.map((patient) => (
                <div key={patient.numero} className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{patient.patient}</p>
                      <p className="text-sm text-muted-foreground">{patient.numero}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {patient.employeeId} • {patient.poste}
                      </p>
                    </div>
                    <Badge variant="destructive">{patient.arrive}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Motif</p>
                      <p className="font-medium text-foreground">{patient.motif}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Constantes</p>
                      <p className="font-medium text-foreground text-xs">{patient.constantes}</p>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Médecin:</span>
                      <span className="font-medium text-foreground">{patient.medecin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Salle:</span>
                      <span className="font-medium text-foreground">{patient.salle}</span>
                    </div>
                  </div>

                  <Button size="sm" className="w-full mt-3" variant="destructive">
                    <Activity className="w-4 h-4 mr-2" />
                    Voir détails
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Orange - Urgence relative */}
          <Card className="border-orange-500">
            <CardHeader className="bg-orange-500/10">
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <AlertCircle className="w-5 h-5" />
                ORANGE - Urgence Relative ({triagePatients.orange.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {triagePatients.orange.map((patient) => (
                <div key={patient.numero} className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{patient.patient}</p>
                      <p className="text-sm text-muted-foreground">{patient.numero}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {patient.employeeId} • {patient.poste}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30">
                      {patient.arrive}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Motif</p>
                      <p className="font-medium text-foreground">{patient.motif}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Constantes</p>
                      <p className="font-medium text-foreground text-xs">{patient.constantes}</p>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Attente:</span>
                      <span className="font-medium text-foreground">{patient.attente}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Box:</span>
                      <span className="font-medium text-foreground">{patient.box}</span>
                    </div>
                  </div>

                  <Button size="sm" className="w-full mt-3" variant="outline">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Prendre en charge
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Vert - Non urgent */}
          <Card className="border-green-500">
            <CardHeader className="bg-green-500/10">
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Clock className="w-5 h-5" />
                VERT - Non Urgent ({triagePatients.vert.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {triagePatients.vert.map((patient) => (
                <div key={patient.numero} className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{patient.patient}</p>
                      <p className="text-sm text-muted-foreground">{patient.numero}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {patient.employeeId} • {patient.poste}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
                      {patient.arrive}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Motif</p>
                      <p className="font-medium text-foreground">{patient.motif}</p>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Attente:</span>
                      <span className="font-medium text-foreground">{patient.attente}</span>
                    </div>
                  </div>

                  <Button size="sm" className="w-full mt-3" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Appeler patient
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </HospitalDashboardLayout>
  );
}

