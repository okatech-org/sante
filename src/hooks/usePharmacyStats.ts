// ============================================
// HOOK: usePharmacyStats - Statistiques Pharmacie
// Date: 3 novembre 2025
// ============================================

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PharmacieStats } from '@/types/pharmacy';

// ============================================
// QUERY KEYS
// ============================================

export const pharmacyStatsKeys = {
  all: ['pharmacy-stats'] as const,
  pharmacy: (pharmacyId: string) => [...pharmacyStatsKeys.all, pharmacyId] as const,
  period: (pharmacyId: string, period: string) => 
    [...pharmacyStatsKeys.pharmacy(pharmacyId), period] as const,
  dashboard: (pharmacyId: string) => 
    [...pharmacyStatsKeys.pharmacy(pharmacyId), 'dashboard'] as const,
  global: () => [...pharmacyStatsKeys.all, 'global'] as const,
};

// ============================================
// STATISTIQUES TABLEAU DE BORD
// ============================================

export const usePharmacyDashboardStats = (pharmacyId: string | undefined) => {
  return useQuery({
    queryKey: pharmacyStatsKeys.dashboard(pharmacyId || ''),
    queryFn: async () => {
      if (!pharmacyId) throw new Error('ID pharmacie requis');

      // Pour le MVP, on peut simuler les stats ou les calculer en temps réel
      // Dans une version production, ces stats seraient pré-calculées dans une table dédiée

      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0];

      // Stats du jour (simulées pour le MVP)
      const dashboardStats = {
        today: {
          commandes: 12,
          dispensations: 8,
          stocks_bas: 5,
          ca_jour_fcfa: 245000,
        },
        alerts: {
          total: 3,
          items: [
            {
              type: 'stock_critique' as const,
              message: 'Amlodipine 5mg - Stock critique (12 boîtes)',
              severity: 'warning' as const,
            },
            {
              type: 'rupture' as const,
              message: 'Insuline Rapide - Rupture fournisseur',
              severity: 'critical' as const,
            },
            {
              type: 'compte' as const,
              message: 'Vendeur Patrick OBAME - Connexion suspendue',
              severity: 'critical' as const,
            }
          ]
        },
        ordonnances_en_attente: {
          total: 4,
          items: [] // Rempli par requête séparée si nécessaire
        },
        performance: {
          note_moyenne: 4.7,
          nombre_avis: 142,
          taux_disponibilite: 94.3,
        }
      };

      return dashboardStats;
    },
    enabled: !!pharmacyId,
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });
};

// ============================================
// STATISTIQUES PÉRIODE
// ============================================

export const usePharmacyStats = (
  pharmacyId: string | undefined,
  periode: string = new Date().toISOString().slice(0, 7) // Format YYYY-MM
) => {
  return useQuery({
    queryKey: pharmacyStatsKeys.period(pharmacyId || '', periode),
    queryFn: async () => {
      if (!pharmacyId) throw new Error('ID pharmacie requis');

      // TODO: Implémenter calcul réel des stats depuis les tables
      // Pour le MVP, données simulées

      const stats: PharmacieStats = {
        pharmacie_id: pharmacyId,
        periode: periode,

        commandes: {
          total: 342,
          completees: 315,
          annulees: 27,
          taux_completion: 92.1,
          valeur_totale_fcfa: 8450000,
          panier_moyen_fcfa: 24708,
        },

        ordonnances: {
          total_dispensees: 287,
          ordonnances_cnamgs: 215,
          ordonnances_privees: 72,
          medicaments_dispenses: 1245,
        },

        stocks: {
          ruptures_declarees: 12,
          alertes_stock_bas: 45,
          taux_disponibilite: 94.3,
        },

        clients: {
          nouveaux: 67,
          recurrents: 248,
          taux_fidelisation: 78.7,
        },

        performance: {
          delai_preparation_moyen_minutes: 18,
          note_satisfaction: 4.8,
          nombre_avis_periode: 23,
        },
      };

      return stats;
    },
    enabled: !!pharmacyId,
  });
};

// ============================================
// STATISTIQUES GLOBALES (Admin)
// ============================================

