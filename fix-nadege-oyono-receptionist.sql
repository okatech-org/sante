-- ============================================================================
-- CORRECTION COMPLÈTE DU COMPTE NADÈGE OYONO - RÉCEPTIONNISTE SOGARA
-- Date: 31 octobre 2025
-- ============================================================================

-- 1. RÉCUPÉRATION DE L'ID UTILISATEUR
DO $$
DECLARE
  v_user_id UUID;
  v_establishment_id UUID;
  v_professional_id UUID;
BEGIN
  -- Récupérer l'ID utilisateur
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'nadege.oyono@sogara.ga';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur nadege.oyono@sogara.ga non trouvé';
  END IF;

  -- Récupérer l'ID de l'établissement SOGARA
  SELECT id INTO v_establishment_id
  FROM establishments
  WHERE name = 'CMST SOGARA'
  LIMIT 1;

  IF v_establishment_id IS NULL THEN
    RAISE EXCEPTION 'Établissement CMST SOGARA non trouvé';
  END IF;

  RAISE NOTICE 'User ID: %, Establishment ID: %', v_user_id, v_establishment_id;

  -- 2. MISE À JOUR DU RÔLE DANS PROFILES
  UPDATE profiles
  SET 
    role = 'receptionist',
    updated_at = NOW()
  WHERE id = v_user_id;

  RAISE NOTICE 'Rôle mis à jour vers receptionist dans profiles';

  -- 3. CRÉATION/MISE À JOUR DU PROFIL PROFESSIONNEL
  INSERT INTO professionals (
    id,
    user_id,
    specialty,
    license_number,
    years_of_experience,
    bio,
    consultation_fee,
    languages,
    education,
    professional_category,
    consultation_duration,
    accepts_new_patients,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_user_id,
    'Réception et Accueil',
    'REC-SOGARA-2025-001',
    2,
    'Réceptionniste au CMST SOGARA, gestion des rendez-vous et accueil des patients.',
    0,
    ARRAY['Français'],
    ARRAY['Formation en gestion administrative et accueil'],
    'administrative_staff',
    30,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    specialty = 'Réception et Accueil',
    license_number = 'REC-SOGARA-2025-001',
    years_of_experience = 2,
    bio = 'Réceptionniste au CMST SOGARA, gestion des rendez-vous et accueil des patients.',
    consultation_fee = 0,
    languages = ARRAY['Français'],
    education = ARRAY['Formation en gestion administrative et accueil'],
    professional_category = 'administrative_staff',
    consultation_duration = 30,
    accepts_new_patients = true,
    updated_at = NOW();

  RAISE NOTICE 'Profil professionnel créé/mis à jour';

  -- 4. AFFECTATION À L'ÉTABLISSEMENT SOGARA
  INSERT INTO establishment_users (
    establishment_id,
    user_id,
    role,
    permissions,
    is_primary,
    created_at,
    updated_at
  ) VALUES (
    v_establishment_id,
    v_user_id,
    'receptionist',
    ARRAY['manage_appointments', 'view_patients', 'check_in_patients', 'manage_queue'],
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (establishment_id, user_id)
  DO UPDATE SET
    role = 'receptionist',
    permissions = ARRAY['manage_appointments', 'view_patients', 'check_in_patients', 'manage_queue'],
    is_primary = true,
    updated_at = NOW();

  RAISE NOTICE 'Affectation à SOGARA créée/mise à jour';

  -- 5. CRÉATION DU PROFIL STAFF
  INSERT INTO establishment_staff (
    establishment_id,
    user_id,
    role,
    department,
    position,
    hire_date,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    v_establishment_id,
    v_user_id,
    'receptionist',
    'Administration',
    'Réceptionniste',
    '2023-01-15',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (establishment_id, user_id)
  DO UPDATE SET
    role = 'receptionist',
    department = 'Administration',
    position = 'Réceptionniste',
    is_active = true,
    updated_at = NOW();

  RAISE NOTICE 'Profil staff créé/mis à jour';

  -- 6. VÉRIFICATION FINALE
  RAISE NOTICE '✅ Correction complète du compte Nadège Oyono terminée';
  RAISE NOTICE 'Email: nadege.oyono@sogara.ga';
  RAISE NOTICE 'Mot de passe: Sogara2025!';
  RAISE NOTICE 'Rôle: receptionist';
  RAISE NOTICE 'Établissement: CMST SOGARA';
  
END $$;

-- ============================================================================
-- VÉRIFICATION DES DONNÉES
-- ============================================================================

SELECT 
  'PROFIL PRINCIPAL' as section,
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.updated_at
FROM profiles p
WHERE p.email = 'nadege.oyono@sogara.ga';

SELECT 
  'PROFIL PROFESSIONNEL' as section,
  pr.id,
  pr.specialty,
  pr.license_number,
  pr.professional_category
FROM professionals pr
JOIN profiles p ON p.id = pr.user_id
WHERE p.email = 'nadege.oyono@sogara.ga';

SELECT 
  'AFFECTATION ÉTABLISSEMENT' as section,
  e.name as etablissement,
  eu.role,
  eu.permissions,
  eu.is_primary
FROM establishment_users eu
JOIN establishments e ON e.id = eu.establishment_id
JOIN profiles p ON p.id = eu.user_id
WHERE p.email = 'nadege.oyono@sogara.ga';

SELECT 
  'STAFF' as section,
  e.name as etablissement,
  es.role,
  es.department,
  es.position,
  es.is_active
FROM establishment_staff es
JOIN establishments e ON e.id = es.establishment_id
JOIN profiles p ON p.id = es.user_id
WHERE p.email = 'nadege.oyono@sogara.ga';

