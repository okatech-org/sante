import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    console.log('Fetching OSM health providers for:', { province, city });

    // Bbox pour le Gabon (approximatif)
    // Format: [sud, ouest, nord, est]
    const gabonBbox = "-4.0,8.5,2.5,14.5";
    
    // Requête Overpass pour récupérer tous les établissements de santé
    const overpassQuery = `
      [out:json][timeout:60];
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
        node["healthcare"="hospital"](${gabonBbox});
        way["healthcare"="hospital"](${gabonBbox});
        node["healthcare"="clinic"](${gabonBbox});
        way["healthcare"="clinic"](${gabonBbox});
        node["healthcare"="doctor"](${gabonBbox});
        way["healthcare"="doctor"](${gabonBbox});
      );
      out body center;
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
      // Déterminer le type d'établissement
      let type = 'cabinet_medical';
      const amenity = element.tags?.amenity || element.tags?.healthcare;
      
      if (amenity === 'hospital' || element.tags?.healthcare === 'hospital') {
        type = 'hopital';
      } else if (amenity === 'clinic' || element.tags?.healthcare === 'clinic') {
        type = 'clinique';
      } else if (amenity === 'pharmacy') {
        type = 'pharmacie';
      } else if (amenity === 'doctors' || element.tags?.healthcare === 'doctor') {
        type = 'cabinet_medical';
      }

      // Récupérer les coordonnées
      let lat, lng;
      if (element.lat && element.lon) {
        lat = element.lat;
        lng = element.lon;
      } else if (element.center) {
        lat = element.center.lat;
        lng = element.center.lon;
      }

      // Extraire les informations
      const name = element.tags?.name || element.tags?.['name:fr'] || 'Établissement sans nom';
      const phone = element.tags?.phone || element.tags?.['contact:phone'];
      const email = element.tags?.email || element.tags?.['contact:email'];
      const website = element.tags?.website || element.tags?.['contact:website'];
      const openingHours = element.tags?.opening_hours;
      const emergency = element.tags?.emergency === 'yes';
      const address = element.tags?.['addr:street'] || '';
      const city = element.tags?.['addr:city'] || '';
      const operator = element.tags?.operator;
      const beds = element.tags?.beds ? parseInt(element.tags.beds) : undefined;

      return {
        id: `OSM_${element.id}`,
        osm_id: element.id,
        type,
        nom: name,
        province: 'G1', // À déterminer selon la localisation
        ville: city || 'Libreville',
        coordonnees: lat && lng ? { lat, lng } : undefined,
        adresse_descriptive: address || city || '',
        telephones: phone ? [phone] : [],
        email: email || undefined,
        site_web: website || undefined,
        horaires: openingHours || undefined,
        services: [],
        specialites: [],
        ouvert_24_7: emergency || false,
        conventionnement: {
          cnamgs: false,
          cnss: false,
        },
        secteur: operator?.toLowerCase().includes('public') ? 'public' : 'prive',
        statut_operationnel: 'operationnel',
        source: 'OpenStreetMap',
        nombre_lits: beds,
      };
    }).filter((p: any) => p.coordonnees); // Garder seulement ceux avec coordonnées

    console.log(`Transformed ${providers.length} providers`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: providers.length,
        providers 
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
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
