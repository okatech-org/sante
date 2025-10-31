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
  Users, Calendar, Phone, Clock,
  Mail, MapPin, CheckCircle, AlertCircle, Edit,
  Building2, Briefcase, ArrowUpRight, Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function ReceptionistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentEstablishment } = useMultiEstablishment();

  const [professionalData, setProfessionalData] = useState<any>(null);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);

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

  const fullName = user?.user_metadata?.full_name || professionalData?.full_name || 'Réceptionniste';
  
  const profile = {
    email: user?.email || professionalData?.email || '',
    phone: professionalData?.phone || '+241 07 XX XX XX',
    numeroOrdre: professionalData?.license_number || 'REC-002',
    verified: professionalData?.is_verified || true,
  };

  // RDV du jour
  const appointments = [
    { id: 1, time: '09:00', patient: 'Marie MOUSSAVOU', type: 'Consultation', status: 'confirmed', doctor: 'Dr. OKEMBA' },
    { id: 2, time: '10:30', patient: 'Jean NZENGUE', type: 'Suivi', status: 'confirmed', doctor: 'Dr. NGUEMA' },
    { id: 3, time: '14:00', patient: 'Sophie KOMBILA', type: 'Consultation', status: 'pending', doctor: 'Dr. MBINA' },
    { id: 4, time: '15:30', patient: 'Pierre OBAME', type: 'Consultation', status: 'confirmed', doctor: 'Dr. MEZUI' },
    { id: 5, time: '16:30', patient: 'André NGUEMA', type: 'Urgence', status: 'pending', doctor: 'Dr. NGUEMA' }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header avec profil réceptionniste */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-cyan-50 via-background to-cyan-50 dark:from-cyan-900/20 dark:via-slate-900 dark:to-cyan-900/20">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-lg">
                <AvatarFallback className="text-2xl font-bold bg-cyan-500 text-white">
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
                    <Users className="h-3 w-3" />
                    Réception et Accueil
                  </Badge>
                  <Badge variant="secondary">
                    Matricule: {profile.numeroOrdre}
                  </Badge>
                  <Badge variant="default" className="bg-cyan-500">
                    Réceptionniste
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
                        {currentEstablishment.department || 'Administration'}
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

      {/* Stats Cards - Spécifique réceptionniste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Patients aujourd'hui */}
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

        {/* Card 3 - En attente */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                Urgent
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-1">
                En attente
              </p>
              <h3 className="text-3xl font-bold text-orange-900 dark:text-orange-100">2</h3>
              <p className="text-xs text-orange-600 dark:text-orange-500 mt-2">
                À confirmer
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-orange-200/30 dark:bg-orange-800/20"></div>
        </Card>

        {/* Card 4 - Patients enregistrés */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                OK
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                Enregistrements
              </p>
              <h3 className="text-3xl font-bold text-purple-900 dark:text-purple-100">15</h3>
              <p className="text-xs text-purple-600 dark:text-purple-500 mt-2">
                Ce matin
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-purple-200/30 dark:bg-purple-800/20"></div>
        </Card>
      </div>

      {/* Planning du jour - Vue réceptionniste */}
      <Card className="border-0 shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Planning du jour - Tous les rendez-vous
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="default">{appointments.length} RDV</Badge>
              <Button size="sm" className="gap-1" onClick={() => navigate('/professional/appointments')}>
                <Plus className="h-4 w-4" />
                Nouveau RDV
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className={`p-4 rounded-xl flex items-center justify-between ${
                  apt.status === 'confirmed' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-l-emerald-500' 
                    : 'bg-orange-50 dark:bg-orange-950/30 border-l-4 border-l-orange-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold">{apt.time.split(':')[0]}</div>
                    <div className="text-xs text-muted-foreground">{apt.time.split(':')[1]}</div>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div>
                    <p className="font-semibold">{apt.patient}</p>
                    <p className="text-sm text-muted-foreground">{apt.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">Avec {apt.doctor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={apt.status === 'confirmed' ? 'secondary' : 'default'}>
                    {apt.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Actions rapides - Réceptionniste */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Actions rapides</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/professional/appointments/new')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Nouveau RDV</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Planifier</p>
            </button>
            
            <button 
              onClick={() => navigate('/professional/patients')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Patients</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Rechercher</p>
            </button>
            
            <button 
              onClick={() => navigate('/professional/appointments')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">Planning</p>
              <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">Gérer</p>
            </button>
            
            <button 
              onClick={() => navigate('/professional/consultations')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">Consultations</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Voir</p>
            </button>
          </div>
        </div>
      </Card>

      {/* Instructions pour la réception */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Tâches de la réception</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold">Accueil</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Accueillir les patients, vérifier les identités, orienter vers les services
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">Rendez-vous</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Créer, modifier, annuler les rendez-vous selon les disponibilités
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold">Coordination</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Coordonner avec les médecins, gérer les urgences, informer les patients
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

