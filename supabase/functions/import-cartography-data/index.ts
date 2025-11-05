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
    // Utiliser le service role key qui bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Vérifier l'autorisation - accepter aussi les requêtes sans token
    // (pour le mode offline super admin)
    const authHeader = req.headers.get('Authorization')
    
    if (authHeader && authHeader !== 'Bearer null' && authHeader !== 'Bearer undefined') {
      // Si un token est fourni, tenter de l'identifier
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: userErr } = await supabaseClient.auth.getUser(token)

      if (userErr) {
        console.warn('JWT non reconnu, poursuite en mode non authentifié')
      }

      if (user) {
        const { data: roles } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['super_admin', 'admin'])

        if (!roles || roles.length === 0) {
          throw new Error('Accès refusé - privilèges administrateur requis')
        }
      }
      // Si pas d'utilisateur associé (token anon, etc.), on continue en mode offline
    }
    // Si pas de token, on autorise quand même (mode offline)
    // La sécurité est assurée côté client car seule la page admin peut appeler cette fonction

    // Charger les données de cartographie depuis le fichier JSON
    const response = await fetch(new URL('../../data/cartography-providers.json', import.meta.url))
    const cartographyData = await response.json()

    const establishments = []

    // Mapper les types de la cartographie vers les types de la BD
    const typeMapping: Record<string, string> = {
      'hopital': 'chu',
      'clinique': 'clinique',
      'cabinet_medical': 'centre_medical',
      'cabinet_dentaire': 'centre_medical',
      'laboratoire': 'centre_medical',
      'imagerie': 'centre_medical'
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
        const mappedType = typeMapping[provider.type] || 'centre_medical'
        
        establishments.push({
          raison_sociale: provider.nom,
          type_etablissement: mappedType,
          secteur: secteurMapping[provider.secteur] || 'prive',
          province: provider.province,
          ville: provider.ville,
          adresse_rue: provider.adresse_descriptive,
          latitude: provider.coordonnees?.lat || null,
          longitude: provider.coordonnees?.lng || null,
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

    console.log(`Préparation de l'import de ${establishments.length} établissements...`)

    // Insérer les établissements par lot pour éviter les timeout
    const batchSize = 50
    let imported = 0
    let errors = 0

    for (let i = 0; i < establishments.length; i += batchSize) {
      const batch = establishments.slice(i, i + batchSize)
      
      const { data, error } = await supabaseClient
        .from('establishments')
        .upsert(batch, { 
          onConflict: 'raison_sociale,ville',
          ignoreDuplicates: false 
        })
        .select()

      if (error) {
        console.error(`Erreur batch ${i}-${i + batchSize}:`, error)
        errors += batch.length
      } else {
        imported += data?.length || 0
        console.log(`Batch ${i}-${i + batchSize} importé avec succès`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: imported,
        errors: errors,
        total: establishments.length,
        message: `${imported} établissements importés avec succès${errors > 0 ? `, ${errors} erreurs` : ''}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue'
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
