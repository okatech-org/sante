-- ============================================
-- SANTE.GA Establishment Type-Specific Tables
-- ============================================
-- This migration adds specific tables for each establishment type
-- with their unique fields and requirements
-- ============================================

-- ============================================
-- PART 1: ESTABLISHMENT TYPE ENUMS
-- ============================================

DROP TYPE IF EXISTS hospital_level CASCADE;
CREATE TYPE hospital_level AS ENUM ('CHU', 'CHR', 'CHD', 'CMS');

DROP TYPE IF EXISTS cabinet_type CASCADE;
CREATE TYPE cabinet_type AS ENUM ('solo_practice', 'group_practice', 'polyclinic');

DROP TYPE IF EXISTS staff_role_category CASCADE;
CREATE TYPE staff_role_category AS ENUM ('medical', 'paramedical', 'administrative', 'support');

DROP TYPE IF EXISTS schedule_type CASCADE;
CREATE TYPE schedule_type AS ENUM ('full_time', 'part_time', 'consultant', 'on_call', 'volunteer');

DROP TYPE IF EXISTS contract_type CASCADE;
CREATE TYPE contract_type AS ENUM ('permanent', 'temporary', 'consultant', 'intern', 'volunteer');

DROP TYPE IF EXISTS staff_status CASCADE;
CREATE TYPE staff_status AS ENUM ('active', 'on_leave', 'suspended', 'terminated');

DROP TYPE IF EXISTS consultation_type CASCADE;
CREATE TYPE consultation_type AS ENUM ('in_person', 'teleconsultation', 'home_visit');

DROP TYPE IF EXISTS consultation_status CASCADE;
CREATE TYPE consultation_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

DROP TYPE IF EXISTS consent_type CASCADE;
CREATE TYPE consent_type AS ENUM ('read_only', 'read_write', 'emergency_only');

DROP TYPE IF EXISTS consent_grant_method CASCADE;
CREATE TYPE consent_grant_method AS ENUM ('patient_portal', 'in_person', 'emergency', 'legal_mandate');

-- ============================================
-- PART 2: SPECIFIC ESTABLISHMENT TABLES
-- ============================================

