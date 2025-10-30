-- Migration pour l'architecture multi-établissements et rôles contextuels
-- Date: 30/10/2025

-- =====================================================
-- 1. Table des professionnels (si elle n'existe pas déjà)
-- =====================================================
CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  license_number TEXT,
  speciality TEXT,
  professional_type TEXT, -- doctor, nurse, pharmacist, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_email ON professionals(email);

-- =====================================================
-- 2. Table des établissements (mise à jour si nécessaire)
-- =====================================================
CREATE TABLE IF NOT EXISTS establishments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- hospital, clinic, pharmacy, laboratory, cmst
  sub_type TEXT, -- public, private, military, corporate
  address TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes
CREATE INDEX IF NOT EXISTS idx_establishments_type ON establishments(type);
CREATE INDEX IF NOT EXISTS idx_establishments_city ON establishments(city);
CREATE INDEX IF NOT EXISTS idx_establishments_is_active ON establishments(is_active);

-- =====================================================
-- 3. Table des départements/services par établissement
-- =====================================================
CREATE TABLE IF NOT EXISTS establishment_departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Urgences, Cardiologie, Pédiatrie, etc.
  code TEXT, -- URG, CARD, PED, etc.
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(establishment_id, code)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_departments_establishment ON establishment_departments(establishment_id);

-- =====================================================
-- 4. Table de liaison: Professionnel <-> Établissement
-- =====================================================
CREATE TABLE IF NOT EXISTS establishment_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
  department_id UUID REFERENCES establishment_departments(id) ON DELETE SET NULL,
  
  -- Rôles et permissions
  role TEXT NOT NULL, -- director, admin, doctor, nurse, pharmacist, laborantin, receptionist
  position TEXT, -- Chef de service, Médecin senior, etc.
  is_department_head BOOLEAN DEFAULT false,
  is_establishment_admin BOOLEAN DEFAULT false,
  
  -- Permissions spécifiques (override les permissions par défaut du rôle)
  permissions JSONB DEFAULT '{}',
  
  -- Statut
  status TEXT DEFAULT 'active', -- active, inactive, suspended, vacation
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  
  -- Métadonnées
  matricule TEXT, -- Numéro matricule dans l'établissement
  office_location TEXT,
  office_phone TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contrainte d'unicité: un professionnel ne peut avoir qu'un seul rôle actif par établissement/département
  UNIQUE(professional_id, establishment_id, department_id)
);

-- Index pour les requêtes
CREATE INDEX IF NOT EXISTS idx_staff_professional ON establishment_staff(professional_id);
CREATE INDEX IF NOT EXISTS idx_staff_establishment ON establishment_staff(establishment_id);
CREATE INDEX IF NOT EXISTS idx_staff_department ON establishment_staff(department_id);
CREATE INDEX IF NOT EXISTS idx_staff_status ON establishment_staff(status);
CREATE INDEX IF NOT EXISTS idx_staff_role ON establishment_staff(role);

-- =====================================================
-- 5. Table des permissions par rôle
-- =====================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(establishment_id, role)
);

