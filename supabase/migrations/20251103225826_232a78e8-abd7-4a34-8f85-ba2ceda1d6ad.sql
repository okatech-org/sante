-- Ajouter une policy temporaire pour permettre l'accès aux établissements
-- pour les utilisateurs authentifiés en attendant de configurer les rôles correctement

DROP POLICY IF EXISTS "Authenticated users can view establishments" ON public.establishments;

CREATE POLICY "Authenticated users can view establishments"
ON public.establishments
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Également autoriser l'accès public en lecture seule pour les établissements actifs
DROP POLICY IF EXISTS "Public read access for active establishments" ON public.establishments;

CREATE POLICY "Public read access for active establishments"
ON public.establishments
FOR SELECT
USING (statut = 'actif');