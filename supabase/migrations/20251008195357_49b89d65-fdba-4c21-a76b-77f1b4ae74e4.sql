-- Create enum types for establishments
CREATE TYPE establishment_type AS ENUM (
  'chu',
  'chr',
  'polyclinique',
  'clinique',
  'centre_medical',
  'hopital_departemental',
  'hopital_confessionnel'
);

CREATE TYPE establishment_sector AS ENUM (
  'public',
  'prive',
  'confessionnel',
  'militaire',
  'parapublic'
);

CREATE TYPE establishment_status AS ENUM (
  'actif',
  'suspendu',
  'en_maintenance',
  'en_validation'
);

-- Main establishments table
CREATE TABLE IF NOT EXISTS public.establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raison_sociale TEXT NOT NULL,
  numero_rccm TEXT,
  numero_autorisation TEXT NOT NULL,
  type_etablissement establishment_type NOT NULL,
  secteur establishment_sector NOT NULL,
  
  -- Legal information
  forme_juridique TEXT,
  capital BIGINT,
  directeur_general_nom TEXT,
  directeur_general_telephone TEXT,
  directeur_general_email TEXT,
  directeur_medical_nom TEXT,
  directeur_medical_numero_ordre TEXT,
  
  -- Location
  adresse_rue TEXT,
  adresse_quartier TEXT,
  adresse_arrondissement TEXT,
  ville TEXT NOT NULL,
  province TEXT NOT NULL,
  code_postal TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  repere_geographique TEXT,
  
  -- Contact
  telephone_standard TEXT,
  telephone_urgences TEXT,
  email TEXT,
  site_web TEXT,
  whatsapp_business TEXT,
  
  -- Capacity
  nombre_lits_total INTEGER DEFAULT 0,
  nombre_blocs_operatoires INTEGER DEFAULT 0,
  nombre_salles_consultation INTEGER DEFAULT 0,
  service_urgences_actif BOOLEAN DEFAULT false,
  
  -- CNAMGS Integration
  cnamgs_conventionne BOOLEAN DEFAULT false,
  cnamgs_numero_convention TEXT,
  cnamgs_date_debut DATE,
  cnamgs_date_fin DATE,
  cnamgs_tiers_payant_actif BOOLEAN DEFAULT false,
  
  -- Statistics
  taux_occupation NUMERIC,
  satisfaction_moyenne NUMERIC,
  nombre_avis INTEGER DEFAULT 0,
  
  -- System
  statut establishment_status DEFAULT 'en_validation',
  date_inscription DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Establishment services table
CREATE TABLE IF NOT EXISTS public.establishment_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID REFERENCES public.establishments(id) ON DELETE CASCADE NOT NULL,
  nom TEXT NOT NULL,
  code TEXT NOT NULL,
  responsable_nom TEXT,
  actif BOOLEAN DEFAULT true,
  
  -- Capacity
  nombre_lits INTEGER DEFAULT 0,
  nombre_medecins INTEGER DEFAULT 0,
  nombre_infirmiers INTEGER DEFAULT 0,
  
  -- Horaires (stored as JSON)
  horaires JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Establishment equipment table (plateaux techniques)
CREATE TABLE IF NOT EXISTS public.establishment_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID REFERENCES public.establishments(id) ON DELETE CASCADE NOT NULL,
  categorie TEXT NOT NULL, -- 'laboratoire', 'imagerie', 'pharmacie', 'autre'
  type_equipement TEXT NOT NULL,
  marque TEXT,
  modele TEXT,
  annee_installation INTEGER,
  disponible_24h BOOLEAN DEFAULT false,
  etat_fonctionnement TEXT DEFAULT 'optimal', -- 'optimal', 'degrade', 'panne'
  derniere_maintenance DATE,
  prochaine_maintenance DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Establishment users (multi-user management)
