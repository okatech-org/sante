-- Fix RLS recursion and data visibility for establishments and establishment_users
-- 1) Replace recursive policy on establishment_users with function-based check
DROP POLICY IF EXISTS "Establishment admins can manage their users" ON public.establishment_users;

CREATE POLICY "Establishment admins can manage their users"
ON public.establishment_users
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (public.is_establishment_admin(auth.uid(), establishment_id))
WITH CHECK (public.is_establishment_admin(auth.uid(), establishment_id));

-- 2) Allow users to view their own memberships (needed by other policies that subquery establishment_users)
DROP POLICY IF EXISTS "Users can view their establishment membership" ON public.establishment_users;

CREATE POLICY "Users can view their establishment membership"
ON public.establishment_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 3) Optional: ensure public policy on establishments remains permissive; keep existing, no change.
-- Note: We don't change establishments policies here; fixing establishment_users recursion resolves 42P17 when establishments policy subqueries establishment_users.
