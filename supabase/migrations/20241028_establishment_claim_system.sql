-- ============================================================================
-- MIGRATION: Système de Revendication des Établissements
-- Date: 2024-10-28
-- Description: Permet aux établissements pré-enregistrés d'être revendiqués
-- ============================================================================

-- 1. Types ENUM pour le statut de revendication
-- ----------------------------------------------------------------------------
CREATE TYPE claim_status AS ENUM (
    'unclaimed',      -- Non revendiqué (état initial)
    'claim_pending',  -- Revendication en cours
    'verified',       -- Vérifié et actif
    'rejected',       -- Revendication rejetée
    'suspended'       -- Suspendu après vérification
);

CREATE TYPE claim_request_status AS ENUM (
    'draft',          -- Brouillon
    'pending',        -- Soumis, en attente
    'in_review',      -- En cours d'examen
    'approved',       -- Approuvé
    'rejected',       -- Rejeté
    'expired'         -- Expiré
);

CREATE TYPE verification_step AS ENUM (
    'identity_verified',
    'documents_uploaded',
    'authority_verified',
    'professional_order_checked',
    'ministry_approved',
    'final_validation'
);

-- 2. Mise à jour de la table establishments
-- ----------------------------------------------------------------------------
ALTER TABLE establishments 
ADD COLUMN IF NOT EXISTS claim_status claim_status DEFAULT 'unclaimed',
ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verification_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS is_pre_registered BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS public_contact_email TEXT,
ADD COLUMN IF NOT EXISTS public_contact_phone TEXT;

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_establishments_claim_status 
ON establishments(claim_status);

CREATE INDEX IF NOT EXISTS idx_establishments_claimed_by 
ON establishments(claimed_by);

-- 3. Table des demandes de revendication
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS establishment_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Établissement concerné
    establishment_id UUID NOT NULL REFERENCES establishments(id),
    
    -- Demandeur
    claimant_user_id UUID NOT NULL REFERENCES users(id),
    claimant_role TEXT NOT NULL, -- "Directeur", "Administrateur", "Propriétaire", etc.
    claimant_phone TEXT NOT NULL,
    claimant_email TEXT NOT NULL,
    claimant_title TEXT, -- Titre officiel
    
    -- Documents de vérification (URLs vers storage)
    documents JSONB DEFAULT '{}',
    /* Structure attendue:
    {
        "official_letter": "url",
        "identity_proof": "url",
        "authority_proof": "url",
        "rccm_document": "url",
        "msp_authorization": "url",
        "other_documents": ["url1", "url2"]
    }
    */
    
    -- Code de vérification unique
    verification_code TEXT UNIQUE DEFAULT gen_random_uuid()::text,
    
    -- Statut et processus
    status claim_request_status DEFAULT 'draft',
    verification_steps JSONB DEFAULT '[]', -- Array of completed steps
    
    -- Révision
    reviewer_id UUID REFERENCES users(id),
    review_notes TEXT,
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT unique_active_claim UNIQUE (establishment_id, claimant_user_id, status)
);

-- Index pour recherches
CREATE INDEX idx_claims_status ON establishment_claims(status);
CREATE INDEX idx_claims_establishment ON establishment_claims(establishment_id);
CREATE INDEX idx_claims_claimant ON establishment_claims(claimant_user_id);
CREATE INDEX idx_claims_verification_code ON establishment_claims(verification_code);

-- 4. Table d'historique des revendications
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS claim_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL REFERENCES establishment_claims(id),
    establishment_id UUID NOT NULL REFERENCES establishments(id),
    user_id UUID NOT NULL REFERENCES users(id),
    action TEXT NOT NULL, -- 'created', 'submitted', 'document_added', 'reviewed', etc.
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_claim_history_claim ON claim_history(claim_id);
CREATE INDEX idx_claim_history_establishment ON claim_history(establishment_id);
CREATE INDEX idx_claim_history_created ON claim_history(created_at DESC);

-- 5. Table des administrateurs d'établissement
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS establishment_administrators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID NOT NULL REFERENCES establishments(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role TEXT NOT NULL, -- 'owner', 'director', 'admin', 'manager'
    permissions JSONB DEFAULT '[]',
    is_primary BOOLEAN DEFAULT FALSE,
    appointed_by UUID REFERENCES users(id),
    appointed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by UUID REFERENCES users(id),
    revocation_reason TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    UNIQUE(establishment_id, user_id, is_active)
);

