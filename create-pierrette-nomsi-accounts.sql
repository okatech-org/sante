-- =====================================================
-- CONFIGURATION DU COMPTE PATIENT POUR PIERRETTE NOMSI
-- =====================================================
-- ⚠️ IMPORTANT : Créez d'abord l'utilisateur via Supabase Dashboard
-- Authentication > Users > Add User
-- Email: pierrette.nomsi@gmail.com
-- Password: Nomsi@Patient2024
-- ✅ COCHER "Auto Confirm User"
-- =====================================================
-- Pierrette NOMSI est employée SOGARA (Chef QUALITÉ)
-- Elle bénéficie des soins au CMST SOGARA
-- Compte PATIENT uniquement (pas professionnel de santé)
-- =====================================================

-- 1️⃣ CONFIGURATION DU PROFIL PATIENT - pierrette.nomsi@gmail.com
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Récupérer l'ID de l'utilisateur depuis auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'pierrette.nomsi@gmail.com';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Utilisateur pierrette.nomsi@gmail.com non trouvé. Créez d''abord le compte via Supabase Dashboard > Authentication > Users';
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
