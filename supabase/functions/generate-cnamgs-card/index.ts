import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CardData {
  numero_carte: string;
  nom: string;
  prenoms: string;
  date_naissance: string;
  sexe: string;
  photo_url?: string;
}

const CANVAS_W = 1050;
const CANVAS_H = 650;

// Validation regexes
const VALIDATIONS = {
  numero_carte: /^\d{3}-\d{3}-\d{3}-\d$/,
  date_naissance: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
  sexe: /^[MF]$/,
};

function validateCardData(data: CardData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!VALIDATIONS.numero_carte.test(data.numero_carte)) {
    errors.push("Numéro de carte invalide (format: ###-###-###-#)");
  }

  if (data.nom.length > 28) {
    errors.push("Nom trop long (max 28 caractères)");
  }

  if (data.prenoms.length > 34) {
    errors.push("Prénoms trop longs (max 34 caractères)");
  }

  if (!VALIDATIONS.date_naissance.test(data.date_naissance)) {
    errors.push("Date de naissance invalide (format: JJ/MM/AAAA)");
  }

  if (!VALIDATIONS.sexe.test(data.sexe)) {
    errors.push("Sexe invalide (M ou F)");
  }

  return { valid: errors.length === 0, errors };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Non autorisé');
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('Profil non trouvé');
    }

    // Prepare card data
    const cardData: CardData = {
      numero_carte: profile.cnamgs_number || '000-000-000-0',
      nom: profile.full_name?.split(' ')[0]?.toUpperCase() || 'NOM',
      prenoms: profile.full_name?.split(' ').slice(1).join(' ')?.toUpperCase() || 'PRENOMS',
      date_naissance: profile.birth_date 
        ? new Date(profile.birth_date).toLocaleDateString('fr-FR')
        : '01/01/1990',
      sexe: profile.gender === 'male' ? 'M' : profile.gender === 'female' ? 'F' : 'M',
      photo_url: profile.avatar_url,
    };

    // Validate data
    const validation = validateCardData(cardData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: 'Données invalides', details: validation.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Read SVG template
    const templateUrl = `${supabaseUrl}/storage/v1/object/public/templates/cnamgs_card_template.svg`;
    let svgTemplate: string;
    
    try {
      const templateResponse = await fetch(templateUrl);
      svgTemplate = await templateResponse.text();
    } catch {
      // Fallback: use embedded template
      svgTemplate = await Deno.readTextFile('./cnamgs_card_template.svg');
    }

    // Replace placeholders
    let filledSvg = svgTemplate
      .replace('[NUM_CARTE]', cardData.numero_carte)
      .replace('[NOM_FAMILLE]', cardData.nom)
      .replace('[PRENOMS]', cardData.prenoms)
      .replace('[JJ/MM/AAAA]', cardData.date_naissance)
      .replace('[M/F]', cardData.sexe);

    // If photo is available, embed it
    if (cardData.photo_url) {
      try {
        const photoResponse = await fetch(cardData.photo_url);
        const photoBlob = await photoResponse.blob();
        const photoBase64 = btoa(String.fromCharCode(...new Uint8Array(await photoBlob.arrayBuffer())));
        const photoDataUrl = `data:${photoBlob.type};base64,${photoBase64}`;
        
        // Insert photo in SVG
        filledSvg = filledSvg.replace(
          '<text x="820" y="480"',
          `<image x="720" y="320" width="200" height="250" href="${photoDataUrl}" preserveAspectRatio="xMidYMid slice"/>\n  <text x="820" y="480"`
        );
      } catch (error) {
        console.error('Error embedding photo:', error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        svg: filledSvg,
        data: cardData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
