-- ============================================================================
-- MIGRATION: Architecture Multi-Établissements SANTE.GA
-- Date: 2024-10-27
-- Description: Refonte complète pour supporter les affiliations multiples
-- ============================================================================

-- 1. ENUM Types
-- ----------------------------------------------------------------------------
CREATE TYPE user_type AS ENUM ('patient', 'professional', 'admin');
CREATE TYPE establishment_type AS ENUM ('hospital', 'clinic', 'cabinet', 'pharmacy', 'laboratory');
CREATE TYPE establishment_sector AS ENUM ('public', 'private', 'confessional', 'military');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'suspended');
CREATE TYPE affiliation_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE registration_type AS ENUM ('regular', 'emergency', 'referral');

-- 2. Table des Utilisateurs (Un profil unique par personne)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    national_id TEXT UNIQUE,
    user_type user_type NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_type ON users(user_type);

-- 3. Table des Profils Professionnels
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS professional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Informations professionnelles
    ordre_number TEXT UNIQUE, -- Numéro d'ordre (CNOM, ONPG, etc.)
    specialty TEXT[],
    qualifications JSONB DEFAULT '{}',
    years_of_experience INTEGER,
    
    -- Établissement principal
    main_establishment_id UUID,
    
    -- Statut de vérification
    verification_status verification_status DEFAULT 'pending',
    verification_date TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_professional_ordre ON professional_profiles(ordre_number);
CREATE INDEX idx_professional_user ON professional_profiles(user_id);

-- 4. Table des Établissements/Structures
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS establishments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Informations de base
    name TEXT NOT NULL,
    type establishment_type NOT NULL,
    subtype TEXT,
    sector establishment_sector NOT NULL,
    
    -- Informations légales
    rccm_number TEXT, -- Registre de commerce
    authorization_number TEXT, -- Autorisation ministérielle
    cnamgs_convention BOOLEAN DEFAULT FALSE,
    cnss_affiliation BOOLEAN DEFAULT FALSE,
    
    -- Localisation
    province TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    postal_code TEXT,
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),
    
    -- Contact
    phone_primary TEXT,
    phone_secondary TEXT,
    email TEXT,
    website TEXT,
    
    -- Configuration du portail
    has_dedicated_portal BOOLEAN DEFAULT FALSE,
    portal_subdomain TEXT UNIQUE, -- Ex: chu-owendo.sante.ga
    portal_theme JSONB DEFAULT '{}', -- Personnalisation visuelle
    
    -- Capacités et services
    services JSONB DEFAULT '[]', -- Services offerts
    capacity JSONB DEFAULT '{}', -- Nombre lits, salles, etc.
    equipment JSONB DEFAULT '[]', -- IRM, Scanner, etc.
    operating_hours JSONB DEFAULT '{}', -- Horaires par service
    
    -- Statut
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_establishments_type ON establishments(type);
CREATE INDEX idx_establishments_sector ON establishments(sector);
CREATE INDEX idx_establishments_city ON establishments(city);
CREATE INDEX idx_establishments_province ON establishments(province);

-- 5. Table des Affiliations Professionnels <-> Établissements
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS professional_affiliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
    
    -- Rôle dans cet établissement
    role TEXT NOT NULL, -- "Médecin Généraliste", "Chef de Service", etc.
    department TEXT, -- Service/Département
    is_department_head BOOLEAN DEFAULT FALSE,
    is_establishment_admin BOOLEAN DEFAULT FALSE,
    
    -- Permissions spécifiques à cet établissement
    permissions TEXT[] DEFAULT '{}', -- ['consultation', 'prescription', 'surgery', 'admin']
    
    -- Planning dans cet établissement
    schedule JSONB DEFAULT '{}', -- Horaires par jour
    consultation_duration INTEGER DEFAULT 30, -- Minutes par consultation
    consultation_fee DECIMAL(10, 2), -- Tarif consultation
    
    -- Statut
    status affiliation_status DEFAULT 'active',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte d'unicité
    UNIQUE(professional_id, establishment_id, role)
);

CREATE INDEX idx_affiliations_professional ON professional_affiliations(professional_id);
CREATE INDEX idx_affiliations_establishment ON professional_affiliations(establishment_id);
CREATE INDEX idx_affiliations_status ON professional_affiliations(status);

-- 6. Table des Relations Patients <-> Établissements
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS patient_establishments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
    
    -- Type de relation
    registration_type registration_type DEFAULT 'regular',
    referring_establishment_id UUID REFERENCES establishments(id),
    referral_reason TEXT,
    
    -- Données médicales
    medical_record_number TEXT, -- Numéro dossier dans cet établissement
    primary_doctor_id UUID REFERENCES professional_profiles(id),
    
    -- Historique
    first_visit DATE DEFAULT CURRENT_DATE,
    last_visit DATE,
    visit_count INTEGER DEFAULT 0,
    
    -- Statut
    status affiliation_status DEFAULT 'active',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte d'unicité par établissement
    UNIQUE(patient_id, establishment_id, medical_record_number)
);

