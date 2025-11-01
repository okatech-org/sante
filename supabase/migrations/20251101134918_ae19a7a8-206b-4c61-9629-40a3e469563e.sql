-- Fix search_path for is_super_admin function
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() ->> 'role') = 'super_admin'
    or (auth.jwt() ->> 'is_super_admin') = 'true'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'super_admin'
  , false);
$$;