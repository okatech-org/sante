-- =================================================================
-- Script SQL pour créer le compte de Nadège Oyono
-- Réceptionniste / Accueil - Centre Médical SOGARA
-- À exécuter dans l'éditeur SQL de Supabase
-- =================================================================

-- 1. Vérifier si l'établissement SOGARA existe
INSERT INTO establishments (
  id,
  name,
  type,
  sub_type,
  address,
  city,
  phone,
  is_active,
  created_at
)
VALUES (
  'sogara-cmst-001',
  'Centre Médical de Santé au Travail SOGARA',
  'hospital',
  'company_hospital',
  'Zone SOGARA',
  'Port-Gentil',
  '011 55 26 21',
  true,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Créer le département Accueil s'il n'existe pas
INSERT INTO establishment_departments (
  id, 
  establishment_id, 
  name, 
  code, 
  created_at
)
VALUES (
  'sogara-dept-acc', 
  'sogara-cmst-001', 
  'Accueil', 
  'ACC', 
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 3. Créer l'utilisateur et le profil professionnel
DO $$
DECLARE
  v_user_id uuid;
  v_prof_id uuid;
  v_email text := 'nadege.oyono@sogara.ga';
  v_password text := 'Sogara2025!';
BEGIN
  -- Vérifier si l'utilisateur existe déjà
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  
  IF v_user_id IS NULL THEN
    -- Créer l'utilisateur dans auth.users
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
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      NOW(),
      jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
      jsonb_build_object(
        'full_name', 'Nadège Oyono',
        'role', 'receptionist'
      ),
      NOW(),
      NOW(),
      '',
      ''
    )
    RETURNING id INTO v_user_id;
    
    RAISE NOTICE '✅ Utilisateur créé avec l''ID: %', v_user_id;
  ELSE
    RAISE NOTICE '⚠️  L''utilisateur existe déjà avec l''email: %', v_email;
  END IF;

  -- Créer le profil professionnel
  INSERT INTO professionals (
    id, 
    user_id, 
    category, 
    full_name, 
    is_verified,
    license_number,
    phone,
    city,
    created_at
  )
  VALUES (
    gen_random_uuid(), 
    v_user_id, 
    'receptionist', 
    'Nadège Oyono',
    true,
    'REC-002',
    '+241 07 XX XX XX',
    'Port-Gentil',
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    category = EXCLUDED.category,
    license_number = EXCLUDED.license_number,
    is_verified = EXCLUDED.is_verified
  RETURNING id INTO v_prof_id;

  RAISE NOTICE '✅ Profil professionnel créé avec l''ID: %', v_prof_id;

  -- Ajouter à establishment_staff
  INSERT INTO establishment_staff (
    id, 
    professional_id, 
    establishment_id, 
    department_id, 
    role, 
    position,
    is_department_head, 
    is_establishment_admin, 
    status, 
    matricule,
    permissions, 
    created_at
  )
  VALUES (
    gen_random_uuid(), 
    v_prof_id, 
    'sogara-cmst-001', 
    'sogara-dept-acc',
    'receptionist', 
    'Réceptionniste',
    false, 
    false, 
    'active', 
    'REC-002',
    jsonb_build_object(
      'appointments', jsonb_build_array('view', 'add', 'edit'),
      'patients', jsonb_build_array('view'),
      'consultations', jsonb_build_array('view')
    ),
    NOW()
  )
  ON CONFLICT (professional_id, establishment_id) DO UPDATE SET
    role = EXCLUDED.role,
    position = EXCLUDED.position,
    department_id = EXCLUDED.department_id,
    matricule = EXCLUDED.matricule,
    permissions = EXCLUDED.permissions,
    status = 'active';

  RAISE NOTICE '✅ Ajouté au staff de l''établissement SOGARA';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Erreur: %', SQLERRM;
END $$;

-- 4. Vérification du compte créé
SELECT 
  u.email,
  u.id as user_id,
  p.id as professional_id,
  p.full_name,
  p.category,
  p.license_number as matricule,
  es.role,
  es.position,
  ed.name as department,
  e.name as establishment,
  es.status,
  es.is_establishment_admin,
  es.is_department_head
FROM auth.users u
JOIN professionals p ON p.user_id = u.id
JOIN establishment_staff es ON es.professional_id = p.id
JOIN establishments e ON e.id = es.establishment_id
LEFT JOIN establishment_departments ed ON ed.id = es.department_id
WHERE u.email = 'nadege.oyono@sogara.ga';

-- =================================================================
-- RÉSULTAT ATTENDU
-- =================================================================
-- 📧 Email            : nadege.oyono@sogara.ga
-- 🔐 Mot de passe     : Sogara2025!
-- 👤 Nom complet      : Nadège Oyono
-- 💼 Rôle             : Réceptionniste
-- 🏢 Département      : Accueil
-- 🔢 Matricule        : REC-002
-- 🏥 Établissement    : Centre Médical de Santé au Travail SOGARA
-- 
-- 📱 Permissions:
--    • Gestion des rendez-vous (voir, ajouter, modifier)
--    • Consultation des dossiers patients (lecture)
--    • Accès aux consultations (lecture)
--
-- 🌐 URL de connexion : http://localhost:8080/login/professional
-- =================================================================

