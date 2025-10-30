import { ProfessionalEstablishmentLayout } from "@/components/layout/ProfessionalEstablishmentLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, Microscope, Scan, TestTube, Plus, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SogaraTechnical() {
  const stats = {
    labTestsToday: 45,
    radiologyToday: 12,
    pendingResults: 8,
    equipmentStatus: 98
  };

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="w-8 h-8 text-primary" />
              Plateaux Techniques
            </h1>
            <p className="text-muted-foreground mt-1">
              Laboratoire, Imagerie et Équipements médicaux
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Analyses labo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.labTestsToday}</div>
              <p className="text-xs text-muted-foreground mt-1">Aujourd'hui</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Imagerie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.radiologyToday}</div>
              <p className="text-xs text-muted-foreground mt-1">Examens du jour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingResults}</div>
              <p className="text-xs text-muted-foreground mt-1">Résultats</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Équipements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.equipmentStatus}%</div>
              <Badge className="mt-1 bg-green-500/20 text-green-700 border-green-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                Opérationnels
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="laboratory">
          <TabsList>
            <TabsTrigger value="laboratory">
              <TestTube className="w-4 h-4 mr-2" />
              Laboratoire
            </TabsTrigger>
            <TabsTrigger value="radiology">
              <Scan className="w-4 h-4 mr-2" />
              Radiologie
            </TabsTrigger>
            <TabsTrigger value="equipment">
              <Activity className="w-4 h-4 mr-2" />
              Équipements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="laboratory">
            <Card>
              <CardHeader>
                <CardTitle>Laboratoire d'Analyses</CardTitle>
                <CardDescription>Analyses biologiques et examens médicaux</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: "Hématologie", tests: 145, turnaround: "2h" },
                    { name: "Biochimie", tests: 198, turnaround: "4h" },
                    { name: "Microbiologie", tests: 67, turnaround: "24h" },
                    { name: "Sérologie", tests: 89, turnaround: "6h" }
                  ].map((dept, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{dept.name}</h3>
                        <Microscope className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tests ce mois</span>
                        <Badge variant="outline">{dept.tests}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-muted-foreground">Délai moyen</span>
                        <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">{dept.turnaround}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="radiology">
            <Card>
              <CardHeader>
                <CardTitle>Service d'Imagerie</CardTitle>
                <CardDescription>Radiologie et examens d'imagerie médicale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: "Radiologie standard", exams: 342 },
                    { name: "Échographie", exams: 156 },
                    { name: "Scanner", exams: 45 }
                  ].map((modality, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <Scan className="w-6 h-6 text-primary mb-3" />
                      <h3 className="font-semibold">{modality.name}</h3>
                      <p className="text-2xl font-bold mt-2">{modality.exams}</p>
                      <p className="text-xs text-muted-foreground">Examens ce mois</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment">
            <Card>
              <CardHeader>
                <CardTitle>État des Équipements</CardTitle>
                <CardDescription>Maintenance et disponibilité</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Analyseur hématologique", status: "operational", lastMaintenance: "15/01/2024" },
                    { name: "Appareil radiologique", status: "operational", lastMaintenance: "10/01/2024" },
                    { name: "Échographe", status: "operational", lastMaintenance: "20/01/2024" },
                    { name: "Centrifugeuse", status: "maintenance", lastMaintenance: "18/01/2024" }
                  ].map((equip, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{equip.name}</h4>
                        <p className="text-xs text-muted-foreground">Dernière maintenance: {equip.lastMaintenance}</p>
                      </div>
                      {equip.status === 'operational' ? (
                        <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Opérationnel</Badge>
                      ) : (
                        <Badge variant="outline" className="border-orange-500/30 text-orange-600">Maintenance</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}

