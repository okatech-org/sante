-- ============================================
-- SANTE.GA Multi-Tenant Architecture Migration
-- ============================================
-- Architecture Features:
-- 1. Séparation Utilisateurs/Structures
-- 2. Multi-Affectation des professionnels
-- 3. Cloisonnement des données par établissement
-- 4. Établissements pré-créés (non-revendiqués)
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PART 1: USER MANAGEMENT TABLES
-- ============================================

-- Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS professional_affiliations CASCADE;
DROP TABLE IF EXISTS establishment_roles CASCADE;
DROP TABLE IF EXISTS establishment_invitations CASCADE;
DROP TABLE IF EXISTS professionals CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS establishments CASCADE;

-- Create ENUM types
DROP TYPE IF EXISTS gender_type CASCADE;
CREATE TYPE gender_type AS ENUM ('M', 'F', 'O');

DROP TYPE IF EXISTS profile_type CASCADE;
CREATE TYPE profile_type AS ENUM ('patient', 'professional');

DROP TYPE IF EXISTS insurance_status CASCADE;
CREATE TYPE insurance_status AS ENUM ('active', 'suspended', 'expired', 'pending');

DROP TYPE IF EXISTS blood_group_type CASCADE;
CREATE TYPE blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

DROP TYPE IF EXISTS profession_type CASCADE;
CREATE TYPE profession_type AS ENUM (
    'doctor', 
    'nurse', 
    'pharmacist', 
    'technician', 
    'midwife',
    'physiotherapist', 
    'psychologist', 
    'admin'
);

DROP TYPE IF EXISTS ordre_type CASCADE;
CREATE TYPE ordre_type AS ENUM ('CNOM', 'ONPG', 'ONI', 'OTHER');

DROP TYPE IF EXISTS ordre_status CASCADE;
CREATE TYPE ordre_status AS ENUM ('active', 'suspended', 'expired');

-- Core user profiles table (single identity per person)
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase auth
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    national_id TEXT UNIQUE,
    gender gender_type,
    profile_type profile_type NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    CONSTRAINT check_profile_type CHECK (profile_type IN ('patient', 'professional'))
);

-- Patients extension table
CREATE TABLE patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Insurance information
    cnamgs_number TEXT UNIQUE,
    cnamgs_status insurance_status,
    cnamgs_coverage_rate DECIMAL(3,2), -- 0.80 for 80%
    cnamgs_special_status TEXT, -- 'pregnant', 'ald', 'gef'
    
    cnss_number TEXT UNIQUE,
    cnss_status insurance_status,
    
    -- Medical information
    blood_group blood_group_type,
    allergies JSONB DEFAULT '[]',
    chronic_conditions JSONB DEFAULT '[]',
    current_medications JSONB DEFAULT '[]',
    
    -- Emergency contact
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Healthcare professionals extension table
CREATE TABLE professionals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Professional identity
    profession_type profession_type NOT NULL,
    
    -- Specializations (multiple possible)
    specializations TEXT[] DEFAULT '{}',
    sub_specializations TEXT[] DEFAULT '{}',
    
    -- Professional registration
    ordre_number TEXT UNIQUE, -- CNOM for doctors, ONPG for pharmacists
    ordre_type ordre_type,
    ordre_registration_date DATE,
    ordre_expiry_date DATE,
    ordre_status ordre_status,
    
    -- Qualifications
    degrees JSONB DEFAULT '[]', -- [{title, institution, year}]
    certifications JSONB DEFAULT '[]',
    continuing_education JSONB DEFAULT '[]',
    
    -- Professional settings
    years_of_experience INTEGER,
    languages_spoken TEXT[] DEFAULT ARRAY['French'],
    consultation_languages TEXT[] DEFAULT ARRAY['French'],
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES profiles(id),
    verification_documents JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PART 2: ESTABLISHMENTS TABLES
-- ============================================

DROP TYPE IF EXISTS establishment_type CASCADE;
CREATE TYPE establishment_type AS ENUM (
    'hospital', 
    'clinic', 
    'medical_cabinet',
    'pharmacy', 
    'laboratory', 
    'imaging_center'
);

