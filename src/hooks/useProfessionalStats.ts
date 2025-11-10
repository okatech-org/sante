import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface DashboardStats {
  today: {
    appointments: number;
    consultations: number;
    teleconsultations: number;
    revenue: number;
  };
  month: {
    patients: number;
    appointments: number;
    consultations: number;
    revenue: number;
  };
}

export const useProfessionalStats = (professionalId: string | undefined) => {
  const [stats, setStats] = useState<DashboardStats>({
    today: { appointments: 0, consultations: 0, teleconsultations: 0, revenue: 0 },
    month: { patients: 0, appointments: 0, consultations: 0, revenue: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!professionalId) return;

    const fetchStats = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Rendez-vous aujourd'hui
        const { count: todayAppointments } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('professional_id', professionalId)
          .gte('appointment_date', today.toISOString())
          .lt('appointment_date', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString());

        // Consultations aujourd'hui par type
        const { data: todayByType } = await supabase
          .from('appointments')
          .select('appointment_type')
          .eq('professional_id', professionalId)
          .eq('appointment_date', format(today, 'yyyy-MM-dd'))
          .in('status', ['completed', 'confirmed']);

        const todayConsultations = todayByType?.filter(a => a.appointment_type === 'consultation').length || 0;
        const todayTeleconsultations = todayByType?.filter(a => a.appointment_type === 'teleconsultation').length || 0;

        // Stats du mois
        const { count: monthAppointments } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('professional_id', professionalId)
          .gte('appointment_date', firstDayOfMonth.toISOString());

        // Patients uniques ce mois
        const { data: monthPatients } = await supabase
          .from('appointments')
          .select('patient_id')
          .eq('professional_id', professionalId)
          .gte('appointment_date', firstDayOfMonth.toISOString());

        const uniquePatients = new Set(monthPatients?.map(a => a.patient_id) || []).size;

        // Consultations terminées ce mois
        const { count: monthConsultations } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('professional_id', professionalId)
          .gte('appointment_date', firstDayOfMonth.toISOString())
          .eq('status', 'termine');

        setStats({
          today: {
            appointments: todayAppointments || 0,
            consultations: todayConsultations,
            teleconsultations: todayTeleconsultations,
            revenue: 0 // À implémenter avec table payments
          },
          month: {
            patients: uniquePatients,
            appointments: monthAppointments || 0,
            consultations: monthConsultations || 0,
            revenue: 0 // À implémenter avec table payments
          }
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `professional_id=eq.${professionalId}`
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [professionalId]);

  return { stats, loading };
};