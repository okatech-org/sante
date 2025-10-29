/**
 * Configuration Mapbox
 * 
 * La clé publique Mapbox est stockée dans les secrets Lovable Cloud
 * sous le nom "API_MAPBOX"
 */

export const MAPBOX_PUBLIC_TOKEN = import.meta.env.VITE_API_MAPBOX || '';
