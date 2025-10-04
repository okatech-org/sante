import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, UserCog, AlertCircle, TrendingUp, Shield, Activity, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
        <div className="flex flex-col space-y-8 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                <Shield className="h-8 w-8" />
                Super Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                SANTE.GA - Système National de Santé • {user?.email}
              </p>
            </div>
            <Badge variant="outline" className="px-4 py-2 text-sm border-primary/20">
              <Activity className="h-3 w-3 mr-2 inline" />
              Système Opérationnel
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card border-border/50 hover:border-border transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-card border border-border/50">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="integrations">Intégrations</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Demandes en Attente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Professionnels</span>
                        <Badge variant="secondary">24</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Établissements</span>
                        <Badge variant="secondary">8</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Modifications de profil</span>
                        <Badge variant="secondary">15</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Activité Système
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Temps de disponibilité</span>
                        <span className="text-foreground font-semibold">99.98%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Requêtes/min</span>
                        <span className="text-foreground font-semibold">1,247</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Dernière sauvegarde</span>
                        <span className="text-foreground font-semibold">Il y a 2h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Gestion des Utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Module de gestion des utilisateurs - En développement</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Monitoring des Intégrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <div>
                        <h4 className="text-foreground font-semibold">CNAMGS</h4>
                        <p className="text-sm text-muted-foreground">Caisse Nationale d'Assurance Maladie</p>
                      </div>
                      <Badge className="bg-success text-success-foreground">Connecté</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <div>
                        <h4 className="text-foreground font-semibold">CNSS</h4>
                        <p className="text-sm text-muted-foreground">Caisse Nationale de Sécurité Sociale</p>
                      </div>
                      <Badge className="bg-success text-success-foreground">Connecté</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Paramètres de Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <span className="text-foreground">Authentification 2FA</span>
                      <Badge variant="secondary">Recommandé</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <span className="text-foreground">Logs d'audit</span>
                      <Badge className="bg-success text-success-foreground">Activé</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <span className="text-foreground">Chiffrement des données</span>
                      <Badge className="bg-success text-success-foreground">AES-256</Badge>
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
