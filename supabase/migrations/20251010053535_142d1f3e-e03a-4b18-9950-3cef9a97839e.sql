-- Add establishment account management fields
ALTER TABLE public.establishments 
ADD COLUMN IF NOT EXISTS account_claimed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS invitation_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES auth.users(id);

-- Create index for faster token lookup
CREATE INDEX IF NOT EXISTS idx_establishments_invitation_token ON public.establishments(invitation_token) WHERE invitation_token IS NOT NULL;

-- Add establishment role if not exists (using DO block to handle enum modification)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('patient', 'doctor', 'medical_staff', 'admin', 'super_admin', 'hospital', 'pharmacy', 'laboratory', 'establishment_admin');
  ELSE
    BEGIN
      ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'establishment_admin';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- Function to generate invitation token for establishment
CREATE OR REPLACE FUNCTION public.generate_establishment_invitation_token(_establishment_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _token TEXT;
BEGIN
  -- Verify caller is super_admin
  IF NOT has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Only super admins can generate invitation tokens';
  END IF;
  
  -- Generate a secure random token
  _token := encode(gen_random_bytes(32), 'base64');
  
  -- Update establishment with token
  UPDATE public.establishments
  SET invitation_token = _token,
      updated_at = now()
  WHERE id = _establishment_id
    AND account_claimed = false;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Establishment not found or already claimed';
  END IF;
  
  RETURN _token;
END;
$$;

-- Function to claim establishment account
CREATE OR REPLACE FUNCTION public.claim_establishment_account(_token TEXT, _user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _establishment_id UUID;
BEGIN
  -- Find establishment by token
  SELECT id INTO _establishment_id
  FROM public.establishments
  WHERE invitation_token = _token
    AND account_claimed = false;
  
  IF _establishment_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or already used invitation token';
  END IF;
  
  -- Mark establishment as claimed
  UPDATE public.establishments
  SET account_claimed = true,
      claimed_at = now(),
      claimed_by = _user_id,
      invitation_token = NULL
  WHERE id = _establishment_id;
  
  -- Add user to establishment_users
  INSERT INTO public.establishment_users (user_id, establishment_id, role, actif)
  VALUES (_user_id, _establishment_id, 'administrateur', true)
  ON CONFLICT DO NOTHING;
  
  -- Assign establishment_admin role to user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'establishment_admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN _establishment_id;
END;
$$;

-- Generate invitation tokens for all unclaimed establishments
DO $$
DECLARE
  _establishment RECORD;
BEGIN
  FOR _establishment IN 
    SELECT id FROM public.establishments WHERE account_claimed = false
  LOOP
    UPDATE public.establishments
    SET invitation_token = encode(gen_random_bytes(32), 'base64')
    WHERE id = _establishment.id;
  END LOOP;
END $$;