-- Create messages table for healthcare communications
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL,
  sender_id uuid,
  sender_name text NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('doctor', 'hospital', 'pharmacy', 'laboratory', 'admin', 'system')),
  subject text NOT NULL,
  content text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  is_read boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  category text DEFAULT 'general' CHECK (category IN ('general', 'appointment', 'result', 'prescription', 'billing', 'reminder', 'alert')),
  created_at timestamp with time zone DEFAULT now(),
  read_at timestamp with time zone,
  CONSTRAINT fk_recipient FOREIGN KEY (recipient_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view their own messages
CREATE POLICY "Users can view their own messages"
  ON public.messages
  FOR SELECT
  USING (auth.uid() = recipient_id);

-- Users can update their own messages (mark as read, star, etc)
CREATE POLICY "Users can update their own messages"
  ON public.messages
  FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- Medical staff and admins can send messages to patients
CREATE POLICY "Medical staff can send messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    has_any_role(auth.uid(), ARRAY['doctor'::app_role, 'medical_staff'::app_role, 'admin'::app_role, 'super_admin'::app_role, 'hospital'::app_role, 'pharmacy'::app_role, 'laboratory'::app_role])
  );

-- Create index for better performance
CREATE INDEX idx_messages_recipient_created ON public.messages(recipient_id, created_at DESC);
CREATE INDEX idx_messages_recipient_unread ON public.messages(recipient_id, is_read) WHERE is_read = false;
CREATE INDEX idx_messages_category ON public.messages(recipient_id, category);

-- Create trigger to update read_at timestamp
CREATE OR REPLACE FUNCTION public.update_message_read_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_read = true AND OLD.is_read = false THEN
    NEW.read_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_message_read_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_message_read_at();

-- Insert some sample messages for testing
INSERT INTO public.messages (recipient_id, sender_name, sender_type, subject, content, category, priority, attachments, created_at)
SELECT 
  id,
  'Dr. Jean ONDO',
  'doctor',
  'Résultats de vos analyses sanguines',
  'Bonjour,

Vos résultats d''analyses sont disponibles. Tout est dans les normes, votre hémoglobine et glycémie sont excellentes.

Continuez votre traitement actuel.

Cordialement,
Dr. Jean ONDO',
  'result',
  'normal',
  '[
    {
      "name": "Analyses_Sanguines_2025.pdf",
      "type": "application/pdf",
      "size": "245 KB",
      "url": "#"
    }
  ]'::jsonb,
  now() - interval '2 hours'
FROM auth.users
WHERE email LIKE '%demo%' OR email LIKE '%patient%'
LIMIT 1;

INSERT INTO public.messages (recipient_id, sender_name, sender_type, subject, content, category, priority, is_read, created_at)
SELECT 
  id,
  'CHU de Libreville',
  'hospital',
  'Rappel: Rendez-vous demain',
  'Bonjour,

Nous vous rappelons votre rendez-vous de consultation prévu demain à 10h00 au service de Cardiologie.

Merci de vous présenter 15 minutes avant l''heure du rendez-vous avec votre carte CNAMGS et vos derniers examens.

Service des Rendez-vous
CHU de Libreville',
  'reminder',
  'high',
  true,
  now() - interval '1 day'
FROM auth.users
WHERE email LIKE '%demo%' OR email LIKE '%patient%'
LIMIT 1;

INSERT INTO public.messages (recipient_id, sender_name, sender_type, subject, content, category, priority, attachments, created_at)
SELECT 
  id,
  'Pharmacie Centrale',
  'pharmacy',
  'Votre ordonnance est prête',
  'Bonjour,

Votre ordonnance ORD-2024-001 est prête à être retirée.

Vous pouvez passer la récupérer aux heures d''ouverture (8h-19h du lundi au samedi).

N''oubliez pas votre carte CNAMGS pour bénéficier du tiers-payant.

Pharmacie Centrale - Libreville',
  'prescription',
  'normal',
  '[
    {
      "name": "Facture_Pharmacie.pdf",
      "type": "application/pdf",
      "size": "128 KB",
      "url": "#"
    }
  ]'::jsonb,
  now() - interval '5 hours'
FROM auth.users
WHERE email LIKE '%demo%' OR email LIKE '%patient%'
LIMIT 1;