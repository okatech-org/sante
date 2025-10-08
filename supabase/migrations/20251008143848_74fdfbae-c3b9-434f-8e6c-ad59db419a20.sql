
-- SYSTÈME PROFESSIONNELS DE SANTÉ - GABON

-- 1. TYPES ÉNUMÉRÉS

CREATE TYPE public.professional_type AS ENUM (
  'medecin_generaliste',
  'medecin_specialiste', 
  'infirmier',
  'ipa',
  'dentiste',
  'sage_femme',
  'pharmacien',
  'psychologue',
  'kinesitherapeute'
);

CREATE TYPE public.professional_status AS ENUM (
  'en_validation',
  'actif',
  'suspendu',
  'inactif',
  'rejete'
);

CREATE TYPE public.practice_location_type AS ENUM (
  'cabinet_prive',
  'hopital_public',
  'clinique_privee',
  'centre_sante',
  'domicile'
);

CREATE TYPE public.consultation_type_enum AS ENUM (
  'cabinet',
  'teleconsultation',
  'visite_domicile',
  'urgence'
);

CREATE TYPE public.convention_status AS ENUM (
  'non_conventionne',
  'en_cours',
  'conventionne',
  'suspendu',
  'expire'
);

-- 2. TABLE PROFESSIONNELS

CREATE TABLE public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  professional_type public.professional_type NOT NULL,
  status public.professional_status NOT NULL DEFAULT 'en_validation',
  
  numero_ordre TEXT,
  title TEXT CHECK (title IN ('Dr', 'Pr', 'M', 'Mme')),
  
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_phone TEXT,
  emergency_phone TEXT,
  
  birth_date DATE,
  nationality TEXT,
  gender TEXT CHECK (gender IN ('M', 'F')),
  
  photo_url TEXT,
  
  verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  documents_verified BOOLEAN DEFAULT FALSE,
  missing_documents TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_numero_ordre CHECK (
    (professional_type IN ('medecin_generaliste', 'medecin_specialiste') AND numero_ordre IS NOT NULL)
    OR professional_type NOT IN ('medecin_generaliste', 'medecin_specialiste')
  )
);

CREATE INDEX idx_professionals_user_id ON public.professionals(user_id);
CREATE INDEX idx_professionals_type ON public.professionals(professional_type);
CREATE INDEX idx_professionals_status ON public.professionals(status);
CREATE INDEX idx_professionals_numero_ordre ON public.professionals(numero_ordre) WHERE numero_ordre IS NOT NULL;

-- 3. TABLE DIPLÔMES

CREATE TABLE public.professional_diplomas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL CHECK (length(btrim(title)) >= 3 AND length(title) <= 200),
  institution TEXT NOT NULL CHECK (length(btrim(institution)) >= 2 AND length(institution) <= 200),
  country TEXT NOT NULL,
  year_obtained INTEGER NOT NULL CHECK (year_obtained >= 1950 AND year_obtained <= EXTRACT(YEAR FROM CURRENT_DATE)),
  
  specialty TEXT,
  
  document_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verification_status TEXT DEFAULT 'en_cours' CHECK (verification_status IN ('en_cours', 'valide', 'rejete')),
  verification_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_diplomas_professional ON public.professional_diplomas(professional_id);

-- 4. TABLE FORMATIONS

CREATE TABLE public.professional_trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL CHECK (length(btrim(title)) >= 3 AND length(title) <= 200),
  organizer TEXT NOT NULL,
  date DATE NOT NULL,
  duration_hours INTEGER,
  certificate_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_trainings_professional ON public.professional_trainings(professional_id);

-- 5. TABLE LIEUX D'EXERCICE

CREATE TABLE public.practice_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  
  location_type public.practice_location_type NOT NULL,
  name TEXT NOT NULL CHECK (length(btrim(name)) >= 2 AND length(name) <= 200),
  
  quartier TEXT,
  arrondissement TEXT,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  address TEXT NOT NULL CHECK (length(btrim(address)) >= 5 AND length(address) <= 300),
  
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  geographical_landmark TEXT,
  
  phone TEXT,
  email TEXT,
  
  is_primary BOOLEAN DEFAULT FALSE,
  
  opening_hours JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_coordinates CHECK (
    (latitude IS NULL AND longitude IS NULL) OR
    (latitude IS NOT NULL AND longitude IS NOT NULL AND
     latitude >= -90 AND latitude <= 90 AND
     longitude >= -180 AND longitude <= 180)
  )
);

CREATE INDEX idx_locations_professional ON public.practice_locations(professional_id);
CREATE INDEX idx_locations_province ON public.practice_locations(province);
CREATE INDEX idx_locations_primary ON public.practice_locations(is_primary) WHERE is_primary = TRUE;

-- 6. TABLE SERVICES ET TARIFS

CREATE TABLE public.professional_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  
  service_type public.consultation_type_enum NOT NULL,
  service_name TEXT NOT NULL,
  
  normal_price INTEGER NOT NULL CHECK (normal_price >= 0 AND normal_price <= 1000000),
  conventional_price INTEGER CHECK (conventional_price >= 0 AND conventional_price <= normal_price),
  
  duration_minutes INTEGER NOT NULL DEFAULT 30 CHECK (duration_minutes > 0 AND duration_minutes <= 480),
  
  available BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_services_professional ON public.professional_services(professional_id);

