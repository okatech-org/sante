import { CartographyProvider } from "@/types/cartography";

// Normalise une chaîne: minuscules, sans accents, espaces compactés
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Vérifie si deux points sont très proches (~100m-150m)
function areClose(a?: { lat: number; lng: number }, b?: { lat: number; lng: number }): boolean {
  if (!a || !b) return false;
  const dLat = Math.abs(a.lat - b.lat);
  const dLng = Math.abs(a.lng - b.lng);
  return (dLat + dLng) < 0.0015; // ~150m selon latitude
}

// Déduplique les prestataires OSM potentiellement dupliqués (nœud + chemin, variations mineures de nom)
export function dedupeProviders(providers: CartographyProvider[]): CartographyProvider[] {
  const byKey = new Map<string, CartographyProvider>();

  for (const p of providers) {
    const name = normalize(p.nom);
    const city = normalize(p.ville || '');
    const type = p.type;
    const key = `${name}|${city}|${type}`;

    const existing = byKey.get(key);

    if (!existing) {
      byKey.set(key, p);
      continue;
    }

    // Si un élément existe déjà avec le même nom/ville/type, on garde celui qui
    // a des coordonnées valides, sinon le premier.
    const existingHasCoords = !!existing.coordonnees;
    const currentHasCoords = !!p.coordonnees;

    // Si les deux sont très proches géographiquement, considérer comme doublon.
    if (areClose(existing.coordonnees, p.coordonnees)) {
      // Préférence: coordonnées définies > plus récent (si last_updated dispo) > existant
      if (!existingHasCoords && currentHasCoords) {
        byKey.set(key, p);
      }
      continue; // ne pas ajouter un nouveau
    }

    // Si pas proches, mais l’un n’a pas de coordonnées et l’autre oui, préférer celui avec coords
    if (!existingHasCoords && currentHasCoords) {
      byKey.set(key, p);
    }
    // Sinon on conserve l’existant pour éviter de gonfler les compteurs
  }

  return Array.from(byKey.values());
}
