-- ============================================
-- SANTE.GA Complete Multi-Tenant Architecture
-- Combined migration for production deployment
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CLEAN UP EXISTING TABLES (if needed)
-- ============================================

-- Drop existing tables in correct order to avoid dependency issues
DROP TABLE IF EXISTS dmp_access_logs CASCADE;
DROP TABLE IF EXISTS patient_consents CASCADE;
DROP TABLE IF EXISTS imaging_results CASCADE;
DROP TABLE IF EXISTS lab_results CASCADE;
DROP TABLE IF EXISTS prescription_items CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS hospitalizations CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS data_sharing_consents CASCADE;
DROP TABLE IF EXISTS medical_data_access_logs CASCADE;
DROP TABLE IF EXISTS establishment_invitations CASCADE;
DROP TABLE IF EXISTS establishment_roles CASCADE;
DROP TABLE IF EXISTS establishment_staff CASCADE;
DROP TABLE IF EXISTS professional_affiliations CASCADE;
DROP TABLE IF EXISTS imaging_centers CASCADE;
DROP TABLE IF EXISTS laboratories CASCADE;
DROP TABLE IF EXISTS pharmacies CASCADE;
DROP TABLE IF EXISTS medical_cabinets CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS establishments CASCADE;
DROP TABLE IF EXISTS professionals CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS gender_type CASCADE;
DROP TYPE IF EXISTS profile_type CASCADE;
DROP TYPE IF EXISTS insurance_status CASCADE;
DROP TYPE IF EXISTS blood_group_type CASCADE;
DROP TYPE IF EXISTS profession_type CASCADE;
DROP TYPE IF EXISTS ordre_type CASCADE;
DROP TYPE IF EXISTS ordre_status CASCADE;
DROP TYPE IF EXISTS establishment_type CASCADE;
DROP TYPE IF EXISTS sector_type CASCADE;
DROP TYPE IF EXISTS claim_status CASCADE;
DROP TYPE IF EXISTS hospital_level CASCADE;
DROP TYPE IF EXISTS cabinet_type CASCADE;
DROP TYPE IF EXISTS affiliation_role CASCADE;
DROP TYPE IF EXISTS affiliation_status CASCADE;
DROP TYPE IF EXISTS staff_role_category CASCADE;
DROP TYPE IF EXISTS schedule_type CASCADE;
DROP TYPE IF EXISTS contract_type CASCADE;
DROP TYPE IF EXISTS staff_status CASCADE;
DROP TYPE IF EXISTS consultation_type CASCADE;
DROP TYPE IF EXISTS consultation_status CASCADE;
DROP TYPE IF EXISTS consent_type CASCADE;
DROP TYPE IF EXISTS consent_grant_method CASCADE;

-- ============================================
-- CREATE ENUM TYPES
-- ============================================

CREATE TYPE gender_type AS ENUM ('M', 'F', 'O');
CREATE TYPE profile_type AS ENUM ('patient', 'professional');
CREATE TYPE insurance_status AS ENUM ('active', 'suspended', 'expired', 'pending');
CREATE TYPE blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE profession_type AS ENUM ('doctor', 'nurse', 'pharmacist', 'technician', 'midwife', 'physiotherapist', 'psychologist', 'admin');
CREATE TYPE ordre_type AS ENUM ('CNOM', 'ONPG', 'ONI', 'OTHER');
CREATE TYPE ordre_status AS ENUM ('active', 'suspended', 'expired');
CREATE TYPE establishment_type AS ENUM ('hospital', 'clinic', 'medical_cabinet', 'pharmacy', 'laboratory', 'imaging_center');
CREATE TYPE sector_type AS ENUM ('public', 'private', 'confessional', 'military');
CREATE TYPE claim_status AS ENUM ('unclaimed', 'claim_pending', 'verified', 'rejected', 'suspended');
CREATE TYPE hospital_level AS ENUM ('CHU', 'CHR', 'CHD', 'CMS');
CREATE TYPE cabinet_type AS ENUM ('solo_practice', 'group_practice', 'polyclinic');
CREATE TYPE affiliation_role AS ENUM ('owner', 'director', 'administrator', 'department_head', 'practitioner', 'consultant', 'intern', 'staff');
CREATE TYPE affiliation_status AS ENUM ('pending', 'active', 'suspended', 'terminated');
CREATE TYPE staff_role_category AS ENUM ('medical', 'paramedical', 'administrative', 'support');
CREATE TYPE schedule_type AS ENUM ('full_time', 'part_time', 'consultant', 'on_call', 'volunteer');
CREATE TYPE contract_type AS ENUM ('permanent', 'temporary', 'consultant', 'intern', 'volunteer');
CREATE TYPE staff_status AS ENUM ('active', 'on_leave', 'suspended', 'terminated');
CREATE TYPE consultation_type AS ENUM ('in_person', 'teleconsultation', 'home_visit');
CREATE TYPE consultation_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE consent_type AS ENUM ('read_only', 'read_write', 'emergency_only');
CREATE TYPE consent_grant_method AS ENUM ('patient_portal', 'in_person', 'emergency', 'legal_mandate');

