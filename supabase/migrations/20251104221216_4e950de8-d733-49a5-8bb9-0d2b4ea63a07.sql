-- Supprimer l'ancienne politique restrictive
DROP POLICY IF EXISTS "Médicaments actifs visibles par tous" ON medicaments;

-- Nouvelle politique : tous peuvent voir tous les médicaments
CREATE POLICY "Tous les médicaments visibles par tous"
ON medicaments
FOR SELECT
USING (true);

-- Les super admins peuvent toujours gérer
DROP POLICY IF EXISTS "Super admins peuvent gérer médicaments" ON medicaments;

CREATE POLICY "Super admins peuvent gérer médicaments"
ON medicaments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'super_admin'::app_role
  )
);