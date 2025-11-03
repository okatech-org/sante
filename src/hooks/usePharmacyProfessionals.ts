// @ts-nocheck
// ============================================
// HOOK: usePharmacyProfessionals - Gestion Professionnels
// Date: 3 novembre 2025
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  ProfessionnelSantePharmacie,
  InscriptionPharmacienFormData,
  InscriptionVendeurFormData,
  PharmacieEmploye
} from '@/types/pharmacy';
import { getPermissionsByRole } from '@/lib/pharmacy-permissions';

// ============================================
// QUERY KEYS
// ============================================

export const professionalKeys = {
  all: ['pharmacy-professionals'] as const,
  lists: () => [...professionalKeys.all, 'list'] as const,
  list: (pharmacyId: string) => [...professionalKeys.lists(), pharmacyId] as const,
  details: () => [...professionalKeys.all, 'detail'] as const,
  detail: (id: string) => [...professionalKeys.details(), id] as const,
  myProfile: (userId: string) => [...professionalKeys.all, 'my-profile', userId] as const,
  employees: (pharmacyId: string) => [...professionalKeys.all, 'employees', pharmacyId] as const,
  history: (professionalId: string) => [...professionalKeys.all, 'history', professionalId] as const,
};

// ============================================
// RÉCUPÉRER PROFESSIONNEL PAR ID
// ============================================

export const usePharmacyProfessional = (professionalId: string | undefined) => {
  return useQuery({
    queryKey: professionalKeys.detail(professionalId || ''),
    queryFn: async () => {
      if (!professionalId) throw new Error('ID professionnel requis');

      const { data, error } = await supabase
        .from('professionnels_sante_pharmacie')
        .select(`
          *,
          pharmacie_principale:pharmacies!pharmacie_principale_id(*),
          supervise_par:professionnels_sante_pharmacie!supervise_par_pharmacien_id(
            id,
            nom_complet,
            numero_inscription_onpg
          )
        `)
        .eq('id', professionalId)
        .single();

      if (error) throw error;
      
      return data as ProfessionnelSantePharmacie;
    },
    enabled: !!professionalId,
  });
};

// ============================================
// MON PROFIL PROFESSIONNEL
// ============================================