CREATE INDEX idx_establishment_admins_establishment 
ON establishment_administrators(establishment_id);

CREATE INDEX idx_establishment_admins_user 
ON establishment_administrators(user_id);

-- 6. Vues utiles
-- ----------------------------------------------------------------------------

-- Vue des établissements avec statut de revendication
CREATE OR REPLACE VIEW v_establishments_with_claim_status AS
SELECT 
    e.*,
    CASE 
        WHEN e.claim_status = 'unclaimed' THEN '⏳ Non-Revendiqué'
        WHEN e.claim_status = 'claim_pending' THEN '🔄 Vérification en Cours'
        WHEN e.claim_status = 'verified' THEN '✅ Vérifié'
        WHEN e.claim_status = 'rejected' THEN '❌ Rejeté'
        WHEN e.claim_status = 'suspended' THEN '⚠️ Suspendu'
    END as status_display,
    u.first_name || ' ' || u.last_name as claimed_by_name,
    COUNT(DISTINCT ec.id) as total_claim_attempts
FROM establishments e
LEFT JOIN users u ON e.claimed_by = u.id
LEFT JOIN establishment_claims ec ON e.id = ec.establishment_id
GROUP BY e.id, u.id;

-- Vue des revendications actives
CREATE OR REPLACE VIEW v_active_claims AS
SELECT 
    ec.*,
    e.name as establishment_name,
    e.type as establishment_type,
    e.city,
    e.province,
    u.first_name || ' ' || u.last_name as claimant_name,
    r.first_name || ' ' || r.last_name as reviewer_name
FROM establishment_claims ec
JOIN establishments e ON ec.establishment_id = e.id
JOIN users u ON ec.claimant_user_id = u.id
LEFT JOIN users r ON ec.reviewer_id = r.id
WHERE ec.status IN ('pending', 'in_review')
    AND ec.expires_at > NOW();

-- 7. Fonctions utilitaires
-- ----------------------------------------------------------------------------

