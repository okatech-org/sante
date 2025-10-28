-- ============================================
-- SANTE.GA Medical Data Tables with Multi-Tenant Isolation
-- ============================================
-- Features:
-- 1. Dossier Médical Partagé (DMP) for patients
-- 2. Data isolation by establishment
-- 3. Consent management for data sharing
-- 4. Appointment and consultation management
-- ============================================

-- ============================================
-- PART 1: MEDICAL RECORDS (DMP)
-- ============================================

-- Patient medical records (Dossier Médical Partagé)
CREATE TABLE medical_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Record metadata
    record_number TEXT UNIQUE DEFAULT ('DMP-' || to_char(NOW(), 'YYYY') || '-' || LPAD(nextval('medical_record_seq')::TEXT, 6, '0')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Summary information
    last_consultation_date DATE,
    last_consultation_establishment UUID REFERENCES establishments(id),
    total_consultations INTEGER DEFAULT 0,
    total_hospitalizations INTEGER DEFAULT 0,
    
    -- Access control
    is_locked BOOLEAN DEFAULT false,
    locked_reason TEXT,
    locked_by UUID REFERENCES profiles(id),
    locked_at TIMESTAMP WITH TIME ZONE,
    
    -- Sharing preferences
    default_sharing_consent BOOLEAN DEFAULT false,
    emergency_access_allowed BOOLEAN DEFAULT true
);

-- Create sequence for medical record numbers
CREATE SEQUENCE IF NOT EXISTS medical_record_seq START 1;

-- Consultations table (isolated by establishment)
CREATE TABLE consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Links
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id),
    establishment_id UUID REFERENCES establishments(id),
    medical_record_id UUID REFERENCES medical_records(id),
    appointment_id UUID, -- Will reference appointments table
    
    -- Consultation details
    consultation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    consultation_type TEXT CHECK (consultation_type IN ('general', 'specialist', 'emergency', 'follow_up', 'teleconsultation')),
    consultation_reason TEXT NOT NULL,
    
    -- Clinical data
    chief_complaint TEXT,
    history_of_present_illness TEXT,
    past_medical_history TEXT,
    family_history TEXT,
    social_history TEXT,
    review_of_systems JSONB DEFAULT '{}',
    
    -- Physical examination
    vital_signs JSONB DEFAULT '{}', -- {temperature, blood_pressure, pulse, respiratory_rate, weight, height}
    physical_exam_findings TEXT,
    
    -- Assessment and plan
    diagnoses JSONB DEFAULT '[]', -- [{code, description, type: 'primary'|'secondary'}]
    assessment TEXT,
    treatment_plan TEXT,
    follow_up_instructions TEXT,
    
    -- Prescriptions and orders
    prescriptions JSONB DEFAULT '[]',
    lab_orders JSONB DEFAULT '[]',
    imaging_orders JSONB DEFAULT '[]',
    referrals JSONB DEFAULT '[]',
    
    -- Administrative
    consultation_duration INTEGER, -- in minutes
    consultation_fee DECIMAL(10,2),
    insurance_coverage JSONB DEFAULT '{}',
    payment_status TEXT DEFAULT 'pending',
    
    -- Status
    status TEXT DEFAULT 'in_progress', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
    is_confidential BOOLEAN DEFAULT false,
    
    -- Metadata
    notes TEXT,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Links
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id),
    establishment_id UUID REFERENCES establishments(id),
    
    -- Appointment details
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_end_time TIME,
    appointment_type TEXT CHECK (appointment_type IN ('consultation', 'follow_up', 'procedure', 'vaccination', 'screening', 'other')),
    
    -- Reason and urgency
    reason_for_visit TEXT,
    urgency_level TEXT CHECK (urgency_level IN ('routine', 'urgent', 'emergency')),
    
    -- Status
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'arrived', 'in_progress', 'completed', 'cancelled', 'no_show')),
    
    -- Confirmation
    confirmation_sent BOOLEAN DEFAULT false,
    confirmation_sent_at TIMESTAMP WITH TIME ZONE,
    confirmed_by_patient BOOLEAN DEFAULT false,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    
    -- Cancellation
    cancelled_by TEXT, -- 'patient', 'professional', 'establishment', 'system'
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Rescheduling
    rescheduled_from UUID REFERENCES appointments(id),
    rescheduled_to UUID REFERENCES appointments(id),
    
    -- Check-in
    checked_in_at TIMESTAMP WITH TIME ZONE,
    checked_in_by UUID REFERENCES profiles(id),
    
    -- Notes
    patient_notes TEXT,
    internal_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Prescriptions table (detailed)
