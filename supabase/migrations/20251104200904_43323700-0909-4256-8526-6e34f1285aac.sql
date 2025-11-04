-- Tables complémentaires pour API Médicaments (Version corrigée)

-- Table interactions médicamenteuses
CREATE TABLE IF NOT EXISTS public.interactions_medicamenteuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicament_a_id UUID REFERENCES public.medicaments(id) ON DELETE CASCADE,
    medicament_b_id UUID REFERENCES public.medicaments(id) ON DELETE CASCADE,
    niveau_gravite TEXT NOT NULL CHECK (niveau_gravite IN ('faible', 'modere', 'grave', 'contre_indication')),
    description TEXT,
    recommandation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(medicament_a_id, medicament_b_id)
);

-- Table équivalences thérapeutiques (génériques)
CREATE TABLE IF NOT EXISTS public.equivalences_therapeutiques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicament_princeps_id UUID REFERENCES public.medicaments(id) ON DELETE CASCADE,
    medicament_generique_id UUID REFERENCES public.medicaments(id) ON DELETE CASCADE,
    bioequivalence_validee BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(medicament_princeps_id, medicament_generique_id)
);

-- Table stocks pharmacies (temps réel)
CREATE TABLE IF NOT EXISTS public.stocks_pharmacie (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacie_id UUID REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    medicament_id UUID REFERENCES public.medicaments(id) ON DELETE CASCADE,
    quantite_disponible INTEGER DEFAULT 0 CHECK (quantite_disponible >= 0),
    seuil_alerte INTEGER DEFAULT 10 CHECK (seuil_alerte >= 0),
    prix_vente DECIMAL(10,2) CHECK (prix_vente >= 0),
    derniere_mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(pharmacie_id, medicament_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_interactions_medicament_a ON public.interactions_medicamenteuses(medicament_a_id);
CREATE INDEX IF NOT EXISTS idx_interactions_medicament_b ON public.interactions_medicamenteuses(medicament_b_id);
CREATE INDEX IF NOT EXISTS idx_equivalences_princeps ON public.equivalences_therapeutiques(medicament_princeps_id);
CREATE INDEX IF NOT EXISTS idx_equivalences_generique ON public.equivalences_therapeutiques(medicament_generique_id);
CREATE INDEX IF NOT EXISTS idx_stocks_pharmacie_pharmacie ON public.stocks_pharmacie(pharmacie_id);
CREATE INDEX IF NOT EXISTS idx_stocks_pharmacie_medicament ON public.stocks_pharmacie(medicament_id);
CREATE INDEX IF NOT EXISTS idx_stocks_pharmacie_alerte ON public.stocks_pharmacie(pharmacie_id, medicament_id) WHERE quantite_disponible < seuil_alerte;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.trigger_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_interactions_updated_at
    BEFORE UPDATE ON public.interactions_medicamenteuses
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_update_updated_at();

-- Fonction pour enrichir les données médicaments avec stock et alternatives
CREATE OR REPLACE FUNCTION public.get_medicament_enriched(p_medicament_id UUID, p_pharmacie_id UUID DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'medicament', row_to_json(m.*),
        'stock', (
            SELECT row_to_json(s.*)
            FROM stocks_pharmacie s
            WHERE s.medicament_id = p_medicament_id
            AND (p_pharmacie_id IS NULL OR s.pharmacie_id = p_pharmacie_id)
            LIMIT 1
        ),
        'generiques', (
            SELECT json_agg(row_to_json(gen.*))
            FROM medicaments gen
            INNER JOIN equivalences_therapeutiques et ON gen.id = et.medicament_generique_id
            WHERE et.medicament_princeps_id = p_medicament_id
            AND gen.statut = 'actif'
        ),
        'interactions_count', (
            SELECT COUNT(*)
            FROM interactions_medicamenteuses i
            WHERE i.medicament_a_id = p_medicament_id OR i.medicament_b_id = p_medicament_id
        )
    ) INTO v_result
    FROM medicaments m
    WHERE m.id = p_medicament_id;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE public.interactions_medicamenteuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equivalences_therapeutiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stocks_pharmacie ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les interactions et équivalences
CREATE POLICY "Interactions visibles par tous" ON public.interactions_medicamenteuses
    FOR SELECT USING (true);

CREATE POLICY "Équivalences visibles par tous" ON public.equivalences_therapeutiques
    FOR SELECT USING (true);

-- Stocks visibles par tous
CREATE POLICY "Stocks visibles par tous" ON public.stocks_pharmacie
    FOR SELECT USING (true);

-- Les admins peuvent tout gérer
CREATE POLICY "Admins peuvent gérer interactions" ON public.interactions_medicamenteuses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins peuvent gérer équivalences" ON public.equivalences_therapeutiques
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins peuvent gérer stocks" ON public.stocks_pharmacie
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

-- Données de démonstration pour interactions
INSERT INTO public.interactions_medicamenteuses (medicament_a_id, medicament_b_id, niveau_gravite, description, recommandation)
SELECT 
    m1.id,
    m2.id,
    'modere',
    'Interaction possible entre ' || m1.nom_commercial || ' et ' || m2.nom_commercial,
    'Surveillance clinique recommandée'
FROM medicaments m1
CROSS JOIN medicaments m2
WHERE m1.id < m2.id
AND m1.classe_therapeutique = 'Antihypertenseur'
AND m2.classe_therapeutique = 'Diurétique'
LIMIT 5
ON CONFLICT (medicament_a_id, medicament_b_id) DO NOTHING;

-- Données de démonstration pour équivalences (génériques)
INSERT INTO public.equivalences_therapeutiques (medicament_princeps_id, medicament_generique_id, bioequivalence_validee)
SELECT 
    m1.id,
    m2.id,
    true
FROM medicaments m1
CROSS JOIN medicaments m2
WHERE m1.id != m2.id
AND m1.dci = m2.dci
AND m1.est_generique = false
AND m2.est_generique = true
LIMIT 10
ON CONFLICT (medicament_princeps_id, medicament_generique_id) DO NOTHING;