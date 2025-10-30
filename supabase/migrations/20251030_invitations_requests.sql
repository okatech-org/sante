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
