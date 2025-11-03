-- ================================================================
-- MISE À JOUR DU TITRE - MÉDECIN EN CHEF CMST SOGARA
-- ================================================================
-- Change "Directeur Médical" en "Médecin en Chef" pour Dr. DJEKI
-- Date: Décembre 2024
-- ================================================================

DO $$
DECLARE
  v_user_id uuid;
  v_professional_id uuid;
  v_staff_count integer;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔄 MISE À JOUR DU TITRE - MÉDECIN EN CHEF';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  
  -- 1. Trouver le compte Dr. DJEKI
  RAISE NOTICE '1️⃣ Recherche du compte Dr. DJEKI...';
  
  SELECT id INTO v_user_id
  FROM profiles
  WHERE email = 'directeur.sogara@sante.ga';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Compte directeur.sogara@sante.ga non trouvé';
  END IF;
  
  RAISE NOTICE '   ✅ Compte trouvé (User ID: %)', v_user_id;
  
  -- 2. Trouver le profil professionnel
  RAISE NOTICE '';
  RAISE NOTICE '2️⃣ Recherche du profil professionnel...';
  
  SELECT id INTO v_professional_id
  FROM professionals
  WHERE user_id = v_user_id;
  
  IF v_professional_id IS NULL THEN
    RAISE EXCEPTION '❌ Profil professionnel non trouvé';
  END IF;
  
  RAISE NOTICE '   ✅ Professionnel ID: %', v_professional_id;
  
  -- 3. Mettre à jour le poste dans establishment_staff
  RAISE NOTICE '';
  RAISE NOTICE '3️⃣ Mise à jour du poste dans establishment_staff...';
  
  UPDATE establishment_staff
  SET 
    position = 'Médecin en Chef',
    updated_at = NOW()
  WHERE professional_id = v_professional_id
    AND role = 'director'
    AND establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; -- CMST SOGARA
  
  GET DIAGNOSTICS v_staff_count = ROW_COUNT;
  
  IF v_staff_count > 0 THEN
    RAISE NOTICE '   ✅ Position mise à jour: "Médecin en Chef"';
    RAISE NOTICE '   📝 Nombre de lignes mises à jour: %', v_staff_count;
  ELSE
    RAISE NOTICE '   ⚠️  Aucune ligne mise à jour (peut-être déjà correct)';
  END IF;
  
  -- 4. Vérification finale
  RAISE NOTICE '';
  RAISE NOTICE '4️⃣ Vérification des rôles...';
  RAISE NOTICE '';
  
  FOR rec IN (
    SELECT 
      es.role,
      es.position,
      ed.name as department,
      es.status
    FROM establishment_staff es
    JOIN establishment_departments ed ON ed.id = es.department_id
    WHERE es.professional_id = v_professional_id
      AND es.establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    ORDER BY es.role
  )
  LOOP
    RAISE NOTICE '   Rôle: % - Position: % - Département: % - Statut: %', 
      rec.role, rec.position, rec.department, rec.status;
  END LOOP;
  
  -- 5. Résumé
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '✨ MISE À JOUR TERMINÉE AVEC SUCCÈS!';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '📊 RÉSUMÉ - Dr. Jules DJEKI';
  RAISE NOTICE '────────────────────────────────────────────────────────';
  RAISE NOTICE '👤 Compte: directeur.sogara@sante.ga';
  RAISE NOTICE '🏥 Établissement: CMST SOGARA';
  RAISE NOTICE '';
  RAISE NOTICE '👔 Rôles au CMST SOGARA:';
  RAISE NOTICE '   1. Médecin en Chef (role: director) ⭐ TITRE MIS À JOUR';
  RAISE NOTICE '   2. Médecin Consultant Senior (role: doctor)';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Changements appliqués:';
  RAISE NOTICE '   ❌ "Directeur Médical" → ✅ "Médecin en Chef"';
  RAISE NOTICE '';
  RAISE NOTICE '📱 Affichage dans l''application:';
  RAISE NOTICE '   • Menu navigation: "Médecin en Chef CMST"';
  RAISE NOTICE '   • Badge rôle: "Médecin en Chef"';
  RAISE NOTICE '   • Dashboard: "Médecin en Chef"';
  RAISE NOTICE '';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '';
    RAISE NOTICE '❌ ERREUR: %', SQLERRM;
    RAISE;
END $$;

-- ================================================================
-- VÉRIFICATION POST-MISE À JOUR
-- ================================================================
SELECT 
  p.full_name AS "Nom",
  p.email AS "Email",
  es.role AS "Rôle",
  es.position AS "Poste",
  ed.name AS "Département",
  es.status AS "Statut"
FROM establishment_staff es
JOIN professionals prof ON prof.id = es.professional_id
JOIN profiles p ON p.id = prof.user_id
JOIN establishment_departments ed ON ed.id = es.department_id
WHERE p.email = 'directeur.sogara@sante.ga'
  AND es.establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
ORDER BY es.role;

-- ================================================================
-- FIN DU SCRIPT
-- ================================================================

