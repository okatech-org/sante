import { CartographyProvider } from "@/types/cartography";

export interface EnhancedFilters {
  types: string[];
  specialties: string[];
  services: string[];
  equipment: string[];
  amenities: string[];
  distance: number[];
  rating: number[];
  priceRange: string;
  openNow: boolean;
  open24h: boolean;
  cnamgs: boolean;
  cnss: boolean;
  privateInsurance: boolean;
  languages: string[];
  sortBy: string;
  searchText?: string;
  province?: string;
  urgent?: boolean;
  proche?: boolean;
  cityFilter?: string[] | null;
}

/**
 * Filtre avancé des prestataires avec tous les critères
 */
export const filterProvidersEnhanced = (
  providers: CartographyProvider[],
  filters: EnhancedFilters
): CartographyProvider[] => {
  return providers.filter(provider => {
    // Filtre par types d'établissements
    if (filters.types.length > 0 && !filters.types.includes(provider.type)) {
      return false;
    }

    // Filtre par spécialités médicales
    if (filters.specialties.length > 0) {
      const hasSpecialty = filters.specialties.some(specialty => 
        provider.specialites?.includes(specialty)
      );
      if (!hasSpecialty) return false;
    }

    // Filtre par services disponibles
    if (filters.services.length > 0) {
      const hasService = filters.services.some(service => {
        if (service === "urgences" && provider.ouvert_24_7) return true;
        if (service === "vaccination" && provider.services?.includes("Vaccination")) return true;
        if (service === "pediatrie" && provider.services?.includes("Pédiatrie")) return true;
        if (service === "maternite" && provider.services?.includes("Maternité")) return true;
        if (service === "chirurgie" && provider.services?.includes("Chirurgie")) return true;
        if (service === "analyses" && provider.type === "laboratoire") return true;
        return provider.services?.some(s => s.toLowerCase().includes(service));
      });
      if (!hasService) return false;
    }

    // Filtre par équipements médicaux
    if (filters.equipment.length > 0) {
      const hasEquipment = filters.equipment.some(equip => {
        if (equip === "irm" && provider.services?.includes("IRM")) return true;
        if (equip === "scanner" && provider.services?.includes("Scanner")) return true;
        if (equip === "radio" && provider.services?.includes("Radiologie")) return true;
        if (equip === "echo" && provider.services?.includes("Échographie")) return true;
        // Pour les autres équipements, on pourrait vérifier dans un champ equipements si disponible
        return false;
      });
      if (!hasEquipment) return false;
    }

    // Filtre par distance maximale
    if (filters.distance[0] < 100 && provider.distance) {
      if (provider.distance > filters.distance[0]) return false;
    }

    // Filtre par note minimale (si les notes sont disponibles)
    if (filters.rating[0] > 0 && provider.rating) {
      if (provider.rating < filters.rating[0]) return false;
    }

    // Filtre par horaires
    if (filters.openNow) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay();
      
      // Vérifier si ouvert maintenant (simplification)
      if (!provider.ouvert_24_7 && (currentHour < 8 || currentHour > 18)) {
        return false;
      }
    }

    if (filters.open24h && !provider.ouvert_24_7) {
      return false;
    }

    // Filtre par conventionnement assurance
    if (filters.cnamgs && !provider.conventionnement?.cnamgs) {
      return false;
    }

    if (filters.cnss && !provider.conventionnement?.cnss) {
      return false;
    }

    // Filtre par ville/quartier spécifique (prioritaire)
    if (filters.cityFilter && filters.cityFilter.length > 0) {
      const matchesCity = filters.cityFilter.some(city => 
        provider.ville.toLowerCase().includes(city.toLowerCase()) ||
        city.toLowerCase().includes(provider.ville.toLowerCase()) ||
        provider.adresse_descriptive?.toLowerCase().includes(city.toLowerCase())
      );
      if (!matchesCity) return false;
    }

    // Filtre par recherche textuelle (si pas de cityFilter spécifique)
    if (filters.searchText && !filters.cityFilter) {
      const searchLower = filters.searchText.toLowerCase();
      const searchableText = [
        provider.nom,
        provider.ville,
        provider.province,
        provider.adresse_descriptive,
        ...(provider.services || []),
        ...(provider.specialites || [])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchLower)) {
        return false;
      }
    }

    // Filtre par province
    if (filters.province && filters.province !== 'all' && provider.province !== filters.province) {
      return false;
    }

    // Filtre urgent (établissements avec urgences)
    if (filters.urgent) {
      if (!provider.ouvert_24_7 && !provider.services?.includes("Urgences")) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Trie les prestataires selon différents critères
 */
export const sortProvidersEnhanced = (
  providers: CartographyProvider[],
  sortBy: string
): CartographyProvider[] => {
  const sorted = [...providers];
  
  switch(sortBy) {
    case 'relevance':
      // Tri par pertinence (score basé sur plusieurs facteurs)
      return sorted.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        
        // Bonus pour conventionnement CNAMGS
        if (a.conventionnement?.cnamgs) scoreA += 3;
        if (b.conventionnement?.cnamgs) scoreB += 3;
        
        // Bonus pour ouvert 24/7
        if (a.ouvert_24_7) scoreA += 2;
        if (b.ouvert_24_7) scoreB += 2;
        
        // Bonus pour nombre de services
        scoreA += (a.services?.length || 0) * 0.5;
        scoreB += (b.services?.length || 0) * 0.5;
        
        // Bonus pour nombre de lits (hôpitaux)
        if (a.nombre_lits) scoreA += Math.log(a.nombre_lits);
        if (b.nombre_lits) scoreB += Math.log(b.nombre_lits);
        
        return scoreB - scoreA;
      });
    
    case 'distance':
      return sorted.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    
    case 'name':
      return sorted.sort((a, b) => a.nom.localeCompare(b.nom));
    
    case 'city':
      return sorted.sort((a, b) => a.ville.localeCompare(b.ville));
    
    case 'type':
      return sorted.sort((a, b) => a.type.localeCompare(b.type));
    
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    case 'beds':
      return sorted.sort((a, b) => (b.nombre_lits || 0) - (a.nombre_lits || 0));
    
    default:
      return sorted;
  }
};

