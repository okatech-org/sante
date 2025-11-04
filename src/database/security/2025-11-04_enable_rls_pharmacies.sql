-- Enable RLS on pharmacies and allow public read-only access
-- Safe migration: preserves existing public read behavior while securing writes

DO $$
BEGIN
  -- Enable RLS if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='pharmacies'
  ) THEN
    RAISE NOTICE 'Table public.pharmacies not found - skipping';
  ELSE
    EXECUTE 'ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY';
  END IF;
END$$;

-- Create a permissive SELECT policy for anon+authenticated (public directory use case)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pharmacies' AND policyname='pharmacies_public_read'
  ) THEN
    CREATE POLICY pharmacies_public_read ON public.pharmacies
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END$$;

-- Deny writes by default (no insert/update/delete policies provided)
-- If write access is needed for service role only, create explicit policies bound to role.


