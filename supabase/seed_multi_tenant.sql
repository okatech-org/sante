-- ============================================
-- SANTE.GA Multi-Tenant Test Data
-- Realistic test data for testing isolation
-- ============================================

-- Create test users in auth.users (if not exists)
DO $$
BEGIN
    -- Test Patient
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'patient.test@sante.ga') THEN
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
        VALUES (
            'a1111111-1111-1111-1111-111111111111',
            'patient.test@sante.ga',
            crypt('Test@2024!', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
    END IF;

    -- Test Doctor 1 (Multi-establishment)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dr.nguema@sante.ga') THEN
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
        VALUES (
            'b2222222-2222-2222-2222-222222222222',
            'dr.nguema@sante.ga',
            crypt('Test@2024!', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
    END IF;

    -- Test Doctor 2 (Single establishment)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dr.obame@sante.ga') THEN
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
        VALUES (
            'c3333333-3333-3333-3333-333333333333',
            'dr.obame@sante.ga',
            crypt('Test@2024!', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
    END IF;

    -- Test Pharmacist
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pharm.moussavou@sante.ga') THEN
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
        VALUES (
            'd4444444-4444-4444-4444-444444444444',
            'pharm.moussavou@sante.ga',
            crypt('Test@2024!', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
    END IF;
END $$;

-- ============================================
-- CREATE PROFILES
-- ============================================

-- Patient profile
INSERT INTO profiles (id, user_id, email, phone, first_name, last_name, date_of_birth, national_id, gender, profile_type, is_active)
VALUES (
    'p1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'patient.test@sante.ga',
    '+241 07 12 34 56',
    'Marie',
    'OBAME',
    '1985-06-15',
    'GAB850615F001',
    'F',
    'patient',
    true
) ON CONFLICT (email) DO NOTHING;

-- Doctor 1 profile (Multi-establishment)
INSERT INTO profiles (id, user_id, email, phone, first_name, last_name, date_of_birth, national_id, gender, profile_type, is_active)
VALUES (
    'p2222222-2222-2222-2222-222222222222',
    'b2222222-2222-2222-2222-222222222222',
    'dr.nguema@sante.ga',
    '+241 07 23 45 67',
    'Pierre',
    'NGUEMA',
    '1978-03-22',
    'GAB780322M002',
    'M',
    'professional',
    true
) ON CONFLICT (email) DO NOTHING;

-- Doctor 2 profile (Single establishment)
INSERT INTO profiles (id, user_id, email, phone, first_name, last_name, date_of_birth, national_id, gender, profile_type, is_active)
VALUES (
    'p3333333-3333-3333-3333-333333333333',
    'c3333333-3333-3333-3333-333333333333',
    'dr.obame@sante.ga',
    '+241 07 34 56 78',
    'Jeanne',
    'OBAME',
    '1982-11-08',
    'GAB821108F003',
    'F',
    'professional',
    true
) ON CONFLICT (email) DO NOTHING;

-- Pharmacist profile
INSERT INTO profiles (id, user_id, email, phone, first_name, last_name, date_of_birth, national_id, gender, profile_type, is_active)
VALUES (
    'p4444444-4444-4444-4444-444444444444',
    'd4444444-4444-4444-4444-444444444444',
    'pharm.moussavou@sante.ga',
    '+241 07 45 67 89',
    'Claude',
    'MOUSSAVOU',
    '1980-09-12',
    'GAB800912M004',
    'M',
    'professional',
    true
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- CREATE PATIENT DATA
-- ============================================

INSERT INTO patients (
    id,
    profile_id,
    cnamgs_number,
    cnamgs_status,
    cnamgs_coverage_rate,
    blood_group,
    emergency_contact_name,
    emergency_contact_phone,
    emergency_contact_relationship
) VALUES (
    'pat11111-1111-1111-1111-111111111111',
    'p1111111-1111-1111-1111-111111111111',
    'CNAM2024001',
    'active',
    0.80,
    'O+',
    'Jean OBAME',
    '+241 07 98 76 54',
    'Époux'
) ON CONFLICT (profile_id) DO NOTHING;

-- Create medical record for patient
INSERT INTO medical_records (
    id,
    patient_id,
    record_number,
    default_sharing_consent,
    emergency_access_allowed
) VALUES (
    'mr111111-1111-1111-1111-111111111111',
    'pat11111-1111-1111-1111-111111111111',
    'DMP-2024-000001',
    false,
    true
) ON CONFLICT DO NOTHING;

-- ============================================
-- CREATE PROFESSIONAL DATA
-- ============================================

-- Doctor 1 (Cardiologist - Multi-establishment)
INSERT INTO professionals (
    id,
    profile_id,
    profession_type,
    specializations,
    ordre_number,
    ordre_type,
    ordre_status,
    years_of_experience,
    is_verified
) VALUES (
    'prof2222-2222-2222-2222-222222222222',
    'p2222222-2222-2222-2222-222222222222',
    'doctor',
    ARRAY['Cardiologie'],
    'CNOM2024001',
    'CNOM',
    'active',
    15,
    true
) ON CONFLICT (profile_id) DO NOTHING;

-- Doctor 2 (General Practitioner)
INSERT INTO professionals (
    id,
    profile_id,
    profession_type,
    specializations,
    ordre_number,
    ordre_type,
    ordre_status,
    years_of_experience,
    is_verified
) VALUES (
    'prof3333-3333-3333-3333-333333333333',
    'p3333333-3333-3333-3333-333333333333',
    'doctor',
    ARRAY['Médecine Générale'],
    'CNOM2024002',
    'CNOM',
    'active',
    8,
    true
) ON CONFLICT (profile_id) DO NOTHING;

-- Pharmacist
INSERT INTO professionals (
    id,
    profile_id,
    profession_type,
    ordre_number,
    ordre_type,
    ordre_status,
    years_of_experience,
    is_verified
) VALUES (
    'prof4444-4444-4444-4444-444444444444',
    'p4444444-4444-4444-4444-444444444444',
    'pharmacist',
    'ONPG2024001',
    'ONPG',
    'active',
    10,
    true
) ON CONFLICT (profile_id) DO NOTHING;

-- ============================================
-- CREATE STAFF ASSOCIATIONS
-- ============================================

-- Get establishment IDs
DO $$
DECLARE
    chu_id UUID;
    clinique_id UUID;
    cabinet_id UUID;
    pharmacie_id UUID;
BEGIN
    -- Get CHU Libreville ID
    SELECT id INTO chu_id FROM establishments WHERE name = 'Centre Hospitalier Universitaire de Libreville';
    
    -- Get Clinique El Rapha ID
    SELECT id INTO clinique_id FROM establishments WHERE name = 'Clinique El Rapha';
    
    -- Get Cabinet Saint-Michel ID
    SELECT id INTO cabinet_id FROM establishments WHERE name = 'Cabinet Médical Saint-Michel';
    
    -- Get Pharmacie du Soleil ID
    SELECT id INTO pharmacie_id FROM establishments WHERE name = 'Pharmacie du Soleil';

    -- Dr. NGUEMA works at CHU (full-time, department head)
    INSERT INTO establishment_staff (
        establishment_id,
        professional_id,
        role_title,
        role_category,
        department,
        is_department_head,
        is_establishment_admin,
        permissions,
        schedule_type,
        weekly_hours,
        contract_type,
        contract_start_date,
        status
    ) VALUES (
        chu_id,
        'prof2222-2222-2222-2222-222222222222',
        'Chef de Service Cardiologie',
        'medical',
        'Cardiologie',
        true,
        false,
        ARRAY['create_consultation', 'write_prescription', 'order_labs', 'admit_patient', 'manage_staff'],
        'full_time',
        40,
        'permanent',
        '2020-01-15',
        'active'
    ) ON CONFLICT (establishment_id, professional_id) DO NOTHING;

    -- Dr. NGUEMA also works at Clinique El Rapha (part-time consultant)
    INSERT INTO establishment_staff (
        establishment_id,
        professional_id,
        role_title,
        role_category,
        department,
        is_department_head,
        permissions,
        schedule_type,
        weekly_hours,
        contract_type,
        contract_start_date,
        consultation_fee_standard,
        consultation_fee_cnamgs,
        revenue_share_percentage,
        status
    ) VALUES (
        clinique_id,
        'prof2222-2222-2222-2222-222222222222',
        'Cardiologue Consultant',
        'medical',
        'Consultations Spécialisées',
        false,
        ARRAY['create_consultation', 'write_prescription', 'order_labs'],
        'part_time',
        12,
        'consultant',
        '2022-06-01',
        75000,
        22500,
        30,
        'active'
    ) ON CONFLICT (establishment_id, professional_id) DO NOTHING;

    -- Dr. NGUEMA owns a private cabinet
    INSERT INTO establishment_staff (
        establishment_id,
        professional_id,
        role_title,
        role_category,
        is_establishment_admin,
        permissions,
        schedule_type,
        weekly_hours,
        contract_type,
        contract_start_date,
        consultation_fee_standard,
        status
    ) VALUES (
        cabinet_id,
        'prof2222-2222-2222-2222-222222222222',
        'Propriétaire - Cardiologue',
        'medical',
        true,
        ARRAY['create_consultation', 'write_prescription', 'order_labs', 'manage_staff', 'view_finances'],
        'part_time',
        8,
        'permanent',
        '2021-03-01',
        50000,
        'active'
    ) ON CONFLICT (establishment_id, professional_id) DO NOTHING;

    -- Update cabinet owner
    UPDATE medical_cabinets 
    SET primary_owner_id = 'prof2222-2222-2222-2222-222222222222'
    WHERE id = cabinet_id;

    -- Dr. OBAME works only at CHU
    INSERT INTO establishment_staff (
        establishment_id,
        professional_id,
        role_title,
        role_category,
        department,
        permissions,
        schedule_type,
        weekly_hours,
        contract_type,
        contract_start_date,
        status
    ) VALUES (
        chu_id,
        'prof3333-3333-3333-3333-333333333333',
        'Médecin Généraliste',
        'medical',
        'Médecine Générale',
        ARRAY['create_consultation', 'write_prescription', 'order_labs'],
        'full_time',
        40,
        'permanent',
        '2018-09-01',
        'active'
    ) ON CONFLICT (establishment_id, professional_id) DO NOTHING;

    -- Pharmacist works at Pharmacie du Soleil
    INSERT INTO establishment_staff (
        establishment_id,
        professional_id,
        role_title,
        role_category,
        is_establishment_admin,
        permissions,
        schedule_type,
        weekly_hours,
        contract_type,
        contract_start_date,
        status
    ) VALUES (
        pharmacie_id,
        'prof4444-4444-4444-4444-444444444444',
        'Pharmacien Titulaire',
        'medical',
        true,
        ARRAY['dispense_medication', 'manage_inventory', 'view_prescriptions', 'manage_staff'],
        'full_time',
        45,
        'permanent',
        '2019-02-01',
        'active'
    ) ON CONFLICT (establishment_id, professional_id) DO NOTHING;

    -- Update pharmacy owner
    UPDATE pharmacies 
    SET pharmacist_owner_id = 'prof4444-4444-4444-4444-444444444444'
    WHERE id = pharmacie_id;

    -- Mark establishments as claimed
    UPDATE establishments 
    SET claim_status = 'verified', 
        claimed_by = 'p2222222-2222-2222-2222-222222222222',
        claimed_at = NOW() - INTERVAL '6 months',
        claim_verified_at = NOW() - INTERVAL '5 months'
    WHERE id = cabinet_id;

    UPDATE establishments 
    SET claim_status = 'verified',
        claimed_by = 'p4444444-4444-4444-4444-444444444444',
        claimed_at = NOW() - INTERVAL '1 year',
        claim_verified_at = NOW() - INTERVAL '11 months'
    WHERE id = pharmacie_id;

END $$;

-- ============================================
-- CREATE TEST CONSULTATIONS (Testing Isolation)
-- ============================================

DO $$
DECLARE
    chu_id UUID;
    clinique_id UUID;
    cabinet_id UUID;
BEGIN
    SELECT id INTO chu_id FROM establishments WHERE name = 'Centre Hospitalier Universitaire de Libreville';
    SELECT id INTO clinique_id FROM establishments WHERE name = 'Clinique El Rapha';
    SELECT id INTO cabinet_id FROM establishments WHERE name = 'Cabinet Médical Saint-Michel';

    -- Consultation 1: Dr. NGUEMA at CHU (should be visible only at CHU)
    INSERT INTO consultations (
        id,
        patient_id,
        professional_id,
        establishment_id,
        consultation_date,
        consultation_type,
        consultation_reason,
        chief_complaint,
        diagnoses,
        treatment_plan,
        status
    ) VALUES (
        'cons1111-1111-1111-1111-111111111111',
        'pat11111-1111-1111-1111-111111111111',
        'prof2222-2222-2222-2222-222222222222',
        chu_id,
        NOW() - INTERVAL '7 days',
        'in_person',
        'Contrôle cardiologique',
        'Douleurs thoraciques',
        '[{"icd10_code": "I20.9", "description": "Angine de poitrine", "type": "primary"}]'::jsonb,
        'Traitement médicamenteux + ECG de contrôle dans 1 mois',
        'completed'
    );

    -- Consultation 2: Dr. NGUEMA at Clinique (should be visible only at Clinique)
    INSERT INTO consultations (
        patient_id,
        professional_id,
        establishment_id,
        consultation_date,
        consultation_type,
        consultation_reason,
        chief_complaint,
        diagnoses,
        treatment_plan,
        status
    ) VALUES (
        'pat11111-1111-1111-1111-111111111111',
        'prof2222-2222-2222-2222-222222222222',
        clinique_id,
        NOW() - INTERVAL '14 days',
        'in_person',
        'Consultation de suivi',
        'Contrôle tension artérielle',
        '[{"icd10_code": "I10", "description": "Hypertension essentielle", "type": "primary"}]'::jsonb,
        'Ajustement du traitement antihypertenseur',
        'completed'
    );

    -- Consultation 3: Dr. OBAME at CHU (should be visible only at CHU)
    INSERT INTO consultations (
        patient_id,
        professional_id,
        establishment_id,
        consultation_date,
        consultation_type,
        consultation_reason,
        chief_complaint,
        diagnoses,
        treatment_plan,
        status
    ) VALUES (
        'pat11111-1111-1111-1111-111111111111',
        'prof3333-3333-3333-3333-333333333333',
        chu_id,
        NOW() - INTERVAL '21 days',
        'in_person',
        'Consultation générale',
        'Fièvre et toux',
        '[{"icd10_code": "J06.9", "description": "Infection aiguë des voies respiratoires", "type": "primary"}]'::jsonb,
        'Antibiotiques + repos + hydratation',
        'completed'
    );

END $$;

-- ============================================
-- CREATE PATIENT CONSENTS
-- ============================================

-- Patient gives full consent to Dr. NGUEMA
INSERT INTO patient_consents (
    patient_id,
    professional_id,
    consent_type,
    access_scope,
    granted_via,
    is_active
) VALUES (
    'pat11111-1111-1111-1111-111111111111',
    'prof2222-2222-2222-2222-222222222222',
    'read_write',
    '{"consultations": true, "prescriptions": true, "lab_results": true, "imaging": true, "allergies": true, "medications": true}'::jsonb,
    'in_person',
    true
) ON CONFLICT DO NOTHING;

-- Patient gives limited consent to CHU (emergency only)
DO $$
DECLARE
    chu_id UUID;
BEGIN
    SELECT id INTO chu_id FROM establishments WHERE name = 'Centre Hospitalier Universitaire de Libreville';
    
    INSERT INTO patient_consents (
        patient_id,
        establishment_id,
        consent_type,
        access_scope,
        granted_via,
        is_active
    ) VALUES (
        'pat11111-1111-1111-1111-111111111111',
        chu_id,
        'emergency_only',
        '{"consultations": true, "allergies": true, "medications": true}'::jsonb,
        'patient_portal',
        true
    ) ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- CREATE TEST APPOINTMENTS
-- ============================================

DO $$
DECLARE
    chu_id UUID;
    cabinet_id UUID;
BEGIN
    SELECT id INTO chu_id FROM establishments WHERE name = 'Centre Hospitalier Universitaire de Libreville';
    SELECT id INTO cabinet_id FROM establishments WHERE name = 'Cabinet Médical Saint-Michel';

    -- Future appointment at CHU with Dr. NGUEMA
    INSERT INTO appointments (
        patient_id,
        professional_id,
        establishment_id,
        appointment_date,
        appointment_time,
        appointment_type,
        reason_for_visit,
        status
    ) VALUES (
        'pat11111-1111-1111-1111-111111111111',
        'prof2222-2222-2222-2222-222222222222',
        chu_id,
        CURRENT_DATE + INTERVAL '7 days',
        '14:30:00',
        'consultation',
        'Contrôle cardiologique',
        'scheduled'
    );

    -- Future appointment at Cabinet with Dr. NGUEMA
    INSERT INTO appointments (
        patient_id,
        professional_id,
        establishment_id,
        appointment_date,
        appointment_time,
        appointment_type,
        reason_for_visit,
        status
    ) VALUES (
        'pat11111-1111-1111-1111-111111111111',
        'prof2222-2222-2222-2222-222222222222',
        cabinet_id,
        CURRENT_DATE + INTERVAL '14 days',
        '18:00:00',
        'consultation',
        'Suivi tension artérielle',
        'scheduled'
    );

END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Query to verify multi-establishment setup
SELECT 
    p.first_name || ' ' || p.last_name AS professional,
    e.name AS establishment,
    es.role_title,
    es.schedule_type,
    es.status
FROM establishment_staff es
JOIN professionals prof ON es.professional_id = prof.id
JOIN profiles p ON prof.profile_id = p.id
JOIN establishments e ON es.establishment_id = e.id
ORDER BY p.last_name, e.name;

-- Query to verify data isolation (consultations per establishment)
SELECT 
    e.name AS establishment,
    COUNT(c.id) AS consultation_count,
    STRING_AGG(DISTINCT p.first_name || ' ' || p.last_name, ', ') AS doctors
FROM consultations c
JOIN establishments e ON c.establishment_id = e.id
JOIN professionals prof ON c.professional_id = prof.id
JOIN profiles p ON prof.profile_id = p.id
GROUP BY e.name;

-- Query to verify patient consents
SELECT 
    pat.first_name || ' ' || pat.last_name AS patient,
    COALESCE(prof_p.first_name || ' ' || prof_p.last_name, e.name) AS consent_target,
    pc.consent_type,
    pc.is_active
FROM patient_consents pc
JOIN patients p ON pc.patient_id = p.id
JOIN profiles pat ON p.profile_id = pat.id
LEFT JOIN professionals prof ON pc.professional_id = prof.id
LEFT JOIN profiles prof_p ON prof.profile_id = prof_p.id
LEFT JOIN establishments e ON pc.establishment_id = e.id;
