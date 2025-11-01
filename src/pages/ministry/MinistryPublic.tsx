// Page publique du Ministère de la Santé (sans authentification)
// SANTE.GA - Plateforme E-Santé Gabon

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

/**
 * Version publique du dashboard du Ministère
 * Pas de vérification d'authentification
 */
const MinistryPublic = () => {
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
          taux_occupation: 78,
          satisfaction_patients: 4.2,
          delai_attente_moyen: "45 min",
          taux_mortalite: 1.2,
          budget_utilise: 85,
          couleur_statut: "success"
        },
        {
          province: "Haut-Ogooué",
          taux_occupation: 85,
          satisfaction_patients: 3.8,
          delai_attente_moyen: "1h15",
          taux_mortalite: 1.8,
          budget_utilise: 92,
          couleur_statut: "warning"
        },
        {
          province: "Ogooué-Maritime",
          taux_occupation: 72,
          satisfaction_patients: 4.0,
          delai_attente_moyen: "55 min",
          taux_mortalite: 1.5,
          budget_utilise: 78,
          couleur_statut: "success"
        },
        {
          province: "Woleu-Ntem",
          taux_occupation: 65,
          satisfaction_patients: 3.9,
          delai_attente_moyen: "50 min",
          taux_mortalite: 1.6,
          budget_utilise: 70,
          couleur_statut: "success"
        },
        {
          province: "Moyen-Ogooué",
          taux_occupation: 68,
          satisfaction_patients: 3.7,
          delai_attente_moyen: "1h05",
          taux_mortalite: 2.0,
          budget_utilise: 75,
          couleur_statut: "warning"
        }
      ],
      finances_sante: {
        budget_total: 450000000000,
        budget_execute: 382500000000,
        taux_execution: 85,
        repartition: {
          infrastructures: 35,
          personnels: 40,
          medicaments: 15,
          equipements: 10
        }
      }
    };
    
    setDashboardData(mockData);
    setTimeout(() => setIsLoading(false), 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <MinistryHeroSection contact={ministryContact} />
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Tableau de Bord National</h2>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4 max-w-2xl">
            <TabsTrigger value="overview" className="flex items-center gap-2 text-xs md:text-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden md:inline">Vue d'ensemble</span>
              <span className="md:hidden">Général</span>
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-2 text-xs md:text-sm">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Programmes</span>
              <span className="md:hidden">Prog.</span>
            </TabsTrigger>
            <TabsTrigger value="establishments" className="flex items-center gap-2 text-xs md:text-sm">
              <Building2 className="h-4 w-4" />
              <span className="hidden md:inline">Établissements</span>
              <span className="md:hidden">Étab.</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 text-xs md:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Rapports</span>
              <span className="md:hidden">Rap.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <NationalStatisticsCard stats={dashboardData.statistiques_nationales} />
              <MinistryFinancesCard finances={dashboardData.finances_sante} />
              <AlertsPanel alerts={dashboardData.alertes_prioritaires} />
            </div>
            
            <ProvincialPerformanceTable performances={dashboardData.performance_provinces} />
          </TabsContent>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>Programmes Nationaux de Santé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Programme National de Lutte contre le Paludisme</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Distribution de 500,000 moustiquaires imprégnées dans 5 provinces
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Progression</span>
                      <span className="font-semibold">72%</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Programme de Vaccination Élargi (PEV)</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Campagne de vaccination contre la rougeole et la rubéole
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Couverture vaccinale</span>
                      <span className="font-semibold">89%</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Programme de Santé Maternelle et Infantile</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Réduction de la mortalité maternelle et néonatale
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Objectif atteint</span>
                      <span className="font-semibold">65%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="establishments">
            <Card>
              <CardHeader>
                <CardTitle>Réseau National des Établissements de Santé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">CHU</h4>
                    <p className="text-2xl font-bold">4</p>
                    <p className="text-sm text-gray-600">Centres Hospitaliers Universitaires</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">CHR</h4>
                    <p className="text-2xl font-bold">9</p>
                    <p className="text-sm text-gray-600">Centres Hospitaliers Régionaux</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Centres de Santé</h4>
                    <p className="text-2xl font-bold">52</p>
                    <p className="text-sm text-gray-600">Centres médicaux et dispensaires</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Cliniques Privées</h4>
                    <p className="text-2xl font-bold">147</p>
                    <p className="text-sm text-gray-600">Établissements privés conventionnés</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Pharmacies</h4>
                    <p className="text-2xl font-bold">114</p>
                    <p className="text-sm text-gray-600">Officines agréées</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Laboratoires</h4>
                    <p className="text-2xl font-bold">18</p>
                    <p className="text-sm text-gray-600">Laboratoires d'analyses médicales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Rapports et Publications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h4 className="font-medium">Rapport Annuel de Santé Publique 2024</h4>
                      <p className="text-sm text-gray-600">Publié le 15 octobre 2025</p>
                    </div>
                    <button className="text-primary hover:underline text-sm">Télécharger</button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h4 className="font-medium">Bulletin Épidémiologique Hebdomadaire</h4>
                      <p className="text-sm text-gray-600">Semaine 44 - 2025</p>
                    </div>
                    <button className="text-primary hover:underline text-sm">Télécharger</button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h4 className="font-medium">Plan National de Développement Sanitaire 2024-2028</h4>
                      <p className="text-sm text-gray-600">Document stratégique</p>
                    </div>
                    <button className="text-primary hover:underline text-sm">Télécharger</button>
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

export default MinistryPublic;
