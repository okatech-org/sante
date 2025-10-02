import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DemoAccount {
  email: string;
  password: string;
  fullName: string;
  role: string;
  phone: string;
}

const demoAccounts: DemoAccount[] = [
  {
    email: "patient.demo@sante.ga",
    password: "demo123",
    fullName: "Marie OKOME",
    role: "patient",
    phone: "+24101234567"
  },
  {
    email: "medecin.demo@sante.ga",
    password: "demo123",
    fullName: "Dr. Pierre KOMBILA",
    role: "doctor",
    phone: "+24101234568"
  },
  {
    email: "specialiste.demo@sante.ga",
    password: "demo123",
    fullName: "Dr. Sylvie NGUEMA",
    role: "specialist",
    phone: "+24101234569"
  },
  {
    email: "infirmiere.demo@sante.ga",
    password: "demo123",
    fullName: "Sophie MBOUMBA",
    role: "nurse",
    phone: "+24101234570"
  },
  {
    email: "sagefemme.demo@sante.ga",
    password: "demo123",
    fullName: "Grace ONDO",
    role: "midwife",
    phone: "+24101234571"
  },
  {
    email: "kine.demo@sante.ga",
    password: "demo123",
    fullName: "Marc MOUNGUENGUI",
    role: "physiotherapist",
    phone: "+24101234572"
  },
  {
    email: "psychologue.demo@sante.ga",
    password: "demo123",
    fullName: "Alice BOULINGUI",
    role: "psychologist",
    phone: "+24101234573"
  },
  {
    email: "ophtalmo.demo@sante.ga",
    password: "demo123",
    fullName: "Dr. Joseph MENGUE",
    role: "ophthalmologist",
    phone: "+24101234574"
  },
  {
    email: "anesthesiste.demo@sante.ga",
    password: "demo123",
    fullName: "Dr. François OVONO",
    role: "anesthesiologist",
    phone: "+24101234575"
  },
  {
    email: "pharmacien.demo@sante.ga",
    password: "demo123",
    fullName: "Jean MOUSSAVOU",
    role: "pharmacist",
    phone: "+24101234576"
  },
  {
    email: "pharmacie.demo@sante.ga",
    password: "demo123",
    fullName: "Pharmacie du Centre",
    role: "pharmacy",
    phone: "+24101234577"
  },
  {
    email: "labo.demo@sante.ga",
    password: "demo123",
    fullName: "Claire NDONG",
    role: "laboratory_technician",
    phone: "+24101234578"
  },
  {
    email: "radiologue.demo@sante.ga",
    password: "demo123",
    fullName: "Dr. Daniel IBINGA",
    role: "radiologist",
    phone: "+24101234579"
  },
  {
    email: "radiologie.demo@sante.ga",
    password: "demo123",
    fullName: "Centre d'Imagerie Médicale",
    role: "radiology_center",
    phone: "+24101234580"
  },
  {
    email: "admin.demo@sante.ga",
    password: "demo123",
    fullName: "Admin MBADINGA",
    role: "admin",
    phone: "+24101234581"
  },
  {
    email: "hopital.demo@sante.ga",
    password: "demo123",
    fullName: "CHU Owendo",
    role: "hospital_admin",
    phone: "+24101234582"
  },
  {
    email: "clinique.demo@sante.ga",
    password: "demo123",
    fullName: "Clinique Sainte-Marie",
    role: "clinic_admin",
    phone: "+24101234583"
  }
];

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

    const results = []

    for (const account of demoAccounts) {
      console.log(`Creating account: ${account.email}`)
      
      // Try to create the user
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          full_name: account.fullName,
          phone: account.phone
        }
      })

      if (userError) {
        // If user already exists, try to get their ID
        if (userError.message.includes('already registered')) {
          console.log(`User ${account.email} already exists, updating...`)
          
          const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
          const existingUser = existingUsers.users.find(u => u.email === account.email)
          
          if (existingUser) {
            // Update user metadata
            await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
              user_metadata: {
                full_name: account.fullName,
                phone: account.phone
              }
            })

            // Check if role exists
            const { data: existingRoles } = await supabaseAdmin
              .from('user_roles')
              .select('*')
              .eq('user_id', existingUser.id)
              .eq('role', account.role)

            if (!existingRoles || existingRoles.length === 0) {
              // Add role
              await supabaseAdmin
                .from('user_roles')
                .insert({
                  user_id: existingUser.id,
                  role: account.role
                })
            }

            results.push({
              email: account.email,
              status: 'updated',
              userId: existingUser.id
            })
          }
        } else {
          results.push({
            email: account.email,
            status: 'error',
            error: userError.message
          })
        }
        continue
      }

      if (userData.user) {
        // Add role to user_roles table
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: userData.user.id,
            role: account.role
          })

        if (roleError) {
          console.error(`Error adding role for ${account.email}:`, roleError)
          results.push({
            email: account.email,
            status: 'user_created_role_error',
            userId: userData.user.id,
            error: roleError.message
          })
        } else {
          results.push({
            email: account.email,
            status: 'created',
            userId: userData.user.id
          })
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo accounts processed',
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
