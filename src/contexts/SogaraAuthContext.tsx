import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SogaraUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
  matricule: string;
  permissions: string[];
}

interface SogaraAuthContextType {
  user: SogaraUser | null;
  isLoading: boolean;
  isDirector: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isNurse: boolean;
  hasPermission: (permission: string) => boolean;
}

// Mapping des données SOGARA
const SOGARA_USERS: Record<string, Omit<SogaraUser, 'id' | 'email'>> = {
  'directeur.sogara@sante.ga': {
    fullName: 'Dr. Jules DJEKI',
    role: 'director',
    department: 'Direction Médicale',
    matricule: 'DIR-001',
    permissions: ['all']
  },
  'admin.sogara@sante.ga': {
    fullName: 'Jean-Pierre Mbadinga',
    role: 'admin',
    department: 'Administration',
    matricule: 'ADM-001',
    permissions: ['manage_staff', 'view_reports', 'manage_schedule']
  },
  'dr.okemba.sogara@sante.ga': {
    fullName: 'Dr. Marie Okemba',
    role: 'doctor',
    department: 'Médecine Générale',
    matricule: 'MED-012',
    permissions: ['consultation', 'prescription', 'view_dmp']
  },
  'dr.nguema.sogara@sante.ga': {
    fullName: 'Dr. Paul Nguema',
    role: 'doctor',
    department: 'Urgences',
    matricule: 'MED-015',
    permissions: ['consultation', 'prescription', 'view_dmp', 'emergency']
  },
  'dr.mbina.sogara@sante.ga': {
    fullName: 'Dr. Léa Mbina',
    role: 'doctor',
    department: 'Cardiologie',
    matricule: 'MED-018',
    permissions: ['consultation', 'prescription', 'view_dmp']
  },
  'dr.mezui.sogara@sante.ga': {
    fullName: 'Dr. Thomas Mezui',
    role: 'doctor',
    department: 'Pédiatrie',
    matricule: 'MED-022',
    permissions: ['consultation', 'prescription', 'view_dmp']
  },
  'nurse.mba.sogara@sante.ga': {
    fullName: 'Sylvie Mba',
    role: 'nurse',
    department: 'Soins Intensifs',
    matricule: 'INF-025',
    permissions: ['care', 'view_dmp', 'vitals']
  },
  'nurse.nze.sogara@sante.ga': {
    fullName: 'Patricia Nze',
    role: 'nurse',
    department: 'Urgences',
    matricule: 'INF-028',
    permissions: ['care', 'view_dmp', 'vitals', 'emergency']
  },
  'nurse.andeme.sogara@sante.ga': {
    fullName: 'Claire Andeme',
    role: 'nurse',
    department: 'Maternité',
    matricule: 'INF-030',
    permissions: ['care', 'view_dmp', 'vitals', 'maternity']
  },
  'lab.tech.sogara@sante.ga': {
    fullName: 'André Moussavou',
    role: 'lab_tech',
    department: 'Laboratoire',
    matricule: 'LAB-008',
    permissions: ['lab_tests', 'view_results']
  },
  'pharma.sogara@sante.ga': {
    fullName: 'Dr. Lydie Kombila',
    role: 'pharmacist',
    department: 'Pharmacie',
    matricule: 'PHAR-004',
    permissions: ['pharmacy', 'dispense_medication']
  },
  'accueil.sogara@sante.ga': {
    fullName: 'Nadège Oyono',
    role: 'receptionist',
    department: 'Accueil',
    matricule: 'REC-002',
    permissions: ['reception', 'appointments']
  }
};

const SogaraAuthContext = createContext<SogaraAuthContextType | undefined>(undefined);

export function SogaraAuthProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<SogaraUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser?.email && SOGARA_USERS[authUser.email]) {
      const sogaraData = SOGARA_USERS[authUser.email];
      setUser({
        id: authUser.id,
        email: authUser.email,
        ...sogaraData
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [authUser]);

  const isDirector = user?.role === 'director';
  const isAdmin = user?.role === 'admin' || isDirector;
  const isDoctor = user?.role === 'doctor';
  const isNurse = user?.role === 'nurse';

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  return (
    <SogaraAuthContext.Provider
      value={{
        user,
        isLoading,
        isDirector,
        isAdmin,
        isDoctor,
        isNurse,
        hasPermission
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
