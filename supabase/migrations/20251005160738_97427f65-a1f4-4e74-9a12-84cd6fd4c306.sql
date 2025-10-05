-- Ensure authenticated role can access table (RLS will still apply)
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;