-- ============================================
-- CORRECTION IMMÉDIATE ERREUR 406 - SANTE.GA
-- ============================================
-- Script pour corriger immédiatement l'erreur 406 sans migration complète
-- Date: 28/10/2025

-- 1. Vérifier si la table professional_profiles existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                 WHERE table_schema = 'public' 
                 AND table_name = 'professional_profiles') THEN
    
    -- Créer la table professional_profiles rapidement
    CREATE TABLE public.professional_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      profession_type TEXT NOT NULL DEFAULT 'doctor',
      specialization TEXT,
      ordre_number TEXT,
      ordre_verified BOOLEAN DEFAULT false,
      years_experience INTEGER,
      diplomas JSONB DEFAULT '[]'::jsonb,
      bio TEXT,
      consultation_fee INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      UNIQUE(user_id)
    );
    
    -- Créer les index essentiels
    CREATE INDEX idx_professional_profiles_user_id ON public.professional_profiles(user_id);
    
    RAISE NOTICE 'Table professional_profiles créée avec succès';
  ELSE
    RAISE NOTICE 'Table professional_profiles existe déjà';
  END IF;
END $$;

-- 2. Activer RLS
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view their own professional profile" ON public.professional_profiles;
DROP POLICY IF EXISTS "Users can update their own professional profile" ON public.professional_profiles;
DROP POLICY IF EXISTS "Users can insert their own professional profile" ON public.professional_profiles;

-- 4. Créer les politiques RLS simples
CREATE POLICY "Users can view their own professional profile"
  ON public.professional_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own professional profile"
  ON public.professional_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own professional profile"
  ON public.professional_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Créer des profils pour tous les utilisateurs existants qui n'en ont pas
INSERT INTO public.professional_profiles (user_id, profession_type, ordre_verified)
SELECT 
  p.id,
  'doctor',
  false
FROM public.profiles p
LEFT JOIN public.professional_profiles pp ON p.id = pp.user_id
WHERE pp.user_id IS NULL
AND p.id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- 6. Grant des permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professional_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 7. Vérification finale
DO $$ 
DECLARE
  total_profiles INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_profiles FROM public.professional_profiles;
  RAISE NOTICE '=== CORRECTION TERMINÉE ===';
  RAISE NOTICE 'Profils professionnels créés: %', total_profiles;
  RAISE NOTICE 'L''erreur 406 devrait maintenant être résolue !';
END $$;
