#!/usr/bin/env node

/**
 * Script de test pour le compte du Ministre
 * Pr. Adrien MOUGOUGOU
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requises');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testMinisterLogin() {
  console.log('🏛️  Test de connexion - Compte Ministre de la Santé\n');
  console.log('=' .repeat(60));
  
  try {
    // Test de connexion
    console.log('📧 Email: ministre@sante.gouv.ga');
    console.log('🔐 Tentative de connexion...\n');
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'ministre@sante.gouv.ga',
      password: 'MinistryGab2025!'
    });

    if (authError) {
      console.error('❌ Erreur de connexion:', authError.message);
      
      // Si l'utilisateur n'existe pas, suggérer de le créer
      if (authError.message.includes('Invalid login credentials')) {
        console.log('\n⚠️  Le compte n\'existe peut-être pas encore.');
        console.log('💡 Exécutez d\'abord: node create-minister-account.js\n');
      }
      return;
    }

    console.log('✅ Connexion réussie!');
    console.log('👤 Utilisateur ID:', authData.user.id);
    console.log('📧 Email vérifié:', authData.user.email_confirmed_at ? 'Oui' : 'Non');
    
    // Récupérer le profil
    console.log('\n📋 Récupération du profil...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) {
      console.log('⚠️  Profil non trouvé dans la table profiles');
    } else {
      console.log('✅ Profil trouvé:');
      console.log('   Nom complet:', `${profile.first_name} ${profile.last_name}`);
      console.log('   Type:', profile.profile_type);
      console.log('   Actif:', profile.is_active ? 'Oui' : 'Non');
    }

    // Récupérer l'établissement
    console.log('\n🏥 Récupération de l\'établissement...');
    const { data: establishment, error: estError } = await supabase
      .from('establishments')
      .select('*')
      .eq('name', 'Ministère de la Santé')
      .eq('type', 'ministry')
      .single();

    if (estError) {
      console.log('⚠️  Établissement "Ministère de la Santé" non trouvé');
    } else {
      console.log('✅ Établissement trouvé:');
      console.log('   Nom:', establishment.name);
      console.log('   Type:', establishment.type);
      console.log('   Ville:', establishment.city);
      console.log('   Actif:', establishment.is_active ? 'Oui' : 'Non');
    }

    // Récupérer les informations professionnelles
    console.log('\n👨‍⚕️ Récupération des informations professionnelles...');
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profError) {
      console.log('⚠️  Informations professionnelles non trouvées');
    } else {
      console.log('✅ Professionnel trouvé:');
      console.log('   Nom complet:', professional.full_name);
      console.log('   Spécialité:', professional.speciality);
      console.log('   Type:', professional.professional_type);
    }

    // Vérifier les rôles multi-établissements
    console.log('\n🔐 Vérification des rôles...');
    const { data: roles, error: rolesError } = await supabase
      .from('user_establishment_roles')
      .select('*')
      .eq('user_id', authData.user.id);

    if (rolesError || !roles || roles.length === 0) {
      console.log('⚠️  Aucun rôle trouvé');
    } else {
      console.log('✅ Rôles trouvés:', roles.length);
      roles.forEach(role => {
        console.log(`   - ${role.role} à ${role.department || 'N/A'}`);
      });
    }

    // Tester quelques indicateurs de santé
    console.log('\n📊 Récupération des indicateurs de santé...');
    const { data: indicators, error: indError } = await supabase
      .from('national_health_indicators')
      .select('*')
      .limit(5);

    if (indError || !indicators || indicators.length === 0) {
      console.log('⚠️  Aucun indicateur de santé trouvé');
    } else {
      console.log('✅ Indicateurs trouvés:', indicators.length);
      indicators.forEach(ind => {
        console.log(`   - ${ind.indicator_name}: ${ind.current_value}${ind.unit || ''}`);
      });
    }

    // Afficher les métadonnées utilisateur
    console.log('\n🔍 Métadonnées utilisateur:');
    if (authData.user.user_metadata) {
      console.log('   Titre:', authData.user.user_metadata.title || 'N/A');
      console.log('   Ministre:', authData.user.user_metadata.is_minister ? 'Oui' : 'Non');
      if (authData.user.user_metadata.permissions) {
        console.log('   Permissions:', authData.user.user_metadata.permissions.length);
      }
    }

    console.log('\n' + '=' .repeat(60));
    console.log('✨ Test terminé avec succès!');
    console.log('\n📌 Prochaines étapes:');
    console.log('   1. Accédez à http://localhost:5173/ministry/login');
    console.log('   2. Connectez-vous avec les identifiants testés');
    console.log('   3. Explorez le tableau de bord ministériel');

    // Déconnexion
    await supabase.auth.signOut();

  } catch (error) {
    console.error('\n❌ Erreur inattendue:', error.message);
  }
}

// Exécuter le test
testMinisterLogin().then(() => {
  console.log('\n✅ Script de test terminé');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
