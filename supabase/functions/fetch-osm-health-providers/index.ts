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
    const { province, city } = await req.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Fetching OSM health providers for:', { province, city });

    // Bbox pour le Gabon (précis)
    const gabonBbox = "-4.0,8.5,2.5,14.5";
    
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
        node["amenity"="doctors"](${gabonBbox});
        way["amenity"="doctors"](${gabonBbox});
        relation["amenity"="doctors"](${gabonBbox});
        node["amenity"="dentist"](${gabonBbox});
        way["amenity"="dentist"](${gabonBbox});
        node["healthcare"="laboratory"](${gabonBbox});
        way["healthcare"="laboratory"](${gabonBbox});
        relation["healthcare"="laboratory"](${gabonBbox});
        node["healthcare"](${gabonBbox});
        way["healthcare"](${gabonBbox});
        node["shop"="medical_supply"](${gabonBbox});
        way["shop"="medical_supply"](${gabonBbox});
      );
      out body center qt;
    `;

    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    
    const response = await fetch(overpassUrl, {
      method: 'POST',
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Found ${data.elements.length} health facilities from OSM`);

    // Transformer les données OSM au format de notre application
    const providers = data.elements.map((element: any) => {
      let type = 'cabinet_medical';
      const amenity = element.tags?.amenity || element.tags?.healthcare;
      
      if (amenity === 'hospital' || element.tags?.healthcare === 'hospital') {
        type = 'hopital';
      } else if (amenity === 'clinic' || element.tags?.healthcare === 'clinic') {
        type = 'clinique';
      } else if (amenity === 'pharmacy') {
        type = 'pharmacie';
      } else if (element.tags?.healthcare === 'laboratory') {
        type = 'laboratoire';
      } else if (amenity === 'dentist') {
        type = 'cabinet_dentaire';
      } else if (amenity === 'doctors' || element.tags?.healthcare === 'doctor') {
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
    }).filter((p: any) => p.latitude && p.longitude);

    console.log(`Transformed ${providers.length} providers with coordinates`);

    // Supprimer les anciens providers OSM
    const { error: deleteError } = await supabase
      .from('osm_health_providers')
      .delete()
      .neq('id', '');

    if (deleteError) {
      console.error('Error deleting old providers:', deleteError);
      throw deleteError;
    }

    // Insérer les nouveaux providers
    const { error: insertError } = await supabase
      .from('osm_health_providers')
      .insert(providers);

    if (insertError) {
      console.error('Error inserting providers:', insertError);
      throw insertError;
    }

    console.log(`Successfully saved ${providers.length} providers to database`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: providers.length,
        message: `${providers.length} établissements sauvegardés dans la base de données`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
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
