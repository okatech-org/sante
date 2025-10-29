-- =====================================================
-- SCRIPT DE CRÉATION DES COMPTES CMST SOGARA
-- =====================================================
-- Ce script crée 12 comptes utilisateurs pour CMST SOGARA
-- avec leurs profils complets et leurs rôles appropriés
--
-- INSTRUCTIONS:
-- 1. Ouvrir la console Supabase (https://app.supabase.com)
-- 2. Aller dans SQL Editor
-- 3. Copier et exécuter ce script complet
-- =====================================================

-- Créer l'établissement CMST SOGARA s'il n'existe pas
DO $$
DECLARE
  v_establishment_id UUID;
BEGIN
  -- Vérifier si l'établissement existe
  SELECT id INTO v_establishment_id
  FROM public.establishments
  WHERE raison_sociale ILIKE '%SOGARA%' 
  LIMIT 1;
  
  -- Si l'établissement n'existe pas, le créer
  IF v_establishment_id IS NULL THEN
    INSERT INTO public.establishments (
      raison_sociale,
      type_etablissement,
      secteur,
      ville,
      province,
      adresse,
      telephone,
      email,
      latitude,
      longitude,
      nombre_lits_total,
      nombre_blocs_operatoires,
      nombre_salles_consultation,
      service_urgences_actif,
      cnamgs_conventionne,
      cnss_conventionne,
      statut
    ) VALUES (
      'Centre Médical de Santé au Travail SOGARA',
      'centre_medical',
      'prive',
      'Port-Gentil',
      'Ogooué-Maritime',
      'Route de la Sogara',
      '011 55 26 21',
      'service.rgc@sogara.com',
      -0.681398,
      8.772557,
      200,
      4,
      15,
      true,
      true,
      true,
      'actif'
    ) RETURNING id INTO v_establishment_id;
    
    RAISE NOTICE 'Établissement SOGARA créé avec ID: %', v_establishment_id;
  ELSE
    RAISE NOTICE 'Établissement SOGARA existant avec ID: %', v_establishment_id;
  END IF;
END $$;

-- Fonction pour créer un utilisateur avec toutes ses données
CREATE OR REPLACE FUNCTION create_sogara_user(
  p_email VARCHAR,
  p_password VARCHAR,
  p_full_name VARCHAR,
  p_role VARCHAR,
  p_department VARCHAR,
  p_matricule VARCHAR,
  p_professional_type VARCHAR DEFAULT NULL,
  p_is_admin BOOLEAN DEFAULT FALSE
) RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_establishment_id UUID;
BEGIN
  -- Récupérer l'ID de l'établissement SOGARA
  SELECT id INTO v_establishment_id
  FROM public.establishments
  WHERE raison_sociale ILIKE '%SOGARA%'
  LIMIT 1;

  -- Créer l'utilisateur dans auth.users
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
  ) VALUES (
    gen_random_uuid(),
    p_email,
    crypt(p_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    jsonb_build_object(
      'full_name', p_full_name,
      'department', p_department,
      'matricule', p_matricule,
      'establishment', 'CMST SOGARA'
    )
  ) RETURNING id INTO v_user_id
  ON CONFLICT (email) DO UPDATE
  SET 
    encrypted_password = crypt(p_password, gen_salt('bf')),
    updated_at = NOW()
  RETURNING id INTO v_user_id;

  -- Créer ou mettre à jour le profil
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone
  ) VALUES (
    v_user_id,
    p_full_name,
    p_email,
    p_matricule
  ) ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;

  -- Assigner le rôle
  INSERT INTO public.user_roles (
    user_id,
    role
  ) VALUES (
    v_user_id,
    p_role
  ) ON CONFLICT DO NOTHING;

  -- Créer le profil professionnel si nécessaire
  IF p_role IN ('doctor', 'medical_staff', 'laboratory', 'pharmacy') THEN
    INSERT INTO public.professionals (
      user_id,
      professional_type,
      numero_ordre,
      specialite,
      etablissement,
      is_verified
    ) VALUES (
      v_user_id,
      COALESCE(p_professional_type, 
        CASE 
          WHEN p_role = 'doctor' THEN 'doctor'
          WHEN p_role = 'pharmacy' THEN 'pharmacist'
          WHEN p_role = 'laboratory' THEN 'lab_tech'
          ELSE 'other'
        END
      ),
      p_matricule,
      p_department,
      'CMST SOGARA',
      true
    ) ON CONFLICT (user_id) DO UPDATE
    SET 
      professional_type = EXCLUDED.professional_type,
      numero_ordre = EXCLUDED.numero_ordre,
      specialite = EXCLUDED.specialite;
  END IF;

  -- Lier à l'établissement pour les administrateurs
  IF p_is_admin AND v_establishment_id IS NOT NULL THEN
    INSERT INTO public.establishment_users (
      establishment_id,
      user_id,
      role,
      permissions,
      actif
    ) VALUES (
      v_establishment_id,
      v_user_id,
      'administrateur',
      jsonb_build_object(
        'manage_staff', true,
        'manage_patients', true,
        'manage_appointments', true,
        'manage_billing', true,
        'view_reports', true,
        'manage_inventory', true,
        'manage_settings', true
      ),
      true
    ) ON CONFLICT DO NOTHING;
  END IF;

  RAISE NOTICE 'Utilisateur créé/mis à jour: % (%)', p_full_name, p_email;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CRÉATION DES 12 COMPTES SOGARA
