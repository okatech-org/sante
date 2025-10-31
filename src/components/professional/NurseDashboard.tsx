import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Users, Activity, Heart, Clock,
  Mail, Phone, MapPin, CheckCircle, AlertCircle, Edit,
  Building2, Briefcase, ArrowUpRight, Plus, Stethoscope,
  ClipboardList, Syringe, Thermometer, Droplets
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function NurseDashboard() {
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

  const fullName = user?.user_metadata?.full_name || professionalData?.full_name || 'Infirmier(e)';
  
  const profile = {
    email: user?.email || professionalData?.email || '',
    phone: professionalData?.phone || '+241 07 XX XX XX',
    numeroOrdre: professionalData?.license_number || 'INF-XXX',
    verified: professionalData?.is_verified || true,
  };

  // Patients en soins
  const patientsEnSoins = [
    { id: 1, name: 'Marie MOUSSAVOU', room: 'Ch. 201', status: 'stable', lastVitals: '09:00', nextCare: '12:00', priority: 'normal' },
    { id: 2, name: 'Jean NZENGUE', room: 'Ch. 203', status: 'surveillance', lastVitals: '09:30', nextCare: '10:30', priority: 'high' },
    { id: 3, name: 'Sophie KOMBILA', room: 'Ch. 205', status: 'stable', lastVitals: '08:45', nextCare: '14:00', priority: 'normal' },
    { id: 4, name: 'Pierre OBAME', room: 'Ch. 207', status: 'critique', lastVitals: '10:00', nextCare: '11:00', priority: 'urgent' },
    { id: 5, name: 'André NGUEMA', room: 'Ch. 209', status: 'stable', lastVitals: '09:15', nextCare: '15:00', priority: 'normal' }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-emerald-50 dark:bg-emerald-950/30 border-l-emerald-500';
      case 'surveillance': return 'bg-blue-50 dark:bg-blue-950/30 border-l-blue-500';
      case 'critique': return 'bg-red-50 dark:bg-red-950/30 border-l-red-500';
      default: return 'bg-gray-50 dark:bg-gray-950/30 border-l-gray-500';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50">Priorité</Badge>;
      default: return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec profil infirmier */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-pink-50 via-background to-rose-50 dark:from-pink-900/20 dark:via-slate-900 dark:to-rose-900/20">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-lg">
                <AvatarFallback className="text-2xl font-bold bg-pink-500 text-white">
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
                    <Heart className="h-3 w-3" />
                    Aide Soignant(e) / Infirmier(e)
                  </Badge>
                  <Badge variant="secondary">
                    Matricule: {profile.numeroOrdre}
                  </Badge>
                  <Badge variant="default" className="bg-pink-500">
                    Personnel Soignant
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
                        {currentEstablishment.department || 'Soins Généraux'}
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

      {/* Stats Cards - Spécifique infirmier */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Patients sous soins */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +5
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                Patients sous soins
              </p>
              <h3 className="text-3xl font-bold text-blue-900 dark:text-blue-100">15</h3>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                5 en surveillance
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-200/30 dark:bg-blue-800/20"></div>
        </Card>

        {/* Card 2 - Soins du jour */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center">
                <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300 gap-1">
                <Clock className="h-3 w-3" />
                12 restants
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-pink-700 dark:text-pink-400 mb-1">
                Soins du jour
              </p>
              <h3 className="text-3xl font-bold text-pink-900 dark:text-pink-100">24</h3>
              <p className="text-xs text-pink-600 dark:text-pink-500 mt-2">
                12 complétés
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-pink-200/30 dark:bg-pink-800/20"></div>
        </Card>

        {/* Card 3 - Contrôles vitaux */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                À jour
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                Contrôles vitaux
              </p>
              <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">18</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2">
                Aujourd'hui
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-emerald-200/30 dark:bg-emerald-800/20"></div>
        </Card>

        {/* Card 4 - Alertes */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                Urgent
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-1">
                Alertes actives
              </p>
              <h3 className="text-3xl font-bold text-orange-900 dark:text-orange-100">3</h3>
              <p className="text-xs text-orange-600 dark:text-orange-500 mt-2">
                À traiter
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-orange-200/30 dark:bg-orange-800/20"></div>
        </Card>
      </div>

      {/* Patients sous soins */}
      <Card className="border-0 shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Patients sous mes soins
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="default">{patientsEnSoins.length} patients</Badge>
              <Button size="sm" variant="outline" onClick={() => navigate('/professional/patients')}>
                Voir tout →
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {patientsEnSoins.map((patient) => (
              <div
                key={patient.id}
                className={`p-4 rounded-xl flex items-center justify-between border-l-4 ${getStatusColor(patient.status)}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <p className="font-semibold">{patient.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {patient.room}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Dernier contrôle: {patient.lastVitals}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Prochain soin: {patient.nextCare}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(patient.priority)}
                  <Badge variant="outline" className="capitalize">
                    {patient.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-1" />
                    Contrôle
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Actions rapides - Infirmier */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Actions rapides</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/professional/patients')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Contrôle Vital</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Prendre</p>
            </button>
            
            <button 
              onClick={() => navigate('/professional/patients')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Syringe className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <p className="text-sm font-semibold text-pink-900 dark:text-pink-100">Administrer</p>
              <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">Médicament</p>
            </button>
            
            <button 
              onClick={() => navigate('/professional/patients')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ClipboardList className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Rapport</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Saisir</p>
            </button>
            
            <button 
              onClick={() => navigate('/professional/patients')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Thermometer className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">Température</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Mesurer</p>
            </button>
          </div>
        </div>
      </Card>

      {/* Tâches du personnel soignant */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Tâches du personnel soignant</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-5 w-5 text-pink-600" />
                <h4 className="font-semibold">Soins aux patients</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Assurer les soins quotidiens, surveiller l'état des patients, administrer les traitements
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">Contrôles vitaux</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Prendre tension, température, pouls, saturation, glycémie selon prescriptions
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold">Coordination médicale</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Collaborer avec médecins, transmettre observations, alerter sur changements d'état
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

