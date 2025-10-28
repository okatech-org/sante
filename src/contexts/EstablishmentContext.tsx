import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Establishment {
  id: string;
  raison_sociale: string;
  type_etablissement: string;
  ville: string;
  province: string;
  role_in_establishment: string;
  is_admin: boolean;
  permissions: string[];
  status: string;
  secteur: string;
  cnamgs_conventionne: boolean;
  telephone_standard?: string;
  email?: string;
  adresse_rue?: string;
  adresse_quartier?: string;
  nombre_lits_total?: number;
  service_urgences_actif?: boolean;
}

interface EstablishmentContextType {
  currentEstablishment: Establishment | null;
  establishments: Establishment[];
  loading: boolean;
  error: string | null;
  setCurrentEstablishment: (establishment: Establishment | null) => void;
  switchEstablishment: (establishmentId: string) => Promise<void>;
  refreshEstablishments: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
}

const EstablishmentContext = createContext<EstablishmentContextType | undefined>(undefined);

export function EstablishmentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentEstablishment, setCurrentEstablishment] = useState<Establishment | null>(null);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les établissements de l'utilisateur
  const fetchUserEstablishments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_user_establishments', {
        _user_id: user.id
      });

      if (error) {
        throw error;
      }

      setEstablishments(data || []);

      // Si aucun établissement n'est sélectionné, prendre le premier actif
      if (!currentEstablishment && data && data.length > 0) {
        const activeEstablishment = data.find(e => e.status === 'active') || data[0];
        setCurrentEstablishment(activeEstablishment);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des établissements:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Changer d'établissement
  const switchEstablishment = async (establishmentId: string) => {
    try {
      const establishment = establishments.find(e => e.id === establishmentId);
      if (establishment) {
        setCurrentEstablishment(establishment);
        
        // Sauvegarder la sélection dans le localStorage
        localStorage.setItem('selectedEstablishmentId', establishmentId);
        
        // Émettre un événement personnalisé pour notifier les autres composants
        window.dispatchEvent(new CustomEvent('establishmentChanged', { 
          detail: { establishment } 
        }));
      }
    } catch (err) {
      console.error('Erreur lors du changement d\'établissement:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du changement d\'établissement');
    }
  };

  // Rafraîchir la liste des établissements
  const refreshEstablishments = async () => {
    await fetchUserEstablishments();
  };

  // Vérifier les permissions
  const hasPermission = (permission: string): boolean => {
    if (!currentEstablishment) return false;
    return currentEstablishment.permissions?.includes(permission) || false;
  };

  // Vérifier si l'utilisateur est admin de l'établissement actuel
  const isAdmin = currentEstablishment?.is_admin || false;

  // Charger l'établissement sélectionné au démarrage
  useEffect(() => {
    if (user) {
      fetchUserEstablishments();
    }
  }, [user]);

  // Restaurer l'établissement sélectionné depuis le localStorage
  useEffect(() => {
    if (establishments.length > 0 && !currentEstablishment) {
      const savedEstablishmentId = localStorage.getItem('selectedEstablishmentId');
      if (savedEstablishmentId) {
        const savedEstablishment = establishments.find(e => e.id === savedEstablishmentId);
        if (savedEstablishment) {
          setCurrentEstablishment(savedEstablishment);
        }
      }
    }
  }, [establishments, currentEstablishment]);

  // Écouter les changements d'établissement
  useEffect(() => {
    const handleEstablishmentChange = (event: CustomEvent) => {
      // Optionnel : réagir aux changements d'établissement
      console.log('Établissement changé:', event.detail.establishment);
    };

    window.addEventListener('establishmentChanged', handleEstablishmentChange as EventListener);
    
    return () => {
      window.removeEventListener('establishmentChanged', handleEstablishmentChange as EventListener);
    };
  }, []);

  const value: EstablishmentContextType = {
    currentEstablishment,
    establishments,
    loading,
    error,
    setCurrentEstablishment,
    switchEstablishment,
    refreshEstablishments,
    hasPermission,
    isAdmin,
  };

  return (
    <EstablishmentContext.Provider value={value}>
      {children}
    </EstablishmentContext.Provider>
  );
}

export function useEstablishment() {
  const context = useContext(EstablishmentContext);
  if (context === undefined) {
    throw new Error('useEstablishment must be used within an EstablishmentProvider');
  }
  return context;
}

export default EstablishmentProvider;
