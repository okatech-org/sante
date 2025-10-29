import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, Users, Lock, AlertTriangle, Activity, TrendingUp, TrendingDown, 
  Building2, UserCheck, Clock, CheckCircle, XCircle, ArrowUpRight, Eye, 
  DollarSign, Heart, Sparkles, Server, Database, Globe, Zap, Bell,
  FileText, Video, Pill, TestTube, Calendar, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isSuperAdmin, isAdmin } = useOfflineAuth();
  const [timeRange, setTimeRange] = useState("week");
  const [systemStatus, setSystemStatus] = useState("operational");

  useEffect(() => {
    if (!user || (!isSuperAdmin && !isAdmin)) {
      navigate("/login/superadmin");
    }
  }, [user, isSuperAdmin, isAdmin, navigate]);

  useEffect(() => {
    // Simuler un refresh des données toutes les 30 secondes
    const interval = setInterval(() => {
      // Ici, on pourrait rafraîchir les stats depuis l'API
      console.log("Refreshing dashboard stats...");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!user || (!isSuperAdmin && !isAdmin)) {
    return null;
  }

  // Données statistiques complètes
  const stats = {
    // Utilisateurs
    totalUsers: 12847,
    userGrowth: 35,
    activeUsersToday: 2145,
    newUsersToday: 234,
    newUsers7Days: 1523,
    
    // Établissements
    totalEstablishments: 342,
    establishmentGrowth: 12,
    verifiedEstablishments: 298,
    pendingClaims: 18,
    suspendedEstablishments: 3,
    
    // Professionnels
    totalProfessionals: 1523,
    professionalsGrowth: 28,
    activeProfessionals: 1401,
    pendingValidations: 43,
    
    // Activité médicale (24h)
    consultations24h: 892,
    consultationsGrowth: 18,
    teleconsultations24h: 234,
    prescriptions24h: 567,
    labOrders24h: 145,
    appointments24h: 1203,
    
    // Financier
    revenue: "2.4",
    revenueGrowth: 22,
    pendingPayments: "145.2",
    activeSubscriptions: 287,
    subscriptionRevenue: "1.8",
    
    // Système
    apiCalls24h: 125634,
    apiErrorRate: 0.3,
    avgResponseTime: 145,
    uptime: 99.98,
    storageUsed: 234,
    storageTotal: 1000,
    
    // Sécurité
    securityIncidents24h: 0,
    failedLogins24h: 23,
    suspiciousActivities: 2,
    activeAlerts: 0
  };

  const recentActivities = [
    { id: 1, type: "user", action: "Nouvel utilisateur inscrit", user: "Dr. Marie Okemba", time: "Il y a 5 min", status: "success", icon: Users },
    { id: 2, type: "approval", action: "Établissement validé", user: "Pharmacie Centrale", time: "Il y a 12 min", status: "success", icon: CheckCircle },
    { id: 3, type: "establishment", action: "Nouvel établissement ajouté", user: "Clinique Saint-Michel", time: "Il y a 23 min", status: "success", icon: Building2 },
    { id: 4, type: "consultation", action: "Téléconsultation terminée", user: "Dr. Paul Mba", time: "Il y a 35 min", status: "success", icon: Video },
    { id: 5, type: "security", action: "Tentative de connexion suspecte bloquée", user: "Système de sécurité", time: "Il y a 1h", status: "blocked", icon: Shield },
    { id: 6, type: "billing", action: "Facture générée", user: "CHU de Libreville", time: "Il y a 2h", status: "success", icon: FileText },
  ];

  const topEstablishments = [
    { name: "CHU de Libreville", appointments: 1245, rating: 4.8, growth: 15, revenue: "245K" },
    { name: "Clinique Mandji", appointments: 892, rating: 4.6, growth: 22, revenue: "178K" },
    { name: "Hôpital Albert Schweitzer", appointments: 756, rating: 4.7, growth: 8, revenue: "156K" },
    { name: "Centre Médical Port-Gentil", appointments: 634, rating: 4.5, growth: 12, revenue: "134K" },
    { name: "Polyclinique Jeanne Ebori", appointments: 589, rating: 4.6, growth: 18, revenue: "122K" }
  ];

  const weeklyData = [
    { day: 'Lun', users: 1850, consultations: 145, revenue: 32 },
    { day: 'Mar', users: 2100, consultations: 178, revenue: 38 },
    { day: 'Mer', users: 1950, consultations: 156, revenue: 35 },
    { day: 'Jeu', users: 2300, consultations: 198, revenue: 42 },
    { day: 'Ven', users: 2450, consultations: 215, revenue: 48 },
    { day: 'Sam', users: 1800, consultations: 134, revenue: 28 },
    { day: 'Dim', users: 1950, consultations: 142, revenue: 31 }
  ];

  const systemHealthChecks = [
    { name: "Base de données", status: "healthy", uptime: 99.99, responseTime: 12 },
    { name: "API", status: "healthy", uptime: 99.95, responseTime: 145 },
    { name: "Stockage", status: "warning", usage: 78, limit: 90 },
    { name: "File d'attente", status: "healthy", pending: 12, failed: 0 }
  ];

  return (
    <SuperAdminLayoutSimple>
      <div className="space-y-6">
        {/* En-tête avec statut système */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Bienvenue, {user?.user_metadata?.full_name || 'Super Admin'}
            </h1>
            <p className="text-muted-foreground mt-2">
              Système de santé SANTE.GA - Contrôle centralisé
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1.5 border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
              Système opérationnel
            </Badge>
            <Badge variant="outline" className="px-3 py-1.5">
              <Activity className="w-3 h-3 mr-2" />
              {stats.uptime}% uptime
            </Badge>
          </div>
        </div>

        {/* Statistiques principales - 4 cartes KPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Utilisateurs</CardTitle>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{stats.userGrowth}%
                </Badge>
                <span className="text-xs text-muted-foreground">vs mois dernier</span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                +{stats.newUsers7Days} nouveaux cette semaine
              </div>
            </CardContent>
          </Card>

          {/* Total Establishments */}
          <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent dark:from-purple-500/20 dark:via-purple-500/10 hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Établissements</CardTitle>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-foreground">{stats.totalEstablishments}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{stats.establishmentGrowth}%
                </Badge>
                <span className="text-xs text-muted-foreground">ce mois</span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {stats.verifiedEstablishments} vérifiés, {stats.pendingClaims} en attente
              </div>
            </CardContent>
          </Card>

          {/* Total Professionals */}
          <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-500/20 dark:via-emerald-500/10 hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Professionnels</CardTitle>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-foreground">{stats.totalProfessionals.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{stats.professionalsGrowth}%
                </Badge>
                <span className="text-xs text-muted-foreground">actifs</span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {stats.pendingValidations} validations en attente
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent dark:from-orange-500/20 dark:via-orange-500/10 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/admin/approvals')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approbations</CardTitle>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-foreground">{stats.pendingValidations}</div>
              <div className="flex items-center gap-2 mt-2">
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700"
                >
                  Voir les demandes
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Nouvelles demandes à traiter
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activité médicale et financière - 6 cartes secondaires */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className="text-xs">24h</Badge>
              </div>
              <div className="text-2xl font-bold">{stats.consultations24h}</div>
              <p className="text-xs text-muted-foreground mt-1">Consultations</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Video className="h-5 w-5 text-purple-500" />
                <Badge variant="outline" className="text-xs">24h</Badge>
              </div>
              <div className="text-2xl font-bold">{stats.teleconsultations24h}</div>
              <p className="text-xs text-muted-foreground mt-1">Téléconsultations</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Pill className="h-5 w-5 text-green-500" />
                <Badge variant="outline" className="text-xs">24h</Badge>
              </div>
              <div className="text-2xl font-bold">{stats.prescriptions24h}</div>
              <p className="text-xs text-muted-foreground mt-1">Ordonnances</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <TestTube className="h-5 w-5 text-cyan-500" />
                <Badge variant="outline" className="text-xs">24h</Badge>
              </div>
              <div className="text-2xl font-bold">{stats.labOrders24h}</div>
              <p className="text-xs text-muted-foreground mt-1">Analyses</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                <Badge variant="outline" className="text-xs border-green-500/30 text-green-600 dark:text-green-400">
                  <TrendingUp className="w-2 h-2 mr-1" />
                  {stats.revenueGrowth}%
                </Badge>
              </div>
              <div className="text-2xl font-bold">${stats.revenue}M</div>
              <p className="text-xs text-muted-foreground mt-1">Revenus</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Globe className="h-5 w-5 text-indigo-500" />
                <Badge variant="outline" className="text-xs">API</Badge>
              </div>
              <div className="text-2xl font-bold">{(stats.apiCalls24h / 1000).toFixed(1)}K</div>
              <p className="text-xs text-muted-foreground mt-1">Appels API</p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique d'activité */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Activité de la plateforme</CardTitle>
                <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="week" className="text-xs">Semaine</TabsTrigger>
                    <TabsTrigger value="month" className="text-xs">Mois</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>Utilisateurs actifs et consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Graphique en barres doubles */}
                <div className="flex items-end justify-between h-56 gap-2">
                  {weeklyData.map((data, i) => {
                    const maxUsers = Math.max(...weeklyData.map(d => d.users));
                    const maxConsultations = Math.max(...weeklyData.map(d => d.consultations));
                    const userHeight = (data.users / maxUsers) * 100;
                    const consultHeight = (data.consultations / maxConsultations) * 100;
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex gap-1 items-end h-48">
                          <div 
                            className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer group relative"
                            style={{ height: `${userHeight}%` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                              {data.users} users
                            </div>
                          </div>
                          <div 
                            className="flex-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg hover:from-purple-600 hover:to-purple-500 transition-all cursor-pointer group relative"
                            style={{ height: `${consultHeight}%` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                              {data.consultations} consult.
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{data.day}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-400" />
                    <span className="text-muted-foreground">Utilisateurs actifs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-purple-400" />
                    <span className="text-muted-foreground">Consultations</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Santé du système */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Santé Système
              </CardTitle>
              <CardDescription>Monitoring en temps réel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealthChecks.map((check, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{check.name}</span>
                      <Badge 
                        variant="outline" 
                        className={
                          check.status === 'healthy' ? 'border-green-500/30 text-green-600 dark:text-green-400' :
                          check.status === 'warning' ? 'border-yellow-500/30 text-yellow-600 dark:text-yellow-400' :
                          'border-red-500/30 text-red-600 dark:text-red-400'
                        }
                      >
                        <div className={`w-2 h-2 rounded-full mr-1.5 ${
                          check.status === 'healthy' ? 'bg-green-500' :
                          check.status === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                        {check.status === 'healthy' ? 'OK' : check.status === 'warning' ? 'Attention' : 'Erreur'}
                      </Badge>
                    </div>
                    <Progress 
                      value={check.uptime || check.usage || 100} 
                      className={`h-2 ${
                        check.status === 'healthy' ? '[&>div]:bg-green-500' :
                        check.status === 'warning' ? '[&>div]:bg-yellow-500' :
                        '[&>div]:bg-red-500'
                      }`}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {check.uptime && `${check.uptime}% uptime`}
                        {check.usage && `${check.usage}% utilisé`}
                      </span>
                      {check.responseTime && <span>{check.responseTime}ms</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Établissements et Métriques financières */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Établissements */}
          <Card>
            <CardHeader>
              <CardTitle>Établissements Top Performers</CardTitle>
              <CardDescription>Classement par activité et satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topEstablishments.map((est, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${
                      i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                      i === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                      i === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                      'bg-gradient-to-br from-primary/70 to-primary/50'
                    }`}>
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{est.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{est.appointments} RDV</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">{est.revenue} XAF</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{est.rating}</span>
                      </div>
                      <Badge variant="outline" className="border-green-500/30 text-green-600 dark:text-green-400 text-xs">
                        <TrendingUp className="w-2 h-2 mr-1" />
                        {est.growth}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Métriques financières détaillées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Aperçu Financier
              </CardTitle>
              <CardDescription>Revenus et paiements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Revenus mensuels</span>
                  <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{stats.revenueGrowth}%
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-foreground">${stats.revenue}M</div>
                <Progress value={stats.revenueGrowth} className="mt-3 h-2 [&>div]:bg-green-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Abonnements</div>
                  <div className="text-xl font-bold mt-1">{stats.activeSubscriptions}</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">${stats.subscriptionRevenue}M MRR</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">En attente</div>
                  <div className="text-xl font-bold mt-1">${stats.pendingPayments}K</div>
                  <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">À collecter</div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taux de conversion</span>
                  <span className="font-semibold">87%</span>
                </div>
                <Progress value={87} className="mt-2 h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activités récentes et Actions rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flux d'activités en temps réel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Activité en Temps Réel
                  </CardTitle>
                  <CardDescription>Dernières actions sur la plateforme</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">En direct</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                        activity.status === 'success' ? 'bg-green-500/20' :
                        activity.status === 'pending' ? 'bg-orange-500/20' :
                        activity.status === 'blocked' ? 'bg-red-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          activity.status === 'success' ? 'text-green-600 dark:text-green-400' :
                          activity.status === 'pending' ? 'text-orange-600 dark:text-orange-400' :
                          activity.status === 'blocked' ? 'text-red-600 dark:text-red-400' :
                          'text-blue-600 dark:text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm group-hover:text-primary transition-colors">{activity.action}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.user}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides et raccourcis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Actions Rapides
              </CardTitle>
              <CardDescription>Accès direct aux fonctions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                onClick={() => navigate('/admin/users')}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3 group-hover:bg-blue-500/30">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">Utilisateurs</div>
                  <div className="text-xs text-muted-foreground">Gérer {stats.totalUsers.toLocaleString()} comptes</div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all group"
                onClick={() => navigate('/admin/health-actors')}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3 group-hover:bg-purple-500/30">
                  <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">Professionnels</div>
                  <div className="text-xs text-muted-foreground">{stats.pendingValidations} validations</div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3 hover:bg-orange-500/10 hover:border-orange-500/30 hover:text-orange-600 dark:hover:text-orange-400 transition-all group"
                onClick={() => navigate('/admin/approvals')}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mr-3 group-hover:bg-orange-500/30">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">Approbations</div>
                  <div className="text-xs text-muted-foreground">{stats.pendingValidations} demandes</div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto py-3 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all group"
                onClick={() => navigate('/admin/cartography')}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mr-3 group-hover:bg-emerald-500/30">
                  <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">Cartographie</div>
                  <div className="text-xs text-muted-foreground">{stats.totalEstablishments} établissements</div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>

              <div className="pt-4 border-t border-border/50">
                <Button 
                  variant="destructive" 
                  className="w-full justify-center gap-2"
                  size="sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Mode Urgence
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sécurité et API */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Alertes de sécurité */}
          <Card className={stats.activeAlerts > 0 ? "border-red-500/50 bg-red-500/5" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Sécurité & Alertes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <div className="text-2xl font-bold">{stats.securityIncidents24h}</div>
                  <div className="text-xs text-muted-foreground mt-1">Incidents</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <div className="text-2xl font-bold">{stats.failedLogins24h}</div>
                  <div className="text-xs text-muted-foreground mt-1">Échecs login</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <div className="text-2xl font-bold">{stats.suspiciousActivities}</div>
                  <div className="text-xs text-muted-foreground mt-1">Suspects</div>
                </div>
              </div>

              {stats.activeAlerts === 0 ? (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium text-sm text-green-900 dark:text-green-100">Aucune alerte active</p>
                    <p className="text-xs text-green-700 dark:text-green-300">Tous les systèmes sont sécurisés</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Alertes critiques</p>
                      <p className="text-xs text-muted-foreground">{stats.activeAlerts} alerte(s) nécessitent une attention</p>
                    </div>
                    <Button size="sm" variant="destructive">Voir</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistiques API */}
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Performance API
              </CardTitle>
              <CardDescription>Monitoring des intégrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Appels API (24h)</span>
                  <span className="font-semibold">{stats.apiCalls24h.toLocaleString()}</span>
                </div>
                <Progress value={75} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taux d'erreur</span>
                  <Badge variant="outline" className="border-green-500/30 text-green-600 dark:text-green-400">
                    {stats.apiErrorRate}%
                  </Badge>
                </div>
                <Progress value={stats.apiErrorRate} className="h-2 [&>div]:bg-green-500" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Temps de réponse</span>
                  <span className="font-semibold">{stats.avgResponseTime}ms</span>
                </div>
                <Progress value={30} className="h-2" />

                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Disponibilité</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{stats.uptime}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profil et Permissions */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-card via-card to-primary/5 dark:to-primary/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle>Profil Super Administrateur</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <span className="text-xs text-muted-foreground">Niveau d'accès</span>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                      {isSuperAdmin ? "Niveau 10" : "Niveau 5"}
                    </Badge>
                    <Badge variant="outline" className="border-green-500/30 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Vérifié
                    </Badge>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <span className="text-xs text-muted-foreground">Authentification</span>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="border-green-500/30 text-green-600 dark:text-green-400">
                      <Lock className="w-3 h-3 mr-1" />
                      2FA Activé
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-2">Permissions complètes</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['Utilisateurs', 'Établissements', 'Facturation', 'Sécurité', 'API', 'Système', 'Analytics', 'Support'].map((perm, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span className="text-muted-foreground">{perm}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayoutSimple>
  );
}
