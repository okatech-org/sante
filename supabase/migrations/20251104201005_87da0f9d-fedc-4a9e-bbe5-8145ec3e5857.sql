-- Corriger les fonctions avec search_path manquant

-- Fonction trigger avec search_path sécurisé
CREATE OR REPLACE FUNCTION public.trigger_update_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fonction enrichissement médicaments avec search_path sécurisé
CREATE OR REPLACE FUNCTION public.get_medicament_enriched(p_medicament_id UUID, p_pharmacie_id UUID DEFAULT NULL)
RETURNS JSON 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;