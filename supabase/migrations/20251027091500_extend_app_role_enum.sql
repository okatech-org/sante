-- Étendre l'ENUM public.app_role avec les rôles manquants utilisés par l'application
-- Sécurisé via IF NOT EXISTS pour support d'exécutions idempotentes
DO $$
BEGIN
  -- Métiers médicaux et paramédicaux
  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'specialist';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'nurse';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'midwife';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'physiotherapist';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'psychologist';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'ophthalmologist';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'anesthesiologist';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'radiologist';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  -- Pharmacie / laboratoire (personnes vs établissements)
  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'pharmacist';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'laboratory_technician';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  -- Administration d'établissements
  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'clinic_admin';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hospital_admin';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sogara_admin';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'radiology_center';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  -- establishment_admin déjà géré par une migration antérieure; laissé ici par sécurité
  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'establishment_admin';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;


