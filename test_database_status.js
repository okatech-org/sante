// Script de test pour vérifier l'état de la base de données
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseStatus() {
  console.log('🔍 Test de l\'état de la base de données...\n');

  try {
    // Test 1: Vérifier si la table professional_profiles existe
    console.log('1. Vérification de la table professional_profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('professional_profiles')
      .select('count')
      .limit(1);

    if (profilesError) {
      console.log('❌ Table professional_profiles n\'existe pas ou erreur:', profilesError.message);
    } else {
      console.log('✅ Table professional_profiles existe');
    }

    // Test 2: Vérifier si la table professionals existe
    console.log('\n2. Vérification de la table professionals...');
    const { data: professionals, error: professionalsError } = await supabase
      .from('professionals')
      .select('count')
      .limit(1);

    if (professionalsError) {
      console.log('❌ Table professionals n\'existe pas ou erreur:', professionalsError.message);
    } else {
      console.log('✅ Table professionals existe');
    }

    // Test 3: Vérifier les profils utilisateurs
    console.log('\n3. Vérification des profils utilisateurs...');
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, full_name, created_at')
      .limit(5);

    if (usersError) {
      console.log('❌ Erreur lors de la récupération des profils:', usersError.message);
    } else {
      console.log(`✅ ${users.length} profils utilisateurs trouvés`);
      users.forEach(user => {
        console.log(`   - ${user.full_name} (${user.id})`);
      });
    }

    // Test 4: Vérifier les rôles utilisateurs
    console.log('\n4. Vérification des rôles utilisateurs...');
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .limit(5);

    if (rolesError) {
      console.log('❌ Erreur lors de la récupération des rôles:', rolesError.message);
    } else {
      console.log(`✅ ${roles.length} rôles utilisateurs trouvés`);
      roles.forEach(role => {
        console.log(`   - ${role.user_id}: ${role.role}`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testDatabaseStatus();