DROP TYPE IF EXISTS sector_type CASCADE;
CREATE TYPE sector_type AS ENUM ('public', 'private', 'confessional', 'military');

DROP TYPE IF EXISTS claim_status CASCADE;
CREATE TYPE claim_status AS ENUM (
    'unclaimed', 
    'claim_pending', 
    'verified', 
    'rejected', 
    'suspended'
);

-- Main establishments table (all healthcare facilities)
CREATE TABLE establishments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic information
    name TEXT NOT NULL,
    establishment_type establishment_type NOT NULL,
    establishment_subtype TEXT, -- 'CHU', 'CHR', 'polyclinic', etc.
    
    -- Sector classification
    sector sector_type NOT NULL,
    
    -- Legal information
    rccm_number TEXT UNIQUE, -- Business registration
    authorization_number TEXT, -- Ministry of Health authorization
    authorization_date DATE,
    tax_id TEXT,
    
    -- Insurance partnerships
    cnamgs_convention BOOLEAN DEFAULT false,
    cnamgs_convention_number TEXT,
    cnamgs_tariff_agreement JSONB DEFAULT '{}',
    cnss_approved BOOLEAN DEFAULT false,
    
    -- Location
    province TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    address TEXT NOT NULL,
    postal_code TEXT,
    gps_latitude DECIMAL(10,8),
    gps_longitude DECIMAL(11,8),
    
    -- Contact
    phone_primary TEXT,
    phone_secondary TEXT,
    email TEXT,
    website TEXT,
    
    -- Claim status (pre-created establishments)
    claim_status claim_status DEFAULT 'unclaimed',
    claimed_by UUID REFERENCES profiles(id),
    claimed_at TIMESTAMP WITH TIME ZONE,
    claim_verified_at TIMESTAMP WITH TIME ZONE,
    claim_rejection_reason TEXT,
    
    -- Operating information
    operating_hours JSONB DEFAULT '{}', -- {monday: {open: "08:00", close: "17:00"}}
    emergency_available BOOLEAN DEFAULT false,
    home_service_available BOOLEAN DEFAULT false,
    teleconsultation_available BOOLEAN DEFAULT false,
    
    -- Capacity and services
    total_beds INTEGER,
    available_beds INTEGER,
    services_offered TEXT[] DEFAULT '{}',
    specialties_available TEXT[] DEFAULT '{}',
    equipment_available TEXT[] DEFAULT '{}',
    
    -- Portal configuration
    has_dedicated_portal BOOLEAN DEFAULT false,
    portal_subdomain TEXT UNIQUE,
    portal_theme JSONB DEFAULT '{}',
    portal_features JSONB DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    activation_date DATE,
    deactivation_date DATE,
    deactivation_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_gps_latitude CHECK (gps_latitude BETWEEN -90 AND 90),
    CONSTRAINT check_gps_longitude CHECK (gps_longitude BETWEEN -180 AND 180)
);

-- ============================================
-- PART 3: MULTI-AFFILIATION TABLES
-- ============================================

DROP TYPE IF EXISTS affiliation_role CASCADE;
CREATE TYPE affiliation_role AS ENUM (
    'owner',           -- Propriétaire de l'établissement
    'director',        -- Directeur médical
    'administrator',   -- Administrateur
    'department_head', -- Chef de service
    'practitioner',    -- Praticien standard
    'consultant',      -- Consultant externe
    'intern',          -- Interne/Stagiaire
    'staff'           -- Personnel médical
);

DROP TYPE IF EXISTS affiliation_status CASCADE;
CREATE TYPE affiliation_status AS ENUM (
    'pending',    -- En attente d'approbation
    'active',     -- Actif
    'suspended',  -- Suspendu temporairement
    'terminated'  -- Terminé
);

