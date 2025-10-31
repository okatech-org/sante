#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: './.env.local' });

// Configuration Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variables d\'environnement manquantes dans .env.local');
  console.error('   Assurez-vous que VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY et SUPABASE_SERVICE_ROLE_KEY sont définis');
  process.exit(1);
}

// Client avec anon key pour signUp
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client admin avec service role key
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Compte de Nadège Oyono - Réceptionniste SOGARA
const nadegeAccount = {
  email: "accueil.sogara@sante.ga",
  password: "Reception@SOGARA2025",
  full_name: "Nadège Oyono",
  role: "receptionist",
  department: "Accueil",
  matricule: "REC-002",
  professional_type: "receptionist",
  etablissement: "Centre Médical de Santé au Travail SOGARA",
  phone: "+241 01 55 26 21",
  poste: "Réceptionniste",
  permissions: [
    'manage_appointments',
    'patient_registration',
    'view_analytics',
    'reception',
    'appointments'
  ]
};

async function getOrCreateEstablishment() {
  try {
    // Vérifier si l'établissement SOGARA existe
    const { data: establishments, error } = await supabaseAdmin
      .from('establishments')
      .select('id, raison_sociale')
      .or('raison_sociale.ilike.%SOGARA%,raison_sociale.ilike.%Centre Médical de Santé au Travail%')
      .limit(1);

    if (!establishments || establishments.length === 0) {
      console.log('📍 Création de l\'établissement SOGARA...');
      
      const { data: newEst, error: createError } = await supabaseAdmin
        .from('establishments')
        .insert({
          raison_sociale: 'Centre Médical de Santé au Travail SOGARA',
          type_etablissement: 'centre_medical',
          secteur: 'prive',
          ville: 'Port-Gentil',
          province: 'Ogooué-Maritime',
          adresse: 'Route de la Sogara',
          telephone: '011 55 26 21',
          email: 'cmst@sogara.com',
          latitude: -0.681398,
          longitude: 8.772557,
          nombre_lits_total: 200,
          nombre_blocs_operatoires: 4,
          nombre_salles_consultation: 15,
          service_urgences_actif: true,
          cnamgs_conventionne: true,
          cnss_conventionne: true,
          statut: 'actif',
          description: 'Centre Médical de Santé au Travail au service des employés de SOGARA et leurs ayants droit'
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
    
    console.log(`✅ Établissement trouvé: ${establishments[0].raison_sociale}`);
    return establishments[0].id;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return null;
  }
}

async function createNadegeAccount(establishmentId) {
  try {
    console.log('\n🏥 CRÉATION DU COMPTE DE NADÈGE OYONO - RÉCEPTIONNISTE CMST SOGARA');
    console.log('═'.repeat(70));
    console.log(`\n📝 Création du compte: ${nadegeAccount.full_name}`);
    console.log(`   📧 Email: ${nadegeAccount.email}`);
    console.log(`   👤 Poste: ${nadegeAccount.poste}`);
    console.log(`   🏢 Service: ${nadegeAccount.department}`);

    // 1. Créer ou mettre à jour l'utilisateur dans Auth
    const { data: { user }, error: authError } = await supabaseAnon.auth.signUp({
      email: nadegeAccount.email,
      password: nadegeAccount.password,
      email_confirm: true,
      user_metadata: {
        full_name: nadegeAccount.full_name,
        department: nadegeAccount.department,
        matricule: nadegeAccount.matricule,
        establishment: nadegeAccount.etablissement,
        poste: nadegeAccount.poste
      }
    });

    let userId;
    
    if (authError && authError.message.includes('already exists')) {
      console.log('   ├─ Utilisateur existant, mise à jour...');
      
      // Récupérer l'utilisateur existant
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = users?.find(u => u.email === nadegeAccount.email);
      
      if (existingUser) {
        userId = existingUser.id;
        
        // Mettre à jour le mot de passe et les métadonnées
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: nadegeAccount.password,
          email_confirm: true,
          user_metadata: {
            full_name: nadegeAccount.full_name,
            department: nadegeAccount.department,
            matricule: nadegeAccount.matricule,
            establishment: nadegeAccount.etablissement,
            poste: nadegeAccount.poste
          }
        });
        console.log('   ├─ ✅ Compte mis à jour avec succès');
      }
    } else if (authError) {
      throw authError;
    } else {
      userId = user.id;
      console.log('   ├─ ✅ Compte créé avec succès');
    }

    // 2. Créer/Mettre à jour le profil utilisateur
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        full_name: nadegeAccount.full_name,
        email: nadegeAccount.email,
        phone: nadegeAccount.phone,
        role: nadegeAccount.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.log('   ├─ ⚠️  Erreur profil:', profileError.message);
    } else {
      console.log('   ├─ ✅ Profil créé/mis à jour');
    }

    // 3. Assigner le rôle réceptionniste
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: nadegeAccount.role
      }, {
        onConflict: 'user_id,role'
      });

    if (roleError && !roleError.message.includes('duplicate')) {
      console.log('   ├─ ⚠️  Erreur rôle:', roleError.message);
    } else {
      console.log('   ├─ ✅ Rôle assigné: Réceptionniste');
    }

    // 4. Créer le profil professionnel
    const { error: profError } = await supabaseAdmin
      .from('professionals')
      .upsert({
        user_id: userId,
        professional_type: nadegeAccount.professional_type,
        numero_ordre: nadegeAccount.matricule,
        specialite: 'Accueil et Gestion Administrative',
        etablissement: nadegeAccount.etablissement,
        ville: 'Port-Gentil',
        adresse: 'Route de la Sogara',
        telephone: nadegeAccount.phone,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (profError && !profError.message.includes('duplicate')) {
      console.log('   ├─ ⚠️  Erreur profil professionnel:', profError.message);
    } else {
      console.log('   ├─ ✅ Profil professionnel créé');
    }

    // 5. Lier à l'établissement SOGARA
    if (establishmentId) {
      // Créer le lien dans establishment_users
      const { error: linkError } = await supabaseAdmin
        .from('establishment_users')
        .upsert({
          establishment_id: establishmentId,
          user_id: userId,
          role: 'receptionniste',
          permissions: {
            manage_appointments: true,
            patient_registration: true,
            view_analytics: true,
            manage_reception: true,
            view_patients: true,
            manage_waiting_list: true,
            generate_reports: false,
            manage_staff: false,
            manage_billing: false
          },
          actif: true,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'establishment_id,user_id'
        });

      if (linkError && !linkError.message.includes('duplicate')) {
        console.log('   ├─ ⚠️  Erreur liaison établissement:', linkError.message);
      } else {
        console.log('   ├─ ✅ Liée à l\'établissement SOGARA');
      }

      // Créer l'entrée dans establishment_staff
      const { error: staffError } = await supabaseAdmin
        .from('establishment_staff')
        .upsert({
          establishment_id: establishmentId,
          professional_id: userId,
          role_title: 'Réceptionniste',
          role_category: 'administrative',
          department: 'Accueil',
          service: 'Réception',
          is_department_head: false,
          is_service_head: false,
          is_establishment_admin: false,
          can_manage_staff: false,
          can_manage_schedules: false,
          can_view_finances: false,
          can_approve_orders: false,
          permissions: nadegeAccount.permissions,
          schedule_type: 'fixed',
          weekly_hours: 40,
          schedule_details: {
            monday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
            tuesday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
            wednesday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
            thursday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
            friday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
            saturday: { start: '08:00', end: '12:00' },
            sunday: null
          },
          accepts_appointments: false,
          appointment_types: [],
          contract_type: 'cdi',
          contract_start_date: '2024-01-01',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'establishment_id,professional_id'
        });

      if (staffError && !staffError.message.includes('duplicate')) {
        console.log('   ├─ ⚠️  Erreur staff établissement:', staffError.message);
      } else {
        console.log('   ├─ ✅ Ajoutée au staff de l\'établissement');
      }
    }

    console.log('   └─ ✅ Compte configuré avec succès!\n');
    return true;

  } catch (error) {
    console.error(`   └─ ❌ Erreur:`, error.message);
    return false;
  }
}

