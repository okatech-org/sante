// @ts-nocheck
// ============================================
// HOOK: usePharmacy - Gestion Pharmacies
// Date: 3 novembre 2025
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Pharmacie, 
  PharmacieSearchFilters, 
  PharmacieSearchResult,
  InscriptionPharmacieFormData
} from '@/types/pharmacy';
import { pharmacySlugFromName } from '@/lib/utils';

// ============================================
// QUERY KEYS
// ============================================

export const pharmacyKeys = {
  all: ['pharmacies'] as const,
  lists: () => [...pharmacyKeys.all, 'list'] as const,
  list: (filters: PharmacieSearchFilters) => [...pharmacyKeys.lists(), filters] as const,
  details: () => [...pharmacyKeys.all, 'detail'] as const,
  detail: (id: string) => [...pharmacyKeys.details(), id] as const,
  nearby: (lat: number, lng: number, radius: number) => 
    [...pharmacyKeys.all, 'nearby', lat, lng, radius] as const,
  myPharmacies: (userId: string) => [...pharmacyKeys.all, 'my', userId] as const,
};

// ============================================
// RÉCUPÉRER PHARMACIE PAR ID
// ============================================

export const usePharmacy = (pharmacyId: string | undefined) => {
  return useQuery({
    queryKey: pharmacyKeys.detail(pharmacyId || ''),
    queryFn: async () => {
      if (!pharmacyId) throw new Error('ID pharmacie requis');

      const { data, error } = await supabase
        .from('pharmacies')
        .select(`
          *,
          pharmacien_titulaire:professionnels_sante_pharmacie!pharmacien_titulaire_id(
            id,
            nom_complet,
            numero_inscription_onpg,
            photo_url,
            type_professionnel
          )
        `)
        .eq('id', pharmacyId)
        .maybeSingle();

      // Avec maybeSingle, 0 ligne renvoie data=null sans lever d'erreur (évite 406)
      if (error) throw error;
      
      return data as Pharmacie;
    },
    enabled: !!pharmacyId,
  });
};

// ============================================
// RECHERCHER PHARMACIES
// ============================================

export const usePharmaciesSearch = (filters: PharmacieSearchFilters) => {
  return useQuery({
    queryKey: pharmacyKeys.list(filters),
    queryFn: async () => {
      let query = supabase
        .from('pharmacies')
        .select('*, pharmacien_titulaire:professionnels_sante_pharmacie!pharmacien_titulaire_id(nom_complet)', { count: 'exact' })
        .eq('visible_plateforme', true)
        .eq('statut_verification', 'verifie');

      // Filtres textuels
      if (filters.search) {
        query = query.ilike('nom_commercial', `%${filters.search}%`);
      }
      if (filters.ville) {
        query = query.eq('ville', filters.ville);
      }
      if (filters.province) {
        query = query.eq('province', filters.province);
      }
      if (filters.quartier) {
        query = query.eq('quartier', filters.quartier);
      }

      // Filtres booléens
      if (filters.ouvert_24_7 !== undefined) {
        query = query.eq('ouvert_24_7', filters.ouvert_24_7);
      }
      if (filters.conventionnement_cnamgs !== undefined) {
        query = query.eq('conventionnement_cnamgs', filters.conventionnement_cnamgs);
      }
      if (filters.accepte_commandes_en_ligne !== undefined) {
        query = query.eq('accepte_commandes_en_ligne', filters.accepte_commandes_en_ligne);
      }

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        results: data as Pharmacie[],
        pagination: {
          total: count || 0,
          page,
          limit,
          total_pages: Math.ceil((count || 0) / limit),
        },
        filtres_appliques: filters,
      } as PharmacieSearchResult;
    },
  });
};

// ============================================
// PHARMACIES À PROXIMITÉ
// ============================================

export const useNearbyPharmacies = (
  latitude: number | undefined,
  longitude: number | undefined,
  radiusKm: number = 10
) => {
  return useQuery({
    queryKey: pharmacyKeys.nearby(latitude || 0, longitude || 0, radiusKm),
    queryFn: async () => {
      if (!latitude || !longitude) throw new Error('Coordonnées requises');

      const { data, error } = await supabase.rpc('search_pharmacies_nearby', {
        p_latitude: latitude,
        p_longitude: longitude,
        p_radius_km: radiusKm,
      });

      if (error) throw error;

      return data as Array<{
        pharmacy_id: string;
        nom_commercial: string;
        distance_km: number;
        ouvert_maintenant: boolean;
      }>;
    },
    enabled: !!latitude && !!longitude,
  });
};

// ============================================
// MES PHARMACIES (Professionnel)
// ============================================

