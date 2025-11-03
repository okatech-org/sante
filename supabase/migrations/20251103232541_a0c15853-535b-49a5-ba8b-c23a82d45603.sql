-- Ajouter les politiques RLS pour la gestion des pharmacies par le super admin

-- Policy pour permettre au super admin de voir toutes les pharmacies
CREATE POLICY "Super admin can view all pharmacies"
ON public.pharmacies
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'::app_role
  )
);

-- Policy pour permettre au super admin de mettre à jour toutes les pharmacies
CREATE POLICY "Super admin can update all pharmacies"
ON public.pharmacies
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'::app_role
  )
);

-- Policy pour permettre au super admin d'insérer des pharmacies
CREATE POLICY "Super admin can insert pharmacies"
ON public.pharmacies
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'::app_role
  )
);

-- Policy pour permettre au super admin de supprimer des pharmacies
CREATE POLICY "Super admin can delete pharmacies"
ON public.pharmacies
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'::app_role
  )
);