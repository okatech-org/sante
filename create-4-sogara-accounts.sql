-- =====================================================
-- CRÉATION DE 4 COMPTES SOGARA PRIORITAIRES
-- =====================================================
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- 1️⃣ JEAN-PIERRE MBADINGA - Administrateur
DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_password TEXT;
BEGIN
  -- Générer le mot de passe crypté
  v_encrypted_password := crypt('Admin@SOGARA2024', gen_salt('bf'));
  
  -- Créer ou récupérer l'utilisateur
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
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
    'admin@sogara.com',
    v_encrypted_password,
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Jean-Pierre Mbadinga","department":"Administration","matricule":"ADM-001","establishment":"CMST SOGARA"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) ON CONFLICT (email) DO UPDATE SET
    encrypted_password = v_encrypted_password,
    email_confirmed_at = NOW(),
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  -- Si l'utilisateur existait déjà, récupérer son ID
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@sogara.com';
  END IF;
  
  -- Créer le profil
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (v_user_id, 'Jean-Pierre Mbadinga', 'admin@sogara.com', '+241 06 XX XX 01')
  ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;
  
  -- Assigner le rôle
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'hospital')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Créer le profil professionnel
  INSERT INTO public.professionals (
    user_id,
    professional_type,
    numero_ordre,
    specialite,
    etablissement,
    is_verified
  ) VALUES (
    v_user_id,
    'administrator',
    'ADM-001',
    'Administration',
    'CMST SOGARA',
    true
  ) ON CONFLICT (user_id) DO UPDATE SET
    numero_ordre = EXCLUDED.numero_ordre,
    specialite = EXCLUDED.specialite;
  
  RAISE NOTICE '✅ Jean-Pierre Mbadinga créé avec succès (admin@sogara.com)';
END $$;

-- 2️⃣ DR. FRANÇOIS OBIANG - Administrateur / Directeur Médical
DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_password TEXT;
BEGIN
  v_encrypted_password := crypt('DirecteurSOGARA2024!', gen_salt('bf'));
  
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
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
    'directeur@sogara.com',
    v_encrypted_password,
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Dr. François Obiang","department":"Direction Médicale","matricule":"DIR-001","establishment":"CMST SOGARA"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) ON CONFLICT (email) DO UPDATE SET
    encrypted_password = v_encrypted_password,
    email_confirmed_at = NOW(),
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'directeur@sogara.com';
  END IF;
  
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (v_user_id, 'Dr. François Obiang', 'directeur@sogara.com', '+241 06 XX XX 02')
  ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'hospital')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  INSERT INTO public.professionals (
    user_id,
    professional_type,
    numero_ordre,
    specialite,
    etablissement,
    is_verified
  ) VALUES (
    v_user_id,
    'administrator',
    'DIR-001',
    'Direction Médicale',
    'CMST SOGARA',
    true
  ) ON CONFLICT (user_id) DO UPDATE SET
    numero_ordre = EXCLUDED.numero_ordre,
    specialite = EXCLUDED.specialite;
  
  RAISE NOTICE '✅ Dr. François Obiang créé avec succès (directeur@sogara.com)';
END $$;

-- 3️⃣ DR. MARIE OKEMBA - Médecin Générale
DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_password TEXT;
BEGIN
  v_encrypted_password := crypt('Okemba@2024Med', gen_salt('bf'));
  
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
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
    'dr.okemba@sogara.com',
    v_encrypted_password,
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Dr. Marie Okemba","department":"Médecine Générale","matricule":"MED-012","establishment":"CMST SOGARA"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) ON CONFLICT (email) DO UPDATE SET
    encrypted_password = v_encrypted_password,
    email_confirmed_at = NOW(),
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'dr.okemba@sogara.com';
  END IF;
  
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (v_user_id, 'Dr. Marie Okemba', 'dr.okemba@sogara.com', '+241 06 XX XX 03')
  ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'doctor')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  INSERT INTO public.professionals (
    user_id,
    professional_type,
    numero_ordre,
    specialite,
    etablissement,
    is_verified
  ) VALUES (
    v_user_id,
    'doctor',
    'MED-012',
    'Médecine Générale',
    'CMST SOGARA',
    true
  ) ON CONFLICT (user_id) DO UPDATE SET
    numero_ordre = EXCLUDED.numero_ordre,
    specialite = EXCLUDED.specialite;
  
  RAISE NOTICE '✅ Dr. Marie Okemba créée avec succès (dr.okemba@sogara.com)';
END $$;

-- 4️⃣ DR. PAUL NGUEMA - Médecin Urgences
DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_password TEXT;
BEGIN
  v_encrypted_password := crypt('Nguema@Urgence24', gen_salt('bf'));
  
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
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
    'dr.nguema@sogara.com',
    v_encrypted_password,
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Dr. Paul Nguema","department":"Urgences","matricule":"MED-015","establishment":"CMST SOGARA"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) ON CONFLICT (email) DO UPDATE SET
    encrypted_password = v_encrypted_password,
    email_confirmed_at = NOW(),
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'dr.nguema@sogara.com';
  END IF;
  
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (v_user_id, 'Dr. Paul Nguema', 'dr.nguema@sogara.com', '+241 06 XX XX 04')
  ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'doctor')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  INSERT INTO public.professionals (
    user_id,
    professional_type,
    numero_ordre,
    specialite,
    etablissement,
    is_verified
  ) VALUES (
    v_user_id,
    'doctor',
    'MED-015',
    'Urgences',
    'CMST SOGARA',
    true
  ) ON CONFLICT (user_id) DO UPDATE SET
    numero_ordre = EXCLUDED.numero_ordre,
    specialite = EXCLUDED.specialite;
  
  RAISE NOTICE '✅ Dr. Paul Nguema créé avec succès (dr.nguema@sogara.com)';
END $$;

-- =====================================================
-- VÉRIFICATION DES COMPTES CRÉÉS
-- =====================================================
SELECT 
  p.full_name AS "👤 Nom Complet",
  au.email AS "📧 Email",
  ur.role AS "🎭 Rôle",
  prof.numero_ordre AS "🆔 Matricule",
  prof.specialite AS "🏥 Département",
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Actif' 
    ELSE '❌ Inactif' 
  END AS "📊 Statut"
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.user_roles ur ON ur.user_id = au.id
LEFT JOIN public.professionals prof ON prof.user_id = au.id
WHERE au.email IN (
  'admin@sogara.com',
  'directeur@sogara.com',
  'dr.okemba@sogara.com',
  'dr.nguema@sogara.com'
)
ORDER BY au.email;

-- =====================================================
-- RÉSULTAT ATTENDU
-- =====================================================
-- 4 lignes avec tous les comptes actifs
-- Rôles: 2x 'hospital', 2x 'doctor'
-- Tous les champs doivent être remplis
-- =====================================================