-- Hospitals specific table
CREATE TABLE hospitals (
    id UUID PRIMARY KEY REFERENCES establishments(id) ON DELETE CASCADE,
    
    -- Hospital specific fields
    hospital_level hospital_level NOT NULL,
    teaching_hospital BOOLEAN DEFAULT false,
    
    -- Capacity details
    total_beds INTEGER NOT NULL,
    icu_beds INTEGER DEFAULT 0,
    emergency_beds INTEGER DEFAULT 0,
    maternity_beds INTEGER DEFAULT 0,
    pediatric_beds INTEGER DEFAULT 0,
    
    -- Departments
    number_of_departments INTEGER,
    number_of_operating_rooms INTEGER DEFAULT 0,
    
    -- Key personnel
    director_general_id UUID REFERENCES professionals(id),
    medical_director_id UUID REFERENCES professionals(id),
    nursing_director_id UUID REFERENCES professionals(id),
    
    -- Advanced equipment
    has_mri BOOLEAN DEFAULT false,
    has_ct_scanner BOOLEAN DEFAULT false,
    has_xray BOOLEAN DEFAULT true,
    has_ultrasound BOOLEAN DEFAULT true,
    has_laboratory BOOLEAN DEFAULT true,
    has_pharmacy BOOLEAN DEFAULT true,
    has_blood_bank BOOLEAN DEFAULT false,
    has_morgue BOOLEAN DEFAULT false,
    
    -- Certifications
    accreditations JSONB DEFAULT '[]',
    quality_certifications JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical cabinets specific table
CREATE TABLE medical_cabinets (
    id UUID PRIMARY KEY REFERENCES establishments(id) ON DELETE CASCADE,
    
    cabinet_type cabinet_type NOT NULL,
    
    -- Owner information
    primary_owner_id UUID REFERENCES professionals(id),
    co_owners JSONB DEFAULT '[]', -- [{professional_id, ownership_percentage}]
    
    -- Practice details
    consultation_rooms INTEGER DEFAULT 1,
    specialties_offered TEXT[] DEFAULT '{}',
    
    -- Booking
    online_booking_available BOOLEAN DEFAULT false,
    average_consultation_duration INTEGER DEFAULT 30, -- minutes
    max_daily_appointments INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacies specific table
CREATE TABLE pharmacies (
    id UUID PRIMARY KEY REFERENCES establishments(id) ON DELETE CASCADE,
    
    -- License information
    onpg_license_number TEXT UNIQUE NOT NULL,
    pharmacist_owner_id UUID REFERENCES professionals(id),
    
    -- Operations
    is_24_7 BOOLEAN DEFAULT false,
    night_duty_schedule JSONB DEFAULT '{}',
    home_delivery_available BOOLEAN DEFAULT false,
    delivery_zones TEXT[] DEFAULT '{}',
    
    -- Stock management
    online_stock_checking BOOLEAN DEFAULT false,
    e_prescription_enabled BOOLEAN DEFAULT true,
    
    -- Partnerships
    partner_wholesalers TEXT[] DEFAULT '{}',
    insurance_direct_billing BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Laboratories specific table
CREATE TABLE laboratories (
    id UUID PRIMARY KEY REFERENCES establishments(id) ON DELETE CASCADE,
    
    -- Certification
    cofrac_accredited BOOLEAN DEFAULT false,
    cofrac_number TEXT,
    iso_certifications TEXT[] DEFAULT '{}',
    
    -- Capabilities
    analysis_types TEXT[] DEFAULT '{}', -- ['biochemistry', 'hematology', 'microbiology']
    home_sampling_available BOOLEAN DEFAULT false,
    
    -- Key personnel
    biological_director_id UUID REFERENCES professionals(id),
    quality_manager_id UUID REFERENCES professionals(id),
    
    -- Equipment
    major_equipment JSONB DEFAULT '[]',
    
    -- Turnaround times
    standard_turnaround_hours INTEGER DEFAULT 24,
    urgent_turnaround_hours INTEGER DEFAULT 4,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Imaging centers specific table
CREATE TABLE imaging_centers (
    id UUID PRIMARY KEY REFERENCES establishments(id) ON DELETE CASCADE,
    
    -- Equipment available
    has_mri BOOLEAN DEFAULT false,
    mri_tesla_strength DECIMAL(3,1),
    has_ct_scanner BOOLEAN DEFAULT false,
    has_mammography BOOLEAN DEFAULT false,
    has_bone_densitometry BOOLEAN DEFAULT false,
    has_fluoroscopy BOOLEAN DEFAULT false,
    
    -- PACS system
    pacs_enabled BOOLEAN DEFAULT false,
    teleradiology_enabled BOOLEAN DEFAULT false,
    
    -- Key personnel
    chief_radiologist_id UUID REFERENCES professionals(id),
    
    -- Reporting
    average_report_time_hours INTEGER DEFAULT 24,
    urgent_report_time_hours INTEGER DEFAULT 2,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PART 3: ENHANCED STAFF ASSOCIATION TABLE
-- ============================================

-- Drop old table if exists
DROP TABLE IF EXISTS establishment_staff CASCADE;

-- Enhanced establishment staff table
CREATE TABLE establishment_staff (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Core relationship
    establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    
    -- Role in this establishment
    role_title TEXT NOT NULL, -- "Chef de Service", "Médecin Généraliste", etc.
    role_category staff_role_category NOT NULL,
    department TEXT, -- "Urgences", "Cardiologie", "Administration"
    service TEXT, -- More specific than department
    
    -- Hierarchical position
    is_department_head BOOLEAN DEFAULT false,
    is_service_head BOOLEAN DEFAULT false,
    reports_to_staff_id UUID REFERENCES establishment_staff(id),
    
    -- Administrative rights
    is_establishment_admin BOOLEAN DEFAULT false,
    can_manage_staff BOOLEAN DEFAULT false,
    can_manage_schedules BOOLEAN DEFAULT false,
    can_view_finances BOOLEAN DEFAULT false,
    can_approve_orders BOOLEAN DEFAULT false,
    
    -- Medical permissions (granular)
    permissions TEXT[] DEFAULT '{}', 
    -- Examples: ['create_consultation', 'write_prescription', 'order_labs', 
    --            'perform_surgery', 'access_emergency', 'admit_patient']
    
    -- Schedule in this establishment
    schedule_type schedule_type,
    weekly_hours INTEGER,
    schedule_details JSONB DEFAULT '{}', -- Detailed weekly schedule
    
    -- Availability for appointments
    accepts_appointments BOOLEAN DEFAULT true,
    appointment_types TEXT[] DEFAULT '{}', -- ['consultation', 'teleconsultation', 'procedure']
    consultation_duration_minutes INTEGER DEFAULT 30,
    max_daily_appointments INTEGER,
    
    -- Financial
    consultation_fee_standard DECIMAL(10,2),
    consultation_fee_cnamgs DECIMAL(10,2),
    consultation_fee_cnss DECIMAL(10,2),
    revenue_share_percentage DECIMAL(5,2), -- For private establishments
    
    -- Contract
    contract_type contract_type,
    contract_start_date DATE NOT NULL,
    contract_end_date DATE,
    contract_document_url TEXT,
    
    -- Status
    status staff_status DEFAULT 'active',
    suspension_reason TEXT,
    termination_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    
    -- Ensure unique assignment per establishment
    CONSTRAINT unique_staff_assignment UNIQUE(establishment_id, professional_id),
    
    -- Ensure valid percentage
    CONSTRAINT check_revenue_share CHECK (
        revenue_share_percentage IS NULL OR 
        (revenue_share_percentage >= 0 AND revenue_share_percentage <= 100)
    )
);

-- ============================================
-- PART 4: PATIENT CONSENT MANAGEMENT
-- ============================================

-- Patient consent management for DMP access
CREATE TABLE patient_consents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Core relationship
    patient_id UUID NOT NULL REFERENCES patients(id),
    
    -- Consent target (can be professional OR establishment)
    professional_id UUID REFERENCES professionals(id),
    establishment_id UUID REFERENCES establishments(id),
    
    -- Consent details
    consent_type consent_type NOT NULL,
    
    -- Scope of access
    access_scope JSONB DEFAULT '{}',
    /* Structure:
    {
        consultations: true,
        prescriptions: true,
        lab_results: true,
        imaging: true,
        allergies: true,
        medications: true
    }
    */
    
    -- Validity
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    revocation_reason TEXT,
    
    -- Audit
    granted_via consent_grant_method,
    granting_document_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure only one type of consent target
    CONSTRAINT single_consent_target CHECK (
        (professional_id IS NOT NULL AND establishment_id IS NULL) OR
        (professional_id IS NULL AND establishment_id IS NOT NULL)
    ),
    
    -- Ensure unique active consent per target
    CONSTRAINT unique_active_consent UNIQUE(patient_id, professional_id, establishment_id) 
        WHERE is_active = true
);

-- Access logs for DMP audit trail
CREATE TABLE dmp_access_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Who accessed what
    accessor_id UUID NOT NULL REFERENCES profiles(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    establishment_context_id UUID REFERENCES establishments(id),
    
    -- What was accessed
    resource_type TEXT NOT NULL, -- 'consultation', 'prescription', 'lab_result', etc.
    resource_id UUID,
    action TEXT NOT NULL, -- 'view', 'create', 'update', 'delete'
    
    -- Justification
    access_reason TEXT,
    emergency_access BOOLEAN DEFAULT false,
    
    -- Technical details
    ip_address INET,
    user_agent TEXT,
    
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PART 5: INDEXES
-- ============================================

-- Indexes for establishment type tables
CREATE INDEX idx_hospitals_level ON hospitals(hospital_level);
CREATE INDEX idx_hospitals_teaching ON hospitals(teaching_hospital) WHERE teaching_hospital = true;

CREATE INDEX idx_medical_cabinets_type ON medical_cabinets(cabinet_type);
CREATE INDEX idx_medical_cabinets_owner ON medical_cabinets(primary_owner_id);

CREATE INDEX idx_pharmacies_owner ON pharmacies(pharmacist_owner_id);
CREATE INDEX idx_pharmacies_24_7 ON pharmacies(is_24_7) WHERE is_24_7 = true;

CREATE INDEX idx_laboratories_director ON laboratories(biological_director_id);
CREATE INDEX idx_laboratories_cofrac ON laboratories(cofrac_accredited) WHERE cofrac_accredited = true;

CREATE INDEX idx_imaging_centers_chief ON imaging_centers(chief_radiologist_id);
CREATE INDEX idx_imaging_centers_mri ON imaging_centers(has_mri) WHERE has_mri = true;

-- Indexes for staff associations
CREATE INDEX idx_staff_establishment ON establishment_staff(establishment_id);
CREATE INDEX idx_staff_professional ON establishment_staff(professional_id);
CREATE INDEX idx_staff_status ON establishment_staff(status);
CREATE INDEX idx_staff_department ON establishment_staff(department);
CREATE INDEX idx_staff_admin ON establishment_staff(is_establishment_admin) WHERE is_establishment_admin = true;
CREATE INDEX idx_staff_reports_to ON establishment_staff(reports_to_staff_id);

-- Indexes for consent management
CREATE INDEX idx_consents_patient ON patient_consents(patient_id);
CREATE INDEX idx_consents_professional ON patient_consents(professional_id);
CREATE INDEX idx_consents_establishment ON patient_consents(establishment_id);
CREATE INDEX idx_consents_active ON patient_consents(is_active) WHERE is_active = true;

CREATE INDEX idx_dmp_logs_accessor ON dmp_access_logs(accessor_id);
CREATE INDEX idx_dmp_logs_patient ON dmp_access_logs(patient_id);
CREATE INDEX idx_dmp_logs_timestamp ON dmp_access_logs(accessed_at);

-- ============================================
-- PART 6: ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on new tables
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_cabinets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmp_access_logs ENABLE ROW LEVEL SECURITY;

-- Policies for establishment type tables
CREATE POLICY "Public can view hospital details"
    ON hospitals FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM establishments e
            WHERE e.id = hospitals.id
            AND e.is_active = true
        )
    );

CREATE POLICY "Admins can update their hospital"
    ON hospitals FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM establishment_staff es
            JOIN professionals p ON es.professional_id = p.id
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
            AND es.establishment_id = hospitals.id
            AND es.is_establishment_admin = true
            AND es.status = 'active'
        )
    );

-- Similar policies for other establishment types
CREATE POLICY "Public can view medical cabinet details"
    ON medical_cabinets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM establishments e
            WHERE e.id = medical_cabinets.id
            AND e.is_active = true
        )
    );

