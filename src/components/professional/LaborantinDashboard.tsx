import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  TestTube, Microscope, FlaskConical, Clock,
  Mail, Phone, Building2, Briefcase, CheckCircle, Edit,
  ArrowUpRight, AlertCircle, FileText, Beaker, Activity, Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function LaborantinDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentEstablishment } = useMultiEstablishment();

  const [professionalData, setProfessionalData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadProfessionalData();
    }
  }, [user]);

  const loadProfessionalData = async () => {
    if (!user) return;

    const { data: profData } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profData) {
      setProfessionalData(profData);
    }
  };

  const fullName = user?.user_metadata?.full_name || professionalData?.full_name || 'Technicien(ne) Labo';
  
  const profile = {
    email: user?.email || professionalData?.email || '',
    phone: professionalData?.phone || '+241 07 XX XX XX',
    numeroOrdre: professionalData?.license_number || 'LAB-XXX',
    verified: professionalData?.is_verified || true,
  };

  // Analyses en cours
  const analysesEnCours = [
    { id: 1, patient: 'Marie MOUSSAVOU', type: 'Hématologie', test: 'NFS Complète', status: 'en_cours', priority: 'normal', startTime: '08:30', estimatedEnd: '10:30' },
    { id: 2, patient: 'Jean NZENGUE', type: 'Biochimie', test: 'Bilan Rénal', status: 'en_attente', priority: 'urgent', startTime: '09:00', estimatedEnd: '11:00' },
    { id: 3, patient: 'Sophie KOMBILA', type: 'Microbiologie', test: 'Hémoculture', status: 'en_cours', priority: 'high', startTime: '07:45', estimatedEnd: '48h' },
    { id: 4, patient: 'Pierre OBAME', type: 'Immunologie', test: 'Sérologie COVID', status: 'validation', priority: 'normal', startTime: '09:30', estimatedEnd: '10:45' },
    { id: 5, patient: 'André NGUEMA', type: 'Hématologie', test: 'Groupe Sanguin', status: 'terminé', priority: 'urgent', startTime: '08:00', estimatedEnd: '09:00' }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente': return 'bg-orange-50 dark:bg-orange-950/30 border-l-orange-500';
      case 'en_cours': return 'bg-blue-50 dark:bg-blue-950/30 border-l-blue-500';
      case 'validation': return 'bg-purple-50 dark:bg-purple-950/30 border-l-purple-500';
      case 'terminé': return 'bg-emerald-50 dark:bg-emerald-950/30 border-l-emerald-500';
      default: return 'bg-gray-50 dark:bg-gray-950/30 border-l-gray-500';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50">Prioritaire</Badge>;
      default: return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente': return <Badge variant="outline">En attente</Badge>;
      case 'en_cours': return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50">En cours</Badge>;
      case 'validation': return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50">Validation</Badge>;
      case 'terminé': return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50">Terminé</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec profil laborantin */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 via-background to-indigo-50 dark:from-purple-900/20 dark:via-slate-900 dark:to-indigo-900/20">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-lg">
                <AvatarFallback className="text-2xl font-bold bg-purple-500 text-white">
                  {getInitials(fullName)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{fullName}</h1>
                  {profile.verified && (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Vérifié
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="gap-1">
                    <Microscope className="h-3 w-3" />
                    Technicien(ne) de Laboratoire
                  </Badge>
                  <Badge variant="secondary">
                    Matricule: {profile.numeroOrdre}
                  </Badge>
                  <Badge variant="default" className="bg-purple-500">
                    Laborantin(e)
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </div>
                  {currentEstablishment && (
                    <>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {currentEstablishment.establishment_name}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {currentEstablishment.department || 'Laboratoire'}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier profil
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards - Spécifique laboratoire */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Analyses du jour */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                <TestTube className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +8
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                Analyses du jour
              </p>
              <h3 className="text-3xl font-bold text-purple-900 dark:text-purple-100">24</h3>
              <p className="text-xs text-purple-600 dark:text-purple-500 mt-2">
                +8 vs hier
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-purple-200/30 dark:bg-purple-800/20"></div>
        </Card>

        {/* Card 2 - En cours */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                <Beaker className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 gap-1">
                <Clock className="h-3 w-3" />
                En cours
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                En cours
              </p>
              <h3 className="text-3xl font-bold text-blue-900 dark:text-blue-100">7</h3>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                3 prioritaires
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-200/30 dark:bg-blue-800/20"></div>
        </Card>

        {/* Card 3 - À valider */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                Urgent
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-1">
                À valider
              </p>
              <h3 className="text-3xl font-bold text-orange-900 dark:text-orange-100">5</h3>
              <p className="text-xs text-orange-600 dark:text-orange-500 mt-2">
                Résultats prêts
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-orange-200/30 dark:bg-orange-800/20"></div>
        </Card>

        {/* Card 4 - Terminés */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                OK
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                Terminés aujourd'hui
              </p>
              <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">12</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2">
                Transmis
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-emerald-200/30 dark:bg-emerald-800/20"></div>
        </Card>
      </div>

      {/* Analyses en cours */}
      <Card className="border-0 shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Microscope className="h-6 w-6 text-primary" />
              File d'attente des analyses
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="default">{analysesEnCours.length} analyses</Badge>
              <Button size="sm" variant="outline">
                Nouvelle analyse →
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {analysesEnCours.map((analyse) => (
              <div
                key={analyse.id}
                className={`p-4 rounded-xl flex items-center justify-between border-l-4 ${getStatusColor(analyse.status)}`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col">
                    <p className="font-semibold">{analyse.patient}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <TestTube className="h-3 w-3" />
                        {analyse.type}
                      </span>
                      <span className="font-medium">{analyse.test}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Début: {analyse.startTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Fin estimée: {analyse.estimatedEnd}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(analyse.priority)}
                  {getStatusBadge(analyse.status)}
                  <Button variant="outline" size="sm">
                    {analyse.status === 'terminé' ? 'Valider' : 'Continuer'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Actions rapides - Laboratoire */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Actions rapides</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TestTube className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Nouvelle Analyse</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Démarrer</p>
            </button>
            
            <button 
              className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Microscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Examens</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Consulter</p>
            </button>
            
            <button 
              className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Résultats</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Valider</p>
            </button>
            
            <button 
              className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FlaskConical className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">Équipements</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Vérifier</p>
            </button>
          </div>
        </div>
      </Card>

      {/* Tâches du laboratoire */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Tâches du technicien de laboratoire</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TestTube className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold">Analyses</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Réaliser les analyses biologiques, microbiologiques, biochimiques selon les protocoles
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold">Validation</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Contrôler la qualité des résultats, valider les données, transmettre aux médecins
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">Maintenance</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Entretenir les équipements, calibrer les appareils, gérer les stocks de réactifs
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