-- Professional affiliations (multi-establishment)
CREATE TABLE professional_affiliations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
    
    -- Role in this establishment
    role affiliation_role NOT NULL,
    department TEXT,
    service TEXT,
    
    -- Status
    status affiliation_status DEFAULT 'pending',
    
    -- Dates
    start_date DATE NOT NULL,
    end_date DATE,
    
    -- Working schedule specific to this establishment
    working_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    working_hours JSONB DEFAULT '{}', -- {monday: {start: "08:00", end: "17:00"}}
    
    -- Permissions specific to this establishment
    can_prescribe BOOLEAN DEFAULT true,
    can_admit_patients BOOLEAN DEFAULT false,
    can_access_all_patients BOOLEAN DEFAULT false,
    can_manage_staff BOOLEAN DEFAULT false,
    can_manage_inventory BOOLEAN DEFAULT false,
    can_view_financials BOOLEAN DEFAULT false,
    
    -- Approval workflow
    approved_by UUID REFERENCES profiles(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Metadata
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one professional can't have duplicate active affiliations in same establishment
    CONSTRAINT unique_active_affiliation UNIQUE (professional_id, establishment_id, status)
);

-- ============================================
-- PART 4: ESTABLISHMENT MANAGEMENT TABLES
-- ============================================

-- Establishment roles (for non-medical staff)
CREATE TABLE establishment_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    role_name TEXT NOT NULL, -- 'receptionist', 'accountant', 'it_admin', etc.
    department TEXT,
    
    -- Permissions
    permissions JSONB DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    start_date DATE NOT NULL,
    end_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_establishment_role UNIQUE (establishment_id, profile_id, role_name)
);

-- Establishment invitations
CREATE TABLE establishment_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
    
    -- Inviter
    invited_by UUID REFERENCES profiles(id),
    
    -- Invitee
    invitee_email TEXT NOT NULL,
    invitee_phone TEXT,
    invitee_name TEXT,
    
    -- Role offered
    proposed_role affiliation_role,
    proposed_department TEXT,
    
    -- Invitation details
    invitation_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    invitation_message TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'expired'
    
    -- Dates
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    responded_at TIMESTAMP WITH TIME ZONE,
    
    -- Response
    response_note TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_expiry CHECK (expires_at > sent_at)
);

-- ============================================
-- PART 5: INDEXES FOR PERFORMANCE
-- ============================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_profile_type ON profiles(profile_type);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_national_id ON profiles(national_id);

-- Patients indexes
CREATE INDEX idx_patients_profile_id ON patients(profile_id);
CREATE INDEX idx_patients_cnamgs ON patients(cnamgs_number);
CREATE INDEX idx_patients_cnss ON patients(cnss_number);

-- Professionals indexes
CREATE INDEX idx_professionals_profile_id ON professionals(profile_id);
CREATE INDEX idx_professionals_ordre ON professionals(ordre_number);
CREATE INDEX idx_professionals_type ON professionals(profession_type);
CREATE INDEX idx_professionals_verified ON professionals(is_verified);

-- Establishments indexes
CREATE INDEX idx_establishments_type ON establishments(establishment_type);
CREATE INDEX idx_establishments_sector ON establishments(sector);
CREATE INDEX idx_establishments_province ON establishments(province);
CREATE INDEX idx_establishments_city ON establishments(city);
CREATE INDEX idx_establishments_claim_status ON establishments(claim_status);
CREATE INDEX idx_establishments_active ON establishments(is_active);
CREATE INDEX idx_establishments_cnamgs ON establishments(cnamgs_convention);
CREATE INDEX idx_establishments_location ON establishments USING GIST (
    point(gps_longitude, gps_latitude)
) WHERE gps_latitude IS NOT NULL AND gps_longitude IS NOT NULL;

-- Affiliations indexes
CREATE INDEX idx_affiliations_professional ON professional_affiliations(professional_id);
CREATE INDEX idx_affiliations_establishment ON professional_affiliations(establishment_id);
CREATE INDEX idx_affiliations_status ON professional_affiliations(status);
CREATE INDEX idx_affiliations_role ON professional_affiliations(role);

