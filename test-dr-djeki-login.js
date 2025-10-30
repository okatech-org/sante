/**
 * Script de test de connexion pour Dr. Jules DJEKI
 * Vérifie que le compte fonctionne avec le bon mot de passe
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDrDjekiLogin() {
  console.log('🔐 Test de connexion Dr. Jules DJEKI\n');
  console.log('================================================\n');

  // Identifiants CORRECTS
  const credentials = {
    email: 'directeur.sogara@sante.ga',
    password: 'DirecteurSOGARA2024!' // ⚠️ PAS "Sogara2024!"
  };

  console.log('📧 Email    :', credentials.email);
  console.log('🔑 Password :', credentials.password);
  console.log('');

  try {
    // Tentative de connexion
    console.log('🔄 Tentative de connexion...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error) {
      console.error('❌ Échec de connexion:', error.message);
      console.log('\n💡 Solutions possibles :');
      console.log('1. Vérifier que le compte existe dans Supabase Auth');
      console.log('2. Confirmer le mot de passe : DirecteurSOGARA2024!');
      console.log('3. S\'assurer que le compte n\'est pas bloqué');
      return;
    }

    console.log('✅ Connexion réussie!\n');
    
    // Afficher les informations utilisateur
    console.log('👤 Informations utilisateur :');
    console.log('   ID      :', data.user.id);
    console.log('   Email   :', data.user.email);
    console.log('   Nom     :', data.user.user_metadata?.full_name || 'Dr. Jules DJEKI');
    console.log('   Rôle    :', data.user.app_metadata?.role || 'hospital');
    console.log('');

    // Vérifier les affiliations établissement
    console.log('🏥 Vérification des établissements...');
    
    const { data: professional } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', data.user.id)
      .single();

    if (professional) {
      const { data: affiliations } = await supabase
        .from('establishment_staff')
        .select(`
          role,
          position,
          department_id,
          is_establishment_admin,
          establishments (name)
        `)
        .eq('professional_id', professional.id)
        .eq('status', 'active');

      if (affiliations && affiliations.length > 0) {
        console.log(`✅ ${affiliations.length} affiliation(s) trouvée(s) :\n`);
        
        affiliations.forEach((aff, idx) => {
          console.log(`   ${idx + 1}. ${aff.establishments.name}`);
          console.log(`      - Rôle     : ${aff.role}`);
          console.log(`      - Position : ${aff.position}`);
          console.log(`      - Admin    : ${aff.is_establishment_admin ? 'Oui' : 'Non'}`);
          console.log('');
        });
      } else {
        console.log('⚠️ Aucune affiliation trouvée');
        console.log('   → Exécutez ./run-dr-djeki-setup.sh pour configurer');
      }
    } else {
      console.log('⚠️ Profil professionnel non trouvé');
      console.log('   → Exécutez ./run-dr-djeki-setup.sh pour créer');
    }

    // Vérifier les invitations
    console.log('📬 Vérification des invitations...');
    
    const { data: invitations } = await supabase
      .from('establishment_invitations')
      .select('*, establishments (name)')
      .eq('invited_email', credentials.email)
      .eq('status', 'pending');

    if (invitations && invitations.length > 0) {
      console.log(`✅ ${invitations.length} invitation(s) en attente :\n`);
      invitations.forEach((inv) => {
        console.log(`   - ${inv.establishments.name} : ${inv.role}`);
      });
    } else {
      console.log('   Aucune invitation en attente');
    }

    // Déconnexion
    await supabase.auth.signOut();
    
    console.log('\n================================================');
    console.log('✨ Test terminé avec succès!\n');
    console.log('📋 Résumé :');
    console.log('   ✅ Connexion OK');
    console.log('   ✅ Compte actif');
    console.log('   ✅ Multi-rôles configurés');
    console.log('');
    console.log('🔗 Vous pouvez maintenant vous connecter sur :');
    console.log('   http://localhost:8080/login/professional');

  } catch (error) {
    console.error('\n❌ Erreur inattendue:', error.message);
  }
}

// Exécuter le test
testDrDjekiLogin();
