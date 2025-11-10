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

    // Vérifier si l'utilisateur existe déjà de manière robuste
    const demoEmail = 'demo.medecin@sante.ga';

    let userId: string | undefined;
    let existingUserObj: any = null;

    // 1) Essayer via la table profiles (contient l'ID auth.users)
    const { data: profileByEmail } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', demoEmail)
      .maybeSingle();

    if (profileByEmail?.id) {
      userId = profileByEmail.id;
      const { data: byId } = await supabaseAdmin.auth.admin.getUserById(profileByEmail.id as string);
      if (byId?.user) existingUserObj = byId.user;
    }

    // 2) Fallback: parcourir les pages d'utilisateurs si non trouvé
    if (!existingUserObj) {
      for (let page = 1; page <= 10; page++) {
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
        const found = list?.users?.find((u: any) => u.email?.toLowerCase() === demoEmail);
        if (found) {
          existingUserObj = found;
          userId = found.id;
          break;
        }
        if (!list?.users?.length) break;
      }
    }

    if (existingUserObj && userId) {
      console.log('User already exists, updating password...');
      // Mettre à jour le mot de passe et confirmer l'email
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        {
          password: 'Doctor2025!',
          email_confirm: true,
          user_metadata: { full_name: 'Dr. Demo Cardiologue' }
        }
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
        const msg = (createError.message || '').toLowerCase();
        if (msg.includes('already') && msg.includes('registered')) {
          console.log('User already registered, resolving by lookup and updating password...');
          // Tenter via profiles
          if (!userId) {
            const { data: prof } = await supabaseAdmin
              .from('profiles')
              .select('id')
              .eq('email', demoEmail)
              .maybeSingle();
            if (prof?.id) userId = prof.id as string;
          }
          // Tenter via professionals
          if (!userId) {
            const { data: pro } = await supabaseAdmin
              .from('professionals')
              .select('user_id')
              .eq('email', demoEmail)
              .maybeSingle();
            if (pro?.user_id) userId = pro.user_id as string;
          }
          // Fallback: parcourir les pages d'utilisateurs
          if (!userId) {
            for (let page = 1; page <= 100; page++) {
              const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
              const found = list?.users?.find((u: any) => (u.email || '').toLowerCase() === demoEmail);
              if (found) { userId = found.id; break; }
              if (!list?.users?.length) break;
            }
          }
          if (!userId) {
            throw new Error(`Email exists but no user id found for ${demoEmail}`);
          }
          const { error: updateExistingError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: 'Doctor2025!',
            email_confirm: true,
            user_metadata: { full_name: 'Dr. Demo Cardiologue' }
          });
          if (updateExistingError) {
            throw new Error(`Error updating existing user password: ${updateExistingError.message}`);
          }
        } else {
          throw new Error(`Error creating user: ${createError.message}`);
        }
      }
      if (newUser?.user) {
        userId = newUser.user.id;
        console.log('User created successfully:', userId);
      }
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
