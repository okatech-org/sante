-- Création du compte Super Admin
-- Email: superadmin@sante.ga
-- Mot de passe: Asted1982*

-- Cette migration est idempotente et ne s'exécutera que si le compte n'existe pas déjà

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Vérifier si un super admin existe déjà
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'super_admin') THEN
    
    -- Créer le compte utilisateur dans auth.users
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
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'superadmin@sante.ga',
      crypt('Asted1982*', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Super Admin SANTE.GA"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_user_id;

    -- Créer le profil
    INSERT INTO public.profiles (id, full_name, email, phone)
    VALUES (
      admin_user_id,
      'Super Admin SANTE.GA',
      'superadmin@sante.ga',
      '+241 00 00 00 00'
    );

    -- Assigner le rôle super_admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'super_admin');

    RAISE NOTICE 'Super Admin account created successfully with email: superadmin@sante.ga';
  ELSE
    RAISE NOTICE 'A super admin already exists, skipping creation';
  END IF;
END $$;