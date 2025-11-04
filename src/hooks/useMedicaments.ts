import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Medicament {
  id: string;
  code_cip: string | null;
  code_atc: string | null;
  nom_commercial: string | null;
  dci: string | null;
  forme_pharmaceutique: string | null;
  dosage: string | null;
  conditionnement: string | null;
  voie_administration: string | null;
  classe_therapeutique: string | null;
  famille_pharmacologique: string | null;
  laboratoire_fabricant: string | null;
  pays_origine: string | null;
  tarif_conventionne_cnamgs: number | null;
  prix_moyen_pharmacie: number | null;
  est_generique: boolean | null;
  necessite_ordonnance: boolean | null;
  substance_controlee: boolean | null;
  stupefiant: boolean | null;
  image_url: string | null;
  notice_url: string | null;
  statut: string | null;
  date_ajout: string | null;
  date_modification: string | null;
}

export interface MedicamentEnriched extends Medicament {
  stock?: {
    quantite_disponible: number;
    seuil_alerte: number;
    prix_vente: number;
  };
  generiques?: Medicament[];
  interactions_count?: number;
}

interface UseMedicamentsOptions {
  limit?: number;
  offset?: number;
  search?: string;
  classe_therapeutique?: string;
  statut?: string;
}

export const useMedicaments = (options: UseMedicamentsOptions = {}) => {
  const { limit = 1000, offset = 0, search, classe_therapeutique, statut = 'actif' } = options;

  return useQuery({
    queryKey: ["medicaments", limit, offset, search, classe_therapeutique, statut],
    queryFn: async () => {
      let query = supabase
        .from("medicaments")
        .select("*", { count: "exact" })
        .order("nom_commercial", { ascending: true })
        .range(offset, offset + limit - 1);

      if (statut && statut !== 'all') {
        query = query.eq("statut", statut);
      }

      if (search) {
        query = query.or(
          `nom_commercial.ilike.%${search}%,dci.ilike.%${search}%,code_cip.ilike.%${search}%`
        );
      }

      if (classe_therapeutique) {
        query = query.eq("classe_therapeutique", classe_therapeutique);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        medicaments: (data || []) as Medicament[],
        total: count || 0,
      };
    },
  });
};

export const useMedicament = (medicamentId: string | null, pharmacieId?: string) => {
  return useQuery({
    queryKey: ["medicament", medicamentId, pharmacieId],
    enabled: !!medicamentId,
    queryFn: async () => {
      if (!medicamentId) return null;

      const { data, error } = await supabase.rpc("get_medicament_enriched", {
        p_medicament_id: medicamentId,
        p_pharmacie_id: pharmacieId || null,
      });

      if (error) throw error;

      return data as unknown as MedicamentEnriched;
    },
  });
};

export const useMedicamentStats = () => {
  return useQuery({
    queryKey: ["medicament-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medicaments")
        .select("statut, est_generique, necessite_ordonnance");

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        actifs: data?.filter((m) => m.statut === "actif").length || 0,
        generiques: data?.filter((m) => m.est_generique).length || 0,
        avec_ordonnance: data?.filter((m) => m.necessite_ordonnance).length || 0,
      };

      return stats;
    },
  });
};

export const useClassesTherapeutiques = () => {
  return useQuery({
    queryKey: ["classes-therapeutiques"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medicaments")
        .select("classe_therapeutique")
        .not("classe_therapeutique", "is", null)
        .eq("statut", "actif");

      if (error) throw error;

      // Extraire les classes uniques
      const classes = Array.from(
        new Set(data?.map((m) => m.classe_therapeutique).filter(Boolean))
      ).sort();

      return classes as string[];
    },
  });
};

export const useInteractionsMedicamenteuses = (medicamentIds: string[]) => {
  return useQuery({
    queryKey: ["interactions", medicamentIds],
    enabled: medicamentIds.length >= 2,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interactions_medicamenteuses")
        .select("*")
        .or(
          medicamentIds
            .map((id) => `medicament_a_id.eq.${id},medicament_b_id.eq.${id}`)
            .join(",")
        );

      if (error) throw error;

      return data || [];
    },
  });
};
