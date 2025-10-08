-- Créer une table pour les sessions de téléconsultation
CREATE TABLE IF NOT EXISTS public.teleconsultation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  session_type TEXT NOT NULL DEFAULT 'video',
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  room_id TEXT UNIQUE,
  notes TEXT,
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer une table pour les prescriptions électroniques
CREATE TABLE IF NOT EXISTS public.electronic_prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  teleconsultation_id UUID REFERENCES public.teleconsultation_sessions(id) ON DELETE SET NULL,
  prescription_number TEXT UNIQUE NOT NULL,
  medications JSONB NOT NULL,
  diagnosis TEXT,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  signature_data TEXT,
  qr_code_data TEXT,
  sent_to_pharmacy_id UUID REFERENCES public.pharmacies(id),
  sent_at TIMESTAMP WITH TIME ZONE,
  dispensed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.teleconsultation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electronic_prescriptions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour teleconsultation_sessions
CREATE POLICY "Professionals can manage their sessions"
  ON public.teleconsultation_sessions
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = teleconsultation_sessions.professional_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Patients can view their sessions"
  ON public.teleconsultation_sessions
  FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Admins can view all sessions"
  ON public.teleconsultation_sessions
  FOR SELECT
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

-- Politiques RLS pour electronic_prescriptions
CREATE POLICY "Professionals can manage their prescriptions"
  ON public.electronic_prescriptions
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = electronic_prescriptions.professional_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Patients can view their prescriptions"
  ON public.electronic_prescriptions
  FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Pharmacies can view sent prescriptions"
  ON public.electronic_prescriptions
  FOR SELECT
  USING (
    sent_to_pharmacy_id IS NOT NULL
    AND has_role(auth.uid(), 'pharmacy'::app_role)
  );

CREATE POLICY "Pharmacies can update dispensed prescriptions"
  ON public.electronic_prescriptions
  FOR UPDATE
  USING (
    sent_to_pharmacy_id IS NOT NULL
    AND has_role(auth.uid(), 'pharmacy'::app_role)
  );

CREATE POLICY "Admins can view all prescriptions"
  ON public.electronic_prescriptions
  FOR SELECT
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

-- Ajouter des triggers pour updated_at
CREATE TRIGGER update_teleconsultation_sessions_updated_at
  BEFORE UPDATE ON public.teleconsultation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_electronic_prescriptions_updated_at
  BEFORE UPDATE ON public.electronic_prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour générer un numéro de prescription unique
CREATE OR REPLACE FUNCTION generate_prescription_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_number TEXT;
  prefix TEXT;
BEGIN
  prefix := 'RX' || TO_CHAR(NOW(), 'YYYYMM');
  
  SELECT prefix || LPAD(COALESCE(MAX(CAST(SUBSTRING(prescription_number FROM 9) AS INTEGER)), 0) + 1, 6, '0')
  INTO new_number
  FROM public.electronic_prescriptions
  WHERE prescription_number LIKE prefix || '%';
  
  RETURN new_number;
END;
$$;

-- Activer le realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.teleconsultation_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.electronic_prescriptions;