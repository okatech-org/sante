-- 1) Ensure trigger on auth.users creates profile and assigns patient role
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2) Backfill missing profiles from existing users
INSERT INTO public.profiles (id, full_name, email, phone)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'full_name', 'Utilisateur'),
       u.email,
       COALESCE(u.raw_user_meta_data->>'phone', '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- 3) Backfill 'patient' role for users with no roles
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'patient'::app_role
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE r.user_id IS NULL;

-- 4) Fix RLS policies to be PERMISSIVE so users can read their own rows
-- Profiles SELECT policies
DROP POLICY IF EXISTS "Super admins and admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (has_any_role(auth.uid(), ARRAY['super_admin'::app_role, 'admin'::app_role]));

-- user_roles SELECT policies
DROP POLICY IF EXISTS "Admins can view non-super-admin roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view non-super-admin roles"
ON public.user_roles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin') AND role <> 'super_admin');

CREATE POLICY "Super admins can view all user roles"
ON public.user_roles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));