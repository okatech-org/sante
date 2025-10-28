import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Building2, Briefcase, Stethoscope, Users } from 'lucide-react';

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
  hasPermission: (permission: string) => boolean;
  canAccessEstablishment: (establishmentId: string) => boolean;
}

const MultiEstablishmentContext = createContext<MultiEstablishmentContextType | undefined>(undefined);

// Provider
export function MultiEstablishmentProvider({ children }: { children: ReactNode }) {
  const [workContext, setWorkContext] = useState<WorkContext | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Charger le contexte de travail au démarrage
  useEffect(() => {
    loadWorkContext();
  }, []);

  // Charger tous les établissements affiliés de l'utilisateur
  const loadWorkContext = async () => {
    try {
      setLoading(true);
      
      // Obtenir l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setWorkContext(null);
        return;
      }

      // Récupérer le profil professionnel de l'utilisateur
      const { data: professionalProfile, error: profileError } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError || !professionalProfile) {
        console.error('Erreur chargement profil professionnel:', profileError);
        setWorkContext(null);
        return;
      }

      // Charger toutes les affiliations actives
      const { data: affiliations, error: affiliationError } = await supabase
        .from('professional_affiliations')
        .select('*, establishments(*)')
        .eq('professional_id', professionalProfile.id)
        .eq('status', 'active');

      if (affiliationError) {
        console.error('Erreur chargement affiliations:', affiliationError);
        setWorkContext(null);
        return;
      }

      // Transformer les données
      const formattedAffiliations: ProfessionalAffiliation[] = (affiliations || []).map((aff: any) => ({
        id: aff.id,
        establishmentId: aff.establishment_id,
        establishment: {
          id: aff.establishments?.id,
          name: aff.establishments?.name,
          type: aff.establishments?.type,
          subtype: aff.establishments?.subtype,
          sector: aff.establishments?.sector,
          city: aff.establishments?.city,
          province: aff.establishments?.province,
          hasPortal: aff.establishments?.has_dedicated_portal,
          portalSubdomain: aff.establishments?.portal_subdomain,
          theme: aff.establishments?.portal_theme
        },
        role: aff.role,
        department: aff.department,
        permissions: aff.permissions || [],
        isDepartmentHead: aff.is_department_head,
        isEstablishmentAdmin: aff.is_establishment_admin,
        schedule: aff.schedule,
        status: aff.status
      }));

      // Récupérer le dernier contexte actif ou prendre le premier
      const lastContextId = localStorage.getItem('lastEstablishmentId');
      let currentAffiliation = formattedAffiliations.find(a => a.establishmentId === lastContextId);
      
      if (!currentAffiliation && formattedAffiliations.length > 0) {
        currentAffiliation = formattedAffiliations[0];
      }

      setWorkContext({
        userId: user.id,
        currentEstablishment: currentAffiliation?.establishment,
        currentAffiliation,
        allAffiliations: formattedAffiliations,
        permissions: currentAffiliation?.permissions || []
      });

      // Sauvegarder le contexte actuel
      if (currentAffiliation) {
        localStorage.setItem('lastEstablishmentId', currentAffiliation.establishmentId);
      }
    } catch (error) {
      console.error('Erreur chargement contexte:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le contexte de travail",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Changer d'établissement
  const switchEstablishment = async (establishmentId: string) => {
    if (!workContext) return;

    const newAffiliation = workContext.allAffiliations.find(
      a => a.establishmentId === establishmentId
    );

    if (!newAffiliation) {
      toast({
        title: "Erreur",
        description: "Vous n'êtes pas affilié à cet établissement",
        variant: "destructive"
      });
      return;
    }

    // Enregistrer l'activité dans l'audit
    await supabase.from('multi_establishment_audit').insert({
      user_id: workContext.userId,
      establishment_id: establishmentId,
      action: 'switch_context',
      details: {
        from: workContext.currentEstablishment?.id,
        to: establishmentId
      }
    });

    // Mettre à jour le contexte
    setWorkContext({
      ...workContext,
      currentEstablishment: newAffiliation.establishment,
      currentAffiliation: newAffiliation,
      permissions: newAffiliation.permissions
    });

    // Sauvegarder dans localStorage
    localStorage.setItem('lastEstablishmentId', establishmentId);

    toast({
      title: "Contexte changé",
      description: `Vous travaillez maintenant à ${newAffiliation.establishment.name}`,
    });
  };

  // Rafraîchir le contexte
  const refreshContext = async () => {
    await loadWorkContext();
  };

  // Vérifier une permission
  const hasPermission = (permission: string): boolean => {
    if (!workContext) return false;
    
    // Admin a tous les droits
    if (workContext.permissions.includes('*')) return true;
    
    // Admin de l'établissement a tous les droits dans son établissement
    if (workContext.currentAffiliation?.isEstablishmentAdmin) return true;
    
    // Vérifier la permission spécifique
    return workContext.permissions.includes(permission);
  };

  // Vérifier l'accès à un établissement
  const canAccessEstablishment = (establishmentId: string): boolean => {
    if (!workContext) return false;
    return workContext.allAffiliations.some(a => a.establishmentId === establishmentId);
  };

  return (
    <MultiEstablishmentContext.Provider value={{
      workContext,
      loading,
      switchEstablishment,
      refreshContext,
      hasPermission,
      canAccessEstablishment
    }}>
      {children}
    </MultiEstablishmentContext.Provider>
  );
}

// Hook
export function useMultiEstablishment() {
  const context = useContext(MultiEstablishmentContext);
  if (context === undefined) {
    throw new Error('useMultiEstablishment must be used within MultiEstablishmentProvider');
  }
  return context;
}

// Composant de sélection d'établissement
export function EstablishmentSelector() {
  const { workContext, switchEstablishment } = useMultiEstablishment();
  const [isOpen, setIsOpen] = useState(false);

  if (!workContext || workContext.allAffiliations.length <= 1) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return <Building2 className="w-4 h-4" />;
      case 'clinic':
        return <Stethoscope className="w-4 h-4" />;
      case 'cabinet':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
      >
        {getIcon(workContext.currentEstablishment?.type || 'hospital')}
        <div className="text-left">
          <p className="text-sm font-semibold">
            {workContext.currentEstablishment?.name || 'Sélectionner'}
          </p>
          <p className="text-xs text-gray-500">
            {workContext.currentAffiliation?.role}
          </p>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
              Vos établissements
            </p>
            {workContext.allAffiliations.map((affiliation) => (
              <button
                key={affiliation.id}
                onClick={() => {
                  switchEstablishment(affiliation.establishmentId);
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                  affiliation.establishmentId === workContext.currentEstablishment?.id
                    ? 'bg-blue-50'
                    : ''
                }`}
              >
                <div className="mt-1">
                  {getIcon(affiliation.establishment.type)}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">
                    {affiliation.establishment.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {affiliation.role}
                    {affiliation.department && ` • ${affiliation.department}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {affiliation.establishment.city}, {affiliation.establishment.province}
                  </p>
                </div>
                {affiliation.isEstablishmentAdmin && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    Admin
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