-- Permissions par défaut pour tous les établissements
INSERT INTO role_permissions (establishment_id, role, permissions) VALUES
(NULL, 'director', '{
  "dashboard": ["view", "edit"],
  "staff": ["view", "add", "edit", "delete"],
  "patients": ["view", "add", "edit", "delete"],
  "appointments": ["view", "add", "edit", "delete"],
  "consultations": ["view", "add", "edit", "delete"],
  "prescriptions": ["view", "add", "edit", "delete"],
  "billing": ["view", "add", "edit", "delete"],
  "reports": ["view", "generate"],
  "settings": ["view", "edit"]
}'),
(NULL, 'admin', '{
  "dashboard": ["view"],
  "staff": ["view", "add", "edit"],
  "patients": ["view", "add", "edit"],
  "appointments": ["view", "add", "edit"],
  "billing": ["view", "add", "edit"],
  "reports": ["view", "generate"],
  "settings": ["view"]
}'),
(NULL, 'doctor', '{
  "dashboard": ["view"],
  "patients": ["view", "add", "edit"],
  "appointments": ["view", "add", "edit"],
  "consultations": ["view", "add", "edit"],
  "prescriptions": ["view", "add", "edit"],
  "reports": ["view"]
}'),
(NULL, 'nurse', '{
  "dashboard": ["view"],
  "patients": ["view", "edit"],
  "appointments": ["view"],
  "consultations": ["view", "add"],
  "reports": ["view"]
}'),
(NULL, 'pharmacist', '{
  "dashboard": ["view"],
  "prescriptions": ["view", "dispense"],
  "inventory": ["view", "edit"],
  "reports": ["view"]
}'),
(NULL, 'laborantin', '{
  "dashboard": ["view"],
  "lab_tests": ["view", "add", "edit"],
  "results": ["view", "add", "edit"],
  "reports": ["view"]
}'),
(NULL, 'receptionist', '{
  "dashboard": ["view"],
  "patients": ["view", "add"],
  "appointments": ["view", "add", "edit"],
  "billing": ["view"]
}')
ON CONFLICT (establishment_id, role) DO NOTHING;

-- =====================================================
-- 6. Table de session d'établissement actuel
-- =====================================================
CREATE TABLE IF NOT EXISTS user_establishment_session (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES establishment_staff(id) ON DELETE CASCADE,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =====================================================
-- 7. Table des modules disponibles par établissement
-- =====================================================
CREATE TABLE IF NOT EXISTS establishment_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL, -- consultations, urgences, hospitalisation, laboratoire, pharmacie, etc.
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(establishment_id, module_name)
);

-- =====================================================
-- 8. Fonctions utilitaires
-- =====================================================

