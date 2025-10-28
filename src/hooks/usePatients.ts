import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  cnamgs: string | null;
  phone: string;
  email: string | null;
  lastVisit: string | null;
  nextVisit: string | null;
  conditions: string[];
  status: string;
}

export const usePatients = (searchQuery: string = "") => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
    upcomingAppointments: 0,
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get professional ID
        const { data: professional, error: profError } = await supabase
          .from("professionals")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profError) throw profError;
        if (!professional) {
          console.log("Profil professionnel non trouvé");
          setPatients([]);
          setStats({ total: 0, active: 0, newThisMonth: 0, upcomingAppointments: 0 });
          setLoading(false);
          return;
        }

        // Get all appointments for this professional to find unique patients
        const { data: appointments, error: aptError } = await supabase
          .from("appointments")
          .select(`
            patient_id,
            appointment_date,
            status,
            profiles!appointments_patient_id_fkey(
              id,
              full_name,
              phone,
              email,
              cnamgs_number,
              birth_date,
              gender
            )
          `)
          .eq("professional_id", professional.id)
          .order("appointment_date", { ascending: false });

        if (aptError) throw aptError;

        // Group by patient and get patient info
        const patientMap = new Map<string, any>();
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        (appointments || []).forEach((apt: any) => {
          if (!apt.profiles) return;
          
          const patientId = apt.patient_id;
          if (!patientMap.has(patientId)) {
            const birthDate = apt.profiles.birth_date ? new Date(apt.profiles.birth_date) : null;
            const age = birthDate
              ? Math.floor((now.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
              : 0;

            patientMap.set(patientId, {
              id: patientId,
              name: apt.profiles.full_name || "Patient",
              age,
              gender: apt.profiles.gender || "M",
              cnamgs: apt.profiles.cnamgs_number || null,
              phone: apt.profiles.phone || "",
              email: apt.profiles.email || null,
              lastVisit: apt.appointment_date,
              nextVisit: null,
              conditions: [], // Would need a medical_history join
              status: "suivi_actif",
              firstVisitDate: apt.appointment_date,
            });
          } else {
            const patient = patientMap.get(patientId);
            // Update next visit if appointment is in the future and earlier than current nextVisit
            if (
              apt.status !== "cancelled" &&
              new Date(apt.appointment_date) > now &&
              (!patient.nextVisit || new Date(apt.appointment_date) < new Date(patient.nextVisit))
            ) {
              patient.nextVisit = apt.appointment_date;
            }
          }
        });

        let patientsList = Array.from(patientMap.values());

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          patientsList = patientsList.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              p.phone.includes(query) ||
              (p.cnamgs && p.cnamgs.toLowerCase().includes(query))
          );
        }

        setPatients(patientsList);

        // Calculate stats
        const activePatients = patientsList.filter((p) => p.status === "suivi_actif").length;
        const newThisMonth = patientsList.filter(
          (p) => new Date(p.firstVisitDate) >= firstDayOfMonth
        ).length;
        const upcomingAppointments = patientsList.filter((p) => p.nextVisit).length;

        setStats({
          total: patientsList.length,
          active: activePatients,
          newThisMonth,
          upcomingAppointments,
        });
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user?.id, searchQuery]);

  return { patients, stats, loading, error };
};
