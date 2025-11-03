-- ================================================================
-- RESTAURATION DES EMPLOYÉS SOGARA (PATIENTS AU CMST)
-- ================================================================
-- Ce script restaure les comptes patients pour les employés SOGARA
-- ayant droit aux soins au Centre de Médecine de Santé au Travail
-- ================================================================
-- Date: Décembre 2024
-- ================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🏥 RESTAURATION EMPLOYÉS SOGARA - PATIENTS CMST';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '';
END $$;

-- ================================================================
-- 1️⃣ PIERRETTE NOMSI - Chef QUALITÉ et CONFORMITÉ
-- ================================================================
DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_password TEXT;
BEGIN
  RAISE NOTICE '1️⃣ Restauration de Pierrette NOMSI...';
  
  v_encrypted_password := crypt('PatientSOGARA2024!', gen_salt('bf'));
  
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'pierrette.nomsi@sogara.ga',
    v_encrypted_password,
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'full_name', 'Pierrette NOMSI',
      'date_of_birth', '1985-04-15',
      'phone', '+241 07 45 67 89',
      'gender', 'female',
      'blood_group', 'O+',
      'employee_id', 'EMP-SOGARA-0006',
      'employee_position', 'Chef QUALITÉ et CONFORMITÉ',
      'employee_department', 'Qualité',
      'employer', 'SOGARA'
    ),
    NOW(), NOW()
  ) ON CONFLICT (email) DO UPDATE
  SET 
    encrypted_password = v_encrypted_password,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  INSERT INTO public.profiles (
    id, full_name, email, phone, date_of_birth, gender, 
    address, city, country
  ) VALUES (
    v_user_id,
    'Pierrette NOMSI',
    'pierrette.nomsi@sogara.ga',
    '+241 07 45 67 89',
    '1985-04-15',
    'female',
    'Quartier Nouveau Port',
    'Port-Gentil',
    'Gabon'
  ) ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    date_of_birth = EXCLUDED.date_of_birth,
    gender = EXCLUDED.gender,
    city = EXCLUDED.city;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE '   ✅ Pierrette NOMSI restaurée (Chef QUALITÉ)';
END $$;

-- ================================================================
-- 2️⃣ CHRISTIAN AVARO - Directeur Général
-- ================================================================
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  RAISE NOTICE '2️⃣ Restauration de Christian AVARO...';
  
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'christian.avaro@sogara.ga',
    crypt('PatientSOGARA2024!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'full_name', 'Christian AVARO',
      'date_of_birth', '1970-08-12',
      'phone', '+241 07 01 02 03',
      'gender', 'male',
      'blood_group', 'A+',
      'employee_id', 'EMP-SOGARA-0001',
      'employee_position', 'Directeur Général',
      'employee_department', 'Direction Générale',
      'employer', 'SOGARA'
    ),
    NOW(), NOW()
  ) ON CONFLICT (email) DO UPDATE
  SET 
    encrypted_password = crypt('PatientSOGARA2024!', gen_salt('bf')),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  INSERT INTO public.profiles (
    id, full_name, email, phone, date_of_birth, gender, city, country
  ) VALUES (
    v_user_id, 'Christian AVARO', 'christian.avaro@sogara.ga', 
    '+241 07 01 02 03', '1970-08-12', 'male', 'Port-Gentil', 'Gabon'
  ) ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE '   ✅ Christian AVARO restauré (Directeur Général)';
END $$;

-- ================================================================
-- 3️⃣ INGRIDE TCHEN - Directrice Financière
-- ================================================================
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  RAISE NOTICE '3️⃣ Restauration d''Ingride TCHEN...';
  
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'ingride.tchen@sogara.ga',
    crypt('PatientSOGARA2024!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'full_name', 'Ingride TCHEN',
      'date_of_birth', '1982-03-25',
      'phone', '+241 07 04 05 06',
      'gender', 'female',
      'blood_group', 'B+',
      'employee_id', 'EMP-SOGARA-0002',
      'employee_position', 'Directrice Financière',
      'employee_department', 'Finance',
      'employer', 'SOGARA'
    ),
    NOW(), NOW()
  ) ON CONFLICT (email) DO UPDATE
  SET 
    encrypted_password = crypt('PatientSOGARA2024!', gen_salt('bf')),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  INSERT INTO public.profiles (
    id, full_name, email, phone, date_of_birth, gender, city, country
  ) VALUES (
    v_user_id, 'Ingride TCHEN', 'ingride.tchen@sogara.ga', 
    '+241 07 04 05 06', '1982-03-25', 'female', 'Port-Gentil', 'Gabon'
  ) ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE '   ✅ Ingride TCHEN restaurée (Directrice Financière)';
END $$;

