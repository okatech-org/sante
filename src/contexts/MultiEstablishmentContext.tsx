import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types
export interface Establishment {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'cabinet' | 'pharmacy' | 'laboratory';
  subtype?: string;
  sector: 'public' | 'private' | 'confessional' | 'military';
  city: string;
  province: string;
  logo?: string;
  portalSubdomain?: string;
  hasPortal: boolean;
  theme?: {
    primaryColor: string;
    logo: string;
  };
}

export interface ProfessionalAffiliation {
  id: string;
  establishmentId: string;
  establishment: Establishment;
  role: string;
  department?: string;
  permissions: string[];
  isDepartmentHead: boolean;
  isEstablishmentAdmin: boolean;
  schedule?: any;
  status: 'active' | 'inactive' | 'suspended';
}

export interface WorkContext {
  userId: string;
  currentEstablishment?: Establishment;
  currentAffiliation?: ProfessionalAffiliation;
  allAffiliations: ProfessionalAffiliation[];
  permissions: string[];
}

// Context
interface MultiEstablishmentContextType {
  workContext: WorkContext | null;
  loading: boolean;
  switchEstablishment: (establishmentId: string) => Promise<void>;
  refreshContext: () => Promise<void>;
}

const MultiEstablishmentContext = createContext<MultiEstablishmentContextType | undefined>(undefined);

// Provider
interface MultiEstablishmentProviderProps {
  children: ReactNode;
}

export const MultiEstablishmentProvider: React.FC<MultiEstablishmentProviderProps> = ({ children }) => {
  const [workContext, setWorkContext] = useState<WorkContext | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Simplified implementation without database calls to non-existent tables
  const loadWorkContext = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setWorkContext(null);
        return;
      }

      // Simple context for now
      setWorkContext({
        userId: user.id,
        allAffiliations: [],
        permissions: []
      });
    } catch (error) {
      console.error('Error loading work context:', error);
      setWorkContext(null);
    } finally {
      setLoading(false);
    }
  };

  const switchEstablishment = async (establishmentId: string) => {
    // Simplified - just reload context
    await loadWorkContext();
  };

  const refreshContext = async () => {
    await loadWorkContext();
  };

  useEffect(() => {
    loadWorkContext();
  }, []);

  return (
    <MultiEstablishmentContext.Provider 
      value={{ workContext, loading, switchEstablishment, refreshContext }}
    >
      {children}
    </MultiEstablishmentContext.Provider>
  );
};

// Hook
export const useMultiEstablishment = () => {
  const context = useContext(MultiEstablishmentContext);
  if (context === undefined) {
    throw new Error('useMultiEstablishment must be used within MultiEstablishmentProvider');
  }
  return context;
};