export const useGlobalPharmacyStats = () => {
  return useQuery({
    queryKey: pharmacyStatsKeys.global(),
    queryFn: async () => {
      // Stats globales de la plateforme
      
      const { count: totalPharmacies } = await supabase
        .from('pharmacies')
        .select('*', { count: 'exact', head: true })
        .eq('statut_verification', 'verifie');

      const { count: totalProfessionals } = await supabase
        .from('professionnels_sante_pharmacie')
        .select('*', { count: 'exact', head: true })
        .eq('compte_actif', true);

      const { count: pharmacies24_7 } = await supabase
        .from('pharmacies')
        .select('*', { count: 'exact', head: true })
        .eq('ouvert_24_7', true)
        .eq('statut_verification', 'verifie');

      const { count: pharmaciesCNAMGS } = await supabase
        .from('pharmacies')
        .select('*', { count: 'exact', head: true })
        .eq('conventionnement_cnamgs', true)
        .eq('statut_verification', 'verifie');

      // Répartition par province
      const { data: byProvince } = await supabase
        .from('pharmacies')
        .select('province')
        .eq('statut_verification', 'verifie');

      const provinceStats = byProvince?.reduce((acc: any, curr: any) => {
        acc[curr.province] = (acc[curr.province] || 0) + 1;
        return acc;
      }, {});

      // Répartition professionnels
      const { data: byProfType } = await supabase
        .from('professionnels_sante_pharmacie')
        .select('type_professionnel')
        .eq('compte_actif', true);

      const profTypeStats = byProfType?.reduce((acc: any, curr: any) => {
        acc[curr.type_professionnel] = (acc[curr.type_professionnel] || 0) + 1;
        return acc;
      }, {});

      return {
        pharmacies: {
          total: totalPharmacies || 0,
          ouvertes_24_7: pharmacies24_7 || 0,
          conventionnees_cnamgs: pharmaciesCNAMGS || 0,
          par_province: provinceStats || {},
        },
        professionnels: {
          total: totalProfessionals || 0,
          par_type: profTypeStats || {},
        },
        coverage: {
          provinces_couvertes: Object.keys(provinceStats || {}).length,
          villes_principales: 0, // TODO: calculer
        }
      };
    },
  });
};

// ============================================
// TOP PHARMACIES
// ============================================

export const useTopPharmacies = (limit: number = 10, metric: 'note' | 'commandes' = 'note') => {
  return useQuery({
    queryKey: [...pharmacyStatsKeys.all, 'top', metric, limit],
    queryFn: async () => {
      const orderBy = metric === 'note' ? 'note_moyenne' : 'nombre_commandes_total';

      const { data, error } = await supabase
        .from('pharmacies')
        .select('id, nom_commercial, ville, province, note_moyenne, nombre_commandes_total, nombre_avis')
        .eq('statut_verification', 'verifie')
        .eq('visible_plateforme', true)
        .order(orderBy, { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data;
    },
  });
};

// ============================================
// ACTIVITÉ RÉCENTE PHARMACIE
// ============================================

export const usePharmacyRecentActivity = (pharmacyId: string | undefined, limit: number = 10) => {
  return useQuery({
    queryKey: [...pharmacyStatsKeys.pharmacy(pharmacyId || ''), 'recent-activity', limit],
    queryFn: async () => {
      if (!pharmacyId) throw new Error('ID pharmacie requis');

      // TODO: Implémenter avec une vraie table d'activité
      // Pour le MVP, données simulées
      
      const activities = [
        {
          id: '1',
          type: 'dispensation',
          description: 'Ordonnance ORD-2025-001234 dispensée',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          user: 'Patrick OBAME',
        },
        {
          id: '2',
          type: 'commande',
          description: 'Nouvelle commande reçue',
          timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
          user: 'Système',
        },
        {
          id: '3',
          type: 'stock',
          description: 'Stock Paracétamol 500mg mis à jour',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          user: 'Dr Sylvie NZAMBA',
        },
      ];

      return activities.slice(0, limit);
    },
    enabled: !!pharmacyId,
  });
};

// ============================================
// COMPARAISON PÉRIODES
// ============================================

export const usePharmacyComparison = (
  pharmacyId: string | undefined,
  currentPeriod: string,
  previousPeriod: string
) => {
  const currentStats = usePharmacyStats(pharmacyId, currentPeriod);
  const previousStats = usePharmacyStats(pharmacyId, previousPeriod);

  return {
    current: currentStats.data,
    previous: previousStats.data,
    isLoading: currentStats.isLoading || previousStats.isLoading,
    comparison: currentStats.data && previousStats.data ? {
      commandes: {
        evolution: calculateEvolution(
          currentStats.data.commandes.total,
          previousStats.data.commandes.total
        ),
        evolution_ca: calculateEvolution(
          currentStats.data.commandes.valeur_totale_fcfa,
          previousStats.data.commandes.valeur_totale_fcfa
        ),
      },
      clients: {
        evolution_nouveaux: calculateEvolution(
          currentStats.data.clients.nouveaux,
          previousStats.data.clients.nouveaux
        ),
        evolution_fidelisation: calculateEvolution(
          currentStats.data.clients.taux_fidelisation,
          previousStats.data.clients.taux_fidelisation
        ),
      },
      performance: {
        evolution_note: calculateEvolution(
          currentStats.data.performance.note_satisfaction,
          previousStats.data.performance.note_satisfaction
        ),
      }
    } : null,
  };
};

// ============================================
// HELPERS
// ============================================

const calculateEvolution = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

