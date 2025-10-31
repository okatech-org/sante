import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import type { Permission } from '@/types/permissions';

/**
 * SogaraAuthContext - Wrapper léger pour SOGARA
 * 
 * Ce contexte n'est plus qu'un alias pour MultiEstablishmentContext
 * avec quelques helpers spécifiques à SOGARA pour la rétrocompatibilité.
 * 
 * Les données ne sont plus hardcodées ici, elles viennent de la DB
 * via les fonctions RPC get_professional_context et get_professional_establishments.
 */

interface SogaraUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
  matricule: string;
  permissions: Permission[];
}

interface SogaraAuthContextType {
  user: SogaraUser | null;
  isLoading: boolean;
  isDirector: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isNurse: boolean;
  hasPermission: (permission: Permission) => boolean;
}

const SogaraAuthContext = createContext<SogaraAuthContextType | undefined>(undefined);

export function SogaraAuthProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const multiEstablishment = useMultiEstablishment();

  // Transformer le contexte multi-établissement en format SOGARA legacy
  const sogaraUser: SogaraUser | null = multiEstablishment.currentEstablishment
    ? {
        id: multiEstablishment.currentEstablishment.professional_id,
        email: multiEstablishment.currentEstablishment.professional_email,
        fullName: multiEstablishment.currentEstablishment.professional_name,
        role: multiEstablishment.currentEstablishment.role_in_establishment,
        department: multiEstablishment.currentEstablishment.department || '',
        matricule: multiEstablishment.currentEstablishment.matricule || '',
        permissions: multiEstablishment.currentEstablishment.permissions,
      }
    : null;

  // Helpers spécifiques SOGARA (pour rétrocompatibilité)
  const isDirector = multiEstablishment.isDirector;
  const isAdmin = multiEstablishment.isAdmin;
  const isDoctor = sogaraUser?.role === 'doctor';
  const isNurse = sogaraUser?.role === 'nurse';

  return (
    <SogaraAuthContext.Provider
      value={{
        user: sogaraUser,
        isLoading: multiEstablishment.isLoading,
        isDirector,
        isAdmin,
        isDoctor,
        isNurse,
        hasPermission: multiEstablishment.hasPermission
      }}
    >
      {children}
    </SogaraAuthContext.Provider>
  );
}

export function useSogaraAuth() {
  const context = useContext(SogaraAuthContext);
  if (context === undefined) {
    throw new Error('useSogaraAuth must be used within a SogaraAuthProvider');
  }
  return context;
}

// Hook pour vérifier si on est dans le contexte SOGARA
export function useIsSogara() {
  const { user } = useAuth();
  return user?.email?.includes('.sogara@sante.ga') || false;
}
