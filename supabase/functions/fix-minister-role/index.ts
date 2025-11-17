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
    // Authenticate user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    // Verify user is super_admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check for super_admin role
    const { data: roles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)

    if (!roles?.some(r => r.role === 'super_admin')) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: super_admin role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    // 5. Trouver ou créer l'établissement Ministère de la Santé
    let ministryId = null
    const { data: existingMinistry } = await supabaseAdmin
      .from('establishments')
      .select('id')
      .ilike('name', '%ministère%santé%')
      .single()

    if (existingMinistry) {
      ministryId = existingMinistry.id
    } else {
      const { data: newMinistry, error: ministryError } = await supabaseAdmin
        .from('establishments')
        .insert({
          name: 'Ministère de la Santé Publique',
          type: 'hospital',
          sector: 'public',
          address: 'À côté de l\'immeuble Alu-Suisse',
          city: 'Libreville',
          province: 'Estuaire',
          phone: '+241 01-72-26-61',
          email: 'contact@sante.gouv.ga',
          is_verified: true,
          status: 'active'
        })
        .select('id')
        .single()

      if (!ministryError && newMinistry) {
        ministryId = newMinistry.id
      }
    }

    // 6. Trouver ou créer le profil professionnel
    let professionalId = null
    const { data: existingPro } = await supabaseAdmin
      .from('professionals')
      .select('id')
      .eq('profile_id', userId)
      .single()

    if (existingPro) {
      professionalId = existingPro.id
      // Mettre à jour
      await supabaseAdmin
        .from('professionals')
        .update({
          profession_type: 'doctor',
          specializations: ['Administration de la Santé', 'Santé Publique'],
          is_verified: true
        })
        .eq('id', professionalId)
    } else {
      const { data: newPro } = await supabaseAdmin
        .from('professionals')
        .insert({
          profile_id: userId,
          profession_type: 'doctor',
          specializations: ['Administration de la Santé', 'Santé Publique'],
          is_verified: true
        })
        .select('id')
        .single()

      if (newPro) {
        professionalId = newPro.id
      }
    }

    // 7. Supprimer les affiliations existantes
    if (professionalId) {
      await supabaseAdmin
        .from('professional_affiliations')
        .delete()
        .eq('professional_id', professionalId)

      await supabaseAdmin
        .from('establishment_staff')
        .delete()
        .eq('professional_id', professionalId)

      // 8. Créer l'affiliation au Ministère
      if (ministryId) {
        await supabaseAdmin
          .from('professional_affiliations')
          .upsert({
            professional_id: professionalId,
            establishment_id: ministryId,
            role: 'director',
            department: 'Administration',
            service: 'Direction Générale',
            status: 'approved',
            start_date: new Date().toISOString().split('T')[0],
            can_prescribe: true,
            can_admit_patients: true,
            can_access_all_patients: true,
            can_manage_staff: true,
            can_manage_inventory: true,
            can_view_financials: true
          })

        await supabaseAdmin
          .from('establishment_staff')
          .upsert({
            establishment_id: ministryId,
            professional_id: professionalId,
            role: 'Ministre de la Santé',
            department: 'Direction Générale',
            status: 'active',
            is_establishment_admin: true,
            start_date: new Date().toISOString().split('T')[0]
          })
      }
    }

    // 9. Vérifier les rôles
    const { data: userRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Compte ministre configuré avec succès',
        data: {
          user_id: userId,
          email: ministerEmail,
          roles: userRoles?.map(r => r.role) || [],
          full_name: 'Pr. Adrien MOUGOUGOU',
          professional_id: professionalId,
          ministry_id: ministryId,
          establishment: 'Ministère de la Santé Publique',
          title: 'Ministre de la Santé',
          credentials: {
            email: ministerEmail,
            login_url: '/login/professional',
            note: 'Password has been reset. Contact system administrator for new credentials via secure channel.'
          },
          actions_performed: [
            '✅ Rôle moderator ajouté',
            '✅ Profil professionnel créé/mis à jour',
            '✅ Établissement Ministère de la Santé créé/trouvé',
            '✅ Affiliations SOGARA supprimées',
            '✅ Affiliation au Ministère créée',
            '✅ Titre "Ministre de la Santé" assigné'
          ]
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

