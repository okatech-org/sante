import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';

/**
 * Hook pour gérer la configuration initiale des professionnels
 * et la redirection selon le nombre d'établissements
 */
export function useProfessionalSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { establishments, isLoading } = useMultiEstablishment();

  useEffect(() => {
    if (!user || isLoading) return;

    // Si le professionnel n'a qu'un établissement, aller directement au dashboard
    if (establishments.length === 1) {
      // Cas spécial pour SOGARA avec le dashboard dédié
      if (establishments[0].establishmentId === 'a1b2c3d4-e5f6-7890-abcd-ef1234567890') {
        navigate('/professional');
      } else {
        navigate('/professional');
      }
    } else if (establishments.length > 1) {
      // Plusieurs établissements : page de sélection
      navigate('/professional/select-establishment');
    } else {
      // Aucun établissement : créer le profil
      navigate('/professional/setup');
    }
  }, [user, establishments, isLoading, navigate]);

  return { establishments, isLoading };
}
