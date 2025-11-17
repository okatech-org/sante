-- ============================================
-- Restauration du compte Directeur CMST SOGARA
-- Email: directeur.sogara@sante.ga
-- Mot de passe: DirecteurSOGARA2024!
-- Rôle: Médecin en Chef
-- ============================================

DO $$
DECLARE
  directeur_user_id UUID;
  directeur_profile_id UUID;
  sogara_establishment_id UUID;
  existing_auth_user UUID;
BEGIN
  -- 1. Vérifier si le compte existe déjà dans auth.users
  SELECT id INTO existing_auth_user
  FROM auth.users
  WHERE email = 'directeur.sogara@sante.ga'
  LIMIT 1;

  -- 2. Si le compte n'existe pas dans auth.users, le créer
  IF existing_auth_user IS NULL THEN
    -- Générer un UUID pour le nouveau compte
    directeur_user_id := gen_random_uuid();
    
    -- Créer le compte dans auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token,
      is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      directeur_user_id,
      'authenticated',
      'authenticated',
      'directeur.sogara@sante.ga',
      crypt('DirecteurSOGARA2024!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Dr. Jules DJEKI","first_name":"Jules","last_name":"DJEKI"}',
      now(),
      now(),
      '',
      '',
      '',
      '',
      false
    );
    
    RAISE NOTICE 'Compte auth.users créé avec ID: %', directeur_user_id;
  ELSE
    directeur_user_id := existing_auth_user;
    RAISE NOTICE 'Compte auth.users existe déjà avec ID: %', directeur_user_id;
    
    -- Réinitialiser le mot de passe si nécessaire
    UPDATE auth.users
    SET encrypted_password = crypt('DirecteurSOGARA2024!', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
    WHERE id = directeur_user_id;
    
    RAISE NOTICE 'Mot de passe réinitialisé pour directeur.sogara@sante.ga';
  END IF;

  -- 3. Vérifier/créer le profil dans public.profiles
  SELECT id INTO directeur_profile_id
  FROM public.profiles
  WHERE email = 'directeur.sogara@sante.ga' OR id = directeur_user_id
  LIMIT 1;

  IF directeur_profile_id IS NULL THEN
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      first_name,
      last_name,
      phone,
      gender,
      created_at,
      updated_at
    ) VALUES (
      directeur_user_id,
      'directeur.sogara@sante.ga',
      'Dr. Jules DJEKI',
      'Jules',
      'DJEKI',
      '+241 01 55 26 21',
      'M',
      now(),
      now()
    );
    directeur_profile_id := directeur_user_id;
    RAISE NOTICE 'Profil créé avec ID: %', directeur_profile_id;
  ELSE
    -- Mettre à jour le profil si nécessaire
    UPDATE public.profiles
    SET id = directeur_user_id,
        email = 'directeur.sogara@sante.ga',
        full_name = 'Dr. Jules DJEKI',
        first_name = 'Jules',
        last_name = 'DJEKI',
        phone = '+241 01 55 26 21',
        updated_at = now()
    WHERE id = directeur_profile_id;
    RAISE NOTICE 'Profil mis à jour avec ID: %', directeur_profile_id;
  END IF;

  -- 4. Vérifier/créer le rôle doctor dans user_roles
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = directeur_user_id AND role = 'doctor'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (directeur_user_id, 'doctor')
    ON CONFLICT (user_id, role) DO NOTHING;
    RAISE NOTICE 'Rôle doctor assigné';
  ELSE
    RAISE NOTICE 'Rôle doctor existe déjà';
  END IF;

  -- 5. Vérifier/créer l'établissement CMST SOGARA
  SELECT id INTO sogara_establishment_id
  FROM public.establishments
  WHERE name ILIKE '%CMST SOGARA%' OR name ILIKE '%SOGARA%'
  LIMIT 1;

  IF sogara_establishment_id IS NULL THEN
    INSERT INTO public.establishments (
      id,
      name,
      type,
      sector,
      province,
      city,
      address,
      phone,
      email,
      website,
      is_operational,
      claim_status,
      latitude,
      longitude,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      'CMST SOGARA',
      'clinic',
      'private',
      'Ogooué-Maritime',
      'Port-Gentil',
      'Route de la Sogara',
      '+241 01 55 26 21',
      'contact@cmst-sogara.ga',
      NULL,
      true,
      'verified',
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

  -- 6. Vérifier/créer l'entrée professional
  IF NOT EXISTS (
    SELECT 1 FROM public.professionals
    WHERE profile_id = directeur_profile_id
  ) THEN
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
      directeur_profile_id,
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
    );
    RAISE NOTICE 'Entrée professional créée';
  ELSE
    -- Mettre à jour le professional si nécessaire
    UPDATE public.professionals
    SET specialization = 'Médecine Générale / Direction Médicale',
        bio = 'Médecin en Chef du CMST SOGARA. Spécialisé en médecine du travail et direction médicale.',
        updated_at = now()
    WHERE profile_id = directeur_profile_id;
    RAISE NOTICE 'Entrée professional mise à jour';
  END IF;

  -- 7. Vérifier/créer l'association establishment_staff
  IF NOT EXISTS (
    SELECT 1 FROM public.establishment_staff
    WHERE establishment_id = sogara_establishment_id
      AND professional_id = directeur_profile_id
  ) THEN
    INSERT INTO public.establishment_staff (
      id,
      establishment_id,
      professional_id,
      role,
      role_category,
      permissions,
      schedule_type,
      contract_type,
      status,
      start_date,
      can_manage_staff,
      can_access_all_records,
      can_manage_appointments,
      can_issue_prescriptions,
      can_view_financial_data,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      sogara_establishment_id,
      directeur_profile_id,
      'Médecin en Chef',
      'medical',
      ARRAY['all_access', 'manage_staff', 'view_statistics', 'manage_appointments', 'issue_prescriptions', 'view_financial_data']::text[],
      'full_time',
      'permanent',
      'active',
      '2024-01-01',
      true,
      true,
      true,
      true,
      true,
      now(),
      now()
    );
    RAISE NOTICE 'Association establishment_staff créée';
  ELSE
    -- Mettre à jour le rôle si nécessaire
    UPDATE public.establishment_staff
    SET role = 'Médecin en Chef',
        role_category = 'medical',
        permissions = ARRAY['all_access', 'manage_staff', 'view_statistics', 'manage_appointments', 'issue_prescriptions', 'view_financial_data']::text[],
        can_manage_staff = true,
        can_access_all_records = true,
        can_manage_appointments = true,
        can_issue_prescriptions = true,
        can_view_financial_data = true,
        updated_at = now()
    WHERE establishment_id = sogara_establishment_id
      AND professional_id = directeur_profile_id;
    RAISE NOTICE 'Association establishment_staff mise à jour';
  END IF;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Restauration terminée avec succès !';
  RAISE NOTICE 'Email: directeur.sogara@sante.ga';
  RAISE NOTICE 'Mot de passe: DirecteurSOGARA2024!';
  RAISE NOTICE 'Rôle: Médecin en Chef';
  RAISE NOTICE 'User ID: %', directeur_user_id;
  RAISE NOTICE 'Profile ID: %', directeur_profile_id;
  RAISE NOTICE 'Établissement ID: %', sogara_establishment_id;
  RAISE NOTICE '========================================';

END $$;

-- Vérification finale
SELECT 
  u.id as auth_user_id,
  u.email,
  u.email_confirmed_at,
  p.id as profile_id,
  p.full_name,
  ur.role as user_role,
  e.name as establishment_name,
  es.role as staff_role,
  es.role_category,
  es.permissions
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.establishment_staff es ON es.professional_id = p.id
LEFT JOIN public.establishments e ON e.id = es.establishment_id
WHERE u.email = 'directeur.sogara@sante.ga';

