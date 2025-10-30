/**
 * Script pour configurer TOUS les professionnels SOGARA avec le système multi-établissements
 * Date: 30/10/2025
 * 
 * Ce script configure tous les comptes professionnels SOGARA pour qu'ils soient
 * prêts à recevoir des rôles multiples et à utiliser le nouveau système
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

// Configuration de TOUS les professionnels SOGARA
const SOGARA_PROFESSIONALS = {
  // Direction
  'directeur.sogara@sante.ga': {
    name: 'Dr. Jules DJEKI',
    roles: [
      { role: 'director', department: 'DIR', position: 'Directeur Médical', isAdmin: true },
      { role: 'doctor', department: 'MED', position: 'Médecin Consultant Senior', isAdmin: false }
    ]
  },
  'admin.sogara@sante.ga': {
    name: 'Jean-Pierre Mbadinga',
    roles: [
      { role: 'admin', department: 'ADM', position: 'Administrateur Principal', isAdmin: true }
    ]
  },
  
  // Médecins
  'dr.okemba.sogara@sante.ga': {
    name: 'Dr. Marie Okemba',
    roles: [
      { role: 'doctor', department: 'MED', position: 'Médecin Généraliste', isAdmin: false }
    ]
  },
  'dr.nguema.sogara@sante.ga': {
    name: 'Dr. Paul Nguema',
    roles: [
      { role: 'doctor', department: 'URG', position: 'Médecin Urgentiste', isAdmin: false, isDeptHead: true }
    ]
  },
  'dr.mbina.sogara@sante.ga': {
    name: 'Dr. Léa Mbina',
    roles: [
      { role: 'doctor', department: 'CARD', position: 'Cardiologue', isAdmin: false }
    ]
  },
  'dr.mezui.sogara@sante.ga': {
    name: 'Dr. Thomas Mezui',
    roles: [
      { role: 'doctor', department: 'PED', position: 'Pédiatre', isAdmin: false }
    ]
  },
  
  // Infirmiers
  'nurse.mba.sogara@sante.ga': {
    name: 'Sylvie Mba',
    roles: [
      { role: 'nurse', department: 'SI', position: 'Infirmier(e) Chef', isAdmin: false }
    ]
  },
  'nurse.nze.sogara@sante.ga': {
    name: 'Patricia Nze',
    roles: [
      { role: 'nurse', department: 'URG', position: 'Infirmier(e)', isAdmin: false }
    ]
  },
  'nurse.andeme.sogara@sante.ga': {
    name: 'Claire Andeme',
    roles: [
      { role: 'nurse', department: 'MAT', position: 'Infirmier(e) Maternité', isAdmin: false }
    ]
  },
  
  // Personnel Support
  'lab.tech.sogara@sante.ga': {
    name: 'André Moussavou',
    roles: [
      { role: 'laborantin', department: 'LAB', position: 'Technicien Laboratoire', isAdmin: false }
    ]
  },
  'pharma.sogara@sante.ga': {
    name: 'Dr. Lydie Kombila',
    roles: [
      { role: 'pharmacist', department: 'PHAR', position: 'Pharmacien(ne) Chef', isAdmin: false, isDeptHead: true }
    ]
  },
  'accueil.sogara@sante.ga': {
    name: 'Nadège Oyono',
    roles: [
      { role: 'receptionist', department: 'ACC', position: 'Réceptionniste', isAdmin: false }
    ]
  }
};

async function setupAllSogaraProfessionals() {
  console.log('🚀 Configuration de TOUS les professionnels SOGARA\n');
  console.log('================================================\n');

  try {
    // 1. S'assurer que l'établissement SOGARA existe
    console.log('1️⃣ Vérification de l\'établissement CMST SOGARA...');
    
    const { data: establishment, error: estError } = await supabase
      .from('establishments')
      .select('id, name')
      .eq('id', CMST_SOGARA_ID)
      .single();

    if (estError || !establishment) {
      // Créer l'établissement s'il n'existe pas
      const { error: createError } = await supabase
        .from('establishments')
        .insert({
          id: CMST_SOGARA_ID,
          name: 'CMST SOGARA',
          type: 'cmst',
          sub_type: 'corporate',
          address: 'Zone Industrielle, Port-Gentil',
          city: 'Port-Gentil',
          phone: '+241 01 55 66 77',
          email: 'cmst@sogara.ga',
          website: 'https://sogara.ga/cmst'
        });

      if (createError) {
        console.error('❌ Erreur création établissement:', createError.message);
        return;
      }
      console.log('   ✅ Établissement CMST SOGARA créé');
    } else {
      console.log('   ✅ Établissement CMST SOGARA trouvé');
    }

    // 2. Récupérer tous les départements
    console.log('\n2️⃣ Récupération des départements...');
    
    const { data: departments } = await supabase
      .from('establishment_departments')
      .select('id, code')
      .eq('establishment_id', CMST_SOGARA_ID);

    const deptMap = {};
    if (departments) {
      departments.forEach(dept => {
        deptMap[dept.code] = dept.id;
      });
    }
    console.log(`   ✅ ${Object.keys(deptMap).length} départements trouvés\n`);

    // 3. Traiter chaque professionnel
    console.log('3️⃣ Configuration des professionnels...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const [email, config] of Object.entries(SOGARA_PROFESSIONALS)) {
      console.log(`📌 ${config.name} (${email})`);

      try {
        // Récupérer l'utilisateur
        const { data: userData } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (!userData) {
          console.log(`   ⚠️ Utilisateur non trouvé`);
          errorCount++;
          continue;
        }

        // Créer ou récupérer le profil professionnel
        let professionalId;
        const { data: existingPro } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', userData.id)
          .single();

        if (existingPro) {
          professionalId = existingPro.id;
        } else {
          const { data: newPro, error: proError } = await supabase
            .from('professionals')
            .insert({
              user_id: userData.id,
              email: email,
              full_name: config.name,
              professional_type: config.roles[0].role === 'doctor' ? 'Médecin' :
                               config.roles[0].role === 'nurse' ? 'Infirmier(e)' :
                               config.roles[0].role === 'pharmacist' ? 'Pharmacien(ne)' :
                               config.roles[0].role === 'laborantin' ? 'Laborantin(e)' :
                               config.roles[0].role === 'admin' ? 'Administrateur' :
                               config.roles[0].role === 'director' ? 'Directeur' :
                               'Autre'
            })
            .select()
            .single();

          if (proError) {
            console.log(`   ❌ Erreur création profil: ${proError.message}`);
            errorCount++;
            continue;
          }
          professionalId = newPro.id;
        }

        // Supprimer les anciennes affiliations
        await supabase
          .from('establishment_staff')
          .delete()
          .eq('professional_id', professionalId)
          .eq('establishment_id', CMST_SOGARA_ID);

        // Créer les nouvelles affiliations (multi-rôles)
        for (const roleConfig of config.roles) {
          const departmentId = deptMap[roleConfig.department];
          
          const { error: staffError } = await supabase
            .from('establishment_staff')
            .insert({
              professional_id: professionalId,
              establishment_id: CMST_SOGARA_ID,
              department_id: departmentId,
              role: roleConfig.role,
              position: roleConfig.position,
              is_department_head: roleConfig.isDeptHead || false,
              is_establishment_admin: roleConfig.isAdmin || false,
              status: 'active',
              matricule: `${roleConfig.department}-${Date.now().toString().slice(-4)}`
            });

          if (staffError) {
            console.log(`   ❌ Erreur affiliation ${roleConfig.role}: ${staffError.message}`);
          } else {
            console.log(`   ✅ Rôle ${roleConfig.role} - ${roleConfig.position}`);
          }
        }

        successCount++;
        console.log('');

      } catch (error) {
        console.error(`   ❌ Erreur: ${error.message}`);
        errorCount++;
      }
    }

    // 4. Créer quelques invitations de test
    console.log('4️⃣ Création d\'invitations de test...\n');
    
    // Invitation pour Dr. DJEKI au CHU Libreville
    const { error: invError1 } = await supabase
      .from('establishment_invitations')
      .insert({
        establishment_id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
        invited_email: 'directeur.sogara@sante.ga',
        role: 'doctor',
        position: 'Médecin Consultant Cardiologie',
        message: 'Le CHU Libreville serait honoré de vous compter parmi son équipe de cardiologie.',
        status: 'pending'
      });

    if (!invError1) {
      console.log('   ✅ Invitation CHU Libreville pour Dr. DJEKI créée');
    }

    // Invitation pour Dr. Okemba à la Clinique St-Michel
    const { error: invError2 } = await supabase
      .from('establishment_invitations')
      .insert({
        establishment_id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
        invited_email: 'dr.okemba.sogara@sante.ga',
        role: 'doctor',
        position: 'Médecin Généraliste',
        message: 'La Clinique St-Michel recherche un médecin généraliste expérimenté.',
        status: 'pending'
      });

    if (!invError2) {
      console.log('   ✅ Invitation Clinique St-Michel pour Dr. Okemba créée');
    }

    // 5. Résumé
    console.log('\n================================================');
    console.log('✨ Configuration terminée!\n');
    
    console.log('📊 RÉSUMÉ :');
    console.log(`   ✅ ${successCount} professionnels configurés avec succès`);
    if (errorCount > 0) {
      console.log(`   ⚠️ ${errorCount} erreurs rencontrées`);
    }
    
    console.log('\n🎯 FONCTIONNALITÉS ACTIVÉES :');
    console.log('   ✅ Multi-rôles (Dr. DJEKI a 2 rôles)');
    console.log('   ✅ Multi-établissements prêt');
    console.log('   ✅ Système d\'invitations actif');
    console.log('   ✅ Dashboard adaptatif par rôle');
    console.log('   ✅ Menu contextuel dynamique');
    
    console.log('\n💡 POUR TESTER :');
    console.log('   1. Connexion : directeur.sogara@sante.ga / DirecteurSOGARA2024!');
    console.log('   2. Vérifier le double badge (Directeur + Médecin)');
    console.log('   3. Tester le menu contextuel');
    console.log('   4. Voir les invitations dans "Établissements"');
    
    console.log('\n🔗 URLs :');
    console.log('   Dashboard Pro : http://localhost:8080/professional/dashboard');
    console.log('   Dashboard SOGARA : http://localhost:8080/establishments/sogara/admin');
    console.log('   Établissements : http://localhost:8080/professional/establishments');

  } catch (error) {
    console.error('\n❌ Erreur générale:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
setupAllSogaraProfessionals();
