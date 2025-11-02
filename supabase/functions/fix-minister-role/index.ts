import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const ministerEmail = 'ministre@sante.gouv.ga'

    // 1. Trouver l'utilisateur ministre
    const { data: users } = await supabaseAdmin.auth.admin.listUsers()
    const ministerUser = users?.users.find(u => u.email === ministerEmail)

    if (!ministerUser) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Utilisateur ministre non trouvé',
          message: 'Veuillez d\'abord créer le compte via le dashboard Supabase'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

    const userId = ministerUser.id

    // 2. Supprimer les rôles existants
    await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    // 3. Ajouter le rôle moderator
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: userId, role: 'moderator' })

    if (roleError && roleError.code !== '23505') { // Ignore duplicate key error
      throw roleError
    }

    // 4. Créer ou mettre à jour le profil
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        full_name: 'Pr. Adrien MOUGOUGOU',
        user_type: 'professional',
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      throw profileError
    }

    // 5. Vérifier les rôles
    const { data: roles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Rôle du ministre configuré avec succès',
        data: {
          user_id: userId,
          email: ministerEmail,
          roles: roles?.map(r => r.role) || [],
          full_name: 'Pr. Adrien MOUGOUGOU',
          credentials: {
            email: ministerEmail,
            password: 'MinistryGab2025!',
            login_url: '/login/professional'
          }
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