export const useMyPharmacyProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: professionalKeys.myProfile(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID requis');

      const { data, error } = await supabase
        .from('professionnels_sante_pharmacie')
        .select(`
          *,
          pharmacie_principale:pharmacies!pharmacie_principale_id(*),
          supervise_par:professionnels_sante_pharmacie!supervise_par_pharmacien_id(
            id,
            nom_complet,
            numero_inscription_onpg
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      return data as ProfessionnelSantePharmacie;
    },
    enabled: !!userId,
  });
};

// ============================================
// LISTE EMPLOYÉS PHARMACIE
// ============================================

export const usePharmacyEmployees = (pharmacyId: string | undefined) => {
  return useQuery({
    queryKey: professionalKeys.employees(pharmacyId || ''),
    queryFn: async () => {
      if (!pharmacyId) throw new Error('ID pharmacie requis');

      const { data, error } = await supabase
        .from('professionnels_sante_pharmacie')
        .select(`
          *,
          supervise_par:professionnels_sante_pharmacie!supervise_par_pharmacien_id(
            id,
            nom_complet
          )
        `)
        .eq('pharmacie_principale_id', pharmacyId)
        .order('est_pharmacien_titulaire', { ascending: false })
        .order('type_professionnel', { ascending: true })
        .order('nom_complet', { ascending: true });

      if (error) throw error;

      return data as ProfessionnelSantePharmacie[];
    },
    enabled: !!pharmacyId,
  });
};

// ============================================
// HISTORIQUE EMPLOI PROFESSIONNEL
// ============================================

export const useProfessionalHistory = (professionalId: string | undefined) => {
  return useQuery({
    queryKey: professionalKeys.history(professionalId || ''),
    queryFn: async () => {
      if (!professionalId) throw new Error('ID professionnel requis');

      const { data, error } = await supabase
        .from('pharmacie_employes')
        .select(`
          *,
          pharmacie:pharmacies(
            id,
            nom_commercial,
            ville,
            province
          )
        `)
        .eq('professionnel_id', professionalId)
        .order('date_debut', { ascending: false });

      if (error) throw error;

      return data as PharmacieEmploye[];
    },
    enabled: !!professionalId,
  });
};

// ============================================
// INSCRIPTION PHARMACIEN
// ============================================

export const useRegisterPharmacien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: InscriptionPharmacienFormData) => {
      // 1. Créer compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            user_type: 'pharmacien',
            nom: formData.nom,
            prenom: formData.prenom,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erreur création utilisateur');

      // 2. Générer code professionnel
      const { data: code } = await supabase.rpc('generate_professional_code', {
        prof_type: 'dr_pharmacie'
      });

      // 3. Créer profil professionnel
      const permissions = getPermissionsByRole(
        'dr_pharmacie',
        formData.est_pharmacien_titulaire || false
      );

      const professionalData = {
        user_id: authData.user.id,
        code_professionnel: code,
        type_professionnel: 'dr_pharmacie',
        nom: formData.nom,
        prenom: formData.prenom,
        nationalite: formData.nationalite,
        telephone_mobile: formData.telephone_mobile,
        email_professionnel: formData.email,
        diplome_pharmacie: formData.diplome_pharmacie,
        universite: formData.universite,
        annee_obtention_diplome: formData.annee_obtention_diplome,
        numero_inscription_onpg: formData.numero_inscription_onpg,
        date_inscription_onpg: formData.date_inscription_onpg,
        annees_experience: formData.annees_experience,
        pharmacie_principale_id: formData.pharmacie_id,
        est_pharmacien_titulaire: formData.est_pharmacien_titulaire || false,
        statut_emploi: formData.statut_emploi || 'titulaire',
        permissions: permissions,
        acces_gestion_stocks: true,
        acces_facturation: true,
        acces_rapports_activite: true,
        acces_administration: formData.est_pharmacien_titulaire || false,
        statut_verification: 'en_attente',
        compte_actif: false, // Activé après vérification
      };

      const { data: professional, error: profError } = await supabase
        .from('professionnels_sante_pharmacie')
        .insert([professionalData])
        .select()
        .single();

      if (profError) throw profError;

      // 4. Si pharmacie_id fourni, créer entrée dans pharmacie_employes
      if (formData.pharmacie_id) {
        await supabase
          .from('pharmacie_employes')
          .insert([{
            pharmacie_id: formData.pharmacie_id,
            professionnel_id: professional.id,
            type_relation: formData.statut_emploi || 'titulaire',
            date_debut: new Date().toISOString().split('T')[0],
            est_actif: true,
            type_contrat: formData.est_pharmacien_titulaire ? 'CDI' : 'CDI',
          }]);
      }

      return professional;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professionalKeys.all });
      toast.success('Inscription réussie', {
        description: 'Votre compte sera vérifié sous 48h. Vous recevrez un email de confirmation.'
      });
    },
    onError: (error: any) => {
      toast.error('Erreur lors de l\'inscription', {
        description: error.message
      });
    },
  });
};

// ============================================
// INSCRIPTION VENDEUR
// ============================================

export const useRegisterVendeur = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: InscriptionVendeurFormData) => {
      // 1. Créer compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            user_type: 'vendeur_pharmacie',
            nom: formData.nom,
            prenom: formData.prenom,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erreur création utilisateur');

      // 2. Générer code professionnel
      const { data: code } = await supabase.rpc('generate_professional_code', {
        prof_type: 'vendeur_pharmacie'
      });

      // 3. Créer profil professionnel
      const permissions = getPermissionsByRole('vendeur_pharmacie', false);

      const professionalData = {
        user_id: authData.user.id,
        code_professionnel: code,
        type_professionnel: 'vendeur_pharmacie',
        nom: formData.nom,
        prenom: formData.prenom,
        nationalite: formData.nationalite,
        telephone_mobile: formData.telephone_mobile,
        email_professionnel: formData.email,
        niveau_etude: formData.niveau_etude,
        formation_professionnelle: formData.formation_professionnelle,
        supervise_par_pharmacien_id: formData.supervise_par_pharmacien_id,
        pharmacie_principale_id: formData.pharmacie_id,
        est_pharmacien_titulaire: false,
        statut_emploi: formData.statut_emploi,
        permissions: permissions,
        acces_gestion_stocks: false,
        acces_facturation: false,
        acces_rapports_activite: false,
        acces_administration: false,
        statut_verification: 'en_attente',
        compte_actif: false,
      };

      const { data: professional, error: profError } = await supabase
        .from('professionnels_sante_pharmacie')
        .insert([professionalData])
        .select()
        .single();

      if (profError) throw profError;

      // 4. Créer entrée dans pharmacie_employes
      await supabase
        .from('pharmacie_employes')
        .insert([{
          pharmacie_id: formData.pharmacie_id,
          professionnel_id: professional.id,
          type_relation: formData.statut_emploi,
          date_debut: new Date().toISOString().split('T')[0],
          est_actif: false, // Activé après validation pharmacien titulaire
          type_contrat: 'CDI',
        }]);

      return professional;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professionalKeys.all });
      toast.success('Inscription réussie', {
        description: 'En attente de validation par le pharmacien titulaire.'
      });
    },
    onError: (error: any) => {
      toast.error('Erreur lors de l\'inscription', {
        description: error.message
      });
    },
  });
};

// ============================================
// METTRE À JOUR PROFIL
// ============================================

export const useUpdateProfessionalProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates
    }: {
      id: string;
      updates: Partial<ProfessionnelSantePharmacie>;
    }) => {
      const { data, error } = await supabase
        .from('professionnels_sante_pharmacie')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as ProfessionnelSantePharmacie;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: professionalKeys.all });
      queryClient.invalidateQueries({ queryKey: professionalKeys.detail(data.id) });
      toast.success('Profil mis à jour');
    },
    onError: (error: any) => {
      toast.error('Erreur', { description: error.message });
    },
  });
};

// ============================================
// ACTIVER/DÉSACTIVER EMPLOYÉ
// ============================================

export const useToggleEmployeeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      employeeId,
      active,
      motif
    }: {
      employeeId: string;
      active: boolean;
      motif?: string;
    }) => {
      const updates: any = {
        compte_actif: active,
      };

      if (!active) {
        updates.date_desactivation = new Date().toISOString();
        updates.motif_desactivation = motif;
      }

      const { data, error } = await supabase
        .from('professionnels_sante_pharmacie')
        .update(updates)
        .eq('id', employeeId)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professionalKeys.all });
      toast.success('Statut employé mis à jour');
    },
    onError: (error: any) => {
      toast.error('Erreur', { description: error.message });
    },
  });
};

// ============================================
// MODIFIER PERMISSIONS EMPLOYÉ
// ============================================

export const useUpdateEmployeePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      employeeId,
      permissions
    }: {
      employeeId: string;
      permissions: string[];
    }) => {
      const { data, error } = await supabase
        .from('professionnels_sante_pharmacie')
        .update({ permissions })
        .eq('id', employeeId)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professionalKeys.all });
      toast.success('Permissions mises à jour');
    },
    onError: (error: any) => {
      toast.error('Erreur', { description: error.message });
    },
  });
};

// ============================================
// VÉRIFIER PROFESSIONNEL (Admin)
// ============================================

export const useVerifyProfessional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      professionalId,
      approved,
      motif
    }: {
      professionalId: string;
      approved: boolean;
      motif?: string;
    }) => {
      const { data, error } = await supabase
        .from('professionnels_sante_pharmacie')
        .update({
          statut_verification: approved ? 'verifie' : 'refuse',
          date_verification: new Date().toISOString(),
          motif_refus: approved ? null : motif,
          compte_actif: approved,
        })
        .eq('id', professionalId)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: professionalKeys.all });
      toast.success(
        variables.approved 
          ? 'Professionnel approuvé' 
          : 'Professionnel refusé'
      );
    },
    onError: (error: any) => {
      toast.error('Erreur', { description: error.message });
    },
  });
};

