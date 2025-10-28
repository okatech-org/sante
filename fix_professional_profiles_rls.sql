-- ============================================
-- CORRECTION ERREUR 406 - PROFESSIONAL_PROFILES
-- ============================================
-- Script de migration pour résoudre l'erreur 406 du dashboard professionnel
-- Date: 28/10/2025
-- Projet: SANTE.GA

-- 1. Vérifier l'existence de la table professional_profiles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                 WHERE table_schema = 'public' 
                 AND table_name = 'professional_profiles') THEN
    
    -- Créer la table professional_profiles si elle n'existe pas
    CREATE TABLE public.professional_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      profession_type TEXT NOT NULL CHECK (profession_type IN ('doctor', 'nurse', 'admin', 'technician', 'pharmacist', 'lab_tech', 'medecin_generaliste', 'medecin_specialiste', 'infirmier', 'ipa', 'dentiste', 'sage_femme', 'pharmacien', 'psychologue', 'kinesitherapeute')),
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
    
    -- Créer les index
    CREATE INDEX idx_professional_profiles_user_id ON public.professional_profiles(user_id);
    CREATE INDEX idx_professional_profiles_profession_type ON public.professional_profiles(profession_type);
    CREATE INDEX idx_professional_profiles_ordre_number ON public.professional_profiles(ordre_number) WHERE ordre_number IS NOT NULL;
    
    RAISE NOTICE 'Table professional_profiles créée avec succès';
  ELSE
    RAISE NOTICE 'Table professional_profiles existe déjà';
  END IF;
END $$;

-- 2. Activer RLS sur professional_profiles
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Supprimer les anciennes politiques s'elles existent
DROP POLICY IF EXISTS "Users can view their own professional profile" ON public.professional_profiles;
DROP POLICY IF EXISTS "Users can update their own professional profile" ON public.professional_profiles;
DROP POLICY IF EXISTS "Users can insert their own professional profile" ON public.professional_profiles;
DROP POLICY IF EXISTS "Admins can view all professional profiles" ON public.professional_profiles;
DROP POLICY IF EXISTS "Admins can update all professional profiles" ON public.professional_profiles;

-- 4. Créer les nouvelles politiques RLS
CREATE POLICY "Users can view their own professional profile"
  ON public.professional_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own professional profile"
  ON public.professional_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own professional profile"
  ON public.professional_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all professional profiles"
  ON public.professional_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update all professional profiles"
  ON public.professional_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'super_admin')
    )
  );

-- 5. Migrer les données de professionals vers professional_profiles si nécessaire
DO $$ 
DECLARE
  migration_count INTEGER := 0;
BEGIN
  -- Vérifier s'il y a des données à migrer
  SELECT COUNT(*) INTO migration_count
  FROM public.professionals p
  LEFT JOIN public.professional_profiles pp ON p.user_id = pp.user_id
  WHERE pp.user_id IS NULL;
  
  IF migration_count > 0 THEN
    -- Migrer les données
    INSERT INTO public.professional_profiles (
      user_id,
      profession_type,
      ordre_number,
      ordre_verified,
      years_experience,
      bio,
      created_at,
      updated_at
    )
    SELECT 
      p.user_id,
      CASE 
        WHEN p.professional_type = 'medecin_generaliste' THEN 'medecin_generaliste'
        WHEN p.professional_type = 'medecin_specialiste' THEN 'medecin_specialiste'
        WHEN p.professional_type = 'infirmier' THEN 'infirmier'
        WHEN p.professional_type = 'pharmacien' THEN 'pharmacien'
        WHEN p.professional_type = 'dentiste' THEN 'dentiste'
        WHEN p.professional_type = 'sage_femme' THEN 'sage_femme'
        WHEN p.professional_type = 'psychologue' THEN 'psychologue'
        WHEN p.professional_type = 'kinesitherapeute' THEN 'kinesitherapeute'
        ELSE 'doctor'
      END as profession_type,
      p.numero_ordre,
      p.verified,
      NULL as years_experience,
      NULL as bio,
      p.created_at,
      p.updated_at
    FROM public.professionals p
    LEFT JOIN public.professional_profiles pp ON p.user_id = pp.user_id
    WHERE pp.user_id IS NULL;
    
    RAISE NOTICE 'Migration de % enregistrements effectuée', migration_count;
  ELSE
    RAISE NOTICE 'Aucune migration nécessaire';
  END IF;
END $$;

-- 6. Créer une fonction pour créer automatiquement un profil professionnel
CREATE OR REPLACE FUNCTION create_professional_profile_if_not_exists()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier si un profil professionnel existe déjà
  IF NOT EXISTS (
    SELECT 1 FROM public.professional_profiles 
    WHERE user_id = NEW.id
  ) THEN
    -- Créer un profil professionnel par défaut
    INSERT INTO public.professional_profiles (
      user_id,
      profession_type,
      ordre_verified
    ) VALUES (
      NEW.id,
      'doctor',
      false
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Créer un trigger pour créer automatiquement un profil professionnel
DROP TRIGGER IF EXISTS trigger_create_professional_profile ON public.profiles;
CREATE TRIGGER trigger_create_professional_profile
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.profile_type = 'professional' OR NEW.profile_type IS NULL)
  EXECUTE FUNCTION create_professional_profile_if_not_exists();

-- 8. Vérification finale
DO $$ 
DECLARE
  table_exists BOOLEAN;
  total_profiles INTEGER;
BEGIN
  -- Vérifier l'existence de la table
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'professional_profiles'
  ) INTO table_exists;
  
  -- Compter les profils
  SELECT COUNT(*) INTO total_profiles FROM public.professional_profiles;
  
  RAISE NOTICE '=== RÉSULTAT DE LA MIGRATION ===';
  RAISE NOTICE 'Table professional_profiles existe: %', table_exists;
  RAISE NOTICE 'Nombre total de profils professionnels: %', total_profiles;
  RAISE NOTICE '=== MIGRATION TERMINÉE ===';
END $$;

-- 9. Grant des permissions nécessaires
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professional_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
