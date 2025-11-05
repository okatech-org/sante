import { supabase } from "@/integrations/supabase/client";
import { CartographyProvider } from "@/types/cartography";

/**
 * Limites géographiques strictes du Gabon (territoire national uniquement)
 * Lat: -3.93 à 2.32 | Lng: 8.70 à 14.45
 * Exclut Guinée-Équatoriale, Cameroun, Congo, et zones maritimes
 */
const GABON_BOUNDS = {
  minLat: -3.93,
  maxLat: 2.32,
  minLng: 8.70,
  maxLng: 14.45
};

// Polygon GeoJSON du Gabon (simplifié) pour un filtrage précis par point-dans-polygone
// Source: johan/world.geo.json (simplifié)
import GABON_GEOJSON from '@/utils/gabon-polygon.json';

type Position = [number, number]; // [lng, lat]

function pointInRing(point: Position, ring: Position[]): boolean {
  // Algorithme du rayon (winding number) - version optimisée
  const x = point[0];
  const y = point[1];
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-12) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInPolygon(lng: number, lat: number, polygon: any): boolean {
  if (!polygon) return false;
  const geom = polygon.type === 'Feature' ? polygon.geometry : polygon;
  if (!geom) return false;

  if (geom.type === 'Polygon') {
    const [outer, ...holes] = geom.coordinates as Position[][];
    if (!outer) return false;
    if (!pointInRing([lng, lat] as Position, outer)) return false;
    for (const hole of holes) {
      if (pointInRing([lng, lat] as Position, hole)) return false; // dans un trou
    }
    return true;
  }

  if (geom.type === 'MultiPolygon') {
    for (const poly of geom.coordinates as Position[][][]) {
      const [outer, ...holes] = poly;
      if (outer && pointInRing([lng, lat], outer)) {
        let inHole = false;
        for (const h of holes) if (pointInRing([lng, lat], h)) { inHole = true; break; }
        if (!inHole) return true;
      }
    }
  }
  return false;
}

/**
 * Vérifie si des coordonnées sont dans les limites strictes du Gabon
 */
function isInGabon(lat: number, lng: number): boolean {
  // Préfiltre rapide par bbox, puis test polygonal strict
  if (lat < GABON_BOUNDS.minLat || lat > GABON_BOUNDS.maxLat || lng < GABON_BOUNDS.minLng || lng > GABON_BOUNDS.maxLng) {
    return false;
  }
  return pointInPolygon(lng, lat, GABON_GEOJSON);
}


/**
 * Synchronise les données OSM depuis Supabase
 */
export async function syncOSMFromSupabase(): Promise<{
  success: boolean;
  updated: number;
  added: number;
  error?: string;
}> {
  try {
    // Appeler l'edge function pour récupérer et sauvegarder les données OSM
    const { data, error } = await supabase.functions.invoke('fetch-osm-health-providers', {
      body: { province: 'all', city: 'all', saveToDatabase: true }
    });

    if (error) {
      console.error('Error syncing OSM providers:', error);
      throw error;
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to sync OSM providers');
    }

    return {
      success: true,
      updated: 0, // L'upsert ne retourne pas le nombre de mises à jour
      added: data.count,
    };
  } catch (error) {
    console.error('Error in syncOSMFromSupabase:', error);
    return {
      success: false,
      updated: 0,
      added: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Récupère tous les providers OSM depuis Supabase
 */
export async function getOSMProvidersFromSupabase(): Promise<CartographyProvider[]> {
  try {
    const { data, error } = await supabase
      .from('osm_health_providers')
      .select('*');

    if (error) {
      console.error('Error fetching OSM providers from database:', error);
      throw error;
    }

    // Transformer au format CartographyProvider et filtrer par coordonnées (seulement le Gabon)
    const providers = (data || []).map(p => ({
      id: p.id,
      osm_id: p.osm_id,
      type: p.type as CartographyProvider['type'],
      nom: p.nom,
      province: p.province,
      ville: p.ville,
      coordonnees: p.latitude && p.longitude ? {
        lat: p.latitude,
        lng: p.longitude
      } : undefined,
      adresse_descriptive: p.adresse_descriptive || '',
      telephones: p.telephones || [],
      email: p.email,
      site_web: p.site_web,
      horaires: p.horaires,
      services: p.services || [],
      specialites: p.specialites || [],
      ouvert_24_7: p.ouvert_24_7 || false,
      conventionnement: {
        cnamgs: p.cnamgs || false,
        cnss: p.cnss || false,
      },
      secteur: (p.secteur || 'prive') as CartographyProvider['secteur'],
      statut_operationnel: p.statut_operationnel as CartographyProvider['statut_operationnel'],
      source: 'OpenStreetMap',
      nombre_lits: p.nombre_lits,
    }));

    // Filtrer uniquement les établissements du Gabon
    return providers.filter(p => {
      if (!p.coordonnees) return false;
      return isInGabon(p.coordonnees.lat, p.coordonnees.lng);
    });
  } catch (error) {
    console.error('Error in getOSMProvidersFromSupabase:', error);
    return [];
  }
}
