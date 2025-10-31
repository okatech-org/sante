-- ============================================
-- FONCTIONS RPC OPTIMISÉES
-- ============================================

-- 1. Récupérer le contexte complet d'un professionnel
CREATE OR REPLACE FUNCTION public.get_professional_context(_user_id uuid, _establishment_id uuid)
RETURNS TABLE (
  professional_id uuid,
  professional_name text,
  professional_email text,
  professional_phone text,
  professional_photo_url text,
  professional_specialization text,
  professional_matricule text,
  establishment_id uuid,
  establishment_name text,
  role_in_establishment text,
  department text,
  job_position text,
  matricule text,
  is_admin boolean,
  is_department_head boolean,
  permissions text[],
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.email,
    p.phone,
    p.photo_url,
    p.specialization,
    p.numero_ordre,
    e.id,
    e.raison_sociale,
    es.role_in_establishment,
    es.department,
    es.job_position,
    es.matricule,
    es.is_admin,
    es.is_department_head,
    es.permissions,
    es.status
  FROM public.professionals p
  INNER JOIN public.establishment_staff es ON es.professional_id = p.id
  INNER JOIN public.establishments e ON e.id = es.establishment_id
  WHERE p.user_id = _user_id
    AND es.establishment_id = _establishment_id
    AND es.status = 'active';
$$;

-- 2. Récupérer tous les établissements d'un professionnel
CREATE OR REPLACE FUNCTION public.get_professional_establishments(_user_id uuid)
RETURNS TABLE (
  staff_id uuid,
  establishment_id uuid,
  establishment_name text,
  establishment_type text,
  role_in_establishment text,
  department text,
  job_position text,
  is_admin boolean,
  permissions text[],
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    es.id,
    e.id,
    e.raison_sociale,
    e.type_etablissement,
    es.role_in_establishment,
    es.department,
    es.job_position,
    es.is_admin,
    es.permissions,
    es.status
  FROM public.professionals p
  INNER JOIN public.establishment_staff es ON es.professional_id = p.id
  INNER JOIN public.establishments e ON e.id = es.establishment_id
  WHERE p.user_id = _user_id
    AND es.status = 'active'
  ORDER BY es.is_admin DESC, e.raison_sociale;
$$;

-- 3. Vérifier les permissions
CREATE OR REPLACE FUNCTION public.has_permission(
  _user_id uuid,
  _establishment_id uuid,
  _permission text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.professionals p
    INNER JOIN public.establishment_staff es ON es.professional_id = p.id
    WHERE p.user_id = _user_id
      AND es.establishment_id = _establishment_id
      AND es.status = 'active'
      AND (
        'all' = ANY(es.permissions) OR
        _permission = ANY(es.permissions)
      )
  );
$$;

-- 4. Commentaires de documentation
COMMENT ON FUNCTION public.get_professional_context IS 
'Récupère le contexte complet d''un professionnel dans un établissement spécifique';

COMMENT ON FUNCTION public.get_professional_establishments IS 
'Récupère tous les établissements où un professionnel est affilié';

COMMENT ON FUNCTION public.has_permission IS 
'Vérifie si un utilisateur a une permission spécifique dans un établissement';