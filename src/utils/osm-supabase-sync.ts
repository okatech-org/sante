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

/**
 * Vérifie si des coordonnées sont dans les limites strictes du Gabon
 */
function isInGabon(lat: number, lng: number): boolean {
  return lat >= GABON_BOUNDS.minLat && 
         lat <= GABON_BOUNDS.maxLat && 
         lng >= GABON_BOUNDS.minLng && 
         lng <= GABON_BOUNDS.maxLng;
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
