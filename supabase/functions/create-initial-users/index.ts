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

    // Get passwords from environment or generate secure ones
    const ministerPassword = Deno.env.get('MINISTER_INITIAL_PASSWORD')
    const adminPassword = Deno.env.get('ADMIN_INITIAL_PASSWORD')

    if (!ministerPassword || !adminPassword) {
      return new Response(
        JSON.stringify({ 
          error: 'Configuration error: Initial passwords not configured in environment variables',
          required_vars: ['MINISTER_INITIAL_PASSWORD', 'ADMIN_INITIAL_PASSWORD']
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const usersToCreate = [
      {
        email: 'ministre@sante.gouv.ga',
        password: ministerPassword,
        email_confirm: true,
        user_metadata: {
          full_name: 'Pr. Adrien MOUGOUGOU',
          role: 'minister'
        }
      },
      {
        email: 'admin@test.com',
        password: adminPassword,
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
