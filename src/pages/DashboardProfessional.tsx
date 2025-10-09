import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Video, Stethoscope, Users, Activity, DollarSign, MessageSquare, ChevronRight, Edit, Plus, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { useProfessionalStats } from "@/hooks/useProfessionalStats";

export default function DashboardProfessional() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | undefined>();
  const [profileData, setProfileData] = useState<{
    full_name: string;
    professional_type?: string;
    numero_ordre?: string;
  } | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [establishmentCount, setEstablishmentCount] = useState<number>(0);
  
  const fullName = profileData?.full_name || (user?.user_metadata as any)?.full_name || 'Dr. Pierre KOMBILA';
  const { stats, loading } = useProfessionalStats(professionalId);

  // Charger le profil depuis la base de données
  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        // Charger le profil de base
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        // Charger les infos professionnelles
        const { data: professional } = await supabase
          .from('professionals')
          .select('id, professional_type, numero_ordre')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          setProfileData({
            full_name: profile.full_name,
            professional_type: professional?.professional_type,
            numero_ordre: professional?.numero_ordre,
          });
          if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
        }
        
        if (professional?.id) {
          setProfessionalId(professional.id);
          loadUpcomingAppointments(professional.id);
          
          // Charger le nombre d'établissements
          const { data: profileData } = await supabase
            .from('professional_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
            
          if (profileData) {
            const { count } = await supabase
              .from('establishment_staff')
              .select('*', { count: 'exact', head: true })
              .eq('professional_id', profileData.id)
              .eq('status', 'active');
            
            setEstablishmentCount(count || 0);
          }
        }
      }
    };
    loadProfile();
  }, [user?.id]);

  const loadUpcomingAppointments = async (profId: string) => {
    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey(full_name)
      `)
      .eq('professional_id', profId)
      .gte('appointment_date', new Date().toISOString())
      .order('appointment_date', { ascending: true })
      .limit(3);

    if (data) setUpcomingAppointments(data);
  };

  // Séparer le nom et le prénom
  const nameParts = fullName.split(' ');
  const firstName = nameParts.slice(0, -1).join(' ') || 'Pierre';
  const lastName = nameParts[nameParts.length - 1] || 'KOMBILA';

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Carte Multi-Établissements */}
        <Card 
          onClick={() => navigate('/professional/select-establishment')} 
          className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20"
        >
          <div className="p-4 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Multi-Établissements</h3>
                <p className="text-sm text-muted-foreground">Vous intervenez dans plusieurs établissements</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10">2 établissements</Badge>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </Card>

        {/* Header Card avec dégradé coloré */}
        <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-8 bg-card/80 border border-border shadow-2xl relative">
          {/* Bouton Modifier en haut à droite */}
          <Button
            onClick={() => navigate('/professional/settings')}
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Button>

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
              <AvatarUpload
                currentAvatarUrl={avatarUrl || undefined}
                onAvatarUpdate={setAvatarUrl}
              />
            </div>

            {/* Informations professionnelles */}
            <div className="flex-1 space-y-3 sm:space-y-4">
              {/* Nom complet - Bloc séparé */}
              <div className="bg-muted/30 rounded-xl p-3">
                <p className="text-xl sm:text-2xl font-bold text-foreground uppercase tracking-wide">{lastName}</p>
                <p className="text-base sm:text-xl font-normal text-foreground mt-1">{firstName}</p>
              </div>

              {/* Type professionnel et Numéro d'ordre */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Profession</p>
                  <p className="text-base sm:text-xl font-bold text-foreground">
                    {profileData?.professional_type || 'Médecin'}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Spécialité</p>
                  <p className="text-base sm:text-xl font-bold text-foreground">
                    Cardiologie
                  </p>
                </div>
              </div>

              {/* Numéro d'ordre */}
              <div className="bg-muted/30 rounded-xl p-3">
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Numéro d'ordre</p>
                <p className="text-base sm:text-xl font-bold text-foreground font-mono">
                  {profileData?.numero_ordre || 'Non renseigné'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sélecteur d'établissements - Visible si plusieurs établissements */}
        {establishmentCount > 1 && (
          <div 
            onClick={() => navigate('/professional/select-establishment')}
            className="rounded-xl backdrop-blur-xl p-4 bg-gradient-to-r from-primary to-purple-600 cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-xl border border-primary/20"
          >
            <div className="flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Multi-Établissements</h3>
                  <p className="text-xs sm:text-sm opacity-90">Vous intervenez dans {establishmentCount} établissements</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 opacity-80" />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Patients', value: loading ? '...' : stats.month.patients, icon: Users, trend: 'Ce mois', color: '#00d4ff' },
              { label: 'Consultations', value: loading ? '...' : stats.month.consultations, icon: Stethoscope, trend: 'Ce mois', color: '#0088ff' },
              { label: 'Téléconsultations', value: loading ? '...' : stats.today.teleconsultations, icon: Video, trend: "Aujourd'hui", color: '#ffaa00' },
              { label: 'RDV Aujourd\'hui', value: loading ? '...' : stats.today.appointments, icon: Calendar, trend: 'En cours', color: '#ff0088' }
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div onClick={() => navigate('/professional/agenda')} className="group rounded-xl backdrop-blur-xl p-3 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-card/80 border border-border hover:bg-card/90 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20 flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-7 sm:h-7 text-[#00d4ff]" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground text-xs sm:text-lg mb-0.5 sm:mb-2">Mon Agenda</h3>
                  <span className="inline-block px-1.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-xs rounded-full bg-[#ff0088]/20 text-[#ff0088]">
                    8 RDV aujourd'hui
                  </span>
                </div>
              </div>
              <ChevronRight className="hidden sm:block w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          </div>

          <div onClick={() => navigate('/professional/patients')} className="group rounded-xl backdrop-blur-xl p-3 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-card/80 border border-border hover:bg-card/90 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20 flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-7 sm:h-7 text-[#00d4ff]" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground text-xs sm:text-lg mb-0.5 sm:mb-2">Mes Patients</h3>
                  <span className="inline-block px-1.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-xs rounded-full bg-[#ff0088]/20 text-[#ff0088]">
                    89 patients actifs
                  </span>
                </div>
              </div>
              <ChevronRight className="hidden sm:block w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* CNAMGS & CNOM Verification Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Conventionnement CNAMGS</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge variant="default">Conventionné</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">N° Convention</span>
                <span className="text-sm font-mono">CONV-2024-001</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tiers-payant</span>
                <Badge variant="outline" className="text-green-600">Actif</Badge>
              </div>
              <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/professional/settings')}>
                Voir détails
              </Button>
            </div>
          </div>

          <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Vérification CNOM</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge variant="default">Vérifié</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">N° Ordre</span>
                <span className="text-sm font-mono">{profileData?.numero_ordre || 'Non renseigné'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Spécialité</span>
                <span className="text-sm">Cardiologie</span>
              </div>
              <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/professional/settings')}>
                Voir détails
              </Button>
            </div>
          </div>
        </div>

        {/* Prescriptions Électroniques */}
        <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Prescriptions Électroniques</h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/professional/prescriptions')}>
              Voir tout
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-foreground">89</p>
              <p className="text-xs text-muted-foreground">Actives</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-foreground">45</p>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-foreground">78%</p>
              <p className="text-xs text-muted-foreground">CNAMGS</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => navigate('/professional/prescriptions')}>
            <Plus className="mr-2 h-4 w-4" />
            Créer une ordonnance
          </Button>
        </div>

        {/* Prochains RDV & Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Prochains RDV */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">
              Prochains Rendez-vous
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun rendez-vous à venir</p>
                </div>
              ) : (
                upcomingAppointments.map((rdv) => {
                  const appointmentDate = new Date(rdv.appointment_date);
                  const typeColors: Record<string, string> = {
                    'consultation': '#00d4ff',
                    'teleconsultation': '#0088ff',
                    'suivi': '#ffaa00',
                    'urgence': '#ff0088'
                  };
                  const typeIcons: Record<string, any> = {
                    'consultation': Stethoscope,
                    'teleconsultation': Video,
                    'suivi': Activity,
                    'urgence': Activity
                  };
                  const Icon = typeIcons[rdv.type] || Stethoscope;
                  const color = typeColors[rdv.type] || '#00d4ff';
                  
                  return (
                    <div key={rdv.id} className="p-2.5 sm:p-5 rounded-xl hover:scale-[1.02] transition-all cursor-pointer bg-card/80 hover:bg-card/90 border border-border shadow-xl backdrop-blur-xl">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
                            <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5">
                              {appointmentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-card-foreground leading-tight">
                              {rdv.patient?.full_name || 'Patient'}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground capitalize">{rdv.type}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Messages récents */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">
              Messages Récents
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {[
                { patient: 'Marie MOUSSAVOU', message: 'Demande de report de RDV', time: 'Il y a 2h', unread: true },
                { patient: 'Jean NZENGUE', message: 'Question sur l\'ordonnance', time: 'Il y a 5h', unread: true },
                { patient: 'Claire OBAME', message: 'Remerciements', time: 'Hier', unread: false }
              ].map((msg, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate('/professional/messages')}
                  className="p-2.5 sm:p-5 rounded-xl hover:scale-[1.02] transition-all cursor-pointer bg-card/80 hover:bg-card/90 border border-border shadow-xl backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs sm:text-sm font-semibold text-card-foreground">{msg.patient}</p>
                        {msg.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#ff0088]"></span>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{msg.message}</p>
                      <p className="text-[9px] sm:text-xs text-muted-foreground/70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PatientDashboardLayout>
  );
}
