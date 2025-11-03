import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Pharmacie, StatutVerification } from '@/types/pharmacy';

interface PharmacyFilters {
  search?: string;
  ville?: string;
  province?: string;
  statut_verification?: StatutVerification;
}

interface PharmacyStats {
  total: number;
  en_attente: number;
  verifie: number;
  refuse: number;
  suspendu: number;
  actives_24_7: number;
  cnamgs: number;
}

export const usePharmacyManagement = (filters: PharmacyFilters) => {
  const [pharmacies, setPharmacies] = useState<Pharmacie[]>([]);
  const [stats, setStats] = useState<PharmacyStats>({
    total: 0,
    en_attente: 0,
    verifie: 0,
    refuse: 0,
    suspendu: 0,
    actives_24_7: 0,
    cnamgs: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchPharmacies = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('pharmacies')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.search) {
        query = query.or(
          `nom_commercial.ilike.%${filters.search}%,code_pharmacie.ilike.%${filters.search}%,ville.ilike.%${filters.search}%`
        );
      }

      if (filters.ville) {
        query = query.eq('ville', filters.ville);
      }

      if (filters.province) {
        query = query.eq('province', filters.province);
      }

      if (filters.statut_verification) {
        query = query.eq('statut_verification', filters.statut_verification);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPharmacies((data as any) || []);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      toast.error('Erreur lors du chargement des pharmacies');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('pharmacies')
        .select('statut_verification, ouvert_24_7, conventionnement_cnamgs');

      if (error) throw error;

      const statsData = data || [];
      setStats({
        total: statsData.length,
        en_attente: statsData.filter(p => p.statut_verification === 'en_attente').length,
        verifie: statsData.filter(p => p.statut_verification === 'verifie').length,
        refuse: statsData.filter(p => p.statut_verification === 'refuse').length,
        suspendu: statsData.filter(p => p.statut_verification === 'suspendu').length,
        actives_24_7: statsData.filter(p => p.ouvert_24_7).length,
        cnamgs: statsData.filter(p => p.conventionnement_cnamgs).length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchPharmacies();
    fetchStats();
  }, [filters]);

  return {
    pharmacies,
    stats,
    loading,
    refetch: () => {
      fetchPharmacies();
      fetchStats();
    },
  };
};

export const usePharmacyActions = () => {
  const approvePharmacy = async (pharmacyId: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from('pharmacies')
        .update({
          statut_verification: 'verifie',
          verifie_par_admin: adminId,
          date_verification: new Date().toISOString(),
        })
        .eq('id', pharmacyId);

      if (error) throw error;

      toast.success('Pharmacie approuvée avec succès');
      return true;
    } catch (error) {
      console.error('Error approving pharmacy:', error);
      toast.error('Erreur lors de l\'approbation');
      return false;
    }
  };

  const rejectPharmacy = async (pharmacyId: string, reason: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from('pharmacies')
        .update({
          statut_verification: 'refuse',
          motif_refus: reason,
          verifie_par_admin: adminId,
          date_verification: new Date().toISOString(),
        })
        .eq('id', pharmacyId);

      if (error) throw error;

      toast.success('Pharmacie refusée');
      return true;
    } catch (error) {
      console.error('Error rejecting pharmacy:', error);
      toast.error('Erreur lors du refus');
      return false;
    }
  };

  const suspendPharmacy = async (pharmacyId: string, reason: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from('pharmacies')
        .update({
          statut_verification: 'suspendu',
          motif_refus: reason,
          verifie_par_admin: adminId,
          visible_plateforme: false,
        })
        .eq('id', pharmacyId);

      if (error) throw error;

      toast.success('Pharmacie suspendue');
      return true;
    } catch (error) {
      console.error('Error suspending pharmacy:', error);
      toast.error('Erreur lors de la suspension');
      return false;
    }
  };

  const reactivatePharmacy = async (pharmacyId: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from('pharmacies')
        .update({
          statut_verification: 'verifie',
          motif_refus: null,
          verifie_par_admin: adminId,
          visible_plateforme: true,
        })
        .eq('id', pharmacyId);

      if (error) throw error;

      toast.success('Pharmacie réactivée');
      return true;
    } catch (error) {
      console.error('Error reactivating pharmacy:', error);
      toast.error('Erreur lors de la réactivation');
      return false;
    }
  };

  return {
    approvePharmacy,
    rejectPharmacy,
    suspendPharmacy,
    reactivatePharmacy,
  };
};