-- ================================================================
-- 4️⃣ JEAN NZENGUE - Chef Production
-- ================================================================
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  RAISE NOTICE '4️⃣ Restauration de Jean NZENGUE...';
  
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'jean.nzengue@sogara.ga',
    crypt('PatientSOGARA2024!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'full_name', 'Jean NZENGUE',
      'date_of_birth', '1978-09-20',
      'phone', '+241 07 11 22 33',
      'gender', 'male',
      'blood_group', 'O-',
      'employee_id', 'EMP-SOGARA-0003',
      'employee_position', 'Chef Production',
      'employee_department', 'Production',
      'employer', 'SOGARA'
    ),
    NOW(), NOW()
  ) ON CONFLICT (email) DO UPDATE
  SET 
    encrypted_password = crypt('PatientSOGARA2024!', gen_salt('bf')),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  INSERT INTO public.profiles (
    id, full_name, email, phone, date_of_birth, gender, city, country
  ) VALUES (
    v_user_id, 'Jean NZENGUE', 'jean.nzengue@sogara.ga', 
    '+241 07 11 22 33', '1978-09-20', 'male', 'Port-Gentil', 'Gabon'
  ) ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE '   ✅ Jean NZENGUE restauré (Chef Production)';
END $$;

-- ================================================================
-- 5️⃣ MARIE MOUSSAVOU - Responsable HSE
-- ================================================================
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  RAISE NOTICE '5️⃣ Restauration de Marie MOUSSAVOU...';
  
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'marie.moussavou@sogara.ga',
    crypt('PatientSOGARA2024!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'full_name', 'Marie MOUSSAVOU',
      'date_of_birth', '1987-06-14',
      'phone', '+241 07 22 33 44',
      'gender', 'female',
      'blood_group', 'AB+',
      'employee_id', 'EMP-SOGARA-0004',
      'employee_position', 'Responsable HSE',
      'employee_department', 'Hygiène Sécurité Environnement',
      'employer', 'SOGARA'
    ),
    NOW(), NOW()
  ) ON CONFLICT (email) DO UPDATE
  SET 
    encrypted_password = crypt('PatientSOGARA2024!', gen_salt('bf')),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  INSERT INTO public.profiles (
    id, full_name, email, phone, date_of_birth, gender, city, country
  ) VALUES (
    v_user_id, 'Marie MOUSSAVOU', 'marie.moussavou@sogara.ga', 
    '+241 07 22 33 44', '1987-06-14', 'female', 'Port-Gentil', 'Gabon'
  ) ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE '   ✅ Marie MOUSSAVOU restaurée (Responsable HSE)';
END $$;

-- ================================================================
-- 6️⃣ PAUL OBAME - Chef Maintenance
-- ================================================================
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  RAISE NOTICE '6️⃣ Restauration de Paul OBAME...';
  
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'paul.obame@sogara.ga',
    crypt('PatientSOGARA2024!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'full_name', 'Paul OBAME',
      'date_of_birth', '1975-11-08',
      'phone', '+241 07 33 44 55',
      'gender', 'male',
      'blood_group', 'A-',
      'employee_id', 'EMP-SOGARA-0005',
      'employee_position', 'Chef Maintenance',
      'employee_department', 'Maintenance',
      'employer', 'SOGARA'
    ),
    NOW(), NOW()
  ) ON CONFLICT (email) DO UPDATE
  SET 
    encrypted_password = crypt('PatientSOGARA2024!', gen_salt('bf')),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  INSERT INTO public.profiles (
    id, full_name, email, phone, date_of_birth, gender, city, country
  ) VALUES (
    v_user_id, 'Paul OBAME', 'paul.obame@sogara.ga', 
    '+241 07 33 44 55', '1975-11-08', 'male', 'Port-Gentil', 'Gabon'
  ) ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE '   ✅ Paul OBAME restauré (Chef Maintenance)';
END $$;

-- ================================================================
-- 7️⃣ ALAIN MOUSSAVOU - Technicien Raffinerie
-- ================================================================
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  RAISE NOTICE '7️⃣ Restauration d''Alain MOUSSAVOU...';
  
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'alain.moussavou@sogara.ga',
    crypt('PatientSOGARA2024!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'full_name', 'Alain MOUSSAVOU',
      'date_of_birth', '1990-02-18',
      'phone', '+241 07 44 55 66',
      'gender', 'male',
      'blood_group', 'B+',
      'employee_id', 'EMP-SOGARA-0007',
      'employee_position', 'Technicien Raffinerie',
      'employee_department', 'Production',
      'employer', 'SOGARA'
    ),
    NOW(), NOW()
  ) ON CONFLICT (email) DO UPDATE
  SET 
    encrypted_password = crypt('PatientSOGARA2024!', gen_salt('bf')),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  INSERT INTO public.profiles (
    id, full_name, email, phone, date_of_birth, gender, city, country
  ) VALUES (
    v_user_id, 'Alain MOUSSAVOU', 'alain.moussavou@sogara.ga', 
    '+241 07 44 55 66', '1990-02-18', 'male', 'Port-Gentil', 'Gabon'
  ) ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE '   ✅ Alain MOUSSAVOU restauré (Technicien Raffinerie)';