-- 7. TABLE CONVENTIONNEMENTS

CREATE TABLE public.professional_conventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  
  organization TEXT NOT NULL CHECK (organization IN ('CNAMGS', 'CNSS')),
  
  status public.convention_status NOT NULL DEFAULT 'non_conventionne',
  convention_number TEXT,
  
  start_date DATE,
  end_date DATE,
  
  tiers_payant_enabled BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_professional_org UNIQUE(professional_id, organization),
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_conventions_professional ON public.professional_conventions(professional_id);
CREATE INDEX idx_conventions_cnamgs ON public.professional_conventions(organization, status);

-- 8. TABLE DISPONIBILITÉS

CREATE TABLE public.professional_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  
  time_slots JSONB NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_professional_day UNIQUE(professional_id, day_of_week)
);

CREATE INDEX idx_availability_professional ON public.professional_availability(professional_id);

-- 9. TABLE CONGÉS

CREATE TABLE public.professional_leaves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT CHECK (length(reason) <= 500),
  
  replacement_professional_id UUID REFERENCES public.professionals(id),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_leave_dates CHECK (end_date >= start_date),
  CONSTRAINT no_self_replacement CHECK (professional_id != replacement_professional_id)
);

CREATE INDEX idx_leaves_professional ON public.professional_leaves(professional_id);
CREATE INDEX idx_leaves_dates ON public.professional_leaves(start_date, end_date);

-- 10. TABLE STATISTIQUES

CREATE TABLE public.professional_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  
  period_month INTEGER NOT NULL CHECK (period_month >= 1 AND period_month <= 12),
  period_year INTEGER NOT NULL CHECK (period_year >= 2020 AND period_year <= 2100),
  
  total_consultations INTEGER DEFAULT 0 CHECK (total_consultations >= 0),
  teleconsultations INTEGER DEFAULT 0 CHECK (teleconsultations >= 0),
  home_visits INTEGER DEFAULT 0 CHECK (home_visits >= 0),
  
  total_revenue INTEGER DEFAULT 0 CHECK (total_revenue >= 0),
  cnamgs_revenue INTEGER DEFAULT 0 CHECK (cnamgs_revenue >= 0),
  cash_revenue INTEGER DEFAULT 0 CHECK (cash_revenue >= 0),
  mobile_money_revenue INTEGER DEFAULT 0 CHECK (mobile_money_revenue >= 0),
  
  average_rating NUMERIC(3,2) CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
  punctuality_rate INTEGER CHECK (punctuality_rate >= 0 AND punctuality_rate <= 100),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_professional_period UNIQUE(professional_id, period_month, period_year)
);

CREATE INDEX idx_statistics_professional ON public.professional_statistics(professional_id);
CREATE INDEX idx_statistics_period ON public.professional_statistics(period_year, period_month);

-- RLS POLICIES

ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can view their own profile"
  ON public.professionals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Professionals can update their own profile"
  ON public.professionals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all professionals"
  ON public.professionals FOR SELECT
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

CREATE POLICY "Admins can update all professionals"
  ON public.professionals FOR UPDATE
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

CREATE POLICY "Public can view verified professionals"
  ON public.professionals FOR SELECT
  USING (verified = TRUE AND status = 'actif');

ALTER TABLE public.professional_diplomas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can manage their diplomas"
  ON public.professional_diplomas FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = professional_diplomas.professional_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all diplomas"
  ON public.professional_diplomas FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

ALTER TABLE public.professional_trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can manage their trainings"
  ON public.professional_trainings FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = professional_trainings.professional_id
    AND user_id = auth.uid()
  ));

ALTER TABLE public.practice_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can manage their locations"
  ON public.practice_locations FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = practice_locations.professional_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Public can view active locations"
  ON public.practice_locations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = practice_locations.professional_id
    AND verified = TRUE
    AND status = 'actif'
  ));

ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can manage their services"
  ON public.professional_services FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = professional_services.professional_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Public can view available services"
  ON public.professional_services FOR SELECT
  USING (available = TRUE AND EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = professional_services.professional_id
    AND verified = TRUE
    AND status = 'actif'
  ));

ALTER TABLE public.professional_conventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can view their conventions"
  ON public.professional_conventions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = professional_conventions.professional_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage conventions"
  ON public.professional_conventions FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

ALTER TABLE public.professional_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can manage their availability"
  ON public.professional_availability FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = professional_availability.professional_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Public can view availability"
  ON public.professional_availability FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = professional_availability.professional_id
    AND verified = TRUE
    AND status = 'actif'
  ));

ALTER TABLE public.professional_leaves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can manage their leaves"
  ON public.professional_leaves FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = professional_leaves.professional_id
    AND user_id = auth.uid()
  ));

ALTER TABLE public.professional_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can view their statistics"
  ON public.professional_statistics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.professionals
    WHERE id = professional_statistics.professional_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all statistics"
  ON public.professional_statistics FOR SELECT
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'super_admin'::app_role]));

-- TRIGGERS

CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON public.professionals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diplomas_updated_at
  BEFORE UPDATE ON public.professional_diplomas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.practice_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.professional_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conventions_updated_at
  BEFORE UPDATE ON public.professional_conventions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON public.professional_availability
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_statistics_updated_at
  BEFORE UPDATE ON public.professional_statistics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
