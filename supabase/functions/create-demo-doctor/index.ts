import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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
    );

    console.log('Creating demo doctor account...');

    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser, error: existingError } = await supabaseAdmin.auth.admin.listUsers();
    
    const demoEmail = 'demo.medecin@sante.ga';
    const userExists = existingUser?.users?.some(u => u.email === demoEmail);

    let userId: string;

    if (userExists) {
      console.log('User already exists, updating password...');
      const existingUserData = existingUser?.users?.find(u => u.email === demoEmail);
      userId = existingUserData!.id;

      // Mettre à jour le mot de passe
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { password: 'Doctor2025!' }
      );

      if (updateError) {
        throw new Error(`Error updating password: ${updateError.message}`);
      }
    } else {
      console.log('Creating new user...');
      // Créer l'utilisateur
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: demoEmail,
        password: 'Doctor2025!',
        email_confirm: true,
        user_metadata: {
          full_name: 'Dr. Demo Cardiologue'
        }
      });

      if (createError) {
        throw new Error(`Error creating user: ${createError.message}`);
      }

      if (!newUser.user) {
        throw new Error('User creation failed');
      }

      userId = newUser.user.id;
      console.log('User created successfully:', userId);
    }

    // Créer ou mettre à jour le profil
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          full_name: 'Dr. Demo Cardiologue',
          email: demoEmail,
          phone: '+241 06 00 00 00',
          profile_type: 'professional'
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    // Créer ou mettre à jour le profil professionnel
    const { data: existingProfessional } = await supabaseAdmin
      .from('professionals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!existingProfessional) {
      const { error: professionalError } = await supabaseAdmin
        .from('professionals')
        .insert({
          user_id: userId,
          full_name: 'Dr. Demo Cardiologue',
          email: demoEmail,
          phone: '+241 06 00 00 00',
          professional_type: 'medecin_specialiste',
          specialization: 'Cardiologie',
          status: 'actif',
          verified: true,
          documents_verified: true,
          verification_date: new Date().toISOString()
        });

      if (professionalError) {
        console.error('Error creating professional profile:', professionalError);
        throw new Error(`Error creating professional: ${professionalError.message}`);
      }
    }

    // Assigner le rôle doctor
    const { data: existingRole } = await supabaseAdmin
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'doctor')
      .single();

    if (!existingRole) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'doctor'
        });

      if (roleError) {
        console.error('Error assigning role:', roleError);
      }
    }

    console.log('Demo doctor account created successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo doctor account created successfully',
        userId,
        email: demoEmail
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
