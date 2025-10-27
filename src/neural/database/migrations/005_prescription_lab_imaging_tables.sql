-- ============================================
-- TABLES PRESCRIPTIONS, LABORATOIRES ET IMAGERIE - SANTE.GA
-- ============================================

-- Table prescriptions électroniques
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Acteurs
  patient_id UUID NOT NULL,
  prescriber_id UUID NOT NULL, -- Médecin prescripteur
  pharmacy_id UUID, -- Pharmacie de dispensation
  
  -- Consultation liée
  consultation_id UUID,
  
  -- Statut
  status VARCHAR(50) DEFAULT 'active', -- 'draft', 'active', 'dispensed', 'partial', 'expired', 'cancelled'
  
  -- QR Code
  qr_code VARCHAR(500) UNIQUE,
  
  -- Validité
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  dispensed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancel_reason TEXT,
  
  FOREIGN KEY (patient_id) REFERENCES profiles_patient(id) ON DELETE CASCADE,
  FOREIGN KEY (prescriber_id) REFERENCES profiles_professional(id) ON DELETE CASCADE,
  FOREIGN KEY (consultation_id) REFERENCES dmp_consultations(id) ON DELETE SET NULL
);

-- Table médicaments prescrits
CREATE TABLE IF NOT EXISTS prescription_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_id UUID NOT NULL,
  
  -- Médicament
  medication_name VARCHAR(200) NOT NULL,
  medication_code VARCHAR(100), -- Code CIS/ATC
  
  -- Posologie
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  duration VARCHAR(100),
  quantity INTEGER,
  
  -- Instructions
  instructions TEXT,
  
  -- Statut dispensation
  dispensed BOOLEAN DEFAULT false,
  dispensed_quantity INTEGER,
  dispensed_at TIMESTAMP WITH TIME ZONE,
  
  -- Substitution
  substitution_allowed BOOLEAN DEFAULT true,
  substituted_with VARCHAR(200),
  
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
);

-- Table analyses laboratoire
CREATE TABLE IF NOT EXISTS lab_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Acteurs
  patient_id UUID NOT NULL,
  prescriber_id UUID NOT NULL,
  laboratory_id UUID,
  
  -- Consultation liée
  consultation_id UUID,
  
  -- Statut
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
  
  -- Urgence
  priority VARCHAR(20) DEFAULT 'normal', -- 'normal', 'urgent', 'critical'
  
  -- Instructions
  clinical_info TEXT,
  special_instructions TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  FOREIGN KEY (patient_id) REFERENCES profiles_patient(id) ON DELETE CASCADE,
  FOREIGN KEY (prescriber_id) REFERENCES profiles_professional(id) ON DELETE CASCADE,
  FOREIGN KEY (consultation_id) REFERENCES dmp_consultations(id) ON DELETE SET NULL
);

-- Table examens demandés
CREATE TABLE IF NOT EXISTS lab_order_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_order_id UUID NOT NULL,
  
  -- Test
  test_name VARCHAR(200) NOT NULL,
  test_code VARCHAR(100), -- Code LOINC
  category VARCHAR(100), -- 'hematology', 'biochemistry', 'microbiology', etc.
  
  -- Échantillon
  sample_type VARCHAR(100), -- 'blood', 'urine', 'stool', etc.
  sample_collected BOOLEAN DEFAULT false,
  sample_collected_at TIMESTAMP WITH TIME ZONE,
  
  -- Résultat
  result TEXT,
  result_value NUMERIC,
  result_unit VARCHAR(50),
  normal_range VARCHAR(100),
  abnormal BOOLEAN DEFAULT false,
  
  -- Statut
  status VARCHAR(50) DEFAULT 'pending',
  
  FOREIGN KEY (lab_order_id) REFERENCES lab_orders(id) ON DELETE CASCADE
);

-- Table examens imagerie
CREATE TABLE IF NOT EXISTS imaging_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Acteurs
  patient_id UUID NOT NULL,
  prescriber_id UUID NOT NULL,
  radiology_center_id UUID,
  radiologist_id UUID,
  
  -- Consultation liée
  consultation_id UUID,
  
  -- Type d'examen
  exam_type VARCHAR(100) NOT NULL, -- 'xray', 'ct', 'mri', 'ultrasound', 'mammography'
  body_part VARCHAR(100),
  
  -- Statut
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'scheduled', 'completed', 'cancelled'
  
  -- Urgence
  priority VARCHAR(20) DEFAULT 'normal',
  
  -- Instructions
  clinical_indication TEXT,
  special_instructions TEXT,
  
  -- Résultats
  report TEXT,
  conclusion TEXT,
  
  -- Images DICOM
  dicom_study_id VARCHAR(200),
  images_url TEXT[],
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  FOREIGN KEY (patient_id) REFERENCES profiles_patient(id) ON DELETE CASCADE,
  FOREIGN KEY (prescriber_id) REFERENCES profiles_professional(id) ON DELETE CASCADE,
  FOREIGN KEY (radiologist_id) REFERENCES profiles_professional(id) ON DELETE SET NULL,
  FOREIGN KEY (consultation_id) REFERENCES dmp_consultations(id) ON DELETE SET NULL
);

-- Table historique dispensation médicaments
CREATE TABLE IF NOT EXISTS dispensation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  prescription_item_id UUID NOT NULL,
  pharmacy_id UUID NOT NULL,
  pharmacist_id UUID NOT NULL,
  
  -- Détails
  quantity_dispensed INTEGER NOT NULL,
  medication_dispensed VARCHAR(200) NOT NULL,
  
  -- Prix
  unit_price INTEGER,
  total_price INTEGER,
  cnamgs_coverage INTEGER,
  patient_payment INTEGER,
  
  -- Métadonnées
  dispensed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  
  FOREIGN KEY (prescription_item_id) REFERENCES prescription_items(id) ON DELETE CASCADE,
  FOREIGN KEY (pharmacist_id) REFERENCES profiles_professional(id) ON DELETE SET NULL
);

-- Index
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_prescriber ON prescriptions(prescriber_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescriptions_qr ON prescriptions(qr_code);

CREATE INDEX idx_lab_orders_patient ON lab_orders(patient_id);
CREATE INDEX idx_lab_orders_prescriber ON lab_orders(prescriber_id);
CREATE INDEX idx_lab_orders_status ON lab_orders(status);

CREATE INDEX idx_imaging_orders_patient ON imaging_orders(patient_id);
CREATE INDEX idx_imaging_orders_prescriber ON imaging_orders(prescriber_id);
CREATE INDEX idx_imaging_orders_status ON imaging_orders(status);
