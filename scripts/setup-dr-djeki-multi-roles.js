/**
 * Script de configuration du Dr. Jules DJEKI avec multiples rôles
 * Date: 30/10/2025
 * 
 * Configure le Dr. DJEKI comme :
 * - Directeur Médical au CMST SOGARA
 * - Médecin Consultant au CMST SOGARA
 * - Possibilité de recevoir des invitations d'autres établissements
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CMST_SOGARA_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

async function setupDrDjekiMultiRoles() {
  console.log('🎯 Configuration du Dr. Jules DJEKI avec rôles multiples\n');
  console.log('================================================\n');

  try {
    // 1. Récupérer l'utilisateur
    console.log('1️⃣ Recherche du compte Dr. DJEKI...');
    
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', 'directeur.sogara@sante.ga')
      .single();

    if (userError || !userData) {
      console.error('❌ Utilisateur non trouvé');
      return;
    }

    console.log(`✅ Compte trouvé : ${userData.full_name}\n`);

    // 2. Récupérer ou créer le profil professionnel
    console.log('2️⃣ Configuration du profil professionnel...');
    
    let professionalId;
    const { data: existingPro } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', userData.id)
      .single();

    if (existingPro) {
      professionalId = existingPro.id;
      console.log('   ✅ Profil professionnel existant utilisé');
    } else {
      const { data: newPro, error: proError } = await supabase
        .from('professionals')
        .insert({
          user_id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          professional_type: 'Médecin',
          speciality: 'Médecine Générale / Administration',
          license_number: 'MED-GA-2024-001'
        })
        .select()
        .single();

      if (proError) {
        console.error('❌ Erreur création profil:', proError.message);
        return;
      }
      
      professionalId = newPro.id;
      console.log('   ✅ Nouveau profil professionnel créé');
    }

    // 3. Récupérer les départements
    console.log('\n3️⃣ Configuration des affiliations...');
    
    const { data: departments } = await supabase
      .from('establishment_departments')
      .select('id, code, name')
      .eq('establishment_id', CMST_SOGARA_ID)
      .in('code', ['DIR', 'MED']);

    const dirDept = departments?.find(d => d.code === 'DIR');
    const medDept = departments?.find(d => d.code === 'MED');

    if (!dirDept || !medDept) {
      console.error('❌ Départements non trouvés');
      return;
    }

    // 4. Supprimer les anciennes affiliations
    await supabase
      .from('establishment_staff')
      .delete()
      .eq('professional_id', professionalId)
      .eq('establishment_id', CMST_SOGARA_ID);

    // 5. Créer les deux rôles
    console.log('   📌 Création du rôle Directeur Médical...');
    
    const { error: dirError } = await supabase
      .from('establishment_staff')
      .insert({
        professional_id: professionalId,
        establishment_id: CMST_SOGARA_ID,
        department_id: dirDept.id,
        role: 'director',
        position: 'Directeur Médical',
        is_department_head: true,
        is_establishment_admin: true,
        status: 'active',
        matricule: 'DIR-001',
        permissions: {
          all: true,
          super_admin_functions: ['manage_establishment', 'view_all_reports', 'manage_all_staff']
        }
      });

    if (dirError) {
      console.error('   ❌ Erreur rôle directeur:', dirError.message);
    } else {
      console.log('   ✅ Rôle Directeur Médical créé');
    }

    console.log('   📌 Création du rôle Médecin Consultant...');
    
    const { error: medError } = await supabase
      .from('establishment_staff')
      .insert({
        professional_id: professionalId,
        establishment_id: CMST_SOGARA_ID,
        department_id: medDept.id,
        role: 'doctor',
        position: 'Médecin Consultant Senior',
        is_department_head: false,
        is_establishment_admin: false,
        status: 'active',
        matricule: 'MED-001',
        permissions: {
          consultations: ['view', 'add', 'edit'],
          prescriptions: ['view', 'add', 'edit'],
          patients: ['view', 'add', 'edit'],
          reports: ['view']
        }
      });

    if (medError) {
      console.error('   ❌ Erreur rôle médecin:', medError.message);
    } else {
      console.log('   ✅ Rôle Médecin Consultant créé');
    }

    // 6. Créer quelques établissements supplémentaires pour les tests
    console.log('\n4️⃣ Création d\'établissements de test...');
    
    const testEstablishments = [
      {
        id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
        name: 'CHU Libreville',
        type: 'hospital',
        sub_type: 'public',
        city: 'Libreville',
        address: 'Boulevard Triomphal, Libreville',
        phone: '+241 01 76 20 00'
      },
      {
        id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
        name: 'Clinique St-Michel',
        type: 'clinic',
        sub_type: 'private',
        city: 'Port-Gentil',
        address: 'Avenue Savorgnan de Brazza, Port-Gentil',
        phone: '+241 01 55 30 30'
      }
    ];

    for (const est of testEstablishments) {
      const { error } = await supabase
        .from('establishments')
        .upsert(est, { onConflict: 'id' });
      
      if (!error) {
        console.log(`   ✅ ${est.name} créé/mis à jour`);
      }
    }

    // 7. Créer une invitation de test
    console.log('\n5️⃣ Création d\'une invitation de test...');
    
    const { data: invitation, error: invError } = await supabase
      .from('establishment_invitations')
      .insert({
        establishment_id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
        invited_email: 'directeur.sogara@sante.ga',
        invited_by: userData.id,
        role: 'doctor',
        position: 'Médecin Consultant Cardiologie',
        message: 'Nous serions honorés de vous compter parmi notre équipe de cardiologie.',
        status: 'pending'
      })
      .select()
      .single();

    if (!invError && invitation) {
      console.log('   ✅ Invitation du CHU Libreville créée');
    }

    // 8. Résumé
    console.log('\n================================================');
    console.log('✨ Configuration terminée avec succès!\n');
    
    console.log('📊 RÉSUMÉ pour Dr. Jules DJEKI :');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Compte : directeur.sogara@sante.ga');
    console.log('🏥 Établissement principal : CMST SOGARA');
    console.log('');
    console.log('👔 Rôles au CMST SOGARA :');
    console.log('   1. Directeur Médical (Administration complète)');
    console.log('   2. Médecin Consultant Senior (Pratique médicale)');
    console.log('');
    console.log('📬 Invitations en attente :');
    console.log('   - CHU Libreville : Médecin Consultant Cardiologie');
    console.log('');
    console.log('💡 Actions possibles :');
    console.log('   - Basculer entre les rôles via le dashboard');
    console.log('   - Accepter/Refuser l\'invitation du CHU');
    console.log('   - Envoyer des demandes à d\'autres établissements');
    console.log('');
    console.log('🔗 URLs de test :');
    console.log('   - Dashboard multi-rôles : http://localhost:8080/establishments/sogara/admin');
    console.log('   - Gestion établissements : http://localhost:8080/professional/establishments');
    console.log('   - Sélection établissement : http://localhost:8080/professional/select-establishment');

  } catch (error) {
    console.error('\n❌ Erreur générale:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
setupDrDjekiMultiRoles();
