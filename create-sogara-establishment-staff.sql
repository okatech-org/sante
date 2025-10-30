-- Script pour créer les entrées establishment_staff pour les utilisateurs SOGARA
-- Cela permettra au ProfessionalEstablishmentLayout de fonctionner correctement

-- 1. D'abord, s'assurer que l'établissement SOGARA existe
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
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  sub_type = EXCLUDED.sub_type,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  phone = EXCLUDED.phone,
  is_active = EXCLUDED.is_active;

-- 2. Créer les départements SOGARA si nécessaire
INSERT INTO establishment_departments (id, establishment_id, name, code, created_at)
VALUES 
  ('sogara-dept-dir', 'sogara-cmst-001', 'Direction Médicale', 'DIR', NOW()),
  ('sogara-dept-admin', 'sogara-cmst-001', 'Administration', 'ADM', NOW()),
  ('sogara-dept-medgen', 'sogara-cmst-001', 'Médecine Générale', 'MED_GEN', NOW()),
  ('sogara-dept-urg', 'sogara-cmst-001', 'Urgences', 'URG', NOW()),
  ('sogara-dept-card', 'sogara-cmst-001', 'Cardiologie', 'CARD', NOW()),
  ('sogara-dept-ped', 'sogara-cmst-001', 'Pédiatrie', 'PED', NOW()),
  ('sogara-dept-soins', 'sogara-cmst-001', 'Soins Intensifs', 'SOINS', NOW()),
  ('sogara-dept-mat', 'sogara-cmst-001', 'Maternité', 'MAT', NOW()),
  ('sogara-dept-lab', 'sogara-cmst-001', 'Laboratoire', 'LAB', NOW()),
  ('sogara-dept-phar', 'sogara-cmst-001', 'Pharmacie', 'PHAR', NOW()),
  ('sogara-dept-acc', 'sogara-cmst-001', 'Accueil', 'ACC', NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Créer les profils professionnels pour chaque utilisateur SOGARA
DO $$
DECLARE
  v_user_id uuid;
  v_prof_id uuid;
BEGIN
  -- Dr. Jules DJEKI (Directeur)
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'directeur.sogara@sante.ga';
  IF v_user_id IS NOT NULL THEN
    INSERT INTO professionals (
      id, user_id, category, full_name, specialties, is_verified, created_at
    )
    VALUES (
      gen_random_uuid(), v_user_id, 'doctor', 'Dr. Jules DJEKI', ARRAY['Directeur Médical'], true, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET 
      full_name = EXCLUDED.full_name,
      category = EXCLUDED.category,
      specialties = EXCLUDED.specialties
    RETURNING id INTO v_prof_id;

    -- Ajouter à establishment_staff
    INSERT INTO establishment_staff (
      id, professional_id, establishment_id, department_id, role, position,
      is_department_head, is_establishment_admin, status, matricule,
      permissions, created_at
    )
    VALUES (
      gen_random_uuid(), v_prof_id, 'sogara-cmst-001', 'sogara-dept-dir',
      'director', 'Directeur Médical', true, true, 'active', 'DIR-001',
      jsonb_build_object(
        'consultations', jsonb_build_array('view', 'add', 'edit', 'delete'),
        'appointments', jsonb_build_array('view', 'add', 'edit', 'delete'),
        'prescriptions', jsonb_build_array('view', 'add', 'edit', 'delete'),
        'patients', jsonb_build_array('view', 'add', 'edit', 'delete'),
        'emergency', jsonb_build_array('view', 'add', 'edit'),
        'hospitalization', jsonb_build_array('view', 'add', 'edit'),
        'technical', jsonb_build_array('view', 'add', 'edit'),
        'staff', jsonb_build_array('view', 'add', 'edit', 'delete'),
        'reports', jsonb_build_array('view', 'export')
      ),
      NOW()
    )
    ON CONFLICT (professional_id, establishment_id) DO NOTHING;
  END IF;

  -- Admin SOGARA
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin.sogara@sante.ga';
  IF v_user_id IS NOT NULL THEN
    INSERT INTO professionals (
      id, user_id, category, full_name, is_verified, created_at
    )
    VALUES (
      gen_random_uuid(), v_user_id, 'receptionist', 'Jean-Pierre Mbadinga', true, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET 
      full_name = EXCLUDED.full_name,
      category = EXCLUDED.category
    RETURNING id INTO v_prof_id;

    INSERT INTO establishment_staff (
      id, professional_id, establishment_id, department_id, role, position,
      is_department_head, is_establishment_admin, status, matricule,
      permissions, created_at
    )
    VALUES (
      gen_random_uuid(), v_prof_id, 'sogara-cmst-001', 'sogara-dept-admin',
      'administrator', 'Administrateur', false, true, 'active', 'ADM-001',
      jsonb_build_object(
        'staff', jsonb_build_array('view', 'add', 'edit'),
        'appointments', jsonb_build_array('view', 'add', 'edit'),
        'reports', jsonb_build_array('view')
      ),
      NOW()
    )
    ON CONFLICT (professional_id, establishment_id) DO NOTHING;
  END IF;

  -- Dr. Marie Okemba
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'dr.okemba.sogara@sante.ga';
  IF v_user_id IS NOT NULL THEN
    INSERT INTO professionals (
      id, user_id, category, full_name, specialties, is_verified, created_at
    )
    VALUES (
      gen_random_uuid(), v_user_id, 'doctor', 'Dr. Marie Okemba', ARRAY['Médecine Générale'], true, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING id INTO v_prof_id;

    INSERT INTO establishment_staff (
      id, professional_id, establishment_id, department_id, role, position,
      is_department_head, is_establishment_admin, status, matricule,
      permissions, created_at
    )
    VALUES (
      gen_random_uuid(), v_prof_id, 'sogara-cmst-001', 'sogara-dept-medgen',
      'doctor', 'Médecin', false, false, 'active', 'MED-012',
      jsonb_build_object(
        'consultations', jsonb_build_array('view', 'add', 'edit'),
        'appointments', jsonb_build_array('view', 'add', 'edit'),
        'prescriptions', jsonb_build_array('view', 'add', 'edit'),
        'patients', jsonb_build_array('view')
      ),
      NOW()
    )
    ON CONFLICT (professional_id, establishment_id) DO NOTHING;
  END IF;

  -- Dr. Paul Nguema
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'dr.nguema.sogara@sante.ga';
  IF v_user_id IS NOT NULL THEN
    INSERT INTO professionals (
      id, user_id, category, full_name, specialties, is_verified, created_at
    )
    VALUES (
      gen_random_uuid(), v_user_id, 'doctor', 'Dr. Paul Nguema', ARRAY['Urgentiste'], true, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING id INTO v_prof_id;

    INSERT INTO establishment_staff (
      id, professional_id, establishment_id, department_id, role, position,
      is_department_head, is_establishment_admin, status, matricule,
      permissions, created_at
    )
    VALUES (
      gen_random_uuid(), v_prof_id, 'sogara-cmst-001', 'sogara-dept-urg',
      'doctor', 'Médecin Urgentiste', true, false, 'active', 'MED-015',
      jsonb_build_object(
        'consultations', jsonb_build_array('view', 'add', 'edit'),
        'appointments', jsonb_build_array('view', 'add', 'edit'),
        'prescriptions', jsonb_build_array('view', 'add', 'edit'),
        'patients', jsonb_build_array('view'),
        'emergency', jsonb_build_array('view', 'add', 'edit')
      ),
      NOW()
    )
    ON CONFLICT (professional_id, establishment_id) DO NOTHING;
  END IF;

  -- Dr. Léa Mbina
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'dr.mbina.sogara@sante.ga';
  IF v_user_id IS NOT NULL THEN
    INSERT INTO professionals (
      id, user_id, category, full_name, specialties, is_verified, created_at
    )
    VALUES (
      gen_random_uuid(), v_user_id, 'doctor', 'Dr. Léa Mbina', ARRAY['Cardiologie'], true, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING id INTO v_prof_id;

    INSERT INTO establishment_staff (
      id, professional_id, establishment_id, department_id, role, position,
      is_department_head, is_establishment_admin, status, matricule,
      permissions, created_at
    )
    VALUES (
      gen_random_uuid(), v_prof_id, 'sogara-cmst-001', 'sogara-dept-card',
      'doctor', 'Cardiologue', true, false, 'active', 'MED-018',
      jsonb_build_object(
        'consultations', jsonb_build_array('view', 'add', 'edit'),
        'appointments', jsonb_build_array('view', 'add', 'edit'),
        'prescriptions', jsonb_build_array('view', 'add', 'edit'),
        'patients', jsonb_build_array('view')
      ),
      NOW()
    )
    ON CONFLICT (professional_id, establishment_id) DO NOTHING;
  END IF;

  -- Dr. Thomas Mezui
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'dr.mezui.sogara@sante.ga';
  IF v_user_id IS NOT NULL THEN
    INSERT INTO professionals (
      id, user_id, category, full_name, specialties, is_verified, created_at
    )
    VALUES (
      gen_random_uuid(), v_user_id, 'doctor', 'Dr. Thomas Mezui', ARRAY['Pédiatrie'], true, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING id INTO v_prof_id;

    INSERT INTO establishment_staff (
      id, professional_id, establishment_id, department_id, role, position,
      is_department_head, is_establishment_admin, status, matricule,
      permissions, created_at
    )
    VALUES (
      gen_random_uuid(), v_prof_id, 'sogara-cmst-001', 'sogara-dept-ped',
      'doctor', 'Pédiatre', true, false, 'active', 'MED-022',
      jsonb_build_object(
        'consultations', jsonb_build_array('view', 'add', 'edit'),
        'appointments', jsonb_build_array('view', 'add', 'edit'),
        'prescriptions', jsonb_build_array('view', 'add', 'edit'),
        'patients', jsonb_build_array('view')
      ),
      NOW()
    )
    ON CONFLICT (professional_id, establishment_id) DO NOTHING;
  END IF;

  -- Infirmières
  FOR v_user_id IN 
    SELECT id FROM auth.users WHERE email IN (
      'nurse.mba.sogara@sante.ga',
      'nurse.nze.sogara@sante.ga',
      'nurse.andeme.sogara@sante.ga'
    )
  LOOP
    INSERT INTO professionals (
      id, user_id, category, full_name, is_verified, created_at
    )
    SELECT gen_random_uuid(), v_user_id, 'nurse', 
      CASE email
        WHEN 'nurse.mba.sogara@sante.ga' THEN 'Sylvie Mba'
        WHEN 'nurse.nze.sogara@sante.ga' THEN 'Patricia Nze'
        WHEN 'nurse.andeme.sogara@sante.ga' THEN 'Claire Andeme'
      END,
      true, NOW()
    FROM auth.users WHERE id = v_user_id
    ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING id INTO v_prof_id;

    INSERT INTO establishment_staff (
      id, professional_id, establishment_id, role, position,
      is_department_head, is_establishment_admin, status,
      permissions, created_at
    )
    VALUES (
      gen_random_uuid(), v_prof_id, 'sogara-cmst-001',
      'nurse', 'Infirmier(e)', false, false, 'active',
      jsonb_build_object(
        'consultations', jsonb_build_array('view'),
        'appointments', jsonb_build_array('view'),
        'patients', jsonb_build_array('view')
      ),
      NOW()
    )
    ON CONFLICT (professional_id, establishment_id) DO NOTHING;
  END LOOP;

  -- Laborantin
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'lab.tech.sogara@sante.ga';
  IF v_user_id IS NOT NULL THEN
    INSERT INTO professionals (
      id, user_id, category, full_name, is_verified, created_at
    )
    VALUES (
      gen_random_uuid(), v_user_id, 'laborantin', 'André Moussavou', true, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING id INTO v_prof_id;

    INSERT INTO establishment_staff (
      id, professional_id, establishment_id, department_id, role, position,
      is_department_head, is_establishment_admin, status, matricule,
      permissions, created_at
    )
    VALUES (
      gen_random_uuid(), v_prof_id, 'sogara-cmst-001', 'sogara-dept-lab',
      'laborantin', 'Technicien de Laboratoire', false, false, 'active', 'LAB-008',
      jsonb_build_object(
        'laboratory', jsonb_build_array('view', 'add', 'edit')
      ),
      NOW()
    )
    ON CONFLICT (professional_id, establishment_id) DO NOTHING;
  END IF;

  -- Pharmacien
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'pharma.sogara@sante.ga';
  IF v_user_id IS NOT NULL THEN
    INSERT INTO professionals (
      id, user_id, category, full_name, is_verified, created_at
    )
    VALUES (
      gen_random_uuid(), v_user_id, 'pharmacist', 'Dr. Lydie Kombila', true, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING id INTO v_prof_id;

    INSERT INTO establishment_staff (
      id, professional_id, establishment_id, department_id, role, position,
      is_department_head, is_establishment_admin, status, matricule,
      permissions, created_at
    )
    VALUES (
      gen_random_uuid(), v_prof_id, 'sogara-cmst-001', 'sogara-dept-phar',
      'pharmacist', 'Pharmacien', true, false, 'active', 'PHAR-004',
      jsonb_build_object(
        'pharmacy', jsonb_build_array('view', 'add', 'edit'),
        'prescriptions', jsonb_build_array('view')
      ),
      NOW()
    )
    ON CONFLICT (professional_id, establishment_id) DO NOTHING;
  END IF;

  -- Réceptionniste
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'accueil.sogara@sante.ga';
  IF v_user_id IS NOT NULL THEN
    INSERT INTO professionals (
      id, user_id, category, full_name, is_verified, created_at
    )
    VALUES (
      gen_random_uuid(), v_user_id, 'receptionist', 'Nadège Oyono', true, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name
    RETURNING id INTO v_prof_id;

    INSERT INTO establishment_staff (
      id, professional_id, establishment_id, department_id, role, position,
      is_department_head, is_establishment_admin, status, matricule,
      permissions, created_at
    )
    VALUES (
      gen_random_uuid(), v_prof_id, 'sogara-cmst-001', 'sogara-dept-acc',
      'receptionist', 'Réceptionniste', false, false, 'active', 'REC-002',
      jsonb_build_object(
        'appointments', jsonb_build_array('view', 'add', 'edit')
      ),
      NOW()
    )
    ON CONFLICT (professional_id, establishment_id) DO NOTHING;
  END IF;

END $$;

-- 4. Vérifier les résultats
SELECT 
  u.email,
  p.full_name,
  p.category,
  es.role,
  es.position,
  es.matricule,
  ed.name as department,
  es.is_establishment_admin,
  es.is_department_head,
  es.status
FROM auth.users u
JOIN professionals p ON p.user_id = u.id
JOIN establishment_staff es ON es.professional_id = p.id
LEFT JOIN establishment_departments ed ON ed.id = es.department_id
WHERE u.email LIKE '%sogara@sante.ga'
ORDER BY u.email;

