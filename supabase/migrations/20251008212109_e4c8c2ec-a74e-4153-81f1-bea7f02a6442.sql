-- Créer une table pour la vérification des numéros CNAMGS
CREATE TABLE IF NOT EXISTS public.cnamgs_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cnamgs_number TEXT NOT NULL,
  fund TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer une table pour la vérification des inscriptions CNOM
CREATE TABLE IF NOT EXISTS public.cnom_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  numero_ordre TEXT NOT NULL,
  specialty TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  inscription_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur les tables
ALTER TABLE public.cnamgs_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cnom_verifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour cnamgs_verifications
CREATE POLICY "Users can view their own CNAMGS verifications"
  ON public.cnamgs_verifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CNAMGS verifications"
  ON public.cnamgs_verifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all CNAMGS verifications"
  ON public.cnamgs_verifications
  FOR SELECT
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

CREATE POLICY "Admins can update CNAMGS verifications"
  ON public.cnamgs_verifications
  FOR UPDATE
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

-- Politiques RLS pour cnom_verifications
CREATE POLICY "Professionals can view their own CNOM verifications"
  ON public.cnom_verifications
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = cnom_verifications.professional_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Professionals can insert their own CNOM verifications"
  ON public.cnom_verifications
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = cnom_verifications.professional_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all CNOM verifications"
  ON public.cnom_verifications
  FOR SELECT
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

CREATE POLICY "Admins can update CNOM verifications"
  ON public.cnom_verifications
  FOR UPDATE
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

-- Ajouter un trigger pour updated_at
CREATE TRIGGER update_cnamgs_verifications_updated_at
  BEFORE UPDATE ON public.cnamgs_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cnom_verifications_updated_at
  BEFORE UPDATE ON public.cnom_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Activer le realtime pour les vérifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.cnamgs_verifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cnom_verifications;