/**
 * Calcule des statistiques sur les résultats filtrés
 */
export const calculateStats = (providers: CartographyProvider[]) => {
  return {
    total: providers.length,
    byType: providers.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byProvince: providers.reduce((acc, p) => {
      acc[p.province] = (acc[p.province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    open24h: providers.filter(p => p.ouvert_24_7).length,
    cnamgs: providers.filter(p => p.conventionnement?.cnamgs).length,
    withCoords: providers.filter(p => p.coordonnees).length,
  };
};

/**
 * Génère des suggestions de recherche intelligentes
 */
export const getSmartSuggestions = (
  query: string,
  providers: CartographyProvider[],
  userLocation?: { lat: number; lng: number }
): {
  providers: CartographyProvider[];
  symptoms: string[];
  services: string[];
  nearbyProviders?: CartographyProvider[];
} => {
  const queryLower = query.toLowerCase();
  const suggestions = {
    providers: [] as CartographyProvider[],
    symptoms: [] as string[],
    services: [] as string[],
    nearbyProviders: [] as CartographyProvider[]
  };

  // Recherche dans les providers
  providers.forEach(provider => {
    const matchScore = calculateMatchScore(provider, queryLower);
    if (matchScore > 0) {
      suggestions.providers.push({ ...provider, matchScore } as any);
    }
  });

  // Trier par score de correspondance
  suggestions.providers.sort((a: any, b: any) => b.matchScore - a.matchScore);
  suggestions.providers = suggestions.providers.slice(0, 5);

  // Suggestions de services
  const commonServices = [
    "urgences", "consultation", "vaccination", "pédiatrie",
    "maternité", "chirurgie", "analyses", "imagerie"
  ];
  
  suggestions.services = commonServices.filter(service => 
    service.includes(queryLower) || queryLower.includes(service)
  );

  // Si géolocalisation disponible, suggérer les plus proches
  if (userLocation) {
    const withDistance = providers
      .filter(p => p.coordonnees)
      .map(p => ({
        ...p,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          p.coordonnees!.lat,
          p.coordonnees!.lng
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    
    suggestions.nearbyProviders = withDistance;
  }

  return suggestions;
};

/**
 * Calcule le score de correspondance pour un provider
 */
function calculateMatchScore(provider: CartographyProvider, query: string): number {
  let score = 0;
  
  // Nom exact = score élevé
  if (provider.nom.toLowerCase() === query) score += 10;
  else if (provider.nom.toLowerCase().includes(query)) score += 5;
  
  // Type correspondant
  if (provider.type.includes(query)) score += 4;
  
  // Ville correspondante
  if (provider.ville.toLowerCase().includes(query)) score += 3;
  
  // Services correspondants
  if (provider.services?.some(s => s.toLowerCase().includes(query))) score += 3;
  
  // Spécialités correspondantes
  if (provider.specialites?.some(s => s.toLowerCase().includes(query))) score += 2;
  
  // Bonus si ouvert 24/7 et recherche urgence
  if (provider.ouvert_24_7 && query.includes("urgence")) score += 5;
  
  // Bonus si conventionné CNAMGS
  if (provider.conventionnement?.cnamgs) score += 1;
  
  return score;
}

/**
 * Calcule la distance entre deux points GPS
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Types étendus pour le provider avec des champs supplémentaires
declare module "@/types/cartography" {
  interface CartographyProvider {
    rating?: number;
    distance?: number;
    matchScore?: number;
  }
}
