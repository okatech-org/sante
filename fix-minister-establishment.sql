-- Script pour corriger l'affiliation du Ministre au Ministère de la Santé
-- À exécuter via le SQL Editor de Supabase

DO $$
DECLARE
  ministre_user_id UUID;
  ministre_professional_id UUID;
  ministry_establishment_id UUID;
  sogara_establishment_id UUID;
BEGIN
  -- 1. Trouver l'utilisateur ministre
  SELECT id INTO ministre_user_id
  FROM auth.users
  WHERE email = 'ministre@sante.gouv.ga';

  IF ministre_user_id IS NULL THEN
    RAISE NOTICE '❌ Utilisateur ministre non trouvé!';
    RETURN;
  END IF;

  RAISE NOTICE '✅ Utilisateur trouvé: %', ministre_user_id;

  -- 2. Trouver ou créer l''établissement "Ministère de la Santé"
  SELECT id INTO ministry_establishment_id
  FROM establishments
  WHERE name ILIKE '%ministère%santé%' OR name = 'Ministère de la Santé';

  IF ministry_establishment_id IS NULL THEN
    -- Créer l'établissement Ministère de la Santé
    INSERT INTO establishments (
      name,
      type,
      sector,
      address,
      city,
      province,
      phone,
      email,
      is_verified,
      status
    ) VALUES (
      'Ministère de la Santé Publique',
      'hospital', -- Type générique
      'public',
      'À côté de l''immeuble Alu-Suisse',
      'Libreville',
      'Estuaire',
      '+241 01-72-26-61',
      'contact@sante.gouv.ga',
      true,
      'active'
    )
    RETURNING id INTO ministry_establishment_id;
    
    RAISE NOTICE '✅ Établissement Ministère créé: %', ministry_establishment_id;
  ELSE
    RAISE NOTICE '✅ Établissement Ministère trouvé: %', ministry_establishment_id;
  END IF;

  -- 3. Trouver le profil professionnel du ministre
  SELECT id INTO ministre_professional_id
  FROM professionals
  WHERE profile_id = ministre_user_id;

  IF ministre_professional_id IS NULL THEN
    -- Créer le profil professionnel
    INSERT INTO professionals (
      profile_id,
      profession_type,
      specializations,
      is_verified
    ) VALUES (
      ministre_user_id,
      'doctor',
      ARRAY['Administration de la Santé', 'Santé Publique'],
      true
    )
    RETURNING id INTO ministre_professional_id;
    
    RAISE NOTICE '✅ Profil professionnel créé: %', ministre_professional_id;
  ELSE
    -- Mettre à jour le profil professionnel
    UPDATE professionals SET
      profession_type = 'doctor',
      specializations = ARRAY['Administration de la Santé', 'Santé Publique'],
      is_verified = true
    WHERE id = ministre_professional_id;
    
    RAISE NOTICE '✅ Profil professionnel mis à jour: %', ministre_professional_id;
  END IF;

  -- 4. Trouver SOGARA
  SELECT id INTO sogara_establishment_id
  FROM establishments
  WHERE name ILIKE '%sogara%'
  LIMIT 1;

  -- 5. Supprimer les affiliations existantes à SOGARA
  IF sogara_establishment_id IS NOT NULL THEN
    DELETE FROM professional_affiliations
    WHERE professional_id = ministre_professional_id
    AND establishment_id = sogara_establishment_id;
    
    DELETE FROM establishment_staff
    WHERE professional_id = ministre_professional_id
    AND establishment_id = sogara_establishment_id;
    
    RAISE NOTICE '✅ Affiliations SOGARA supprimées';
  END IF;

  -- 6. Supprimer toutes les autres affiliations
  DELETE FROM professional_affiliations
  WHERE professional_id = ministre_professional_id;
  
  DELETE FROM establishment_staff
  WHERE professional_id = ministre_professional_id;

  -- 7. Créer l'affiliation au Ministère
  INSERT INTO professional_affiliations (
    professional_id,
    establishment_id,
    role,
    department,
    service,
    status,
    start_date,
    can_prescribe,
    can_admit_patients,
    can_access_all_patients,
    can_manage_staff,
    can_manage_inventory,
    can_view_financials
  ) VALUES (
    ministre_professional_id,
    ministry_establishment_id,
    'director', -- Rôle de direction
    'Administration',
    'Direction Générale',
    'approved',
    CURRENT_DATE,
    true,
    true,
    true,
    true,
    true,
    true
  )
  ON CONFLICT (professional_id, establishment_id, status) 
  DO UPDATE SET
    role = 'director',
    department = 'Administration',
    service = 'Direction Générale',
    can_prescribe = true,
    can_admit_patients = true,
    can_access_all_patients = true,
    can_manage_staff = true,
    can_manage_inventory = true,
    can_view_financials = true;

  RAISE NOTICE '✅ Affiliation au Ministère créée';

  -- 8. Créer l'entrée dans establishment_staff (nouveau système)
  INSERT INTO establishment_staff (
    establishment_id,
    professional_id,
    role,
    department,
    status,
    is_establishment_admin,
    start_date
  ) VALUES (
    ministry_establishment_id,
    ministre_professional_id,
    'Ministre de la Santé',
    'Direction Générale',
    'active',
    true,
    CURRENT_DATE
  )
  ON CONFLICT (establishment_id, professional_id, status)
  DO UPDATE SET
    role = 'Ministre de la Santé',
    department = 'Direction Générale',
    is_establishment_admin = true;

  RAISE NOTICE '✅ Entrée establishment_staff créée';

  -- 9. Mettre à jour le profil
  UPDATE profiles SET
    full_name = 'Pr. Adrien MOUGOUGOU',
    user_type = 'professional'
  WHERE id = ministre_user_id;

  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ CORRECTION TERMINÉE AVEC SUCCÈS!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE 'Le ministre est maintenant affilié au Ministère de la Santé';
  RAISE NOTICE 'Il n''est plus lié à SOGARA';
  RAISE NOTICE '';
  RAISE NOTICE 'Informations:';
  RAISE NOTICE '- User ID: %', ministre_user_id;
  RAISE NOTICE '- Professional ID: %', ministre_professional_id;
  RAISE NOTICE '- Ministry ID: %', ministry_establishment_id;
  RAISE NOTICE '';
  RAISE NOTICE 'Reconnectez-vous pour voir les changements:';
  RAISE NOTICE 'http://localhost:5173/login/professional';

END $$;

-- Vérifier le résultat
SELECT 
  u.email,
  p.full_name,
  e.name as establishment,
  pa.role,
  pa.department,
  pa.status
FROM auth.users u
JOIN profiles p ON p.id = u.id
JOIN professionals prof ON prof.profile_id = u.id
LEFT JOIN professional_affiliations pa ON pa.professional_id = prof.id
LEFT JOIN establishments e ON e.id = pa.establishment_id
WHERE u.email = 'ministre@sante.gouv.ga';

