/**
 * Utilitaires pour formater et standardiser les adresses
 * Nomenclature:
 * - Sans adresse précise: "Quartier, Ville, Province"
 * - Avec adresse précise: "Adresse, Ville, Province"
 */

export interface AddressComponents {
  adresse?: string;    // Adresse précise (rue, numéro, etc.)
  quartier?: string;   // Quartier
  ville: string;       // Ville/Commune
  province: string;    // Province
}

/**
 * Parse une adresse descriptive en composants
 */
export function parseAddress(adresseDescriptive: string, ville: string, province: string): AddressComponents {
  if (!adresseDescriptive || !adresseDescriptive.trim()) {
    return { ville, province };
  }

  const parts = adresseDescriptive.split(',').map(s => s.trim()).filter(Boolean);
  
  // Si l'adresse contient déjà ville et province, extraire la première partie
  if (parts.length >= 3) {
    const firstPart = parts[0];
    // Déterminer si c'est une adresse précise ou un quartier
    // Une adresse précise contient généralement: numéros, "rue", "avenue", "BP", etc.
    const isSpecificAddress = /\d+|rue|avenue|av\.|boulevard|bd\.|bp|boite|route/i.test(firstPart);
    
    return {
      adresse: isSpecificAddress ? firstPart : undefined,
      quartier: !isSpecificAddress ? firstPart : undefined,
      ville,
      province
    };
  }
  
  // Si un seul élément, c'est probablement un quartier ou une adresse
  if (parts.length === 1) {
    const firstPart = parts[0];
    const isSpecificAddress = /\d+|rue|avenue|av\.|boulevard|bd\.|bp|boite|route/i.test(firstPart);
    
    return {
      adresse: isSpecificAddress ? firstPart : undefined,
      quartier: !isSpecificAddress ? firstPart : undefined,
      ville,
      province
    };
  }

  return { ville, province };
}

/**
 * Formate une adresse selon la nomenclature standard
 * - Avec adresse: "Adresse, Ville, Province"
 * - Sans adresse: "Quartier, Ville, Province"
 * - Minimal: "Ville, Province"
 */
export function formatAddress(components: AddressComponents): string {
  const parts: string[] = [];
  
  // Priorité à l'adresse précise, sinon quartier
  if (components.adresse) {
    parts.push(components.adresse);
  } else if (components.quartier) {
    parts.push(components.quartier);
  }
  
  // Toujours ajouter ville et province
  if (components.ville) {
    parts.push(components.ville);
  }
  if (components.province) {
    parts.push(components.province);
  }
  
  return parts.join(', ');
}

/**
 * Standardise une adresse descriptive
 */
export function standardizeAddress(
  adresseDescriptive: string | undefined,
  ville: string,
  province: string
): string {
  const components = parseAddress(adresseDescriptive || '', ville, province);
  return formatAddress(components);
}

/**
 * Extrait le quartier d'une adresse
 */
export function extractQuartier(adresseDescriptive: string | undefined, ville: string, province: string): string | null {
  if (!adresseDescriptive) return null;
  
  const components = parseAddress(adresseDescriptive, ville, province);
  return components.quartier || null;
}

/**
 * Extrait l'adresse précise d'une adresse descriptive
 */
export function extractAdresse(adresseDescriptive: string | undefined): string | null {
  if (!adresseDescriptive) return null;
  
  const parts = adresseDescriptive.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  
  const firstPart = parts[0];
  const isSpecificAddress = /\d+|rue|avenue|av\.|boulevard|bd\.|bp|boite|route/i.test(firstPart);
  
  return isSpecificAddress ? firstPart : null;
}

/**
 * Vérifie si une adresse contient une adresse précise
 */
export function hasSpecificAddress(adresseDescriptive: string | undefined): boolean {
  if (!adresseDescriptive) return false;
  return extractAdresse(adresseDescriptive) !== null;
}
