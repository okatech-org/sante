import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface Department {
  id: string;
  name: string;
  code: string;
}

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
  departmentId?: string;
  department?: Department;
  role: string;
  position?: string;
  isDepartmentHead: boolean;
  isEstablishmentAdmin: boolean;
  permissions: Record<string, any>;
  status: string;
  matricule?: string;
}

interface MultiEstablishmentContextType {
  // États
  establishments: StaffRole[];
  currentEstablishment: StaffRole | null;
  currentPermissions: Record<string, any>;
  isLoading: boolean;
  
  // Actions
  selectEstablishment: (staffRoleId: string) => Promise<void>;
  switchEstablishment: (staffRoleId: string) => Promise<void>;
  refreshEstablishments: () => Promise<void>;
  hasPermission: (module: string, action: string) => boolean;
  hasAnyPermission: (module: string, actions: string[]) => boolean;
  
  // Helpers
  isDirector: boolean;
  isAdmin: boolean;
  isDepartmentHead: boolean;
  canManageStaff: boolean;
  canViewReports: boolean;
}

const MultiEstablishmentContext = createContext<MultiEstablishmentContextType | undefined>(undefined);

export const MultiEstablishmentProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [establishments, setEstablishments] = useState<StaffRole[]>([]);
  const [currentEstablishment, setCurrentEstablishment] = useState<StaffRole | null>(null);
  const [currentPermissions, setCurrentPermissions] = useState<Record<string, any>>({});
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

      if (profError) {
        console.error('Erreur lors du chargement du profil professionnel:', profError);
        setIsLoading(false);
        return;
      }

      if (!professional) {
        setIsLoading(false);
        return;
      }

      // 2. Récupérer tous les établissements où travaille le professionnel
      const { data: staffRoles, error: staffError } = await supabase
        .from('establishment_staff')
        .select(`
          id,
          establishment_id,
          department_id,
          role,
          position,
          is_department_head,
          is_establishment_admin,
          permissions,
          status,
          matricule,
          establishments!inner (
            id,
            name,
            type,
            sub_type,
            address,
            city,
            logo_url,
            is_active
          ),
          establishment_departments (
            id,
            name,
            code
          )
        `)
        .eq('professional_id', professional.id)
        .eq('status', 'active');

      if (staffError) {
        console.error('Erreur lors du chargement des établissements:', staffError);
        toast.error('Impossible de charger vos établissements');
        setIsLoading(false);
        return;
      }

      // 3. Transformer les données
      const formattedStaffRoles: StaffRole[] = (staffRoles || []).map(role => ({
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
        departmentId: role.department_id,
        department: role.establishment_departments ? {
          id: role.establishment_departments.id,
          name: role.establishment_departments.name,
          code: role.establishment_departments.code
        } : undefined,
        role: role.role,
        position: role.position,
        isDepartmentHead: role.is_department_head,
        isEstablishmentAdmin: role.is_establishment_admin,
        permissions: role.permissions || {},
        status: role.status,
        matricule: role.matricule
      }));

      setEstablishments(formattedStaffRoles);

      // 4. Récupérer la session établissement actuelle
      const { data: session } = await supabase
        .from('user_establishment_session')
        .select('staff_id')
        .eq('user_id', user.id)
        .single();

      // 5. Sélectionner l'établissement (session ou premier disponible)
      if (session?.staff_id) {
        const savedRole = formattedStaffRoles.find(r => r.id === session.staff_id);
        if (savedRole) {
          await selectEstablishment(savedRole.id, formattedStaffRoles);
        } else if (formattedStaffRoles.length > 0) {
          await selectEstablishment(formattedStaffRoles[0].id, formattedStaffRoles);
        }
      } else if (formattedStaffRoles.length > 0) {
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

    try {
      // 1. Récupérer les permissions complètes
      const { data: permissions, error: permError } = await supabase.rpc(
        'get_user_establishment_permissions',
        {
          p_user_id: user?.id,
          p_establishment_id: selectedRole.establishmentId
        }
      );

      if (permError) {
        console.error('Erreur lors du chargement des permissions:', permError);
      }

      // 2. Mettre à jour le contexte
      setCurrentEstablishment(selectedRole);
      setCurrentPermissions(permissions || {});

      // 3. Sauvegarder la session
      if (user?.id) {
        await supabase
          .from('user_establishment_session')
          .upsert({
            user_id: user.id,
            establishment_id: selectedRole.establishmentId,
            staff_id: selectedRole.id,
            last_accessed: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'établissement:', error);
      toast.error('Impossible de sélectionner cet établissement');
    }
  };

  // Changer d'établissement
  const switchEstablishment = async (staffRoleId: string) => {
    await selectEstablishment(staffRoleId);
    toast.success('Établissement changé avec succès');
  };

  // Rafraîchir la liste des établissements
  const refreshEstablishments = async () => {
    setIsLoading(true);
    await loadEstablishments();
  };

  // Vérifier une permission
  const hasPermission = (module: string, action: string): boolean => {
    if (!currentPermissions[module]) return false;
    if (Array.isArray(currentPermissions[module])) {
      return currentPermissions[module].includes(action);
    }
    return currentPermissions[module][action] === true;
  };

  // Vérifier si au moins une permission existe
  const hasAnyPermission = (module: string, actions: string[]): boolean => {
    return actions.some(action => hasPermission(module, action));
  };

  // Helpers pour les rôles courants
  const isDirector = currentEstablishment?.role === 'director';
  const isAdmin = currentEstablishment?.isEstablishmentAdmin || isDirector;
  const isDepartmentHead = currentEstablishment?.isDepartmentHead || false;
  const canManageStaff = hasAnyPermission('staff', ['add', 'edit', 'delete']);
  const canViewReports = hasPermission('reports', 'view');

  // Charger les établissements au montage et quand l'utilisateur change
  useEffect(() => {
    loadEstablishments();
  }, [user?.id]);

  return (
    <MultiEstablishmentContext.Provider
      value={{
        establishments,
        currentEstablishment,
        currentPermissions,
        isLoading,
        selectEstablishment,
        switchEstablishment,
        refreshEstablishments,
        hasPermission,
        hasAnyPermission,
        isDirector,
        isAdmin,
        isDepartmentHead,
        canManageStaff,
        canViewReports
      }}
    >
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