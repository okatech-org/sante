#!/usr/bin/env node

/**
 * Script pour tester la connexion avec les comptes créés
 * Usage: node test-login.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ ERREUR: Variables manquantes dans .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const testAccounts = [
  {
    email: 'admin@sante.ga',
    password: 'Admin2025!',
    expectedRole: 'admin',
    type: 'admin'
  },
  {
    email: 'superadmin@sante.ga',
    password: 'SuperAdmin2025!',
    expectedRole: 'super_admin',
    type: 'admin'
  },
  {
    email: 'medecin@sante.ga',
    password: 'Medecin2025!',
    expectedRole: 'doctor',
    type: 'professional'
  }
];

async function testLogin(account) {
  try {
    console.log(`\n🔐 Test de connexion: ${account.email}`);

    // 1. Tentative de connexion
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: account.password
    });

    if (authError) {
      console.log(`   ❌ Erreur de connexion: ${authError.message}`);
      return { success: false, error: authError.message };
    }

    if (!user) {
      console.log(`   ❌ Aucun utilisateur retourné`);
      return { success: false, error: 'Aucun utilisateur' };
    }

    console.log(`   ✅ Connexion réussie (${user.id})`);

    // 2. Vérifier les rôles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (rolesError) {
      console.log(`   ⚠️  Erreur lors de la récupération des rôles: ${rolesError.message}`);
    } else {
      const userRoles = roles?.map(r => r.role) || [];
      console.log(`   📋 Rôles trouvés: ${userRoles.join(', ')}`);
      
      if (userRoles.includes(account.expectedRole)) {
        console.log(`   ✅ Rôle attendu trouvé: ${account.expectedRole}`);
      } else {
        console.log(`   ⚠️  Rôle attendu manquant: ${account.expectedRole}`);
      }
    }

    // 3. Vérifier le profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log(`   ⚠️  Erreur profil: ${profileError.message}`);
    } else {
      console.log(`   👤 Profil: ${profile.full_name}`);
    }

    // 4. Déconnexion
    await supabase.auth.signOut();
    console.log(`   🔓 Déconnexion réussie`);

    return { success: true, user, roles: roles?.map(r => r.role) || [] };

  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('\n🧪 TEST DE CONNEXION DES COMPTES');
  console.log('═'.repeat(50));

  const results = [];
  
  for (const account of testAccounts) {
    const result = await testLogin(account);
    results.push({ account, result });
  }

  console.log('\n📊 RÉSULTATS:');
  console.log('─'.repeat(50));
  
  const successful = results.filter(r => r.result.success);
  const failed = results.filter(r => !r.result.success);

  console.log(`✅ Connexions réussies: ${successful.length}/${results.length}`);
  console.log(`❌ Connexions échouées: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    console.log('\n🎉 COMPTES FONCTIONNELS:');
    successful.forEach(({ account }) => {
      console.log(`   • ${account.email} (${account.type})`);
    });
  }

  if (failed.length > 0) {
    console.log('\n❌ PROBLÈMES:');
    failed.forEach(({ account, result }) => {
      console.log(`   • ${account.email}: ${result.error}`);
    });
  }

  console.log('\n💡 POUR TESTER MANUELLEMENT:');
  console.log('   1. Ouvrez http://localhost:5173');
  console.log('   2. Allez sur /login/pro pour les professionnels');
  console.log('   3. Allez sur /superadmin pour les administrateurs');
  console.log('   4. Utilisez les identifiants ci-dessus');
}

main().catch(console.error);
