import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Building2,
  Users,
  Bed,
  Activity,
  AlertCircle,
  TrendingUp,
  Calendar,
  Settings,
  Bell,
  Stethoscope,
  MapPin,
  Phone,
  Siren,
  Clock,
  Package,
  TestTube,
  ClipboardList,
  UserCog,
  Scan,
  Loader2,
  AlertTriangle
} from "lucide-react";

import { SogaraDashboardLayout } from "@/components/layout/SogaraDashboardLayout";
import { supabase } from "@/integrations/supabase/client";

// Types
interface HospitalStats {
  employees: number;
  activeEmployees: number;
  beds: number;
  occupancyRate: number;
  consultationsToday: number;
  emergenciesToday: number;
  scheduledAppointments: number;
  pendingWorkMedExams: number;
}

interface HospitalData {
  name: string;
  type: string;
  location: string;
  province: string;
  phone: string;
  services: string[];
  specialties: string[];
  conventionnement: {
    cnamgs: boolean;
    cnss: boolean;
  };
  stats: HospitalStats;
}

export default function SogaraDashboard() {
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hospitalData, setHospitalData] = useState<HospitalData>({
    name: "Centre Médical de Santé au Travail SOGARA",
    type: "Hôpital d'entreprise",
    location: "Zone SOGARA, Port-Gentil",
    province: "Ogooué-Maritime",
    phone: "011 55 26 21",
    services: [
      "Urgences",
      "Consultations",
      "Maternité",
      "Chirurgie",
      "Radiologie",
      "Laboratoire",
      "Hospitalisation",
      "Médecine du travail"
    ],
    specialties: [
      "Médecine générale",
      "Gynécologie-Obstétrique",
      "Chirurgie générale",
      "Radiologie",
      "Médecine du travail"
    ],
    conventionnement: {
      cnamgs: true,
      cnss: true
    },
    stats: {
      employees: 1250,
      activeEmployees: 1180,
      beds: 85,
      occupancyRate: 68,
      consultationsToday: 42,
      emergenciesToday: 8,
      scheduledAppointments: 156,
      pendingWorkMedExams: 23
    }
  });

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // ✅ Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un appel API (à remplacer par un vrai appel)
      // const { data, error: apiError } = await supabase
      //   .from('establishment_stats')
      //   .select('*')
      //   .eq('establishment_id', 'sogara-id')
      //   .single();

      // Pour l'instant, données simulées
      await new Promise(resolve => setTimeout(resolve, 800));

      // Les données sont déjà dans le state initial
      setLoading(false);
      
    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      setError(err.message || "Erreur lors du chargement du dashboard");
      setLoading(false);
      toast.error("Erreur", {
        description: "Impossible de charger les données du dashboard"
      });
    }
  };

  // ✅ Refresh dashboard data
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
      toast.success("Données actualisées", {
        description: "Le dashboard a été rafraîchi avec succès"
      });
    } catch (err) {
      toast.error("Erreur", {
        description: "Impossible d'actualiser les données"
      });
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Navigate to settings
  const handleSettings = () => {
    navigate('/establishments/sogara/admin/settings');
    toast.info("Navigation", {
      description: "Redirection vers les paramètres..."
    });
  };

  // ✅ Show notifications
  const handleNotifications = () => {
    navigate('/establishments/sogara/admin/notifications');
    toast.info("Notifications", {
      description: "3 nouvelles notifications"
    });
  };

  // ✅ View work medicine exams
  const handleViewWorkMedExams = () => {
    navigate('/establishments/sogara/admin/work-medicine');
    toast.info("Médecine du travail", {
      description: "Consultation des examens en attente..."
    });
  };

  // ✅ Manage pharmacy stock
  const handleManageStock = () => {
    navigate('/establishments/sogara/admin/pharmacy');
    toast.info("Pharmacie", {
      description: "Gestion du stock de médicaments..."
    });
  };

  // ✅ View lab results
  const handleViewLabResults = () => {
    navigate('/establishments/sogara/admin/laboratory');
    toast.info("Laboratoire", {
      description: "Consultation des résultats..."
    });
  };

  // ✅ Navigate to sections
  const handleNavigateToSection = (section: string) => {
    const routes: Record<string, string> = {
      'consultations': '/establishments/sogara/admin/consultations',
      'emergency': '/establishments/sogara/admin/emergency',
      'employees': '/establishments/sogara/admin/employees',
      'work-medicine': '/establishments/sogara/admin/work-medicine',
      'hospitalization': '/establishments/sogara/admin/hospitalization',
      'technical': '/establishments/sogara/admin/technical'
    };

    const route = routes[section];
    if (route) {
      navigate(route);
    } else {
      toast.error("Navigation", {
        description: "Section non disponible"
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <SogaraDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Chargement du dashboard...</p>
          </div>
        </div>
      </SogaraDashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <SogaraDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <CardTitle>Erreur de chargement</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={loadDashboardData} className="w-full">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </SogaraDashboardLayout>
    );
  }

  return (
    <SogaraDashboardLayout>
      <div className="space-y-6">
        {/* Header avec informations de l'établissement */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border rounded-lg p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground break-words">
                  {hospitalData.name}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mt-1">{hospitalData.type}</p>
                <div className="flex items-center flex-wrap gap-2 md:gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{hospitalData.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{hospitalData.phone}</span>
                  </div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
                    24h/24, 7j/7
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSettings}
                aria-label="Paramètres de l'établissement"
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
              <Button 
                size="sm" 
                className="gap-2"
                onClick={handleNotifications}
                aria-label="Voir les notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications (3)</span>
                <span className="sm:hidden">(3)</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                aria-label="Actualiser les données"
              >
                <Loader2 className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Vue d'ensemble */}
        <div className="space-y-6">
            {/* KPIs Principaux */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Employés SOGARA</p>
                      <p className="text-2xl md:text-3xl font-bold text-foreground">{hospitalData.stats.employees}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        {hospitalData.stats.activeEmployees} actifs
                      </p>
                    </div>
                    <Users className="w-8 md:w-10 h-8 md:h-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="w-full">
                      <p className="text-sm text-muted-foreground">Lits disponibles</p>
                      <p className="text-2xl md:text-3xl font-bold text-foreground">
                        {Math.round(hospitalData.stats.beds * (1 - hospitalData.stats.occupancyRate / 100))}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Taux d'occupation: {hospitalData.stats.occupancyRate}%
                      </p>
                      <Progress value={hospitalData.stats.occupancyRate} className="mt-3" />
                    </div>
                    <Bed className="w-8 md:w-10 h-8 md:h-10 text-purple-500 ml-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Consultations</p>
                      <p className="text-2xl md:text-3xl font-bold text-foreground">{hospitalData.stats.consultationsToday}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {hospitalData.stats.scheduledAppointments} RDV planifiés
                      </p>
                    </div>
                    <Stethoscope className="w-8 md:w-10 h-8 md:h-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Urgences</p>
                      <p className="text-2xl md:text-3xl font-bold text-foreground">{hospitalData.stats.emergenciesToday}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Délai moyen: 18 min
                      </p>
                    </div>
                    <Siren className="w-8 md:w-10 h-8 md:h-10 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services et Spécialités */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Services Disponibles</CardTitle>
                  <CardDescription>Services offerts par l'établissement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {hospitalData.services.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Spécialités Médicales</CardTitle>
                  <CardDescription>Spécialités pratiquées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {hospitalData.specialties.map((specialty, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertes et Actions rapides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Alertes et Rappels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Examens médecine du travail</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {hospitalData.stats.pendingWorkMedExams} employés à convoquer
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleViewWorkMedExams}
                      className="flex-shrink-0"
                    >
                      Voir
                    </Button>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <Package className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Stock pharmacie faible</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        12 médicaments sous le seuil
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleManageStock}
                      className="flex-shrink-0"
                    >
                      Gérer
                    </Button>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <TestTube className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Résultats laboratoire</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        8 résultats à valider
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleViewLabResults}
                      className="flex-shrink-0"
                    >
                      Consulter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                  <CardDescription>Accès rapide aux fonctionnalités principales</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col gap-2 py-4 touch-manipulation min-h-[88px]" 
                    onClick={() => handleNavigateToSection("consultations")}
                  >
                    <ClipboardList className="w-6 h-6" />
                    <span className="text-sm text-center">Nouvelle Consultation</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col gap-2 py-4 touch-manipulation min-h-[88px]" 
                    onClick={() => handleNavigateToSection("emergency")}
                  >
                    <Siren className="w-6 h-6 text-red-500" />
                    <span className="text-sm text-center">Urgence</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col gap-2 py-4 touch-manipulation min-h-[88px]" 
                    onClick={() => handleNavigateToSection("employees")}
                  >
                    <Users className="w-6 h-6 text-blue-500" />
                    <span className="text-sm text-center">Rechercher Employé</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col gap-2 py-4 touch-manipulation min-h-[88px]" 
                    onClick={() => handleNavigateToSection("work-medicine")}
                  >
                    <UserCog className="w-6 h-6 text-purple-500" />
                    <span className="text-sm text-center">Médecine Travail</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col gap-2 py-4 touch-manipulation min-h-[88px]" 
                    onClick={() => handleNavigateToSection("hospitalization")}
                  >
                    <Bed className="w-6 h-6 text-green-500" />
                    <span className="text-sm text-center">Hospitalisation</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col gap-2 py-4 touch-manipulation min-h-[88px]" 
                    onClick={() => handleNavigateToSection("technical")}
                  >
                    <Scan className="w-6 h-6 text-orange-500" />
                    <span className="text-sm text-center">Plateaux Tech.</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Conventionnement */}
            <Card>
              <CardHeader>
                <CardTitle>Conventionnement</CardTitle>
                <CardDescription>Organismes de prise en charge conventionnés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {hospitalData.conventionnement.cnamgs && (
                    <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30 text-base px-4 py-2">
                      <Activity className="w-4 h-4 mr-2" />
                      Conventionné CNAMGS
                    </Badge>
                  )}
                  {hospitalData.conventionnement.cnss && (
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 text-base px-4 py-2">
                      <Activity className="w-4 h-4 mr-2" />
                      Conventionné CNSS
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </SogaraDashboardLayout>
  );
}
