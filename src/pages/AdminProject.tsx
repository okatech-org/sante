import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  AlertCircle
} from "lucide-react";

export default function AdminProject() {
  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* En-tête */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Documentation Projet SANTE.GA</h1>
          <p className="text-muted-foreground text-lg">
            Plateforme nationale de santé numérique du Gabon
          </p>
          <div className="flex gap-2 flex-wrap pt-2">
            <Badge variant="outline">v1.0.0</Badge>
            <Badge variant="outline">React + TypeScript</Badge>
            <Badge variant="outline">Lovable Cloud (Supabase)</Badge>
            <Badge variant="outline">Production Ready</Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 gap-2">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          {/* VUE D'ENSEMBLE */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Présentation du Projet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Mission</h3>
                  <p className="text-muted-foreground">
                    SANTE.GA est la plateforme nationale de santé numérique du Gabon qui vise à digitaliser 
                    et moderniser l'écosystème de santé gabonais en connectant patients, professionnels de santé, 
                    établissements médicaux et organismes d'assurance (CNAMGS, CNSS).
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Objectifs Principaux</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Accessibilité des Soins</p>
                        <p className="text-sm text-muted-foreground">
                          Faciliter l'accès aux soins pour tous les Gabonais
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Dossier Médical Unique</p>
                        <p className="text-sm text-muted-foreground">
                          Centraliser l'historique médical de chaque patient
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Gestion Administrative</p>
                        <p className="text-sm text-muted-foreground">
                          Simplifier les démarches et remboursements
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Télémédecine</p>
                        <p className="text-sm text-muted-foreground">
                          Permettre les consultations à distance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Écosystème</h3>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Acteurs du Système</h4>
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <li>• Patients (citoyens gabonais)</li>
                        <li>• Médecins généralistes</li>
                        <li>• Médecins spécialistes</li>
                        <li>• Infirmiers</li>
                        <li>• Sages-femmes</li>
                        <li>• Kinésithérapeutes</li>
                        <li>• Psychologues</li>
                        <li>• Ophtalmologistes</li>
                        <li>• Anesthésistes</li>
                        <li>• Pharmaciens</li>
                        <li>• Radiologues</li>
                        <li>• Techniciens de laboratoire</li>
                        <li>• Hôpitaux publics</li>
                        <li>• Cliniques privées</li>
                        <li>• Pharmacies</li>
                        <li>• Centres de radiologie</li>
                        <li>• Laboratoires d'analyses</li>
                        <li>• CNAMGS (assurance)</li>
                        <li>• CNSS (sécurité sociale)</li>
                        <li>• Administrateurs système</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technologies Utilisées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Frontend
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• React 18.3.1</li>
                      <li>• TypeScript</li>
                      <li>• Vite (build tool)</li>
                      <li>• TailwindCSS + shadcn/ui</li>
                      <li>• React Router v6</li>
                      <li>• React Query (TanStack)</li>
                      <li>• React Hook Form + Zod</li>
                      <li>• Lucide React (icons)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      Backend
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Lovable Cloud (Supabase)</li>
                      <li>• PostgreSQL (database)</li>
                      <li>• Supabase Auth</li>
                      <li>• Row Level Security (RLS)</li>
                      <li>• Edge Functions (Deno)</li>
                      <li>• Supabase Storage</li>
                      <li>• Real-time subscriptions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FONCTIONNALITÉS */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités Implémentées</CardTitle>
                <CardDescription>
                  Liste complète des fonctionnalités actuellement disponibles dans la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Authentification */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Authentification & Autorisation
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Inscription & Connexion</p>
                        <p className="text-sm text-muted-foreground">Email/mot de passe avec confirmation automatique</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Système de Rôles</p>
                        <p className="text-sm text-muted-foreground">17 rôles différents (patient, médecin, admin, etc.)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Gestion des Sessions</p>
                        <p className="text-sm text-muted-foreground">Persistance sécurisée avec refresh automatique</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Comptes Démo</p>
                        <p className="text-sm text-muted-foreground">17 comptes pré-configurés pour tests (mot de passe: demo123)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Patient */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Espace Patient
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Dashboard Personnel</p>
                        <p className="text-sm text-muted-foreground">Vue d&apos;ensemble avec RDV, ordonnances, résultats</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Gestion Rendez-vous</p>
                        <p className="text-sm text-muted-foreground">Consultation, téléconsultation, examens</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Ordonnances Électroniques</p>
                        <p className="text-sm text-muted-foreground">Visualisation, statut, géolocalisation pharmacies</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Résultats d&apos;Examens</p>
                        <p className="text-sm text-muted-foreground">Biologie, imagerie avec téléchargement PDF</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Statut Assurance</p>
                        <p className="text-sm text-muted-foreground">CNAMGS/CNSS avec taux de couverture et plafonds</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Recherche Prestataires</p>
                        <p className="text-sm text-muted-foreground">Médecins, pharmacies, hôpitaux, laboratoires</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Profil Patient</p>
                        <p className="text-sm text-muted-foreground">Informations personnelles, contact, adresse</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Admin */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Espace Super Admin
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Tableau de Bord Admin</p>
                        <p className="text-sm text-muted-foreground">Métriques, statistiques, activité système</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Gestion Utilisateurs</p>
                        <p className="text-sm text-muted-foreground">Création, modification, attribution de rôles</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Approbations</p>
                        <p className="text-sm text-muted-foreground">Validation des inscriptions professionnels/établissements</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Comptes Démo</p>
                        <p className="text-sm text-muted-foreground">Initialisation et gestion des comptes de test</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Documentation Projet</p>
                        <p className="text-sm text-muted-foreground">Vue complète architecture et fonctionnalités</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fonctionnalités en développement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Circle className="h-5 w-5" />
                  Fonctionnalités en Développement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-warning mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Téléconsultation</p>
                      <p className="text-sm text-muted-foreground">Visioconférence intégrée avec WebRTC</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-warning mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Paiements en Ligne</p>
                      <p className="text-sm text-muted-foreground">Intégration Mobile Money et cartes bancaires</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-warning mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Dossier Médical Complet</p>
                      <p className="text-sm text-muted-foreground">Historique détaillé avec documents médicaux</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-warning mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Notifications Push</p>
                      <p className="text-sm text-muted-foreground">Rappels RDV, résultats disponibles</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ARCHITECTURE */}
          <TabsContent value="architecture" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Architecture Système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Architecture Globale</h3>
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold mb-2">Frontend - React</p>
                        <ul className="ml-4 space-y-1 text-muted-foreground">
                          <li>• Application Web</li>
                          <li>• Dashboard Patient</li>
                          <li>• Espace Professionnel</li>
                          <li>• Admin Panel</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">Lovable Cloud - Supabase</p>
                        <ul className="ml-4 space-y-1 text-muted-foreground">
                          <li>• Supabase Auth (authentification)</li>
                          <li>• PostgreSQL Database</li>
                          <li>• Edge Functions (serverless)</li>
                          <li>• Storage (fichiers)</li>
                          <li>• Realtime (WebSocket)</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">Services Externes</p>
                        <ul className="ml-4 space-y-1 text-muted-foreground">
                          <li>• CNAMGS API</li>
                          <li>• CNSS API</li>
                          <li>• Mobile Money</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Architecture Base de Données</h3>
                  <div className="p-4 rounded-lg border bg-muted/30 font-mono text-xs space-y-4">
                    <div>
                      <p className="font-semibold mb-2">PROFILES (Utilisateurs)</p>
                      <p className="text-muted-foreground">id (PK), full_name, email, phone, birth_date, gender, province, city, neighborhood, avatar_url</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">USER_ROLES (Rôles)</p>
                      <p className="text-muted-foreground">id (PK), user_id (FK → PROFILES), role, created_at</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">APPOINTMENTS (Rendez-vous)</p>
                      <p className="text-muted-foreground">id (PK), patient_id (FK), doctor_id (FK), date_time, type, status</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">PRESCRIPTIONS (Ordonnances)</p>
                      <p className="text-muted-foreground">id (PK), patient_id (FK), doctor_id (FK), issue_date, status, medications (JSONB)</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">RESULTS (Résultats)</p>
                      <p className="text-muted-foreground">id (PK), patient_id (FK), prescriber_id (FK), type, result_date, lab_name, file_url</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Flux d&apos;Authentification</h3>
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <ol className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="font-semibold min-w-6">1.</span>
                        <span>Utilisateur → Application : Connexion (email/password)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold min-w-6">2.</span>
                        <span>Application → Supabase Auth : signInWithPassword()</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold min-w-6">3.</span>
                        <span>Supabase Auth : Vérification credentials</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold min-w-6">4.</span>
                        <span>Supabase Auth → Database : Récupération profil</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold min-w-6">5.</span>
                        <span>Supabase Auth → Application : Session + JWT</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold min-w-6">6.</span>
                        <span>Application → Database : getUserRoles(user_id)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold min-w-6">7.</span>
                        <span>Database → Application : Rôles utilisateur</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold min-w-6">8.</span>
                        <span>Application → Utilisateur : Redirection selon rôle</span>
                      </li>
                    </ol>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Structure des Composants</h3>
                  <div className="p-4 rounded-lg border bg-muted/30 font-mono text-sm">
                    <pre>{`src/
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
          <TabsContent value="backend" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backend - Lovable Cloud (Supabase)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Base de Données PostgreSQL</h3>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">Tables Principales</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="font-mono bg-muted px-2 py-0.5 rounded">profiles</span>
                          <span className="text-muted-foreground">Informations utilisateurs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono bg-muted px-2 py-0.5 rounded">user_roles</span>
                          <span className="text-muted-foreground">Rôles et permissions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono bg-muted px-2 py-0.5 rounded">appointments</span>
                          <span className="text-muted-foreground">Rendez-vous médicaux</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono bg-muted px-2 py-0.5 rounded">prescriptions</span>
                          <span className="text-muted-foreground">Ordonnances</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono bg-muted px-2 py-0.5 rounded">medical_results</span>
                          <span className="text-muted-foreground">Résultats d&apos;examens</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">Fonctions Database</h4>
                      <ul className="space-y-2 text-sm font-mono">
                        <li className="bg-muted p-2 rounded">has_role(user_id, role) → boolean</li>
                        <li className="bg-muted p-2 rounded">has_any_role(user_id, roles[]) → boolean</li>
                        <li className="bg-muted p-2 rounded">get_user_roles(user_id) → app_role[]</li>
                        <li className="bg-muted p-2 rounded">update_updated_at_column() → trigger</li>
                        <li className="bg-muted p-2 rounded">handle_new_user() → trigger</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Row Level Security (RLS)</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Toutes les tables sont sécurisées avec des politiques RLS qui garantissent que :
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Les patients ne voient que leurs propres données</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Les professionnels accèdent uniquement aux dossiers de leurs patients</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Les super admins ont un accès complet pour la gestion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Validation côté serveur avec SECURITY DEFINER functions</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Edge Functions</h3>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">bootstrap-superadmin</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Création du premier compte super administrateur
                      </p>
                      <Badge variant="outline">POST /functions/v1/bootstrap-superadmin</Badge>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">create-demo-accounts</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Initialisation des 17 comptes démo pour tests
                      </p>
                      <Badge variant="outline">POST /functions/v1/create-demo-accounts</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Authentification Supabase Auth</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>JWT avec refresh token automatique</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Session persistante dans localStorage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Confirmation email automatique (mode dev)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Hashage bcrypt des mots de passe</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FRONTEND */}
          <TabsContent value="frontend" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Frontend - React Application
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Stack Technique</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">Core</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• React 18.3.1 (Hooks, Context)</li>
                        <li>• TypeScript (typage fort)</li>
                        <li>• Vite (bundler ultra-rapide)</li>
                        <li>• React Router v6 (navigation)</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">UI & Styling</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• TailwindCSS (utility-first)</li>
                        <li>• shadcn/ui (composants)</li>
                        <li>• Lucide React (icônes)</li>
                        <li>• Responsive mobile-first</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">State Management</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• React Context (auth)</li>
                        <li>• React Query (data fetching)</li>
                        <li>• Local state (useState)</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">Forms & Validation</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• React Hook Form</li>
                        <li>• Zod (schema validation)</li>
                        <li>• Validation temps réel</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Design System</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Système de design cohérent avec tokens sémantiques définis dans index.css
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border text-center">
                      <div className="h-12 w-12 rounded-full bg-primary mx-auto mb-2"></div>
                      <p className="text-xs font-semibold">Primary</p>
                    </div>
                    <div className="p-3 rounded-lg border text-center">
                      <div className="h-12 w-12 rounded-full bg-secondary mx-auto mb-2"></div>
                      <p className="text-xs font-semibold">Secondary</p>
                    </div>
                    <div className="p-3 rounded-lg border text-center">
                      <div className="h-12 w-12 rounded-full bg-success mx-auto mb-2"></div>
                      <p className="text-xs font-semibold">Success</p>
                    </div>
                    <div className="p-3 rounded-lg border text-center">
                      <div className="h-12 w-12 rounded-full bg-destructive mx-auto mb-2"></div>
                      <p className="text-xs font-semibold">Destructive</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Responsive Design</h3>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">Mobile (&lt; 768px)</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Bottom tab navigation (5 onglets)</li>
                        <li>• Stack vertical pour le contenu</li>
                        <li>• Sidebar cachée dans hamburger menu</li>
                        <li>• Barre recherche sous le header</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">Tablet (768px - 1024px)</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Sidebar pliable</li>
                        <li>• Grid 2 colonnes</li>
                        <li>• Recherche dans header</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">Desktop (&gt; 1024px)</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Sidebar fixe visible</li>
                        <li>• Grid 2 colonnes optimisé</li>
                        <li>• Layout max-width 7xl</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Performance</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Code splitting automatique par route</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Tree-shaking des icônes Lucide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>React Query cache avec staleTime</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Lazy loading des composants lourds</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SÉCURITÉ */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sécurité & Confidentialité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Mesures de Sécurité Backend</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <Lock className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Row Level Security (RLS)</h4>
                        <p className="text-sm text-muted-foreground">
                          Politiques RLS sur toutes les tables sensibles. Isolation complète des données par utilisateur.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <Lock className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Système de Rôles</h4>
                        <p className="text-sm text-muted-foreground">
                          Table user_roles séparée avec enum app_role. Vérification via SECURITY DEFINER functions.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <Lock className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">JWT & Sessions</h4>
                        <p className="text-sm text-muted-foreground">
                          Tokens JWT signés avec refresh automatique. Expiration configurée. Pas de stockage en clair.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <Lock className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Hashage Mots de Passe</h4>
                        <p className="text-sm text-muted-foreground">
                          Bcrypt avec salt automatique par Supabase Auth. Pas de stockage en clair.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Sécurité Frontend</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>ProtectedRoute :</strong> Vérification auth avant accès aux pages protégées</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>Validation Zod :</strong> Validation côté client avec schémas TypeScript</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>HTTPS Only :</strong> Toutes les communications chiffrées en production</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span><strong>XSS Prevention :</strong> React échappe automatiquement les entrées utilisateur</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Conformité RGPD & Données de Santé</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    En tant que plateforme de santé, SANTE.GA respecte les normes les plus strictes :
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Hébergement certifié données de santé (Supabase infrastructure)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Chiffrement au repos et en transit (AES-256, TLS 1.3)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Droit à l&apos;oubli : suppression complète des données sur demande</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Portabilité : export des données personnelles en format standard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Traçabilité : logs d&apos;accès aux dossiers médicaux</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Audit & Monitoring</h3>
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <ul className="space-y-2 text-sm">
                      <li>• Logs système centralisés (Supabase Analytics)</li>
                      <li>• Monitoring des tentatives de connexion échouées</li>
                      <li>• Alertes sur activités suspectes</li>
                      <li>• Backup automatique quotidien de la base</li>
                      <li>• Point-in-time recovery (PITR)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ROADMAP */}
          <TabsContent value="roadmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Roadmap & Évolutions Futures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Phase 1 : MVP (Complétée) ✅</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Authentification multi-rôles</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Dashboard patient avec données mockées</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Interface super admin</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Architecture backend sécurisée</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Comptes démo pour tests</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Phase 2 : Fonctionnalités Core (En cours) 🚧</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-warning" />
                      <span>Gestion complète des rendez-vous (CRUD)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-warning" />
                      <span>Ordonnances électroniques avec QR code</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-warning" />
                      <span>Upload et gestion des résultats médicaux</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-warning" />
                      <span>Recherche et filtrage des prestataires</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-warning" />
                      <span>Profils professionnels détaillés</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Phase 3 : Intégrations (Q2 2025) 📅</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>API CNAMGS (vérification droits, remboursements)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>API CNSS (cotisations)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Mobile Money (Airtel, Moov, MTN)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>SMS notifications (rendez-vous, résultats)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Email transactionnel (SendGrid)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Phase 4 : Télémédecine (Q3 2025) 📅</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Visioconférence WebRTC intégrée</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Chat médecin-patient</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Partage de documents en temps réel</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Enregistrement consultations (avec consentement)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Phase 5 : Applications Mobiles (Q4 2025) 📅</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Application mobile iOS (React Native)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Application mobile Android (React Native)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Notifications push natives</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Géolocalisation pour recherche proximité</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Mode hors-ligne pour consultations en zone rurale</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Phase 6 : Intelligence Artificielle (2026) 📅</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Assistant IA pour pré-diagnostic</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Recommandations médicaments via IA</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Analyse prédictive des épidémies</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span>Chatbot support patients 24/7</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métriques de Succès</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-3xl font-bold text-primary mb-1">100K+</p>
                    <p className="text-sm text-muted-foreground">Utilisateurs actifs visés fin 2025</p>
                  </div>
                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-3xl font-bold text-primary mb-1">500+</p>
                    <p className="text-sm text-muted-foreground">Professionnels de santé inscrits</p>
                  </div>
                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-3xl font-bold text-primary mb-1">50K+</p>
                    <p className="text-sm text-muted-foreground">Consultations mensuelles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