-- ============================================
-- PART 6: FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_establishments_updated_at BEFORE UPDATE ON establishments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliations_updated_at BEFORE UPDATE ON professional_affiliations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check if user can claim establishment
CREATE OR REPLACE FUNCTION can_claim_establishment(
    p_profile_id UUID,
    p_establishment_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_profile_type profile_type;
    v_claim_status claim_status;
BEGIN
    -- Get profile type
    SELECT profile_type INTO v_profile_type
    FROM profiles
    WHERE id = p_profile_id;
    
    -- Only professionals can claim establishments
    IF v_profile_type != 'professional' THEN
        RETURN FALSE;
    END IF;
    
    -- Check establishment claim status
    SELECT claim_status INTO v_claim_status
    FROM establishments
    WHERE id = p_establishment_id;
    
    -- Can only claim unclaimed establishments
    RETURN v_claim_status = 'unclaimed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to claim an establishment
CREATE OR REPLACE FUNCTION claim_establishment(
    p_profile_id UUID,
    p_establishment_id UUID,
    p_proof_documents JSONB DEFAULT '[]'
) RETURNS BOOLEAN AS $$
DECLARE
    v_can_claim BOOLEAN;
BEGIN
    -- Check if user can claim
    v_can_claim := can_claim_establishment(p_profile_id, p_establishment_id);
    
    IF NOT v_can_claim THEN
        RAISE EXCEPTION 'Cannot claim this establishment';
    END IF;
    
    -- Update establishment
    UPDATE establishments
    SET 
        claim_status = 'claim_pending',
        claimed_by = p_profile_id,
        claimed_at = NOW()
    WHERE id = p_establishment_id;
    
    -- Create owner affiliation
    INSERT INTO professional_affiliations (
        professional_id,
        establishment_id,
        role,
        status,
        start_date,
        can_prescribe,
        can_admit_patients,
        can_access_all_patients,
        can_manage_staff,
        can_manage_inventory,
        can_view_financials
    )
    SELECT 
        p.id,
        p_establishment_id,
        'owner'::affiliation_role,
        'pending'::affiliation_status,
        CURRENT_DATE,
        true,
        true,
        true,
        true,
        true,
        true
    FROM professionals p
    WHERE p.profile_id = p_profile_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify establishment claim
CREATE OR REPLACE FUNCTION verify_establishment_claim(
    p_establishment_id UUID,
    p_verifier_id UUID,
    p_approved BOOLEAN,
    p_rejection_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
    IF p_approved THEN
        -- Approve claim
        UPDATE establishments
        SET 
            claim_status = 'verified',
            claim_verified_at = NOW()
        WHERE id = p_establishment_id;
        
        -- Activate owner affiliation
        UPDATE professional_affiliations
        SET 
            status = 'active',
            approved_by = p_verifier_id,
            approved_at = NOW()
        WHERE 
            establishment_id = p_establishment_id
            AND role = 'owner'
            AND status = 'pending';
    ELSE
        -- Reject claim
        UPDATE establishments
        SET 
            claim_status = 'rejected',
            claim_rejection_reason = p_rejection_reason,
            claimed_by = NULL,
            claimed_at = NULL
        WHERE id = p_establishment_id;
        
        -- Delete pending affiliation
        DELETE FROM professional_affiliations
        WHERE 
            establishment_id = p_establishment_id
            AND role = 'owner'
            AND status = 'pending';
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 7: ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment_invitations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Patients policies
CREATE POLICY "Patients can view their own data"
    ON patients FOR SELECT
    USING (
        profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can update their own data"
    ON patients FOR UPDATE
    USING (
        profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Professionals policies
CREATE POLICY "Professionals can view their own data"
    ON professionals FOR SELECT
    USING (
        profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Professionals can update their own data"
    ON professionals FOR UPDATE
    USING (
        profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Establishments policies
CREATE POLICY "Everyone can view active establishments"
    ON establishments FOR SELECT
    USING (is_active = true);

CREATE POLICY "Establishment owners can update their establishment"
    ON establishments FOR UPDATE
    USING (
        id IN (
            SELECT establishment_id 
            FROM professional_affiliations pa
            JOIN professionals p ON pa.professional_id = p.id
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
            AND pa.role = 'owner'
            AND pa.status = 'active'
        )
    );

-- Professional affiliations policies
CREATE POLICY "Professionals can view their own affiliations"
    ON professional_affiliations FOR SELECT
    USING (
        professional_id IN (
            SELECT p.id 
            FROM professionals p
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
        )
    );

CREATE POLICY "Establishment managers can view their establishment's affiliations"
    ON professional_affiliations FOR SELECT
    USING (
        establishment_id IN (
            SELECT establishment_id 
            FROM professional_affiliations pa
            JOIN professionals p ON pa.professional_id = p.id
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
            AND pa.role IN ('owner', 'director', 'administrator')
            AND pa.status = 'active'
        )
    );

-- ============================================
-- PART 8: HELPER VIEWS
-- ============================================

-- View for professional complete profile
CREATE OR REPLACE VIEW v_professional_profiles AS
SELECT 
    pr.id as profile_id,
    pr.email,
    pr.phone,
    pr.first_name,
    pr.last_name,
    pr.date_of_birth,
    pr.national_id,
    pr.gender,
    pr.avatar_url,
    p.id as professional_id,
    p.profession_type,
    p.specializations,
    p.ordre_number,
    p.ordre_status,
    p.is_verified,
    p.years_of_experience,
    array_agg(
        DISTINCT jsonb_build_object(
            'establishment_id', e.id,
            'establishment_name', e.name,
            'establishment_type', e.establishment_type,
            'role', pa.role,
            'department', pa.department,
            'status', pa.status
        )
    ) FILTER (WHERE e.id IS NOT NULL) as affiliations
FROM profiles pr
JOIN professionals p ON pr.id = p.profile_id
LEFT JOIN professional_affiliations pa ON p.id = pa.professional_id AND pa.status = 'active'
LEFT JOIN establishments e ON pa.establishment_id = e.id
GROUP BY pr.id, p.id;

-- View for establishment with staff count
CREATE OR REPLACE VIEW v_establishment_summary AS
SELECT 
    e.*,
    COUNT(DISTINCT pa.professional_id) FILTER (WHERE pa.status = 'active') as active_staff_count,
    COUNT(DISTINCT pa.professional_id) FILTER (WHERE pa.role = 'doctor' AND pa.status = 'active') as doctor_count,
    COUNT(DISTINCT pa.professional_id) FILTER (WHERE pa.role = 'nurse' AND pa.status = 'active') as nurse_count
FROM establishments e
LEFT JOIN professional_affiliations pa ON e.id = pa.establishment_id
GROUP BY e.id;

-- ============================================
-- PART 9: SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample provinces and cities of Gabon
INSERT INTO establishments (
    name, 
    establishment_type, 
    sector, 
    province, 
    city, 
    address,
    claim_status
) VALUES 
    ('Centre Hospitalier Universitaire de Libreville', 'hospital', 'public', 'Estuaire', 'Libreville', 'Boulevard Triomphal', 'unclaimed'),
    ('Hôpital d''Instruction des Armées Omar Bongo Ondimba', 'hospital', 'military', 'Estuaire', 'Libreville', 'Camp de Gaulle', 'unclaimed'),
    ('Centre Hospitalier Régional de Franceville', 'hospital', 'public', 'Haut-Ogooué', 'Franceville', 'Avenue des Martyrs', 'unclaimed'),
    ('Clinique El Rapha', 'clinic', 'private', 'Estuaire', 'Libreville', 'Quartier Glass', 'unclaimed'),
    ('Pharmacie du Soleil', 'pharmacy', 'private', 'Estuaire', 'Libreville', 'Centre-ville', 'unclaimed'),
    ('Laboratoire National de Santé Publique', 'laboratory', 'public', 'Estuaire', 'Libreville', 'Owendo', 'unclaimed'),
    ('Cabinet Médical Saint-Michel', 'medical_cabinet', 'private', 'Estuaire', 'Libreville', 'Mont-Bouët', 'unclaimed'),
    ('Centre d''Imagerie Médicale du Gabon', 'imaging_center', 'private', 'Estuaire', 'Libreville', 'Centre-ville', 'unclaimed');

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
