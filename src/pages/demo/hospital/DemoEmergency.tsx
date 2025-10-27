import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, Clock, Siren, UserPlus, Activity, 
  Stethoscope, Heart, TrendingUp, CheckCircle
} from "lucide-react";
import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";

export default function DemoEmergency() {
  const triagePatients = {
    rouge: [
      {
        numero: "URG-001",
        patient: "OBIANG Marie, 45 ans",
        arrive: "09:15",
        motif: "Douleur thoracique intense",
        constantes: "TA: 180/110, FC: 125, SpO2: 88%",
        medecin: "Dr MBOUMBA",
        salle: "Salle 1"
      }
    ],
    orange: [
      {
        numero: "URG-003",
        patient: "NZENGUE Pierre, 32 ans",
        arrive: "09:30",
        motif: "Fracture ouverte jambe",
        constantes: "TA: 130/85, FC: 95, SpO2: 97%",
        attente: "15 min",
        box: "Box 3"
      },
      {
        numero: "URG-005",
        patient: "KOUMBA Jean, 67 ans",
        arrive: "09:50",
        motif: "Dyspnée importante",
        constantes: "TA: 145/90, FC: 110, SpO2: 92%",
        attente: "10 min",
        box: "Box 5"
      },
      {
        numero: "URG-007",
        patient: "ELLA Sarah, 28 ans",
        arrive: "10:05",
        motif: "Hémorragie active",
        constantes: "TA: 100/60, FC: 115, SpO2: 95%",
        attente: "5 min",
        box: "En attente"
      }
    ],
    vert: [
      {
        numero: "URG-002",
        patient: "MOUSSAVOU Claire, 25 ans",
        arrive: "09:20",
        motif: "Entorse cheville",
        attente: "45 min"
      },
      {
        numero: "URG-004",
        patient: "BOUNGUENZA Marc, 18 ans",
        arrive: "09:40",
        motif: "Plaie superficielle main",
        attente: "30 min"
      },
      {
        numero: "URG-006",
        patient: "OYANE Sophie, 42 ans",
        arrive: "10:00",
        motif: "Céphalées",
        attente: "20 min"
      },
      {
        numero: "URG-008",
        patient: "MBOUMBA Jean, 55 ans",
        arrive: "10:15",
        motif: "Lombalgie",
        attente: "10 min"
      }
    ]
  };

  const stats = {
    passages: {
      aujourdhui: 45,
      moyenne: 52,
      evolution: -13
    },
    enCours: 8,
    attenteMoyenne: 23,
    hospitalisations: 12
  };

  const equipeGarde = {
    urgentiste: "Dr MBOUMBA Jean-Pierre",
    infirmiers: ["Inf. MOUSSAVOU Claire", "Inf. ELLA Marie", "Inf. NZENGUE Pierre"],
    aidesSoignants: ["AS OBIANG Paul", "AS KOUMBA Sarah"],
    releve: "14:00"
  };

  const ambulances = [
    { numero: "AMB-01", statut: "disponible", localisation: "Base" },
    { numero: "AMB-02", statut: "en_mission", localisation: "Glass - Accident voie publique", eta: "10 min" },
    { numero: "AMB-03", statut: "disponible", localisation: "Base" }
  ];

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Service des Urgences</h1>
            <p className="text-muted-foreground">CMST SOGARA - Port-Gentil • Temps réel</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Siren className="w-4 h-4" />
              Ambulances ({ambulances.filter(a => a.statut === "disponible").length})
            </Button>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Nouveau Patient
            </Button>
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
                    <TrendingUp className="w-3 h-3" />
                    Moy: {stats.passages.moyenne}/jour
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
                  <p className="text-3xl font-bold text-foreground">{stats.enCours}</p>
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
                  <p className="text-sm text-muted-foreground">Hospitalisations</p>
                  <p className="text-3xl font-bold text-foreground">{stats.hospitalisations}</p>
                  <p className="text-xs text-muted-foreground mt-1">27% des passages</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Équipe de garde */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Ambulances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Siren className="w-5 h-5" />
              État des ambulances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <p className="text-xs text-foreground mt-1">ETA: {amb.eta}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                      <p className="font-medium text-foreground">{patient.constantes}</p>
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
                      <p className="font-medium text-foreground">{patient.constantes}</p>
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