-- ============================================
-- CORE USER TABLES
-- ============================================

-- Core profiles table
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
    metadata JSONB DEFAULT '{}'
);

-- Patients extension
CREATE TABLE patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    cnamgs_number TEXT UNIQUE,
    cnamgs_status insurance_status,
    cnamgs_coverage_rate DECIMAL(3,2),
    cnamgs_special_status TEXT,
    cnss_number TEXT UNIQUE,
    cnss_status insurance_status,
    blood_group blood_group_type,
    allergies JSONB DEFAULT '[]',
    chronic_conditions JSONB DEFAULT '[]',
    current_medications JSONB DEFAULT '[]',
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professionals extension
CREATE TABLE professionals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    profession_type profession_type NOT NULL,
    specializations TEXT[] DEFAULT '{}',
    sub_specializations TEXT[] DEFAULT '{}',
    ordre_number TEXT UNIQUE,
    ordre_type ordre_type,
    ordre_registration_date DATE,
    ordre_expiry_date DATE,
    ordre_status ordre_status,
    degrees JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    continuing_education JSONB DEFAULT '[]',
    years_of_experience INTEGER,
    languages_spoken TEXT[] DEFAULT ARRAY['French'],
    consultation_languages TEXT[] DEFAULT ARRAY['French'],
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES profiles(id),
    verification_documents JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ESTABLISHMENT TABLES
-- ============================================

-- Main establishments table
CREATE TABLE establishments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    establishment_type establishment_type NOT NULL,
    establishment_subtype TEXT,
    sector sector_type NOT NULL,
    rccm_number TEXT UNIQUE,
    authorization_number TEXT,
    authorization_date DATE,
    tax_id TEXT,
    cnamgs_convention BOOLEAN DEFAULT false,
    cnamgs_convention_number TEXT,
    cnamgs_tariff_agreement JSONB DEFAULT '{}',
    cnss_approved BOOLEAN DEFAULT false,
    province TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    address TEXT NOT NULL,
    postal_code TEXT,
    gps_latitude DECIMAL(10,8),
    gps_longitude DECIMAL(11,8),
    phone_primary TEXT,
    phone_secondary TEXT,
    email TEXT,
    website TEXT,
    claim_status claim_status DEFAULT 'unclaimed',
    claimed_by UUID REFERENCES profiles(id),
    claimed_at TIMESTAMP WITH TIME ZONE,
    claim_verified_at TIMESTAMP WITH TIME ZONE,
    claim_rejection_reason TEXT,
    operating_hours JSONB DEFAULT '{}',
    emergency_available BOOLEAN DEFAULT false,
    home_service_available BOOLEAN DEFAULT false,
    teleconsultation_available BOOLEAN DEFAULT false,
    total_beds INTEGER,
    available_beds INTEGER,
    services_offered TEXT[] DEFAULT '{}',
    specialties_available TEXT[] DEFAULT '{}',
    equipment_available TEXT[] DEFAULT '{}',
    has_dedicated_portal BOOLEAN DEFAULT false,
    portal_subdomain TEXT UNIQUE,
    portal_theme JSONB DEFAULT '{}',
    portal_features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    activation_date DATE,
    deactivation_date DATE,
    deactivation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_gps_latitude CHECK (gps_latitude BETWEEN -90 AND 90),
    CONSTRAINT check_gps_longitude CHECK (gps_longitude BETWEEN -180 AND 180)
);

