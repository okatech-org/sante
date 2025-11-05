-- Créer une contrainte unique sur (raison_sociale, ville) pour permettre l'upsert
-- Cela évite les doublons d'établissements avec le même nom dans la même ville
ALTER TABLE public.establishments 
ADD CONSTRAINT establishments_raison_sociale_ville_key 
UNIQUE (raison_sociale, ville);