CREATE INDEX idx_patient_establishments_patient ON patient_establishments(patient_id);
CREATE INDEX idx_patient_establishments_establishment ON patient_establishments(establishment_id);
CREATE INDEX idx_patient_establishments_doctor ON patient_establishments(primary_doctor_id);

-- 7. Table des Contextes de Travail (Session active)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
    affiliation_id UUID REFERENCES professional_affiliations(id) ON DELETE CASCADE,
    
    -- Session
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    
    -- Contexte
    ip_address INET,
    user_agent TEXT,
    
    -- Contrainte : un seul contexte actif par utilisateur
    UNIQUE(user_id, ended_at)
);

CREATE INDEX idx_work_contexts_user ON work_contexts(user_id);
CREATE INDEX idx_work_contexts_establishment ON work_contexts(establishment_id);

-- 8. Table d'Audit des Actions Multi-Établissements
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS multi_establishment_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    establishment_id UUID REFERENCES establishments(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON multi_establishment_audit(user_id);
CREATE INDEX idx_audit_establishment ON multi_establishment_audit(establishment_id);
CREATE INDEX idx_audit_created ON multi_establishment_audit(created_at DESC);

-- 9. Vues Utiles
-- ----------------------------------------------------------------------------

-- Vue : Professionnels avec leurs établissements
CREATE OR REPLACE VIEW v_professional_establishments AS
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    pp.ordre_number,
    pp.specialty,
    e.id as establishment_id,
    e.name as establishment_name,
    e.type as establishment_type,
    pa.role,
    pa.department,
    pa.permissions,
    pa.status
FROM users u
JOIN professional_profiles pp ON u.id = pp.user_id
JOIN professional_affiliations pa ON pp.id = pa.professional_id
JOIN establishments e ON pa.establishment_id = e.id
WHERE pa.status = 'active';

-- Vue : Patients avec leurs établissements
CREATE OR REPLACE VIEW v_patient_establishments AS
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    e.id as establishment_id,
    e.name as establishment_name,
    e.type as establishment_type,
    pe.medical_record_number,
    pe.visit_count,
    pe.last_visit,
    pe.status
FROM users u
JOIN patient_establishments pe ON u.id = pe.patient_id
JOIN establishments e ON pe.establishment_id = e.id
WHERE pe.status = 'active';

-- 10. Fonctions Utiles
-- ----------------------------------------------------------------------------

-- Fonction : Obtenir les établissements d'un professionnel
CREATE OR REPLACE FUNCTION get_professional_establishments(p_user_id UUID)
RETURNS TABLE(
    establishment_id UUID,
    establishment_name TEXT,
    establishment_type establishment_type,
    role TEXT,
    permissions TEXT[],
    is_admin BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.name,
        e.type,
        pa.role,
        pa.permissions,
        pa.is_establishment_admin
    FROM professional_profiles pp
    JOIN professional_affiliations pa ON pp.id = pa.professional_id
    JOIN establishments e ON pa.establishment_id = e.id
    WHERE pp.user_id = p_user_id
        AND pa.status = 'active'
        AND e.is_active = TRUE
    ORDER BY pa.is_establishment_admin DESC, e.name;
END;
$$ LANGUAGE plpgsql;

-- Fonction : Vérifier les permissions
CREATE OR REPLACE FUNCTION check_permission(
    p_user_id UUID,
    p_establishment_id UUID,
    p_permission TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_has_permission BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM professional_profiles pp
        JOIN professional_affiliations pa ON pp.id = pa.professional_id
        WHERE pp.user_id = p_user_id
            AND pa.establishment_id = p_establishment_id
            AND pa.status = 'active'
            AND (
                pa.is_establishment_admin = TRUE
                OR p_permission = ANY(pa.permissions)
            )
    ) INTO v_has_permission;
    
    RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql;

-- 11. Triggers
-- ----------------------------------------------------------------------------

-- Trigger : Mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_establishments_updated_at BEFORE UPDATE ON establishments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_profiles_updated_at BEFORE UPDATE ON professional_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Row Level Security (RLS)
-- ----------------------------------------------------------------------------

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_establishments ENABLE ROW LEVEL SECURITY;

-- Policies basiques (à affiner selon les besoins)
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Establishments are viewable by all authenticated users" ON establishments
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Professionals can view their affiliations" ON professional_affiliations
    FOR SELECT USING (
        professional_id IN (
            SELECT id FROM professional_profiles WHERE user_id = auth.uid()
        )
    );

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================
