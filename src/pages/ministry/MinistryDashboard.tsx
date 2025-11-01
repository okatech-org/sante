import { useState, useEffect } from "react";
import { MinistryHeroSection } from "@/components/ministry/MinistryHeroSection";
import { NationalStatisticsCard } from "@/components/ministry/NationalStatisticsCard";
import { AlertsPanel } from "@/components/ministry/AlertsPanel";
import { ProvincialPerformanceTable } from "@/components/ministry/ProvincialPerformanceTable";
import { MinistryFinancesCard } from "@/components/ministry/MinistryFinancesCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, FileText, Building2, Users, Settings, 
  ScrollText, TrendingUp, Heart, Shield, AlertTriangle,
  Briefcase, Globe, Target, Activity, Calendar,
  FileSignature, Award, DollarSign, ChevronRight
} from "lucide-react";
import { MinistryDashboard as MinistryDashboardType, MinistryContact } from "@/types/ministry";
import { useNavigate } from "react-router-dom";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { toast } from "sonner";

const MinistryDashboard = () => {
  const { user } = useOfflineAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<MinistryDashboardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Vérifier si c'est le ministre
  const isMinister = user?.email === 'ministre@sante.gouv.ga';

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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 max-w-5xl mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            {isMinister && (
              <TabsTrigger value="decrets" className="flex items-center gap-2">
                <FileSignature className="h-4 w-4" />
                <span className="hidden sm:inline">Décrets</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="statistiques" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Statistiques</span>
            </TabsTrigger>
            <TabsTrigger value="structures" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Structures</span>
            </TabsTrigger>
            <TabsTrigger value="programmes" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Programmes</span>
            </TabsTrigger>
            <TabsTrigger value="rapports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Rapports</span>
            </TabsTrigger>
            {isMinister && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* En-tête personnalisé pour le ministre */}
            {isMinister && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Bienvenue, Pr. MOUGOUGOU</h2>
                    <p className="text-blue-100">Ministre de la Santé</p>
                    <p className="text-sm text-blue-100 mt-2">
                      Tableau de bord exécutif - Vue d'ensemble du système de santé national
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-100">Session active</p>
                    <p className="text-2xl font-bold">{new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            )}
            
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

          {/* Nouvel onglet: Décrets Ministériels (uniquement pour le ministre) */}
          {isMinister && (
            <TabsContent value="decrets" className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Décrets et Documents Ministériels</h2>
                <Button 
                  onClick={() => toast.info("Module de création de décret en cours de développement")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileSignature className="mr-2 h-4 w-4" />
                  Nouveau Décret
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Décrets en cours */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ScrollText className="h-5 w-5" />
                      Décrets en Cours
                    </CardTitle>
                    <CardDescription>Documents en préparation ou révision</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">Décret N°2025/MS/001</h4>
                          <Badge variant="outline">Révision</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Réorganisation des services d'urgence
                        </p>
                        <Progress value={75} className="h-2" />
                      </div>
                      
                      <div className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">Arrêté N°2025/MS/047</h4>
                          <Badge variant="outline">Brouillon</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Nomination des chefs de service
                        </p>
                        <Progress value={30} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Documents récents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Documents Signés Récemment
                    </CardTitle>
                    <CardDescription>Derniers documents officiels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">Circulaire MS/2025/012</p>
                          <p className="text-xs text-muted-foreground">Vaccination COVID-19</p>
                        </div>
                        <span className="text-xs text-muted-foreground">28/10/2025</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">Note de Service MS/2025/089</p>
                          <p className="text-xs text-muted-foreground">Protocoles d'hygiène</p>
                        </div>
                        <span className="text-xs text-muted-foreground">25/10/2025</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions rapides */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Actions Ministérielles
                    </CardTitle>
                    <CardDescription>Gestion documentaire</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Modèles de documents
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Calendrier législatif
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Globe className="mr-2 h-4 w-4" />
                      Publications officielles
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Tableau des décrets */}
              <Card>
                <CardHeader>
                  <CardTitle>Registre des Décrets et Arrêtés</CardTitle>
                  <CardDescription>Liste complète des documents ministériels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 text-sm font-semibold">Référence</th>
                          <th className="text-left p-2 text-sm font-semibold">Type</th>
                          <th className="text-left p-2 text-sm font-semibold">Objet</th>
                          <th className="text-left p-2 text-sm font-semibold">Date</th>
                          <th className="text-left p-2 text-sm font-semibold">Statut</th>
                          <th className="text-left p-2 text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-2 text-sm">DEC/2025/MS/001</td>
                          <td className="p-2 text-sm">Décret</td>
                          <td className="p-2 text-sm">Réorganisation services urgence</td>
                          <td className="p-2 text-sm">15/10/2025</td>
                          <td className="p-2"><Badge className="text-xs">Publié</Badge></td>
                          <td className="p-2">
                            <Button size="sm" variant="ghost">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Nouvel onglet: Statistiques Avancées */}
          <TabsContent value="statistiques" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Statistiques et Indicateurs de Santé</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Exporter PDF
                </Button>
                <Button variant="outline" size="sm">
                  Actualiser
                </Button>
              </div>
            </div>

            {/* Indicateurs clés */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Couverture CNAMGS</CardTitle>
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <Progress value={78} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Objectif 2028: 95%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Mortalité Maternelle</CardTitle>
                    <Heart className="h-4 w-4 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">316/100k</div>
                  <div className="flex items-center mt-2 text-xs">
                    <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-500">+5% vs 2024</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Objectif: &lt;150/100k
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Vaccination Infantile</CardTitle>
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <Progress value={92} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    PEV complet (0-5 ans)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Budget Exécuté</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">65%</div>
                  <Progress value={65} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    97.5 Mds FCFA / 150 Mds
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Graphiques et analyses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des Indicateurs Clés</CardTitle>
                  <CardDescription>Tendances sur les 12 derniers mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-muted-foreground">Graphique en cours d'intégration</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Province</CardTitle>
                  <CardDescription>Performance des régions sanitaires</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Estuaire</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-24 h-2" />
                        <span className="text-xs font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Haut-Ogooué</span>
                      <div className="flex items-center gap-2">
                        <Progress value={72} className="w-24 h-2" />
                        <span className="text-xs font-medium">72%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ogooué-Maritime</span>
                      <div className="flex items-center gap-2">
                        <Progress value={68} className="w-24 h-2" />
                        <span className="text-xs font-medium">68%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Woleu-Ntem</span>
                      <div className="flex items-center gap-2">
                        <Progress value={61} className="w-24 h-2" />
                        <span className="text-xs font-medium">61%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertes et recommandations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Recommandations et Actions Prioritaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Rupture de stocks critiques</h4>
                      <p className="text-sm text-gray-600">
                        3 provinces signalent des ruptures d'insuline. Action immédiate requise pour 
                        l'approvisionnement d'urgence.
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Voir le plan d'action
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Objectif CSU 2025</h4>
                      <p className="text-sm text-gray-600">
                        Pour atteindre 85% de couverture fin 2025, intensifier les campagnes 
                        d'enrôlement dans les zones rurales.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default MinistryDashboard;

