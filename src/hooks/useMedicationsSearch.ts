import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MedicationSuggestion {
  id: string;
  nom_commercial: string | null;
  dci: string | null;
  forme_pharmaceutique: string | null;
  dosage: string | null;
  tarif_conventionne_cnamgs: number | null;
  prix_moyen_pharmacie: number | null;
  necessite_ordonnance: boolean | null;
  image_url: string | null;
}

export const useMedicationsSearch = (query: string, limit: number = 10) => {
  return useQuery<{ results: MedicationSuggestion[] } | MedicationSuggestion[], Error>({
    queryKey: ["medications-search", query, limit],
    enabled: (query?.trim().length || 0) >= 2,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("search_medicaments", {
        p_query: query,
        p_limit: limit,
      });
      if (error) throw error;
      return (data || []) as MedicationSuggestion[];
    },
  });
};


