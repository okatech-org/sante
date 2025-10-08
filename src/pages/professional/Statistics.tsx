import { BarChart3, Users, TrendingUp, Clock, Calendar, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfessionalStatistics() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Statistiques & Performance</h1>
        <p className="text-muted-foreground">Analyse de votre activité médicale</p>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consultations/mois</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-green-500">+12% vs mois dernier</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Patients actifs</p>
                <p className="text-2xl font-bold">234</p>
                <p className="text-xs text-blue-500">+8 ce mois</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
                <p className="text-2xl font-bold">4.7/5</p>
                <p className="text-xs text-yellow-500">234 avis</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temps attente moy.</p>
                <p className="text-2xl font-bold">15min</p>
                <p className="text-xs text-green-500">Excellent</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="consultations">
        <TabsList>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
        </TabsList>

        <TabsContent value="consultations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Évolution mensuelle</CardTitle>
                <CardDescription>Nombre de consultations par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 opacity-50 mr-4" />
                  <p>Graphique à implémenter avec Recharts</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Par type de consultation</CardTitle>
                <CardDescription>Répartition sur le mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">Cabinet</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '70%' }}></div>
                      </div>
                      <span className="text-sm font-semibold">109 (70%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">Téléconsultation</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-sm font-semibold">39 (25%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">Domicile</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '5%' }}></div>
                      </div>
                      <span className="text-sm font-semibold">8 (5%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Taux de remplissage hebdomadaire</CardTitle>
              <CardDescription>Occupation de l'agenda par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, idx) => (
                  <div key={day} className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">{day}</p>
                    <div className="h-32 bg-muted rounded relative overflow-hidden">
                      <div 
                        className="absolute bottom-0 w-full bg-primary transition-all"
                        style={{ height: `${[85, 92, 78, 88, 90, 45, 0][idx]}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-semibold mt-2">{[85, 92, 78, 88, 90, 45, 0][idx]}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Nouveaux patients</CardTitle>
                <CardDescription>Évolution sur 6 mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <TrendingUp className="h-12 w-12 opacity-50 mr-4" />
                  <p>Graphique évolution nouveaux patients</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par genre</CardTitle>
                <CardDescription>Total de 234 patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Femmes</span>
                      <span className="text-sm font-semibold">135 (58%)</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500" style={{ width: '58%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Hommes</span>
                      <span className="text-sm font-semibold">99 (42%)</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Répartition par tranche d'âge</CardTitle>
              <CardDescription>Distribution de la patientèle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { age: '0-18', count: 28, pct: 12 },
                  { age: '19-30', count: 45, pct: 19 },
                  { age: '31-45', count: 67, pct: 29 },
                  { age: '46-60', count: 58, pct: 25 },
                  { age: '61-75', count: 26, pct: 11 },
                  { age: '75+', count: 10, pct: 4 }
                ].map((group) => (
                  <div key={group.age} className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">{group.age}</p>
                    <div className="h-32 bg-muted rounded relative overflow-hidden">
                      <div 
                        className="absolute bottom-0 w-full bg-primary transition-all"
                        style={{ height: `${group.pct * 3}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-semibold mt-2">{group.count}</p>
                    <p className="text-xs text-muted-foreground">{group.pct}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenus mensuels</CardTitle>
              <CardDescription>Évolution sur 12 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 opacity-50 mr-4" />
                <p>Graphique revenus mensuels</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Notes moyennes</CardTitle>
                <CardDescription>Évaluation par critère</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Qualité des soins', score: 4.8 },
                    { label: 'Écoute et empathie', score: 4.9 },
                    { label: 'Temps d\'attente', score: 4.2 },
                    { label: 'Explications claires', score: 4.7 },
                    { label: 'Ponctualité', score: 4.5 }
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{item.label}</span>
                        <span className="text-sm font-semibold">{item.score}/5</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500" 
                          style={{ width: `${(item.score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparaison nationale</CardTitle>
                <CardDescription>Votre position vs moyenne</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Votre note</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                      <span className="text-3xl font-bold">4.7</span>
                      <span className="text-muted-foreground">/5</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Moyenne nationale</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-6 w-6 text-gray-400" />
                      <span className="text-3xl font-bold text-muted-foreground">4.2</span>
                      <span className="text-muted-foreground">/5</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm font-medium text-green-700">Top 20% des médecins au Gabon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
