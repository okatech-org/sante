#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERREUR: Variables manquantes dans .env');
  console.error('   VITE_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const CMST_SOGARA_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

async function restoreDoctorRole() {
  console.log('\n🔧 RESTAURATION DU RÔLE MÉDECIN - DR. JULES DJEKI');
  console.log('═'.repeat(60));

  try {
    console.log('\n1️⃣ Recherche du compte Dr. DJEKI...');
    
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', 'directeur.sogara@sante.ga')
      .single();

    if (userError || !userData) {
      console.error('❌ Utilisateur non trouvé');
      console.error('   Assurez-vous que le compte directeur.sogara@sante.ga existe');
      return;
    }

    console.log(`✅ Compte trouvé : ${userData.full_name} (${userData.email})`);

    console.log('\n2️⃣ Vérification du profil professionnel...');
    
    let professionalId;
    const { data: existingPro, error: proError } = await supabase
      .from('professionals')
      .select('id, professional_type')
      .eq('user_id', userData.id)
      .single();

    if (existingPro) {
      professionalId = existingPro.id;
      console.log(`✅ Profil professionnel existant trouvé (ID: ${professionalId})`);
    } else {
      console.log('⚠️  Aucun profil professionnel trouvé, création...');
      
      const { data: newPro, error: createProError } = await supabase
        .from('professionals')
        .insert({
          user_id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          professional_type: 'medecin_generaliste',
          specialty: 'Médecine Générale / Administration',
          numero_ordre: 'MED-GA-2024-001',
          gender: 'homme',
          title: 'docteur',
          birth_date: '1975-06-15',
          nationality: 'Gabonaise',
          status: 'actif',
          verified: true,
          documents_verified: true,
          verification_date: new Date().toISOString()
        })
        .select()
        .single();

      if (createProError) {
        console.error('❌ Erreur création profil professionnel:', createProError.message);
        return;
      }
      
      professionalId = newPro.id;
      console.log(`✅ Profil professionnel créé (ID: ${professionalId})`);
    }

    console.log('\n3️⃣ Vérification des départements CMST SOGARA...');
    
    const { data: departments, error: deptError } = await supabase
      .from('establishment_departments')
      .select('id, code, name')
      .eq('establishment_id', CMST_SOGARA_ID)
      .in('code', ['DIR', 'MED']);

    if (deptError) {
      console.error('❌ Erreur récupération départements:', deptError.message);
      return;
    }

    const dirDept = departments?.find(d => d.code === 'DIR');
    const medDept = departments?.find(d => d.code === 'MED');

    if (!dirDept) {
      console.error('❌ Département Direction (DIR) non trouvé');
      return;
    }

    if (!medDept) {
      console.error('❌ Département Médical (MED) non trouvé');
      console.log('   Création du département médical...');
      
      const { data: newMedDept, error: createDeptError } = await supabase
        .from('establishment_departments')
        .insert({
          establishment_id: CMST_SOGARA_ID,
          code: 'MED',
          name: 'Service Médical',
          description: 'Consultations et soins médicaux'
        })
        .select()
        .single();

      if (createDeptError) {
        console.error('❌ Erreur création département médical:', createDeptError.message);
        return;
      }

      console.log(`✅ Département médical créé`);
      departments.push(newMedDept);
    }

    const medDeptFinal = departments?.find(d => d.code === 'MED');

    console.log(`✅ Départements trouvés:`);
    console.log(`   - Direction: ${dirDept.name} (ID: ${dirDept.id})`);
    console.log(`   - Médical: ${medDeptFinal.name} (ID: ${medDeptFinal.id})`);

    console.log('\n4️⃣ Vérification des affiliations existantes...');
    
    const { data: existingStaff, error: staffError } = await supabase
      .from('establishment_staff')
      .select('id, role, position, department_id')
      .eq('professional_id', professionalId)
      .eq('establishment_id', CMST_SOGARA_ID);

    if (staffError) {
      console.error('❌ Erreur récupération affiliations:', staffError.message);
      return;
    }

    const hasDirectorRole = existingStaff?.some(s => s.role === 'director');
    const hasDoctorRole = existingStaff?.some(s => s.role === 'doctor');

    console.log(`   Rôle Directeur: ${hasDirectorRole ? '✅ Présent' : '❌ Absent'}`);
    console.log(`   Rôle Médecin: ${hasDoctorRole ? '✅ Présent' : '❌ Absent'}`);

    if (hasDoctorRole) {
      console.log('\n✨ Le rôle Médecin existe déjà ! Aucune action nécessaire.');
      console.log('\n📋 Rôles actuels:');
      existingStaff.forEach(staff => {
        console.log(`   - ${staff.position} (role: ${staff.role})`);
      });
      return;
    }

    console.log('\n5️⃣ Restauration du rôle Médecin...');
    
    const { data: newDoctorRole, error: doctorError } = await supabase
      .from('establishment_staff')
      .insert({
        professional_id: professionalId,
        establishment_id: CMST_SOGARA_ID,
        department_id: medDeptFinal.id,
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
      })
      .select()
      .single();

    if (doctorError) {
      console.error('❌ Erreur ajout rôle médecin:', doctorError.message);
      return;
    }

    console.log('✅ Rôle Médecin restauré avec succès!');

    console.log('\n6️⃣ Vérification finale...');
    
    const { data: finalStaff, error: finalError } = await supabase
      .from('establishment_staff')
      .select('id, role, position, department_id')
      .eq('professional_id', professionalId)
      .eq('establishment_id', CMST_SOGARA_ID);

    if (finalError) {
      console.error('❌ Erreur vérification finale:', finalError.message);
      return;
    }

    console.log('\n═'.repeat(60));
    console.log('✨ RESTAURATION TERMINÉE AVEC SUCCÈS!');
    console.log('═'.repeat(60));
    console.log('\n📊 RÉSUMÉ - Dr. Jules DJEKI');
    console.log('─'.repeat(60));
    console.log(`👤 Compte: ${userData.email}`);
    console.log(`👨‍⚕️ Professionnel ID: ${professionalId}`);
    console.log(`🏥 Établissement: CMST SOGARA`);
    console.log('');
    console.log('👔 Rôles au CMST SOGARA:');
    finalStaff.forEach((staff, index) => {
      console.log(`   ${index + 1}. ${staff.position} (role: ${staff.role})`);
    });
    console.log('');
    console.log('💡 Actions possibles:');
    console.log('   - Basculer entre les rôles Directeur et Médecin');
    console.log('   - Accéder au menu Directeur pour la gestion');
    console.log('   - Accéder au menu Médecin pour les consultations');
    console.log('');
    console.log('🔗 Connexion:');
    console.log('   Email: directeur.sogara@sante.ga');
    console.log('   URL: http://localhost:8080/login/professional');
    console.log('');

  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error.message);
    console.error(error);
    process.exit(1);
  }
}

restoreDoctorRole();

