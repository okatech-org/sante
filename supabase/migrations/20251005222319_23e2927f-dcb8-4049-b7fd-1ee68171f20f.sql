-- Remove the old conflicting gender constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_gender_check;

-- Ensure the correct constraint exists (if not already present)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_gender_valid' 
    AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_gender_valid 
    CHECK (gender IS NULL OR gender IN ('male', 'female', 'other', 'prefer_not_to_say'));
  END IF;
END $$;