-- =====================================================

-- 1. Administrateurs (2)
SELECT create_sogara_user(
  'admin@sogara.com',
  'Admin@SOGARA2024',
  'Jean-Pierre Mbadinga',
  'hospital',
  'Administration',
  'ADM-001',
  NULL,
  true
);

SELECT create_sogara_user(
  'directeur@sogara.com',
  'DirecteurSOGARA2024!',
  'Dr. François Obiang',
  'hospital',
  'Direction Médicale',
  'DIR-001',
  NULL,
  true
);

-- 2. Médecins (4)
SELECT create_sogara_user(
  'dr.okemba@sogara.com',
  'Okemba@2024Med',
  'Dr. Marie Okemba',
  'doctor',
  'Médecine Générale',
  'MED-012'
);

SELECT create_sogara_user(
  'dr.nguema@sogara.com',
  'Nguema@Urgence24',
  'Dr. Paul Nguema',
  'doctor',
  'Urgences',
  'MED-015'
);

SELECT create_sogara_user(
  'dr.mbina@sogara.com',
  'Mbina@Cardio2024',
  'Dr. Léa Mbina',
  'doctor',
  'Cardiologie',
  'MED-018'
);

SELECT create_sogara_user(
  'dr.mezui@sogara.com',
  'Mezui@Pediatrie24',
  'Dr. Thomas Mezui',
  'doctor',
  'Pédiatrie',
  'MED-022'
);

-- 3. Infirmiers (3)
SELECT create_sogara_user(
  'nurse.mba@sogara.com',
  'MbaSI@2024',
  'Sylvie Mba',
  'medical_staff',
  'Soins Intensifs',
  'INF-025',
  'nurse'
);

SELECT create_sogara_user(
  'nurse.nze@sogara.com',
  'NzeUrg@2024',
  'Patricia Nze',
  'medical_staff',
  'Urgences',
  'INF-028',
  'nurse'
);

SELECT create_sogara_user(
  'nurse.andeme@sogara.com',
  'Andeme@Mat2024',
  'Claire Andeme',
  'medical_staff',
  'Maternité',
  'INF-030',
  'nurse'
);

-- 4. Technicien Laboratoire (1)
SELECT create_sogara_user(
  'lab.tech@sogara.com',
  'LabSOGARA@2024',
  'André Moussavou',
  'laboratory',
  'Laboratoire',
  'LAB-008'
);

-- 5. Pharmacien (1)
SELECT create_sogara_user(
  'pharma@sogara.com',
  'PharmaSOGARA@24',
  'Dr. Lydie Kombila',
  'pharmacy',
  'Pharmacie',
  'PHAR-004'
);

-- 6. Réceptionniste (1)
SELECT create_sogara_user(
  'accueil@sogara.com',
  'AccueilSOGARA@24',
  'Nadège Oyono',
  'medical_staff',
  'Accueil',
  'REC-002',
  'receptionist'
);

-- Nettoyer la fonction temporaire
DROP FUNCTION IF EXISTS create_sogara_user;

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier les comptes créés
SELECT 
  p.full_name AS "Nom Complet",
  au.email AS "Email",
  ur.role AS "Rôle",
  p.phone AS "Matricule",
  CASE WHEN au.email_confirmed_at IS NOT NULL THEN 'Actif' ELSE 'Inactif' END AS "Statut"
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.user_roles ur ON ur.user_id = au.id
WHERE au.email LIKE '%sogara.com%'
ORDER BY 
  CASE ur.role 
    WHEN 'hospital' THEN 1
    WHEN 'doctor' THEN 2
    WHEN 'medical_staff' THEN 3
    WHEN 'laboratory' THEN 4
    WHEN 'pharmacy' THEN 5
    ELSE 6
  END,
  p.full_name;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
-- Résultat attendu: 12 comptes créés
-- - 2 Administrateurs (role: hospital)
-- - 4 Médecins (role: doctor)
-- - 3 Infirmiers (role: medical_staff)
-- - 1 Technicien labo (role: laboratory)
-- - 1 Pharmacien (role: pharmacy)
-- - 1 Réceptionniste (role: medical_staff)
--
-- Tous les utilisateurs peuvent se connecter via:
-- http://localhost:8080/login/professional
-- =====================================================
