import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { province, city, saveToDatabase } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    
    console.log('Fetching OSM health providers for:', { province, city });

    // Bbox pour le Gabon STRICT (territoire national uniquement, exclut Guinée-Équatoriale)
    // Format: minLat,minLng,maxLat,maxLng
    const gabonBbox = "-3.93,8.70,2.32,14.45";
    
    // Limites strictes pour filtrage
    const GABON_BOUNDS = {
      minLat: -3.93,
      maxLat: 2.32,
      minLng: 8.70,
      maxLng: 14.45
    };
    
    // Fonction pour vérifier si un point est au Gabon
    const isInGabon = (lat: number, lng: number): boolean => {
      return lat >= GABON_BOUNDS.minLat && 
             lat <= GABON_BOUNDS.maxLat && 
             lng >= GABON_BOUNDS.minLng && 
             lng <= GABON_BOUNDS.maxLng;
    };
    
    
    // Fonction pour déterminer la province basée sur les coordonnées
    const getProvinceFromCoordinates = (lat: number, lng: number): string => {
      if (lat >= -0.5 && lat <= 1.0 && lng >= 9.0 && lng <= 10.0) return 'G1';
      if (lat >= -2.0 && lat <= -0.5 && lng >= 13.0 && lng <= 14.5) return 'G2';
      if (lat >= -1.5 && lat <= 0.0 && lng >= 9.5 && lng <= 11.0) return 'G3';
      if (lat >= -2.5 && lat <= -1.0 && lng >= 10.5 && lng <= 11.5) return 'G4';
      if (lat >= -3.5 && lat <= -2.0 && lng >= 10.0 && lng <= 11.5) return 'G5';
      if (lat >= 0.0 && lat <= 1.5 && lng >= 12.5 && lng <= 14.5) return 'G6';
      if (lat >= -1.5 && lat <= 0.0 && lng >= 12.0 && lng <= 13.5) return 'G7';
      if (lat >= -1.0 && lat <= 0.5 && lng >= 8.5 && lng <= 10.0) return 'G8';
      if (lat >= 1.0 && lat <= 2.5 && lng >= 11.0 && lng <= 12.5) return 'G9';
      return 'G1';
    };
    
    // Requête Overpass améliorée pour tous les établissements de santé
    const overpassQuery = `
      [out:json][timeout:90];
      (
        node["amenity"="hospital"](${gabonBbox});
        way["amenity"="hospital"](${gabonBbox});
        relation["amenity"="hospital"](${gabonBbox});
        node["amenity"="clinic"](${gabonBbox});
        way["amenity"="clinic"](${gabonBbox});
        relation["amenity"="clinic"](${gabonBbox});
        node["amenity"="pharmacy"](${gabonBbox});
        way["amenity"="pharmacy"](${gabonBbox});
        relation["amenity"="pharmacy"](${gabonBbox});
        node["amenity"="laboratory"](${gabonBbox});
        way["amenity"="laboratory"](${gabonBbox});
        relation["amenity"="laboratory"](${gabonBbox});
        node["amenity"="doctors"](${gabonBbox});
        way["amenity"="doctors"](${gabonBbox});
        relation["amenity"="doctors"](${gabonBbox});
        node["amenity"="dentist"](${gabonBbox});
        way["amenity"="dentist"](${gabonBbox});
        node["healthcare"="laboratory"](${gabonBbox});
        way["healthcare"="laboratory"](${gabonBbox});
        relation["healthcare"="laboratory"](${gabonBbox});
        node["healthcare"="diagnostic_radiology"](${gabonBbox});
        way["healthcare"="diagnostic_radiology"](${gabonBbox});
        relation["healthcare"="diagnostic_radiology"](${gabonBbox});
        node["healthcare"="diagnostics"](${gabonBbox});
        way["healthcare"="diagnostics"](${gabonBbox});
        relation["healthcare"="diagnostics"](${gabonBbox});
        node["healthcare:speciality"~"laboratory|pathology|radiology|imaging"](${gabonBbox});
        way["healthcare:speciality"~"laboratory|pathology|radiology|imaging"](${gabonBbox});
        node["healthcare"](${gabonBbox});
        way["healthcare"](${gabonBbox});
        node["shop"="medical_supply"](${gabonBbox});
        way["shop"="medical_supply"](${gabonBbox});
        node["office"~"government|ngo"](${gabonBbox});
        way["office"~"government|ngo"](${gabonBbox});
        node["amenity"="social_facility"](${gabonBbox});
        way["amenity"="social_facility"](${gabonBbox});
      );
      out body center qt;
    `;

    async function fetchOverpass(): Promise<any> {
      const endpoints = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
        'https://overpass.openstreetmap.fr/api/interpreter',
      ];
      let lastError: Error | null = null;
      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            body: `data=${encodeURIComponent(overpassQuery)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });
          if (res.ok) return await res.json();
          lastError = new Error(`Overpass error ${res.status}: ${await res.text()}`);
        } catch (e) {
          lastError = e as Error;
        }
      }
      throw lastError ?? new Error('Overpass fetch failed');
    }

    const data = await fetchOverpass();
    console.log(`Found ${data.elements.length} health facilities from OSM`);

    // Transformer les données OSM au format de notre application
    const providers = data.elements.map((element: any) => {
      let type = 'cabinet_medical';
      const tags = element.tags || {};
      const amenity = tags?.amenity;
      const healthcare = tags?.healthcare;
      const speciality = (tags?.['healthcare:speciality'] || '').toLowerCase();
      const nameLower = (tags?.name || tags?.['name:fr'] || '').toLowerCase();
      
      const isLab = (
        healthcare === 'laboratory' ||
        amenity === 'laboratory' ||
        speciality.includes('laboratory') ||
        speciality.includes('pathology') ||
        nameLower.includes('laboratoire') ||
        nameLower.includes('laboratory')
      );
      
      const isImaging = (
        healthcare === 'diagnostic_radiology' ||
        healthcare === 'radiology' ||
        healthcare === 'diagnostics' ||
        speciality.includes('radiology') ||
        speciality.includes('imaging') ||
        nameLower.includes('imagerie') ||
        nameLower.includes('radiologie') ||
        nameLower.includes('scanner') ||
        nameLower.includes('irm')
      );
      
      const office = tags?.office || '';
      const isInstitution = (
        office === 'government' ||
        office === 'ngo' ||
        amenity === 'social_facility' ||
        nameLower.includes('ministère') ||
        nameLower.includes('ministry') ||
        nameLower.includes('oms') ||
        nameLower.includes('who') ||
        nameLower.includes('croix rouge') ||
        nameLower.includes('red cross') ||
        (nameLower.includes('direction') && nameLower.includes('santé'))
      );
      
      if (isInstitution) {
        type = 'institution';
      } else if (isLab) {
        type = 'laboratoire';
      } else if (isImaging) {
        type = 'imagerie';
      } else if (amenity === 'hospital' || healthcare === 'hospital') {
        type = 'hopital';
      } else if (amenity === 'clinic' || healthcare === 'clinic') {
        type = 'clinique';
      } else if (amenity === 'pharmacy') {
        type = 'pharmacie';
      } else if (amenity === 'dentist') {
        type = 'cabinet_dentaire';
      } else if (amenity === 'doctors' || healthcare === 'doctor') {
        type = 'cabinet_medical';
      }

      let lat, lng;
      if (element.lat && element.lon) {
        lat = element.lat;
        lng = element.lon;
      } else if (element.center) {
        lat = element.center.lat;
        lng = element.center.lon;
      }

      const name = element.tags?.name || element.tags?.['name:fr'] || element.tags?.brand || 'Établissement sans nom';
      const phone = element.tags?.phone || element.tags?.['contact:phone'];
      const email = element.tags?.email || element.tags?.['contact:email'];
      const website = element.tags?.website || element.tags?.['contact:website'];
      const openingHours = element.tags?.opening_hours;
      const emergency = element.tags?.emergency === 'yes';
      const address = element.tags?.['addr:street'] || element.tags?.['addr:housenumber'] ? 
        `${element.tags?.['addr:housenumber'] || ''} ${element.tags?.['addr:street'] || ''}`.trim() : '';
      const city = element.tags?.['addr:city'] || element.tags?.['addr:suburb'] || '';
      const operator = element.tags?.operator;
      const beds = element.tags?.beds ? parseInt(element.tags.beds) : undefined;
      const dispensing = element.tags?.dispensing === 'yes';
      
      const province = lat && lng ? getProvinceFromCoordinates(lat, lng) : 'G1';
      
      let finalCity = city;
      if (!finalCity && lat && lng) {
        const provinceCities: Record<string, string> = {
          'G1': 'Libreville', 'G2': 'Franceville', 'G3': 'Lambaréné',
          'G4': 'Mouila', 'G5': 'Tchibanga', 'G6': 'Makokou',
          'G7': 'Koulamoutou', 'G8': 'Port-Gentil', 'G9': 'Oyem'
        };
        finalCity = provinceCities[province] || 'Libreville';
      }

      return {
        id: `OSM_${element.id}`,
        osm_id: element.id,
        type,
        nom: name,
        province,
        ville: finalCity || 'Libreville',
        latitude: lat,
        longitude: lng,
        adresse_descriptive: address || city || '',
        telephones: phone ? [phone] : [],
        email: email || null,
        site_web: website || null,
        horaires: openingHours || null,
        services: type === 'pharmacie' && dispensing ? ['Délivrance de médicaments'] : [],
        specialites: [],
        ouvert_24_7: emergency || false,
        cnamgs: false,
        cnss: false,
        secteur: operator?.toLowerCase().includes('public') || operator?.toLowerCase().includes('government') ? 'public' : 'prive',
        statut_operationnel: 'operationnel',
        nombre_lits: beds || null,
        last_updated: new Date().toISOString()
      };
    })
    .filter((p: any) => p.latitude && p.longitude)
    .filter((p: any) => isInGabon(p.latitude, p.longitude)); // Filtrage strict: seulement le Gabon

    console.log(`Transformed and filtered ${providers.length} providers within Gabon bounds`);


    if (saveToDatabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');
      const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'super_admin')
        .single();
      if (!role) throw new Error('Accès refusé - super admin requis');

      const { error: upsertError } = await supabase
        .from('osm_health_providers')
        .upsert(providers, { onConflict: 'id' });

      if (upsertError) {
        console.error('Error upserting providers:', upsertError);
        throw upsertError;
      }

      console.log(`Saved ${providers.length} providers to database`);

      return new Response(
        JSON.stringify({ success: true, count: providers.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, providers }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching OSM health providers:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
