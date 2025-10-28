import { DemoDashboardLayout } from "@/components/layout/DemoDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Users, FileText, Activity, Clock, TrendingUp, Video, MapPin,
  Phone, Mail, CreditCard, AlertCircle, CheckCircle, XCircle, Plus,
  Stethoscope, Pill, ClipboardList, LineChart, Settings, Bell, Building2, Edit, ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppointmentModal } from "@/components/professional/AppointmentModal";
import { PrescriptionModal } from "@/components/professional/PrescriptionModal";
import { PatientListModal } from "@/components/professional/PatientListModal";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { useProfessionalStats } from "@/hooks/useProfessionalStats";
import { supabase } from "@/integrations/supabase/client";
import { CNAMGSVerificationCard } from "@/components/professional/CNAMGSVerificationCard";
import { CNOMVerificationCard } from "@/components/professional/CNOMVerificationCard";

export default function DemoDoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showPatientListModal, setShowPatientListModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | undefined>();
  const [profileData, setProfileData] = useState<{
    full_name: string;
    professional_type?: string;
    numero_ordre?: string;
  } | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [establishmentCount, setEstablishmentCount] = useState<number>(0);
  
  const fullName = profileData?.full_name || 'Dr. Pierre KOMBILA';
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
            .maybeSingle();
            
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

  const todayAppointments = [
    {
      id: 1,
      patient: { name: "Marie OKOME", age: 34, cnamgs: "GAB123456789" },
      time: "09:00",
      type: "Consultation générale",
      status: "confirmé",
      paymentMode: "CNAMGS",
      reason: "Suivi diabète type 2",
      urgent: false
    },
    {
      id: 2,
      patient: { name: "Jean MBADINGA", age: 58, cnamgs: "GAB987654321" },
      time: "09:30",
      type: "Suivi post-opératoire",
      status: "en_attente",
      paymentMode: "CNAMGS",
      reason: "Contrôle après chirurgie",
      urgent: true
    },
    {
      id: 3,
      patient: { name: "Sophie NGUEMA", age: 42, cnamgs: null },
      time: "10:15",
      type: "Téléconsultation",
      status: "confirmé",
      paymentMode: "Espèces",
      reason: "Douleurs abdominales",
      urgent: false
    },
    {
      id: 4,
      patient: { name: "Pierre ONDO", age: 29, cnamgs: null },
      time: "11:00",
      type: "Certificat médical",
      status: "confirmé",
      paymentMode: "Mobile Money",
      reason: "Certificat pour emploi",
      urgent: false
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "prescription",
      action: "Prescription envoyée",
      patient: "Alice MOUSSAVOU",
      time: "Il y a 15 min",
      icon: Pill,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "consultation",
      action: "Consultation terminée",
      patient: "Marc KOMBILA",
      time: "Il y a 1h",
      icon: Stethoscope,
      color: "text-blue-600"
    },
    {
      id: 3,
      type: "appointment",
      action: "RDV programmé",
      patient: "Claire IBINGA",
      time: "Il y a 2h",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      id: 4,
      type: "result",
      action: "Résultat labo reçu",
      patient: "Daniel OVONO",
      time: "Il y a 3h",
      icon: ClipboardList,
      color: "text-orange-600"
    },
  ];

  const financialSummary = {
    today: {
      total: 240000,
      cash: 72000,
      cnamgs: 144000,
      mobileMoney: 24000
    },
    month: {
      total: 4800000,
      consultations: 248,
      average: 19355
    },
    pending: {
      cnamgs: 340000,
      patients: 85000
    }
  };

  const alerts = [
    {
      id: 1,
      type: "urgent",
      message: "Patient en salle d'attente depuis 25 min",
      patient: "Jean MBADINGA",
      action: "Voir patient"
    },
    {
      id: 2,
      type: "warning",
      message: "Résultats labo en attente de validation",
      patient: "Marie OKOME",
      action: "Valider"
    },
    {
      id: 3,
      type: "info",
      message: "Rappel: Formation télémédecine demain 14h",
      action: "Détails"
    }
  ];

  return (
    <DemoDashboardLayout demoType="doctor">
      <div className="flex flex-col space-y-6">
        {/* Header Card avec profil professionnel */}
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
              {/* Nom complet */}
              <div className="bg-muted/30 rounded-xl p-3">
                <p className="text-xl sm:text-2xl font-bold text-foreground uppercase tracking-wide">{lastName}</p>
                <p className="text-base sm:text-xl font-normal text-foreground mt-1">{firstName}</p>
              </div>

              {/* Type professionnel et Spécialité */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Profession</p>
                  <p className="text-base sm:text-xl font-bold text-foreground">
                    {profileData?.professional_type || 'medecin_specialiste'}
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
                  {profileData?.numero_ordre || 'GA-MED-2010-567'}
                </p>
              </div>
            </div>
          </div>

          {/* Emplacement */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Cabinet Montagne Sainte, Libreville
            </p>
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

        {/* Actions rapides */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            3 nouvelles
          </Button>
          <Button onClick={() => setShowAppointmentModal(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>

        {/* Alertes urgentes */}
        {alerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${
                alert.type === 'urgent' ? 'border-l-red-500 bg-red-50/50' :
                alert.type === 'warning' ? 'border-l-orange-500 bg-orange-50/50' :
                'border-l-blue-500 bg-blue-50/50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      {alert.patient && (
                        <p className="text-xs text-muted-foreground mt-1">{alert.patient}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      {alert.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Grid - Stats réelles depuis la DB */}
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

        {/* Main Content */}
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="financial">Finances</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          {/* Tab: Aujourd'hui */}
          <TabsContent value="today" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rendez-vous du jour */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Rendez-vous aujourd'hui
                    </span>
                    <Badge variant="secondary">{todayAppointments.length} patients</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                      apt.urgent ? 'border-red-300 bg-red-50/50' : 'bg-background/50'
                    }`}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-center min-w-[60px]">
                          <div className="text-lg font-bold">{apt.time}</div>
                          <div className="text-xs flex items-center justify-center gap-1">
                            {apt.status === "confirmé" ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <Clock className="h-3 w-3 text-orange-600" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {apt.patient.name}
                            {apt.urgent && (
                              <Badge variant="destructive" className="text-xs">Urgent</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{apt.type}</div>
                          <div className="text-xs text-muted-foreground mt-1">{apt.reason}</div>
                          <div className="flex items-center gap-2 mt-2">
                            {apt.patient.cnamgs && (
                              <Badge variant="outline" className="text-xs">
                                <CreditCard className="h-3 w-3 mr-1" />
                                CNAMGS
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {apt.paymentMode}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Dossier
                        </Button>
                        <Button size="sm">
                          Commencer
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Activité récente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className={`rounded-full p-2 ${activity.color.replace('text-', 'bg-')}/10`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.patient}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Patients */}
          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mes patients</span>
                  <Button onClick={() => setShowPatientListModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau patient
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gestion complète de vos patients avec dossiers médicaux, historique et suivi
                </p>
              </CardContent>
            </Card>

            {/* CNAMGS & CNOM Verification Cards */}
            {professionalId && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <CNAMGSVerificationCard professionalId={professionalId} />
                <CNOMVerificationCard professionalId={professionalId} />
              </div>
            )}

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
              <Button className="w-full" onClick={() => setShowPrescriptionModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer une ordonnance
              </Button>
            </div>
          </TabsContent>

          {/* Tab: Finances */}
          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Revenus aujourd'hui</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{financialSummary.today.total.toLocaleString()} FCFA</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Espèces</span>
                      <span className="font-medium">{financialSummary.today.cash.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CNAMGS</span>
                      <span className="font-medium">{financialSummary.today.cnamgs.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Mobile Money</span>
                      <span className="font-medium">{financialSummary.today.mobileMoney.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Revenus ce mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{financialSummary.month.total.toLocaleString()} FCFA</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Consultations</span>
                      <span className="font-medium">{financialSummary.month.consultations}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Moyenne/consultation</span>
                      <span className="font-medium">{financialSummary.month.average.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">En attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Remboursement CNAMGS</p>
                      <p className="text-xl font-bold">{financialSummary.pending.cnamgs.toLocaleString()} FCFA</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Paiements patients</p>
                      <p className="text-xl font-bold">{financialSummary.pending.patients.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Statistiques */}
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Statistiques détaillées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Graphiques et analyses de votre activité médicale
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 p-4"
                onClick={() => setShowPrescriptionModal(true)}
              >
                <Pill className="h-6 w-6" />
                <span className="text-sm">Ordonnance</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Video className="h-6 w-6" />
                <span className="text-sm">Téléconsultation</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 p-4"
                onClick={() => setShowPatientListModal(true)}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Patients</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <ClipboardList className="h-6 w-6" />
                <span className="text-sm">Résultats</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Stats</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Paramètres</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AppointmentModal 
        open={showAppointmentModal} 
        onOpenChange={setShowAppointmentModal}
      />
      <PrescriptionModal 
        open={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
      />
      <PatientListModal 
        open={showPatientListModal}
        onClose={() => setShowPatientListModal(false)}
      />
    </DemoDashboardLayout>
  );
}
