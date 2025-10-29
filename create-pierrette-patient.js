#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = 'https://bolidzesitkkfojdyuyg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbGlkemVzaXRra2ZvamR5dXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTMxMzUsImV4cCI6MjA3NDkyOTEzNX0.bKmwG96ju8nRHLOizeMtp-VleN658wI6CpOkCChgc2A';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createPierretteAccount() {
  console.log('\n🏥 CRÉATION DU COMPTE PATIENT - PIERRETTE NOMSI');
  console.log('═'.repeat(60));

  try {
    // Créer le compte patient
    console.log('\n1️⃣ Création du compte utilisateur...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'pierrette.nomsi@gmail.com',
      password: 'Nomsi@Patient2024',
      options: {
        data: {
          full_name: 'Pierrette NOMSI',
          date_of_birth: '1985-04-15',
          phone: '+241 07 45 67 89',
          gender: 'female',
          blood_group: 'O+',
          city: 'Port-Gentil',
          country: 'Gabon'
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  Le compte existe déjà. Tentative de connexion pour vérifier...');
        
        // Test de connexion
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'pierrette.nomsi@gmail.com',
          password: 'Nomsi@Patient2024'
        });

        if (signInError) {
          console.log('❌ Le compte existe mais le mot de passe est différent.');
          console.log('   Solution: Réinitialisez le mot de passe dans Supabase Console');
          process.exit(1);
        } else {
          console.log('✅ Le compte existe et fonctionne!');
          console.log(`   User ID: ${signInData.user.id}`);
          await supabase.auth.signOut();
          
          console.log('\n✅ SUCCÈS - Le compte est déjà créé et fonctionnel');
          console.log('\n📱 TESTER MAINTENANT:');
          console.log('   URL: http://localhost:8080/login/patient');
          console.log('   Email: pierrette.nomsi@gmail.com');
          console.log('   Password: Nomsi@Patient2024');
          process.exit(0);
        }
      } else {
        throw authError;
      }
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error('Impossible de récupérer l\'ID utilisateur');
    }

    console.log(`✅ Compte créé avec succès!`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Email: ${authData.user.email}`);

    // Déconnexion après création
    await supabase.auth.signOut();

    console.log('\n✅ CRÉATION TERMINÉE AVEC SUCCÈS!');
    console.log('\n═'.repeat(60));
    console.log('\n📋 COMPTE PATIENT CRÉÉ:');
    console.log('─'.repeat(60));
    console.log('   Nom: Pierrette NOMSI');
    console.log('   Email: pierrette.nomsi@gmail.com');
    console.log('   Password: Nomsi@Patient2024');
    console.log('   Rôle: Patient');
    console.log('   Ville: Port-Gentil');
    console.log('   Groupe sanguin: O+');
    console.log('\n📱 TESTER MAINTENANT:');
    console.log('   1. Allez sur: http://localhost:8080/login/patient');
    console.log('   2. Email: pierrette.nomsi@gmail.com');
    console.log('   3. Password: Nomsi@Patient2024');
    console.log('   4. Accès au dossier médical complet');
    console.log('\n💡 NOTE:');
    console.log('   - Pierrette est employée SOGARA (Chef QUALITÉ)');
    console.log('   - Elle a un compte PATIENT pour ses soins au CMST');
    console.log('   - Elle n\'est PAS une professionnelle de santé');
    console.log('   - Son profil RH est dans: /establishments/sogara/admin/employees');

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.error('\nDétails:', error);
    process.exit(1);
  }
}

// Exécuter
createPierretteAccount()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
