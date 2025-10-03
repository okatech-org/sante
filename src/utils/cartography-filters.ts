import { debounce } from "lodash";
import { CartographyProvider, CartographyFilters } from "@/types/cartography";

/**
 * Filtre les prestataires selon les critères sélectionnés
 */
export const filterProviders = (
  providers: CartographyProvider[],
  filters: CartographyFilters
): CartographyProvider[] => {
  return providers.filter(provider => {
    // Filtre Type
    if (filters.types.length > 0 && !filters.types.includes(provider.type)) {
      return false;
    }
    
    // Filtre Province
    if (filters.province !== 'all' && provider.province !== filters.province) {
      return false;
    }
    
    // Filtre 24/7
    if (filters.ouvert24_7 && !provider.ouvert_24_7) {
      return false;
    }
    
    // Filtre CNAMGS
    if (filters.cnamgs && !provider.conventionnement.cnamgs) {
      return false;
    }
    
    // Filtre Spécialité
    if (filters.specialite && !provider.specialites?.includes(filters.specialite)) {
      return false;
    }
    
    // Filtre Équipement Spécialisé
    if (filters.equipement && !provider.equipements_specialises?.includes(filters.equipement)) {
      return false;
    }
    
    // Filtre Distance (si géolocalisation active)
    if (filters.maxDistance && provider.distance && provider.distance > filters.maxDistance) {
      return false;
    }
    
    // Recherche Textuelle
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const searchableText = [
        provider.nom,
        provider.ville,
        provider.adresse_descriptive,
        ...(provider.services || []),
        ...(provider.specialites || [])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Trie les prestataires selon le critère sélectionné
 */
export const sortProviders = (
  providers: CartographyProvider[],
  sortBy: string
): CartographyProvider[] => {
  const sorted = [...providers];
  
  switch(sortBy) {
    case 'distance':
      return sorted.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    
    case 'nom':
      return sorted.sort((a, b) => a.nom.localeCompare(b.nom));
    
    case 'ville':
      return sorted.sort((a, b) => a.ville.localeCompare(b.ville));
    
    case 'type':
      return sorted.sort((a, b) => a.type.localeCompare(b.type));
    
    default:
      return sorted;
  }
};

/**
 * Génère des suggestions de recherche basées sur l'input
 */
export const getSuggestions = (
  inputText: string,
  providers: CartographyProvider[]
): Array<{ type: string; value: string; icon: string }> => {
  const FREQUENT_SEARCHES = [
    { type: 'search', value: "Scanner Libreville", icon: "🔬" },
    { type: 'search', value: "Pharmacie garde 24/7", icon: "💊" },
    { type: 'search', value: "Gynécologue Port-Gentil", icon: "👩‍⚕️" },
    { type: 'search', value: "Urgences près de moi", icon: "🚨" },
    { type: 'search', value: "IRM Gabon", icon: "🧲" },
    { type: 'search', value: "Cardiologie conventionné CNAMGS", icon: "❤️" }
  ];

  if (!inputText || inputText.length < 2) {
    return FREQUENT_SEARCHES;
  }
  
  const suggestions = new Set<string>();
  const lowerInput = inputText.toLowerCase();
  const results: Array<{ type: string; value: string; icon: string }> = [];
  
  providers.forEach(provider => {
    // Suggérer noms prestataires
    if (provider.nom.toLowerCase().includes(lowerInput)) {
      const key = `provider-${provider.nom}`;
      if (!suggestions.has(key)) {
        suggestions.add(key);
        results.push({ type: 'provider', value: provider.nom, icon: '🏥' });
      }
    }
    
    // Suggérer villes
    if (provider.ville.toLowerCase().includes(lowerInput)) {
      const key = `city-${provider.ville}`;
      if (!suggestions.has(key)) {
        suggestions.add(key);
        results.push({ type: 'city', value: provider.ville, icon: '📍' });
      }
    }
    
    // Suggérer services
    provider.services?.forEach(service => {
      if (service.toLowerCase().includes(lowerInput)) {
        const key = `service-${service}`;
        if (!suggestions.has(key)) {
          suggestions.add(key);
          results.push({ type: 'service', value: service, icon: '⚕️' });
        }
      }
    });
    
    // Suggérer spécialités
    provider.specialites?.forEach(spec => {
      if (spec.toLowerCase().includes(lowerInput)) {
        const key = `specialite-${spec}`;
        if (!suggestions.has(key)) {
          suggestions.add(key);
          results.push({ type: 'specialite', value: spec, icon: '👨‍⚕️' });
        }
      }
    });
  });
  
  return results.slice(0, 8); // Limiter à 8 suggestions
};

/**
 * Crée une version debounced d'une fonction de recherche
 */
export const createDebouncedSearch = (
  callback: (text: string) => void,
  delay: number = 300
) => {
  return debounce(callback, delay);
};

/**
 * Calcule les statistiques des prestataires
 */
export const calculateStats = (providers: CartographyProvider[]) => {
  const byProvince: Record<string, number> = {};
  const byType: Record<string, number> = {};
  let services247 = 0;
  let imagerieLourde = 0;
  
  providers.forEach(provider => {
    // Par province
    byProvince[provider.province] = (byProvince[provider.province] || 0) + 1;
    
    // Par type
    byType[provider.type] = (byType[provider.type] || 0) + 1;
    
    // Services 24/7
    if (provider.ouvert_24_7) {
      services247++;
    }
    
    // Imagerie lourde (IRM/Scanner)
    if (provider.equipements_specialises?.some(e => 
      e.includes('IRM') || e.includes('Scanner')
    )) {
      imagerieLourde++;
    }
  });
  
  return {
    totalProviders: providers.length,
    byProvince,
    byType,
    services247,
    imagerieLourde
  };
};
