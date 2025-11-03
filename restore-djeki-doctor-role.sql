-- ============================================================
-- RESTAURATION DU RÔLE MÉDECIN - DR. JULES DJEKI
-- Date: Décembre 2024
-- ============================================================
-- Ce script restaure le rôle "Médecin" pour Dr. Jules DJEKI
-- au CMST SOGARA en plus de son rôle de Directeur
-- ============================================================

DO $$
DECLARE
  v_user_id uuid;
  v_professional_id uuid;
  v_establishment_id uuid := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; -- CMST SOGARA
  v_dir_dept_id uuid;
  v_med_dept_id uuid;
  v_has_director_role boolean;
  v_has_doctor_role boolean;
BEGIN
  RAISE NOTICE '🔧 RESTAURATION DU RÔLE MÉDECIN - DR. JULES DJEKI';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  
  -- 1. Rechercher le compte Dr. DJEKI
  RAISE NOTICE '';
  RAISE NOTICE '1️⃣ Recherche du compte Dr. DJEKI...';
  
  SELECT id INTO v_user_id
  FROM profiles
  WHERE email = 'directeur.sogara@sante.ga';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Compte directeur.sogara@sante.ga non trouvé';
  END IF;
  
  RAISE NOTICE '✅ Compte trouvé (User ID: %)', v_user_id;
  
  -- 2. Vérifier/Créer le profil professionnel
  RAISE NOTICE '';
  RAISE NOTICE '2️⃣ Vérification du profil professionnel...';
  
  SELECT id INTO v_professional_id
  FROM professionals
  WHERE user_id = v_user_id;
  
  IF v_professional_id IS NULL THEN
    RAISE NOTICE '⚠️  Aucun profil professionnel, création...';
    
    INSERT INTO professionals (
      user_id,
      email,
      full_name,
      professional_type,
      specialty,
      numero_ordre,
      gender,
      title,
      birth_date,
      nationality,
      status,
      verified,
      documents_verified,
      verification_date
    ) VALUES (
      v_user_id,
      'directeur.sogara@sante.ga',
      'Dr. Jules DJEKI',
      'medecin_generaliste',
      'Médecine Générale / Administration',
      'MED-GA-2024-001',
      'homme',
      'docteur',
      '1975-06-15',
      'Gabonaise',
      'actif',
      true,
      true,
      NOW()
    ) RETURNING id INTO v_professional_id;
    
    RAISE NOTICE '✅ Profil professionnel créé (ID: %)', v_professional_id;
  ELSE
    RAISE NOTICE '✅ Profil professionnel existant (ID: %)', v_professional_id;
  END IF;
  
  -- 3. Vérifier les départements
  RAISE NOTICE '';
  RAISE NOTICE '3️⃣ Vérification des départements...';
  
  SELECT id INTO v_dir_dept_id
  FROM establishment_departments
  WHERE establishment_id = v_establishment_id AND code = 'DIR';
  
  SELECT id INTO v_med_dept_id
  FROM establishment_departments
  WHERE establishment_id = v_establishment_id AND code = 'MED';
  
  -- Créer le département médical s'il n'existe pas
  IF v_med_dept_id IS NULL THEN
    RAISE NOTICE '⚠️  Département médical absent, création...';
    
    INSERT INTO establishment_departments (
      establishment_id,
      code,
      name,
      description
    ) VALUES (
      v_establishment_id,
      'MED',
      'Service Médical',
      'Consultations et soins médicaux'
    ) RETURNING id INTO v_med_dept_id;
    
    RAISE NOTICE '✅ Département médical créé (ID: %)', v_med_dept_id;
  ELSE
    RAISE NOTICE '✅ Départements trouvés';
    RAISE NOTICE '   - Direction (ID: %)', v_dir_dept_id;
    RAISE NOTICE '   - Médical (ID: %)', v_med_dept_id;
  END IF;
  
  -- 4. Vérifier les rôles existants
  RAISE NOTICE '';
  RAISE NOTICE '4️⃣ Vérification des rôles existants...';
  
  SELECT EXISTS (
    SELECT 1 FROM establishment_staff
    WHERE professional_id = v_professional_id
    AND establishment_id = v_establishment_id
    AND role = 'director'
  ) INTO v_has_director_role;
  
  SELECT EXISTS (
    SELECT 1 FROM establishment_staff
    WHERE professional_id = v_professional_id
    AND establishment_id = v_establishment_id
    AND role = 'doctor'
  ) INTO v_has_doctor_role;
  
  RAISE NOTICE '   Rôle Directeur: %', CASE WHEN v_has_director_role THEN '✅ Présent' ELSE '❌ Absent' END;
  RAISE NOTICE '   Rôle Médecin: %', CASE WHEN v_has_doctor_role THEN '✅ Présent' ELSE '❌ Absent' END;
  
  IF v_has_doctor_role THEN
    RAISE NOTICE '';
    RAISE NOTICE '✨ Le rôle Médecin existe déjà ! Aucune action nécessaire.';
    RETURN;
  END IF;
  
  -- 5. Restaurer le rôle Médecin
  RAISE NOTICE '';
  RAISE NOTICE '5️⃣ Restauration du rôle Médecin...';
  
  INSERT INTO establishment_staff (
    professional_id,
    establishment_id,
    department_id,
    role,
    position,
    is_department_head,
    is_establishment_admin,
    status,
    matricule,
    permissions
  ) VALUES (
    v_professional_id,
    v_establishment_id,
    v_med_dept_id,
    'doctor',
    'Médecin Consultant Senior',
    false,
    false,
    'active',
    'MED-001',
    '{"consultations": ["view", "add", "edit"], "prescriptions": ["view", "add", "edit"], "patients": ["view", "add", "edit"], "reports": ["view"]}'::jsonb
  );
  
  RAISE NOTICE '✅ Rôle Médecin restauré avec succès!';
  
  -- 6. Résumé final
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '✨ RESTAURATION TERMINÉE AVEC SUCCÈS!';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '📊 RÉSUMÉ - Dr. Jules DJEKI';
  RAISE NOTICE '────────────────────────────────────────────────────────';
  RAISE NOTICE '👤 Compte: directeur.sogara@sante.ga';
  RAISE NOTICE '👨‍⚕️ Professionnel ID: %', v_professional_id;
  RAISE NOTICE '🏥 Établissement: CMST SOGARA';
  RAISE NOTICE '';
  RAISE NOTICE '👔 Rôles au CMST SOGARA:';
  RAISE NOTICE '   1. Médecin en Chef (role: director)';
  RAISE NOTICE '   2. Médecin Consultant Senior (role: doctor) ⭐ RESTAURÉ';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Dr. DJEKI peut maintenant:';
  RAISE NOTICE '   - Basculer entre les rôles Directeur et Médecin';
  RAISE NOTICE '   - Accéder au menu Directeur pour la gestion';
  RAISE NOTICE '   - Accéder au menu Médecin pour les consultations';
  RAISE NOTICE '';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '';
    RAISE NOTICE '❌ ERREUR: %', SQLERRM;
    RAISE;
END $$;

