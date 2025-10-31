import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, Calendar, DollarSign, TrendingUp, Activity, 
  Building2, Shield, AlertCircle, CheckCircle, Clock,
  ArrowUpRight, Bed, Stethoscope, Package, FileText
} from 'lucide-react';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';

export default function DirectorDashboard() {
  const navigate = useNavigate();
  const { currentEstablishment } = useMultiEstablishment();

  // Stats Direction
  const directionStats = {
    totalStaff: 124,
    activeDoctors: 18,
    totalBeds: 85,
    occupancyRate: 87,
    monthlyRevenue: 2450000,
    revenueGrowth: 15.2,
    pendingDecisions: 5,
    reportsToValidate: 3,
    scheduledMeetings: 2,
    criticalAlerts: 1
  };

  const departmentStats = [
    { name: 'Médecine Générale', beds: 20, occupied: 15, staff: 8, patients: 45 },
    { name: 'Cardiologie', beds: 15, occupied: 12, staff: 6, patients: 32 },
    { name: 'Pédiatrie', beds: 25, occupied: 18, staff: 10, patients: 52 },
    { name: 'Chirurgie', beds: 18, occupied: 10, staff: 12, patients: 28 },
    { name: 'Urgences', beds: 12, occupied: 11, staff: 15, patients: 68 }
  ];

  const recentDecisions = [
    { id: 1, title: 'Validation budget Q1 2025', priority: 'high', deadline: '2025-02-05' },
    { id: 2, title: 'Recrutement médecin urgentiste', priority: 'critical', deadline: '2025-02-01' },
    { id: 3, title: 'Achat équipement imagerie', priority: 'normal', deadline: '2025-02-10' }
  ];

  const financialBreakdown = [
    { source: 'CNAMGS', amount: 1680000, percentage: 68, color: 'bg-blue-500' },
    { source: 'CNSS', amount: 420000, percentage: 17, color: 'bg-green-500' },
    { source: 'Privé', amount: 350000, percentage: 15, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Direction</h1>
        <p className="text-muted-foreground mt-1">
          {currentEstablishment?.establishment_name || 'CMST SOGARA'} - Vue d'ensemble administrative
        </p>
      </div>

      {/* Stats Direction principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                Actifs
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                Personnel Total
              </p>
              <h3 className="text-3xl font-bold text-blue-900 dark:text-blue-100">{directionStats.totalStaff}</h3>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                {directionStats.activeDoctors} médecins
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-200/30 dark:bg-blue-800/20"></div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                <Bed className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {directionStats.occupancyRate}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                Occupation Lits
              </p>
              <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                {Math.round(directionStats.totalBeds * directionStats.occupancyRate / 100)}/{directionStats.totalBeds}
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2">
                Taux optimal
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-emerald-200/30 dark:bg-emerald-800/20"></div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 gap-1">
                <TrendingUp className="h-3 w-3" />
                +{directionStats.revenueGrowth}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">
                Revenus Mensuel
              </p>
              <h3 className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                {(directionStats.monthlyRevenue / 1000000).toFixed(2)}M
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                XAF
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-amber-200/30 dark:bg-amber-800/20"></div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              {directionStats.criticalAlerts > 0 && (
                <Badge variant="destructive">
                  Urgent
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                Alertes Critiques
              </p>
              <h3 className="text-3xl font-bold text-red-900 dark:text-red-100">{directionStats.criticalAlerts}</h3>
              <p className="text-xs text-red-600 dark:text-red-500 mt-2">
                Nécessite action
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-red-200/30 dark:bg-red-800/20"></div>
        </Card>
      </div>

      {/* Grille 3 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Décisions en attente */}
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-700 dark:text-orange-300" />
              </div>
              <h3 className="text-lg font-semibold">Décisions en attente</h3>
            </div>
            <div className="space-y-3">
              {recentDecisions.map((decision) => (
                <div key={decision.id} className="p-4 rounded-xl bg-muted/50 border-l-4 border-l-orange-500">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{decision.title}</h4>
                    <Badge variant={decision.priority === 'critical' ? 'destructive' : decision.priority === 'high' ? 'default' : 'outline'} className="text-xs">
                      {decision.priority === 'critical' ? 'Critique' : decision.priority === 'high' ? 'Haute' : 'Normale'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Échéance: {new Date(decision.deadline).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm">
              Voir toutes les décisions
            </Button>
          </div>
        </Card>

        {/* Performance des services */}
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-purple-700 dark:text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold">Services</h3>
            </div>
            <div className="space-y-3">
              {departmentStats.slice(0, 3).map((dept) => {
                const occupancy = Math.round((dept.occupied / dept.beds) * 100);
                return (
                  <div key={dept.name} className="p-3 rounded-xl bg-muted/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{dept.name}</span>
                      <Badge variant="outline">{occupancy}%</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{dept.occupied}/{dept.beds} lits</span>
                      <span>•</span>
                      <span>{dept.staff} personnel</span>
                      <span>•</span>
                      <span>{dept.patients} patients</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm" onClick={() => navigate('/professional/services')}>
              Voir tous les services
            </Button>
          </div>
        </Card>

        {/* Revenus par source */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 text-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Revenus Mensuels</h3>
              <Badge className="bg-white/20 text-white border-0">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{directionStats.revenueGrowth}%
              </Badge>
            </div>
            <div className="mb-6">
              <h2 className="text-4xl font-bold">{(directionStats.monthlyRevenue / 1000000).toFixed(2)}M XAF</h2>
              <p className="text-emerald-100 text-sm mt-1">Janvier 2025</p>
            </div>
            <div className="space-y-3">
              {financialBreakdown.map((item) => (
                <div key={item.source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-emerald-100">{item.source}</span>
                    <span className="font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full">
                    <div className={`h-2 ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-white/10"></div>
        </Card>
      </div>

      {/* Indicateurs clés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPI Direction */}
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              Indicateurs Clés Direction
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <Badge variant="outline" className="text-xs">Direction</Badge>
                </div>
                <div className="text-2xl font-bold">{directionStats.pendingDecisions}</div>
                <div className="text-xs text-muted-foreground mt-1">Décisions en attente</div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/50 dark:to-cyan-900/50">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <Badge variant="outline" className="text-xs">Rapports</Badge>
                </div>
                <div className="text-2xl font-bold">{directionStats.reportsToValidate}</div>
                <div className="text-xs text-muted-foreground mt-1">À valider</div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <Badge variant="outline" className="text-xs">Agenda</Badge>
                </div>
                <div className="text-2xl font-bold">{directionStats.scheduledMeetings}</div>
                <div className="text-xs text-muted-foreground mt-1">Réunions prévues</div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/50 dark:to-amber-900/50">
                <div className="flex items-center justify-between mb-2">
                  <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    OK
                  </Badge>
                </div>
                <div className="text-2xl font-bold">98%</div>
                <div className="text-xs text-muted-foreground mt-1">Stock disponible</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Activités récentes Direction */}
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              Activités Récentes
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Validation budget Q4 2024</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Recrutement 2 infirmiers approuvé</p>
                  <p className="text-xs text-muted-foreground">Il y a 5 heures</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <Stethoscope className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Nouveau protocole chirurgie validé</p>
                  <p className="text-xs text-muted-foreground">Hier</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions rapides Direction */}
      <Card className="border-0 shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-6">Actions rapides Direction</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/professional/staff')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Personnel</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Gérer</p>
            </button>

            <button 
              onClick={() => navigate('/professional/billing')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Finances</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">CNAMGS</p>
            </button>

            <button 
              onClick={() => navigate('/professional/inventory')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Package className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">Stocks</p>
              <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">Inventaire</p>
            </button>

            <button 
              onClick={() => navigate('/professional/reports')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">Rapports</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Analyser</p>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
