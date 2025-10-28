#!/usr/bin/env node

/**
 * Script pour créer un nouveau compte superadmin fonctionnel
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createSuperAdmin() {
  try {
    console.log('\n🔧 CRÉATION D\'UN NOUVEAU SUPER ADMIN');
    console.log('═'.repeat(50));

    const email = 'superadmin2@sante.ga';
    const password = 'SuperAdmin2025!';
    const fullName = 'Super Admin 2';

    console.log(`📝 Création du compte: ${fullName} (${email})`);

    // 1. Créer le compte utilisateur
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (authError) {
      throw new Error(`Auth: ${authError.message}`);
    }

    if (!user) {
      throw new Error('Aucun utilisateur créé');
    }

    console.log(`✅ Compte créé (${user.id})`);

    // 2. Créer le profil
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: fullName,
        email: email,
        phone: '+241 00 00 00 00',
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.log(`⚠️  Profil: ${profileError.message}`);
    } else {
      console.log(`✅ Profil créé`);
    }

    // 3. Ajouter le rôle super_admin
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: 'super_admin'
      });

    if (roleError) {
      console.log(`⚠️  Rôle: ${roleError.message}`);
    } else {
      console.log(`✅ Rôle super_admin ajouté`);
    }

    // 4. Tester la connexion
    console.log('\n🧪 TEST DE CONNEXION:');
    const { data: { user: testUser }, error: testError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (testError) {
      console.log(`❌ Test de connexion échoué: ${testError.message}`);
    } else {
      console.log(`✅ Test de connexion réussi`);
      
      // Vérifier les rôles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', testUser.id);
      
      console.log(`📋 Rôles: ${roles?.map(r => r.role).join(', ')}`);
      
      await supabase.auth.signOut();
      console.log(`🔓 Déconnexion réussie`);
    }

    console.log('\n🎉 SUCCÈS!');
    console.log('─'.repeat(50));
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Mot de passe: ${password}`);
    console.log(`👤 Nom: ${fullName}`);
    console.log('\n💡 Vous pouvez maintenant vous connecter sur:');
    console.log('   • http://localhost:5173/superadmin');
    console.log('   • http://localhost:5173/login/pro (pour les professionnels)');

  } catch (error) {
    console.error(`❌ ERREUR: ${error.message}`);
  }
}

createSuperAdmin();