CREATE TABLE prescriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Links
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id),
    prescriber_id UUID REFERENCES professionals(id),
    establishment_id UUID REFERENCES establishments(id),
    
    -- Prescription details
    prescription_number TEXT UNIQUE DEFAULT ('RX-' || to_char(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('prescription_seq')::TEXT, 6, '0')),
    prescription_date DATE DEFAULT CURRENT_DATE,
    
    -- Validity
    valid_until DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    is_renewable BOOLEAN DEFAULT false,
    renewal_count INTEGER DEFAULT 0,
    max_renewals INTEGER DEFAULT 0,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'dispensed', 'partially_dispensed', 'expired', 'cancelled')),
    
    -- Electronic signature
    is_electronically_signed BOOLEAN DEFAULT false,
    signed_at TIMESTAMP WITH TIME ZONE,
    signature_hash TEXT,
    
    -- QR code for verification
    qr_code TEXT,
    verification_code TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequence for prescription numbers
CREATE SEQUENCE IF NOT EXISTS prescription_seq START 1;

-- Prescription items (medications)
CREATE TABLE prescription_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    
    -- Medication details
    medication_name TEXT NOT NULL,
    medication_code TEXT, -- DCI code
    medication_form TEXT, -- 'tablet', 'capsule', 'syrup', 'injection', etc.
    
    -- Dosage
    dosage_amount DECIMAL(10,3),
    dosage_unit TEXT, -- 'mg', 'ml', 'units', etc.
    frequency TEXT, -- '3 times daily', 'every 8 hours', etc.
    duration_value INTEGER,
    duration_unit TEXT, -- 'days', 'weeks', 'months'
    
    -- Quantity
    quantity_prescribed INTEGER,
    quantity_dispensed INTEGER DEFAULT 0,
    
    -- Instructions
    administration_route TEXT, -- 'oral', 'IV', 'IM', 'topical', etc.
    special_instructions TEXT,
    food_instructions TEXT, -- 'with food', 'empty stomach', etc.
    
    -- Substitution
    substitution_allowed BOOLEAN DEFAULT true,
    substituted_with TEXT,
    
    -- Dispensing
    dispensed_by UUID REFERENCES professionals(id),
    dispensed_at TIMESTAMP WITH TIME ZONE,
    pharmacy_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lab results table
