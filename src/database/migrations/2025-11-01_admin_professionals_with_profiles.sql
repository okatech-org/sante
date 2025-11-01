-- Fonction & sécurité: récupération complète des professionnels avec profils
-- Exécuter dans Supabase (SQL editor ou migrations) avant d'utiliser côté front

-- Helper: détermine si le JWT courant correspond à un super admin (adaptable selon vos claims)
create or replace function public.is_super_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() ->> 'role') = 'super_admin'
    or (auth.jwt() ->> 'is_super_admin') = 'true'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'super_admin'
  , false);
$$;

-- RPC sécurisée pour retourner les professionnels avec données de profil
create or replace function public.admin_get_professionals_with_profiles()
returns table (
  id uuid,
  user_id uuid,
  profession_type text,
  specialization text,
  ordre_number text,
  ordre_verified boolean,
  created_at timestamptz,
  full_name text,
  email text,
  phone text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Autoriser uniquement les super-admins (via claims JWT)
  if not public.is_super_admin() then
    raise exception 'permission denied' using errcode = '42501';
  end if;

  return query
    select
      pp.id,
      pp.user_id,
      pp.profession_type,
      pp.specialization,
      pp.ordre_number,
      pp.ordre_verified,
      pp.created_at,
      pr.full_name,
      pr.email,
      pr.phone
    from public.professional_profiles pp
    join public.profiles pr on pr.id = pp.user_id
    order by pp.created_at desc;
end;
$$;

-- Droits d'exécution: comptes authentifiés uniquement (le contrôle fin est dans la fonction)
grant execute on function public.admin_get_professionals_with_profiles() to authenticated;


