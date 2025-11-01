import { useState, useEffect } from "react";
import { MinistryHeroSection } from "@/components/ministry/MinistryHeroSection";
import { NationalStatisticsCard } from "@/components/ministry/NationalStatisticsCard";
import { AlertsPanel } from "@/components/ministry/AlertsPanel";
import { ProvincialPerformanceTable } from "@/components/ministry/ProvincialPerformanceTable";
import { MinistryFinancesCard } from "@/components/ministry/MinistryFinancesCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Building2, Users, Settings } from "lucide-react";
import { MinistryDashboard as MinistryDashboardType, MinistryContact } from "@/types/ministry";

const MinistryDashboard = () => {
  // Pas de vérification d'authentification ici - page publique
  const [dashboardData, setDashboardData] = useState<MinistryDashboardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ministryContact: MinistryContact = {
    adresse_physique: "À côté de l'immeuble Alu-Suisse, Libreville, Gabon",
    boite_postale: "BP 50",
    telephone_principal: "+241 01-72-26-61",
    telephone_secretariat: "+241 06 47 74 83",
    email_officiel: "contact@sante.gouv.ga",
    site_web: "https://sante.gouv.ga",
    horaires: {
      lundi_vendredi: "08h00 - 17h00",
      weekend: "Fermé",
      jours_feries: "Fermé"
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    const mockData: MinistryDashboardType = {
      statistiques_nationales: {
        population_couverte_cnamgs: 1800000,
        taux_couverture: "78%",
        etablissements_operationnels: 238,
        professionnels_actifs: {
          medecins: 2159,
          infirmiers: 15000,
          pharmaciens: 150
        },
        consultations_mensuelles: 85000,
        teleconsultations_mensuelles: 12500
      },
      alertes_prioritaires: {
        ruptures_medicaments: [
          {
            id: "alert-1",
            type: "rupture_medicament",
            titre: "Rupture d'insuline",
            description: "Stock critique dans 3 établissements",
            province: "Haut-Ogooué",
            niveau_priorite: "critique",
            date_signalement: "2025-10-28",
            status: "active"
          },
          {
            id: "alert-2",
            type: "rupture_medicament",
            titre: "Rupture antipaludéens",
            description: "Rupture partielle",
            province: "Ogooué-Ivindo",
            niveau_priorite: "haute",
            date_signalement: "2025-10-30",
            status: "active"
          }
        ],
        equipements_panne: [
          {
            id: "alert-3",
            type: "equipement_panne",
            titre: "Scanner en panne - CHR Franceville",
            description: "Maintenance requise d'urgence",
            province: "Haut-Ogooué",
            niveau_priorite: "haute",
            date_signalement: "2025-10-25",
            status: "en_cours"
          }
        ],
        epidemies_signalees: [
          {
            id: "alert-4",
            type: "epidemie",
            titre: "Paludisme - Hausse des cas",
            description: "Augmentation de 15% des cas",
            province: "Nyanga",
            niveau_priorite: "moyenne",
            date_signalement: "2025-10-20",
            status: "active"
          }
        ],
        evasan_hebdomadaires: 12
      },
      performance_provinces: [
        {
          province: "Estuaire",
          taux_occupation_lits: 78,
          delai_moyen_rdv: "2 jours",
          satisfaction_patients: 4.3,
          etablissements_actifs: 95,
          professionnels_total: 8500,
          population_couverte: 850000
        },
        {
          province: "Haut-Ogooué",
          taux_occupation_lits: 65,
          delai_moyen_rdv: "5 jours",
          satisfaction_patients: 4.1,
          etablissements_actifs: 42,
          professionnels_total: 2800,
          population_couverte: 250000
        },
        {
          province: "Moyen-Ogooué",
          taux_occupation_lits: 55,
          delai_moyen_rdv: "7 jours",
          satisfaction_patients: 3.9,
          etablissements_actifs: 28,
          professionnels_total: 1200,
          population_couverte: 150000
        },
        {
          province: "Ngounié",
          taux_occupation_lits: 60,
          delai_moyen_rdv: "6 jours",
          satisfaction_patients: 4.0,
          etablissements_actifs: 18,
          professionnels_total: 1100,
          population_couverte: 120000
        },
        {
          province: "Nyanga",
          taux_occupation_lits: 52,
          delai_moyen_rdv: "8 jours",
          satisfaction_patients: 3.8,
          etablissements_actifs: 15,
          professionnels_total: 800,
          population_couverte: 90000
        },
        {
          province: "Ogooué-Ivindo",
          taux_occupation_lits: 58,
          delai_moyen_rdv: "9 jours",
          satisfaction_patients: 3.7,
          etablissements_actifs: 12,
          professionnels_total: 650,
          population_couverte: 75000
        },
        {
          province: "Ogooué-Lolo",
          taux_occupation_lits: 48,
          delai_moyen_rdv: "10 jours",
          satisfaction_patients: 3.6,
          etablissements_actifs: 10,
          professionnels_total: 550,
          population_couverte: 65000
        },
        {
          province: "Ogooué-Maritime",
          taux_occupation_lits: 62,
          delai_moyen_rdv: "5 jours",
          satisfaction_patients: 4.0,
          etablissements_actifs: 14,
          professionnels_total: 900,
          population_couverte: 110000
        },
        {
          province: "Woleu-Ntem",
          taux_occupation_lits: 54,
          delai_moyen_rdv: "8 jours",
          satisfaction_patients: 3.9,
          etablissements_actifs: 14,
          professionnels_total: 750,
          population_couverte: 90000
        }
      ],
      finances: {
        budget_annuel: "150 milliards FCFA",
        execution_budgetaire: 65,
        arrieres_cnamgs: "Monitoring en cours - réduction progressive",
        economies_evasan: "-2 Milliards FCFA (grâce à la télémédecine)"
      }
    };

    setTimeout(() => {
      setDashboardData(mockData);
      setIsLoading(false);
    }, 500);
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MinistryHeroSection contact={ministryContact} />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="structures" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Structures</span>
            </TabsTrigger>
            <TabsTrigger value="programmes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Programmes</span>
            </TabsTrigger>
            <TabsTrigger value="rapports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Rapports</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Vue d'Ensemble Nationale
              </h2>
              
              <NationalStatisticsCard statistics={dashboardData.statistiques_nationales} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProvincialPerformanceTable performance={dashboardData.performance_provinces} />
              </div>
              
              <div className="space-y-6">
                <AlertsPanel alerts={dashboardData.alertes_prioritaires} />
                <MinistryFinancesCard finances={dashboardData.finances} />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Objectifs Stratégiques PNDS 2024-2028</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Couverture Sanitaire Universelle</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Actuel:</span>
                        <span className="font-semibold">78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cible 2028:</span>
                        <span className="font-semibold text-green-600">95%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Mortalité Maternelle</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Actuel:</span>
                        <span className="font-semibold">316/100k</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cible 2028:</span>
                        <span className="font-semibold text-green-600">&lt;150/100k</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Mortalité Infantile</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Actuel:</span>
                        <span className="font-semibold">45/1000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cible 2028:</span>
                        <span className="font-semibold text-green-600">&lt;25/1000</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Ratio Médecins</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Actuel:</span>
                        <span className="font-semibold">0.8/1000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cible 2028:</span>
                        <span className="font-semibold text-green-600">1.5/1000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structures">
            <Card>
              <CardHeader>
                <CardTitle>Annuaire National des Structures de Santé</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fonctionnalité en cours de développement...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programmes">
            <Card>
              <CardHeader>
                <CardTitle>Programmes Nationaux de Santé</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fonctionnalité en cours de développement...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rapports">
            <Card>
              <CardHeader>
                <CardTitle>Publications et Rapports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fonctionnalité en cours de développement...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Administration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fonctionnalité en cours de développement...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MinistryDashboard;