CREATE TABLE lab_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Links
    patient_id UUID REFERENCES patients(id),
    consultation_id UUID REFERENCES consultations(id),
    ordering_professional_id UUID REFERENCES professionals(id),
    performing_professional_id UUID REFERENCES professionals(id),
    establishment_id UUID REFERENCES establishments(id),
    laboratory_id UUID REFERENCES establishments(id),
    
    -- Order details
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    order_number TEXT UNIQUE,
    
    -- Test details
    test_category TEXT, -- 'hematology', 'biochemistry', 'microbiology', etc.
    test_name TEXT NOT NULL,
    test_code TEXT,
    
    -- Sample information
    sample_type TEXT, -- 'blood', 'urine', 'stool', etc.
    sample_collected_at TIMESTAMP WITH TIME ZONE,
    sample_received_at TIMESTAMP WITH TIME ZONE,
    
    -- Results
    result_date TIMESTAMP WITH TIME ZONE,
    result_value TEXT,
    result_unit TEXT,
    reference_range TEXT,
    interpretation TEXT, -- 'normal', 'abnormal', 'critical'
    
    -- Status
    status TEXT DEFAULT 'ordered' CHECK (status IN ('ordered', 'sample_collected', 'in_progress', 'completed', 'cancelled')),
    is_urgent BOOLEAN DEFAULT false,
    is_critical BOOLEAN DEFAULT false,
    
    -- Validation
    validated_by UUID REFERENCES professionals(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    
    -- Report
    report_text TEXT,
    report_pdf_url TEXT,
    
    -- Metadata
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Imaging results table
CREATE TABLE imaging_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Links
    patient_id UUID REFERENCES patients(id),
    consultation_id UUID REFERENCES consultations(id),
    ordering_professional_id UUID REFERENCES professionals(id),
    radiologist_id UUID REFERENCES professionals(id),
    establishment_id UUID REFERENCES establishments(id),
    imaging_center_id UUID REFERENCES establishments(id),
    
    -- Order details
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    order_number TEXT UNIQUE,
    
    -- Exam details
    exam_type TEXT, -- 'X-ray', 'CT', 'MRI', 'Ultrasound', 'PET', etc.
    body_part TEXT,
    exam_name TEXT NOT NULL,
    exam_code TEXT,
    contrast_used BOOLEAN DEFAULT false,
    
    -- Execution
    exam_date TIMESTAMP WITH TIME ZONE,
    technician_id UUID REFERENCES professionals(id),
    
    -- Results
    findings TEXT,
    impression TEXT,
    recommendations TEXT,
    
    -- Images
    images_urls JSONB DEFAULT '[]',
    dicom_study_id TEXT,
    
    -- Status
    status TEXT DEFAULT 'ordered' CHECK (status IN ('ordered', 'scheduled', 'in_progress', 'completed', 'cancelled')),
    is_urgent BOOLEAN DEFAULT false,
    
    -- Validation
    validated_by UUID REFERENCES professionals(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    
    -- Report
    report_pdf_url TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PART 2: CONSENT MANAGEMENT
-- ============================================

-- Medical data sharing consent
CREATE TABLE data_sharing_consents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Parties
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id),
    establishment_id UUID REFERENCES establishments(id),
    
    -- Consent details
    consent_type TEXT CHECK (consent_type IN ('full_access', 'consultation_only', 'emergency_only', 'specific_data')),
    specific_data_types TEXT[], -- ['consultations', 'prescriptions', 'lab_results', etc.]
    
    -- Validity
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_until DATE,
    
    -- Purpose
    purpose TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revocation_reason TEXT,
    
    -- Signature
    consent_given_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    consent_method TEXT, -- 'electronic', 'paper', 'verbal'
    signature_data TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access logs for audit trail
CREATE TABLE medical_data_access_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Who accessed
    accessed_by UUID REFERENCES profiles(id),
    professional_id UUID REFERENCES professionals(id),
    establishment_id UUID REFERENCES establishments(id),
    
    -- What was accessed
    patient_id UUID REFERENCES patients(id),
    record_type TEXT, -- 'consultation', 'prescription', 'lab_result', etc.
    record_id UUID,
    
    -- Access details
    access_type TEXT, -- 'view', 'create', 'update', 'delete', 'print', 'export'
    access_reason TEXT,
    access_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Consent used
    consent_id UUID REFERENCES data_sharing_consents(id),
    emergency_access BOOLEAN DEFAULT false,
    
    -- Session info
    ip_address INET,
    user_agent TEXT,
    session_id TEXT
);

-- ============================================
-- PART 3: HOSPITALIZATION MANAGEMENT
-- ============================================

