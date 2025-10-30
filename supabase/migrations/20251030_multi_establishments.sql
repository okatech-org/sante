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
