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
      navigate('/professional/dashboard');
    } else if (establishments.length > 1) {
      // Vérifier si un établissement a été mémorisé
      const lastSelectedStaffId = localStorage.getItem('last_selected_establishment');
      const hasLastSelected = lastSelectedStaffId && establishments.some(e => e.staff_id === lastSelectedStaffId);
      
      if (hasLastSelected) {
        // Établissement mémorisé trouvé, rediriger vers le dashboard
        // (le contexte va auto-charger cet établissement)
        navigate('/professional/dashboard');
      } else {
        // Aucun établissement mémorisé, afficher la page de sélection
        navigate('/professional/select-establishment');
      }
    } else {
      // Aucun établissement : créer le profil
      navigate('/professional/setup');
    }
  }, [user, establishments, isLoading, navigate]);

  return { establishments, isLoading };
}
