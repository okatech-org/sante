-- ================================================
-- Migration: Dépôt Pharmaceutique (Table Médicaments)
-- Description: Table référentiel des produits pharmaceutiques
-- ================================================

-- Création de la table medicaments
CREATE TABLE IF NOT EXISTS public.medicaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identification du médicament
  nom_commercial TEXT,
  dci TEXT, -- Dénomination Commune Internationale
  code_cip TEXT, -- Code Identifiant de Présentation
  code_atc TEXT, -- Classification Anatomique, Thérapeutique et Chimique
  
  -- Caractéristiques pharmaceutiques
  forme_pharmaceutique TEXT,
  dosage TEXT,
  conditionnement TEXT,
  voie_administration TEXT,
  
  -- Classification et catégorisation
  classe_therapeutique TEXT,
  famille_pharmacologique TEXT,
  est_generique BOOLEAN DEFAULT false,
  
  -- Réglementation
  necessite_ordonnance BOOLEAN DEFAULT false,
  substance_controlee BOOLEAN DEFAULT false,
  stupefiant BOOLEAN DEFAULT false,
  
  -- Tarification
  prix_moyen_pharmacie NUMERIC(10, 2),
  tarif_conventionne_cnamgs NUMERIC(10, 2),
  tarif_reference TEXT,
  
  -- Informations complémentaires
  laboratoire_fabricant TEXT,
  pays_origine TEXT,
  numero_amm TEXT, -- Autorisation de Mise sur le Marché
  date_amm DATE,
  
  -- Documentation
  notice_url TEXT,
  image_url TEXT,
  
  -- Métadonnées
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'suspendu', 'retire')),
  date_ajout TIMESTAMP WITH TIME ZONE DEFAULT now(),
  date_modification TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Indexation pour recherche
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('french', coalesce(nom_commercial, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(dci, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(classe_therapeutique, '')), 'C')
  ) STORED
);

-- Index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_medicaments_search ON public.medicaments USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_medicaments_nom_commercial ON public.medicaments (nom_commercial);
CREATE INDEX IF NOT EXISTS idx_medicaments_dci ON public.medicaments (dci);
CREATE INDEX IF NOT EXISTS idx_medicaments_forme ON public.medicaments (forme_pharmaceutique);
CREATE INDEX IF NOT EXISTS idx_medicaments_classe ON public.medicaments (classe_therapeutique);
CREATE INDEX IF NOT EXISTS idx_medicaments_statut ON public.medicaments (statut);

