#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = 'https://bolidzesitkkfojdyuyg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbGlkemVzaXRra2ZvamR5dXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTMxMzUsImV4cCI6MjA3NDkyOTEzNX0.bKmwG96ju8nRHLOizeMtp-VleN658wI6CpOkCChgc2A';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testLogin() {
  console.log('\n🔍 TEST DE CONNEXION SOGARA\n');
  console.log('═'.repeat(50));

  // Test avec un compte admin SOGARA
  const testAccounts = [
    {
      email: 'admin@sogara.com',
      password: 'Admin@SOGARA2024',
      expectedRole: 'hospital'
    },
    {
      email: 'dr.okemba@sogara.com', 
      password: 'Okemba@2024Med',
      expectedRole: 'doctor'
    }
  ];

  for (const account of testAccounts) {
    console.log(`\n📧 Test avec: ${account.email}`);
    console.log('─'.repeat(40));

    try {
      // 1. Tenter la connexion
      console.log('1. Tentative de connexion...');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password
      });

      if (authError) {
        console.log('❌ Erreur de connexion:', authError.message);
        
        // Si le compte n'existe pas, proposer de le créer
        if (authError.message.includes('Invalid login credentials')) {
          console.log('\n💡 Le compte semble ne pas exister ou le mot de passe est incorrect.');
          console.log('   Vérifiez que le compte a été créé dans Supabase.');
        }
        continue;
      }

      console.log('✅ Connexion réussie!');
      console.log(`   User ID: ${authData.user?.id}`);
      
      // 2. Vérifier le profil
      console.log('\n2. Vérification du profil...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.log('❌ Erreur profil:', profileError.message);
      } else {
        console.log('✅ Profil trouvé:');
        console.log(`   Nom: ${profile.full_name || 'Non défini'}`);
        console.log(`   Email: ${profile.email}`);
      }

      // 3. Vérifier les rôles
      console.log('\n3. Vérification des rôles...');
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id);

      if (rolesError) {
        console.log('❌ Erreur rôles:', rolesError.message);
      } else if (roles && roles.length > 0) {
        console.log('✅ Rôles trouvés:');
        roles.forEach(r => console.log(`   - ${r.role}`));
        
        if (!roles.some(r => r.role === account.expectedRole)) {
          console.log(`\n⚠️  ATTENTION: Le rôle attendu '${account.expectedRole}' n'est pas assigné!`);
        }
      } else {
        console.log('❌ Aucun rôle assigné à cet utilisateur!');
      }

      // 4. Vérifier le profil professionnel (si applicable)
      if (account.expectedRole !== 'patient') {
        console.log('\n4. Vérification du profil professionnel...');
        const { data: professional, error: profError } = await supabase
          .from('professionals')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();

        if (profError) {
          console.log('❌ Profil professionnel non trouvé:', profError.message);
        } else {
          console.log('✅ Profil professionnel trouvé:');
          console.log(`   Type: ${professional.professional_type || 'Non défini'}`);
          console.log(`   N° Ordre: ${professional.numero_ordre || 'Non défini'}`);
        }
      }

      // 5. Se déconnecter
      await supabase.auth.signOut();
      console.log('\n✅ Déconnexion effectuée');

    } catch (error) {
      console.log('❌ Erreur inattendue:', error.message);
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log('\n📌 DIAGNOSTIC:\n');
  
  console.log('Si la connexion échoue avec "Invalid login credentials":');
  console.log('1. Le compte n\'existe pas encore dans Supabase');
  console.log('2. Créez-le manuellement dans Authentication > Users');
  console.log('3. Ou exécutez le script SQL fourni\n');
  
  console.log('Si la connexion réussit mais l\'accès est refusé:');
  console.log('1. Vérifiez que le rôle est bien assigné');
  console.log('2. Pour les admins SOGARA, le rôle doit être "hospital"');
  console.log('3. Pour les médecins, le rôle doit être "doctor"\n');

  console.log('Pour créer manuellement les comptes:');
  console.log('1. Allez sur https://app.supabase.com');
  console.log('2. Authentication > Users > Add User');
  console.log('3. Cochez "Auto Confirm User"');
  console.log('4. Exécutez ensuite le SQL pour configurer les rôles\n');
}

// Exécuter le test
testLogin()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
