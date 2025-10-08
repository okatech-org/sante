import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TeleconsultationRoom } from "@/components/professional/TeleconsultationRoom";
import { ElectronicPrescriptionModal } from "@/components/professional/ElectronicPrescriptionModal";
import { toast } from "sonner";

export default function TeleconsultationSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [session, setSession] = useState<any>(null);
  const [professional, setProfessional] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId && user) {
      loadSessionData();
    }
  }, [sessionId, user]);

  const loadSessionData = async () => {
    try {
      // Charger la session
      const { data: sessionData, error: sessionError } = await supabase
        .from('teleconsultation_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;
      setSession(sessionData);

      // Charger le professionnel
      const { data: professionalData, error: proError } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (proError) throw proError;
      setProfessional(professionalData);

      // Charger les infos du patient
      const { data: patientData, error: patientError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionData.patient_id)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

    } catch (error) {
      console.error('Error loading session:', error);
      toast.error("Erreur lors du chargement de la session");
      navigate('/professional/teleconsultations');
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    try {
      const endTime = new Date();
      const startTime = session.start_time ? new Date(session.start_time) : new Date();
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

      await supabase
        .from('teleconsultation_sessions')
        .update({
          status: 'completed',
          end_time: endTime.toISOString(),
          duration_minutes: durationMinutes
        })
        .eq('id', sessionId);

      toast.success("Session terminée", {
        description: `Durée: ${durationMinutes} minutes`
      });

      navigate('/professional/teleconsultations');
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error("Erreur lors de la fin de session");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement de la session...</p>
      </div>
    );
  }

  if (!session || !professional || !patient) {
    return null;
  }

  return (
    <>
      <TeleconsultationRoom
        sessionId={session.id}
        patientName={patient.full_name}
        onEndSession={handleEndSession}
        onCreatePrescription={() => setShowPrescriptionModal(true)}
      />

      <ElectronicPrescriptionModal
        open={showPrescriptionModal}
        onOpenChange={setShowPrescriptionModal}
        professionalId={professional.id}
        patientId={session.patient_id}
        teleconsultationId={session.id}
      />
    </>
  );
}