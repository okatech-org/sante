-- Restore privileges for authenticated users; RLS will still enforce super_admin access
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO authenticated;

-- Keep anon locked down (no direct access)
REVOKE ALL ON public.system_settings FROM anon;

-- Note: Access remains restricted by RLS policies:
--  - Only super_admin can SELECT/INSERT/UPDATE/DELETE
--  - See policies defined in 20251003062917_cbb5524c-05b2-4e74-94da-06be2448dfa6.sql

