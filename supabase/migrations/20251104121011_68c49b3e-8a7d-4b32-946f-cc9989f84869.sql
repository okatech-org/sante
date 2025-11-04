-- Migration: Ajout de la colonne slug pour les pharmacies
-- Date: 2025-11-04

-- 1. Ajouter la colonne slug (nullable au début)
ALTER TABLE public.pharmacies 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Fonction pour générer un slug unique
CREATE OR REPLACE FUNCTION public.generate_pharmacy_slug(pharmacy_name TEXT, pharmacy_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Nettoyer et normaliser le nom
  base_slug := lower(trim(pharmacy_name));
  
  -- Remplacer les caractères spéciaux et accents
  base_slug := translate(base_slug,
    'àâäæçéèêëïîôöùûüÿœ ''',
    'aaaaaceeeeiioouuuyoe--');
  
  -- Remplacer les espaces et caractères non-alphanumériques par des tirets
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  
  -- Supprimer les tirets en début/fin
  base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g');
  
  -- Limiter la longueur à 100 caractères
  base_slug := substring(base_slug from 1 for 100);
  
  -- Vérifier l'unicité et ajouter un suffixe si nécessaire
  final_slug := base_slug;
  
  WHILE EXISTS (
    SELECT 1 FROM public.pharmacies 
    WHERE slug = final_slug 
    AND id != pharmacy_id
  ) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- 3. Générer les slugs pour les pharmacies existantes
UPDATE public.pharmacies
SET slug = public.generate_pharmacy_slug(nom_commercial, id)
WHERE slug IS NULL;

-- 4. Rendre la colonne NOT NULL maintenant qu'elle est remplie
ALTER TABLE public.pharmacies
ALTER COLUMN slug SET NOT NULL;

-- 5. Créer un index unique sur le slug
CREATE UNIQUE INDEX IF NOT EXISTS pharmacies_slug_key 
ON public.pharmacies(slug);

-- 6. Fonction trigger pour auto-générer le slug
CREATE OR REPLACE FUNCTION public.auto_generate_pharmacy_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Si le slug n'est pas fourni ou si le nom commercial a changé
  IF NEW.slug IS NULL OR (TG_OP = 'UPDATE' AND NEW.nom_commercial != OLD.nom_commercial) THEN
    NEW.slug := public.generate_pharmacy_slug(NEW.nom_commercial, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Créer le trigger
DROP TRIGGER IF EXISTS trigger_auto_generate_pharmacy_slug ON public.pharmacies;
CREATE TRIGGER trigger_auto_generate_pharmacy_slug
  BEFORE INSERT OR UPDATE ON public.pharmacies
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_pharmacy_slug();

-- 8. Commentaires pour documentation
COMMENT ON COLUMN public.pharmacies.slug IS 'URL-friendly unique identifier for pharmacy (auto-generated from nom_commercial)';
COMMENT ON FUNCTION public.generate_pharmacy_slug IS 'Generate a unique URL-friendly slug from pharmacy name';
COMMENT ON FUNCTION public.auto_generate_pharmacy_slug IS 'Trigger function to auto-generate pharmacy slug on insert/update';