import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, Calendar, FileText, Activity, 
  TrendingUp, TrendingDown, ClipboardList, Stethoscope, Building2,
  ArrowUpRight, ArrowDownRight, DollarSign, Pill, Heart, Clock
} from 'lucide-react';
import { ROLE_LABELS } from '@/config/menuDefinitions';

export default function ProfessionalHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    establishments,
    currentEstablishment,
    currentRole,
    isLoading
  } = useMultiEstablishment();

  useEffect(() => {
    if (!user) {
      navigate('/login/professional');
      return;
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de votre espace professionnel...</p>
        </div>
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || 'Professionnel';
  const activeRole = currentRole || 'doctor';

  return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-muted-foreground">
              {currentEstablishment?.establishment_name || 'CMST SOGARA'}
            </p>
            <Badge variant="default">
              {ROLE_LABELS[activeRole] || activeRole}
            </Badge>
          </div>
        </div>

      {/* Stats Cards - Modern Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Patients */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +12%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                Patients aujourd'hui
              </p>
              <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">12</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2">
                +2 vs hier
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-emerald-200/30 dark:bg-emerald-800/20"></div>
        </Card>

        {/* Card 2 - Rendez-vous */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 gap-1">
                <Clock className="h-3 w-3" />
                5 à venir
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                Rendez-vous
              </p>
              <h3 className="text-3xl font-bold text-blue-900 dark:text-blue-100">8</h3>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                3 confirmés
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-200/30 dark:bg-blue-800/20"></div>
        </Card>

        {/* Card 3 - Revenus */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +8%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">
                Revenus du mois
              </p>
              <h3 className="text-3xl font-bold text-amber-900 dark:text-amber-100">2.45M</h3>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                XAF
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-amber-200/30 dark:bg-amber-800/20"></div>
        </Card>

        {/* Card 4 - Taux satisfaction */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 gap-1">
                <TrendingUp className="h-3 w-3" />
                Excellent
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                Satisfaction
              </p>
              <h3 className="text-3xl font-bold text-purple-900 dark:text-purple-100">96%</h3>
              <p className="text-xs text-purple-600 dark:text-purple-500 mt-2">
                +3% ce mois
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-purple-200/30 dark:bg-purple-800/20"></div>
        </Card>
      </div>

      {/* Content based on role - Modern Design */}
      {activeRole === 'director' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activité Direction */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-500/10 dark:bg-slate-500/20 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold">Activité Direction</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-800/50">
                  <span className="text-sm font-medium">Décisions en attente</span>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">5</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-800/50">
                  <span className="text-sm font-medium">Rapports à valider</span>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">3</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-800/50">
                  <span className="text-sm font-medium">Réunions programmées</span>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">2</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Administration */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                </div>
                <h3 className="text-lg font-semibold">Administration</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-indigo-900/30">
                  <span className="text-sm font-medium">Personnel actif</span>
                  <span className="text-lg font-bold text-indigo-900 dark:text-indigo-100">124</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-indigo-900/30">
                  <span className="text-sm font-medium">Budget mensuel</span>
                  <span className="text-lg font-bold text-indigo-900 dark:text-indigo-100">85%</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-indigo-900/30">
                  <span className="text-sm font-medium">Inventaire</span>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">OK</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Graphique Revenus */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Revenus Mensuels</h3>
                <Badge className="bg-white/20 text-white border-0">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.2%
                </Badge>
              </div>
              <div className="mb-4">
                <h2 className="text-4xl font-bold">2.45M XAF</h2>
                <p className="text-emerald-100 text-sm mt-1">Janvier 2025</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-100">CNAMGS</span>
                  <span className="font-semibold">68%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full">
                  <div className="h-2 bg-white rounded-full" style={{ width: '68%' }}></div>
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-emerald-100">CNSS</span>
                  <span className="font-semibold">17%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full">
                  <div className="h-2 bg-white rounded-full" style={{ width: '17%' }}></div>
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-emerald-100">Privé</span>
                  <span className="font-semibold">15%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full">
                  <div className="h-2 bg-white rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-white/10"></div>
          </Card>
        </div>
      )}

      {activeRole === 'doctor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Consultations du jour */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
                </div>
                <h3 className="text-lg font-semibold">Mes consultations du jour</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-white dark:bg-cyan-900/30 rounded-xl border-l-4 border-l-cyan-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Marie MOUSSAVOU</p>
                      <p className="text-sm text-muted-foreground">9h00 - Consultation générale</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">En attente</Badge>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-cyan-900/30 rounded-xl border-l-4 border-l-emerald-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Jean NZENGUE</p>
                      <p className="text-sm text-muted-foreground">10h30 - Suivi post-op</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">Confirmé</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Prescriptions */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center">
                  <Pill className="h-5 w-5 text-violet-700 dark:text-violet-300" />
                </div>
                <h3 className="text-lg font-semibold">Prescriptions</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-violet-900/30">
                  <span className="text-sm font-medium">Ordonnances du jour</span>
                  <span className="text-2xl font-bold text-violet-900 dark:text-violet-100">4</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-violet-900/30">
                  <span className="text-sm font-medium">En attente validation</span>
                  <span className="text-2xl font-bold text-violet-900 dark:text-violet-100">2</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-violet-900/30">
                  <span className="text-sm font-medium">Renouvellements</span>
                  <span className="text-2xl font-bold text-violet-900 dark:text-violet-100">1</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions - Modern Design */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Actions rapides</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Tout voir →
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/professional/appointments')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Nouveau RDV</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Planifier</p>
            </button>
            
            <button 
              onClick={() => navigate('/professional/consultations')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Stethoscope className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Consultation</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Démarrer</p>
            </button>
            
            <button 
              onClick={() => navigate('/professional/patients')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">Patients</p>
              <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">Gérer</p>
            </button>
            
            <button 
              onClick={() => navigate('/professional/statistics')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">Statistiques</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Analyser</p>
            </button>
          </div>
        </div>
      </Card>
      </div>
  );
}