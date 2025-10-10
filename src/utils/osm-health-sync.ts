import { supabase } from "@/integrations/supabase/client";
import { CartographyProvider } from "@/types/cartography";
import providersData from "@/data/cartography-providers.json";

/**
 * Récupère les établissements de santé depuis OpenStreetMap
 */
export async function fetchOSMHealthProviders(): Promise<CartographyProvider[]> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-osm-health-providers', {
      body: { province: 'all', city: 'all' }
    });

    if (error) {
      console.error('Error fetching OSM providers:', error);
      throw error;
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch OSM providers');
    }

    return data.providers;
  } catch (error) {
    console.error('Error in fetchOSMHealthProviders:', error);
    throw error;
  }
}

/**
 * Fusionne les données OSM avec les données existantes
 * - Met à jour les coordonnées pour les établissements correspondants
 * - Ajoute les nouveaux établissements
 */
export function mergeOSMProviders(
  existingProviders: CartographyProvider[],
  osmProviders: CartographyProvider[]
): {
  merged: CartographyProvider[];
  updated: number;
  added: number;
  duplicates: Array<{ existing: string; osm: string }>;
} {
  const merged = [...existingProviders];
  let updated = 0;
  let added = 0;
  const duplicates: Array<{ existing: string; osm: string }> = [];

  // Fonction pour normaliser les noms pour comparaison
  const normalizeName = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/[^a-z0-9]/g, ''); // Garder seulement lettres et chiffres
  };

  // Créer un index des noms existants pour une recherche rapide
  const existingByName = new Map<string, number>();
  existingProviders.forEach((provider, index) => {
    const normalizedName = normalizeName(provider.nom);
    existingByName.set(normalizedName, index);
  });

  // Traiter chaque provider OSM
  osmProviders.forEach(osmProvider => {
    const normalizedOsmName = normalizeName(osmProvider.nom);
    
    // Vérifier si un établissement similaire existe déjà
    const existingIndex = existingByName.get(normalizedOsmName);

    if (existingIndex !== undefined) {
      // Établissement trouvé - mettre à jour les coordonnées si OSM a de meilleures données
      const existing = merged[existingIndex];
      
      duplicates.push({
        existing: existing.nom,
        osm: osmProvider.nom
      });

      // Mettre à jour avec les coordonnées OSM si elles sont différentes
      if (osmProvider.coordonnees && 
          (!existing.coordonnees || 
           existing.coordonnees.lat !== osmProvider.coordonnees.lat ||
           existing.coordonnees.lng !== osmProvider.coordonnees.lng)) {
        
        merged[existingIndex] = {
          ...existing,
          coordonnees: osmProvider.coordonnees,
          // Fusionner certaines informations manquantes
          telephones: existing.telephones.length > 0 ? existing.telephones : osmProvider.telephones,
          email: existing.email || osmProvider.email,
        };
        updated++;
      }
    } else {
      // Nouvel établissement - l'ajouter
      merged.push(osmProvider);
      added++;
    }
  });

  return {
    merged,
    updated,
    added,
    duplicates
  };
}

/**
 * Fonction utilitaire pour télécharger les données fusionnées
 */
export function downloadMergedData(providers: CartographyProvider[], filename: string = 'cartography-providers-merged.json') {
  const dataStr = JSON.stringify(providers, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Fonction principale pour synchroniser les données
 */
export async function syncOSMHealthProviders(): Promise<{
  success: boolean;
  updated: number;
  added: number;
  duplicates: Array<{ existing: string; osm: string }>;
  error?: string;
}> {
  try {
    // Récupérer les données OSM
    const osmProviders = await fetchOSMHealthProviders();
    
    // Fusionner avec les données existantes
    const existingProviders = providersData as CartographyProvider[];
    const result = mergeOSMProviders(existingProviders, osmProviders);

    // Télécharger le fichier fusionné
    downloadMergedData(result.merged);

    return {
      success: true,
      updated: result.updated,
      added: result.added,
      duplicates: result.duplicates
    };
  } catch (error) {
    console.error('Error syncing OSM providers:', error);
    return {
      success: false,
      updated: 0,
      added: 0,
      duplicates: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
