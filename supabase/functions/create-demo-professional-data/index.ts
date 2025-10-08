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

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get professional ID
    const { data: professional } = await supabaseAdmin
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!professional) {
      return new Response(
        JSON.stringify({ error: 'Professional profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const professionalId = professional.id;
    const results: any = {
      conventions: [],
      verifications: [],
      teleconsultations: [],
      prescriptions: []
    };

    // Create CNAMGS convention
    const { data: convention, error: conventionError } = await supabaseAdmin
      .from('professional_conventions')
      .insert({
        professional_id: professionalId,
        organization: 'CNAMGS',
        convention_number: 'CONV-2024-001',
        status: 'actif',
        start_date: '2024-01-01',
        tiers_payant_enabled: true
      })
      .select()
      .single();

    if (conventionError) {
      console.error('Convention error:', conventionError);
    } else {
      results.conventions.push(convention);
    }

    // Create CNOM verification
    const { data: verification, error: verificationError } = await supabaseAdmin
      .from('cnom_verifications')
      .insert({
        professional_id: professionalId,
        numero_ordre: '241-CAR-2020-001',
        specialty: 'Cardiologie',
        verification_status: 'verified',
        verified_at: new Date().toISOString(),
        inscription_date: '2020-01-15'
      })
      .select()
      .single();

    if (verificationError) {
      console.error('Verification error:', verificationError);
    } else {
      results.verifications.push(verification);
    }

    // Get some patients for demo data
    const { data: patients } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .limit(3);

    if (patients && patients.length > 0) {
      // Create demo teleconsultation sessions
      for (let i = 0; i < 2; i++) {
        const patient = patients[i % patients.length];
        const date = new Date();
        date.setDate(date.getDate() + i);

        const { data: session, error: sessionError } = await supabaseAdmin
          .from('teleconsultation_sessions')
          .insert({
            professional_id: professionalId,
            patient_id: patient.id,
            status: 'scheduled',
            session_type: 'video',
            scheduled_at: date.toISOString(),
            notes: `Consultation de suivi pour ${patient.full_name}`
          })
          .select()
          .single();

        if (!sessionError && session) {
          results.teleconsultations.push(session);
        }
      }

      // Create demo electronic prescriptions
      for (let i = 0; i < 3; i++) {
        const patient = patients[i % patients.length];
        
        const { data: prescription, error: prescriptionError } = await supabaseAdmin
          .from('electronic_prescriptions')
          .insert({
            professional_id: professionalId,
            patient_id: patient.id,
            prescription_number: `RX${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(i + 1).padStart(6, '0')}`,
            medications: [
              {
                name: i === 0 ? 'Metformine 500mg' : i === 1 ? 'Amlodipine 5mg' : 'Oméprazole 20mg',
                dosage: i === 0 ? '1cp x2/j' : i === 1 ? '1cp/j' : '1cp/j à jeun',
                frequency: 'quotidien',
                duration: i === 0 ? '30 jours' : i === 1 ? '90 jours' : '28 jours'
              }
            ],
            diagnosis: i === 0 ? 'Diabète type 2' : i === 1 ? 'Hypertension' : 'Reflux gastrique',
            status: i === 2 ? 'dispensed' : 'active',
            issued_date: new Date().toISOString().split('T')[0],
            expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          })
          .select()
          .single();

        if (!prescriptionError && prescription) {
          results.prescriptions.push(prescription);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo professional data created successfully',
        data: results
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
        status: 500 
      }
    )
  }
})
