import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Consultation {
  id: string;
  appointment_date: string;
  type: string;
  status: string;
  reason: string;
  patient: {
    full_name: string;
  };
}

interface TodayConsultationsCardProps {
  professionalId: string | undefined;
}

export const TodayConsultationsCard = ({ professionalId }: TodayConsultationsCardProps) => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!professionalId) return;

    const loadConsultations = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { data } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_date,
            type,
            status,
            reason,
            patient:profiles!appointments_patient_id_fkey(full_name)
          `)
          .eq('professional_id', professionalId)
          .gte('appointment_date', today.toISOString())
          .lt('appointment_date', tomorrow.toISOString())
          .order('appointment_date', { ascending: true });

        if (data) {
          setConsultations(data as any);
        }
      } catch (error) {
        console.error('Error loading consultations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConsultations();

    const channel = supabase
      .channel('today-consultations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `professional_id=eq.${professionalId}`
        },
        () => {
          loadConsultations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [professionalId]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      planifie: { variant: 'secondary', label: 'Planifié' },
      en_cours: { variant: 'default', label: 'En cours' },
      termine: { variant: 'outline', label: 'Terminé' },
      annule: { variant: 'destructive', label: 'Annulé' }
    };
    const config = variants[status] || variants.planifie;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Consultations du jour</h3>
          <Badge variant="secondary">{consultations.length}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/professional/consultations')}>
          Voir tout
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : consultations.length === 0 ? (
        <p className="text-center text-muted-foreground py-6">Aucune consultation aujourd'hui</p>
      ) : (
        <div className="space-y-3">
          {consultations.map((consultation) => {
            const date = new Date(consultation.appointment_date);
            return (
              <div
                key={consultation.id}
                className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/professional/consultations/${consultation.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{consultation.patient?.full_name || 'Patient'}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {date.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(consultation.status)}
                </div>
                {consultation.reason && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4 mt-0.5" />
                    <p>{consultation.reason}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};