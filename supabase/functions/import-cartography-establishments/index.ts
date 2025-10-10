import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Vérifier que l'utilisateur est super_admin
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('Non autorisé')
    }

    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'super_admin')
      .single()

    if (!roles) {
      throw new Error('Accès refusé - super admin requis')
    }

    // Charger les données de cartographie
    const cartographyData = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/cartography/providers.json`
    ).then(res => res.json())

    const establishments = []

    // Mapper les types
    const typeMapping: Record<string, string> = {
      'hopital': 'hopital_public',
      'clinique': 'clinique_privee',
      'cabinet_medical': 'cabinet_medical',
      'cabinet_dentaire': 'cabinet_dentaire',
      'pharmacie': 'pharmacie',
      'laboratoire': 'laboratoire_analyses',
      'imagerie': 'centre_imagerie'
    }

    const secteurMapping: Record<string, string> = {
      'public': 'public',
      'prive': 'prive',
      'parapublic': 'parapublic',
      'confessionnel': 'confessionnel',
      'ong': 'ong',
      'militaire': 'militaire'
    }

    for (const provider of cartographyData) {
      // Ne traiter que les établissements (pas les pharmacies individuelles)
      if (['hopital', 'clinique', 'cabinet_medical', 'laboratoire', 'imagerie'].includes(provider.type)) {
        establishments.push({
          raison_sociale: provider.nom,
          type_etablissement: typeMapping[provider.type] || 'autre',
          secteur: secteurMapping[provider.secteur] || 'prive',
          province: provider.province,
          ville: provider.ville,
          adresse_rue: provider.adresse_descriptive,
          latitude: provider.coordonnees?.lat,
          longitude: provider.coordonnees?.lng,
          telephone_standard: provider.telephones?.[0] || null,
          email: provider.email || null,
          site_web: provider.site_web || null,
          service_urgences_actif: provider.ouvert_24_7 || false,
          cnamgs_conventionne: provider.conventionnement?.cnamgs || false,
          nombre_lits_total: provider.nombre_lits || 0,
          statut: 'actif',
          account_claimed: false,
          date_inscription: new Date().toISOString().split('T')[0]
        })
      }
    }

    // Insérer les établissements (ignorer les doublons)
    const { data: inserted, error: insertError } = await supabaseClient
      .from('establishments')
      .upsert(establishments, { 
        onConflict: 'raison_sociale,ville',
        ignoreDuplicates: true 
      })
      .select()

    if (insertError) {
      console.error('Insert error:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: inserted?.length || 0,
        total: establishments.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
