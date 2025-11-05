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
 * Normalise le nom de province (codes G1..G9, GA-*)
 */
export function normalizeProvince(province: string, ville?: string): string {
  const code = (province || '').trim().toLowerCase();
  const map: Record<string, string> = {
    'g1': 'Estuaire',
    'g2': 'Haut-Ogooué',
    'g3': 'Moyen-Ogooué',
    'g4': 'Ngounié',
    'g5': 'Nyanga',
    'g6': 'Ogooué-Ivindo',
    'g7': 'Ogooué-Lolo',
    'g8': 'Ogooué-Maritime',
    'g9': 'Woleu-Ntem',
  };
  if (map[code]) return map[code];
  const m = code.match(/^ga-?(\d+)$/i);
  if (m && map[`g${m[1]}`]) return map[`g${m[1]}`];
  return province;
}

/**
 * Parse une adresse descriptive en composants
 */
export function parseAddress(adresseDescriptive: string, ville: string, province: string): AddressComponents {
  if (!adresseDescriptive || !adresseDescriptive.trim()) {
    return { ville, province };
  }

  // Traiter les valeurs placeholder comme "adresse non spécifiée" ou "non renseignée"
  const normalized = adresseDescriptive.trim().toLowerCase();
  if (/adresse\s*non\s*sp[eé]cifi[eé]e|non\s*renseign[eé]e|n\/a|aucune|inconnue/.test(normalized)) {
    return { ville, province };
  }

  const rawParts = adresseDescriptive.split(',').map(s => s.trim()).filter(Boolean);
  const lowerVille = ville.toLowerCase();
  const lowerProvince = province.toLowerCase();

  // Filtrer les éléments non pertinents (ville/province déjà présentes, codes pays, etc.)
  const filteredParts = rawParts.filter(p => {
    const n = p.toLowerCase();
    if (!n) return false;
    if (n === lowerVille || n === lowerProvince) return false;
    if (n === 'gabon' || n === 'ga' || n === 'g9' || /^ga-?\d+$/i.test(p)) return false;
    return true;
  });

  // Choisir la première partie significative
  const firstPart = filteredParts[0] || rawParts[0] || '';

  if (firstPart) {
    // Déterminer si c'est une adresse précise ou un quartier
    // Éviter de confondre des codes courts (ex: "G9") avec une adresse
    const isCodeLike = /^[A-Za-z]{0,2}\d{1,3}[A-Za-z]{0,2}$/i.test(firstPart);
    const isSpecificAddress = !isCodeLike && ( /\d+/.test(firstPart) || /(rue|avenue|av\.|boulevard|bd\.|bp|boite|route)/i.test(firstPart) );

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
 * - Sans adresse: "à Quartier, Ville, Province"
 * - Minimal: "Ville, Province"
 */
export function formatAddress(components: AddressComponents): string {
  const parts: string[] = [];
  
  // Priorité à l'adresse précise, sinon quartier avec préfixe "à"
  if (components.adresse) {
    parts.push(components.adresse);
  } else if (components.quartier) {
    parts.push(`à ${components.quartier}`);
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
  const normalizedProvince = normalizeProvince(province, ville);
  const components = parseAddress(adresseDescriptive || '', ville, normalizedProvince);
  return formatAddress(components);
}

/**
 * Standardise l'adresse en essayant d'inférer le quartier/localité depuis le nom
 * Utile quand l'adresse descriptive est vide ou générique et que le nom contient "d'Ebeigne", "de Nkembo", etc.
 */
export function standardizeAddressWithName(
  adresseDescriptive: string | undefined,
  ville: string,
  province: string,
  nom?: string
): string {
  const base = standardizeAddress(adresseDescriptive, ville, province);
  const firstPart = base.split(',')[0]?.trim() || '';
  // Si on a déjà un préfixe ou une adresse différente de la ville, on garde tel quel
  if (firstPart.startsWith('à ') || (firstPart && firstPart.toLowerCase() !== ville.toLowerCase())) {
    return base;
  }
  if (!nom) return base;

  // Heuristique: extraire un toponyme à partir du nom (d', de, du, des)
  const match = nom.match(/\b(?:d['’]|de |du |des )([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'’\-]+)/u);
  if (match) {
    const locality = match[1].trim();
    if (
      locality.length > 1 &&
      locality.toLowerCase() !== ville.toLowerCase() &&
      locality.toLowerCase() !== normalizeProvince(province).toLowerCase()
    ) {
      const normalizedProvince = normalizeProvince(province, ville);
      return `à ${locality}, ${ville}, ${normalizedProvince}`;
    }
  }

  return base;
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
