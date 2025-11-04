-- Ajouter une contrainte UNIQUE sur code_cip pour éviter les doublons
-- D'abord, nettoyer les doublons existants en gardant le plus récent
DELETE FROM medicaments a USING medicaments b
WHERE a.id < b.id 
  AND a.code_cip = b.code_cip 
  AND a.code_cip IS NOT NULL;

-- Créer un index unique sur code_cip (permet l'upsert)
CREATE UNIQUE INDEX IF NOT EXISTS unique_medicaments_code_cip 
ON medicaments(code_cip) 
WHERE code_cip IS NOT NULL;