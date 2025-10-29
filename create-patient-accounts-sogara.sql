-- =====================================================
-- CRÉATION DES COMPTES PATIENTS POUR EMPLOYÉS SOGARA
-- =====================================================
-- Ce script crée des comptes patients pour les employés SOGARA
-- permettant un double accès : professionnel ET patient
-- =====================================================

-- 1️⃣ PIERRETTE NOMSI - Compte Patient
DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_password TEXT;
BEGIN
  -- Mot de passe patient
  v_encrypted_password := crypt('Nomsi@Patient2024', gen_salt('bf'));
  
  -- Créer le compte patient
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
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'pierrette.nomsi@gmail.com', -- Email personnel différent du professionnel
    v_encrypted_password,
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'full_name', 'Pierrette NOMSI',
      'date_of_birth', '1985-04-15',
      'phone', '+241 07 45 67 89',
      'gender', 'female',
      'blood_group', 'O+',
      'emergency_contact', jsonb_build_object(
        'name', 'Jean NOMSI',
        'relationship', 'Époux',
        'phone', '+241 07 45 67 90'
      )
    ),
    NOW(),
    NOW()
  ) ON CONFLICT (email) DO UPDATE
  SET 
    encrypted_password = v_encrypted_password,
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  -- Créer le profil patient
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    date_of_birth,
    gender,
    address,
    city,
    country
  ) VALUES (
    v_user_id,
    'Pierrette NOMSI',
    'pierrette.nomsi@gmail.com',
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
    gender = EXCLUDED.gender;
  
  -- Assigner le rôle patient
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Créer le dossier médical
  INSERT INTO public.medical_records (
    patient_id,
    record_number,
    blood_group,
    allergies,
    chronic_conditions,
    current_medications,
    created_at
  ) VALUES (
    v_user_id,
    'MR-NOMSI-2024-001',
    'O+',
    ARRAY['Pénicilline'],
    ARRAY['Hypertension légère'],
    ARRAY['Amlodipine 5mg - 1x/jour'],
    NOW()
  ) ON CONFLICT (patient_id) DO UPDATE
  SET 
    blood_group = EXCLUDED.blood_group,
    allergies = EXCLUDED.allergies,
    chronic_conditions = EXCLUDED.chronic_conditions,
    current_medications = EXCLUDED.current_medications;
  
  -- Créer l'historique médical
  -- Consultation 1 - Médecin généraliste Port-Gentil
  INSERT INTO public.consultations (
    patient_id,
    doctor_name,
    establishment,
    consultation_date,
    reason,
    diagnosis,
    prescription,
    notes
  ) VALUES (
    v_user_id,
    'Dr. Jean-Marc OBIANG',
    'Cabinet Médical du Centre - Port-Gentil',
    '2024-03-15',
    'Fatigue persistante',
    'Surmenage professionnel',
    'Repos, vitamines B12',
    'Patiente en bonne santé générale, stress lié au travail'
  );
  
  -- Consultation 2 - Radiologie
  INSERT INTO public.medical_exams (
    patient_id,
    exam_type,
    exam_date,
    establishment,
    doctor_name,
    results,
    report
  ) VALUES (
    v_user_id,
    'Radiographie Thoracique',
    '2024-05-20',
    'Centre d''Imagerie Médicale de Port-Gentil',
    'Dr. Sylvie MENGUE',
    'Normal',
    'Radiographie thoracique de face : pas d''anomalie décelée. Silhouette cardiaque normale.'
  );
  
  -- Consultations CMST SOGARA
  INSERT INTO public.consultations (
    patient_id,
    doctor_name,
    establishment,
    consultation_date,
    reason,
    diagnosis,
    prescription,
    notes
  ) VALUES 
  (
    v_user_id,
    'Dr. Marie OKEMBA',
    'CMST SOGARA',
    '2024-06-10',
    'Visite médicale annuelle',
    'Apte au travail',
    'Aucune',
    'Visite médicale périodique - RAS'
  ),
  (
    v_user_id,
    'Dr. Paul NGUEMA',
    'CMST SOGARA',
    '2024-09-18',
    'Céphalées',
    'Migraine de tension',
    'Paracétamol 1g, repos',
    'Consultation aux urgences CMST'
  ),
  (
    v_user_id,
    'Dr. Marie OKEMBA',
    'CMST SOGARA',
    '2024-10-18',
    'Suivi hypertension',
    'HTA contrôlée',
    'Poursuite Amlodipine',
    'Tension 13/8, bien équilibrée sous traitement'
  );
  
  -- Analyses laboratoire
  INSERT INTO public.lab_results (
    patient_id,
    exam_date,
    establishment,
    test_type,
    results,
    reference_values,
    status
  ) VALUES (
    v_user_id,
    '2024-06-10',
    'Laboratoire CMST SOGARA',
    'Bilan sanguin complet',
    jsonb_build_object(
      'Hémoglobine', '13.5 g/dL',
      'Glycémie', '0.95 g/L',
      'Cholestérol total', '1.85 g/L',
      'Créatinine', '8 mg/L'
    ),
    jsonb_build_object(
      'Hémoglobine', '12-16 g/dL',
      'Glycémie', '0.70-1.10 g/L',
      'Cholestérol total', '< 2.0 g/L',
      'Créatinine', '6-13 mg/L'
    ),
    'Normal'
  );
  
  -- Rendez-vous futurs
  INSERT INTO public.appointments (
    patient_id,
    doctor_name,
    establishment,
    appointment_date,
    appointment_time,
    reason,
    status
  ) VALUES (
    v_user_id,
    'Dr. Marie OKEMBA',
    'CMST SOGARA',
    '2025-01-18',
    '10:00',
    'Suivi hypertension',
    'confirmed'
  );
  
  RAISE NOTICE '✅ Compte patient créé pour Pierrette NOMSI (pierrette.nomsi@gmail.com)';
END $$;

-- =====================================================
-- 2️⃣ AUTRES COMPTES PATIENTS POUR EMPLOYÉS SOGARA
-- =====================================================

-- Christian AVARO - Compte Patient
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'christian.avaro.perso@gmail.com',
    crypt('Avaro@Patient2024', gen_salt('bf')),
    NOW(),
    jsonb_build_object(
      'full_name', 'Christian AVARO',
      'date_of_birth', '1970-08-12',
      'phone', '+241 07 01 02 03',
      'gender', 'male',
      'blood_group', 'A+'
    ),
    NOW(), NOW()
  ) ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_user_id;
  
  IF v_user_id IS NOT NULL THEN
    -- Profil
    INSERT INTO public.profiles (id, full_name, email, phone, date_of_birth, gender, city)
    VALUES (v_user_id, 'Christian AVARO', 'christian.avaro.perso@gmail.com', 
            '+241 07 01 02 03', '1970-08-12', 'male', 'Port-Gentil')
    ON CONFLICT (id) DO NOTHING;
    
    -- Rôle
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'patient')
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '✅ Compte patient créé pour Christian AVARO';
  END IF;
