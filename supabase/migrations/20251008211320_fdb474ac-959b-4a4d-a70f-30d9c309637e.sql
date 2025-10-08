-- Table des rendez-vous
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  type TEXT NOT NULL CHECK (type IN ('consultation', 'teleconsultation', 'suivi', 'urgence')),
  status TEXT NOT NULL DEFAULT 'planifie' CHECK (status IN ('planifie', 'confirme', 'en_cours', 'termine', 'annule', 'no_show')),
  reason TEXT,
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX idx_appointments_professional ON public.appointments(professional_id);
CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);

-- RLS pour les rendez-vous
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Les professionnels peuvent gérer leurs rendez-vous
CREATE POLICY "Professionals can manage their appointments"
ON public.appointments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.professionals
    WHERE professionals.id = appointments.professional_id
    AND professionals.user_id = auth.uid()
  )
);

-- Les patients peuvent voir leurs rendez-vous
CREATE POLICY "Patients can view their appointments"
ON public.appointments
FOR SELECT
USING (patient_id = auth.uid());

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all appointments"
ON public.appointments
FOR SELECT
USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

-- Trigger pour updated_at
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Table des notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'appointment', 'message', 'payment')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour les notifications
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

-- RLS pour les notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs notifications
CREATE POLICY "Users can view their notifications"
ON public.notifications
FOR SELECT
USING (user_id = auth.uid());

-- Les utilisateurs peuvent mettre à jour leurs notifications (marquer comme lu)
CREATE POLICY "Users can update their notifications"
ON public.notifications
FOR UPDATE
USING (user_id = auth.uid());

-- Le système peut créer des notifications
CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Activer le realtime pour les rendez-vous et notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;