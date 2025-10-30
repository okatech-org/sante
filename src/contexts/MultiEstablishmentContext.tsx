import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface Establishment {
  id: string;
  name: string;
  type: string;
  subType?: string;
  address?: string;
  city?: string;
  logoUrl?: string;
  isActive: boolean;
}

interface StaffRole {
  id: string;
  establishmentId: string;
  establishment: Establishment;
  role: string;
  permissions: string[];
  status: string;
  isAdmin: boolean;
  department?: string;
  position?: string;
  isEstablishmentAdmin?: boolean;
}

interface MultiEstablishmentContextType {
  // États
  establishments: StaffRole[];
  currentEstablishment: StaffRole | null;
  workContext: StaffRole | null;
  loading: boolean;
  isLoading: boolean;
  
  // Actions
  selectEstablishment: (staffRoleId: string) => Promise<void>;
  switchEstablishment: (staffRoleId: string) => Promise<void>;
  refreshEstablishments: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  
  // Helpers
  isAdmin: boolean;
  isDirector: boolean;
  canManageStaff: boolean;
}

const MultiEstablishmentContext = createContext<MultiEstablishmentContextType | undefined>(undefined);

export const MultiEstablishmentProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [establishments, setEstablishments] = useState<StaffRole[]>([]);
  const [currentEstablishment, setCurrentEstablishment] = useState<StaffRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les établissements du professionnel
  const loadEstablishments = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      // 1. Récupérer le profil professionnel
      const { data: professional, error: profError } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profError || !professional) {
        console.error('Erreur de chargement du profil:', profError);
        setIsLoading(false);
        return;
      }

      // 2. Récupérer les rôles dans les établissements
      const { data: staffRoles, error: staffError } = await supabase
        .from('establishment_staff')
        .select(`
          id,
          establishment_id,
          role_in_establishment,
          permissions,
          is_admin,
          status,
          establishments (
            id,
            name,
            type,
            sub_type,
            address,
            city,
            logo_url,
            is_active
          )
        `)
        .eq('professional_id', professional.id);

      if (staffError) {
        console.error('Erreur de chargement des établissements:', staffError);
        toast.error('Impossible de charger vos établissements');
        setIsLoading(false);
        return;
      }

      // 3. Transformer les données
      const formattedStaffRoles: StaffRole[] = (staffRoles || []).map((role: any) => ({
        id: role.id,
        establishmentId: role.establishment_id,
        establishment: {
          id: role.establishments.id,
          name: role.establishments.name,
          type: role.establishments.type,
          subType: role.establishments.sub_type,
          address: role.establishments.address,
          city: role.establishments.city,
          logoUrl: role.establishments.logo_url,
          isActive: role.establishments.is_active
        },
        role: role.role_in_establishment,
        permissions: role.permissions || [],
        status: role.status || 'active',
        isAdmin: role.is_admin || false
      }));

      setEstablishments(formattedStaffRoles);

      // 4. Sélectionner le premier établissement par défaut
      if (formattedStaffRoles.length > 0) {
        await selectEstablishment(formattedStaffRoles[0].id, formattedStaffRoles);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des établissements:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Sélectionner un établissement
  const selectEstablishment = async (staffRoleId: string, roles?: StaffRole[]) => {
    const availableRoles = roles || establishments;
    const selectedRole = availableRoles.find(r => r.id === staffRoleId);
    
    if (!selectedRole) {
      toast.error('Établissement non trouvé');
      return;
    }

    setCurrentEstablishment(selectedRole);
    toast.success(`Connecté à ${selectedRole.establishment.name}`);
  };

  // Changer d'établissement
  const switchEstablishment = async (staffRoleId: string) => {
    await selectEstablishment(staffRoleId);
  };

  // Rafraîchir les établissements
  const refreshEstablishments = async () => {
    await loadEstablishments();
  };

  // Charger au montage et à chaque changement d'utilisateur
  useEffect(() => {
    loadEstablishments();
  }, [user?.id]);

  // Helpers
  const isAdmin = currentEstablishment?.isAdmin || false;
  const isDirector = isAdmin;
  const canManageStaff = isAdmin;

  const hasPermission = (permission: string): boolean => {
    if (!currentEstablishment) return false;
    return currentEstablishment.permissions.includes(permission) || isAdmin;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!currentEstablishment) return false;
    return permissions.some(p => currentEstablishment.permissions.includes(p)) || isAdmin;
  };

  const value: MultiEstablishmentContextType = {
    establishments,
    currentEstablishment,
    workContext: currentEstablishment,
    loading: isLoading,
    isLoading,
    selectEstablishment,
    switchEstablishment,
    refreshEstablishments,
    hasPermission,
    hasAnyPermission,
    isAdmin,
    isDirector,
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