CREATE TABLE IF NOT EXISTS public.establishment_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID REFERENCES public.establishments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL, -- 'administrateur', 'directeur_medical', 'chef_service', 'admission', 'pharmacien'
  permissions JSONB,
  actif BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(establishment_id, user_id)
);

-- Establishment statistics (daily tracking)
CREATE TABLE IF NOT EXISTS public.establishment_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID REFERENCES public.establishments(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  
  -- Activity
  consultations_jour INTEGER DEFAULT 0,
  hospitalisations_jour INTEGER DEFAULT 0,
  urgences_jour INTEGER DEFAULT 0,
  operations_jour INTEGER DEFAULT 0,
  
  -- Financial
  recettes_jour BIGINT DEFAULT 0,
  recettes_especes BIGINT DEFAULT 0,
  recettes_cnamgs BIGINT DEFAULT 0,
  recettes_assurances BIGINT DEFAULT 0,
  
  -- Occupancy
  lits_occupes INTEGER DEFAULT 0,
  taux_occupation NUMERIC,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(establishment_id, date)
);

-- Enable RLS
ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.establishment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.establishment_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.establishment_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.establishment_statistics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for establishments
CREATE POLICY "Super admins can manage all establishments"
ON public.establishments
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can manage all establishments"
ON public.establishments
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Establishment users can view their establishments"
ON public.establishments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.establishment_users
    WHERE establishment_id = establishments.id
    AND user_id = auth.uid()
    AND actif = true
  )
);

CREATE POLICY "Public can view active establishments"
ON public.establishments
FOR SELECT
TO authenticated
USING (statut = 'actif');

-- RLS Policies for establishment_services
CREATE POLICY "Admins can manage all services"
ON public.establishment_services
FOR ALL
TO authenticated
USING (
  has_any_role(auth.uid(), ARRAY['super_admin'::app_role, 'admin'::app_role])
);

CREATE POLICY "Establishment users can manage their services"
ON public.establishment_services
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.establishment_users
    WHERE establishment_id = establishment_services.establishment_id
    AND user_id = auth.uid()
    AND actif = true
  )
);

-- RLS Policies for establishment_equipment
CREATE POLICY "Admins can manage all equipment"
ON public.establishment_equipment
FOR ALL
TO authenticated
USING (
  has_any_role(auth.uid(), ARRAY['super_admin'::app_role, 'admin'::app_role])
);

CREATE POLICY "Establishment users can manage their equipment"
ON public.establishment_equipment
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.establishment_users
    WHERE establishment_id = establishment_equipment.establishment_id
    AND user_id = auth.uid()
    AND actif = true
  )
);

-- RLS Policies for establishment_users
CREATE POLICY "Admins can manage all users"
ON public.establishment_users
FOR ALL
TO authenticated
USING (
  has_any_role(auth.uid(), ARRAY['super_admin'::app_role, 'admin'::app_role])
);

CREATE POLICY "Establishment admins can manage their users"
ON public.establishment_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.establishment_users eu
    WHERE eu.establishment_id = establishment_users.establishment_id
    AND eu.user_id = auth.uid()
    AND eu.role = 'administrateur'
    AND eu.actif = true
  )
);

-- RLS Policies for establishment_statistics
CREATE POLICY "Admins can view all statistics"
ON public.establishment_statistics
FOR SELECT
TO authenticated
USING (
  has_any_role(auth.uid(), ARRAY['super_admin'::app_role, 'admin'::app_role])
);

CREATE POLICY "Establishment users can view their statistics"
ON public.establishment_statistics
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.establishment_users
    WHERE establishment_id = establishment_statistics.establishment_id
    AND user_id = auth.uid()
    AND actif = true
  )
);

-- Triggers for updated_at
CREATE TRIGGER update_establishments_updated_at
BEFORE UPDATE ON public.establishments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_establishment_services_updated_at
BEFORE UPDATE ON public.establishment_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_establishment_equipment_updated_at
BEFORE UPDATE ON public.establishment_equipment
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_establishment_users_updated_at
BEFORE UPDATE ON public.establishment_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();