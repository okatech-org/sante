-- Migration: Add slug support to pharmacies
-- Safe to run multiple times

-- 1) Extensions needed
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2) Slugify function (immutable)
CREATE OR REPLACE FUNCTION public.pharmacy_slugify(input text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT regexp_replace(
           regexp_replace(
             trim(lower(unaccent(coalesce($1, '')))),
             '\s+', '-', 'g'
           ),
           '[^a-z0-9-]', '', 'g'
         )
$$;

-- 3) Add slug column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pharmacies' AND column_name = 'slug'
  ) THEN
    ALTER TABLE public.pharmacies ADD COLUMN slug text;
  END IF;
END$$;

-- 4) Trigger function to maintain unique slug
CREATE OR REPLACE FUNCTION public.set_pharmacies_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base text;
  candidate text;
  suffix text;
BEGIN
  IF (TG_OP = 'INSERT') OR (NEW.nom_commercial IS DISTINCT FROM COALESCE(OLD.nom_commercial, '')) OR (NEW.slug IS NULL) THEN
    base := pharmacy_slugify(NEW.nom_commercial);
    IF base = '' OR base IS NULL THEN
      base := 'pharmacie-' || substr(NEW.id::text, 1, 8);
    END IF;
    candidate := base;
    -- Ensure uniqueness by appending a short id suffix when needed
    WHILE EXISTS (SELECT 1 FROM public.pharmacies p WHERE p.slug = candidate AND p.id <> NEW.id) LOOP
      candidate := base || '-' || substr(NEW.id::text, 1, 6);
    END LOOP;
    NEW.slug := candidate;
  END IF;
  RETURN NEW;
END
$$;

-- 5) Create trigger (fires on any insert or update)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_pharmacies_set_slug'
  ) THEN
    CREATE TRIGGER trg_pharmacies_set_slug
    BEFORE INSERT OR UPDATE ON public.pharmacies
    FOR EACH ROW
    EXECUTE FUNCTION public.set_pharmacies_slug();
  END IF;
END$$;

-- 6) Backfill existing rows
UPDATE public.pharmacies SET slug = NULL;
-- Force trigger to recompute
UPDATE public.pharmacies SET nom_commercial = nom_commercial;

-- 7) Unique index
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'pharmacies_slug_key'
  ) THEN
    CREATE UNIQUE INDEX pharmacies_slug_key ON public.pharmacies (slug);
  END IF;
END$$;


