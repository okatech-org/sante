#!/usr/bin/env node

/**
 * Script pour créer le compte du Ministre de la Santé
 * Pr. Adrien MOUGOUGOU
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🏛️  Création du compte Ministre de la Santé\n');
console.log('━'.repeat(50));

if (!SUPABASE_URL) {
  console.error('❌ ERREUR: VITE_SUPABASE_URL non trouvée dans .env.local');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERREUR: SUPABASE_SERVICE_ROLE_KEY non trouvée dans .env.local\n');
  console.log('📝 Pour récupérer la Service Role Key:');
  console.log('   1. Allez sur: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/settings/api');
  console.log('   2. Section "Project API keys"');
  console.log('   3. Copiez la clé "service_role" (⚠️  Gardez-la secrète!)');
  console.log('   4. Ajoutez-la dans .env.local:');
  console.log('      SUPABASE_SERVICE_ROLE_KEY=votre_cle_ici\n');
  console.log('━'.repeat(50));
  console.log('\n💡 Alternative plus simple:');
  console.log('   Allez sur: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/auth/users');
  console.log('   Cliquez sur "Add user" et créez manuellement:');
  console.log('   • Email: ministre@sante.gouv.ga');
  console.log('   • Password: MinistryGab2025!');
  console.log('   • ☑️  Auto Confirm User\n');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createMinisterAccount() {
  const ministerData = {
    email: 'ministre@sante.gouv.ga',
    password: 'MinistryGab2025!',
    email_confirm: true,
    user_metadata: {
      full_name: 'Pr. Adrien MOUGOUGOU',
      title: 'Ministre de la Santé',
      role: 'minister',
      is_minister: true,
      establishment: 'Ministère de la Santé'
    }
  };

  try {
    console.log('🔍 Vérification si le compte existe déjà...');
    
    // Vérifier si l'utilisateur existe déjà
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = users?.users?.find(u => u.email === ministerData.email);

    if (existingUser) {
      console.log('\n✅ Le compte existe déjà!');
      console.log('━'.repeat(50));
      console.log(`📧 Email: ${existingUser.email}`);
      console.log(`🆔 ID: ${existingUser.id}`);
      console.log(`📅 Créé: ${new Date(existingUser.created_at).toLocaleString('fr-FR')}`);
      console.log(`✉️  Confirmé: ${existingUser.email_confirmed_at ? '✅ Oui' : '❌ Non'}`);
      console.log('━'.repeat(50));
      
      if (!existingUser.email_confirmed_at) {
        console.log('\n⚠️  Email non confirmé! Le compte existe mais ne peut pas se connecter.');
        console.log('   Solution: Allez sur le Dashboard Supabase et confirmez l\'email manuellement.');
      } else {
        console.log('\n🎉 Le compte est prêt à être utilisé!');
        console.log('\n🔑 Identifiants de connexion:');
        console.log(`   Email: ${ministerData.email}`);
        console.log(`   Mot de passe: ${ministerData.password}`);
        console.log('\n🌐 Se connecter sur: http://localhost:5173/login/professional');
      }
      
      return;
    }

    console.log('📝 Création du compte en cours...\n');

    // Créer l'utilisateur
    const { data, error } = await supabaseAdmin.auth.admin.createUser(ministerData);

    if (error) {
      console.error('❌ ERREUR lors de la création:', error.message);
      console.error('Détails:', error);
      process.exit(1);
    }

    console.log('✅ Compte créé avec succès!');
    console.log('━'.repeat(50));
    console.log(`📧 Email: ${data.user.email}`);
    console.log(`🆔 ID: ${data.user.id}`);
    console.log(`📅 Créé: ${new Date(data.user.created_at).toLocaleString('fr-FR')}`);
    console.log(`✉️  Confirmé: ${data.user.email_confirmed_at ? '✅ Oui' : '❌ Non'}`);
    console.log('━'.repeat(50));
    
    console.log('\n🎉 Compte du Ministre créé avec succès!');
    console.log('\n🔑 Identifiants de connexion:');
    console.log(`   Email: ${ministerData.email}`);
    console.log(`   Mot de passe: ${ministerData.password}`);
    console.log('\n🌐 Se connecter sur: http://localhost:5173/login/professional');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

createMinisterAccount();

