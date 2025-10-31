-- ================================================================
-- Script de Correction du Rôle de Nadège Oyono
-- Supprime les rôles incorrects et force le rôle réceptionniste
-- ================================================================

-- 1. Trouver l'ID de Nadège Oyono
DO $$
DECLARE
  v_user_id uuid;
  v_prof_id uuid;
BEGIN
  -- Récupérer l'utilisateur Nadège
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'nadege.oyono@sogara.ga';
  
  IF v_user_id IS NULL THEN
    RAISE NOTICE '❌ Utilisateur Nadège Oyono non trouvé. Créez d''abord le compte.';
    RETURN;
  END IF;
  
  RAISE NOTICE '✅ Utilisateur trouvé: %', v_user_id;
  
  -- 2. Supprimer TOUS les anciens rôles/profils
  DELETE FROM establishment_staff 
  WHERE professional_id IN (
    SELECT id FROM professionals WHERE user_id = v_user_id
  );
  RAISE NOTICE '✅ Anciens rôles supprimés';
  
  -- 3. Supprimer et recréer le profil professionnel
  DELETE FROM professionals WHERE user_id = v_user_id;
  
  INSERT INTO professionals (
    id,
    user_id,
    category,  -- IMPORTANT: 'receptionist'
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
    'receptionist',  -- ⚠️ CATEGORIE RECEPTIONNISTE
    'Nadège Oyono',
    true,
    'REC-SOGARA-2025-001',
    '+241 01 55 26 21',
    'Port-Gentil',
    NOW()
  )
  RETURNING id INTO v_prof_id;
  
  RAISE NOTICE '✅ Profil réceptionniste créé: %', v_prof_id;
  
  -- 4. Créer l'affectation UNIQUE de réceptionniste
  INSERT INTO establishment_staff (
    id,
    professional_id,
    establishment_id,
    department_id,
    role,  -- IMPORTANT: 'receptionist'
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
    'receptionist',  -- ⚠️ ROLE RECEPTIONNISTE
    'Réceptionniste',
    false,
    false,
    'active',
    'REC-SOGARA-2025-001',
    jsonb_build_object(
      'appointments', jsonb_build_array('view', 'add', 'edit'),
      'patients', jsonb_build_array('view'),
      'consultations', jsonb_build_array('view')
    ),
    NOW()
  );
  
  RAISE NOTICE '✅ Rôle réceptionniste attribué';
  
  -- 5. Mettre à jour les métadonnées utilisateur
  UPDATE auth.users
  SET 
    raw_user_meta_data = jsonb_build_object(
      'full_name', 'Nadège Oyono',
      'role', 'receptionist',  -- ⚠️ ROLE META = receptionist
      'category', 'receptionist',
      'matricule', 'REC-SOGARA-2025-001'
    ),
    updated_at = NOW()
  WHERE id = v_user_id;
  
  RAISE NOTICE '✅ Métadonnées utilisateur mises à jour';
  
END $$;

-- 6. Vérification finale
SELECT 
  'VERIFICATION FINALE' as step,
  u.email,
  u.raw_user_meta_data->>'role' as meta_role,
  p.category as professional_category,
  es.role as staff_role,
  es.position,
  es.matricule
FROM auth.users u
JOIN professionals p ON p.user_id = u.id
JOIN establishment_staff es ON es.professional_id = p.id
WHERE u.email = 'nadege.oyono@sogara.ga';

-- 7. Vérifier qu'il n'y a qu'UN SEUL rôle
SELECT 
  'NOMBRE DE ROLES' as verification,
  COUNT(*) as nombre_roles,
  array_agg(es.role) as roles_trouves
FROM establishment_staff es
WHERE es.professional_id IN (
  SELECT p.id FROM professionals p
  JOIN auth.users u ON u.id = p.user_id
  WHERE u.email = 'nadege.oyono@sogara.ga'
);

-- ================================================================
-- RÉSULTAT ATTENDU:
-- ✅ 1 seul rôle : 'receptionist'
-- ✅ Catégorie : 'receptionist'
-- ✅ Position : 'Réceptionniste'
-- ✅ Pas de rôle 'director' ou 'doctor'
-- ================================================================
