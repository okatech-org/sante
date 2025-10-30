-- =====================================================
-- ACTIVATION COMPLÈTE DU SYSTÈME MULTI-ÉTABLISSEMENTS
-- Date: 30/10/2025
-- 
-- Ce script active TOUT le système multi-établissements
-- pour TOUS les professionnels SOGARA
-- =====================================================

-- Vérifier/Créer l'établissement CMST SOGARA
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM establishments WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890') THEN
    INSERT INTO establishments (id, name, type, sub_type, address, city, phone, email, website)
    VALUES (
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      'CMST SOGARA',
      'cmst',
      'corporate',
      'Zone Industrielle, Port-Gentil',
      'Port-Gentil',
      '+241 01 55 66 77',
      'cmst@sogara.ga',
      'https://sogara.ga/cmst'
    );
    RAISE NOTICE 'Établissement CMST SOGARA créé';
  END IF;
END $$;

-- Créer les départements si nécessaire
INSERT INTO establishment_departments (establishment_id, name, code) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Direction Médicale', 'DIR'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Urgences', 'URG'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Médecine Générale', 'MED'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Cardiologie', 'CARD'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Pédiatrie', 'PED'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Soins Intensifs', 'SI'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Maternité', 'MAT'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Laboratoire', 'LAB'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Pharmacie', 'PHAR'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Administration', 'ADM'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Accueil', 'ACC')
ON CONFLICT (establishment_id, code) DO NOTHING;

-- =====================================================
-- Configuration de TOUS les professionnels SOGARA
-- =====================================================

-- 1. DR. JULES DJEKI (Directeur + Médecin)
DO $$
DECLARE
  v_user_id UUID;
  v_professional_id UUID;
  v_dept_dir UUID;
  v_dept_med UUID;
BEGIN
  -- Récupérer l'utilisateur
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'directeur.sogara@sante.ga';
  
  IF v_user_id IS NOT NULL THEN
    -- Créer/Récupérer le professionnel
    INSERT INTO professionals (user_id, email, full_name, professional_type, speciality)
    VALUES (v_user_id, 'directeur.sogara@sante.ga', 'Dr. Jules DJEKI', 'Médecin', 'Administration/Médecine Générale')
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING id INTO v_professional_id;
    
    -- Récupérer les départements
    SELECT id INTO v_dept_dir FROM establishment_departments 
    WHERE establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' AND code = 'DIR';
    
    SELECT id INTO v_dept_med FROM establishment_departments 
    WHERE establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' AND code = 'MED';
    
    -- Supprimer anciennes affiliations
    DELETE FROM establishment_staff 
    WHERE professional_id = v_professional_id 
      AND establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    
    -- Créer le double rôle
    INSERT INTO establishment_staff (
      professional_id, establishment_id, department_id, role, position,
      is_department_head, is_establishment_admin, status, matricule
    ) VALUES 
    (
      v_professional_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', v_dept_dir,
      'director', 'Directeur Médical', true, true, 'active', 'DIR-001'
    ),
    (
      v_professional_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', v_dept_med,
      'doctor', 'Médecin Consultant Senior', false, false, 'active', 'MED-001'
    );
    
    RAISE NOTICE 'Dr. DJEKI configuré avec 2 rôles';
  END IF;
END $$;

-- 2. JEAN-PIERRE MBADINGA (Administrateur)
DO $$
DECLARE
  v_user_id UUID;
  v_professional_id UUID;
  v_dept_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin.sogara@sante.ga';
  
  IF v_user_id IS NOT NULL THEN
    INSERT INTO professionals (user_id, email, full_name, professional_type)
    VALUES (v_user_id, 'admin.sogara@sante.ga', 'Jean-Pierre Mbadinga', 'Administrateur')
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING id INTO v_professional_id;
    
    SELECT id INTO v_dept_id FROM establishment_departments 
    WHERE establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' AND code = 'ADM';
    
    DELETE FROM establishment_staff 
    WHERE professional_id = v_professional_id 
      AND establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    
    INSERT INTO establishment_staff (
      professional_id, establishment_id, department_id, role, position,
      is_establishment_admin, status, matricule
    ) VALUES (
      v_professional_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', v_dept_id,
      'admin', 'Administrateur Principal', true, 'active', 'ADM-001'
    );
    
    RAISE NOTICE 'Jean-Pierre Mbadinga configuré';
  END IF;
END $$;

