-- =================================================================
-- CRÉATION DU COMPTE DU PR. ADRIEN MOUGOUGOU - MINISTRE DE LA SANTÉ
-- =================================================================

-- 1. Créer l'utilisateur dans auth.users
DO $$
DECLARE
  new_user_id UUID;
  ministry_id UUID;
  minister_professional_id UUID;
BEGIN
  -- Générer un nouvel UUID pour l'utilisateur
  new_user_id := gen_random_uuid();
  
  -- Créer l'utilisateur dans auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    aud
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'ministre@sante.gouv.ga',
    crypt('MinistryGab2025!', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', ARRAY['email'],
      'role', 'admin'
    ),
    jsonb_build_object(
      'full_name', 'Pr. Adrien MOUGOUGOU',
      'title', 'Ministre de la Santé',
      'is_minister', true,
      'permissions', ARRAY[
        'view_all',
        'manage_all',
        'create_decrees',
        'approve_budgets',
        'manage_policies',
        'view_national_statistics',
        'manage_establishments',
        'manage_professionals'
      ]
    ),
    now(),
    now(),
    'authenticated',
    'authenticated'
  );

  -- 2. Créer ou récupérer l'établissement "Ministère de la Santé"
  SELECT id INTO ministry_id
  FROM establishments
  WHERE name = 'Ministère de la Santé'
    AND type = 'ministry'
  LIMIT 1;

  IF ministry_id IS NULL THEN
    INSERT INTO establishments (
      id,
      name,
      type,
      sub_type,
      address,
      city,
      phone,
      email,
      website,
      is_active,
      settings,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      'Ministère de la Santé',
      'ministry',
      'government',
      'À côté de l''immeuble Alu-Suisse',
      'Libreville',
      '+241 01-72-26-61',
      'contact@sante.gouv.ga',
      'https://sante.gouv.ga',
      true,
      jsonb_build_object(
        'description', 'Ministère de la Santé publique et de la Population du Gabon',
        'boite_postale', 'BP 50',
        'horaires', jsonb_build_object(
          'lundi_vendredi', '08h00 - 17h00',
          'weekend', 'Fermé',
          'jours_feries', 'Fermé'
        ),
        'mission', 'Élaborer, mettre en œuvre et coordonner la politique de santé sur toute l''étendue du territoire national',
        'vision_pnds_2024_2028', 'Accélérer les progrès vers la Couverture Sanitaire Universelle (CSU) pour garantir l''accès à des soins de santé de qualité pour tous les Gabonais',
        'objectif_general', 'Améliorer l''état de santé et le bien-être de la population gabonaise en assurant l''accès universel à des services de santé de qualité, équitables et efficaces'
      ),
      now(),
      now()
    ) RETURNING id INTO ministry_id;
  END IF;

  -- 3. Créer le profil dans la table profiles
  INSERT INTO profiles (
    id,
    user_id,
    email,
    phone,
    first_name,
    last_name,
    profile_type,
    is_active,
    metadata,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    'ministre@sante.gouv.ga',
    '+241 01-72-26-61',
    'Adrien',
    'MOUGOUGOU',
    'professional',
    true,
    jsonb_build_object(
      'title', 'Professeur',
      'position', 'Ministre de la Santé',
      'cabinet', 'Cabinet du Ministre',
      'specialization', 'Santé Publique',
      'responsibilities', ARRAY[
        'Définition de la politique nationale de santé',
        'Supervision des programmes de santé',
        'Gestion du budget du ministère',
        'Relations internationales en santé',
        'Coordination des établissements de santé'
      ]
    ),
    now(),
    now()
  );

  -- 4. Créer l'entrée dans la table professionals
  INSERT INTO professionals (
    id,
    user_id,
    full_name,
    email,
    phone,
    speciality,
    professional_type,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    'Pr. Adrien MOUGOUGOU',
    'ministre@sante.gouv.ga',
    '+241 01-72-26-61',
    'Santé Publique et Administration',
    'minister',
    now(),
    now()
  ) RETURNING id INTO minister_professional_id;

  -- 5. Créer le département "Cabinet du Ministre"
  INSERT INTO establishment_departments (
    id,
    establishment_id,
    name,
    code,
    description,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    ministry_id,
    'Cabinet du Ministre',
    'CAB-MIN',
    'Cabinet du Ministre de la Santé - Direction politique et administrative',
    true,
    now(),
    now()
  ) ON CONFLICT (establishment_id, code) DO NOTHING;

  -- 6. Ajouter le ministre au staff de l'établissement
  INSERT INTO establishment_staff (
    id,
    professional_id,
    establishment_id,
    department_id,
    role,
    position,
    is_department_head,
    is_establishment_admin,
    permissions,
    status,
    start_date,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    minister_professional_id,
    ministry_id,
    (SELECT id FROM establishment_departments WHERE establishment_id = ministry_id AND code = 'CAB-MIN'),
    'minister',
    'Ministre de la Santé',
    true,
    true,
    jsonb_build_object(
      'can_create_decrees', true,
      'can_approve_budgets', true,
      'can_manage_policies', true,
      'can_view_all_statistics', true,
      'can_manage_all_establishments', true,
      'can_manage_all_professionals', true,
      'can_approve_national_programs', true,
      'can_sign_documents', true,
      'can_manage_crisis', true,
      'access_level', 'national'
    ),
    'active',
    '2024-01-01'::date,
    now(),
    now()
  );

  -- 7. Ajouter le rôle multi-établissement
  INSERT INTO user_establishment_roles (
    user_id,
    establishment_id,
    role,
    department,
    is_primary,
    created_at
  ) VALUES (
    new_user_id,
    ministry_id,
    'minister',
    'Cabinet du Ministre',
    true,
    now()
  ) ON CONFLICT (user_id, establishment_id, role) DO NOTHING;

  -- 8. Créer les modules spécifiques du ministre
  -- Table pour les décrets ministériels (si elle n'existe pas)
  CREATE TABLE IF NOT EXISTS ministerial_decrees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decree_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('decree', 'order', 'circular', 'decision', 'note')),
    content TEXT NOT NULL,
    status TEXT CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived')) DEFAULT 'draft',
    effective_date DATE,
    expiry_date DATE,
    created_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  -- Table pour les indicateurs de santé nationaux
  CREATE TABLE IF NOT EXISTS national_health_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indicator_code TEXT UNIQUE NOT NULL,
    indicator_name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'mortality', 'morbidity', 'coverage', 'resources', 'finance'
    current_value NUMERIC,
    target_value NUMERIC,
    unit TEXT,
    period TEXT, -- 'monthly', 'quarterly', 'yearly'
    province TEXT,
    trend TEXT CHECK (trend IN ('increasing', 'decreasing', 'stable')),
    data_source TEXT,
    last_updated DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  -- Table pour les programmes nationaux de santé
  CREATE TABLE IF NOT EXISTS national_health_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_code TEXT UNIQUE NOT NULL,
    program_name TEXT NOT NULL,
    description TEXT,
    objectives JSONB DEFAULT '[]',
    budget_allocated NUMERIC,
    budget_executed NUMERIC,
    start_date DATE,
    end_date DATE,
    status TEXT CHECK (status IN ('planning', 'active', 'suspended', 'completed', 'archived')) DEFAULT 'planning',
    responsible_department TEXT,
    key_performance_indicators JSONB DEFAULT '[]',
    provinces_covered TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  -- Table pour les réunions et décisions ministérielles
  CREATE TABLE IF NOT EXISTS ministerial_meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_type TEXT CHECK (meeting_type IN ('cabinet', 'crisis', 'coordination', 'international', 'provincial')),
    title TEXT NOT NULL,
    agenda JSONB DEFAULT '[]',
    attendees JSONB DEFAULT '[]',
    decisions JSONB DEFAULT '[]',
    action_items JSONB DEFAULT '[]',
    meeting_date TIMESTAMPTZ,
    location TEXT,
    minutes TEXT,
    attachments JSONB DEFAULT '[]',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  RAISE NOTICE 'Compte du Ministre créé avec succès!';
  RAISE NOTICE 'Email: ministre@sante.gouv.ga';
  RAISE NOTICE 'Mot de passe: MinistryGab2025!';
  RAISE NOTICE 'Établissement: Ministère de la Santé';
  