END $$;

-- Ingride TCHEN - Compte Patient
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'ingride.tchen@gmail.com',
    crypt('Tchen@Patient2024', gen_salt('bf')),
    NOW(),
    jsonb_build_object(
      'full_name', 'Ingride TCHEN',
      'date_of_birth', '1982-03-25',
      'phone', '+241 07 04 05 06',
      'gender', 'female',
      'blood_group', 'B+'
    ),
    NOW(), NOW()
  ) ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_user_id;
  
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name, email, phone, date_of_birth, gender, city)
    VALUES (v_user_id, 'Ingride TCHEN', 'ingride.tchen@gmail.com', 
            '+241 07 04 05 06', '1982-03-25', 'female', 'Port-Gentil')
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'patient')
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '✅ Compte patient créé pour Ingride TCHEN';
  END IF;
END $$;

-- =====================================================
-- RÉSUMÉ DES COMPTES
-- =====================================================
SELECT 
  'PATIENTS' as "Type",
  p.full_name AS "Nom",
  au.email AS "Email",
  CASE 
    WHEN au.email = 'pierrette.nomsi@gmail.com' THEN 'Nomsi@Patient2024'
    WHEN au.email = 'christian.avaro.perso@gmail.com' THEN 'Avaro@Patient2024'
    WHEN au.email = 'ingride.tchen@gmail.com' THEN 'Tchen@Patient2024'
  END AS "Mot de passe",
  'patient' AS "Rôle"
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
WHERE au.email IN (
  'pierrette.nomsi@gmail.com',
  'christian.avaro.perso@gmail.com',
  'ingride.tchen@gmail.com'
)

UNION ALL

SELECT 
  'PROFESSIONNELS' as "Type",
  p.full_name AS "Nom",
  au.email AS "Email",
  CASE 
    WHEN au.email = 'admin@sogara.com' THEN 'Admin@SOGARA2024'
    WHEN au.email = 'directeur@sogara.com' THEN 'DirecteurSOGARA2024!'
    WHEN au.email = 'dr.okemba@sogara.com' THEN 'Okemba@2024Med'
    WHEN au.email = 'dr.nguema@sogara.com' THEN 'Nguema@Urgence24'
  END AS "Mot de passe",
  ur.role AS "Rôle"
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.user_roles ur ON ur.user_id = au.id
WHERE au.email LIKE '%sogara.com%'
ORDER BY "Type", "Nom";

-- =====================================================
-- FIN DU SCRIPT
-- Résultat: Comptes patients créés avec historique médical
-- =====================================================