-- Specific establishment type tables
CREATE TABLE hospitals (
    id UUID PRIMARY KEY REFERENCES establishments(id) ON DELETE CASCADE,
    hospital_level hospital_level NOT NULL,
    teaching_hospital BOOLEAN DEFAULT false,
    total_beds INTEGER NOT NULL,
    icu_beds INTEGER DEFAULT 0,
    emergency_beds INTEGER DEFAULT 0,
    maternity_beds INTEGER DEFAULT 0,
    pediatric_beds INTEGER DEFAULT 0,
    number_of_departments INTEGER,
    number_of_operating_rooms INTEGER DEFAULT 0,
    director_general_id UUID REFERENCES professionals(id),
    medical_director_id UUID REFERENCES professionals(id),
    nursing_director_id UUID REFERENCES professionals(id),
    has_mri BOOLEAN DEFAULT false,
    has_ct_scanner BOOLEAN DEFAULT false,
    has_xray BOOLEAN DEFAULT true,
    has_ultrasound BOOLEAN DEFAULT true,
    has_laboratory BOOLEAN DEFAULT true,
    has_pharmacy BOOLEAN DEFAULT true,
    has_blood_bank BOOLEAN DEFAULT false,
    has_morgue BOOLEAN DEFAULT false,
    accreditations JSONB DEFAULT '[]',
    quality_certifications JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE medical_cabinets (
    id UUID PRIMARY KEY REFERENCES establishments(id) ON DELETE CASCADE,
    cabinet_type cabinet_type NOT NULL,
    primary_owner_id UUID REFERENCES professionals(id),
    co_owners JSONB DEFAULT '[]',
    consultation_rooms INTEGER DEFAULT 1,
    specialties_offered TEXT[] DEFAULT '{}',
    online_booking_available BOOLEAN DEFAULT false,
    average_consultation_duration INTEGER DEFAULT 30,
    max_daily_appointments INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE pharmacies (
    id UUID PRIMARY KEY REFERENCES establishments(id) ON DELETE CASCADE,
    onpg_license_number TEXT UNIQUE NOT NULL,
    pharmacist_owner_id UUID REFERENCES professionals(id),
    is_24_7 BOOLEAN DEFAULT false,
    night_duty_schedule JSONB DEFAULT '{}',
    home_delivery_available BOOLEAN DEFAULT false,
    delivery_zones TEXT[] DEFAULT '{}',
    online_stock_checking BOOLEAN DEFAULT false,
    e_prescription_enabled BOOLEAN DEFAULT true,
    partner_wholesalers TEXT[] DEFAULT '{}',
    insurance_direct_billing BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE laboratories (
    id UUID PRIMARY KEY REFERENCES establishments(id) ON DELETE CASCADE,
    cofrac_accredited BOOLEAN DEFAULT false,
    cofrac_number TEXT,
    iso_certifications TEXT[] DEFAULT '{}',
    analysis_types TEXT[] DEFAULT '{}',
    home_sampling_available BOOLEAN DEFAULT false,
    biological_director_id UUID REFERENCES professionals(id),
    quality_manager_id UUID REFERENCES professionals(id),
    major_equipment JSONB DEFAULT '[]',
    standard_turnaround_hours INTEGER DEFAULT 24,
    urgent_turnaround_hours INTEGER DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE imaging_centers (
    id UUID PRIMARY KEY REFERENCES establishments(id) ON DELETE CASCADE,
    has_mri BOOLEAN DEFAULT false,
    mri_tesla_strength DECIMAL(3,1),
    has_ct_scanner BOOLEAN DEFAULT false,
    has_mammography BOOLEAN DEFAULT false,
    has_bone_densitometry BOOLEAN DEFAULT false,
    has_fluoroscopy BOOLEAN DEFAULT false,
    pacs_enabled BOOLEAN DEFAULT false,
    teleradiology_enabled BOOLEAN DEFAULT false,
    chief_radiologist_id UUID REFERENCES professionals(id),
    average_report_time_hours INTEGER DEFAULT 24,
    urgent_report_time_hours INTEGER DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STAFF ASSOCIATION TABLES
-- ============================================

-- Professional affiliations (legacy support)
CREATE TABLE professional_affiliations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
    role affiliation_role NOT NULL,
    department TEXT,
    service TEXT,
    status affiliation_status DEFAULT 'pending',
    start_date DATE NOT NULL,
    end_date DATE,
    working_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    working_hours JSONB DEFAULT '{}',
    can_prescribe BOOLEAN DEFAULT true,
    can_admit_patients BOOLEAN DEFAULT false,
    can_access_all_patients BOOLEAN DEFAULT false,
    can_manage_staff BOOLEAN DEFAULT false,
    can_manage_inventory BOOLEAN DEFAULT false,
    can_view_financials BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES profiles(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced establishment staff table
CREATE TABLE establishment_staff (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    role_title TEXT NOT NULL,
    role_category staff_role_category NOT NULL,
    department TEXT,
    service TEXT,
    is_department_head BOOLEAN DEFAULT false,
    is_service_head BOOLEAN DEFAULT false,
    reports_to_staff_id UUID REFERENCES establishment_staff(id),
    is_establishment_admin BOOLEAN DEFAULT false,
    can_manage_staff BOOLEAN DEFAULT false,
    can_manage_schedules BOOLEAN DEFAULT false,
    can_view_finances BOOLEAN DEFAULT false,
    can_approve_orders BOOLEAN DEFAULT false,
    permissions TEXT[] DEFAULT '{}',
    schedule_type schedule_type,
    weekly_hours INTEGER,
    schedule_details JSONB DEFAULT '{}',
    accepts_appointments BOOLEAN DEFAULT true,
    appointment_types TEXT[] DEFAULT '{}',
    consultation_duration_minutes INTEGER DEFAULT 30,
    max_daily_appointments INTEGER,
    consultation_fee_standard DECIMAL(10,2),
    consultation_fee_cnamgs DECIMAL(10,2),
    consultation_fee_cnss DECIMAL(10,2),
    revenue_share_percentage DECIMAL(5,2),
    contract_type contract_type,
    contract_start_date DATE NOT NULL,
    contract_end_date DATE,
    contract_document_url TEXT,
    status staff_status DEFAULT 'active',
    suspension_reason TEXT,
    termination_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    CONSTRAINT unique_staff_assignment UNIQUE(establishment_id, professional_id),
    CONSTRAINT check_revenue_share CHECK (
        revenue_share_percentage IS NULL OR 
        (revenue_share_percentage >= 0 AND revenue_share_percentage <= 100)
    )
);

-- ============================================
-- MEDICAL DATA TABLES
-- ============================================

-- Medical records (DMP)
CREATE TABLE medical_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    record_number TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_consultation_date DATE,
    last_consultation_establishment UUID REFERENCES establishments(id),
    total_consultations INTEGER DEFAULT 0,
    total_hospitalizations INTEGER DEFAULT 0,
    is_locked BOOLEAN DEFAULT false,
    locked_reason TEXT,
    locked_by UUID REFERENCES profiles(id),
    locked_at TIMESTAMP WITH TIME ZONE,
    default_sharing_consent BOOLEAN DEFAULT false,
    emergency_access_allowed BOOLEAN DEFAULT true
);

-- Consultations (isolated by establishment)
CREATE TABLE consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id),
    establishment_id UUID REFERENCES establishments(id),
    medical_record_id UUID REFERENCES medical_records(id),
    appointment_id UUID,
    consultation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    consultation_type TEXT,
    consultation_reason TEXT NOT NULL,
    chief_complaint TEXT,
    history_of_present_illness TEXT,
    past_medical_history TEXT,
    family_history TEXT,
    social_history TEXT,
    review_of_systems JSONB DEFAULT '{}',
    vital_signs JSONB DEFAULT '{}',
    physical_exam_findings TEXT,
    diagnoses JSONB DEFAULT '[]',
    assessment TEXT,
    treatment_plan TEXT,
    follow_up_instructions TEXT,
    prescriptions JSONB DEFAULT '[]',
    lab_orders JSONB DEFAULT '[]',
    imaging_orders JSONB DEFAULT '[]',
    referrals JSONB DEFAULT '[]',
    consultation_duration INTEGER,
    consultation_fee DECIMAL(10,2),
    insurance_coverage JSONB DEFAULT '{}',
    payment_status TEXT DEFAULT 'pending',
    status TEXT DEFAULT 'in_progress',
    is_confidential BOOLEAN DEFAULT false,
    notes TEXT,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id),
    establishment_id UUID REFERENCES establishments(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_end_time TIME,
    appointment_type TEXT,
    reason_for_visit TEXT,
    urgency_level TEXT,
    status TEXT DEFAULT 'scheduled',
    confirmation_sent BOOLEAN DEFAULT false,
    confirmation_sent_at TIMESTAMP WITH TIME ZONE,
    confirmed_by_patient BOOLEAN DEFAULT false,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_by TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    rescheduled_from UUID REFERENCES appointments(id),
    rescheduled_to UUID REFERENCES appointments(id),
    checked_in_at TIMESTAMP WITH TIME ZONE,
    checked_in_by UUID REFERENCES profiles(id),
    patient_notes TEXT,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- ============================================
-- CONSENT MANAGEMENT
-- ============================================

-- Patient consents
CREATE TABLE patient_consents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id),
    professional_id UUID REFERENCES professionals(id),
    establishment_id UUID REFERENCES establishments(id),
    consent_type consent_type NOT NULL,
    access_scope JSONB DEFAULT '{}',
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    revocation_reason TEXT,
    granted_via consent_grant_method,
    granting_document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_consent_target CHECK (
        (professional_id IS NOT NULL AND establishment_id IS NULL) OR
        (professional_id IS NULL AND establishment_id IS NOT NULL)
    )
);

-- DMP access logs
CREATE TABLE dmp_access_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    accessor_id UUID NOT NULL REFERENCES profiles(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    establishment_context_id UUID REFERENCES establishments(id),
    resource_type TEXT NOT NULL,
    resource_id UUID,
    action TEXT NOT NULL,
    access_reason TEXT,
    emergency_access BOOLEAN DEFAULT false,
    ip_address INET,
    user_agent TEXT,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_establishments_updated_at BEFORE UPDATE ON establishments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_cabinets_updated_at BEFORE UPDATE ON medical_cabinets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pharmacies_updated_at BEFORE UPDATE ON pharmacies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_laboratories_updated_at BEFORE UPDATE ON laboratories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_imaging_centers_updated_at BEFORE UPDATE ON imaging_centers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affiliations_updated_at BEFORE UPDATE ON professional_affiliations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON establishment_staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consents_updated_at BEFORE UPDATE ON patient_consents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Profile indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_profile_type ON profiles(profile_type);

-- Patient indexes
CREATE INDEX idx_patients_profile_id ON patients(profile_id);
CREATE INDEX idx_patients_cnamgs ON patients(cnamgs_number);

-- Professional indexes
CREATE INDEX idx_professionals_profile_id ON professionals(profile_id);
CREATE INDEX idx_professionals_ordre ON professionals(ordre_number);
CREATE INDEX idx_professionals_type ON professionals(profession_type);

-- Establishment indexes
CREATE INDEX idx_establishments_type ON establishments(establishment_type);
CREATE INDEX idx_establishments_city ON establishments(city);
CREATE INDEX idx_establishments_claim_status ON establishments(claim_status);
CREATE INDEX idx_establishments_active ON establishments(is_active);

-- Staff indexes
CREATE INDEX idx_staff_establishment ON establishment_staff(establishment_id);
CREATE INDEX idx_staff_professional ON establishment_staff(professional_id);
CREATE INDEX idx_staff_status ON establishment_staff(status);

-- Medical data indexes
CREATE INDEX idx_consultations_patient ON consultations(patient_id);
CREATE INDEX idx_consultations_establishment ON consultations(establishment_id);
CREATE INDEX idx_consultations_date ON consultations(consultation_date);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_establishment ON appointments(establishment_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- Consent indexes
CREATE INDEX idx_consents_patient ON patient_consents(patient_id);
CREATE INDEX idx_consents_active ON patient_consents(is_active) WHERE is_active = true;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_cabinets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmp_access_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Public can view active establishments"
    ON establishments FOR SELECT
    USING (is_active = true);

CREATE POLICY "Staff can view their establishment colleagues"
    ON establishment_staff FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM establishment_staff es
            JOIN professionals p ON es.professional_id = p.id
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
            AND es.establishment_id = establishment_staff.establishment_id
            AND es.status = 'active'
        )
    );

-- ============================================
-- SAMPLE DATA - GABON ESTABLISHMENTS
-- ============================================

-- Insert sample establishments for testing
INSERT INTO establishments (
    name, 
    establishment_type, 
    sector, 
    province, 
    city, 
    address,
    phone_primary,
    cnamgs_convention,
    emergency_available,
    is_active
) VALUES 
    ('Centre Hospitalier Universitaire de Libreville', 'hospital', 'public', 'Estuaire', 'Libreville', 'Boulevard Triomphal', '+241 01 76 20 00', true, true, true),
    ('Hôpital d''Instruction des Armées Omar Bongo Ondimba', 'hospital', 'military', 'Estuaire', 'Libreville', 'Camp de Gaulle', '+241 01 79 50 00', true, true, true),
    ('Centre Hospitalier Régional de Franceville', 'hospital', 'public', 'Haut-Ogooué', 'Franceville', 'Avenue des Martyrs', '+241 01 67 70 00', true, true, true),
    ('Centre Hospitalier Régional de Mouila', 'hospital', 'public', 'Ngounié', 'Mouila', 'Route de l''Hôpital', '+241 01 86 10 00', true, true, true),
    ('Centre Hospitalier Régional de Lambaréné', 'hospital', 'public', 'Moyen-Ogooué', 'Lambaréné', 'Quartier Isaac', '+241 01 58 20 00', true, true, true),
    ('Clinique El Rapha', 'clinic', 'private', 'Estuaire', 'Libreville', 'Quartier Glass', '+241 01 44 25 25', true, false, true),
    ('Polyclinique Chambrier', 'clinic', 'private', 'Estuaire', 'Libreville', 'Centre-ville', '+241 01 76 47 47', true, false, true),
    ('Clinique du Littoral', 'clinic', 'private', 'Estuaire', 'Libreville', 'Bord de mer', '+241 01 44 50 50', true, false, true),
    ('Cabinet Médical Saint-Michel', 'medical_cabinet', 'private', 'Estuaire', 'Libreville', 'Mont-Bouët', '+241 07 45 67 89', false, false, true),
    ('Cabinet Dentaire Excellence', 'medical_cabinet', 'private', 'Estuaire', 'Libreville', 'Louis', '+241 07 78 90 12', false, false, true),
    ('Pharmacie du Soleil', 'pharmacy', 'private', 'Estuaire', 'Libreville', 'Centre-ville', '+241 01 76 30 30', true, false, true),
    ('Pharmacie Nkembo', 'pharmacy', 'private', 'Estuaire', 'Libreville', 'Nkembo', '+241 01 44 60 60', true, false, true),
    ('Pharmacie de la Peyrie', 'pharmacy', 'private', 'Estuaire', 'Libreville', 'La Peyrie', '+241 01 76 70 70', true, true, true),
    ('Laboratoire National de Santé Publique', 'laboratory', 'public', 'Estuaire', 'Libreville', 'Owendo', '+241 01 70 45 45', true, false, true),
    ('Laboratoire Marcel Eloi', 'laboratory', 'private', 'Estuaire', 'Libreville', 'Centre-ville', '+241 01 76 80 80', true, false, true),
    ('Centre d''Imagerie Médicale du Gabon', 'imaging_center', 'private', 'Estuaire', 'Libreville', 'Centre-ville', '+241 01 44 90 90', true, false, true),
    ('Centre de Radiologie Moderne', 'imaging_center', 'private', 'Estuaire', 'Libreville', 'Glass', '+241 01 76 95 95', true, false, true);

-- Add hospital-specific data for CHU Libreville
INSERT INTO hospitals (
    id,
    hospital_level,
    teaching_hospital,
    total_beds,
    icu_beds,
    emergency_beds,
    maternity_beds,
    pediatric_beds,
    number_of_departments,
    number_of_operating_rooms,
    has_mri,
    has_ct_scanner,
    has_xray,
    has_ultrasound,
    has_laboratory,
    has_pharmacy,
    has_blood_bank,
    has_morgue
)
SELECT 
    id,
    'CHU'::hospital_level,
    true,
    500,
    20,
    30,
    40,
    60,
    15,
    8,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true
FROM establishments 
WHERE name = 'Centre Hospitalier Universitaire de Libreville';

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