CREATE POLICY "Owners can update their medical cabinet"
    ON medical_cabinets FOR UPDATE
    USING (
        primary_owner_id IN (
            SELECT p.id FROM professionals p
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
        )
    );

-- Staff policies
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

CREATE POLICY "Admins can manage establishment staff"
    ON establishment_staff FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM establishment_staff es
            JOIN professionals p ON es.professional_id = p.id
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
            AND es.establishment_id = establishment_staff.establishment_id
            AND es.is_establishment_admin = true
            AND es.status = 'active'
        )
    );

-- Consent policies
CREATE POLICY "Patients can manage their own consents"
    ON patient_consents FOR ALL
    USING (
        patient_id IN (
            SELECT pat.id FROM patients pat
            JOIN profiles pr ON pat.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
        )
    );

CREATE POLICY "Professionals can view consents given to them"
    ON patient_consents FOR SELECT
    USING (
        professional_id IN (
            SELECT p.id FROM professionals p
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
        )
        OR
        establishment_id IN (
            SELECT es.establishment_id FROM establishment_staff es
            JOIN professionals p ON es.professional_id = p.id
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
            AND es.status = 'active'
        )
    );

-- Access logs are insert-only and viewable by patient
CREATE POLICY "Anyone can insert access logs"
    ON dmp_access_logs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Patients can view their access logs"
    ON dmp_access_logs FOR SELECT
    USING (
        patient_id IN (
            SELECT pat.id FROM patients pat
            JOIN profiles pr ON pat.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
        )
    );

-- ============================================
-- PART 7: TRIGGERS
-- ============================================

-- Update triggers for new tables
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

CREATE TRIGGER update_establishment_staff_updated_at BEFORE UPDATE ON establishment_staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_consents_updated_at BEFORE UPDATE ON patient_consents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
