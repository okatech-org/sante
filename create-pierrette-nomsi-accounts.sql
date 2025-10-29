-- =====================================================
-- CRÉATION DU COMPTE PATIENT POUR PIERRETTE NOMSI
-- =====================================================
-- Pierrette NOMSI est employée SOGARA (Chef QUALITÉ)
-- Elle bénéficie des soins au CMST SOGARA
-- Compte PATIENT uniquement (pas professionnel de santé)
-- =====================================================

-- 1️⃣ COMPTE PATIENT - pierrette.nomsi@gmail.com
DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_password TEXT;
BEGIN
  v_encrypted_password := crypt('Nomsi@Patient2024', gen_salt('bf'));
  
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
    'pierrette.nomsi@gmail.com',
    v_encrypted_password,
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'full_name', 'Pierrette NOMSI',
      'date_of_birth', '1985-04-15',
      'phone', '+241 07 45 67 89',
      'gender', 'female',
      'blood_group', 'O+'
    ),
    NOW(),
    NOW()
  ) ON CONFLICT (email) DO UPDATE
  SET 
    encrypted_password = v_encrypted_password,
    email_confirmed_at = NOW(),
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'pierrette.nomsi@gmail.com';
  END IF;
  
  -- Créer le profil
  INSERT INTO public.profiles (id, full_name, email, phone, date_of_birth, gender, city, country)
  VALUES (
    v_user_id,
    'Pierrette NOMSI',
    'pierrette.nomsi@gmail.com',
    '+241 07 45 67 89',
    '1985-04-15',
    'female',
    'Port-Gentil',
    'Gabon'
  ) ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;
  
  -- Assigner le rôle patient
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE '✅ Compte PATIENT créé: pierrette.nomsi@gmail.com / Nomsi@Patient2024';
END $$;

-- =====================================================
-- VÉRIFICATION
-- =====================================================
SELECT 
  p.full_name AS "Nom",
  au.email AS "Email",
  'Nomsi@Patient2024' AS "Mot de passe",
  ur.role AS "Rôle",
  p.city AS "Ville",
  CASE WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Confirmé' ELSE '❌ Non confirmé' END AS "Statut"
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.user_roles ur ON ur.user_id = au.id
WHERE au.email = 'pierrette.nomsi@gmail.com';

-- =====================================================
-- RÉSULTAT ATTENDU:
-- 1 ligne:
-- Pierrette NOMSI | pierrette.nomsi@gmail.com | Nomsi@Patient2024 | patient | Port-Gentil | ✅ Confirmé
-- =====================================================

-- NOTE IMPORTANTE:
-- Pierrette NOMSI est employée SOGARA (Chef QUALITÉ)
-- Elle n'est PAS une professionnelle de santé
-- Elle a uniquement un compte PATIENT pour bénéficier des soins au CMST
-- Son profil employé reste dans la base RH SOGARA (EMP-SOGARA-0006)
