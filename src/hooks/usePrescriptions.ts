import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Prescription {
  id: string;
  date: string;
  patient: string;
  medications: Array<{
    name: string;
    dosage: string;
    duration: string;
  }>;
  status: string;
  cnamgs: string | null;
  pharmacy: string | null;
}

export const usePrescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    delivered: 0,
    cnamgsRate: "0%",
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchPrescriptions = async () => {
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

        // Fetch prescriptions
        const { data, error: prescError } = await supabase
          .from("electronic_prescriptions")
          .select(`
            id,
            prescription_number,
            issued_date,
            status,
            medications,
            patient_id,
            sent_to_pharmacy_id,
            profiles!electronic_prescriptions_patient_id_fkey(full_name, cnamgs_number),
            pharmacies(name)
          `)
          .eq("professional_id", professional.id)
          .order("issued_date", { ascending: false })
          .limit(50);

        if (prescError) throw prescError;

        const formattedPrescriptions: Prescription[] = (data || []).map((presc: any) => ({
          id: presc.prescription_number || presc.id,
          date: presc.issued_date,
          patient: presc.profiles?.full_name || "Patient",
          medications: Array.isArray(presc.medications)
            ? presc.medications.map((med: any) => ({
                name: med.name || med.medication_name || "Médicament",
                dosage: med.dosage || "1cp",
                duration: med.duration || "30j",
              }))
            : [],
          status: presc.status || "active",
          cnamgs: presc.profiles?.cnamgs_number || null,
          pharmacy: presc.pharmacies?.name || null,
        }));

        setPrescriptions(formattedPrescriptions);

        // Calculate stats
        const active = formattedPrescriptions.filter((p) => p.status === "active").length;
        const delivered = formattedPrescriptions.filter((p) => p.status === "dispensed").length;
        const withCnamgs = formattedPrescriptions.filter((p) => p.cnamgs).length;
        const cnamgsRate =
          formattedPrescriptions.length > 0
            ? `${Math.round((withCnamgs / formattedPrescriptions.length) * 100)}%`
            : "0%";

        setStats({
          total: formattedPrescriptions.length,
          active,
          delivered,
          cnamgsRate,
        });
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("prescriptions_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "electronic_prescriptions",
        },
        () => {
          fetchPrescriptions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { prescriptions, stats, loading, error };
};
