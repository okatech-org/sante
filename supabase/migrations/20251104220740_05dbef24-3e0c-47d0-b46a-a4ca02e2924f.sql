-- Supprimer l'ancienne contrainte CHECK sur statut
ALTER TABLE medicaments 
DROP CONSTRAINT IF EXISTS medicaments_statut_check;

-- Ajouter une nouvelle contrainte CHECK acceptant 'actif' et 'inactif'
ALTER TABLE medicaments 
ADD CONSTRAINT medicaments_statut_check 
CHECK (statut IN ('actif', 'inactif'));