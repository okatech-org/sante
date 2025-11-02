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

    const usersToCreate = [
      {
        email: 'ministre@sante.gouv.ga',
        password: 'MinistryGab2025!',
        email_confirm: true,
        user_metadata: {
          full_name: 'Pr. Adrien MOUGOUGOU',
          role: 'minister'
        }
      },
      {
        email: 'admin@test.com',
        password: 'admin2025',
        email_confirm: true,
        user_metadata: {
          full_name: 'Admin Test',
          role: 'admin'
        }
      }
    ]

    const results = []

    for (const userData of usersToCreate) {
      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
      const userExists = existingUser?.users.some(u => u.email === userData.email)

      if (userExists) {
        results.push({
          email: userData.email,
          status: 'already_exists',
          message: 'User already exists'
        })
        continue
      }

      // Create user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: userData.email_confirm,
        user_metadata: userData.user_metadata
      })

      if (error) {
        results.push({
          email: userData.email,
          status: 'error',
          error: error.message
        })
      } else {
        results.push({
          email: userData.email,
          status: 'created',
          user_id: data.user.id
        })
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
