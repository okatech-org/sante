#!/usr/bin/env node

/**
 * Script pour créer des comptes de test admin et professionnel
 * Usage: node create-test-accounts.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ ERREUR: Variables manquantes dans .env.local');
  console.error('   Assurez-vous que VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY sont définis');
  process.exit(1);
}

// Client Supabase avec clé anonyme
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testAccounts = [
  {
    email: 'admin@sante.ga',
    password: 'Admin2025!',
    fullName: 'Administrateur Test',
    role: 'admin',
    type: 'admin'
  },
  {
    email: 'superadmin@sante.ga',
    password: 'SuperAdmin2025!',
    fullName: 'Super Administrateur Test',
    role: 'super_admin',
    type: 'admin'
  },
  {
    email: 'medecin@sante.ga',
    password: 'Medecin2025!',
    fullName: 'Dr. Test Médecin',
    role: 'doctor',
    type: 'professional'
  },
  {
    email: 'infirmiere@sante.ga',
    password: 'Infirmiere2025!',
    fullName: 'Infirmière Test',
    role: 'nurse',
    type: 'professional'
  }
];

async function createTestAccount(account) {
  try {
    console.log(`\n📝 Création du compte: ${account.fullName} (${account.email})`);

    // 1. Créer le compte utilisateur
    console.log(`   ├─ Création du compte utilisateur...`);
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: {
          full_name: account.fullName
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`   ├─ ℹ️  Le compte existe déjà`);
        return { success: true, user: null, message: 'Compte existant' };
      }
      throw new Error(`Auth: ${authError.message}`);
    }

    if (!user) {
      throw new Error('Aucun utilisateur créé');
    }

    console.log(`   ├─ ✅ Compte créé (${user.id})`);

    // 2. Créer le profil
    console.log(`   ├─ Création du profil...`);
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: account.fullName,
        email: account.email,
        phone: '+241 00 00 00 00', // Numéro par défaut
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.log(`   ├─ ⚠️  Profil: ${profileError.message}`);
    } else {
      console.log(`   ├─ ✅ Profil créé`);
    }

    // 3. Ajouter le rôle (si la table existe)
    console.log(`   ├─ Ajout du rôle...`);
    try {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: account.role
        });

      if (roleError) {
        console.log(`   ├─ ⚠️  Rôle: ${roleError.message}`);
      } else {
        console.log(`   ├─ ✅ Rôle ajouté: ${account.role}`);
      }
    } catch (e) {
      console.log(`   ├─ ⚠️  Rôle: ${e.message}`);
    }

    // 4. Si c'est un professionnel, créer le profil professionnel
    if (account.type === 'professional') {
      console.log(`   ├─ Création du profil professionnel...`);
      try {
        const professionalData = {
          user_id: user.id,
          full_name: account.fullName,
          email: account.email,
          professional_type: account.role === 'doctor' ? 'medecin_du_travail' : 'infirmier',
          gender: 'homme',
          title: account.role === 'doctor' ? 'docteur' : 'infirmier',
          birth_date: '1985-03-20',
          nationality: 'Gabonaise',
          numero_ordre: account.role === 'doctor' 
            ? '241-MED-2025-001' 
            : '241-INF-2025-001',
          status: 'actif',
          verified: true,
          documents_verified: true,
          verification_date: new Date().toISOString()
        };

        const { error: profError } = await supabase
          .from('professionals')
          .insert(professionalData);

        if (profError) {
          console.log(`   ├─ ⚠️  Profil professionnel: ${profError.message}`);
        } else {
          console.log(`   ├─ ✅ Profil professionnel créé`);
        }
      } catch (e) {
        console.log(`   ├─ ⚠️  Profil professionnel: ${e.message}`);
      }
    }

    console.log(`   └─ ✅ ${account.fullName} créé avec succès!`);
    return { success: true, user, message: 'Compte créé' };

  } catch (error) {
    console.error(`   └─ ❌ ERREUR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('\n🏥 CRÉATION DES COMPTES DE TEST');
  console.log('═'.repeat(50));

  const results = [];
  
  for (const account of testAccounts) {
    const result = await createTestAccount(account);
    results.push({ account, result });
  }

  console.log('\n📊 RÉSULTATS:');
  console.log('─'.repeat(50));
  
  const successful = results.filter(r => r.result.success);
  const failed = results.filter(r => !r.result.success);

  console.log(`✅ Succès: ${successful.length}/${results.length}`);
  console.log(`❌ Échecs: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    console.log('\n🔑 IDENTIFIANTS DE TEST:');
    console.log('─'.repeat(50));
    successful.forEach(({ account }) => {
      console.log(`📧 ${account.email}`);
      console.log(`   🔑 ${account.password}`);
      console.log(`   👤 ${account.fullName} (${account.role})`);
      console.log('');
    });

    console.log('💡 POUR TESTER:');
    console.log('  1. Ouvrez http://localhost:5173');
    console.log('  2. Allez sur /login/pro pour les professionnels');
    console.log('  3. Allez sur /superadmin pour les administrateurs');
    console.log('  4. Utilisez les identifiants ci-dessus');
  }

  if (failed.length > 0) {
    console.log('\n❌ ÉCHECS:');
    failed.forEach(({ account, result }) => {
      console.log(`   • ${account.email}: ${result.error}`);
    });
  }
}

main().catch(console.error);
