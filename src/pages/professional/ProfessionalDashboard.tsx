import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import {
  Calendar,
  Users,
  Activity,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Plus,
  Eye,
  FileText,
  Video,
  Stethoscope,
  Building2,
  Shield,
  Settings
} from 'lucide-react';

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    currentEstablishment,
    establishments,
    isDirector,
    isAdmin,
    hasPermission
  } = useMultiEstablishment();

  const [stats, setStats] = useState({
    todayAppointments: 0,
    weekAppointments: 0,
    totalPatients: 0,
    pendingPrescriptions: 0
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentEstablishment) {
      loadDashboardData();
    }
  }, [currentEstablishment]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Charger les statistiques
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() + 7);

      // Récupérer le professional_id
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (professional) {
        // Statistiques des rendez-vous
        const { count: todayCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('professional_id', professional.id)
          .gte('appointment_date', today.toISOString())
          .lt('appointment_date', new Date(today.getTime() + 86400000).toISOString()) as any;

        const { count: weekCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('professional_id', professional.id)
          .gte('appointment_date', today.toISOString())
          .lt('appointment_date', weekEnd.toISOString()) as any;

        // Nombre total de patients
        const { count: patientCount } = await supabase
          .from('appointments')
          .select('patient_id', { count: 'exact', head: true })
          .eq('professional_id', professional.id) as any;

        // Prochains rendez-vous
        const { data: appointments } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:profiles!appointments_patient_id_fkey(full_name, avatar_url)
          `)
          .eq('professional_id', professional.id)
          .gte('appointment_date', today.toISOString())
          .order('appointment_date', { ascending: true })
          .limit(5) as any;

        setStats({
          todayAppointments: todayCount || 0,
          weekAppointments: weekCount || 0,
          totalPatients: patientCount || 0,
          pendingPrescriptions: 0
        });

        setUpcomingAppointments(appointments || []);
      }

      // Activités récentes (simulées pour l'instant)
      setRecentActivities([
        {
          id: 1,
          type: 'appointment',
          message: 'Nouveau RDV avec Marie MOUSSAVOU',
          time: 'Il y a 2 heures',
          status: 'new'
        },
        {
          id: 2,
          type: 'prescription',
          message: 'Ordonnance validée pour Jean NZENGUE',
          time: 'Il y a 3 heures',
          status: 'success'
        },
        {
          id: 3,
          type: 'consultation',
          message: 'Consultation terminée avec Pierre OBAME',
          time: 'Il y a 5 heures',
          status: 'completed'
        }
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'completed': return 'text-gray-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return AlertCircle;
      case 'success': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  // Fonction pour formater le rôle
  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'director': 'Directeur',
      'admin': 'Administrateur',
      'doctor': 'Médecin',
      'nurse': 'Infirmier(e)',
      'pharmacist': 'Pharmacien(ne)',
      'laborantin': 'Laborantin(e)',
      'receptionist': 'Réceptionniste'
    };
    return labels[role] || role;
  };

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Header avec informations de contexte */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Tableau de bord
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {currentEstablishment?.establishment.name}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <Badge variant="outline">
                {getRoleLabel(currentEstablishment?.role || '')}
              </Badge>
              {currentEstablishment?.department && (
                <>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {currentEstablishment.department}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex gap-2">
            {currentEstablishment?.establishmentId === 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' && isDirector && (
              <Button 
                variant="default"
                onClick={() => navigate('/establishments/sogara/admin')}
              >
                <Shield className="h-4 w-4 mr-2" />
                Dashboard SOGARA
              </Button>
            )}
            {establishments.length > 1 && (
              <Button 
                variant="outline"
                onClick={() => navigate('/professional/select-establishment')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Changer
              </Button>
            )}
            {hasPermission('add_appointment') && (
              <Button onClick={() => navigate('/professional/appointments/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau RDV
              </Button>
            )}
          </div>
        </div>

        {/* Badges spéciaux */}
        <div className="flex flex-wrap gap-2">
          {isDirector && (
            <Badge variant="default" className="gap-1">
              <Shield className="h-3 w-3" />
              Direction
            </Badge>
          )}
          {isAdmin && !isDirector && (
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              Administration
            </Badge>
          )}
          {currentEstablishment?.isDepartmentHead && currentEstablishment?.department && (
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              Chef de Service
            </Badge>
          )}
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">RDV Aujourd'hui</p>
                <p className="text-2xl font-bold">{stats.todayAppointments}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              <span>+12% vs hier</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">RDV Cette semaine</p>
                <p className="text-2xl font-bold">{stats.weekAppointments}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <Activity className="h-3 w-3 mr-1" />
              <span>Planning à jour</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{stats.totalPatients}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              <span>+5 cette semaine</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prescriptions</p>
                <p className="text-2xl font-bold">{stats.pendingPrescriptions}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>En attente</span>
            </div>
          </Card>
        </div>

        {/* Contenu principal en deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prochains rendez-vous */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Prochains Rendez-vous</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/professional/appointments')}
                >
                  Voir tout
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun rendez-vous à venir</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.appointment_date);
                    const typeIcon = appointment.type === 'teleconsultation' ? Video : Stethoscope;
                    const TypeIcon = typeIcon;
                    
                    return (
                      <div 
                        key={appointment.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/professional/appointments/${appointment.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <TypeIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {appointment.patient?.full_name || 'Patient'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointmentDate.toLocaleDateString('fr-FR', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                              })} à {appointmentDate.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                            {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Actions rapides spécifiques au rôle */}
            {hasPermission('add_consultation') && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Actions Rapides</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col py-4"
                    onClick={() => navigate('/professional/consultations/new')}
                  >
                    <Stethoscope className="h-5 w-5 mb-2" />
                    <span className="text-xs">Consultation</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col py-4"
                    onClick={() => navigate('/professional/prescriptions/new')}
                  >
                    <FileText className="h-5 w-5 mb-2" />
                    <span className="text-xs">Ordonnance</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col py-4"
                    onClick={() => navigate('/professional/teleconsultation')}
                  >
                    <Video className="h-5 w-5 mb-2" />
                    <span className="text-xs">Téléconsult.</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col py-4"
                    onClick={() => navigate('/professional/patients')}
                  >
                    <Users className="h-5 w-5 mb-2" />
                    <span className="text-xs">Patients</span>
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Colonne latérale (1/3) */}
          <div className="space-y-6">
            {/* Activité récente */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Activité Récente</h2>
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const StatusIcon = getStatusIcon(activity.status);
                  
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`mt-1 ${getStatusColor(activity.status)}`}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Menu d'administration pour admin/directeur */}
            {(isAdmin || isDirector) && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Administration</h2>
                <div className="space-y-2">
                  {hasPermission('view_staff') && (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => navigate('/professional/staff')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Gestion du Personnel
                    </Button>
                  )}
                  {hasPermission('view_reports') && (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => navigate('/professional/reports')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Rapports & Statistiques
                    </Button>
                  )}
                  {hasPermission('edit_settings') && (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => navigate('/professional/settings/establishment')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres Établissement
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}
