import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Building2, UserCog, AlertCircle, TrendingUp, Shield, Activity, DollarSign, Settings, Database, Lock, Eye, BarChart3, Clock, CheckCircle2, XCircle, Search, Filter, UserCheck, UserX, Building, Stethoscope, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function SuperAdminDashboard() {
  const { user, isSuperAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  // Rediriger si pas superadmin
  if (!isSuperAdmin || user?.email !== "superadmin@sante.ga") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  const stats = [
    { title: "Patients Enregistrés", value: "45,231", icon: Users, color: "text-white", trend: "+12.5%" },
    { title: "Établissements", value: "156", icon: Building2, color: "text-white", trend: "+8" },
    { title: "Professionnels", value: "3,847", icon: UserCog, color: "text-white", trend: "+23" },
    { title: "Consultations (30j)", value: "18,492", icon: Activity, color: "text-white", trend: "+18.2%" },
    { title: "Économies EVASAN", value: "2.4M FCFA", icon: DollarSign, color: "text-white", trend: "+156K" },
    { title: "Intégrations Actives", value: "CNAMGS • CNSS", icon: Shield, color: "text-white", trend: "100%" },
  ];

  return (
    <div className="theme-superadmin min-h-screen bg-background">
      <MainLayout>
        <div className="flex flex-col space-y-8 p-8">
          {/* Header Premium */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-border/20">
            <div>
              <h1 className="text-5xl font-bold text-foreground flex items-center gap-4 mb-2">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Shield className="h-10 w-10" />
                </div>
                Super Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-lg ml-1">
                SANTE.GA - Système National de Santé Numérique • {user?.email}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Badge variant="outline" className="px-6 py-3 text-sm border-primary/30 justify-center">
                <Activity className="h-4 w-4 mr-2" />
                Système Opérationnel
              </Badge>
              <p className="text-xs text-muted-foreground text-center">
                Dernière mise à jour: {new Date().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Stats Grid Premium */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="bg-card border-border/30 hover:border-primary/30 transition-all duration-300 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <stat.icon className="h-5 w-5 text-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <p className="text-sm text-muted-foreground">{stat.trend}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-card border border-border/30 p-1 h-auto">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10">
                <BarChart3 className="h-4 w-4 mr-2" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-primary/10">
                <Users className="h-4 w-4 mr-2" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="establishments" className="data-[state=active]:bg-primary/10">
                <Building2 className="h-4 w-4 mr-2" />
                Établissements
              </TabsTrigger>
              <TabsTrigger value="integrations" className="data-[state=active]:bg-primary/10">
                <Database className="h-4 w-4 mr-2" />
                Intégrations
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary/10">
                <Shield className="h-4 w-4 mr-2" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary/10">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Demandes en attente */}
                <Card className="bg-card border-border/30">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Demandes en Attente
                    </CardTitle>
                    <CardDescription>Actions requérant votre validation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "Professionnels de santé", count: 24, icon: Stethoscope },
                        { label: "Établissements", count: 8, icon: Building },
                        { label: "Modifications de profil", count: 15, icon: UserCheck }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-border/30 rounded-lg hover:bg-accent/5 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <item.icon className="h-4 w-4" />
                            </div>
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                          </div>
                          <Badge variant="secondary" className="text-lg font-bold px-3">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <Button className="w-full" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir toutes les demandes
                    </Button>
                  </CardContent>
                </Card>

                {/* Activité Système */}
                <Card className="bg-card border-border/30">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Activité Système
                    </CardTitle>
                    <CardDescription>Performance et disponibilité</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Temps de disponibilité</span>
                          <span className="text-lg text-foreground font-bold">99.98%</span>
                        </div>
                        <Progress value={99.98} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Requêtes/min</span>
                          <span className="text-lg text-foreground font-bold">1,247</span>
                        </div>
                        <Progress value={62} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Utilisation serveur</span>
                          <span className="text-lg text-foreground font-bold">34%</span>
                        </div>
                        <Progress value={34} className="h-2" />
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Dernière sauvegarde
                      </span>
                      <span className="text-foreground font-semibold">Il y a 2h</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics EVASAN */}
              <Card className="bg-card border-border/30">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Impact Économique EVASAN
                  </CardTitle>
                  <CardDescription>Économies réalisées grâce à la télémédecine</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 border border-border/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Ce mois</p>
                      <p className="text-4xl font-bold text-foreground">2.4M</p>
                      <p className="text-xs text-muted-foreground mt-1">FCFA économisés</p>
                    </div>
                    <div className="text-center p-6 border border-border/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Cette année</p>
                      <p className="text-4xl font-bold text-foreground">18.7M</p>
                      <p className="text-xs text-muted-foreground mt-1">FCFA économisés</p>
                    </div>
                    <div className="text-center p-6 border border-border/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Consultations évitées</p>
                      <p className="text-4xl font-bold text-foreground">1,247</p>
                      <p className="text-xs text-muted-foreground mt-1">Évacuations sanitaires</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="bg-card border-border/30">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <CardTitle className="text-foreground">Gestion des Utilisateurs</CardTitle>
                      <CardDescription>Gérer tous les utilisateurs de la plateforme</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Rechercher..." className="w-64" />
                      <Button variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvel utilisateur
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Dernière connexion</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: "Dr. Marie Ndong", role: "Médecin", status: "active", lastLogin: "Il y a 2h" },
                        { name: "Jean Obame", role: "Patient", status: "active", lastLogin: "Il y a 5h" },
                        { name: "CHU Libreville", role: "Établissement", status: "pending", lastLogin: "Jamais" }
                      ].map((user, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            {user.status === "active" ? (
                              <Badge className="bg-success/20 text-success">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Actif
                              </Badge>
                            ) : (
                              <Badge className="bg-warning/20 text-warning">
                                <Clock className="h-3 w-3 mr-1" />
                                En attente
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Gérer</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Establishments Tab */}
            <TabsContent value="establishments" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { type: "Hôpitaux", count: 45, icon: Building2 },
                  { type: "Cliniques", count: 67, icon: Building },
                  { type: "Pharmacies", count: 128, icon: Plus },
                  { type: "Laboratoires", count: 34, icon: Activity }
                ].map((est, i) => (
                  <Card key={i} className="bg-card border-border/30 hover:border-primary/30 transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <est.icon className="h-8 w-8 text-muted-foreground" />
                        <Badge variant="secondary" className="text-2xl font-bold px-4 py-2">{est.count}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-foreground">{est.type}</p>
                      <p className="text-sm text-muted-foreground">Établissements actifs</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <Card className="bg-card border-border/30">
                <CardHeader>
                  <CardTitle className="text-foreground">Monitoring des Intégrations</CardTitle>
                  <CardDescription>État des connexions aux systèmes externes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        name: "CNAMGS", 
                        desc: "Caisse Nationale d'Assurance Maladie et de Garantie Sociale",
                        status: "connected",
                        uptime: "99.9%",
                        lastSync: "Il y a 5 min"
                      },
                      { 
                        name: "CNSS", 
                        desc: "Caisse Nationale de Sécurité Sociale",
                        status: "connected",
                        uptime: "99.8%",
                        lastSync: "Il y a 12 min"
                      },
                      { 
                        name: "Ministère de la Santé", 
                        desc: "Système d'information sanitaire national",
                        status: "connected",
                        uptime: "100%",
                        lastSync: "Il y a 2 min"
                      }
                    ].map((integration, i) => (
                      <div key={i} className="p-6 border border-border/30 rounded-lg hover:bg-accent/5 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg text-foreground font-semibold mb-1">{integration.name}</h4>
                            <p className="text-sm text-muted-foreground">{integration.desc}</p>
                          </div>
                          <Badge className="bg-success/20 text-success">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Connecté
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Disponibilité</p>
                            <p className="text-sm text-foreground font-semibold">{integration.uptime}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Dernière synchro</p>
                            <p className="text-sm text-foreground font-semibold">{integration.lastSync}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-card border-border/30">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Paramètres de Sécurité
                  </CardTitle>
                  <CardDescription>Configuration et monitoring de la sécurité</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        name: "Authentification à deux facteurs (2FA)", 
                        desc: "Protection avancée des comptes administrateurs",
                        status: "recommended",
                        icon: Lock
                      },
                      { 
                        name: "Logs d'audit", 
                        desc: "Traçabilité complète des actions administratives",
                        status: "active",
                        icon: Eye
                      },
                      { 
                        name: "Chiffrement des données", 
                        desc: "AES-256 pour toutes les données sensibles",
                        status: "active",
                        icon: Database
                      },
                      { 
                        name: "Détection des intrusions", 
                        desc: "Monitoring en temps réel des tentatives d'accès",
                        status: "active",
                        icon: AlertCircle
                      }
                    ].map((security, i) => (
                      <div key={i} className="flex items-center justify-between p-6 border border-border/30 rounded-lg">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <security.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-foreground font-semibold mb-1">{security.name}</p>
                            <p className="text-sm text-muted-foreground">{security.desc}</p>
                          </div>
                        </div>
                        {security.status === "active" ? (
                          <Badge className="bg-success/20 text-success">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Activé
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Recommandé
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-card border-border/30">
                <CardHeader>
                  <CardTitle className="text-foreground">Paramètres Système</CardTitle>
                  <CardDescription>Configuration générale de la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-border/30 rounded-lg">
                      <div>
                        <p className="text-foreground font-semibold">Mode maintenance</p>
                        <p className="text-sm text-muted-foreground">Désactiver temporairement la plateforme</p>
                      </div>
                      <Button variant="outline">Configurer</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border/30 rounded-lg">
                      <div>
                        <p className="text-foreground font-semibold">Sauvegardes automatiques</p>
                        <p className="text-sm text-muted-foreground">Planification et rétention</p>
                      </div>
                      <Button variant="outline">Gérer</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border/30 rounded-lg">
                      <div>
                        <p className="text-foreground font-semibold">Notifications système</p>
                        <p className="text-sm text-muted-foreground">Alertes et rappels automatiques</p>
                      </div>
                      <Button variant="outline">Paramétrer</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </div>
  );
}
