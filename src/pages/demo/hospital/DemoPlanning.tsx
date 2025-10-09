import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Clock, Users, Plus, ChevronLeft, ChevronRight,
  UserCog, AlertCircle, CheckCircle, Moon, Sun, Sunrise
} from "lucide-react";
import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";

export default function DemoPlanning() {
  const [currentWeek, setCurrentWeek] = useState(0);

  // Données de planning
  const services = [
    "Médecine Générale",
    "Chirurgie", 
    "Urgences",
    "Réanimation",
    "Maternité",
    "Pédiatrie"
  ];

  const jours = ["Lun 03", "Mar 04", "Mer 05", "Jeu 06", "Ven 07", "Sam 08", "Dim 09"];

  const planningData = {
    "Médecine Générale": {
      "Lun 03": { matin: "Dr MOUSSAVOU", aprem: "Dr ELLA", nuit: "Dr NZENGUE" },
      "Mar 04": { matin: "Dr ELLA", aprem: "Dr OBAME", nuit: "Dr MOUSSAVOU" },
      "Mer 05": { matin: "Dr OBAME", aprem: "Dr NZENGUE", nuit: "Dr ELLA" },
      "Jeu 06": { matin: "Dr NZENGUE", aprem: "Dr MOUSSAVOU", nuit: "Dr OBAME" },
      "Ven 07": { matin: "Dr MOUSSAVOU", aprem: "Dr ELLA", nuit: "Dr NZENGUE" },
      "Sam 08": { matin: "Dr ELLA", aprem: "Dr OBAME", nuit: "Dr MOUSSAVOU" },
      "Dim 09": { matin: "Dr OBAME", aprem: "Dr NZENGUE", nuit: "Dr ELLA" }
    },
    "Chirurgie": {
      "Lun 03": { matin: "Dr KOUMBA", aprem: "Dr BOUNGUENZA", nuit: "Dr OYANE" },
      "Mar 04": { matin: "Dr BOUNGUENZA", aprem: "Dr OYANE", nuit: "Dr KOUMBA" },
      "Mer 05": { matin: "Dr OYANE", aprem: "Dr KOUMBA", nuit: "Dr BOUNGUENZA" },
      "Jeu 06": { matin: "Dr KOUMBA", aprem: "Dr BOUNGUENZA", nuit: "Dr OYANE" },
      "Ven 07": { matin: "Dr BOUNGUENZA", aprem: "Dr OYANE", nuit: "Dr KOUMBA" },
      "Sam 08": { matin: "Dr OYANE", aprem: "Dr KOUMBA", nuit: "Dr BOUNGUENZA" },
      "Dim 09": { matin: "Dr KOUMBA", aprem: "Dr BOUNGUENZA", nuit: "Dr OYANE" }
    },
    "Urgences": {
      "Lun 03": { matin: "Dr MBOUMBA", aprem: "Dr NZE", nuit: "Dr ONDO" },
      "Mar 04": { matin: "Dr NZE", aprem: "Dr ONDO", nuit: "Dr MBOUMBA" },
      "Mer 05": { matin: "Dr ONDO", aprem: "Dr MBOUMBA", nuit: "Dr NZE" },
      "Jeu 06": { matin: "Dr MBOUMBA", aprem: "Dr NZE", nuit: "Dr ONDO" },
      "Ven 07": { matin: "Dr NZE", aprem: "Dr ONDO", nuit: "Dr MBOUMBA" },
      "Sam 08": { matin: "Dr ONDO", aprem: "Dr MBOUMBA", nuit: "Dr NZE" },
      "Dim 09": { matin: "Dr MBOUMBA", aprem: "Dr NZE", nuit: "Dr ONDO" }
    },
    "Réanimation": {
      "Lun 03": { matin: "Dr AKENDENGUE", aprem: "Dr NDONG", nuit: "Dr MICKALA" },
      "Mar 04": { matin: "Dr NDONG", aprem: "Dr MICKALA", nuit: "Dr AKENDENGUE" },
      "Mer 05": { matin: "Dr MICKALA", aprem: "Dr AKENDENGUE", nuit: "Dr NDONG" },
      "Jeu 06": { matin: "Dr AKENDENGUE", aprem: "Dr NDONG", nuit: "Dr MICKALA" },
      "Ven 07": { matin: "Dr NDONG", aprem: "Dr MICKALA", nuit: "Dr AKENDENGUE" },
      "Sam 08": { matin: "Dr MICKALA", aprem: "Dr AKENDENGUE", nuit: "Dr NDONG" },
      "Dim 09": { matin: "Dr AKENDENGUE", aprem: "Dr NDONG", nuit: "Dr MICKALA" }
    },
    "Maternité": {
      "Lun 03": { matin: "Dr ABOGHE", aprem: "Dr MEYE", nuit: "Dr ESSONO" },
      "Mar 04": { matin: "Dr MEYE", aprem: "Dr ESSONO", nuit: "Dr ABOGHE" },
      "Mer 05": { matin: "Dr ESSONO", aprem: "Dr ABOGHE", nuit: "Dr MEYE" },
      "Jeu 06": { matin: "Dr ABOGHE", aprem: "Dr MEYE", nuit: "Dr ESSONO" },
      "Ven 07": { matin: "Dr MEYE", aprem: "Dr ESSONO", nuit: "Dr ABOGHE" },
      "Sam 08": { matin: "Dr ESSONO", aprem: "Dr ABOGHE", nuit: "Dr MEYE" },
      "Dim 09": { matin: "Dr ABOGHE", aprem: "Dr MEYE", nuit: "Dr ESSONO" }
    },
    "Pédiatrie": {
      "Lun 03": { matin: "Dr IBINGA", aprem: "Dr DITENGUI", nuit: "Dr MBADINGA" },
      "Mar 04": { matin: "Dr DITENGUI", aprem: "Dr MBADINGA", nuit: "Dr IBINGA" },
      "Mer 05": { matin: "Dr MBADINGA", aprem: "Dr IBINGA", nuit: "Dr DITENGUI" },
      "Jeu 06": { matin: "Dr IBINGA", aprem: "Dr DITENGUI", nuit: "Dr MBADINGA" },
      "Ven 07": { matin: "Dr DITENGUI", aprem: "Dr MBADINGA", nuit: "Dr IBINGA" },
      "Sam 08": { matin: "Dr MBADINGA", aprem: "Dr IBINGA", nuit: "Dr DITENGUI" },
      "Dim 09": { matin: "Dr IBINGA", aprem: "Dr DITENGUI", nuit: "Dr MBADINGA" }
    }
  };

  const absences = [
    { nom: "Dr NZENGUE Marie", service: "Cardiologie", type: "Congé annuel", debut: "03/02", fin: "10/02", statut: "approuve" },
    { nom: "Inf. OBAME Jean", service: "Urgences", type: "Maladie", debut: "01/02", fin: "05/02", statut: "approuve" },
    { nom: "Dr ELLA Patricia", service: "Pédiatrie", type: "Formation", debut: "05/02", fin: "07/02", statut: "en_attente" },
    { nom: "Inf. KOUMBA Sarah", service: "Maternité", type: "Congé maternité", debut: "15/01", fin: "15/04", statut: "approuve" }
  ];

  const gardesAVenir = [
    { date: "Sam 08 Fév", service: "Urgences", equipe: "Dr MBOUMBA, Inf. ELLA x3, AS NZENGUE x2", horaire: "08:00 - 20:00" },
    { date: "Dim 09 Fév", service: "Réanimation", equipe: "Dr AKENDENGUE, Inf. MOUSSAVOU x4, AS OBAME x2", horaire: "20:00 - 08:00" },
    { date: "Lun 10 Fév", service: "Chirurgie", equipe: "Dr KOUMBA, Dr BOUNGUENZA, Inf. OYANE x5", horaire: "08:00 - 20:00" }
  ];

  const getShiftIcon = (shift: string) => {
    if (shift === 'matin') return <Sunrise className="w-3 h-3" />;
    if (shift === 'aprem') return <Sun className="w-3 h-3" />;
    return <Moon className="w-3 h-3" />;
  };

  const getShiftColor = (shift: string) => {
    if (shift === 'matin') return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30';
    if (shift === 'aprem') return 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30';
    return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30';
  };

  const getStatutBadge = (statut: string) => {
    if (statut === "approuve") {
      return <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</Badge>;
    }
    return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30"><AlertCircle className="w-3 h-3 mr-1" />En attente</Badge>;
  };

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Planning du Personnel</h1>
            <p className="text-muted-foreground">Gestion des gardes et rotations</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter une garde
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Services couverts</p>
                  <p className="text-3xl font-bold">{services.length}</p>
                </div>
                <UserCog className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gardes cette semaine</p>
                  <p className="text-3xl font-bold">126</p>
                </div>
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Personnel actif</p>
                  <p className="text-3xl font-bold">856</p>
                </div>
                <Users className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Absences en cours</p>
                  <p className="text-3xl font-bold">{absences.filter(a => a.statut === "approuve").length}</p>
                </div>
                <AlertCircle className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Planning hebdomadaire</TabsTrigger>
            <TabsTrigger value="gardes">Gardes à venir</TabsTrigger>
            <TabsTrigger value="absences">Absences</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Semaine du 3 au 9 Février 2025</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentWeek(currentWeek - 1)}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setCurrentWeek(currentWeek + 1)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2 bg-muted text-left font-medium">Service</th>
                        {jours.map((jour) => (
                          <th key={jour} className="border p-2 bg-muted text-center font-medium min-w-[140px]">
                            {jour}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service}>
                          <td className="border p-2 font-medium bg-muted/50">{service}</td>
                          {jours.map((jour) => {
                            const shifts = planningData[service as keyof typeof planningData]?.[jour];
                            return (
                              <td key={`${service}-${jour}`} className="border p-1">
                                {shifts && (
                                  <div className="space-y-1">
                                    <div className={`text-xs p-1 rounded border flex items-center gap-1 ${getShiftColor('matin')}`}>
                                      {getShiftIcon('matin')}
                                      <span className="truncate">{shifts.matin}</span>
                                    </div>
                                    <div className={`text-xs p-1 rounded border flex items-center gap-1 ${getShiftColor('aprem')}`}>
                                      {getShiftIcon('aprem')}
                                      <span className="truncate">{shifts.aprem}</span>
                                    </div>
                                    <div className={`text-xs p-1 rounded border flex items-center gap-1 ${getShiftColor('nuit')}`}>
                                      {getShiftIcon('nuit')}
                                      <span className="truncate">{shifts.nuit}</span>
                                    </div>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Matin (08:00 - 14:00)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Après-midi (14:00 - 20:00)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Nuit (20:00 - 08:00)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gardes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Prochaines gardes planifiées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gardesAVenir.map((garde, idx) => (
                    <div key={idx} className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                              {garde.date}
                            </Badge>
                            <span className="font-semibold">{garde.service}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {garde.horaire}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Équipe :</p>
                        <p className="text-sm text-muted-foreground">{garde.equipe}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="absences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Absences et congés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {absences.map((absence, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold">{absence.nom}</span>
                            {getStatutBadge(absence.statut)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Service</p>
                              <p className="font-medium">{absence.service}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Type</p>
                              <p className="font-medium">{absence.type}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Du</p>
                              <p className="font-medium">{absence.debut}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Au</p>
                              <p className="font-medium">{absence.fin}</p>
                            </div>
                          </div>
                        </div>
                        {absence.statut === "en_attente" && (
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approuver
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HospitalDashboardLayout>
  );
}
