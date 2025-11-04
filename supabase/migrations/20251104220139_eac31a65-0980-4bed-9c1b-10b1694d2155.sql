-- Supprimer l'index unique partiel qui ne fonctionne pas pour ON CONFLICT
DROP INDEX IF EXISTS unique_medicaments_code_cip;

-- Créer une vraie contrainte UNIQUE sur code_cip (requis pour ON CONFLICT)
ALTER TABLE medicaments 
ADD CONSTRAINT unique_medicaments_code_cip UNIQUE (code_cip);