-- Hospitalizations table
CREATE TABLE hospitalizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Links
    patient_id UUID REFERENCES patients(id),
    establishment_id UUID REFERENCES establishments(id),
    admitting_professional_id UUID REFERENCES professionals(id),
    attending_professional_id UUID REFERENCES professionals(id),
    
    -- Admission details
    admission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    admission_type TEXT CHECK (admission_type IN ('emergency', 'planned', 'transfer', 'birth')),
    admission_source TEXT, -- 'emergency', 'consultation', 'referral', 'transfer'
    admission_diagnosis TEXT,
    
    -- Location
    department TEXT,
    ward TEXT,
    room_number TEXT,
    bed_number TEXT,
    
    -- Discharge
    discharge_date TIMESTAMP WITH TIME ZONE,
    discharge_type TEXT, -- 'home', 'transfer', 'deceased', 'against_medical_advice'
    discharge_destination TEXT,
    discharge_diagnosis TEXT,
    discharge_summary TEXT,
    
    -- Status
    status TEXT DEFAULT 'admitted' CHECK (status IN ('pre_admission', 'admitted', 'discharged', 'transferred')),
    
    -- Billing
    total_cost DECIMAL(10,2),
    insurance_coverage DECIMAL(10,2),
    patient_payment DECIMAL(10,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PART 4: INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_consultations_patient ON consultations(patient_id);
CREATE INDEX idx_consultations_professional ON consultations(professional_id);
CREATE INDEX idx_consultations_establishment ON consultations(establishment_id);
CREATE INDEX idx_consultations_date ON consultations(consultation_date);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_professional ON appointments(professional_id);
CREATE INDEX idx_appointments_establishment ON appointments(establishment_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_prescriber ON prescriptions(prescriber_id);
CREATE INDEX idx_prescriptions_establishment ON prescriptions(establishment_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);

CREATE INDEX idx_lab_results_patient ON lab_results(patient_id);
CREATE INDEX idx_lab_results_establishment ON lab_results(establishment_id);
CREATE INDEX idx_lab_results_status ON lab_results(status);

CREATE INDEX idx_consents_patient ON data_sharing_consents(patient_id);
CREATE INDEX idx_consents_professional ON data_sharing_consents(professional_id);
CREATE INDEX idx_consents_establishment ON data_sharing_consents(establishment_id);

CREATE INDEX idx_access_logs_patient ON medical_data_access_logs(patient_id);
CREATE INDEX idx_access_logs_accessed_by ON medical_data_access_logs(accessed_by);
CREATE INDEX idx_access_logs_timestamp ON medical_data_access_logs(access_timestamp);

-- ============================================
-- PART 5: ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all medical tables
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sharing_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_data_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitalizations ENABLE ROW LEVEL SECURITY;

-- Medical records policies
CREATE POLICY "Patients can view their own medical record"
    ON medical_records FOR SELECT
    USING (
        patient_id IN (
            SELECT id FROM patients p
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
        )
    );

-- Consultations policies
CREATE POLICY "Patients can view their own consultations"
    ON consultations FOR SELECT
    USING (
        patient_id IN (
            SELECT id FROM patients p
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
        )
    );

CREATE POLICY "Professionals can view consultations in their establishment"
    ON consultations FOR SELECT
    USING (
        establishment_id IN (
            SELECT pa.establishment_id 
            FROM professional_affiliations pa
            JOIN professionals p ON pa.professional_id = p.id
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
            AND pa.status = 'active'
        )
    );

CREATE POLICY "Professionals can create consultations in their establishment"
    ON consultations FOR INSERT
    WITH CHECK (
        establishment_id IN (
            SELECT pa.establishment_id 
            FROM professional_affiliations pa
            JOIN professionals p ON pa.professional_id = p.id
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
            AND pa.status = 'active'
            AND pa.can_prescribe = true
        )
    );

-- Appointments policies
CREATE POLICY "Patients can view their own appointments"
    ON appointments FOR SELECT
    USING (
        patient_id IN (
            SELECT id FROM patients p
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can create their own appointments"
    ON appointments FOR INSERT
    WITH CHECK (
        patient_id IN (
            SELECT id FROM patients p
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
        )
    );

CREATE POLICY "Professionals can view appointments in their establishment"
    ON appointments FOR SELECT
    USING (
        establishment_id IN (
            SELECT pa.establishment_id 
            FROM professional_affiliations pa
            JOIN professionals p ON pa.professional_id = p.id
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
            AND pa.status = 'active'
        )
    );

-- Prescriptions policies
CREATE POLICY "Patients can view their own prescriptions"
    ON prescriptions FOR SELECT
    USING (
        patient_id IN (
            SELECT id FROM patients p
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
        )
    );

CREATE POLICY "Professionals can view prescriptions in their establishment"
    ON prescriptions FOR SELECT
    USING (
        establishment_id IN (
            SELECT pa.establishment_id 
            FROM professional_affiliations pa
            JOIN professionals p ON pa.professional_id = p.id
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
            AND pa.status = 'active'
        )
    );

CREATE POLICY "Authorized professionals can create prescriptions"
    ON prescriptions FOR INSERT
    WITH CHECK (
        prescriber_id IN (
            SELECT p.id 
            FROM professionals p
            JOIN profiles pr ON p.profile_id = pr.id
            JOIN professional_affiliations pa ON p.id = pa.professional_id
            WHERE pr.user_id = auth.uid()
            AND pa.status = 'active'
            AND pa.can_prescribe = true
        )
    );

-- Consent policies
CREATE POLICY "Patients can manage their own consents"
    ON data_sharing_consents FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM patients p
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
        )
    );

CREATE POLICY "Professionals can view consents given to them"
    ON data_sharing_consents FOR SELECT
    USING (
        professional_id IN (
            SELECT p.id 
            FROM professionals p
            JOIN profiles pr ON p.profile_id = pr.id
            WHERE pr.user_id = auth.uid()
        )
    );

-- ============================================
-- PART 6: FUNCTIONS FOR MEDICAL DATA ACCESS
-- ============================================

-- Function to check if professional can access patient data
CREATE OR REPLACE FUNCTION can_access_patient_data(
    p_professional_id UUID,
    p_patient_id UUID,
    p_establishment_id UUID,
    p_data_type TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_has_consent BOOLEAN;
    v_is_emergency BOOLEAN;
BEGIN
    -- Check for active consent
    SELECT EXISTS(
        SELECT 1 FROM data_sharing_consents
        WHERE patient_id = p_patient_id
        AND (
            professional_id = p_professional_id
            OR establishment_id = p_establishment_id
        )
        AND is_active = true
        AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
        AND (
            consent_type IN ('full_access', 'consultation_only')
            OR (consent_type = 'specific_data' AND p_data_type = ANY(specific_data_types))
        )
    ) INTO v_has_consent;
    
    IF v_has_consent THEN
        -- Log access
        INSERT INTO medical_data_access_logs (
            accessed_by,
            professional_id,
            establishment_id,
            patient_id,
            record_type,
            access_type,
            access_reason
        ) VALUES (
            auth.uid(),
            p_professional_id,
            p_establishment_id,
            p_patient_id,
            p_data_type,
            'view',
            'consent_based'
        );
        
        RETURN TRUE;
    END IF;
    
    -- Check for emergency access
    SELECT emergency_access_allowed INTO v_is_emergency
    FROM medical_records
    WHERE patient_id = p_patient_id;
    
    IF v_is_emergency AND p_data_type = 'emergency' THEN
        -- Log emergency access
        INSERT INTO medical_data_access_logs (
            accessed_by,
            professional_id,
            establishment_id,
            patient_id,
            record_type,
            access_type,
            access_reason,
            emergency_access
        ) VALUES (
            auth.uid(),
            p_professional_id,
            p_establishment_id,
            p_patient_id,
            p_data_type,
            'view',
            'emergency',
            true
        );
        
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
