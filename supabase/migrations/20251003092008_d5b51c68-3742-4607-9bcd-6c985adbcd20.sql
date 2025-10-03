-- Fix Critical Security Issue: Revoke public access to profiles table
-- This table contains sensitive patient information and should never be publicly accessible
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.profiles FROM authenticated;
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM authenticated;

-- Fix Critical Security Issue: Revoke public access to system_settings table
-- This table contains sensitive configuration data
REVOKE SELECT ON public.system_settings FROM anon;
REVOKE SELECT ON public.system_settings FROM authenticated;
REVOKE ALL ON public.system_settings FROM anon;
REVOKE ALL ON public.system_settings FROM authenticated;

-- Add server-side input validation constraints to profiles table
-- These constraints provide defense-in-depth against bypassed client validation

-- Email format validation
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_email_format 
CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Length constraints to prevent abuse
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_full_name_length 
CHECK (length(full_name) > 0 AND length(full_name) <= 200);

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_city_length 
CHECK (city IS NULL OR length(city) <= 100);

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_neighborhood_length 
CHECK (neighborhood IS NULL OR length(neighborhood) <= 100);

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_province_length 
CHECK (province IS NULL OR length(province) <= 100);

-- Gender validation (must be one of the valid values)
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_gender_valid 
CHECK (gender IS NULL OR gender IN ('male', 'female', 'other', 'prefer_not_to_say'));