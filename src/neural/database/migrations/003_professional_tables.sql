-- ============================================
-- TABLES PROFESSIONNELS MÉDICAUX - SANTE.GA
-- ============================================

-- Table profils professionnels médicaux
CREATE TABLE IF NOT EXISTS profiles_professional (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Informations personnelles
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  specialty VARCHAR(100), -- 'general', 'cardiologist', 'dermatologist', etc.
  sub_specialty VARCHAR(100),
  
  -- Informations professionnelles
  license_number VARCHAR(100) UNIQUE NOT NULL, -- Numéro CNOM
  license_verified BOOLEAN DEFAULT false,
  years_experience INTEGER,
  
  -- Contact
  phone VARCHAR(20),
  office_address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  
  -- Pratique
  accepts_teleconsultation BOOLEAN DEFAULT false,
  consultation_price INTEGER, -- FCFA
  teleconsultation_price INTEGER,
  cnamgs_price INTEGER, -- Prix conventionné CNAMGS
  
  -- Disponibilité
  working_hours JSONB, -- {"monday": {"start": "08:00", "end": "18:00"}, ...}
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  
  FOREIGN KEY (user_id) REFERENCES user_roles(user_id) ON DELETE CASCADE
);

-- Table créneaux disponibilité
CREATE TABLE IF NOT EXISTS professional_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID NOT NULL,
  
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration INTEGER DEFAULT 30, -- minutes
  consultation_type VARCHAR(50), -- 'in_person', 'teleconsultation', 'both'
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (professional_id) REFERENCES profiles_professional(id) ON DELETE CASCADE
);

-- Table établissements
CREATE TABLE IF NOT EXISTS profiles_establishment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Informations établissement
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'hospital', 'clinic', 'health_center'
  registration_number VARCHAR(100) UNIQUE,
  
  -- Contact
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  
  -- Services
  emergency_available BOOLEAN DEFAULT false,
  services JSONB, -- Liste des services disponibles
  
  -- Horaires
  opening_hours JSONB,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  FOREIGN KEY (user_id) REFERENCES user_roles(user_id) ON DELETE CASCADE
);

-- Table pharmacies
CREATE TABLE IF NOT EXISTS profiles_pharmacy (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Informations pharmacie
  name VARCHAR(200) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  
  -- Contact
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  
  -- Services
  delivery_available BOOLEAN DEFAULT false,
  night_service BOOLEAN DEFAULT false,
  
  -- Horaires
  opening_hours JSONB,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (user_id) REFERENCES user_roles(user_id) ON DELETE CASCADE
);

-- Table laboratoires
CREATE TABLE IF NOT EXISTS profiles_laboratory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Informations laboratoire
  name VARCHAR(200) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  
  -- Contact
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  
  -- Services
  home_sampling BOOLEAN DEFAULT false,
  test_types JSONB, -- Types d'analyses disponibles
  
  -- Horaires
  opening_hours JSONB,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (user_id) REFERENCES user_roles(user_id) ON DELETE CASCADE
);

-- Table centres d'imagerie
CREATE TABLE IF NOT EXISTS profiles_imaging_center (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Informations centre
  name VARCHAR(200) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  
  -- Contact
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  
  -- Équipements
  equipment JSONB, -- Liste des équipements (scanner, IRM, etc.)
  
  -- Horaires
  opening_hours JSONB,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (user_id) REFERENCES user_roles(user_id) ON DELETE CASCADE
);

-- Table administrateurs
CREATE TABLE IF NOT EXISTS profiles_admin (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Informations personnelles
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  
  -- Contact
  phone VARCHAR(20),
  email VARCHAR(100),
  
  -- Rôle
  admin_level VARCHAR(50), -- 'establishment', 'regional', 'national'
  establishment_id UUID, -- Si admin d'établissement
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (user_id) REFERENCES user_roles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (establishment_id) REFERENCES profiles_establishment(id)
);

-- Index
CREATE INDEX idx_professional_user_id ON profiles_professional(user_id);
CREATE INDEX idx_professional_specialty ON profiles_professional(specialty);
CREATE INDEX idx_professional_city ON profiles_professional(city);
CREATE INDEX idx_availability_professional ON professional_availability(professional_id);

CREATE INDEX idx_establishment_user_id ON profiles_establishment(user_id);
CREATE INDEX idx_establishment_city ON profiles_establishment(city);

CREATE INDEX idx_pharmacy_user_id ON profiles_pharmacy(user_id);
CREATE INDEX idx_pharmacy_city ON profiles_pharmacy(city);

CREATE INDEX idx_laboratory_user_id ON profiles_laboratory(user_id);
CREATE INDEX idx_imaging_center_user_id ON profiles_imaging_center(user_id);
CREATE INDEX idx_admin_user_id ON profiles_admin(user_id);