END $$;

-- ================================================================
-- 8️⃣ SYLVIE MENGUE - Assistante RH
-- ================================================================
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  RAISE NOTICE '8️⃣ Restauration de Sylvie MENGUE...';
  
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'sylvie.mengue@sogara.ga',
    crypt('PatientSOGARA2024!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'full_name', 'Sylvie MENGUE',
      'date_of_birth', '1992-07-22',
      'phone', '+241 07 55 66 77',
      'gender', 'female',
      'blood_group', 'O+',
      'employee_id', 'EMP-SOGARA-0008',
      'employee_position', 'Assistante RH',
      'employee_department', 'Ressources Humaines',
      'employer', 'SOGARA'
    ),
    NOW(), NOW()
  ) ON CONFLICT (email) DO UPDATE
  SET 
    encrypted_password = crypt('PatientSOGARA2024!', gen_salt('bf')),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  INSERT INTO public.profiles (
    id, full_name, email, phone, date_of_birth, gender, city, country
  ) VALUES (
    v_user_id, 'Sylvie MENGUE', 'sylvie.mengue@sogara.ga', 
    '+241 07 55 66 77', '1992-07-22', 'female', 'Port-Gentil', 'Gabon'
  ) ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE '   ✅ Sylvie MENGUE restaurée (Assistante RH)';
END $$;

-- ================================================================
-- RÉSUMÉ & VÉRIFICATION
-- ================================================================
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '✨ RESTAURATION TERMINÉE AVEC SUCCÈS!';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  
  SELECT COUNT(*) INTO v_count
  FROM auth.users au
  WHERE au.email LIKE '%@sogara.ga'
    AND au.email NOT LIKE 'directeur.sogara%'
    AND au.email NOT LIKE 'medecin%'
    AND au.email NOT LIKE 'infirmier%'
    AND au.email NOT LIKE 'admin.cmst%';
  
  RAISE NOTICE '📊 RÉSUMÉ:';
  RAISE NOTICE '   Total employés SOGARA patients: %', v_count;
  RAISE NOTICE '';
  RAISE NOTICE '👥 EMPLOYÉS RESTAURÉS:';
  RAISE NOTICE '   1. Pierrette NOMSI - Chef QUALITÉ';
  RAISE NOTICE '   2. Christian AVARO - Directeur Général';
  RAISE NOTICE '   3. Ingride TCHEN - Directrice Financière';
  RAISE NOTICE '   4. Jean NZENGUE - Chef Production';
  RAISE NOTICE '   5. Marie MOUSSAVOU - Responsable HSE';
  RAISE NOTICE '   6. Paul OBAME - Chef Maintenance';
  RAISE NOTICE '   7. Alain MOUSSAVOU - Technicien Raffinerie';
  RAISE NOTICE '   8. Sylvie MENGUE - Assistante RH';
  RAISE NOTICE '';
  RAISE NOTICE '🔑 INFORMATIONS DE CONNEXION:';
  RAISE NOTICE '   Email: [prenom.nom]@sogara.ga';
  RAISE NOTICE '   Mot de passe: PatientSOGARA2024!';
  RAISE NOTICE '   URL: /login/patient';
  RAISE NOTICE '';
  RAISE NOTICE '💡 CES EMPLOYÉS PEUVENT:';
  RAISE NOTICE '   ✅ Prendre rendez-vous au CMST SOGARA';
  RAISE NOTICE '   ✅ Accéder à leur dossier médical';
  RAISE NOTICE '   ✅ Consulter leurs résultats d''examens';
  RAISE NOTICE '   ✅ Gérer leurs prescriptions';
  RAISE NOTICE '   ✅ Bénéficier du suivi médical du travail';
  RAISE NOTICE '';
END $$;

-- ================================================================
-- LISTE COMPLÈTE DES COMPTES
-- ================================================================
SELECT 
  'EMPLOYÉ SOGARA (Patient)' as "Type",
  p.full_name AS "Nom Complet",
  au.email AS "Email",
  'PatientSOGARA2024!' AS "Mot de passe",
  (au.raw_user_meta_data->>'employee_position') AS "Poste",
  (au.raw_user_meta_data->>'employee_department') AS "Département",
  'Actif' AS "Statut"
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
WHERE au.email LIKE '%@sogara.ga'
  AND au.email NOT LIKE 'directeur.sogara%'
  AND au.email NOT LIKE 'medecin%'
  AND au.email NOT LIKE 'infirmier%'
  AND au.email NOT LIKE 'admin.cmst%'
ORDER BY p.full_name;

-- ================================================================
-- FIN DU SCRIPT
-- ================================================================

