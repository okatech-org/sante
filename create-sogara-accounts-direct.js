#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = 'https://bolidzesitkkfojdyuyg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sbp_95bc4523d2fb581aa170face59cf1fb261bca08f';

// URL configurée correctement

// Client admin avec service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Comptes SOGARA à créer
const sogaraAccounts = [
  {
    email: "admin@sogara.com",
    password: "Admin@SOGARA2024",
    full_name: "Jean-Pierre Mbadinga",
    role: "hospital",
    department: "Administration",
    matricule: "ADM-001",
    is_admin: true
  },
  {
    email: "directeur@sogara.com",
    password: "DirecteurSOGARA2024!",
    full_name: "Dr. François Obiang",
    role: "hospital",
    department: "Direction Médicale",
    matricule: "DIR-001",
    is_admin: true
  },
  {
    email: "dr.okemba@sogara.com",
    password: "Okemba@2024Med",
    full_name: "Dr. Marie Okemba",
    role: "doctor",
    department: "Médecine Générale",
    matricule: "MED-012"
  },
  {
    email: "dr.nguema@sogara.com",
    password: "Nguema@Urgence24",
    full_name: "Dr. Paul Nguema",
    role: "doctor",
    department: "Urgences",
    matricule: "MED-015"
  },
  {
    email: "dr.mbina@sogara.com",
    password: "Mbina@Cardio2024",
    full_name: "Dr. Léa Mbina",
    role: "doctor",
    department: "Cardiologie",
    matricule: "MED-018"
  },
  {
    email: "dr.mezui@sogara.com",
    password: "Mezui@Pediatrie24",
    full_name: "Dr. Thomas Mezui",
    role: "doctor",
    department: "Pédiatrie",
    matricule: "MED-022"
  },
  {
    email: "nurse.mba@sogara.com",
    password: "MbaSI@2024",
    full_name: "Sylvie Mba",
    role: "medical_staff",
    department: "Soins Intensifs",
    matricule: "INF-025",
    professional_type: "nurse"
  },
  {
    email: "nurse.nze@sogara.com",
    password: "NzeUrg@2024",
    full_name: "Patricia Nze",
    role: "medical_staff",
    department: "Urgences",
    matricule: "INF-028",
    professional_type: "nurse"
  },
  {
    email: "nurse.andeme@sogara.com",
    password: "Andeme@Mat2024",
    full_name: "Claire Andeme",
    role: "medical_staff",
    department: "Maternité",
    matricule: "INF-030",
    professional_type: "nurse"
  },
  {
    email: "lab.tech@sogara.com",
    password: "LabSOGARA@2024",
    full_name: "André Moussavou",
    role: "laboratory",
    department: "Laboratoire",
    matricule: "LAB-008"
  },
  {
    email: "pharma@sogara.com",
    password: "PharmaSOGARA@24",
    full_name: "Dr. Lydie Kombila",
    role: "pharmacy",
    department: "Pharmacie",
    matricule: "PHAR-004"
  },
  {
    email: "accueil@sogara.com",
    password: "AccueilSOGARA@24",
    full_name: "Nadège Oyono",
    role: "medical_staff",
    department: "Accueil",
    matricule: "REC-002",
    professional_type: "receptionist"
  }
];

