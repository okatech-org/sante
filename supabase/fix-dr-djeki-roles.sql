-- ============================================
-- Correction des rôles du Dr. Jules DJEKI
-- Email: directeur.sogara@sante.ga
-- Création de l'association avec CMST SOGARA
-- Attribution des rôles: Médecin en Chef ET Administrateur
-- ============================================

DO $$
DECLARE
  djeki_user_id UUID;
  djeki_profile_id UUID;
  djeki_professional_id UUID;
  sogara_establishment_id UUID;
  staff_record_doctor_id UUID;
  staff_record_admin_id UUID;
BEGIN
  -- 1. Trouver l'utilisateur
  SELECT id INTO djeki_user_id
  FROM auth.users
  WHERE email = 'directeur.sogara@sante.ga'
  LIMIT 1;

  IF djeki_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur directeur.sogara@sante.ga non trouvé. Exécutez d''abord restore-directeur-sogara-account.sql';
  END IF;

  -- 2. Trouver le profil
  SELECT id INTO djeki_profile_id
  FROM public.profiles
  WHERE id = djeki_user_id OR email = 'directeur.sogara@sante.ga'
  LIMIT 1;

  IF djeki_profile_id IS NULL THEN
    RAISE EXCEPTION 'Profil non trouvé pour directeur.sogara@sante.ga';
  END IF;

  -- 3. Trouver ou créer le professional
  -- La table professionals peut utiliser user_id OU profile_id selon la migration
  -- On essaie d'abord avec user_id (structure la plus récente)
  SELECT id INTO djeki_professional_id
  FROM public.professionals
  WHERE user_id = djeki_user_id
     OR profile_id = djeki_profile_id
  LIMIT 1;

  IF djeki_professional_id IS NULL THEN
    -- Créer le professional s'il n'existe pas
    -- On essaie d'abord avec user_id (structure la plus récente)
    BEGIN
      INSERT INTO public.professionals (
        user_id,
        professional_type,
        full_name,
        email,
        status,
        numero_ordre,
        created_at,
        updated_at
      ) VALUES (
        djeki_user_id,
        'doctor',
        'Dr. Jules DJEKI',
        'directeur.sogara@sante.ga',
        'actif',
        'CNOM-DIR-001',
        now(),
        now()
      )
      RETURNING id INTO djeki_professional_id;
      RAISE NOTICE 'Professional créé avec user_id, ID: %', djeki_professional_id;
    EXCEPTION WHEN OTHERS THEN
      -- Si la colonne user_id n'existe pas, utiliser profile_id
      INSERT INTO public.professionals (
        profile_id,
        profession,
        specialization,
        ordre_number,
        ordre_type,
        ordre_status,
        ordre_expiry_date,
        years_of_experience,
        bio,
        created_at,
        updated_at
      ) VALUES (
        djeki_profile_id,
        'doctor',
        'Médecine Générale / Direction Médicale',
        'CNOM-DIR-001',
        'CNOM',
        'active',
        '2030-12-31',
        25,
        'Médecin en Chef du CMST SOGARA. Spécialisé en médecine du travail et direction médicale.',
        now(),
        now()
      )
      RETURNING id INTO djeki_professional_id;
      RAISE NOTICE 'Professional créé avec profile_id, ID: %', djeki_professional_id;
    END;
  END IF;

  -- 4. Trouver ou créer l'établissement CMST SOGARA
  SELECT id INTO sogara_establishment_id
  FROM public.establishments
  WHERE raison_sociale ILIKE '%CMST SOGARA%' 
     OR raison_sociale ILIKE '%SOGARA%'
     OR name ILIKE '%CMST SOGARA%'
     OR name ILIKE '%SOGARA%'
  LIMIT 1;

  IF sogara_establishment_id IS NULL THEN
    -- Créer l'établissement CMST SOGARA
    INSERT INTO public.establishments (
      id,
      raison_sociale,
      numero_autorisation,
      type_etablissement,
      secteur,
      province,
      ville,
      adresse_rue,
      telephone_standard,
      email,
      site_web,
      statut,
      latitude,
      longitude,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      'CMST SOGARA',
      'AUT-CMST-SOGARA-001',
      'centre_medical',
      'prive',
      'Ogooué-Maritime',
      'Port-Gentil',
      'Route de la Sogara',
      '+241 01 55 26 21',
      'contact@cmst-sogara.ga',
      NULL,
      'actif',
      -0.681398,
      8.772557,
      now(),
      now()
    )
    RETURNING id INTO sogara_establishment_id;
    RAISE NOTICE 'Établissement CMST SOGARA créé avec ID: %', sogara_establishment_id;
  ELSE
    RAISE NOTICE 'Établissement CMST SOGARA existe déjà avec ID: %', sogara_establishment_id;
  END IF;

  -- 5. Créer/Mettre à jour l'entrée "Médecin en Chef" dans establishment_staff
  SELECT id INTO staff_record_doctor_id
  FROM public.establishment_staff
  WHERE establishment_id = sogara_establishment_id
    AND professional_id = djeki_professional_id
    AND role_in_establishment = 'Médecin en Chef'
  LIMIT 1;

  IF staff_record_doctor_id IS NULL THEN
    INSERT INTO public.establishment_staff (
      id,
      establishment_id,
      professional_id,
      role_in_establishment,
      job_position,
      department,
      is_admin,
      is_department_head,
      permissions,
      status,
      start_date,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      sogara_establishment_id,
      djeki_professional_id,
      'Médecin en Chef',
      'Médecin en Chef',
      'Direction Médicale',
      false,
      true,
      ARRAY['consultations', 'prescriptions', 'dossiers_medicaux', 'view_statistics']::text[],
      'active',
      '2024-01-01',
      now(),
      now()
    )
    RETURNING id INTO staff_record_doctor_id;
    RAISE NOTICE 'Entrée "Médecin en Chef" créée avec ID: %', staff_record_doctor_id;
  ELSE
    UPDATE public.establishment_staff
    SET job_position = 'Médecin en Chef',
        department = 'Direction Médicale',
        is_department_head = true,
        permissions = ARRAY['consultations', 'prescriptions', 'dossiers_medicaux', 'view_statistics']::text[],
        updated_at = now()
    WHERE id = staff_record_doctor_id;
    RAISE NOTICE 'Entrée "Médecin en Chef" mise à jour avec ID: %', staff_record_doctor_id;
  END IF;

  -- 6. Créer/Mettre à jour l'entrée "Administrateur" dans establishment_staff
  SELECT id INTO staff_record_admin_id
  FROM public.establishment_staff
  WHERE establishment_id = sogara_establishment_id
    AND professional_id = djeki_professional_id
    AND role_in_establishment = 'Administrateur'
  LIMIT 1;

  IF staff_record_admin_id IS NULL THEN
    INSERT INTO public.establishment_staff (
      id,
      establishment_id,
      professional_id,
      role_in_establishment,
      job_position,
      department,
      is_admin,
      is_department_head,
      permissions,
      status,
      start_date,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      sogara_establishment_id,
      djeki_professional_id,
      'Administrateur',
      'Administrateur',
      'Direction',
      true,
      true,
      ARRAY['all_access', 'manage_staff', 'view_statistics', 'manage_appointments', 'issue_prescriptions', 'view_financial_data', 'manage_establishment']::text[],
      'active',
      '2024-01-01',
      now(),
      now()
    )
    RETURNING id INTO staff_record_admin_id;
    RAISE NOTICE 'Entrée "Administrateur" créée avec ID: %', staff_record_admin_id;
  ELSE
    UPDATE public.establishment_staff
    SET job_position = 'Administrateur',
        department = 'Direction',
        is_admin = true,
        is_department_head = true,
        permissions = ARRAY['all_access', 'manage_staff', 'view_statistics', 'manage_appointments', 'issue_prescriptions', 'view_financial_data', 'manage_establishment']::text[],
        updated_at = now()
    WHERE id = staff_record_admin_id;
    RAISE NOTICE 'Entrée "Administrateur" mise à jour avec ID: %', staff_record_admin_id;
  END IF;

  -- 7. Vérifier/créer le rôle dans user_roles
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = djeki_user_id AND role = 'doctor'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (djeki_user_id, 'doctor')
    ON CONFLICT (user_id, role) DO NOTHING;
    RAISE NOTICE 'Rôle doctor assigné dans user_roles';
  END IF;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Correction terminée avec succès !';
  RAISE NOTICE 'User ID: %', djeki_user_id;
  RAISE NOTICE 'Profile ID: %', djeki_profile_id;
  RAISE NOTICE 'Professional ID: %', djeki_professional_id;
  RAISE NOTICE 'Établissement ID: %', sogara_establishment_id;
  RAISE NOTICE 'Staff Record "Médecin en Chef" ID: %', staff_record_doctor_id;
  RAISE NOTICE 'Staff Record "Administrateur" ID: %', staff_record_admin_id;
  RAISE NOTICE 'Rôles dans establishment_staff: Médecin en Chef + Administrateur';
  RAISE NOTICE 'Rôle dans user_roles: doctor';
  RAISE NOTICE '========================================';

END $$;

-- Vérification finale
SELECT 
  u.email,
  p.full_name,
  ur.role as user_role,
  e.raison_sociale as establishment_name,
  e.name as establishment_name_alt,
  es.role_in_establishment as staff_role,
  es.job_position,
  es.department,
  es.is_admin,
  es.is_department_head,
  es.permissions,
  es.status
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.professionals pr ON pr.profile_id = p.id
LEFT JOIN public.establishment_staff es ON es.professional_id = pr.id
LEFT JOIN public.establishments e ON e.id = es.establishment_id
WHERE u.email = 'directeur.sogara@sante.ga'
ORDER BY es.is_admin DESC, es.role_in_establishment;