-- Fonction de recherche intelligente des médicaments
CREATE OR REPLACE FUNCTION public.search_medicaments(
  p_query TEXT,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  nom_commercial TEXT,
  dci TEXT,
  forme_pharmaceutique TEXT,
  dosage TEXT,
  tarif_conventionne_cnamgs NUMERIC,
  prix_moyen_pharmacie NUMERIC,
  necessite_ordonnance BOOLEAN,
  image_url TEXT,
  est_generique BOOLEAN,
  classe_therapeutique TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Si la requête est vide, retourner une liste par défaut
  IF p_query IS NULL OR trim(p_query) = '' THEN
    RETURN QUERY
    SELECT 
      m.id,
      m.nom_commercial,
      m.dci,
      m.forme_pharmaceutique,
      m.dosage,
      m.tarif_conventionne_cnamgs,
      m.prix_moyen_pharmacie,
      m.necessite_ordonnance,
      m.image_url,
      m.est_generique,
      m.classe_therapeutique
    FROM public.medicaments m
    WHERE m.statut = 'actif'
    ORDER BY m.nom_commercial
    LIMIT p_limit;
  ELSE
    -- Recherche avec poids et pertinence
    RETURN QUERY
    SELECT 
      m.id,
      m.nom_commercial,
      m.dci,
      m.forme_pharmaceutique,
      m.dosage,
      m.tarif_conventionne_cnamgs,
      m.prix_moyen_pharmacie,
      m.necessite_ordonnance,
      m.image_url,
      m.est_generique,
      m.classe_therapeutique
    FROM public.medicaments m
    WHERE 
      m.statut = 'actif'
      AND (
        m.search_vector @@ plainto_tsquery('french', p_query)
        OR m.nom_commercial ILIKE '%' || p_query || '%'
        OR m.dci ILIKE '%' || p_query || '%'
      )
    ORDER BY 
      ts_rank(m.search_vector, plainto_tsquery('french', p_query)) DESC,
      m.nom_commercial
    LIMIT p_limit;
  END IF;
END;
$$;

-- Trigger pour mettre à jour date_modification
CREATE OR REPLACE FUNCTION public.update_medicaments_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.date_modification = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_medicaments_timestamp
  BEFORE UPDATE ON public.medicaments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_medicaments_timestamp();

-- RLS: Lecture publique pour les médicaments actifs
ALTER TABLE public.medicaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Médicaments actifs visibles par tous"
  ON public.medicaments
  FOR SELECT
  USING (statut = 'actif');

-- Seuls les super admins peuvent modifier
CREATE POLICY "Super admins peuvent gérer médicaments"
  ON public.medicaments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Insertion de quelques données de démonstration
INSERT INTO public.medicaments (
  nom_commercial, dci, forme_pharmaceutique, dosage, 
  necessite_ordonnance, est_generique, classe_therapeutique,
  prix_moyen_pharmacie, tarif_conventionne_cnamgs,
  laboratoire_fabricant
) VALUES
('PARACETAMOL 500mg', 'Paracétamol', 'Comprimé', '500mg', false, true, 'Antalgique', 1500, 1200, 'Generiques SA'),
('DOLIPRANE 1000mg', 'Paracétamol', 'Comprimé', '1000mg', false, false, 'Antalgique', 2500, 2000, 'Sanofi'),
('AMOXICILLINE 500mg', 'Amoxicilline', 'Gélule', '500mg', true, true, 'Antibiotique', 3000, 2500, 'Generiques SA'),
('AUGMENTIN 1g', 'Amoxicilline + Acide clavulanique', 'Comprimé', '1g', true, false, 'Antibiotique', 8500, 7000, 'GSK'),
('IBUPROFENE 400mg', 'Ibuprofène', 'Comprimé', '400mg', false, true, 'Anti-inflammatoire', 2000, 1500, 'Generiques SA'),
('ADVIL 400mg', 'Ibuprofène', 'Comprimé', '400mg', false, false, 'Anti-inflammatoire', 3500, 2800, 'Pfizer'),
('METFORMINE 850mg', 'Metformine', 'Comprimé', '850mg', true, true, 'Antidiabétique', 4500, 3500, 'Generiques SA'),
('GLUCOPHAGE 850mg', 'Metformine', 'Comprimé', '850mg', true, false, 'Antidiabétique', 6000, 5000, 'Merck'),
('LISINOPRIL 10mg', 'Lisinopril', 'Comprimé', '10mg', true, true, 'Antihypertenseur', 5000, 4000, 'Generiques SA'),
('ZESTRIL 10mg', 'Lisinopril', 'Comprimé', '10mg', true, false, 'Antihypertenseur', 7500, 6000, 'AstraZeneca'),
('OMEPRAZOLE 20mg', 'Oméprazole', 'Gélule', '20mg', false, true, 'Antiulcéreux', 3500, 2800, 'Generiques SA'),
('MOPRAL 20mg', 'Oméprazole', 'Gélule', '20mg', false, false, 'Antiulcéreux', 5500, 4500, 'AstraZeneca'),
('LORATADINE 10mg', 'Loratadine', 'Comprimé', '10mg', false, true, 'Antihistaminique', 2500, 2000, 'Generiques SA'),
('CLARITYNE 10mg', 'Loratadine', 'Comprimé', '10mg', false, false, 'Antihistaminique', 4000, 3200, 'Schering-Plough'),
('ATORVASTATINE 20mg', 'Atorvastatine', 'Comprimé', '20mg', true, true, 'Hypolipémiant', 6000, 5000, 'Generiques SA'),
('TAHOR 20mg', 'Atorvastatine', 'Comprimé', '20mg', true, false, 'Hypolipémiant', 9500, 8000, 'Pfizer'),
('CETIRIZINE 10mg', 'Cétirizine', 'Comprimé', '10mg', false, true, 'Antihistaminique', 2000, 1500, 'Generiques SA'),
('ZYRTEC 10mg', 'Cétirizine', 'Comprimé', '10mg', false, false, 'Antihistaminique', 3800, 3000, 'UCB'),
('AMLODIPINE 5mg', 'Amlodipine', 'Comprimé', '5mg', true, true, 'Antihypertenseur', 4500, 3500, 'Generiques SA'),
('AMLOR 5mg', 'Amlodipine', 'Comprimé', '5mg', true, false, 'Antihypertenseur', 7000, 5500, 'Pfizer');

COMMENT ON TABLE public.medicaments IS 'Référentiel des produits pharmaceutiques disponibles';
COMMENT ON FUNCTION public.search_medicaments IS 'Fonction de recherche intelligente avec full-text search';