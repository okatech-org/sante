-- ============================================
-- API MEDICAMENTS - SCHEMA DE BASE + RECHERCHE
-- Date: 2025-11-04
-- ============================================

-- Extensions utiles
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Table principale des médicaments
CREATE TABLE IF NOT EXISTS public.medicaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_cip VARCHAR(13) UNIQUE,
  code_atc VARCHAR(12),

  nom_commercial TEXT NOT NULL,
  dci TEXT,
  forme_pharmaceutique TEXT,
  dosage TEXT,

  categorie TEXT,
  classe_therapeutique TEXT,

  laboratoire_fabricant TEXT,
  pays_origine TEXT,

  tarif_conventionne_cnamgs NUMERIC(10,2),
  prix_moyen_pharmacie NUMERIC(10,2),
  taux_remboursement INTEGER DEFAULT 80,

  est_generique BOOLEAN DEFAULT FALSE,
  medicament_princeps_id UUID REFERENCES public.medicaments(id),
  necessite_ordonnance BOOLEAN DEFAULT TRUE,

  description TEXT,
  indications TEXT,
  contre_indications TEXT,
  effets_secondaires TEXT,
  posologie_standard TEXT,

  image_url TEXT,
  notice_pdf_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('french', unaccent(coalesce(nom_commercial, ''))), 'A') ||
    setweight(to_tsvector('french', unaccent(coalesce(dci, ''))), 'B') ||
    setweight(to_tsvector('french', unaccent(coalesce(dosage, ''))), 'C')
  ) STORED
);

-- Interactions médicamenteuses
CREATE TABLE IF NOT EXISTS public.interactions_medicamenteuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicament_a_id UUID NOT NULL REFERENCES public.medicaments(id) ON DELETE CASCADE,
  medicament_b_id UUID NOT NULL REFERENCES public.medicaments(id) ON DELETE CASCADE,
  niveau_gravite TEXT CHECK (niveau_gravite IN ('faible','modere','grave','contre-indication')),
  description TEXT,
  recommandation TEXT
);

-- Equivalences thérapeutiques
CREATE TABLE IF NOT EXISTS public.equivalences_therapeutiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicament_princeps_id UUID NOT NULL REFERENCES public.medicaments(id) ON DELETE CASCADE,
  medicament_generique_id UUID NOT NULL REFERENCES public.medicaments(id) ON DELETE CASCADE,
  bioequivalence_validee BOOLEAN DEFAULT TRUE
);

-- Stock en pharmacie
CREATE TABLE IF NOT EXISTS public.stocks_pharmacie (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacie_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
  medicament_id UUID NOT NULL REFERENCES public.medicaments(id) ON DELETE CASCADE,
  quantite_disponible INTEGER DEFAULT 0,
  seuil_alerte INTEGER DEFAULT 10,
  prix_vente NUMERIC(10,2),
  derniere_mise_a_jour TIMESTAMPTZ DEFAULT now(),
  UNIQUE (pharmacie_id, medicament_id)
);

-- Triggers updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS medicaments_bu ON public.medicaments;
CREATE TRIGGER medicaments_bu
  BEFORE UPDATE ON public.medicaments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS medicaments_search_idx ON public.medicaments USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS medicaments_nom_trgm_idx ON public.medicaments USING GIN (nom_commercial gin_trgm_ops);
CREATE INDEX IF NOT EXISTS stocks_pharmacie_idx ON public.stocks_pharmacie (pharmacie_id, medicament_id);

-- RLS
ALTER TABLE public.medicaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions_medicamenteuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equivalences_therapeutiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stocks_pharmacie ENABLE ROW LEVEL SECURITY;

-- Lectures publiques des médicaments (consultation et recherche)
DROP POLICY IF EXISTS "Public read access to medicaments" ON public.medicaments;
CREATE POLICY "Public read access to medicaments"
  ON public.medicaments FOR SELECT
  USING (true);

-- Mise à jour des stocks limitée au rôle pharmacie
DROP POLICY IF EXISTS "Pharmacy can update own stock" ON public.stocks_pharmacie;
CREATE POLICY "Pharmacy can update own stock"
  ON public.stocks_pharmacie FOR UPDATE
  USING (has_role(auth.uid(), 'pharmacy'::app_role));

DROP POLICY IF EXISTS "Pharmacy can insert own stock" ON public.stocks_pharmacie;
CREATE POLICY "Pharmacy can insert own stock"
  ON public.stocks_pharmacie FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'pharmacy'::app_role));

DROP POLICY IF EXISTS "Read stocks" ON public.stocks_pharmacie;
CREATE POLICY "Read stocks"
  ON public.stocks_pharmacie FOR SELECT
  USING (true);

-- RPC: Recherche médicaments
CREATE OR REPLACE FUNCTION public.search_medicaments(p_query text, p_limit int DEFAULT 10)
RETURNS TABLE (
  id UUID,
  nom_commercial TEXT,
  dci TEXT,
  forme_pharmaceutique TEXT,
  dosage TEXT,
  tarif_conventionne_cnamgs NUMERIC,
  prix_moyen_pharmacie NUMERIC,
  necessite_ordonnance BOOLEAN,
  image_url TEXT
) AS $$
BEGIN
  IF p_query IS NULL OR length(trim(p_query)) < 2 THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, NULL::text, NULL::text, NULL::text, NULL::numeric, NULL::numeric, NULL::boolean, NULL::text WHERE FALSE;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT m.id, m.nom_commercial, m.dci, m.forme_pharmaceutique, m.dosage,
         m.tarif_conventionne_cnamgs, m.prix_moyen_pharmacie, m.necessite_ordonnance, m.image_url
  FROM public.medicaments m
  WHERE m.search_vector @@ plainto_tsquery('french', unaccent(p_query))
     OR m.nom_commercial ILIKE '%' || p_query || '%'
     OR (m.dci IS NOT NULL AND m.dci ILIKE '%' || p_query || '%')
  ORDER BY ts_rank(m.search_vector, plainto_tsquery('french', unaccent(p_query))) DESC NULLS LAST,
           m.nom_commercial ASC
  LIMIT COALESCE(p_limit, 10);
END;
$$ LANGUAGE plpgsql STABLE;

-- SEED minimal (exemples)
INSERT INTO public.medicaments (code_cip, code_atc, nom_commercial, dci, forme_pharmaceutique, dosage, categorie, classe_therapeutique, laboratoire_fabricant, tarif_conventionne_cnamgs, prix_moyen_pharmacie, image_url)
VALUES
  ('3400936404489','C08CA01','Amlodipine 5mg','Amlodipine','Comprimé','5mg','Antihypertenseur','Inhibiteur calcique','Pfizer',8000,12000,NULL),
  ('3400936404496','C08CA01','Amlodipine 10mg','Amlodipine','Comprimé','10mg','Antihypertenseur','Inhibiteur calcique','Pfizer',12000,18000,NULL),
  ('3400933678778','N02BE01','Paracétamol 500mg','Paracetamol','Comprimé','500mg','Antalgique','Anilide','Sanofi',500,800,NULL)
ON CONFLICT (code_cip) DO NOTHING;