END $$;

-- Ajouter quelques indicateurs de santé initiaux
INSERT INTO national_health_indicators (indicator_code, indicator_name, category, current_value, target_value, unit, period)
VALUES 
  ('CSU-001', 'Taux de Couverture Sanitaire Universelle', 'coverage', 78, 95, '%', 'yearly'),
  ('MM-001', 'Taux de Mortalité Maternelle', 'mortality', 316, 150, 'pour 100 000', 'yearly'),
  ('MI-001', 'Taux de Mortalité Infantile', 'mortality', 45, 25, 'pour 1 000', 'yearly'),
  ('MED-001', 'Ratio Médecins/Population', 'resources', 0.8, 1.5, 'pour 1 000', 'yearly'),
  ('CNAMGS-001', 'Population couverte CNAMGS', 'coverage', 1800000, 2100000, 'personnes', 'quarterly'),
  ('HOSP-001', 'Établissements opérationnels', 'resources', 238, 300, 'nombre', 'monthly')
ON CONFLICT (indicator_code) DO NOTHING;

-- Ajouter des programmes nationaux
INSERT INTO national_health_programs (program_code, program_name, description, status, budget_allocated)
VALUES 
  ('PNDS-2024', 'Plan National de Développement Sanitaire 2024-2028', 'Programme quinquennal de développement du système de santé', 'active', 150000000000),
  ('PLMI-2025', 'Programme de Lutte contre la Mortalité Infantile', 'Réduction de la mortalité infantile et maternelle', 'active', 25000000000),
  ('PEV-2025', 'Programme Élargi de Vaccination', 'Vaccination universelle des enfants', 'active', 15000000000),
  ('PNLT-2025', 'Programme National de Lutte contre la Tuberculose', 'Élimination de la tuberculose', 'active', 8000000000)
ON CONFLICT (program_code) DO NOTHING;
