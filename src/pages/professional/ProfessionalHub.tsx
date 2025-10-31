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
  Users, Calendar, FileText, Activity, 
  TrendingUp, TrendingDown, ClipboardList, Stethoscope, Building2,
  ArrowUpRight, ArrowDownRight, DollarSign, Pill, Heart, Clock,
  Mail, Phone, MapPin, Award, GraduationCap, BookOpen, 
  Briefcase, Shield, CheckCircle, AlertCircle, Edit
} from 'lucide-react';
import { ROLE_LABELS } from '@/config/menuDefinitions';
import { supabase } from '@/integrations/supabase/client';
import { ReceptionistDashboard } from '@/components/professional/ReceptionistDashboard';
import { NurseDashboard } from '@/components/professional/NurseDashboard';
import { LaborantinDashboard } from '@/components/professional/LaborantinDashboard';
import { PharmacistDashboard } from '@/components/professional/PharmacistDashboard';

export default function ProfessionalHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    establishments,
    currentEstablishment,
    currentRole,
    isLoading
  } = useMultiEstablishment();

  const [professionalData, setProfessionalData] = useState<any>(null);
  const [establishmentsData, setEstablishmentsData] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login/professional');
      return;
    }
    loadProfessionalData();
  }, [user, navigate]);

  const loadProfessionalData = async () => {
    if (!user) return;

    // Charger le profil professionnel
    const { data: profData } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profData) {
      setProfessionalData(profData);
    }

    // Charger les établissements avec stats
    const { data: estData } = await supabase
      .rpc('get_professional_establishments');

    if (estData) {
      setEstablishmentsData(estData);
    }
  };

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

  const fullName = user?.user_metadata?.full_name || professionalData?.full_name || 'Professionnel';
  const activeRole = currentRole || 'doctor';
  
  // Afficher l'interface appropriée selon le rôle
  if (activeRole === 'receptionist') {
    return <ReceptionistDashboard />;
  }
  
  if (activeRole === 'nurse') {
    return <NurseDashboard />;
  }
  
  if (activeRole === 'laborantin') {
    return <LaborantinDashboard />;
  }
  
  if (activeRole === 'pharmacist') {
    return <PharmacistDashboard />;
  }
  
  // Données fictives pour le profil
  const profile = {
    email: user?.email || professionalData?.email || '',
    phone: professionalData?.phone || '+241 07 XX XX XX',
    specialization: professionalData?.specialization || 'Médecine Générale',
    numeroOrdre: professionalData?.numero_ordre || 'DIR-001',
    professionalType: professionalData?.professional_type || 'medecin_generaliste',
    verified: professionalData?.verified || true,
    diplomas: [
      { id: 1, title: 'Doctorat en Médecine', institution: 'Université Omar Bongo', year: '2010', country: 'Gabon' },
      { id: 2, title: 'Spécialisation Médecine Interne', institution: 'CHU Libreville', year: '2014', country: 'Gabon' },
      { id: 3, title: 'Master en Santé Publique', institution: 'Université de Bordeaux', year: '2016', country: 'France' }
    ],
    formations: [
      { id: 1, title: 'Gestion des Urgences Médicales', organisme: 'OMS Afrique', date: '2024-11', duration: '5 jours', certificate: true },
      { id: 2, title: 'Télémédecine et E-Santé', organisme: 'CEMAC Santé', date: '2024-09', duration: '3 jours', certificate: true },
      { id: 3, title: 'Management Hospitalier', organisme: 'ENSP Gabon', date: '2024-06', duration: '10 jours', certificate: true }
    ]
  };

  // RDV du jour (fictifs)
  const appointments = [
    { id: 1, time: '09:00', patient: 'Marie MOUSSAVOU', type: 'Consultation', status: 'confirmed' },
    { id: 2, time: '10:30', patient: 'Jean NZENGUE', type: 'Suivi', status: 'confirmed' },
    { id: 3, time: '14:00', patient: 'Sophie KOMBILA', type: 'Téléconsultation', status: 'pending' },
    { id: 4, time: '15:30', patient: 'Pierre OBAME', type: 'Consultation', status: 'confirmed' },
    { id: 5, time: '16:30', patient: 'André NGUEMA', type: 'Urgence', status: 'pending' }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
      <div className="space-y-6">
        {/* Header avec profil */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/5 via-background to-primary/5 dark:from-primary/10 dark:via-slate-900 dark:to-primary/10">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-lg">
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
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
                      <Stethoscope className="h-3 w-3" />
                      {profile.specialization}
                    </Badge>
                    <Badge variant="secondary">
                      N° Ordre: {profile.numeroOrdre}
                    </Badge>
                    {currentEstablishment && (
                      <Badge variant="default">
                        {ROLE_LABELS[activeRole]}
                      </Badge>
                    )}
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
                          {currentEstablishment.department || 'Direction Médicale'}
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

      {/* Diplômes et Formations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diplômes */}
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                Diplômes
              </h3>
              <Badge variant="outline">{profile.diplomas.length} diplômes</Badge>
            </div>
            
            <div className="space-y-4">
              {profile.diplomas.map((diploma) => (
                <div key={diploma.id} className="p-4 rounded-xl bg-muted/50 border-l-4 border-l-primary">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{diploma.title}</h4>
                    <Badge variant="secondary">{diploma.year}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{diploma.institution}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {diploma.country}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Formations continues */}
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Formations de mise à jour
              </h3>
              <Badge variant="outline">{profile.formations.length} formations</Badge>
            </div>
            
            <div className="space-y-4">
              {profile.formations.map((formation) => (
                <div key={formation.id} className="p-4 rounded-xl bg-muted/50 border-l-4 border-l-emerald-500">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{formation.title}</h4>
                    {formation.certificate && (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                        <Award className="h-3 w-3 mr-1" />
                        Certifié
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{formation.organisme}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(formation.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formation.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Planning du jour */}
      <Card className="border-0 shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Planning du jour
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="default">{appointments.length} RDV</Badge>
              <Button size="sm" variant="outline" onClick={() => navigate('/professional/appointments')}>
                Voir tout →
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
                  <div className="text-center">
                    <div className="text-2xl font-bold">{apt.time.split(':')[0]}</div>
                    <div className="text-xs text-muted-foreground">{apt.time.split(':')[1]}</div>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div>
                    <p className="font-semibold">{apt.patient}</p>
                    <p className="text-sm text-muted-foreground">{apt.type}</p>
                  </div>
                </div>
                <Badge variant={apt.status === 'confirmed' ? 'secondary' : 'default'}>
                  {apt.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Établissements affiliés */}
      <Card className="border-0 shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Mes Établissements
            </h3>
            <Button size="sm" variant="outline" onClick={() => navigate('/professional/join-establishment')}>
              + Rejoindre un établissement
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {establishments && establishments.length > 0 ? (
              establishments.map((est) => (
                <div
                  key={est.staff_id}
                  className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg mb-1">{est.establishment_name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{est.establishment_type}</Badge>
                        <Badge variant="secondary">
                          {ROLE_LABELS[est.role_in_establishment]}
                        </Badge>
                      </div>
                    </div>
                    {est.is_admin && (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800/50">
                      <span className="text-muted-foreground">Département</span>
                      <span className="font-medium">{est.department}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800/50">
                      <span className="text-muted-foreground">Matricule</span>
                      <span className="font-medium">{est.matricule}</span>
                    </div>
                  </div>
                  
                  {/* Stats fictives de l'établissement */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800/50">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">45</div>
                      <div className="text-xs text-muted-foreground">Patients</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800/50">
                      <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">8</div>
                      <div className="text-xs text-muted-foreground">RDV</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800/50">
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">12</div>
                      <div className="text-xs text-muted-foreground">Actes</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-12 text-center bg-muted/20 rounded-xl">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun établissement affilié</p>
                <Button size="sm" variant="outline" className="mt-4" onClick={() => navigate('/professional/join-establishment')}>
                  Rejoindre un établissement
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

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