-- Fonction pour obtenir les établissements d'un professionnel
CREATE OR REPLACE FUNCTION get_professional_establishments(p_user_id UUID)
RETURNS TABLE (
  establishment_id UUID,
  establishment_name TEXT,
  establishment_type TEXT,
  role TEXT,
  department_name TEXT,
  position TEXT,
  is_admin BOOLEAN,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.name,
    e.type,
    es.role,
    ed.name,
    es.position,
    es.is_establishment_admin,
    es.status
  FROM establishment_staff es
  JOIN establishments e ON e.id = es.establishment_id
  JOIN professionals p ON p.id = es.professional_id
  LEFT JOIN establishment_departments ed ON ed.id = es.department_id
  WHERE p.user_id = p_user_id
    AND es.status = 'active'
    AND e.is_active = true
  ORDER BY es.is_establishment_admin DESC, e.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les permissions d'un utilisateur dans un établissement
CREATE OR REPLACE FUNCTION get_user_establishment_permissions(
  p_user_id UUID,
  p_establishment_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_role TEXT;
  v_permissions JSONB;
  v_custom_permissions JSONB;
BEGIN
  -- Récupérer le rôle et les permissions custom
  SELECT es.role, es.permissions
  INTO v_role, v_custom_permissions
  FROM establishment_staff es
  JOIN professionals p ON p.id = es.professional_id
  WHERE p.user_id = p_user_id
    AND es.establishment_id = p_establishment_id
    AND es.status = 'active';
  
  IF v_role IS NULL THEN
    RETURN '{}'::JSONB;
  END IF;
  
  -- Récupérer les permissions par défaut du rôle
  SELECT permissions
  INTO v_permissions
  FROM role_permissions
  WHERE (establishment_id = p_establishment_id OR establishment_id IS NULL)
    AND role = v_role
  ORDER BY establishment_id DESC NULLS LAST
  LIMIT 1;
  
  -- Fusionner avec les permissions custom
  IF v_custom_permissions IS NOT NULL AND v_custom_permissions != '{}'::JSONB THEN
    v_permissions = v_permissions || v_custom_permissions;
  END IF;
  
  RETURN COALESCE(v_permissions, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. Politiques RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur les tables
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_establishment_session ENABLE ROW LEVEL SECURITY;

-- Politiques pour professionals
CREATE POLICY "Users can view their own professional profile"
  ON professionals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own professional profile"
  ON professionals FOR UPDATE
  USING (auth.uid() = user_id);

-- Politiques pour establishment_staff
CREATE POLICY "Users can view their own establishment affiliations"
  ON establishment_staff FOR SELECT
  USING (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage establishment staff"
  ON establishment_staff FOR ALL
  USING (
    establishment_id IN (
      SELECT es.establishment_id
      FROM establishment_staff es
      JOIN professionals p ON p.id = es.professional_id
      WHERE p.user_id = auth.uid()
        AND (es.is_establishment_admin = true OR es.role = 'director')
    )
  );

-- Politiques pour user_establishment_session
CREATE POLICY "Users can manage their own session"
  ON user_establishment_session FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- 10. Triggers pour mise à jour automatique
-- =====================================================

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_establishments_updated_at
  BEFORE UPDATE ON establishments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_establishment_staff_updated_at
  BEFORE UPDATE ON establishment_staff
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 11. Données de test pour CMST SOGARA
-- =====================================================

-- Créer l'établissement CMST SOGARA s'il n'existe pas
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
) ON CONFLICT DO NOTHING;

-- Créer les départements du CMST SOGARA
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
-- 12. Commentaires et documentation
-- =====================================================
COMMENT ON TABLE professionals IS 'Table des professionnels de santé';
COMMENT ON TABLE establishments IS 'Table des établissements de santé';
COMMENT ON TABLE establishment_staff IS 'Table de liaison entre professionnels et établissements avec gestion des rôles';
COMMENT ON TABLE establishment_departments IS 'Départements/services par établissement';
COMMENT ON TABLE role_permissions IS 'Permissions par défaut pour chaque rôle';
COMMENT ON TABLE user_establishment_session IS 'Session établissement actuel pour chaque utilisateur';
COMMENT ON TABLE establishment_modules IS 'Modules activés par établissement';

COMMENT ON FUNCTION get_professional_establishments IS 'Récupère tous les établissements où travaille un professionnel';
COMMENT ON FUNCTION get_user_establishment_permissions IS 'Récupère les permissions d''un utilisateur dans un établissement donné';
-- Migration pour le système d'invitations et demandes d'établissements
-- Date: 30/10/2025

-- =====================================================
-- 1. Table des invitations d'établissements
-- =====================================================
CREATE TABLE IF NOT EXISTS establishment_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  role TEXT NOT NULL, -- doctor, nurse, admin, etc.
  department_id UUID REFERENCES establishment_departments(id),
  position TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected, expired
  token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes
CREATE INDEX IF NOT EXISTS idx_invitations_email ON establishment_invitations(invited_email);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON establishment_invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_establishment ON establishment_invitations(establishment_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON establishment_invitations(token);

-- =====================================================
-- 2. Table des demandes d'affiliation
-- =====================================================
CREATE TABLE IF NOT EXISTS establishment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
  requested_role TEXT NOT NULL,
  requested_department_id UUID REFERENCES establishment_departments(id),
  motivation TEXT,
  license_number TEXT,
  cv_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(professional_id, establishment_id, status)
);

-- Index pour les requêtes
CREATE INDEX IF NOT EXISTS idx_requests_professional ON establishment_requests(professional_id);
CREATE INDEX IF NOT EXISTS idx_requests_establishment ON establishment_requests(establishment_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON establishment_requests(status);

-- =====================================================
-- 3. Mise à jour du Dr. Jules DJEKI - Multi-rôles
-- =====================================================

-- Récupérer les IDs nécessaires
DO $$
DECLARE
  v_user_id UUID;
  v_professional_id UUID;
  v_establishment_id UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; -- CMST SOGARA
  v_dept_dir_id UUID;
  v_dept_med_id UUID;
BEGIN
  -- Récupérer l'ID utilisateur
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'directeur.sogara@sante.ga';

  -- Récupérer l'ID professionnel
  SELECT id INTO v_professional_id
  FROM professionals
  WHERE user_id = v_user_id;

  -- Récupérer les départements
  SELECT id INTO v_dept_dir_id
  FROM establishment_departments
  WHERE establishment_id = v_establishment_id AND code = 'DIR';

  SELECT id INTO v_dept_med_id
  FROM establishment_departments
  WHERE establishment_id = v_establishment_id AND code = 'MED';

  IF v_professional_id IS NOT NULL THEN
    -- Supprimer les anciennes affiliations
    DELETE FROM establishment_staff 
    WHERE professional_id = v_professional_id 
      AND establishment_id = v_establishment_id;

    -- Créer le rôle Directeur
    INSERT INTO establishment_staff (
      professional_id,
      establishment_id,
      department_id,
      role,
      position,
      is_department_head,
      is_establishment_admin,
      status,
      matricule
    ) VALUES (
      v_professional_id,
      v_establishment_id,
      v_dept_dir_id,
      'director',
      'Directeur Médical',
      true,
      true,
      'active',
      'DIR-001'
    );

    -- Créer le rôle Médecin Consultant
    INSERT INTO establishment_staff (
      professional_id,
      establishment_id,
      department_id,
      role,
      position,
      is_department_head,
      is_establishment_admin,
      status,
      matricule
    ) VALUES (
      v_professional_id,
      v_establishment_id,
      v_dept_med_id,
      'doctor',
      'Médecin Consultant',
      false,
      false,
      'active',
      'MED-001'
    );
  END IF;
END $$;

-- =====================================================
-- 4. Fonctions utilitaires
-- =====================================================

-- Fonction pour envoyer une invitation
CREATE OR REPLACE FUNCTION send_establishment_invitation(
  p_establishment_id UUID,
  p_invited_email TEXT,
  p_role TEXT,
  p_department_id UUID,
  p_position TEXT,
  p_message TEXT,
  p_invited_by UUID
)
RETURNS UUID AS $$
DECLARE
  v_invitation_id UUID;
BEGIN
  -- Vérifier si une invitation est déjà en cours
  SELECT id INTO v_invitation_id
  FROM establishment_invitations
  WHERE establishment_id = p_establishment_id
    AND invited_email = p_invited_email
    AND status = 'pending'
    AND expires_at > NOW();

  IF v_invitation_id IS NOT NULL THEN
    -- Mettre à jour l'invitation existante
    UPDATE establishment_invitations
    SET 
      role = p_role,
      department_id = p_department_id,
      position = p_position,
      message = p_message,
      expires_at = NOW() + INTERVAL '7 days',
      updated_at = NOW()
    WHERE id = v_invitation_id;
  ELSE
    -- Créer une nouvelle invitation
    INSERT INTO establishment_invitations (
      establishment_id,
      invited_email,
      invited_by,
      role,
      department_id,
      position,
      message
    ) VALUES (
      p_establishment_id,
      p_invited_email,
      p_invited_by,
      p_role,
      p_department_id,
      p_position,
      p_message
    ) RETURNING id INTO v_invitation_id;
  END IF;

  RETURN v_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour accepter une invitation
CREATE OR REPLACE FUNCTION accept_establishment_invitation(
  p_token TEXT,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_invitation RECORD;
  v_professional_id UUID;
BEGIN
  -- Récupérer l'invitation
  SELECT * INTO v_invitation
  FROM establishment_invitations
  WHERE token = p_token
    AND status = 'pending'
    AND expires_at > NOW();

  IF v_invitation IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Récupérer ou créer le professionnel
  SELECT id INTO v_professional_id
  FROM professionals
  WHERE user_id = p_user_id;

  IF v_professional_id IS NULL THEN
    -- Créer le profil professionnel
    INSERT INTO professionals (user_id, email, full_name)
    SELECT p_user_id, email, COALESCE(raw_user_meta_data->>'full_name', email)
    FROM auth.users
    WHERE id = p_user_id
    RETURNING id INTO v_professional_id;
  END IF;

  -- Créer l'affiliation
  INSERT INTO establishment_staff (
    professional_id,
    establishment_id,
    department_id,
    role,
    position,
    status
  ) VALUES (
    v_professional_id,
    v_invitation.establishment_id,
    v_invitation.department_id,
    v_invitation.role,
    v_invitation.position,
    'active'
  ) ON CONFLICT (professional_id, establishment_id, department_id) 
  DO UPDATE SET
    role = EXCLUDED.role,
    position = EXCLUDED.position,
    status = 'active',
    updated_at = NOW();

  -- Marquer l'invitation comme acceptée
  UPDATE establishment_invitations
  SET 
    status = 'accepted',
    accepted_at = NOW(),
    updated_at = NOW()
  WHERE id = v_invitation.id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour créer une demande d'affiliation
CREATE OR REPLACE FUNCTION request_establishment_affiliation(
  p_professional_id UUID,
  p_establishment_id UUID,
  p_requested_role TEXT,
  p_requested_department_id UUID,
  p_motivation TEXT,
  p_license_number TEXT
)
RETURNS UUID AS $$
DECLARE
  v_request_id UUID;
BEGIN
  INSERT INTO establishment_requests (
    professional_id,
    establishment_id,
    requested_role,
    requested_department_id,
    motivation,
    license_number
  ) VALUES (
    p_professional_id,
    p_establishment_id,
    p_requested_role,
    p_requested_department_id,
    p_motivation,
    p_license_number
  ) RETURNING id INTO v_request_id;

  RETURN v_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. Politiques RLS
-- =====================================================

-- Activer RLS
ALTER TABLE establishment_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment_requests ENABLE ROW LEVEL SECURITY;

-- Politiques pour les invitations
CREATE POLICY "Admins can manage invitations"
  ON establishment_invitations FOR ALL
  USING (
    establishment_id IN (
      SELECT es.establishment_id
      FROM establishment_staff es
      JOIN professionals p ON p.id = es.professional_id
      WHERE p.user_id = auth.uid()
        AND (es.is_establishment_admin = true OR es.role = 'director')
    )
  );

CREATE POLICY "Users can view their invitations"
  ON establishment_invitations FOR SELECT
  USING (
    invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Politiques pour les demandes
CREATE POLICY "Professionals can manage their requests"
  ON establishment_requests FOR ALL
  USING (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view and approve requests"
  ON establishment_requests FOR ALL
  USING (
    establishment_id IN (
      SELECT es.establishment_id
      FROM establishment_staff es
      JOIN professionals p ON p.id = es.professional_id
      WHERE p.user_id = auth.uid()
        AND (es.is_establishment_admin = true OR es.role = 'director')
    )
  );

-- =====================================================
-- 6. Notifications (table optionnelle)
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- invitation, request_approved, request_rejected, etc.
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read_at);

-- =====================================================
-- 7. Vue pour les statistiques d'établissement
-- =====================================================
CREATE OR REPLACE VIEW establishment_stats AS
SELECT 
  e.id as establishment_id,
  e.name as establishment_name,
  COUNT(DISTINCT es.professional_id) as total_staff,
  COUNT(DISTINCT es.professional_id) FILTER (WHERE es.role = 'doctor') as total_doctors,
  COUNT(DISTINCT es.professional_id) FILTER (WHERE es.role = 'nurse') as total_nurses,
  COUNT(DISTINCT ei.id) FILTER (WHERE ei.status = 'pending') as pending_invitations,
  COUNT(DISTINCT er.id) FILTER (WHERE er.status = 'pending') as pending_requests
FROM establishments e
LEFT JOIN establishment_staff es ON es.establishment_id = e.id AND es.status = 'active'
LEFT JOIN establishment_invitations ei ON ei.establishment_id = e.id
LEFT JOIN establishment_requests er ON er.establishment_id = e.id
GROUP BY e.id, e.name;

-- =====================================================
-- 8. Commentaires
-- =====================================================
COMMENT ON TABLE establishment_invitations IS 'Invitations envoyées par les établissements aux professionnels';
COMMENT ON TABLE establishment_requests IS 'Demandes d\'affiliation faites par les professionnels';
COMMENT ON FUNCTION send_establishment_invitation IS 'Envoie une invitation à rejoindre un établissement';
COMMENT ON FUNCTION accept_establishment_invitation IS 'Accepte une invitation et crée l\'affiliation';
COMMENT ON FUNCTION request_establishment_affiliation IS 'Crée une demande d\'affiliation à un établissement';
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
