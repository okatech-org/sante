import { BarChart3, Users, TrendingUp, Clock, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";

export default function ProfessionalStatistics() {
  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* KPIs principaux */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-primary" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Consultations/mois</p>
            <p className="text-3xl font-bold text-foreground mb-1">156</p>
            <p className="text-xs text-green-500">+12%</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
              <Users className="w-7 h-7 text-blue-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Patients actifs</p>
            <p className="text-3xl font-bold text-foreground mb-1">234</p>
            <p className="text-xs text-blue-500">+8 ce mois</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center">
              <Star className="w-7 h-7 text-yellow-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Satisfaction</p>
            <p className="text-3xl font-bold text-foreground mb-1">4.7/5</p>
            <p className="text-xs text-muted-foreground">234 avis</p>
          </div>

          <div className="rounded-2xl backdrop-blur-xl p-6 text-center bg-card/40 border border-border/30 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
              <Clock className="w-7 h-7 text-green-500" />
            </div>
            <p className="text-xs mb-2 text-muted-foreground font-medium">Temps attente moy.</p>
            <p className="text-3xl font-bold text-foreground mb-1">15min</p>
            <p className="text-xs text-green-500">Excellent</p>
          </div>
        </div>

        {/* Évolution mensuelle */}
        <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Évolution des Consultations</h2>
              <p className="text-sm text-muted-foreground">Performance mensuelle</p>
            </div>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 opacity-50 mr-4" />
              <p>Graphique à implémenter avec Recharts</p>
            </div>
          </div>
        </Card>

        {/* Répartitions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Par type de consultation</h3>
              <div className="space-y-3">
                <div className="rounded-xl backdrop-blur-xl p-4 bg-card/60 border border-border/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Cabinet</span>
                    <span className="text-sm font-semibold">109 (70%)</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div className="rounded-xl backdrop-blur-xl p-4 bg-card/60 border border-border/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Téléconsultation</span>
                    <span className="text-sm font-semibold">39 (25%)</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div className="rounded-xl backdrop-blur-xl p-4 bg-card/60 border border-border/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Domicile</span>
                    <span className="text-sm font-semibold">8 (5%)</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Notes moyennes</h3>
              <div className="space-y-4">
                {[
                  { label: 'Qualité des soins', score: 4.8 },
                  { label: 'Écoute et empathie', score: 4.9 },
                  { label: 'Temps d\'attente', score: 4.2 },
                  { label: 'Ponctualité', score: 4.5 }
                ].map((item) => (
                  <div key={item.label} className="rounded-xl backdrop-blur-xl p-3 bg-card/60 border border-border/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{item.label}</span>
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
            </div>
          </Card>
        </div>

        {/* Performance nationale */}
        <Card className="rounded-3xl backdrop-blur-xl bg-card/40 border border-border/30 shadow-2xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Comparaison Nationale</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl backdrop-blur-xl p-6 bg-card/60 border border-border/20 text-center">
                <p className="text-sm text-muted-foreground mb-3">Votre note</p>
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                  <span className="text-4xl font-bold text-foreground">4.7</span>
                  <span className="text-muted-foreground">/5</span>
                </div>
              </div>
              <div className="rounded-xl backdrop-blur-xl p-6 bg-card/60 border border-border/20 text-center">
                <p className="text-sm text-muted-foreground mb-3">Moyenne nationale</p>
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-8 w-8 text-gray-400" />
                  <span className="text-4xl font-bold text-muted-foreground">4.2</span>
                  <span className="text-muted-foreground">/5</span>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl backdrop-blur-xl p-4 bg-green-500/10 border border-green-500/20 text-center">
              <p className="text-sm font-medium text-green-700">Top 20% des médecins au Gabon</p>
            </div>
          </div>
        </Card>
      </div>
    </PatientDashboardLayout>
  );
}
