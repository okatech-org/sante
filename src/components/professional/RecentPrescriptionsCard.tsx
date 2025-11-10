import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, User, Calendar, Pill } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Prescription {
  id: string;
  prescription_number: string;
  created_at: string;
  status: string;
  patient: {
    full_name: string;
  };
  medications: any[];
}

interface RecentPrescriptionsCardProps {
  professionalId: string | undefined;
}

export const RecentPrescriptionsCard = ({ professionalId }: RecentPrescriptionsCardProps) => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!professionalId) return;

    const loadPrescriptions = async () => {
      try {
        const { data } = await supabase
          .from('electronic_prescriptions')
          .select(`
            id,
            prescription_number,
            created_at,
            status,
            medications,
            patient:profiles!electronic_prescriptions_patient_id_fkey(full_name)
          `)
          .eq('professional_id', professionalId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (data) {
          setPrescriptions(data as any);
        }
      } catch (error) {
        console.error('Error loading prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrescriptions();

    const channel = supabase
      .channel('prescriptions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'electronic_prescriptions',
          filter: `professional_id=eq.${professionalId}`
        },
        () => {
          loadPrescriptions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [professionalId]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; color: string }> = {
      emise: { variant: 'default', label: 'Émise', color: 'bg-blue-500' },
      delivree: { variant: 'outline', label: 'Délivrée', color: 'bg-green-500' },
      partiellement_delivree: { variant: 'secondary', label: 'Partielle', color: 'bg-yellow-500' },
      expiree: { variant: 'destructive', label: 'Expirée', color: 'bg-red-500' },
      annulee: { variant: 'destructive', label: 'Annulée', color: 'bg-gray-500' }
    };
    const config = variants[status] || variants.emise;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Ordonnances récentes</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/professional/prescriptions')}>
          Voir tout
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : prescriptions.length === 0 ? (
        <p className="text-center text-muted-foreground py-6">Aucune ordonnance</p>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((prescription) => {
            const medicationsCount = Array.isArray(prescription.medications) 
              ? prescription.medications.length 
              : 0;
            
            return (
              <div
                key={prescription.id}
                className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/professional/prescriptions/${prescription.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{prescription.patient?.full_name || 'Patient'}</p>
                      <p className="text-xs text-muted-foreground">
                        N° {prescription.prescription_number}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(prescription.status)}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Pill className="w-4 h-4" />
                    {medicationsCount} médicament{medicationsCount > 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(prescription.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};