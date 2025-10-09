-- ============================================
-- ARCHITECTURE MULTI-ÉTABLISSEMENTS SANTE.GA
-- ============================================

-- 1. Ajouter profile_type à profiles (si pas déjà présent)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'profile_type') THEN
    ALTER TABLE public.profiles 
    ADD COLUMN profile_type TEXT DEFAULT 'patient' CHECK (profile_type IN ('patient', 'professional'));
  END IF;
END $$;

-- 2. Créer la table professional_profiles
CREATE TABLE IF NOT EXISTS public.professional_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profession_type TEXT NOT NULL CHECK (profession_type IN ('doctor', 'nurse', 'admin', 'technician', 'pharmacist', 'lab_tech')),
  specialization TEXT,
  ordre_number TEXT,
  ordre_verified BOOLEAN DEFAULT false,
  years_experience INTEGER CHECK (years_experience >= 0 AND years_experience <= 70),
  diplomas JSONB DEFAULT '[]'::jsonb,
  bio TEXT,
  consultation_fee INTEGER CHECK (consultation_fee >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- 3. Créer la table establishment_staff (relation N-N)
CREATE TABLE IF NOT EXISTS public.establishment_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  role_in_establishment TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_admin BOOLEAN DEFAULT false,
  schedule JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(establishment_id, professional_id),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

-- 4. Créer les index pour performances
CREATE INDEX IF NOT EXISTS idx_professional_profiles_user_id ON public.professional_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_establishment_staff_establishment ON public.establishment_staff(establishment_id);
CREATE INDEX IF NOT EXISTS idx_establishment_staff_professional ON public.establishment_staff(professional_id);
CREATE INDEX IF NOT EXISTS idx_establishment_staff_status ON public.establishment_staff(status);

-- 5. Activer RLS sur les nouvelles tables
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.establishment_staff ENABLE ROW LEVEL SECURITY;

-- 6. Créer fonction helper pour vérifier si user est admin d'un établissement
CREATE OR REPLACE FUNCTION public.is_establishment_admin(_user_id UUID, _establishment_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.establishment_staff es
    JOIN public.professional_profiles pp ON pp.id = es.professional_id
    WHERE pp.user_id = _user_id
      AND es.establishment_id = _establishment_id
      AND es.is_admin = true
      AND es.status = 'active'
  )
$$;

-- 7. Créer fonction pour obtenir les établissements d'un professionnel
CREATE OR REPLACE FUNCTION public.get_user_establishments(_user_id UUID)
RETURNS TABLE (
  establishment_id UUID,
  establishment_name TEXT,
  role_in_establishment TEXT,
  is_admin BOOLEAN,
  permissions TEXT[],
  status TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    e.id,
    e.raison_sociale,
    es.role_in_establishment,
    es.is_admin,
    es.permissions,
    es.status
  FROM public.establishment_staff es
  JOIN public.establishments e ON e.id = es.establishment_id
  JOIN public.professional_profiles pp ON pp.id = es.professional_id
  WHERE pp.user_id = _user_id
    AND es.status = 'active'
  ORDER BY es.is_admin DESC, e.raison_sociale
$$;

-- 8. Politiques RLS pour professional_profiles
CREATE POLICY "Users can view their own professional profile"
  ON public.professional_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own professional profile"
  ON public.professional_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own professional profile"
  ON public.professional_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all professional profiles"
  ON public.professional_profiles FOR SELECT
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

-- 9. Politiques RLS pour establishment_staff
CREATE POLICY "Users can view their own establishment memberships"
  ON public.establishment_staff FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = establishment_staff.professional_id
        AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Establishment admins can view their staff"
  ON public.establishment_staff FOR SELECT
  USING (is_establishment_admin(auth.uid(), establishment_id));

CREATE POLICY "Establishment admins can manage their staff"
  ON public.establishment_staff FOR ALL
  USING (is_establishment_admin(auth.uid(), establishment_id));

CREATE POLICY "Super admins can manage all establishment staff"
  ON public.establishment_staff FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

-- 10. Trigger pour mettre à jour updated_at
CREATE TRIGGER update_professional_profiles_updated_at
  BEFORE UPDATE ON public.professional_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_establishment_staff_updated_at
  BEFORE UPDATE ON public.establishment_staff
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Ajouter commentaires pour documentation
COMMENT ON TABLE public.professional_profiles IS 'Profils professionnels des médecins, infirmiers, etc. - Un professionnel = Un profil unique';
COMMENT ON TABLE public.establishment_staff IS 'Relation N-N entre professionnels et établissements avec rôles spécifiques - Un professionnel peut travailler dans plusieurs établissements';
COMMENT ON COLUMN public.establishment_staff.permissions IS 'Permissions spécifiques: consultations, prescriptions, dmp_read, dmp_write, staff_manage, planning, all_medical, all';
COMMENT ON FUNCTION public.is_establishment_admin IS 'Vérifie si un utilisateur est administrateur d''un établissement spécifique';
COMMENT ON FUNCTION public.get_user_establishments IS 'Retourne la liste des établissements dans lesquels un utilisateur travaille';