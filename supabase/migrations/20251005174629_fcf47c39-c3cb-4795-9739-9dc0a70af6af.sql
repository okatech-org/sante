-- Add user preferences columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_sms BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_push BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'private' CHECK (profile_visibility IN ('public', 'private', 'friends')),
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en')),
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;

-- Add comment to describe the columns
COMMENT ON COLUMN public.profiles.notification_email IS 'Enable email notifications';
COMMENT ON COLUMN public.profiles.notification_sms IS 'Enable SMS notifications';
COMMENT ON COLUMN public.profiles.notification_push IS 'Enable push notifications';
COMMENT ON COLUMN public.profiles.profile_visibility IS 'Profile visibility: public, private, or friends';
COMMENT ON COLUMN public.profiles.language IS 'User preferred language';
COMMENT ON COLUMN public.profiles.theme IS 'User preferred theme';
COMMENT ON COLUMN public.profiles.two_factor_enabled IS 'Whether 2FA is enabled for the user';