-- ============================================
-- SEMAINE 1 - CORRECTIONS CRITIQUES  
-- Ajout des colonnes manquantes
-- ============================================

-- 1. Ajouter les colonnes manquantes à professionals
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS profession_type TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS ordre_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS years_experience INTEGER,
ADD COLUMN IF NOT EXISTS diplomas JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS consultation_fee INTEGER,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. Migrer les données de professional_profiles vers professionals  
UPDATE public.professionals p
SET 
  profession_type = COALESCE(pp.profession_type, p.professional_type::text),
  specialization = pp.specialization,
  ordre_verified = COALESCE(pp.ordre_verified, false),
  years_experience = pp.years_experience,
  diplomas = COALESCE(pp.diplomas, '[]'::jsonb),
  consultation_fee = pp.consultation_fee,
  bio = pp.bio
FROM public.professional_profiles pp
WHERE p.user_id = pp.user_id;

-- 3. Ajouter les colonnes manquantes à establishment_staff
ALTER TABLE public.establishment_staff
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS department_id TEXT,
ADD COLUMN IF NOT EXISTS job_position TEXT,
ADD COLUMN IF NOT EXISTS matricule TEXT,
ADD COLUMN IF NOT EXISTS is_department_head BOOLEAN DEFAULT false;

-- 4. Créer le type ENUM pour les permissions
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'permission_type') THEN
    CREATE TYPE public.permission_type AS ENUM (
      'view_dmp',
      'edit_dmp',
      'consultation',
      'prescription',
      'order_lab_test',
      'view_lab_results',
      'validate_lab_results',
      'admit_patient',
      'discharge_patient',
      'emergency_access',
      'triage',
      'manage_appointments',
      'manage_staff',
      'view_analytics',
      'manage_billing',
      'dispense_medication',
      'manage_stock',
      'manage_services',
      'manage_schedule',
      'all'
    );
  END IF;
END $$;

-- 5. Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON public.professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_specialization ON public.professionals(specialization);
CREATE INDEX IF NOT EXISTS idx_establishment_staff_user_lookup ON public.establishment_staff(professional_id, establishment_id, status);
CREATE INDEX IF NOT EXISTS idx_establishment_staff_permissions ON public.establishment_staff USING gin(permissions);