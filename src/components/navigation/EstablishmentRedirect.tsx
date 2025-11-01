// Composant pour gérer les redirections intelligentes des établissements
// SANTE.GA - Plateforme E-Santé Gabon

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { establishmentsService } from "@/services/establishments.service";
import { Establishment } from "@/types/establishment";

interface EstablishmentRedirectProps {
  establishment: Establishment;
  children?: React.ReactNode;
}

/**
 * Composant qui gère la redirection vers la bonne page d'un établissement
 * Prend en compte les URLs personnalisées et les cas spéciaux (Ministère, SOGARA, etc.)
 */
export const EstablishmentRedirect = ({ establishment, children }: EstablishmentRedirectProps) => {
  const navigate = useNavigate();

  const handleRedirect = async () => {
    // Cas spécial 1: Ministère de la Santé → Page ministère
    if (establishment.name.includes('Ministère de la Santé')) {
      window.location.href = '/gouv';
      return;
    }

    // Cas spécial 2: Clinique SOGARA → Page SOGARA personnalisée
    if (establishment.name === 'Clinique SOGARA') {
      window.location.href = '/sogara';
      return;
    }

    // Cas général: Obtenir l'URL via le service
    const homePageInfo = await establishmentsService.getHomePage(establishment.id, establishment.name);
    const url = homePageInfo?.customUrl || establishmentsService.getEstablishmentHomeUrl(establishment);
    
    // Ouvrir dans un nouvel onglet pour les pages publiques
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (!children) {
      handleRedirect();
    }
  }, [establishment]);

  // Si des children sont fournis, retourner un bouton cliquable
  if (children) {
    return (
      <div onClick={handleRedirect} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    );
  }

  // Sinon, redirection automatique
  return null;
};

/**
 * Hook pour obtenir l'URL d'un établissement
 */
export const useEstablishmentUrl = (establishment: Establishment): string => {
  // Cas spéciaux avec pages dédiées
  if (establishment.name.includes('Ministère de la Santé')) {
    return '/gouv';
  }
  
  if (establishment.name === 'Clinique SOGARA') {
    return '/sogara';
  }

  // Utiliser le service pour obtenir l'URL
  return establishmentsService.getEstablishmentHomeUrl(establishment);
};
