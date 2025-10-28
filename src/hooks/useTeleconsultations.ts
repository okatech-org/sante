import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TeleconsultationSession {
  id: string;
  session_type: string;
  scheduled_time: string;
  status: string;
  duration_minutes: number | null;
  notes: string | null;
  patient_id: string;
  professional_id: string;
  patient?: {
    full_name: string;
    cnamgs_number: string | null;
  };
}

interface TeleconsultationStats {
  today: number;
  month: number;
  avgDuration: string;
  satisfaction: string;
}

export const useTeleconsultations = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<TeleconsultationSession[]>([]);
  const [completedSessions, setCompletedSessions] = useState<TeleconsultationSession[]>([]);
  const [cancelledSessions, setCancelledSessions] = useState<TeleconsultationSession[]>([]);
  const [stats, setStats] = useState<TeleconsultationStats>({
    today: 0,
    month: 0,
    avgDuration: "0min",
    satisfaction: "N/A"
  });

  const fetchProfessionalId = async () => {
    if (!user?.id) return null;

    const { data, error } = await supabase
      .from('professional_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching professional ID:', error);
      return null;
    }

    return data?.id;
  };

  const fetchTeleconsultations = async () => {
    try {
      setLoading(true);
      setError(null);

      const professionalId = await fetchProfessionalId();
      if (!professionalId) {
        setError("Profil professionnel non trouvé");
        return;
      }

      const now = new Date().toISOString();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Fetch upcoming sessions
      const { data: upcoming, error: upcomingError } = await supabase
        .from('teleconsultation_sessions')
        .select(`
          *,
          patient:profiles!teleconsultation_sessions_patient_id_fkey(full_name, cnamgs_number)
        `)
        .eq('professional_id', professionalId)
        .gte('scheduled_time', now)
        .in('status', ['scheduled', 'waiting'])
        .order('scheduled_time', { ascending: true });

      if (upcomingError) throw upcomingError;

      // Fetch completed sessions
      const { data: completed, error: completedError } = await supabase
        .from('teleconsultation_sessions')
        .select(`
          *,
          patient:profiles!teleconsultation_sessions_patient_id_fkey(full_name, cnamgs_number)
        `)
        .eq('professional_id', professionalId)
        .eq('status', 'completed')
        .order('scheduled_time', { ascending: false })
        .limit(10);

      if (completedError) throw completedError;

      // Fetch cancelled sessions
      const { data: cancelled, error: cancelledError } = await supabase
        .from('teleconsultation_sessions')
        .select(`
          *,
          patient:profiles!teleconsultation_sessions_patient_id_fkey(full_name, cnamgs_number)
        `)
        .eq('professional_id', professionalId)
        .eq('status', 'cancelled')
        .order('scheduled_time', { ascending: false })
        .limit(10);

      if (cancelledError) throw cancelledError;

      setUpcomingSessions((upcoming || []) as any);
      setCompletedSessions((completed || []) as any);
      setCancelledSessions((cancelled || []) as any);

      // Calculate stats
      const { count: todayCount } = await supabase
        .from('teleconsultation_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', professionalId)
        .gte('scheduled_time', today.toISOString())
        .lt('scheduled_time', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString());

      const { count: monthCount } = await supabase
        .from('teleconsultation_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', professionalId)
        .gte('scheduled_time', firstDayOfMonth.toISOString());

      // Calculate average duration
      const { data: completedWithDuration } = await supabase
        .from('teleconsultation_sessions')
        .select('duration_minutes')
        .eq('professional_id', professionalId)
        .eq('status', 'completed')
        .not('duration_minutes', 'is', null);

      const avgDuration = completedWithDuration && completedWithDuration.length > 0
        ? Math.round(
            completedWithDuration.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / 
            completedWithDuration.length
          )
        : 0;

      setStats({
        today: todayCount || 0,
        month: monthCount || 0,
        avgDuration: `${avgDuration}min`,
        satisfaction: "4.8/5" // À implémenter avec un système d'évaluation
      });

    } catch (err) {
      console.error('Error fetching teleconsultations:', err);
      setError("Erreur lors du chargement des téléconsultations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTeleconsultations();

      // Real-time updates
      const channel = supabase
        .channel('teleconsultation-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'teleconsultation_sessions'
          },
          () => {
            fetchTeleconsultations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id]);

  return {
    loading,
    error,
    upcomingSessions,
    completedSessions,
    cancelledSessions,
    stats,
    refetch: fetchTeleconsultations
  };
};