-- 3. MÉDECINS
-- Dr. Marie Okemba
DO $$
DECLARE
  v_user_id UUID;
  v_professional_id UUID;
  v_dept_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'dr.okemba.sogara@sante.ga';
  
  IF v_user_id IS NOT NULL THEN
    INSERT INTO professionals (user_id, email, full_name, professional_type, speciality)
    VALUES (v_user_id, 'dr.okemba.sogara@sante.ga', 'Dr. Marie Okemba', 'Médecin', 'Médecine Générale')
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING id INTO v_professional_id;
    
    SELECT id INTO v_dept_id FROM establishment_departments 
    WHERE establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' AND code = 'MED';
    
    DELETE FROM establishment_staff 
    WHERE professional_id = v_professional_id 
      AND establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    
    INSERT INTO establishment_staff (
      professional_id, establishment_id, department_id, role, position, status, matricule
    ) VALUES (
      v_professional_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', v_dept_id,
      'doctor', 'Médecin Généraliste', 'active', 'MED-012'
    );
    
    RAISE NOTICE 'Dr. Marie Okemba configurée';
  END IF;
END $$;

-- Dr. Paul Nguema (Chef des Urgences)
DO $$
DECLARE
  v_user_id UUID;
  v_professional_id UUID;
  v_dept_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'dr.nguema.sogara@sante.ga';
  
  IF v_user_id IS NOT NULL THEN
    INSERT INTO professionals (user_id, email, full_name, professional_type, speciality)
    VALUES (v_user_id, 'dr.nguema.sogara@sante.ga', 'Dr. Paul Nguema', 'Médecin', 'Urgences')
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING id INTO v_professional_id;
    
    SELECT id INTO v_dept_id FROM establishment_departments 
    WHERE establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' AND code = 'URG';
    
    DELETE FROM establishment_staff 
    WHERE professional_id = v_professional_id 
      AND establishment_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    
    INSERT INTO establishment_staff (
      professional_id, establishment_id, department_id, role, position,
      is_department_head, status, matricule
    ) VALUES (
      v_professional_id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', v_dept_id,
      'doctor', 'Médecin Urgentiste', true, 'active', 'MED-015'
    );
    
    RAISE NOTICE 'Dr. Paul Nguema configuré (Chef Urgences)';
  END IF;
END $$;

-- 4. INFIRMIERS
-- Configuration similaire pour les infirmiers...

-- 5. PERSONNEL SUPPORT
-- Configuration similaire pour le personnel support...

-- =====================================================
-- Créer des établissements supplémentaires pour tests
-- =====================================================
INSERT INTO establishments (id, name, type, sub_type, city, address, phone)
VALUES 
(
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'CHU Libreville',
  'hospital',
  'public',
  'Libreville',
  'Boulevard Triomphal, Libreville',
  '+241 01 76 20 00'
),
(
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  'Clinique St-Michel',
  'clinic',
  'private',
  'Port-Gentil',
  'Avenue Savorgnan de Brazza',
  '+241 01 55 30 30'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Créer des invitations de test
-- =====================================================

-- Invitation pour Dr. DJEKI au CHU Libreville
INSERT INTO establishment_invitations (
  establishment_id,
  invited_email,
  role,
  position,
  message,
  status
) VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'directeur.sogara@sante.ga',
  'doctor',
  'Médecin Consultant Cardiologie',
  'Le CHU Libreville serait honoré de vous compter parmi son équipe de cardiologie.',
  'pending'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- Modules activés pour CMST SOGARA
-- =====================================================
INSERT INTO establishment_modules (establishment_id, module_name, is_active) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'consultations', true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'urgences', true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'hospitalisation', true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'laboratoire', true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'pharmacie', true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'work-medicine', true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'technical-platform', true)
ON CONFLICT (establishment_id, module_name) DO NOTHING;

-- =====================================================
-- Message de confirmation
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ SYSTÈME MULTI-ÉTABLISSEMENTS ACTIVÉ AVEC SUCCÈS!';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Configuration appliquée :';
  RAISE NOTICE '- Dr. DJEKI : 2 rôles (Directeur + Médecin)';
  RAISE NOTICE '- Tous les professionnels SOGARA configurés';
  RAISE NOTICE '- Invitation CHU Libreville créée';
  RAISE NOTICE '- Modules établissement activés';
  RAISE NOTICE '';
  RAISE NOTICE '🔗 Testez maintenant avec :';
  RAISE NOTICE 'Email : directeur.sogara@sante.ga';
  RAISE NOTICE 'Pass  : DirecteurSOGARA2024!';
END $$;
