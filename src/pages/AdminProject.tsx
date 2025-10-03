import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
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
    <MainLayout>
      <div className="relative min-h-screen">
        {/* Hero Section */}
        <div className="border-b bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:items-center">
                <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                    Documentation SANTE.GA
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground mt-1">
                    Plateforme nationale de santé numérique du Gabon
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  v1.0.0
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm">React + TypeScript</Badge>
                <Badge variant="outline" className="text-xs sm:text-sm">Lovable Cloud</Badge>
                <Badge variant="outline" className="text-xs sm:text-sm text-success border-success">Production Ready</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tabs Navigation - Responsive */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 border-b">
              <ScrollArea className="w-full">
                <TabsList className="inline-flex w-auto min-w-full sm:grid sm:grid-cols-9 gap-1 sm:gap-2 p-1">
                  <TabsTrigger value="overview" className="whitespace-nowrap text-xs sm:text-sm">
                    <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Vue d&apos;ensemble</span>
                    <span className="sm:hidden">Vue</span>
                  </TabsTrigger>
                  <TabsTrigger value="features" className="whitespace-nowrap text-xs sm:text-sm">
                    <Activity className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Fonctionnalités</span>
                    <span className="sm:hidden">Features</span>
                  </TabsTrigger>
                  <TabsTrigger value="architecture" className="whitespace-nowrap text-xs sm:text-sm">
                    <Layers className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Architecture</span>
                    <span className="sm:hidden">Archi</span>
                  </TabsTrigger>
                  <TabsTrigger value="backend" className="whitespace-nowrap text-xs sm:text-sm">
                    <Database className="h-4 w-4 mr-1 sm:mr-2" />
                    Backend
                  </TabsTrigger>
                  <TabsTrigger value="frontend" className="whitespace-nowrap text-xs sm:text-sm">
                    <Code className="h-4 w-4 mr-1 sm:mr-2" />
                    Frontend
                  </TabsTrigger>
                  <TabsTrigger value="implementation" className="whitespace-nowrap text-xs sm:text-sm">
                    <Workflow className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Implémentation</span>
                    <span className="sm:hidden">Plan</span>
                  </TabsTrigger>
                  <TabsTrigger value="backend-cursor" className="whitespace-nowrap text-xs sm:text-sm">
                    <Server className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Backend Cursor</span>
                    <span className="sm:hidden">Cursor</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="whitespace-nowrap text-xs sm:text-sm">
                    <Shield className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Sécurité</span>
                    <span className="sm:hidden">Sécu</span>
                  </TabsTrigger>
                  <TabsTrigger value="roadmap" className="whitespace-nowrap text-xs sm:text-sm">
                    <GitBranch className="h-4 w-4 mr-1 sm:mr-2" />
                    Roadmap
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>
            </div>

            {/* VUE D'ENSEMBLE */}
            <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                    Présentation du Projet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-3">Mission</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      SANTE.GA est la plateforme nationale de santé numérique du Gabon qui vise à digitaliser 
                      et moderniser l&apos;écosystème de santé gabonais en connectant patients, professionnels de santé, 
                      établissements médicaux et organismes d&apos;assurance (CNAMGS, CNSS).
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Objectifs Principaux</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="flex gap-3 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                        <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Accessibilité des Soins</p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Faciliter l&apos;accès aux soins pour tous les Gabonais
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                        <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Dossier Médical Unique</p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Centraliser l&apos;historique médical de chaque patient
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                        <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Gestion Administrative</p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Simplifier les démarches et remboursements
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                        <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Télémédecine</p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Permettre les consultations à distance
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Écosystème</h3>
                    <div className="p-4 sm:p-6 rounded-lg border bg-gradient-to-br from-card to-muted/20">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-sm sm:text-base">Acteurs du Système</h4>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Technologies Utilisées</CardTitle>
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
            <TabsContent value="features" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Fonctionnalités Implémentées</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Liste complète des fonctionnalités actuellement disponibles dans la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Authentification */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
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
                      <Users className="h-5 w-5 text-primary" />
                      Espace Patient
                    </h3>
                    <div className="grid gap-3">
                      {[
                        { title: "Dashboard Personnel", desc: "Vue d'ensemble avec RDV, ordonnances, résultats" },
                        { title: "Gestion Rendez-vous", desc: "Consultation, téléconsultation, examens" },
                        { title: "Ordonnances Électroniques", desc: "Visualisation, statut, géolocalisation pharmacies" },
                        { title: "Résultats d'Examens", desc: "Biologie, imagerie avec téléchargement PDF" },
                        { title: "Statut Assurance", desc: "CNAMGS/CNSS avec taux de couverture et plafonds" },
                        { title: "Recherche Prestataires", desc: "Médecins, pharmacies, hôpitaux, laboratoires" },
                        { title: "Profil Patient", desc: "Informations personnelles, contact, adresse" }
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
                        { title: "Tableau de Bord Admin", desc: "Métriques, statistiques, activité système" },
                        { title: "Gestion Utilisateurs", desc: "Création, modification, attribution de rôles" },
                        { title: "Approbations", desc: "Validation des inscriptions professionnels/établissements" },
                        { title: "Comptes Démo", desc: "Initialisation et gestion des comptes de test" },
                        { title: "Documentation Projet", desc: "Vue complète architecture et fonctionnalités" }
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
            <TabsContent value="architecture" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Layers className="h-5 w-5 sm:h-6 sm:w-6" />
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
                    <h3 className="font-semibold text-base sm:text-lg mb-4">Design System</h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg border bg-card">
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Composants shadcn/ui</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground">
                          {["Button", "Card", "Dialog", "Form", "Input", "Select", "Table", "Tabs", "Toast", "Badge", "Avatar", "Dropdown"].map((comp, i) => (
                            <div key={i} className="p-2 rounded bg-muted font-mono">{comp}</div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg border bg-card">
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Thème & Couleurs</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                          Système de design tokens HSL avec support mode sombre
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-primary" />
                            <span className="text-xs">Primary</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-secondary" />
                            <span className="text-xs">Secondary</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-accent" />
                            <span className="text-xs">Accent</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-destructive" />
                            <span className="text-xs">Destructive</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-muted" />
                            <span className="text-xs">Muted</span>
                          </div>
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
    </MainLayout>
  );
}
