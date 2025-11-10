import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Phone, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Patient {
  patient_id: string;
  full_name: string;
  phone: string;
  lastVisit: string;
  consultationsCount: number;
}

interface RecentPatientsCardProps {
  professionalId: string | undefined;
}

export const RecentPatientsCard = ({ professionalId }: RecentPatientsCardProps) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!professionalId) return;

    const loadPatients = async () => {
      try {
        const { data } = await supabase
          .from('appointments')
          .select(`
            patient_id,
            appointment_date,
            patient:profiles!appointments_patient_id_fkey(full_name, phone)
          `)
          .eq('professional_id', professionalId)
          .order('appointment_date', { ascending: false })
          .limit(100);

        if (data) {
          const patientMap = new Map<string, Patient>();
          
          data.forEach((appt: any) => {
            if (!appt.patient_id) return;
            
            const existing = patientMap.get(appt.patient_id);
            if (!existing) {
              patientMap.set(appt.patient_id, {
                patient_id: appt.patient_id,
                full_name: appt.patient?.full_name || 'Patient',
                phone: appt.patient?.phone || '',
                lastVisit: appt.appointment_date,
                consultationsCount: 1
              });
            } else {
              existing.consultationsCount++;
            }
          });

          const recentPatients = Array.from(patientMap.values())
            .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
            .slice(0, 5);

          setPatients(recentPatients);
        }
      } catch (error) {
        console.error('Error loading patients:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [professionalId]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Patients récents</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/professional/patients')}>
          Voir tout
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : patients.length === 0 ? (
        <p className="text-center text-muted-foreground py-6">Aucun patient</p>
      ) : (
        <div className="space-y-3">
          {patients.map((patient) => (
            <div
              key={patient.patient_id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{patient.full_name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {patient.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {patient.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  {patient.consultationsCount} consultations
                </Badge>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(patient.lastVisit).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};