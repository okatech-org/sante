// Composant pour gérer les pages personnalisées des établissements
// SANTE.GA - Plateforme E-Santé Gabon

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EstablishmentHomePage from "./EstablishmentHomePage";
import { establishmentsService } from "@/services/establishments.service";

/**
 * Map des URLs personnalisées vers les IDs d'établissements
 */
const URL_TO_ESTABLISHMENT: Record<string, { id: string; name: string }> = {
  '/chu-libreville': { id: 'est-002', name: 'CHU de Libreville' },
  '/chu-jeanne-ebori': { id: 'est-004', name: 'CHU Mère et Enfant Jeanne Ebori' },
  '/chu-melen': { id: 'est-003', name: 'CHU de Melen' },
  '/hopital-sino-gabonais': { id: 'est-hsg-001', name: 'Hôpital Sino-Gabonais' },
  '/clinique-el-rapha': { id: 'est-cer-001', name: 'Clinique El Rapha' },
  '/polyclinique-chambrier': { id: 'est-pch-001', name: 'Polyclinique Chambrier' }
};

/**
 * Composant wrapper pour les pages d'établissement avec URLs personnalisées
 */
export default function EstablishmentCustomPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Obtenir l'établissement correspondant à l'URL
    const establishmentInfo = URL_TO_ESTABLISHMENT[location.pathname];
    
    if (establishmentInfo) {
      // Rediriger vers la page générique avec l'ID
      navigate(`/establishment/${establishmentInfo.id}`, { 
        replace: true,
        state: { 
          establishmentName: establishmentInfo.name,
          customUrl: location.pathname 
        }
      });
    }
  }, [location.pathname, navigate]);
  
  // Le composant EstablishmentHomePage gérera l'affichage
  return <EstablishmentHomePage />;
}
