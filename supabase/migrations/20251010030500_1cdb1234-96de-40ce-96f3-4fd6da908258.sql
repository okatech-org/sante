-- Table pour stocker les établissements de santé depuis OpenStreetMap
CREATE TABLE IF NOT EXISTS public.osm_health_providers (
  id TEXT PRIMARY KEY,
  osm_id BIGINT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  nom TEXT NOT NULL,
  province TEXT NOT NULL,
  ville TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  adresse_descriptive TEXT,
  telephones TEXT[],
  email TEXT,
  site_web TEXT,
  horaires TEXT,
  services TEXT[],
  specialites TEXT[],
  ouvert_24_7 BOOLEAN DEFAULT false,
  cnamgs BOOLEAN DEFAULT false,
  cnss BOOLEAN DEFAULT false,
  secteur TEXT,
  statut_operationnel TEXT DEFAULT 'operationnel',
  nombre_lits INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_osm_providers_type ON public.osm_health_providers(type);
CREATE INDEX IF NOT EXISTS idx_osm_providers_province ON public.osm_health_providers(province);
CREATE INDEX IF NOT EXISTS idx_osm_providers_ville ON public.osm_health_providers(ville);
CREATE INDEX IF NOT EXISTS idx_osm_providers_coords ON public.osm_health_providers(latitude, longitude);

-- RLS policies pour permettre la lecture publique
ALTER TABLE public.osm_health_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "OSM health providers are viewable by everyone"
  ON public.osm_health_providers
  FOR SELECT
  USING (true);

-- Seuls les super admins peuvent insérer/mettre à jour
CREATE POLICY "Only super admins can insert OSM providers"
  ON public.osm_health_providers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Only super admins can update OSM providers"
  ON public.osm_health_providers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Only super admins can delete OSM providers"
  ON public.osm_health_providers
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );