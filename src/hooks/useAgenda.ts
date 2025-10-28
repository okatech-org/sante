import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AgendaAppointment {
  id: string;
  time: string;
  patient: string;
  type: string;
  reason: string | null;
  status: string;
  cnamgs: string | null;
  appointment_date: string;
}

export const useAgenda = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AgendaAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    patients: 0,
    consultations: 0,
    teleconsultations: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get professional ID
        const { data: professional, error: profError } = await supabase
          .from("professional_profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profError) throw profError;
        if (!professional) {
          console.log("Profil professionnel non trouvé");
          setAppointments([]);
          setStats({ patients: 0, consultations: 0, teleconsultations: 0, revenue: 0 });
          setLoading(false);
          return;
        }

        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Fetch appointments
        const { data, error: aptError } = await supabase
          .from("appointments")
          .select(`
            id,
            appointment_date,
            type,
            reason,
            status,
            patient_id,
            profiles!appointments_patient_id_fkey(full_name, cnamgs_number)
          `)
          .eq("professional_id", professional.id)
          .gte("appointment_date", today.toISOString())
          .order("appointment_date", { ascending: true });

        if (aptError) throw aptError;

        const formattedAppointments = (data || []).map((apt: any) => ({
          id: apt.id,
          time: new Date(apt.appointment_date).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          patient: apt.profiles?.full_name || "Patient",
          type: apt.type || "cabinet",
          reason: apt.reason,
          status: apt.status || "confirmé",
          cnamgs: apt.profiles?.cnamgs_number || null,
          appointment_date: apt.appointment_date,
        }));

        setAppointments(formattedAppointments);

        // Calculate stats (using current month data)
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const { data: monthAppointments } = await supabase
          .from("appointments")
          .select("id, type")
          .eq("professional_id", professional.id)
          .gte("appointment_date", firstDayOfMonth.toISOString());

        const uniquePatients = new Set((monthAppointments || []).map((apt: any) => apt.patient_id)).size;
        const teleconsultations = (monthAppointments || []).filter(
          (apt: any) => apt.type === "teleconsultation"
        ).length;

        setStats({
          patients: uniquePatients,
          consultations: (monthAppointments || []).length,
          teleconsultations,
          revenue: 2500000, // Mock value for now
        });
      } catch (err) {
        console.error("Error fetching agenda:", err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("agenda_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { appointments, stats, loading, error };
};
