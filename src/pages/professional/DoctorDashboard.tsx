import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useProfessionalStats } from '@/hooks/useProfessionalStats';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RecentPatientsCard } from '@/components/professional/RecentPatientsCard';
import { TodayConsultationsCard } from '@/components/professional/TodayConsultationsCard';
import { RecentPrescriptionsCard } from '@/components/professional/RecentPrescriptionsCard';
import { 
  Stethoscope, Calendar, Users,
  Clock, Activity, TrendingUp 
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [professionalId, setProfessionalId] = useState<string | undefined>();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const { stats, loading } = useProfessionalStats(professionalId);

  useEffect(() => {
    const loadProfessional = async () => {
      if (!user?.id) return;
      const { data: professional } = await supabase
        .from('professionals')
        .select('id, professional_type')
        .eq('user_id', user.id)
        .single();

      if (professional?.id) {
        setProfessionalId(professional.id);
        const { data } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:profiles!appointments_patient_id_fkey(full_name)
          `)
          .eq('professional_id', professional.id)
          .gte('appointment_date', new Date().toISOString())
          .order('appointment_date', { ascending: true })
          .limit(5);
        if (data) setUpcomingAppointments(data);
      }
    };
    loadProfessional();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            Tableau de Bord Médecin
          </h1>
          <p className="text-muted-foreground mt-1">Activité médicale et consultations</p>
        </div>
        <Badge className="px-4 py-2 text-lg">Médecin</Badge>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => navigate('/professional/consultations/new')}>
            <Stethoscope className="h-4 w-4 mr-2" /> Nouvelle consultation
          </Button>
          <Button variant="outline" onClick={() => navigate('/professional/prescriptions/new')}>
            <Activity className="h-4 w-4 mr-2" /> Nouvelle ordonnance
          </Button>
          <Button variant="outline" onClick={() => navigate('/professional/teleconsultation')}>
            <Clock className="h-4 w-4 mr-2" /> Démarrer téléconsultation
          </Button>
          <Button variant="outline" onClick={() => navigate('/professional/patients')}>
            <Users className="h-4 w-4 mr-2" /> Mes patients
          </Button>
        </div>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Activité médicale</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consultations aujourd'hui</p>
                <p className="text-2xl font-bold">{loading ? '…' : stats.today.consultations}</p>
              </div>
              <Calendar className="h-8 w-8 text-emerald-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Patients ce mois</p>
                <p className="text-2xl font-bold">{loading ? '…' : stats.month.patients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Téléconsultations aujourd'hui</p>
                <p className="text-2xl font-bold">{loading ? '…' : stats.today.teleconsultations}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">RDV aujourd'hui</p>
                <p className="text-2xl font-bold">{loading ? '…' : stats.today.appointments}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayConsultationsCard professionalId={professionalId} />
        <RecentPrescriptionsCard professionalId={professionalId} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPatientsCard professionalId={professionalId} />
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Prochains rendez-vous</h2>
          </div>
          <Card className="p-6">
            {upcomingAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Aucun rendez-vous à venir</p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((rdv) => {
                  const d = new Date(rdv.appointment_date);
                  return (
                    <div key={rdv.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{rdv.patient?.full_name || 'Patient'}</p>
                          <p className="text-xs text-muted-foreground">{rdv.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}