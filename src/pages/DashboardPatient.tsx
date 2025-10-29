import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Video, Stethoscope, Shield, Activity, Pill, CheckCircle2, FileHeart, AlertCircle, MapPin, ChevronRight, Bell, User, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { patientService, type PatientProfile } from "@/services/patientService";
import { toast } from "sonner";

export default function DashboardPatient() {
  const { user, userRoles, loading, hasAnyRole } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<PatientProfile | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const fullName = profileData?.full_name || (user?.user_metadata as any)?.full_name || user?.email?.split('@')[0] || 'Patient';

  // Garde d'authentification et de rôles
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login/patient');
      return;
    }

    // Rediriger les admins vers leur espace
    const isAdminRole = userRoles.some(r => r === 'admin' || r === 'super_admin');
    if (isAdminRole) {
      navigate('/login/admin');
      return;
    }

    // Rediriger les professionnels vers leur espace
    const professionalRoles = ['doctor', 'medical_staff', 'pharmacy', 'laboratory', 'hospital', 'moderator'];
    const isProfessional = userRoles.some(r => professionalRoles.includes(r as unknown as string));
    if (isProfessional && !userRoles.includes('patient' as unknown as any)) {
      navigate('/professional/select-establishment');
      return;
    }
  }, [user, userRoles, loading, navigate, hasAnyRole]);

  // Charger les données du patient depuis le service
  useEffect(() => {
    const loadPatientData = async () => {
      if (!user?.id) return;
      
      setLoadingData(true);
      try {
        // Charger toutes les données en parallèle
        const [profile, patientStats, patientNotifications] = await Promise.all([
          patientService.getProfile(user.id),
          patientService.getPatientStats(user.id),
          patientService.getNotifications(user.id)
        ]);

        if (profile) {
          setProfileData(profile);
          // TODO: Gérer l'avatar depuis Supabase Storage
        }
        
        if (patientStats) {
          setStats(patientStats);
        }
        
        setNotifications(patientNotifications || []);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement de vos données');
      } finally {
        setLoadingData(false);
      }
    };

    loadPatientData();
  }, [user?.id]);
  
  // Séparer le nom et le prénom
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || 'Patient';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Calculer l'âge à partir de la date de naissance
  const calculateAge = (birthDate: string | null | undefined): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(profileData?.date_of_birth);

  // Traduire le genre
  const getGenderLabel = (gender: string | null): string => {
    if (!gender) return 'Non renseigné';
    switch (gender) {
      case 'male': return 'Masculin';
      case 'female': return 'Féminin';
      case 'other': return 'Autre';
      case 'prefer_not_to_say': return 'Non renseigné';
      default: return 'Non renseigné';
    }
  };

  useEffect(() => {
    // Animation des progress bars au chargement
    setTimeout(() => {
      const progressBar = document.querySelector('.progress-fill');
      if (progressBar) {
        (progressBar as HTMLElement).style.width = '100%';
      }
    }, 100);
  }, []);

  // Afficher un loader pendant le chargement
  if (loadingData) {
    return (
      <PatientDashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de vos données...</p>
        </div>
      </PatientDashboardLayout>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header Card avec dégradé coloré */}
        <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-8 bg-card/80 border border-border shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Photo d'identité */}
            <div className="flex-shrink-0 mx-auto sm:mx-0 relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gradient-to-br from-[#00d4ff] to-[#0088ff] p-1">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Photo de profil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl font-bold text-card-foreground">
                      {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="flex-1 space-y-3 sm:space-y-4">
              {/* Nom complet - Bloc séparé */}
              <div className="bg-muted/30 rounded-xl p-3">
                <p className="text-xl sm:text-2xl font-bold text-foreground uppercase tracking-wide">{lastName}</p>
                <p className="text-base sm:text-xl font-normal text-foreground mt-1">{firstName}</p>
              </div>

              {/* Date de naissance et Sexe - sur la même ligne */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Date de naissance</p>
                  <p className="text-base sm:text-xl font-bold text-foreground">
                    {profileData?.birth_date 
                      ? new Date(profileData.birth_date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      : 'Non renseigné'
                    }
                  </p>
                </div>

                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Sexe</p>
                  <p className="text-base sm:text-xl font-bold text-foreground">
                    {getGenderLabel(profileData?.gender || null)}
                  </p>
                </div>
              </div>

              {/* Actions cartographie */}
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => navigate('/cartography')}
                  className="bg-muted/30 rounded-xl p-3 cursor-pointer hover:bg-muted/50 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#00d4ff] group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Carte des soins</p>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    Voir la carte
                  </p>
                </div>

                <div 
                  onClick={() => navigate('/cartography')}
                  className="bg-muted/30 rounded-xl p-3 cursor-pointer hover:bg-muted/50 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-[#0088ff] group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Recherche avancée</p>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    Trouver un professionnel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations médicales - Bloc séparé */}
        <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-muted/30 rounded-xl p-3">
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Poids</p>
              <p className="text-base sm:text-xl font-bold text-foreground">
                {profileData?.weight_kg ? `${profileData.weight_kg} kg` : '-'}
              </p>
            </div>

            <div className="bg-muted/30 rounded-xl p-3">
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Taille</p>
              <p className="text-base sm:text-xl font-bold text-foreground">
                {profileData?.height_m ? `${profileData.height_m} m` : '-'}
              </p>
            </div>

            <div className="bg-muted/30 rounded-xl p-3">
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Groupe</p>
              <p className="text-base sm:text-xl font-bold text-foreground">
                {profileData?.blood_group || '-'}
              </p>
            </div>

            <div className="bg-muted/30 rounded-xl p-3">
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">N° CNAMGS</p>
              <p className="text-xs sm:text-sm font-bold text-foreground">
                {profileData?.cnamgs_number || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div onClick={() => navigate('/appointments')} className="group rounded-xl backdrop-blur-xl p-3 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-card/80 border border-border hover:bg-card/90 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20 flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-7 sm:h-7 text-[#00d4ff]" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground text-xs sm:text-lg mb-0.5 sm:mb-2">Prendre RDV</h3>
                  <span className="inline-block px-1.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-xs rounded-full bg-[#ff0088]/20 text-[#ff0088]">
                    Disponible aujourd'hui
                  </span>
                </div>
              </div>
              <ChevronRight className="hidden sm:block w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          </div>

          <div onClick={() => navigate('/teleconsultation')} className="group rounded-xl backdrop-blur-xl p-3 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-card/80 border border-border hover:bg-card/90 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20 flex-shrink-0">
                  <Video className="w-4 h-4 sm:w-7 sm:h-7 text-[#00d4ff]" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground text-xs sm:text-lg mb-0.5 sm:mb-2">Téléconsultation</h3>
                  <span className="inline-block px-1.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-xs rounded-full bg-[#ff0088]/20 text-[#ff0088]">
                    Médecins disponibles
                  </span>
                </div>
              </div>
              <ChevronRight className="hidden sm:block w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Prochain RDV */}
          <div className="p-4 sm:p-6 rounded-xl bg-card/80 backdrop-blur-xl border border-border shadow-xl">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Prochain Rendez-vous</p>
                <p className="text-base sm:text-xl font-bold mt-0.5 sm:mt-1 text-card-foreground">
                  {stats?.nextAppointment ? 
                    `${new Date(stats.nextAppointment.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })} - ${stats.nextAppointment.time}` : 
                    'Aucun rendez-vous'}
                </p>
                <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-muted-foreground font-medium">
                  {stats?.nextAppointment ? 
                    `${stats.nextAppointment.doctor_name} - ${stats.nextAppointment.speciality}` : 
                    'Prenez rendez-vous'}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-1">Cabinet Montagne Sainte, Libreville</p>
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20 flex-shrink-0">
                <Stethoscope className="w-5 h-5 sm:w-7 sm:h-7 text-[#00d4ff]" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 bg-muted/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#00d4ff]" />
              <span>3.2 km de votre position</span>
            </div>
          </div>

          {/* Couverture CNAMGS */}
          <div className="p-4 sm:p-6 rounded-xl bg-card/80 backdrop-blur-xl border border-border shadow-xl">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Couverture CNAMGS</p>
                <p className="text-lg sm:text-3xl font-bold mt-1 sm:mt-2 text-card-foreground">
                  {stats?.coveragePercentage || 100}%
                </p>
                <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-muted-foreground font-medium">
                  Statut: {stats?.insuranceStatus === 'active' ? 'Actif' : 'Inactif'}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-1">
                  N° {profileData?.cnamgs_number || 'Non renseigné'}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20 flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-[#00d4ff]" />
              </div>
            </div>
            <div className="h-2 sm:h-2.5 rounded-full overflow-hidden bg-muted/20 mt-3 sm:mt-4">
              <div className="progress-fill h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#00d4ff] to-[#0088ff]" style={{ width: '0%' }} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-orange-500/30 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5 text-orange-500" />
              <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
              <span className="ml-auto bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full text-xs font-bold">
                {notifications.filter(n => !n.read).length}
              </span>
            </div>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className={`p-3 rounded-lg border ${notif.read ? 'border-border bg-muted/20' : 'border-orange-500/30 bg-orange-500/10'}`}>
                  <p className="text-sm font-medium text-foreground">{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Consultations', value: stats?.totalConsultations || '0', icon: Stethoscope, trend: 'Cette année', color: '#00d4ff' },
              { label: 'Ordonnances actives', value: stats?.activePrescriptions || '0', icon: Pill, trend: 'En cours', color: '#0088ff' },
              { label: 'RDV à venir', value: stats?.upcomingAppointments || '0', icon: Calendar, trend: 'Programmés', color: '#ffaa00' },
              { label: 'Analyses', value: stats?.pendingLabResults || '0', icon: Activity, trend: 'En attente', color: '#ff0088' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                    <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: stat.color }} />
                  </div>
                  <p className="text-[10px] sm:text-xs mb-1 text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-base sm:text-2xl font-bold text-foreground mb-0.5">{stat.value}</p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground">{stat.trend}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rappels & Dossier Médical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Rappels importants */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">
              Rappels Importants
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {[
                { time: 'Aujourd\'hui', event: 'Prendre médicament à 14h', location: 'Traitement en cours', icon: Pill, color: '#00d4ff' },
                { time: 'Dans 3 jours', event: 'Résultats d\'analyses disponibles', location: 'Laboratoire BIOLAB', icon: Activity, color: '#0088ff' },
                { time: 'Cette semaine', event: 'Ordonnance à renouveler', location: 'Pharmacie de la Grâce', icon: Pill, color: '#ffaa00' },
                { time: 'Urgent', event: 'Vaccin tétanos recommandé', location: 'Tout centre de vaccination', icon: AlertCircle, color: '#ff0088' }
              ].map((reminder, idx) => {
                const Icon = reminder.icon;
                return (
                  <div key={idx} className="p-2.5 sm:p-5 rounded-xl hover:scale-[1.02] transition-all cursor-pointer bg-card/80 hover:bg-card/90 border border-border shadow-xl backdrop-blur-xl">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${reminder.color}20` }}>
                          <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: reminder.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5">{reminder.time}</p>
                          <p className="text-xs sm:text-sm font-semibold text-card-foreground leading-tight line-clamp-2">{reminder.event}</p>
                        </div>
                      </div>
                      <p className="text-[9px] sm:text-xs text-muted-foreground/70 ml-10 sm:ml-0 truncate">
                        {reminder.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dossier Médical Récent */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">
              Dossier Médical Récent
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {[
                { title: 'Dernière consultation', date: '28 Sept 2025', type: 'Cardiologie', icon: FileHeart, color: '#00d4ff' },
                { title: 'Dernière ordonnance', date: '28 Sept 2025', type: '3 médicaments', icon: Pill, color: '#ffaa00' },
                { title: 'Dernière analyse', date: '15 Sept 2025', type: 'Bilan sanguin', icon: Activity, color: '#0088ff' }
              ].map((doc, idx) => {
                const Icon = doc.icon;
                return (
                  <div key={idx} className="p-2.5 sm:p-5 rounded-xl hover:scale-[1.02] transition-all cursor-pointer bg-card/80 hover:bg-card/90 border border-border shadow-xl backdrop-blur-xl">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${doc.color}20` }}>
                          <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: doc.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-card-foreground leading-tight line-clamp-2 mb-0.5">{doc.title}</p>
                        </div>
                      </div>
                      <div className="ml-10 sm:ml-0 space-y-0.5">
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{doc.date}</p>
                        <p className="text-[9px] sm:text-xs text-muted-foreground/70 truncate">{doc.type}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PatientDashboardLayout>
  );
}
