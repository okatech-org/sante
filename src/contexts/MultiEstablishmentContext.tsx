import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import type { ProfessionalContext, EstablishmentAffiliation, Permission } from '@/types/permissions';

interface MultiEstablishmentContextType {
  // États
  establishments: EstablishmentAffiliation[];
  currentEstablishment: ProfessionalContext | null;
  currentRole: string | null;
  availableRoles: string[];
  workContext: ProfessionalContext | null;
  loading: boolean;
  isLoading: boolean;
  
  // Actions
  selectEstablishment: (staffRoleId: string, role?: string) => Promise<void>;
  switchEstablishment: (staffRoleId: string, role?: string) => Promise<void>;
  switchRole: (role: string) => Promise<void>;
  refreshEstablishments: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  
  // Helpers
  isAdmin: boolean;
  isDirector: boolean;
  isDoctor: boolean;
  canManageStaff: boolean;
}

const MultiEstablishmentContext = createContext<MultiEstablishmentContextType | undefined>(undefined);

export const MultiEstablishmentProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [establishments, setEstablishments] = useState<EstablishmentAffiliation[]>([]);
  const [currentEstablishment, setCurrentEstablishment] = useState<ProfessionalContext | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger tous les établissements du professionnel via RPC
  const loadEstablishments = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      // Utilise la fonction RPC optimisée
      const { data, error } = await supabase.rpc('get_professional_establishments', {
        _user_id: user.id
      });

      if (error) {
        // Si l'erreur indique que l'utilisateur n'est pas un professionnel, c'est OK
        if (error.message?.includes('function') || error.code === 'PGRST116') {
          console.debug('Utilisateur non-professionnel');
          setIsLoading(false);
          return;
        }
        
        console.error('Erreur de chargement des établissements:', error);
        toast.error('Impossible de charger vos établissements');
        setIsLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        console.debug('Aucun établissement trouvé pour cet utilisateur');
        setEstablishments([]);
        setCurrentEstablishment(null);
        setIsLoading(false);
        return;
      }

      // Ajouter les propriétés legacy pour compatibilité
      const establishmentsWithLegacy = data.map((e: any) => ({
        ...e,
        id: e.staff_id,
        establishmentId: e.establishment_id,
        role: e.role_in_establishment,
        isAdmin: e.is_admin,
        position: e.job_position,
        matricule: e.matricule || null,
        isDepartmentHead: e.is_department_head || false,
        isEstablishmentAdmin: e.is_admin,
        establishment: {
          id: e.establishment_id,
          name: e.establishment_name,
          type: e.establishment_type,
          subType: undefined, // À charger si nécessaire
          city: undefined, // À charger si nécessaire
          logoUrl: undefined // À charger si nécessaire
        }
      }));
      
      setEstablishments(establishmentsWithLegacy);

      // Fonction pour mapper les rôles de la base de données vers les rôles du frontend
      const mapRoleToFrontend = (dbRole: string): string => {
        const roleLower = (dbRole || '').toLowerCase();
        // Priorité: Admin en premier (car "Administrateur" contient aussi "directeur")
        if (roleLower.includes('administrateur') || roleLower.includes('admin') || roleLower.includes('direction')) {
          return 'admin';
        }
        if (roleLower.includes('directeur') || roleLower.includes('director') || roleLower.includes('médecin en chef') || roleLower.includes('chef')) {
          return 'director';
        }
        if (roleLower.includes('médecin') || roleLower.includes('doctor') || roleLower.includes('medecin')) {
          return 'doctor';
        }
        if (roleLower.includes('pharmacien') || roleLower.includes('pharmacist')) {
          return 'pharmacist';
        }
        if (roleLower.includes('laborantin') || roleLower.includes('lab')) {
          return 'laborantin';
        }
        if (roleLower.includes('infirmier') || roleLower.includes('nurse')) {
          return 'nurse';
        }
        if (roleLower.includes('réception') || roleLower.includes('reception')) {
          return 'receptionist';
        }
        return roleLower;
      };

      // Auto-sélection si un seul établissement
      if (data.length === 1) {
        await loadEstablishmentContext(data[0].establishment_id);
        // Charger les rôles disponibles (avec priorité métier)
        const roles = data.map(e => mapRoleToFrontend(e.role_in_establishment as string));
        const rolePriority = ['admin', 'director', 'doctor', 'pharmacist', 'laborantin', 'nurse', 'receptionist'];
        const sortedRoles = roles.slice().sort((a, b) => {
          const indexA = rolePriority.indexOf(a) !== -1 ? rolePriority.indexOf(a) : 999;
          const indexB = rolePriority.indexOf(b) !== -1 ? rolePriority.indexOf(b) : 999;
          return indexA - indexB;
        });
        setAvailableRoles(sortedRoles);
        // Prioriser admin ou doctor plutôt que réceptionniste
        const preferredRole = sortedRoles.find(r => ['admin', 'director', 'doctor'].includes(r)) || sortedRoles[0] || 'doctor';
        setCurrentRole(preferredRole);
      } else if (data.length > 1) {
        // Vérifier si un établissement a été mémorisé
        const lastSelectedStaffId = localStorage.getItem('last_selected_establishment');
        const lastSelected = lastSelectedStaffId 
          ? data.find(e => e.staff_id === lastSelectedStaffId)
          : null;
        
        // Utiliser l'établissement mémorisé ou sélectionner le premier admin ou le premier de la liste
        const targetEstablishment = lastSelected || data.find(e => e.is_admin) || data[0];
        await loadEstablishmentContext(targetEstablishment.establishment_id);
        
        // Charger les rôles pour cet établissement
        const rolesForEstablishment = data
          .filter(e => e.establishment_id === targetEstablishment.establishment_id)
          .map(e => mapRoleToFrontend(e.role_in_establishment as string));
        const rolePriority = ['admin', 'director', 'doctor', 'pharmacist', 'laborantin', 'nurse', 'receptionist'];
        const sortedRoles = rolesForEstablishment.slice().sort((a, b) => {
          const indexA = rolePriority.indexOf(a) !== -1 ? rolePriority.indexOf(a) : 999;
          const indexB = rolePriority.indexOf(b) !== -1 ? rolePriority.indexOf(b) : 999;
          return indexA - indexB;
        });
        setAvailableRoles(sortedRoles);
        // Prioriser admin ou doctor plutôt que réceptionniste
        const preferredRole = sortedRoles.find(r => ['admin', 'director', 'doctor'].includes(r)) || sortedRoles[0] || mapRoleToFrontend(targetEstablishment.role_in_establishment);
        setCurrentRole(preferredRole);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des établissements:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Charger le contexte complet d'un établissement spécifique via RPC
  const loadEstablishmentContext = useCallback(async (establishmentId: string) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_professional_context', {
        _user_id: user.id,
        _establishment_id: establishmentId
      });

      if (error) {
        console.error('Erreur chargement contexte:', error);
        toast.error('Impossible de charger le contexte de l\'établissement');
        return;
      }

      if (data && data.length > 0) {
        // Récupérer l'établissement complet pour les infos additionnelles
        const establishment = establishments.find(e => e.establishment_id === establishmentId);
        
        // Ajouter les propriétés legacy pour compatibilité
        const contextWithLegacy = {
          ...data[0],
          id: data[0].establishment_id,
          role: data[0].role_in_establishment,
          isAdmin: data[0].is_admin,
          establishmentId: data[0].establishment_id,
          isDepartmentHead: data[0].is_department_head,
          establishment: establishment?.establishment || {
            id: data[0].establishment_id,
            name: data[0].establishment_name,
            type: establishment?.establishment_type
          }
        };
        
        setCurrentEstablishment(contextWithLegacy);
        
        if (establishment) {
          toast.success(`Connecté à ${establishment.establishment_name}`);
        }
      }
    } catch (error) {
      console.error('Erreur chargement contexte établissement:', error);
    }
  }, [user?.id, establishments]);

  // Sélectionner un établissement par son staff_id
  const selectEstablishment = useCallback(async (staffRoleId: string, role?: string) => {
    const selectedEstablishment = establishments.find(e => e.staff_id === staffRoleId);
    
    if (!selectedEstablishment) {
      toast.error('Établissement non trouvé');
      return;
    }

    await loadEstablishmentContext(selectedEstablishment.establishment_id);
    
    // Définir le rôle
    const selectedRole = role || selectedEstablishment.role_in_establishment;
    setCurrentRole(selectedRole);
    localStorage.setItem('current_role', selectedRole);
    
    // Mémoriser l'établissement sélectionné pour auto-sélection future
    localStorage.setItem('last_selected_establishment', staffRoleId);
  }, [establishments, loadEstablishmentContext]);

  // Changer d'établissement (alias de selectEstablishment)
  const switchEstablishment = useCallback(async (staffRoleId: string, role?: string) => {
    await selectEstablishment(staffRoleId, role);
  }, [selectEstablishment]);

  // Changer de rôle dans le même établissement
  const switchRole = useCallback(async (role: string) => {
    setCurrentRole(role);
    localStorage.setItem('current_role', role);
    
    // Charger les rôles disponibles pour l'établissement actuel
    if (currentEstablishment) {
      const rolesForEstablishment = establishments
        .filter(e => e.establishment_id === currentEstablishment.establishment_id)
        .map(e => e.role_in_establishment);
      setAvailableRoles(rolesForEstablishment);
    }
    
    toast.success(`Basculé vers le rôle: ${role}`);
    // Ne pas recharger la page pour une transition instantanée
  }, [currentEstablishment, establishments]);

  // Rafraîchir la liste des établissements
  const refreshEstablishments = useCallback(async () => {
    await loadEstablishments();
  }, [loadEstablishments]);

  // Charger au montage et à chaque changement d'utilisateur
  useEffect(() => {
    loadEstablishments();
  }, [loadEstablishments]);

  // Vérifier une permission spécifique
  const hasPermission = useCallback((permission: string): boolean => {
    if (!currentEstablishment) return false;
    if (currentEstablishment.permissions.includes('all' as any)) return true;
    return currentEstablishment.permissions.includes(permission as any);
  }, [currentEstablishment]);

  // Vérifier si l'utilisateur a au moins une des permissions listées
  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    if (!currentEstablishment) return false;
    if (currentEstablishment.permissions.includes('all' as any)) return true;
    return permissions.some(p => currentEstablishment.permissions.includes(p as any));
  }, [currentEstablishment]);

  // Helpers pour les rôles courants
  const isAdmin = currentEstablishment?.is_admin || false;
  const isDirector = currentEstablishment?.role_in_establishment === 'director';
  const isDoctor = currentEstablishment?.role_in_establishment === 'doctor';
  const canManageStaff = hasPermission('manage_staff');

  const value: MultiEstablishmentContextType = {
    establishments,
    currentEstablishment,
    currentRole,
    availableRoles,
    workContext: currentEstablishment,
    loading: isLoading,
    isLoading,
    selectEstablishment,
    switchEstablishment,
    switchRole,
    refreshEstablishments,
    hasPermission,
    hasAnyPermission,
    isAdmin,
    isDirector,
    isDoctor,
    canManageStaff
  };

  return (
    <MultiEstablishmentContext.Provider value={value}>
      {children}
    </MultiEstablishmentContext.Provider>
  );
};

export const useMultiEstablishment = () => {
  const context = useContext(MultiEstablishmentContext);
  if (context === undefined) {
    throw new Error('useMultiEstablishment must be used within a MultiEstablishmentProvider');
  }
  return context;
};