async function createOrUpdateEstablishment() {
  try {
    // Vérifier si l'établissement existe
    const { data: establishments, error } = await supabase
      .from('establishments')
      .select('id')
      .ilike('raison_sociale', '%SOGARA%')
      .limit(1);

    if (!establishments || establishments.length === 0) {
      console.log('📍 Création de l\'établissement SOGARA...');
      
      const { data: newEst, error: createError } = await supabase
        .from('establishments')
        .insert({
          raison_sociale: 'Centre Médical de Santé au Travail SOGARA',
          type_etablissement: 'centre_medical',
          secteur: 'prive',
          ville: 'Port-Gentil',
          province: 'Ogooué-Maritime',
          adresse: 'Route de la Sogara',
          telephone: '011 55 26 21',
          email: 'service.rgc@sogara.com',
          latitude: -0.681398,
          longitude: 8.772557,
          nombre_lits_total: 200,
          nombre_blocs_operatoires: 4,
          nombre_salles_consultation: 15,
          service_urgences_actif: true,
          cnamgs_conventionne: true,
          cnss_conventionne: true,
          statut: 'actif'
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Erreur création établissement:', createError);
        return null;
      }
      
      console.log('✅ Établissement SOGARA créé avec succès');
      return newEst.id;
    }
    
    return establishments[0].id;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return null;
  }
}

async function createAccount(account, establishmentId) {
  try {
    console.log(`\n📝 Traitement: ${account.full_name} (${account.email})`);

    // 1. Créer ou mettre à jour l'utilisateur
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: {
        full_name: account.full_name,
        department: account.department,
        matricule: account.matricule,
        establishment: 'CMST SOGARA'
      }
    });

    let userId;
    
    if (authError && authError.message.includes('already exists')) {
      console.log('   ├─ Utilisateur existant, mise à jour...');
      
      // Récupérer l'utilisateur existant
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existingUser = users?.find(u => u.email === account.email);
      
      if (existingUser) {
        userId = existingUser.id;
        
        // Mettre à jour le mot de passe
        await supabase.auth.admin.updateUserById(userId, {
          password: account.password,
          email_confirm: true,
          user_metadata: {
            full_name: account.full_name,
            department: account.department,
            matricule: account.matricule,
            establishment: 'CMST SOGARA'
          }
        });
        console.log('   ├─ ✅ Mot de passe mis à jour');
      }
    } else if (authError) {
      throw authError;
    } else {
      userId = authData.user.id;
      console.log('   ├─ ✅ Compte créé avec succès');
    }

    // 2. Créer/Mettre à jour le profil
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: account.full_name,
        email: account.email,
        phone: account.matricule
      });

    if (profileError) {
      console.log('   ├─ ⚠️  Profil:', profileError.message);
    } else {
      console.log('   ├─ ✅ Profil créé/mis à jour');
    }

    // 3. Assigner le rôle
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: account.role
      }, {
        onConflict: 'user_id,role'
      });

    if (roleError && !roleError.message.includes('duplicate')) {
      console.log('   ├─ ⚠️  Rôle:', roleError.message);
    } else {
      console.log('   ├─ ✅ Rôle assigné:', account.role);
    }

    // 4. Créer le profil professionnel si nécessaire
    if (account.role !== 'patient') {
      const professionalType = account.professional_type || 
        (account.role === 'doctor' ? 'doctor' : 
         account.role === 'pharmacy' ? 'pharmacist' :
         account.role === 'laboratory' ? 'lab_tech' : 'other');

      const { error: profError } = await supabase
        .from('professionals')
        .upsert({
          user_id: userId,
          professional_type: professionalType,
          numero_ordre: account.matricule,
          specialite: account.department,
          etablissement: 'CMST SOGARA',
          is_verified: true
        }, {
          onConflict: 'user_id'
        });

      if (profError && !profError.message.includes('duplicate')) {
        console.log('   ├─ ⚠️  Profil professionnel:', profError.message);
      } else {
        console.log('   ├─ ✅ Profil professionnel créé');
      }
    }

    // 5. Lier à l'établissement pour les administrateurs
    if (account.is_admin && establishmentId) {
      const { error: linkError } = await supabase
        .from('establishment_users')
        .upsert({
          establishment_id: establishmentId,
          user_id: userId,
          role: 'administrateur',
          permissions: {
            manage_staff: true,
            manage_patients: true,
            manage_appointments: true,
            manage_billing: true,
            view_reports: true,
            manage_inventory: true,
            manage_settings: true
          },
          actif: true
        }, {
          onConflict: 'establishment_id,user_id'
        });

      if (linkError && !linkError.message.includes('duplicate')) {
        console.log('   ├─ ⚠️  Liaison établissement:', linkError.message);
      } else {
        console.log('   ├─ ✅ Administrateur lié à l\'établissement');
      }
    }

    console.log('   └─ ✅ Compte configuré avec succès!');
    return true;

  } catch (error) {
    console.error(`   └─ ❌ Erreur:`, error.message);
    return false;
  }
}

async function main() {
  console.log('\n🏥 CRÉATION DES COMPTES CMST SOGARA');
  console.log('═'.repeat(60));
  
  try {
    // Créer/Récupérer l'établissement
    const establishmentId = await createOrUpdateEstablishment();
    
    if (!establishmentId) {
      console.error('❌ Impossible de créer/trouver l\'établissement SOGARA');
      process.exit(1);
    }
    
    console.log(`\n✅ Établissement SOGARA ID: ${establishmentId}`);
    console.log('\n📋 Création des comptes utilisateurs...\n');
    
    let successCount = 0;
    
    // Créer tous les comptes
    for (const account of sogaraAccounts) {
      const success = await createAccount(account, establishmentId);
      if (success) successCount++;
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log(`\n🎉 TERMINÉ! ${successCount}/${sogaraAccounts.length} comptes créés/mis à jour`);
    
    if (successCount > 0) {
      console.log('\n📱 IDENTIFIANTS DE CONNEXION:');
      console.log('─'.repeat(60));
      
      console.log('\n👮 ADMINISTRATEURS:');
      sogaraAccounts.filter(a => a.is_admin).forEach(account => {
        console.log(`  📧 ${account.email}`);
        console.log(`     🔑 ${account.password}`);
        console.log(`     👤 ${account.full_name} - ${account.department}\n`);
      });
      
      console.log('\n👨‍⚕️ MÉDECINS:');
      sogaraAccounts.filter(a => a.role === 'doctor').forEach(account => {
        console.log(`  📧 ${account.email}`);
        console.log(`     🔑 ${account.password}`);
        console.log(`     👤 ${account.full_name} - ${account.department}\n`);
      });
      
      console.log('\n👩‍⚕️ PERSONNEL MÉDICAL:');
      sogaraAccounts.filter(a => a.role === 'medical_staff').forEach(account => {
        console.log(`  📧 ${account.email}`);
        console.log(`     🔑 ${account.password}`);
        console.log(`     👤 ${account.full_name} - ${account.department}\n`);
      });
      
      console.log('\n🔬 AUTRES:');
      sogaraAccounts.filter(a => ['laboratory', 'pharmacy'].includes(a.role)).forEach(account => {
        console.log(`  📧 ${account.email}`);
        console.log(`     🔑 ${account.password}`);
        console.log(`     👤 ${account.full_name} - ${account.department}\n`);
      });
      
      console.log('\n💡 UTILISATION:');
      console.log('─'.repeat(60));
      console.log('1. Aller sur: http://localhost:8080/login/professional');
      console.log('2. Utiliser les identifiants ci-dessus');
      console.log('3. Les administrateurs peuvent gérer l\'établissement');
      console.log('4. Tous ont accès au dashboard professionnel');
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Exécuter le script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