async function main() {
  try {
    // Récupérer ou créer l'établissement SOGARA
    const establishmentId = await getOrCreateEstablishment();
    
    if (!establishmentId) {
      console.error('❌ Impossible de créer/trouver l\'établissement SOGARA');
      process.exit(1);
    }
    
    console.log(`\n📍 Établissement SOGARA ID: ${establishmentId}`);
    
    // Créer le compte de Nadège
    const success = await createNadegeAccount(establishmentId);
    
    if (success) {
      console.log('═'.repeat(70));
      console.log('\n🎉 COMPTE CRÉÉ AVEC SUCCÈS!\n');
      console.log('📋 INFORMATIONS DE CONNEXION:');
      console.log('─'.repeat(70));
      console.log(`\n👤 Nom complet      : ${nadegeAccount.full_name}`);
      console.log(`📧 Email            : ${nadegeAccount.email}`);
      console.log(`🔑 Mot de passe     : ${nadegeAccount.password}`);
      console.log(`💼 Poste            : ${nadegeAccount.poste}`);
      console.log(`🏢 Service          : ${nadegeAccount.department}`);
      console.log(`🏥 Établissement    : ${nadegeAccount.etablissement}`);
      console.log(`📱 Téléphone        : ${nadegeAccount.phone}`);
      console.log(`🆔 Matricule        : ${nadegeAccount.matricule}`);
      console.log(`🔒 Rôle système     : ${nadegeAccount.role}`);
      
      console.log('\n📍 ACCÈS ET PERMISSIONS:');
      console.log('─'.repeat(70));
      console.log('✅ Gestion des rendez-vous');
      console.log('✅ Enregistrement des patients');
      console.log('✅ Consultation des statistiques');
      console.log('✅ Gestion de la réception');
      console.log('✅ Gestion de la liste d\'attente');
      console.log('✅ Visualisation des patients');
      console.log('❌ Gestion du personnel');
      console.log('❌ Gestion de la facturation');
      console.log('❌ Génération de rapports financiers');
      
      console.log('\n💡 UTILISATION:');
      console.log('─'.repeat(70));
      console.log('1. Aller sur: https://sante.ga/login/professional');
      console.log('2. Se connecter avec l\'email et le mot de passe ci-dessus');
      console.log('3. Accès au tableau de bord de réception');
      console.log('4. Gestion des rendez-vous et de l\'accueil des patients');
      
      console.log('\n🔐 FONCTIONNALITÉS PRINCIPALES:');
      console.log('─'.repeat(70));
      console.log('• Enregistrement et accueil des patients');
      console.log('• Gestion de la file d\'attente');
      console.log('• Planification et modification des rendez-vous');
      console.log('• Vérification de l\'assurance (CNAMGS/CNSS)');
      console.log('• Orientation des patients vers les services');
      console.log('• Gestion des urgences et priorités');
      console.log('• Communication avec les services médicaux');
      console.log('• Statistiques d\'affluence et rapports d\'activité');
      
      console.log('\n⚙️ INTÉGRATION SYSTÈME:');
      console.log('─'.repeat(70));
      console.log('• Interface dédiée pour la réception');
      console.log('• Synchronisation avec l\'agenda des médecins');
      console.log('• Notifications automatiques pour les rendez-vous');
      console.log('• Accès en lecture aux dossiers patients');
      console.log('• Système de tickets et numérotation');
      console.log('• Tableau de bord temps réel de l\'activité');
    } else {
      console.log('\n❌ Échec de la création du compte');
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Exécuter le script
main()
  .then(() => {
    console.log('\n✅ Script terminé avec succès');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
