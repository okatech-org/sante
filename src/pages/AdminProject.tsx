
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FileText, 
  Layers, 
  Database, 
  Smartphone, 
  Users, 
  Shield, 
  Activity,
  GitBranch,
  Server,
  Cloud,
  Lock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowUp,
  BookOpen,
  Code,
  Zap,
  Workflow
} from "lucide-react";
import { ImplementationPlan } from "@/components/admin/ImplementationPlan";
import { BackendImplementationPlan } from "@/components/admin/BackendImplementationPlan";

export default function AdminProject() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SuperAdminLayout>
      <div className="relative min-h-screen">
        {/* Hero Section with improved visuals */}
        <div className="border-b backdrop-blur-xl bg-gradient-to-br from-primary/10 via-secondary/5 to-background sticky top-0 z-20 shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-start gap-3 sm:items-center">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 flex-shrink-0 animate-in fade-in slide-in-from-left-5 duration-500">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                </div>
                <div className="animate-in fade-in slide-in-from-right-5 duration-500">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    {t('project.title')}
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground mt-1">
                    {t('project.subtitle')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-3 duration-700">
                <Badge variant="secondary" className="text-xs sm:text-sm hover:scale-105 transition-transform">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {t('project.version')}
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm hover:scale-105 transition-transform border-blue-500/50 text-blue-600 dark:text-blue-400">React + TypeScript</Badge>
                <Badge variant="outline" className="text-xs sm:text-sm hover:scale-105 transition-transform border-green-500/50 text-green-600 dark:text-green-400">Lovable Cloud</Badge>
                <Badge variant="outline" className="text-xs sm:text-sm hover:scale-105 transition-transform text-success border-success bg-success/10">{t('project.productionReady')}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tabs Navigation - Enhanced with better UX */}
            <div className="sticky top-[110px] sm:top-[130px] z-10 backdrop-blur-2xl bg-gradient-to-r from-background via-background/98 to-background pb-4 border-b-2 border-primary/10 shadow-lg rounded-2xl animate-in fade-in-50 duration-500">
              <ScrollArea className="w-full rounded-xl">
                <TabsList className="inline-flex w-auto min-w-full sm:grid sm:grid-cols-9 gap-1.5 sm:gap-2 p-2 bg-gradient-to-br from-muted/60 to-muted/40 rounded-xl shadow-inner border border-border/30">
                  <TabsTrigger 
                    value="overview" 
                    className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                  >
                    <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{t('project.overview')}</span>
                    <span className="sm:hidden">{t('project.overview')}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="features" 
                    className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                  >
                    <Activity className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>{t('project.features')}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="architecture" 
                    className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                  >
                    <Layers className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>{t('project.architecture')}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="backend" 
                    className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                  >
                    <Database className="h-4 w-4 mr-1 sm:mr-2" />
                    {t('project.backend')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="frontend" 
                    className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                  >
                    <Code className="h-4 w-4 mr-1 sm:mr-2" />
                    {t('project.frontend')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="implementation" 
                    className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                  >
                    <Workflow className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>{t('project.implementation')}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="backend-cursor" 
                    className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                  >
                    <Server className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{t('project.backend')} Cursor</span>
                    <span className="sm:hidden">Cursor</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                  >
                    <Shield className="h-4 w-4 mr-1 sm:mr-2" />
                    <span>{t('project.security')}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="roadmap" 
                    className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg"
                  >
                    <GitBranch className="h-4 w-4 mr-1 sm:mr-2" />
                    {t('project.roadmap')}
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>
            </div>

            {/* VUE D'ENSEMBLE */}
            <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              <Card className="border-2 hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-card/95">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    {t('project.presentation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-3">{t('project.mission')}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {t('project.missionDesc')}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      {t('project.mainObjectives')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {[
                        { title: t('project.healthcareAccess'), desc: t('project.healthcareAccessDesc'), color: "from-blue-500/10 to-blue-500/5" },
                        { title: t('project.medicalRecord'), desc: t('project.medicalRecordDesc'), color: "from-green-500/10 to-green-500/5" },
                        { title: t('project.adminManagement'), desc: t('project.adminManagementDesc'), color: "from-purple-500/10 to-purple-500/5" },
                        { title: t('project.telemedicine'), desc: t('project.telemedicineDesc'), color: "from-pink-500/10 to-pink-500/5" }
                      ].map((item, i) => (
                        <div 
                          key={i} 
                          className={`flex gap-3 p-4 rounded-xl border-2 bg-gradient-to-br ${item.color} hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-in fade-in slide-in-from-bottom-3`}
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">{item.title}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">{t('project.ecosystem')}</h3>
                    <div className="p-4 sm:p-6 rounded-lg border bg-gradient-to-br from-card to-muted/20">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-sm sm:text-base">{t('project.systemActors')}</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs sm:text-sm">
                        <div className="p-2 rounded bg-background">• Patients (citoyens gabonais)</div>
                        <div className="p-2 rounded bg-background">• Médecins généralistes</div>
                        <div className="p-2 rounded bg-background">• Médecins spécialistes</div>
                        <div className="p-2 rounded bg-background">• Infirmiers</div>
                        <div className="p-2 rounded bg-background">• Sages-femmes</div>
                        <div className="p-2 rounded bg-background">• Kinésithérapeutes</div>
                        <div className="p-2 rounded bg-background">• Psychologues</div>
                        <div className="p-2 rounded bg-background">• Ophtalmologistes</div>
                        <div className="p-2 rounded bg-background">• Anesthésistes</div>
                        <div className="p-2 rounded bg-background">• Pharmaciens</div>
                        <div className="p-2 rounded bg-background">• Radiologues</div>
                        <div className="p-2 rounded bg-background">• Techniciens de laboratoire</div>
                        <div className="p-2 rounded bg-background">• Hôpitaux publics</div>
                        <div className="p-2 rounded bg-background">• Cliniques privées</div>
                        <div className="p-2 rounded bg-background">• Pharmacies</div>
                        <div className="p-2 rounded bg-background">• Centres de radiologie</div>
                        <div className="p-2 rounded bg-background">• Laboratoires d&apos;analyses</div>
                        <div className="p-2 rounded bg-background">• CNAMGS (assurance)</div>
                        <div className="p-2 rounded bg-background">• CNSS (sécurité sociale)</div>
                        <div className="p-2 rounded bg-background">• Administrateurs système</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-card/95">
                <CardHeader className="bg-gradient-to-r from-blue-500/5 to-green-500/5">
                  <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                    <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    {t('project.technologies')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="p-4 sm:p-6 rounded-lg border bg-gradient-to-br from-blue-500/5 to-transparent">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
                        Frontend
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          React 18.3.1
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          TypeScript
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Vite (build tool)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          TailwindCSS + shadcn/ui
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          React Router v6
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          React Query (TanStack)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          React Hook Form + Zod
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Lucide React (icons)
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 sm:p-6 rounded-lg border bg-gradient-to-br from-green-500/5 to-transparent">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <Server className="h-4 w-4 sm:h-5 sm:w-5" />
                        Backend
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-success" />
                          Lovable Cloud (Supabase)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-success" />
                          PostgreSQL (database)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-success" />
                          Supabase Auth
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-success" />
                          Row Level Security (RLS)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-success" />
                          Edge Functions (Deno)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-success" />
                          Supabase Storage
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-success" />
                          Real-time subscriptions
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FONCTIONNALITÉS */}
            <TabsContent value="features" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              <Card className="border-2 hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-card/95">
                <CardHeader className="bg-gradient-to-r from-secondary/5 to-accent/5">
                  <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                    <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                    Fonctionnalités Implémentées
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Liste complète des fonctionnalités actuellement disponibles dans la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Landing Page - Aurora Glass */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Landing Page "Aurora Glass" ✨
                    </h3>
                    <div className="grid gap-3">
                      {[
                        { title: "Design System Aurora Glass", desc: "Glassmorphism + palette 4 couleurs (turquoise, bleu, jaune, rose)" },
                        { title: "Hero Section Dynamique", desc: "Gradients multicolores, search bar avancée, badges animés" },
                        { title: "Stats Bar Interactive", desc: "4 statistiques avec icônes colorées et animations cascade" },
                        { title: "Services Grid", desc: "4 services avec hover effects, bordures colorées et transitions" },
                        { title: "Comment ça marche", desc: "4 étapes numérotées avec couleurs alternées et line animée" },
                        { title: "Section Trust", desc: "Badges sécurisé/validé, formulaire CNAMGS avec bouton rose" },
                        { title: "Traductions Complètes", desc: "5 langues (FR, EN, ES, AR, PT) - Page 100% internationalisée" },
                        { title: "Responsive Design", desc: "Mobile-first avec menu hamburger et navigation adaptative" },
                        { title: "Animations Fluides", desc: "Fade-in, scale-in, hover-scale avec délais en cascade" },
                        { title: "Footer Complet", desc: "Logo, description, services, contact - Tout traduit" }
                      ].map((item, i) => (
                        <div 
                          key={i} 
                          className="flex items-start gap-3 p-3 rounded-xl border-2 bg-gradient-to-br from-card to-primary/5 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 animate-in fade-in slide-in-from-left-3"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">{item.title}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Authentification */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                      <Lock className="h-5 w-5 text-secondary" />
                      Authentification &amp; Autorisation
                    </h3>
                    <div className="grid gap-3">
                      {[
                        { title: "Inscription & Connexion", desc: "Email/mot de passe avec confirmation automatique" },
                        { title: "Système de Rôles", desc: "17 rôles différents (patient, médecin, admin, etc.)" },
                        { title: "Gestion des Sessions", desc: "Persistance sécurisée avec refresh automatique" },
                        { title: "Comptes Démo", desc: "17 comptes pré-configurés pour tests (mot de passe: demo123)" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                          <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">{item.title}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Patient */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-warning" />
                      Espace Patient
                    </h3>
                    <div className="grid gap-3">
                      {[
                        { title: "Dashboard Aurora Glass", desc: "Design glassmorphism avec couleurs vives (turquoise, bleu, jaune, rose)" },
                        { title: "Navigation Responsive", desc: "Menu latéral collapsible + barre de navigation mobile" },
                        { title: "Gestion Profil Complète", desc: "Avatar upload, changement mot de passe, infos médicales" },
                        { title: "Gestion Rendez-vous", desc: "Prise de RDV multi-étapes (type, date/heure, motif, paiement)" },
                        { title: "Historique Consultations", desc: "Liste des consultations avec détails et documents" },
                        { title: "Ordonnances Électroniques", desc: "Visualisation, envoi pharmacie avec géolocalisation" },
                        { title: "Résultats d'Examens", desc: "Biologie, imagerie avec téléchargement PDF" },
                        { title: "Dossier Médical", desc: "Carnet de santé, vaccinations, antécédents" },
                        { title: "Carte CNAMGS", desc: "Génération PDF avec QR code et informations assuré" },
                        { title: "Statut Assurance", desc: "CNAMGS/CNSS avec taux de couverture et plafonds" },
                        { title: "Cartographie Prestataires", desc: "Médecins, pharmacies, hôpitaux avec carte interactive" },
                        { title: "Messagerie Sécurisée", desc: "Communication avec professionnels de santé" },
                        { title: "Remboursements", desc: "Suivi demandes de remboursement CNAMGS/CNSS" },
                        { title: "Système de Notifications", desc: "Rappels RDV, résultats disponibles" },
                        { title: "Multi-langue & Thème", desc: "5 langues (FR/EN/ES/AR/PT) + mode sombre/clair" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                          <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">{item.title}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Admin */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Espace Super Admin
                    </h3>
                    <div className="grid gap-3">
                      {[
                        { title: "Dashboard Aurora Glass", desc: "Interface harmonisée avec le design patient (glassmorphism + couleurs)" },
                        { title: "Navigation Latérale Moderne", desc: "Menu collapsible avec icônes colorées et animations" },
                        { title: "Statistiques Globales", desc: "KPI utilisateurs, établissements, professionnels, approbations" },
                        { title: "Gestion Utilisateurs", desc: "Liste complète, création, modification, attribution rôles" },
                        { title: "Gestion Établissements", desc: "Hôpitaux, cliniques, centres avec statuts et localisation" },
                        { title: "Gestion Professionnels", desc: "Médecins, infirmiers, spécialistes avec validation" },
                        { title: "Système Approbations", desc: "Validation inscriptions professionnels/établissements" },
                        { title: "Audit & Logs", desc: "Suivi activités système et actions utilisateurs" },
                        { title: "Cartographie Nationale", desc: "Vue carte interactive des prestataires par province" },
                        { title: "Comptes Démo", desc: "Initialisation automatique 17 comptes test" },
                        { title: "Paramètres Système", desc: "Configuration globale, notifications, maintenance" },
                        { title: "Documentation Technique", desc: "Architecture, API, base de données, sécurité" },
                        { title: "Analytics Avancées", desc: "Statistiques par province, graphiques temporels" },
                        { title: "Gestion Rôles & Permissions", desc: "17 rôles système avec contrôle d'accès granulaire" },
                        { title: "Multi-langue & Préférences", desc: "Interface traduite en 5 langues avec thème personnalisable" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                          <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">{item.title}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fonctionnalités en développement */}
              <Card className="border-warning/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Circle className="h-5 w-5 text-warning" />
                    Fonctionnalités en Développement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {[
                      { title: "Téléconsultation", desc: "Visioconférence intégrée avec WebRTC" },
                      { title: "Paiements en Ligne", desc: "Intégration Mobile Money et cartes bancaires" },
                      { title: "Dossier Médical Complet", desc: "Historique détaillé avec documents médicaux" },
                      { title: "Notifications Push", desc: "Rappels RDV, résultats disponibles" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                        <AlertCircle className="h-4 w-4 text-warning mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">{item.title}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ARCHITECTURE */}
            <TabsContent value="architecture" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              <Card className="border-2 hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-card/95">
                <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                    Architecture Système
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Architecture Globale</h3>
                    <div className="p-4 sm:p-6 rounded-lg border bg-gradient-to-br from-muted/50 to-transparent space-y-4">
                      <div className="p-4 rounded-lg bg-background border">
                        <p className="font-semibold mb-3 text-sm sm:text-base">Frontend - React</p>
                        <ul className="ml-4 space-y-2 text-xs sm:text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            Application Web
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            Dashboard Patient
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            Espace Professionnel
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            Admin Panel
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 rounded-lg bg-background border">
                        <p className="font-semibold mb-3 text-sm sm:text-base">Lovable Cloud - Supabase</p>
                        <ul className="ml-4 space-y-2 text-xs sm:text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Supabase Auth (authentification)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            PostgreSQL Database
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Edge Functions (serverless)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Storage (fichiers)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Realtime (WebSocket)
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 rounded-lg bg-background border">
                        <p className="font-semibold mb-3 text-sm sm:text-base">Services Externes</p>
                        <ul className="ml-4 space-y-2 text-xs sm:text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                            CNAMGS API
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                            CNSS API
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                            Mobile Money
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Architecture Base de Données</h3>
                    <div className="p-4 sm:p-6 rounded-lg border bg-muted/30 space-y-3">
                      {[
                        { table: "PROFILES", desc: "id (PK), full_name, email, phone, birth_date, gender, province, city, neighborhood, avatar_url" },
                        { table: "USER_ROLES", desc: "id (PK), user_id (FK → PROFILES), role, created_at" },
                        { table: "APPOINTMENTS", desc: "id (PK), patient_id (FK), doctor_id (FK), date_time, type, status" },
                        { table: "PRESCRIPTIONS", desc: "id (PK), patient_id (FK), doctor_id (FK), issue_date, status, medications (JSONB)" },
                        { table: "RESULTS", desc: "id (PK), patient_id (FK), prescriber_id (FK), type, result_date, lab_name, file_url" }
                      ].map((item, i) => (
                        <div key={i} className="p-3 rounded-lg bg-background border">
                          <p className="font-semibold mb-2 font-mono text-xs sm:text-sm">{item.table}</p>
                          <p className="text-xs text-muted-foreground font-mono break-words">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Flux d&apos;Authentification</h3>
                    <div className="p-4 sm:p-6 rounded-lg border bg-muted/30">
                      <ol className="space-y-3 text-xs sm:text-sm">
                        {[
                          "Utilisateur → Application : Connexion (email/password)",
                          "Application → Supabase Auth : signInWithPassword()",
                          "Supabase Auth : Vérification credentials",
                          "Supabase Auth → Database : Récupération profil",
                          "Supabase Auth → Application : Session + JWT",
                          "Application → Database : getUserRoles(user_id)",
                          "Database → Application : Rôles utilisateur",
                          "Application → Utilisateur : Redirection selon rôle"
                        ].map((step, i) => (
                          <li key={i} className="flex gap-3 p-2 rounded bg-background">
                            <span className="font-semibold min-w-6 text-primary">{i + 1}.</span>
                            <span className="text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Structure des Composants</h3>
                    <div className="p-4 sm:p-6 rounded-lg border bg-muted/30 overflow-x-auto">
                      <pre className="font-mono text-xs sm:text-sm text-muted-foreground">{`src/
├── components/
│   ├── auth/           # Authentification
│   ├── common/         # Composants réutilisables
│   ├── dashboard/      # Dashboard patient
│   ├── layout/         # Layout principal
│   └── ui/             # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx # Context d'authentification
├── hooks/              # React hooks personnalisés
├── integrations/
│   └── supabase/       # Client Supabase
├── lib/
│   ├── auth.ts         # Services auth
│   ├── utils.ts        # Utilitaires
│   └── validation.ts   # Validation formulaires
├── pages/              # Pages de l'application
└── main.tsx            # Point d'entrée`}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* BACKEND */}
            <TabsContent value="backend" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Database className="h-5 w-5 sm:h-6 sm:w-6" />
                    Backend - Lovable Cloud (Supabase)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Base de Données PostgreSQL</h3>
                    <div className="space-y-4">
                      <div className="p-4 sm:p-6 rounded-lg border bg-gradient-to-br from-blue-500/5 to-transparent">
                        <h4 className="font-semibold mb-3 text-sm sm:text-base">Tables Principales</h4>
                        <ul className="space-y-2 text-xs sm:text-sm">
                          {[
                            { name: "profiles", desc: "Informations utilisateurs" },
                            { name: "user_roles", desc: "Rôles et permissions" },
                            { name: "appointments", desc: "Rendez-vous médicaux" },
                            { name: "prescriptions", desc: "Ordonnances" },
                            { name: "medical_results", desc: "Résultats d'examens" }
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 flex-wrap">
                              <span className="font-mono bg-muted px-2 py-1 rounded text-xs">{item.name}</span>
                              <span className="text-muted-foreground flex-1">{item.desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 sm:p-6 rounded-lg border bg-gradient-to-br from-green-500/5 to-transparent">
                        <h4 className="font-semibold mb-3 text-sm sm:text-base">Fonctions Database</h4>
                        <ul className="space-y-2 text-xs sm:text-sm font-mono">
                          {[
                            "has_role(user_id, role) → boolean",
                            "has_any_role(user_id, roles[]) → boolean",
                            "get_user_roles(user_id) → app_role[]",
                            "update_updated_at_column() → trigger",
                            "handle_new_user() → trigger"
                          ].map((fn, i) => (
                            <li key={i} className="bg-muted p-2 rounded break-words">{fn}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-3">Row Level Security (RLS)</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                      Toutes les tables sont sécurisées avec des politiques RLS qui garantissent que :
                    </p>
                    <ul className="space-y-3 text-xs sm:text-sm">
                      {[
                        "Les patients ne voient que leurs propres données",
                        "Les professionnels accèdent uniquement aux dossiers de leurs patients",
                        "Les super admins ont un accès complet pour la gestion",
                        "Validation côté serveur avec SECURITY DEFINER functions"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 p-3 rounded-lg border bg-card">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Edge Functions</h3>
                    <div className="space-y-3">
                      {[
                        { 
                          name: "bootstrap-superadmin", 
                          desc: "Création du premier compte super administrateur",
                          endpoint: "POST /functions/v1/bootstrap-superadmin"
                        },
                        { 
                          name: "create-demo-accounts", 
                          desc: "Initialisation des 17 comptes démo pour tests",
                          endpoint: "POST /functions/v1/create-demo-accounts"
                        }
                      ].map((fn, i) => (
                        <div key={i} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                          <h4 className="font-semibold mb-2 text-sm sm:text-base">{fn.name}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2">{fn.desc}</p>
                          <Badge variant="outline" className="font-mono text-xs">{fn.endpoint}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-3">Authentification Supabase Auth</h3>
                    <ul className="space-y-3 text-xs sm:text-sm">
                      {[
                        "JWT avec refresh token automatique",
                        "Session persistante dans localStorage",
                        "Confirmation email automatique (mode dev)",
                        "Hashage bcrypt des mots de passe"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 p-3 rounded-lg border bg-card">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FRONTEND */}
            <TabsContent value="frontend" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Smartphone className="h-5 w-5 sm:h-6 sm:w-6" />
                    Frontend - React Application
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Stack Technique</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: "Core", items: ["React 18.3.1 (Hooks, Context)", "TypeScript (typage fort)", "Vite (bundler ultra-rapide)", "React Router v6 (navigation)"] },
                        { title: "UI & Styling", items: ["TailwindCSS (utility-first)", "shadcn/ui (composants)", "Lucide React (icônes)", "Responsive mobile-first"] },
                        { title: "State Management", items: ["React Context (auth)", "React Query (data fetching)", "Local state (useState)"] },
                        { title: "Forms & Validation", items: ["React Hook Form", "Zod (schema validation)", "Validation temps réel"] }
                      ].map((section, i) => (
                        <div key={i} className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-transparent">
                          <h4 className="font-semibold mb-3 text-sm sm:text-base">{section.title}</h4>
                          <ul className="space-y-2 text-xs sm:text-sm">
                            {section.items.map((item, j) => (
                              <li key={j} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Routing & Navigation</h3>
                    <div className="p-4 sm:p-6 rounded-lg border bg-muted/30 overflow-x-auto">
                      <pre className="font-mono text-xs sm:text-sm text-muted-foreground">{`Routes Publiques:
• / (Landing)
• /login
• /register

Routes Patients:
• /dashboard
• /appointments
• /prescriptions
• /results
• /providers
• /reimbursements
• /profile

Routes Admin:
• /admin (Dashboard)
• /admin/demo (Comptes démo)
• /admin/project (Documentation)

Protection:
• ProtectedRoute avec vérification rôles
• Redirection automatique selon rôle
• Gestion session expired`}</pre>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Design System "Aurora Glass"</h3>
                    <div className="space-y-4">
                      {/* Description */}
                      <div className="p-6 rounded-xl border bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
                        <h4 className="font-semibold mb-3 text-base flex items-center gap-2">
                          <Zap className="h-5 w-5 text-primary" />
                          Design System "Aurora Glass"
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          Un design moderne combinant l'élégance du glassmorphism avec une palette de couleurs vibrantes inspirée des aurores boréales. 
                          Caractérisé par des effets de transparence, des gradients fluides et des animations douces.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="p-2 rounded-lg bg-background/80 backdrop-blur border border-primary/20 flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span>Glassmorphism</span>
                          </div>
                          <div className="p-2 rounded-lg bg-background/80 backdrop-blur border border-secondary/20 flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-secondary" />
                            <span>Gradients</span>
                          </div>
                          <div className="p-2 rounded-lg bg-background/80 backdrop-blur border border-warning/20 flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-warning" />
                            <span>Animations</span>
                          </div>
                          <div className="p-2 rounded-lg bg-background/80 backdrop-blur border border-accent/20 flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-accent" />
                            <span>Responsive</span>
                          </div>
                        </div>
                      </div>

                      {/* Palette de couleurs */}
                      <div className="p-4 rounded-lg border bg-card">
                        <h4 className="font-semibold mb-3 text-sm sm:text-base">Palette de Couleurs (HSL)</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                          4 couleurs principales harmonieusement réparties dans l'interface
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div className="p-4 rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
                            <div className="h-12 w-full rounded-lg bg-primary mb-3 shadow-lg" />
                            <p className="font-semibold text-sm">Primary (Turquoise)</p>
                            <p className="text-xs text-muted-foreground font-mono">#17CCB9</p>
                            <p className="text-xs text-muted-foreground font-mono">173 78% 45%</p>
                          </div>
                          <div className="p-4 rounded-lg border border-secondary/30 bg-gradient-to-br from-secondary/10 to-secondary/5">
                            <div className="h-12 w-full rounded-lg bg-secondary mb-3 shadow-lg" />
                            <p className="font-semibold text-sm">Secondary (Bleu)</p>
                            <p className="text-xs text-muted-foreground font-mono">#00A1FE</p>
                            <p className="text-xs text-muted-foreground font-mono">202 100% 50%</p>
                          </div>
                          <div className="p-4 rounded-lg border border-warning/30 bg-gradient-to-br from-warning/10 to-warning/5">
                            <div className="h-12 w-full rounded-lg bg-warning mb-3 shadow-lg" />
                            <p className="font-semibold text-sm">Warning (Jaune)</p>
                            <p className="text-xs text-muted-foreground font-mono">#FDAD00</p>
                            <p className="text-xs text-muted-foreground font-mono">41 100% 50%</p>
                          </div>
                          <div className="p-4 rounded-lg border border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5">
                            <div className="h-12 w-full rounded-lg bg-accent mb-3 shadow-lg" />
                            <p className="font-semibold text-sm">Accent (Rose)</p>
                            <p className="text-xs text-muted-foreground font-mono">#E63B7A</p>
                            <p className="text-xs text-muted-foreground font-mono">338 80% 57%</p>
                          </div>
                        </div>
                      </div>

                      {/* Effets Glassmorphism */}
                      <div className="p-4 rounded-lg border bg-card">
                        <h4 className="font-semibold mb-3 text-sm sm:text-base">Effets Glassmorphism</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2 text-xs sm:text-sm">
                            <p className="font-medium">Classes principales :</p>
                            <div className="space-y-1 font-mono text-xs">
                              <div className="p-2 rounded bg-muted">backdrop-blur-xl</div>
                              <div className="p-2 rounded bg-muted">backdrop-blur-2xl</div>
                              <div className="p-2 rounded bg-muted">bg-card/80 to-card/60</div>
                              <div className="p-2 rounded bg-muted">border-border/40</div>
                            </div>
                          </div>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <p className="font-medium">Utilisation :</p>
                            <ul className="space-y-1">
                              <li className="flex items-start gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />
                                Cards flottantes avec ombres
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />
                                Headers avec transparence
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />
                                Overlays et modals
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />
                                Sections avec fond dégradé
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Animations */}
                      <div className="p-4 rounded-lg border bg-card">
                        <h4 className="font-semibold mb-3 text-sm sm:text-base">Animations & Transitions</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded-lg border bg-muted/30">
                            <p className="font-semibold mb-2">Fade Animations</p>
                            <div className="space-y-1 font-mono text-xs">
                              <div>animate-fade-in</div>
                              <div>animate-fade-out</div>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg border bg-muted/30">
                            <p className="font-semibold mb-2">Scale Animations</p>
                            <div className="space-y-1 font-mono text-xs">
                              <div>animate-scale-in</div>
                              <div>hover-scale</div>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg border bg-muted/30">
                            <p className="font-semibold mb-2">Interactive</p>
                            <div className="space-y-1 font-mono text-xs">
                              <div>story-link</div>
                              <div>hover:shadow-2xl</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Internationalisation */}
                      <div className="p-4 rounded-lg border bg-card">
                        <h4 className="font-semibold mb-3 text-sm sm:text-base">Internationalisation (i18n)</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                          Système de traduction complet avec 5 langues supportées
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          <div className="p-3 rounded-lg border bg-primary/5 text-center">
                            <p className="font-semibold text-sm">🇫🇷 Français</p>
                            <p className="text-xs text-muted-foreground mt-1">Par défaut</p>
                          </div>
                          <div className="p-3 rounded-lg border bg-secondary/5 text-center">
                            <p className="font-semibold text-sm">🇬🇧 English</p>
                            <p className="text-xs text-muted-foreground mt-1">Complet</p>
                          </div>
                          <div className="p-3 rounded-lg border bg-warning/5 text-center">
                            <p className="font-semibold text-sm">🇪🇸 Español</p>
                            <p className="text-xs text-muted-foreground mt-1">Complet</p>
                          </div>
                          <div className="p-3 rounded-lg border bg-accent/5 text-center">
                            <p className="font-semibold text-sm">🇸🇦 العربية</p>
                            <p className="text-xs text-muted-foreground mt-1">Complet</p>
                          </div>
                          <div className="p-3 rounded-lg border bg-primary/5 text-center">
                            <p className="font-semibold text-sm">🇵🇹 Português</p>
                            <p className="text-xs text-muted-foreground mt-1">Complet</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-muted/30 text-xs font-mono">
                          <p className="mb-2 text-muted-foreground">Usage :</p>
                          <code>{`const { t } = useLanguage();\n<p>{t('landing.hero.title')}</p>`}</code>
                        </div>
                      </div>

                      {/* Composants shadcn/ui */}
                      <div className="p-4 rounded-lg border bg-card">
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Composants shadcn/ui</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs sm:text-sm text-muted-foreground">
                          {["Button", "Card", "Dialog", "Form", "Input", "Select", "Table", "Tabs", "Toast", "Badge", "Avatar", "Dropdown", "Sheet", "Sidebar", "Tooltip", "Separator"].map((comp, i) => (
                            <div key={i} className="p-2 rounded bg-muted/50 font-mono hover:bg-muted transition-colors">{comp}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Responsive Design</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { device: "Mobile", breakpoint: "< 640px", features: ["Bottom navigation", "Stack vertical", "Menu hamburger"] },
                        { device: "Tablet", breakpoint: "640px - 1024px", features: ["Sidebar collapsible", "Grid 2 colonnes", "Touch optimized"] },
                        { device: "Desktop", breakpoint: "> 1024px", features: ["Sidebar fixe", "Grid 3 colonnes", "Hover effects"] }
                      ].map((item, i) => (
                        <div key={i} className="p-4 rounded-lg border bg-card">
                          <h4 className="font-semibold mb-2 text-sm">{item.device}</h4>
                          <p className="text-xs text-muted-foreground mb-3 font-mono">{item.breakpoint}</p>
                          <ul className="space-y-1 text-xs">
                            {item.features.map((feat, j) => (
                              <li key={j} className="flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-primary" />
                                {feat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PLAN D'IMPLÉMENTATION */}
            <TabsContent value="implementation" className="space-y-6 animate-in fade-in-50 duration-300">
              <ImplementationPlan />
            </TabsContent>

            {/* BACKEND CURSOR */}
            <TabsContent value="backend-cursor" className="space-y-6 animate-in fade-in-50 duration-300">
              <BackendImplementationPlan />
            </TabsContent>

            {/* SÉCURITÉ */}
            <TabsContent value="security" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                    Sécurité & Conformité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Mesures de Sécurité Implémentées</h3>
                    <div className="grid gap-4">
                      {[
                        { 
                          title: "Row Level Security (RLS)", 
                          desc: "Politiques de sécurité au niveau base de données garantissant l'isolation des données",
                          icon: Database 
                        },
                        { 
                          title: "Authentification JWT", 
                          desc: "Tokens sécurisés avec expiration automatique et refresh token",
                          icon: Lock 
                        },
                        { 
                          title: "Hashage Mots de Passe", 
                          desc: "Bcrypt avec salt pour stockage sécurisé des credentials",
                          icon: Shield 
                        },
                        { 
                          title: "HTTPS Obligatoire", 
                          desc: "Chiffrement TLS 1.3 pour toutes les communications",
                          icon: Cloud 
                        }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                          <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                            <item.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1 text-sm sm:text-base">{item.title}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Politiques RLS par Table</h3>
                    <div className="space-y-3">
                      {[
                        { table: "profiles", policies: ["Users can view their own profile", "Users can update their own profile", "Admins can view all profiles"] },
                        { table: "appointments", policies: ["Patients see their own appointments", "Doctors see their patients' appointments", "Admins have full access"] },
                        { table: "prescriptions", policies: ["Patients see their own prescriptions", "Doctors can create prescriptions", "Pharmacists can view dispensed prescriptions"] },
                        { table: "medical_results", policies: ["Patients see their own results", "Prescribers can create results", "Lab technicians can upload results"] }
                      ].map((item, i) => (
                        <div key={i} className="p-4 rounded-lg border bg-muted/30">
                          <h4 className="font-semibold mb-3 font-mono text-xs sm:text-sm">{item.table}</h4>
                          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                            {item.policies.map((policy, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <CheckCircle2 className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                                <span>{policy}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Conformité & Réglementation</h3>
                    <div className="grid gap-3">
                      {[
                        { title: "Protection Données Santé", desc: "Respect des normes de confidentialité des données médicales" },
                        { title: "Consentement Utilisateur", desc: "Consentement explicite pour traitement données personnelles" },
                        { title: "Droit à l'Oubli", desc: "Possibilité de suppression complète des données utilisateur" },
                        { title: "Audit & Traçabilité", desc: "Logs d'accès aux données sensibles" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                          <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">{item.title}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 sm:p-6 rounded-lg border bg-warning/5 border-warning/50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Bonnes Pratiques à Maintenir</h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-warning" />
                            Rotation régulière des secrets et tokens
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-warning" />
                            Audit périodique des politiques RLS
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-warning" />
                            Tests de sécurité automatisés (CI/CD)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-warning" />
                            Formation continue équipe sécurité
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ROADMAP */}
            <TabsContent value="roadmap" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <GitBranch className="h-5 w-5 sm:h-6 sm:w-6" />
                    Roadmap 2025-2026
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Plan de développement et évolution de la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      phase: "Phase 1 : Base Solide (Q1 2025)",
                      status: "completed",
                      items: [
                        "Authentification multi-rôles",
                        "Dashboard patient complet",
                        "Gestion rendez-vous",
                        "Ordonnances électroniques",
                        "Résultats examens",
                        "Admin panel",
                        "17 rôles utilisateurs"
                      ]
                    },
                    {
                      phase: "Phase 2 : Intégrations Externes (Q2 2025)",
                      status: "in-progress",
                      items: [
                        "API CNAMGS (vérification droits)",
                        "API CNSS (cotisations)",
                        "Mobile Money (Airtel, Moov)",
                        "Géolocalisation prestataires",
                        "Notifications email/SMS"
                      ]
                    },
                    {
                      phase: "Phase 3 : Dossier Médical (Q2-Q3 2025)",
                      status: "planned",
                      items: [
                        "Historique consultations complet",
                        "Upload documents médicaux",
                        "Partage sécurisé entre professionnels",
                        "Carnet de vaccination",
                        "Allergies et traitements chroniques",
                        "Timeline médicale interactive"
                      ]
                    },
                    {
                      phase: "Phase 4 : Télémédecine (Q3-Q4 2025)",
                      status: "planned",
                      items: [
                        "Visioconférence WebRTC",
                        "Salle d'attente virtuelle",
                        "Chat médecin-patient",
                        "Partage de documents en temps réel",
                        "Enregistrement consultations (avec consentement)"
                      ]
                    },
                    {
                      phase: "Phase 5 : Applications Mobiles (Q4 2025)",
                      status: "planned",
                      items: [
                        "Application mobile iOS (React Native)",
                        "Application mobile Android (React Native)",
                        "Notifications push natives",
                        "Géolocalisation pour recherche proximité",
                        "Mode hors-ligne pour consultations en zone rurale"
                      ]
                    },
                    {
                      phase: "Phase 6 : Intelligence Artificielle (2026)",
                      status: "future",
                      items: [
                        "Assistant IA pour pré-diagnostic",
                        "Recommandations médicaments via IA",
                        "Analyse prédictive des épidémies",
                        "Chatbot support patients 24/7"
                      ]
                    }
                  ].map((phase, i) => {
                    const statusConfig = {
                      completed: { color: "bg-success", icon: CheckCircle2 },
                      "in-progress": { color: "bg-warning", icon: Activity },
                      planned: { color: "bg-primary", icon: Circle },
                      future: { color: "bg-muted", icon: Circle }
                    };
                    const config = statusConfig[phase.status as keyof typeof statusConfig];
                    const StatusIcon = config.icon;

                    return (
                      <div key={i}>
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`p-2 rounded-lg ${config.color}/10 flex-shrink-0`}>
                            <StatusIcon className={`h-5 w-5 ${config.color.replace('bg-', 'text-')}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg">{phase.phase}</h3>
                            {phase.status === "completed" && (
                              <Badge variant="outline" className="mt-1 text-success border-success">✓ Terminé</Badge>
                            )}
                            {phase.status === "in-progress" && (
                              <Badge variant="outline" className="mt-1 text-warning border-warning">⏳ En cours</Badge>
                            )}
                            {(phase.status === "planned" || phase.status === "future") && (
                              <Badge variant="outline" className="mt-1">📅 Planifié</Badge>
                            )}
                          </div>
                        </div>
                        <div className="ml-14 space-y-2">
                          {phase.items.map((item, j) => (
                            <div key={j} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground p-2 rounded hover:bg-accent/5 transition-colors">
                              <Circle className="h-3 w-3" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                        {i < 5 && <Separator className="my-6" />}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Métriques de Succès</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {[
                      { value: "100K+", label: "Utilisateurs actifs visés fin 2025" },
                      { value: "500+", label: "Professionnels de santé inscrits" },
                      { value: "50K+", label: "Consultations mensuelles" }
                    ].map((metric, i) => (
                      <div key={i} className="p-6 rounded-lg border text-center bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow">
                        <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">{metric.value}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            size="icon"
            className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-all animate-in fade-in-50 slide-in-from-bottom-5"
            aria-label="Retour en haut"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </div>
    </SuperAdminLayout>
  );
}
