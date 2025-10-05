-- Table pour les antécédents médicaux
CREATE TABLE IF NOT EXISTS public.medical_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  condition_name TEXT NOT NULL,
  diagnosed_date DATE,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'chronic', 'resolved'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les traitements en cours
CREATE TABLE IF NOT EXISTS public.treatments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'stopped'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour l'historique des consultations
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultation_date DATE NOT NULL,
  consultation_type TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  diagnosis TEXT,
  notes TEXT,
  documents JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for medical_history
CREATE POLICY "Users can view their own medical history"
ON public.medical_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medical history"
ON public.medical_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical history"
ON public.medical_history FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Medical staff can view all medical history"
ON public.medical_history FOR SELECT
USING (has_any_role(auth.uid(), ARRAY['doctor'::app_role, 'medical_staff'::app_role, 'admin'::app_role, 'super_admin'::app_role]));

-- RLS Policies for treatments
CREATE POLICY "Users can view their own treatments"
ON public.treatments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own treatments"
ON public.treatments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own treatments"
ON public.treatments FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Medical staff can view all treatments"
ON public.treatments FOR SELECT
USING (has_any_role(auth.uid(), ARRAY['doctor'::app_role, 'medical_staff'::app_role, 'admin'::app_role, 'super_admin'::app_role]));

-- RLS Policies for consultations
CREATE POLICY "Users can view their own consultations"
ON public.consultations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consultations"
ON public.consultations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consultations"
ON public.consultations FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Medical staff can view all consultations"
ON public.consultations FOR SELECT
USING (has_any_role(auth.uid(), ARRAY['doctor'::app_role, 'medical_staff'::app_role, 'admin'::app_role, 'super_admin'::app_role]));

-- Triggers for updated_at
CREATE TRIGGER update_medical_history_updated_at
BEFORE UPDATE ON public.medical_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatments_updated_at
BEFORE UPDATE ON public.treatments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();