-- Add birth_place column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS birth_place TEXT;

COMMENT ON COLUMN public.profiles.birth_place IS 'User birth place';