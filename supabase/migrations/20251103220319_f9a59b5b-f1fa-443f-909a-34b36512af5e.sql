-- Fix security issues for pharmacy system

-- 1. Add missing RLS policies for pharmacie_employes
CREATE POLICY "Employés visibles par la pharmacie"
ON public.pharmacie_employes FOR SELECT
TO public
USING (
  est_actif = TRUE AND
  EXISTS (
    SELECT 1 FROM public.pharmacies p
    WHERE p.id = pharmacie_employes.pharmacie_id
    AND p.visible_plateforme = TRUE
    AND p.statut_verification = 'verifie'
  )
);

-- 2. Fix search_path for functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION update_geolocation()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geolocation = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER SET search_path = public;

-- 3. Move postgis extension to extensions schema if not already there
-- (This is a warning, not critical, postgis in public is acceptable for now)