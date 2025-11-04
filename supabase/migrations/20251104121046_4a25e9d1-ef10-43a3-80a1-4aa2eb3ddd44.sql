-- Fix: Sécuriser les fonctions avec search_path
-- Date: 2025-11-04

-- 1. Recréer la fonction generate_pharmacy_slug avec search_path sécurisé
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
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. Recréer la fonction auto_generate_pharmacy_slug avec search_path sécurisé
CREATE OR REPLACE FUNCTION public.auto_generate_pharmacy_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Si le slug n'est pas fourni ou si le nom commercial a changé
  IF NEW.slug IS NULL OR (TG_OP = 'UPDATE' AND NEW.nom_commercial != OLD.nom_commercial) THEN
    NEW.slug := public.generate_pharmacy_slug(NEW.nom_commercial, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;