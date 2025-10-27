-- ============================================
-- TABLES PATIENTS ET DMP - SANTE.GA
-- ============================================

-- Table profils patients
CREATE TABLE IF NOT EXISTS profiles_patient (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Informations personnelles
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
  phone VARCHAR(20) UNIQUE,
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  
  -- Informations médicales
  blood_group VARCHAR(10),
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  
  -- Assurances
  cnamgs_number VARCHAR(50) UNIQUE,
  cnamgs_status VARCHAR(20) DEFAULT 'unverified',
  cnamgs_coverage_percent INTEGER DEFAULT 80,
  cnss_number VARCHAR(50),
  cnss_verified BOOLEAN DEFAULT false,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_insurance_check TIMESTAMP WITH TIME ZONE,
  
  FOREIGN KEY (user_id) REFERENCES user_roles(user_id) ON DELETE CASCADE
);

-- Table antécédents médicaux
CREATE TABLE IF NOT EXISTS patient_medical_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL,
  
  type VARCHAR(50) NOT NULL, -- 'disease', 'surgery', 'allergy', 'family_history'
  name VARCHAR(200) NOT NULL,
  description TEXT,
  diagnosed_date DATE,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (patient_id) REFERENCES profiles_patient(id) ON DELETE CASCADE
);

-- Table vaccinations
CREATE TABLE IF NOT EXISTS patient_vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL,
  
  vaccine_name VARCHAR(200) NOT NULL,
  administered_date DATE NOT NULL,
  next_dose_date DATE,
  location VARCHAR(200),
  batch_number VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (patient_id) REFERENCES profiles_patient(id) ON DELETE CASCADE
);

-- Table consentements accès DMP
CREATE TABLE IF NOT EXISTS dmp_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL,
  
  -- Professionnel autorisé
  professional_id UUID,
  establishment_id UUID, -- Si accès établissement entier
  
  -- Type d'accès
  access_type VARCHAR(20) CHECK (access_type IN ('read', 'write', 'full')),
  
  -- Portée
  scope_consultations BOOLEAN DEFAULT true,
  scope_prescriptions BOOLEAN DEFAULT true,
  scope_lab_results BOOLEAN DEFAULT true,
  scope_imaging BOOLEAN DEFAULT true,
  scope_history BOOLEAN DEFAULT false, -- Antécédents
  
  -- Durée
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE, -- NULL = permanent
  revoked_at TIMESTAMP WITH TIME ZONE,
  
  -- Audit
  granted_by UUID, -- Patient lui-même ou tuteur
  reason TEXT,
  
  FOREIGN KEY (patient_id) REFERENCES profiles_patient(id) ON DELETE CASCADE,
  FOREIGN KEY (professional_id) REFERENCES user_roles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (granted_by) REFERENCES user_roles(user_id)
);

-- Table DMP - Consultations
CREATE TABLE IF NOT EXISTS dmp_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL,
  professional_id UUID NOT NULL,
  
  consultation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  consultation_type VARCHAR(50), -- 'in_person', 'teleconsultation', 'emergency'
  
  -- Motif et diagnostic
  reason TEXT NOT NULL,
  symptoms TEXT,
  diagnosis TEXT,
  treatment_plan TEXT,
  
  -- Signes vitaux
  blood_pressure VARCHAR(20),
  heart_rate INTEGER,
  temperature DECIMAL(4,1),
  weight_kg DECIMAL(5,2),
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (patient_id) REFERENCES profiles_patient(id) ON DELETE CASCADE,
  FOREIGN KEY (professional_id) REFERENCES user_roles(user_id)
);

-- Table DMP - Prescriptions
CREATE TABLE IF NOT EXISTS dmp_prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL,
  professional_id UUID NOT NULL,
  consultation_id UUID,
  
  prescription_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Médicaments (JSON array)
  medications JSONB NOT NULL,
  
  -- Statut dispensation
  dispensed BOOLEAN DEFAULT false,
  dispensed_at TIMESTAMP WITH TIME ZONE,
  pharmacy_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (patient_id) REFERENCES profiles_patient(id) ON DELETE CASCADE,
  FOREIGN KEY (professional_id) REFERENCES user_roles(user_id),
  FOREIGN KEY (consultation_id) REFERENCES dmp_consultations(id)
);

-- Table DMP - Résultats laboratoires
CREATE TABLE IF NOT EXISTS dmp_lab_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL,
  prescribed_by UUID NOT NULL,
  laboratory_id UUID NOT NULL,
  
  test_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  test_type VARCHAR(200) NOT NULL,
  
  -- Résultats (JSON pour flexibilité)
  results JSONB NOT NULL,
  
  validated BOOLEAN DEFAULT false,
  validated_by UUID, -- Biologiste
  validated_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (patient_id) REFERENCES profiles_patient(id) ON DELETE CASCADE,
  FOREIGN KEY (prescribed_by) REFERENCES user_roles(user_id)
);

-- Table DMP - Résultats imagerie
CREATE TABLE IF NOT EXISTS dmp_imaging_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL,
  prescribed_by UUID NOT NULL,
  imaging_center_id UUID NOT NULL,
  
  exam_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  exam_type VARCHAR(100) NOT NULL, -- 'radiographie', 'echographie', 'scanner', 'irm'
  body_part VARCHAR(100),
  
  -- Images DICOM (URLs cloud storage)
  images_urls TEXT[],
  
  -- Compte-rendu
  report TEXT,
  interpreted_by UUID, -- Radiologue
  interpreted_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (patient_id) REFERENCES profiles_patient(id) ON DELETE CASCADE,
  FOREIGN KEY (prescribed_by) REFERENCES user_roles(user_id),
  FOREIGN KEY (interpreted_by) REFERENCES user_roles(user_id)
);

-- Index pour performances
CREATE INDEX idx_patient_user_id ON profiles_patient(user_id);
CREATE INDEX idx_patient_cnamgs ON profiles_patient(cnamgs_number);
CREATE INDEX idx_patient_cnss ON profiles_patient(cnss_number);

CREATE INDEX idx_medical_history_patient ON patient_medical_history(patient_id);
CREATE INDEX idx_vaccinations_patient ON patient_vaccinations(patient_id);

CREATE INDEX idx_consents_patient ON dmp_consents(patient_id);
CREATE INDEX idx_consents_professional ON dmp_consents(professional_id);

CREATE INDEX idx_consultations_patient ON dmp_consultations(patient_id);
CREATE INDEX idx_prescriptions_patient ON dmp_prescriptions(patient_id);
CREATE INDEX idx_lab_results_patient ON dmp_lab_results(patient_id);
CREATE INDEX idx_imaging_results_patient ON dmp_imaging_results(patient_id);