export const useMyPharmacies = (userId: string | undefined) => {
  return useQuery({
    queryKey: pharmacyKeys.myPharmacies(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID requis');

      // Récupérer professionnel
      const { data: professionnel, error: profError } = await supabase
        .from('professionnels_sante_pharmacie')
        .select('pharmacie_principale_id, pharmacies_secondaires')
        .eq('user_id', userId)
        .single();

      if (profError) throw profError;

      const pharmacyIds = [
        professionnel.pharmacie_principale_id,
        ...(professionnel.pharmacies_secondaires?.map((p: any) => p.pharmacie_id) || [])
      ].filter(Boolean);

      if (pharmacyIds.length === 0) return [];

      const { data, error } = await supabase
        .from('pharmacies')
        .select('*')
        .in('id', pharmacyIds);

      if (error) throw error;

      return data as Pharmacie[];
    },
    enabled: !!userId,
  });
};

// ============================================
// CRÉER PHARMACIE
// ============================================

export const useCreatePharmacy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InscriptionPharmacieFormData) => {
      // Générer code pharmacie
      const { data: code } = await supabase.rpc('generate_pharmacy_code');

      const pharmacyData = {
        code_pharmacie: code,
        nom_commercial: data.nom_commercial,
        slug: pharmacySlugFromName(data.nom_commercial),
        type_structure: data.type_structure,
        numero_autorisation_ouverture: data.numero_autorisation_ouverture,
        date_autorisation: data.date_autorisation,
        numero_inscription_onpg: data.numero_inscription_onpg,
        adresse_complete: data.adresse_complete,
        quartier: data.quartier,
        ville: data.ville,
        province: data.province,
        latitude: data.latitude,
        longitude: data.longitude,
        reperes_geographiques: data.reperes_geographiques,
        telephone_principal: data.telephone_principal,
        email: data.email,
        ouvert_24_7: data.ouvert_24_7,
        horaires: data.horaires,
        services_disponibles: data.services_disponibles,
        modes_paiement: data.modes_paiement,
        mobile_money_providers: data.mobile_money_providers,
        conventionnement_cnamgs: data.conventionnement_cnamgs,
        numero_convention_cnamgs: data.numero_convention_cnamgs,
        dispose_chambre_froide: data.dispose_chambre_froide,
        dispose_armoire_securisee: data.dispose_armoire_securisee,
        visible_plateforme: data.visible_plateforme,
        accepte_commandes_en_ligne: data.accepte_commandes_en_ligne,
        accepte_reservations: data.accepte_reservations,
        delai_preparation_moyen_minutes: data.delai_preparation_moyen_minutes,
        pharmacien_titulaire_id: data.pharmacien_titulaire_id,
        statut_verification: 'en_attente',
      };

      const { data: pharmacy, error } = await supabase
        .from('pharmacies')
        .insert([pharmacyData])
        .select()
        .single();

      if (error) throw error;

      return pharmacy as Pharmacie;
    },
    onSuccess: (pharmacy) => {
      queryClient.invalidateQueries({ queryKey: pharmacyKeys.all });
      toast.success(`Pharmacie "${pharmacy.nom_commercial}" créée avec succès`, {
        description: 'En attente de vérification administrative'
      });
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la création', {
        description: error.message
      });
    },
  });
};

// ============================================
// METTRE À JOUR PHARMACIE
// ============================================

export const useUpdatePharmacy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<Pharmacie> 
    }) => {
      const { data, error } = await supabase
        .from('pharmacies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as Pharmacie;
    },
    onSuccess: (pharmacy) => {
      queryClient.invalidateQueries({ queryKey: pharmacyKeys.all });
      queryClient.invalidateQueries({ queryKey: pharmacyKeys.detail(pharmacy.id) });
      toast.success('Pharmacie mise à jour');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la mise à jour', {
        description: error.message
      });
    },
  });
};

// ============================================
// VÉRIFIER PHARMACIE (Admin)
// ============================================

export const useVerifyPharmacy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pharmacyId,
      approved,
      motif
    }: {
      pharmacyId: string;
      approved: boolean;
      motif?: string;
    }) => {
      const { data, error } = await supabase
        .from('pharmacies')
        .update({
          statut_verification: approved ? 'verifie' : 'refuse',
          date_verification: new Date().toISOString(),
          motif_refus: approved ? null : motif,
          visible_plateforme: approved,
        })
        .eq('id', pharmacyId)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pharmacyKeys.all });
      toast.success(
        variables.approved 
          ? 'Pharmacie approuvée' 
          : 'Pharmacie refusée'
      );
    },
    onError: (error: any) => {
      toast.error('Erreur', { description: error.message });
    },
  });
};

