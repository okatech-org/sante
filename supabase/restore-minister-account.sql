-- ============================================
-- Restauration du compte Ministre
-- Email: ministre@sante.gouv.ga
-- ============================================

DO $$
DECLARE
  ministre_user_id UUID;
  ministre_profile_id UUID;
  ministere_establishment_id UUID;
  existing_auth_user UUID;
BEGIN
  -- 1. Vérifier si le compte existe déjà dans auth.users
  SELECT id INTO existing_auth_user
  FROM auth.users
  WHERE email = 'ministre@sante.gouv.ga'
  LIMIT 1;

  -- 2. Si le compte n'existe pas dans auth.users, le créer
  IF existing_auth_user IS NULL THEN
    -- Générer un UUID pour le nouveau compte
    ministre_user_id := gen_random_uuid();
    
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
      ministre_user_id,
      'authenticated',
      'authenticated',
      'ministre@sante.gouv.ga',
      crypt('Ministre2025!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Pr. Adrien MOUGOUGOU","first_name":"Adrien","last_name":"MOUGOUGOU"}',
      now(),
      now(),
      '',
      '',
      '',
      '',
      false
    );
    
    RAISE NOTICE 'Compte auth.users créé avec ID: %', ministre_user_id;
  ELSE
    ministre_user_id := existing_auth_user;
    RAISE NOTICE 'Compte auth.users existe déjà avec ID: %', ministre_user_id;
    
    -- Réinitialiser le mot de passe si nécessaire
    UPDATE auth.users
    SET encrypted_password = crypt('Ministre2025!', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
    WHERE id = ministre_user_id;
    
    RAISE NOTICE 'Mot de passe réinitialisé pour ministre@sante.gouv.ga';
  END IF;

  -- 3. Vérifier/créer le profil dans public.profiles
  SELECT id INTO ministre_profile_id
  FROM public.profiles
  WHERE email = 'ministre@sante.gouv.ga' OR id = ministre_user_id
  LIMIT 1;

  IF ministre_profile_id IS NULL THEN
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
      ministre_user_id,
      'ministre@sante.gouv.ga',
      'Pr. Adrien MOUGOUGOU',
      'Adrien',
      'MOUGOUGOU',
      '+241 01-72-26-61',
      'M',
      now(),
      now()
    );
    ministre_profile_id := ministre_user_id;
    RAISE NOTICE 'Profil créé avec ID: %', ministre_profile_id;
  ELSE
    -- Mettre à jour le profil si nécessaire
    UPDATE public.profiles
    SET id = ministre_user_id,
        email = 'ministre@sante.gouv.ga',
        full_name = 'Pr. Adrien MOUGOUGOU',
        first_name = 'Adrien',
        last_name = 'MOUGOUGOU',
        phone = '+241 01-72-26-61',
        updated_at = now()
    WHERE id = ministre_profile_id;
    RAISE NOTICE 'Profil mis à jour avec ID: %', ministre_profile_id;
  END IF;

  -- 4. Vérifier/créer le rôle super_admin dans user_roles
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = ministre_user_id AND role = 'super_admin'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (ministre_user_id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    RAISE NOTICE 'Rôle super_admin assigné';
  ELSE
    RAISE NOTICE 'Rôle super_admin existe déjà';
  END IF;

  -- 5. Vérifier/créer l'établissement Ministère de la Santé
  SELECT id INTO ministere_establishment_id
  FROM public.establishments
  WHERE name = 'Ministère de la Santé'
  LIMIT 1;

  IF ministere_establishment_id IS NULL THEN
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
      'Ministère de la Santé',
      'hospital',
      'public',
      'Estuaire',
      'Libreville',
      'À côté de l''immeuble Alu-Suisse, Libreville, Gabon',
      '+241 01-72-26-61',
      'contact@sante.gouv.ga',
      'https://sante.gouv.ga',
      true,
      'verified',
      0.4162,
      9.4673,
      now(),
      now()
    )
    RETURNING id INTO ministere_establishment_id;
    RAISE NOTICE 'Établissement Ministère créé avec ID: %', ministere_establishment_id;
  ELSE
    RAISE NOTICE 'Établissement Ministère existe déjà avec ID: %', ministere_establishment_id;
  END IF;

  -- 6. Vérifier/créer l'entrée professional
  IF NOT EXISTS (
    SELECT 1 FROM public.professionals
    WHERE profile_id = ministre_profile_id
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
      ministre_profile_id,
      'doctor',
      'Administration de la Santé Publique',
      'CNOM-MINISTRE-001',
      'CNOM',
      'active',
      '2030-12-31',
      30,
      'Ministre de la Santé de la République Gabonaise. Professeur en Santé Publique.',
      now(),
      now()
    );
    RAISE NOTICE 'Entrée professional créée';
  ELSE
    RAISE NOTICE 'Entrée professional existe déjà';
  END IF;

  -- 7. Vérifier/créer l'association establishment_staff
  IF NOT EXISTS (
    SELECT 1 FROM public.establishment_staff
    WHERE establishment_id = ministere_establishment_id
      AND professional_id = ministre_profile_id
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
      ministere_establishment_id,
      ministre_profile_id,
      'Ministre de la Santé',
      'administrative',
      ARRAY['all_access', 'manage_users', 'view_statistics', 'manage_establishments', 'issue_decrees', 'view_national_data']::text[],
      'full_time',
      'permanent',
      'active',
      '2024-01-01',
      true,
      true,
      true,
      false,
      true,
      now(),
      now()
    );
    RAISE NOTICE 'Association establishment_staff créée';
  ELSE
    RAISE NOTICE 'Association establishment_staff existe déjà';
  END IF;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Restauration terminée avec succès !';
  RAISE NOTICE 'Email: ministre@sante.gouv.ga';
  RAISE NOTICE 'Mot de passe: Ministre2025!';
  RAISE NOTICE 'User ID: %', ministre_user_id;
  RAISE NOTICE 'Profile ID: %', ministre_profile_id;
  RAISE NOTICE '========================================';

END $$;

-- Vérification finale
SELECT 
  u.id as auth_user_id,
  u.email,
  u.email_confirmed_at,
  p.id as profile_id,
  p.full_name,
  ur.role,
  e.name as establishment_name,
  es.role as staff_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.establishment_staff es ON es.professional_id = p.id
LEFT JOIN public.establishments e ON e.id = es.establishment_id
WHERE u.email = 'ministre@sante.gouv.ga';

