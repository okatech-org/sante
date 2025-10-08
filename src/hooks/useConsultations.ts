import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Consultation {
  id: string;
  date: string;
  time: string;
  patient: string;
  type: string;
  diagnosis: string | null;
  prescription: boolean;
  examens: string[];
  notes: string | null;
  nextVisit: string | null;
}

export const useConsultations = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    today: 0,
    month: 0,
    prescriptions: 0,
    uniquePatients: 0,
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchConsultations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get professional ID
        const { data: professional, error: profError } = await supabase
          .from("professionals")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (profError) throw profError;
        if (!professional) throw new Error("Profil professionnel non trouvé");

        // Fetch completed appointments (our consultations)
        const { data, error: aptError } = await supabase
          .from("appointments")
          .select(`
            id,
            appointment_date,
            type,
            reason,
            notes,
            status,
            patient_id,
            profiles!appointments_patient_id_fkey(full_name)
          `)
          .eq("professional_id", professional.id)
          .eq("status", "completed")
          .order("appointment_date", { ascending: false })
          .limit(50);

        if (aptError) throw aptError;

        // Check which consultations have prescriptions
        const consultationIds = (data || []).map((c: any) => c.id);
        const { data: prescriptions } = await supabase
          .from("electronic_prescriptions")
          .select("consultation_id")
          .in("consultation_id", consultationIds);

        const prescriptionSet = new Set((prescriptions || []).map((p: any) => p.consultation_id));

        const formattedConsultations: Consultation[] = (data || []).map((apt: any) => {
          const date = new Date(apt.appointment_date);
          return {
            id: apt.id,
            date: date.toISOString().split("T")[0],
            time: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            patient: apt.profiles?.full_name || "Patient",
            type: apt.type === "teleconsultation" ? "Téléconsultation" : "Consultation de suivi",
            diagnosis: apt.reason || null,
            prescription: prescriptionSet.has(apt.id),
            examens: [],
            notes: apt.notes || null,
            nextVisit: null,
          };
        });

        setConsultations(formattedConsultations);

        // Calculate stats
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const todayConsultations = formattedConsultations.filter(
          (c) => new Date(c.date) >= today
        ).length;
        const monthConsultations = formattedConsultations.filter(
          (c) => new Date(c.date) >= firstDayOfMonth
        ).length;
        const prescriptionsCount = formattedConsultations.filter((c) => c.prescription).length;
        const uniquePatients = new Set(formattedConsultations.map((c) => c.patient)).size;

        setStats({
          today: todayConsultations,
          month: monthConsultations,
          prescriptions: prescriptionsCount,
          uniquePatients,
        });
      } catch (err) {
        console.error("Error fetching consultations:", err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("consultations_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        () => {
          fetchConsultations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { consultations, stats, loading, error };
};