-- Fonction pour vérifier si un utilisateur peut revendiquer un établissement
CREATE OR REPLACE FUNCTION can_user_claim_establishment(
    p_user_id UUID,
    p_establishment_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_establishment_status claim_status;
    v_existing_claims INTEGER;
    v_user_claims_today INTEGER;
BEGIN
    -- Vérifier le statut de l'établissement
    SELECT claim_status INTO v_establishment_status
    FROM establishments
    WHERE id = p_establishment_id;
    
    IF v_establishment_status != 'unclaimed' THEN
        RETURN FALSE;
    END IF;
    
    -- Vérifier les revendications existantes
    SELECT COUNT(*) INTO v_existing_claims
    FROM establishment_claims
    WHERE establishment_id = p_establishment_id
        AND claimant_user_id = p_user_id
        AND status IN ('pending', 'in_review');
    
    IF v_existing_claims > 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Limite de 3 revendications par jour (anti-spam)
    SELECT COUNT(*) INTO v_user_claims_today
    FROM establishment_claims
    WHERE claimant_user_id = p_user_id
        AND created_at > NOW() - INTERVAL '24 hours';
    
    IF v_user_claims_today >= 3 THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour soumettre une revendication
CREATE OR REPLACE FUNCTION submit_establishment_claim(
    p_claim_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_establishment_id UUID;
    v_status claim_request_status;
BEGIN
    -- Récupérer les infos de la revendication
    SELECT establishment_id, status INTO v_establishment_id, v_status
    FROM establishment_claims
    WHERE id = p_claim_id;
    
    IF v_status != 'draft' THEN
        RETURN FALSE;
    END IF;
    
    -- Mettre à jour le statut
    UPDATE establishment_claims
    SET status = 'pending',
        submitted_at = NOW(),
        updated_at = NOW()
    WHERE id = p_claim_id;
    
    -- Mettre à jour l'établissement
    UPDATE establishments
    SET claim_status = 'claim_pending'
    WHERE id = v_establishment_id;
    
    -- Ajouter à l'historique
    INSERT INTO claim_history (
        claim_id, establishment_id, user_id, action, details
    )
    SELECT 
        id, establishment_id, claimant_user_id, 'submitted',
        jsonb_build_object('submitted_at', NOW())
    FROM establishment_claims
    WHERE id = p_claim_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour approuver une revendication
CREATE OR REPLACE FUNCTION approve_establishment_claim(
    p_claim_id UUID,
    p_reviewer_id UUID,
    p_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_establishment_id UUID;
    v_claimant_id UUID;
BEGIN
    -- Récupérer les infos
    SELECT establishment_id, claimant_user_id 
    INTO v_establishment_id, v_claimant_id
    FROM establishment_claims
    WHERE id = p_claim_id;
    
    -- Mettre à jour la revendication
    UPDATE establishment_claims
    SET status = 'approved',
        reviewer_id = p_reviewer_id,
        review_notes = p_notes,
        approved_at = NOW(),
        reviewed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_claim_id;
    
    -- Mettre à jour l'établissement
    UPDATE establishments
    SET claim_status = 'verified',
        claimed_by = v_claimant_id,
        claimed_at = NOW()
    WHERE id = v_establishment_id;
    
    -- Ajouter l'administrateur
    INSERT INTO establishment_administrators (
        establishment_id, user_id, role, is_primary, appointed_by
    ) VALUES (
        v_establishment_id, v_claimant_id, 'owner', TRUE, p_reviewer_id
    );
    
    -- Historique
    INSERT INTO claim_history (
        claim_id, establishment_id, user_id, action, details
    ) VALUES (
        p_claim_id, v_establishment_id, p_reviewer_id, 'approved',
        jsonb_build_object('notes', p_notes, 'approved_at', NOW())
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 8. Triggers
-- ----------------------------------------------------------------------------

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_establishment_claims_updated_at
    BEFORE UPDATE ON establishment_claims
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Données initiales - Pré-enregistrer les établissements majeurs
-- ----------------------------------------------------------------------------

-- Insérer les établissements non-revendiqués du Gabon
INSERT INTO establishments (
    name, type, sector, province, city, address,
    claim_status, is_pre_registered,
    services, capacity
) VALUES 
-- Hôpitaux publics
('Centre Hospitalier Universitaire de Libreville', 'hospital', 'public', 
 'Estuaire', 'Libreville', 'Boulevard du Bord de Mer',
 'unclaimed', true,
 '["Urgences", "Chirurgie", "Maternité", "Pédiatrie", "Cardiologie"]'::jsonb,
 '{"beds": 500, "operating_rooms": 10}'::jsonb),

('Centre Hospitalier Régional de Melen', 'hospital', 'public',
 'Estuaire', 'Libreville', 'Quartier Melen',
 'unclaimed', true,
 '["Urgences", "Médecine Générale", "Maternité"]'::jsonb,
 '{"beds": 200}'::jsonb),

('Hôpital d''Instruction des Armées Omar Bongo Ondimba', 'hospital', 'military',
 'Estuaire', 'Libreville', 'Camp de Gaulle',
 'unclaimed', true,
 '["Urgences", "Chirurgie", "Médecine Militaire"]'::jsonb,
 '{"beds": 300}'::jsonb),

-- Cliniques privées
('Polyclinique El Rapha Dr. Chambrier', 'clinic', 'private',
 'Estuaire', 'Libreville', 'Centre-ville',
 'unclaimed', true,
 '["Consultations Spécialisées", "Chirurgie", "Imagerie"]'::jsonb,
 '{"beds": 120}'::jsonb),

('Clinique Sainte-Marie', 'clinic', 'confessional',
 'Estuaire', 'Libreville', 'Quartier Louis',
 'unclaimed', true,
 '["Médecine Générale", "Pédiatrie", "Gynécologie"]'::jsonb,
 '{"beds": 50}'::jsonb)

ON CONFLICT DO NOTHING;

-- 10. Permissions et RLS
-- ----------------------------------------------------------------------------

-- Activer RLS
ALTER TABLE establishment_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment_administrators ENABLE ROW LEVEL SECURITY;

-- Policies pour establishment_claims
CREATE POLICY "Users can view their own claims" ON establishment_claims
    FOR SELECT USING (claimant_user_id = auth.uid());

CREATE POLICY "Users can create claims" ON establishment_claims
    FOR INSERT WITH CHECK (claimant_user_id = auth.uid());

CREATE POLICY "Users can update their draft claims" ON establishment_claims
    FOR UPDATE USING (
        claimant_user_id = auth.uid() 
        AND status = 'draft'
    );

-- Policies pour les admins
CREATE POLICY "Admins can view all claims" ON establishment_claims
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================
