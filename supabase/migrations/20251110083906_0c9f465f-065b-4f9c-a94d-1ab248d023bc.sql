-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.professional_availability CASCADE;
DROP FUNCTION IF EXISTS public.get_available_slots(TEXT, DATE, DATE) CASCADE;

-- Table pour les créneaux de disponibilité des professionnels
CREATE TABLE public.professional_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table pour les rendez-vous
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  professional_id TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show')),
  appointment_type TEXT NOT NULL DEFAULT 'consultation' CHECK (appointment_type IN ('consultation', 'teleconsultation', 'follow_up', 'emergency')),
  reason TEXT,
  notes TEXT,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(professional_id, appointment_date, appointment_time)
);

-- Index
CREATE INDEX idx_professional_availability_professional ON public.professional_availability(professional_id);
CREATE INDEX idx_professional_availability_day ON public.professional_availability(day_of_week);
CREATE INDEX idx_appointments_professional ON public.appointments(professional_id);
CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);

-- RLS pour professional_availability
ALTER TABLE public.professional_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les disponibilités sont visibles par tous"
  ON public.professional_availability
  FOR SELECT
  USING (true);

CREATE POLICY "Les admins peuvent gérer toutes les disponibilités"
  ON public.professional_availability
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- RLS pour appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les patients peuvent voir leurs propres rendez-vous"
  ON public.appointments
  FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Les patients peuvent créer leurs rendez-vous"
  ON public.appointments
  FOR INSERT
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Les patients peuvent annuler leurs rendez-vous"
  ON public.appointments
  FOR UPDATE
  USING (patient_id = auth.uid() AND status IN ('scheduled', 'confirmed'))
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Les admins peuvent gérer tous les rendez-vous"
  ON public.appointments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Fonction pour générer les créneaux disponibles
CREATE FUNCTION public.get_available_slots(
  p_professional_id TEXT,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  slot_date DATE,
  slot_time TIME,
  is_available BOOLEAN
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE dates AS (
    SELECT p_start_date AS date
    UNION ALL
    SELECT date + INTERVAL '1 day'
    FROM dates
    WHERE date < p_end_date
  ),
  time_slots AS (
    SELECT 
      d.date,
      EXTRACT(DOW FROM d.date)::INTEGER AS day_of_week,
      pa.start_time,
      pa.end_time,
      pa.duration_minutes
    FROM dates d
    CROSS JOIN public.professional_availability pa
    WHERE pa.professional_id = p_professional_id
      AND pa.is_active = true
      AND EXTRACT(DOW FROM d.date) = pa.day_of_week
  ),
  generated_slots AS (
    SELECT 
      ts.date,
      (ts.start_time + (slot_number * (ts.duration_minutes || ' minutes')::INTERVAL))::TIME AS time_slot
    FROM time_slots ts
    CROSS JOIN LATERAL generate_series(
      0,
      FLOOR(EXTRACT(EPOCH FROM (ts.end_time - ts.start_time)) / (ts.duration_minutes * 60))::INTEGER - 1
    ) AS slot_number
  )
  SELECT 
    gs.date AS slot_date,
    gs.time_slot AS slot_time,
    NOT EXISTS (
      SELECT 1 
      FROM public.appointments a
      WHERE a.professional_id = p_professional_id
        AND a.appointment_date = gs.date
        AND a.appointment_time = gs.time_slot
        AND a.status IN ('scheduled', 'confirmed')
    ) AS is_available
  FROM generated_slots gs
  WHERE gs.date >= CURRENT_DATE
  ORDER BY gs.date, gs.time_slot;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_available_slots(TEXT, DATE, DATE) TO authenticated, anon;

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_professional_availability_updated_at ON public.professional_availability;
CREATE TRIGGER update_professional_availability_updated_at
  BEFORE UPDATE ON public.professional_availability
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer les disponibilités pour Dr Démo (Lundi à Vendredi, 9h-17h30)
INSERT INTO public.professional_availability (professional_id, day_of_week, start_time, end_time, duration_minutes)
VALUES
  ('dr-demo-cabinet-001', 1, '09:00:00', '17:30:00', 30),
  ('dr-demo-cabinet-001', 2, '09:00:00', '17:30:00', 30),
  ('dr-demo-cabinet-001', 3, '09:00:00', '17:30:00', 30),
  ('dr-demo-cabinet-001', 4, '09:00:00', '17:30:00', 30),
  ('dr-demo-cabinet-001', 5, '09:00:00', '17:30:00', 30);