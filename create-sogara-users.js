#!/usr/bin/env node

/**
 * Create SOGARA demo users in Supabase
 * This script uses the Admin API to properly create authenticated users
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables');
  console.error('   Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// SOGARA users to create
const sogaraUsers = [
  // Administrators (2)
  {
    email: 'admin@sogara.com',
    password: 'Admin@SOGARA2024',
    fullName: 'Jean-Pierre Mbadinga',
    role: 'hospital',
    department: 'Administration',
    matricule: 'ADM-001',
    isAdmin: true
  },
  {
    email: 'directeur@sogara.com',
    password: 'DirecteurSOGARA2024!',
    fullName: 'Dr. François Obiang',
    role: 'hospital',
    department: 'Direction Médicale',
    matricule: 'DIR-001',
    isAdmin: true
  },
  // Doctors (4)
  {
    email: 'dr.okemba@sogara.com',
    password: 'Okemba@2024Med',
    fullName: 'Dr. Marie Okemba',
    role: 'doctor',
    department: 'Médecine Générale',
    matricule: 'MED-012',
    professionalType: 'doctor'
  },
  {
    email: 'dr.nguema@sogara.com',
    password: 'Nguema@Urgence24',
    fullName: 'Dr. Paul Nguema',
    role: 'doctor',
    department: 'Urgences',
    matricule: 'MED-015',
    professionalType: 'doctor'
  },
  {
    email: 'dr.mbina@sogara.com',
    password: 'Mbina@Cardio2024',
    fullName: 'Dr. Léa Mbina',
    role: 'doctor',
    department: 'Cardiologie',
    matricule: 'MED-018',
    professionalType: 'doctor'
  },
  {
    email: 'dr.mezui@sogara.com',
    password: 'Mezui@Pediatrie24',
    fullName: 'Dr. Thomas Mezui',
    role: 'doctor',
    department: 'Pédiatrie',
    matricule: 'MED-022',
    professionalType: 'doctor'
  },
  // Nurses (3)
  {
    email: 'nurse.mba@sogara.com',
    password: 'MbaSI@2024',
    fullName: 'Sylvie Mba',
    role: 'medical_staff',
    department: 'Soins Intensifs',
    matricule: 'INF-025',
    professionalType: 'nurse'
  },
  {
    email: 'nurse.nze@sogara.com',
    password: 'NzeUrg@2024',
    fullName: 'Patricia Nze',
    role: 'medical_staff',
    department: 'Urgences',
    matricule: 'INF-028',
    professionalType: 'nurse'
  },
  {
    email: 'nurse.andeme@sogara.com',
    password: 'Andeme@Mat2024',
    fullName: 'Claire Andeme',
    role: 'medical_staff',
    department: 'Maternité',
    matricule: 'INF-030',
    professionalType: 'nurse'
  },
  // Lab Tech (1)
  {
    email: 'lab.tech@sogara.com',
    password: 'LabSOGARA@2024',
    fullName: 'André Moussavou',
    role: 'laboratory',
    department: 'Laboratoire',
    matricule: 'LAB-008',
    professionalType: 'lab_tech'
  },
  // Pharmacist (1)
  {
    email: 'pharma@sogara.com',
    password: 'PharmaSOGARA@24',
    fullName: 'Dr. Lydie Kombila',
    role: 'pharmacy',
    department: 'Pharmacie',
    matricule: 'PHAR-004',
    professionalType: 'pharmacist'
  },
  // Receptionist (1)
  {
    email: 'accueil@sogara.com',
    password: 'AccueilSOGARA@24',
    fullName: 'Nadège Oyono',
    role: 'medical_staff',
    department: 'Accueil',
    matricule: 'REC-002',
    professionalType: 'receptionist'
  }
];

async function createUser(userData) {
  console.log(`\n📧 Creating user: ${userData.email}`);
  console.log(`   Name: ${userData.fullName}`);
  console.log(`   Role: ${userData.role}`);

  try {
    // 1. Create user in auth.users using Admin API
    console.log('   1. Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: userData.fullName,
        department: userData.department,
        matricule: userData.matricule,
        establishment: 'CMST SOGARA'
      }
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log('   ⚠️  User already exists, skipping...');
        return { success: false, reason: 'exists' };
      }
      throw authError;
    }

    const userId = authData.user.id;
    console.log(`   ✅ Auth user created (ID: ${userId.substring(0, 8)}...)`);

    // 2. Create profile
    console.log('   2. Creating profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: userData.fullName,
        email: userData.email,
        phone: userData.matricule
      });

    if (profileError) {
      console.log('   ⚠️  Profile error:', profileError.message);
    } else {
      console.log('   ✅ Profile created');
    }

    // 3. Assign role
    console.log('   3. Assigning role...');
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: userData.role
      });

    if (roleError && !roleError.message.includes('duplicate')) {
      console.log('   ⚠️  Role error:', roleError.message);
    } else {
      console.log('   ✅ Role assigned:', userData.role);
    }

    // 4. Create professional profile if needed
    if (['doctor', 'medical_staff', 'laboratory', 'pharmacy'].includes(userData.role)) {
      console.log('   4. Creating professional profile...');
      const { error: profError } = await supabase
        .from('professionals')
        .upsert({
          user_id: userId,
          professional_type: userData.professionalType,
          numero_ordre: userData.matricule,
          specialite: userData.department,
          etablissement: 'CMST SOGARA',
          is_verified: true
        });

      if (profError) {
        console.log('   ⚠️  Professional profile error:', profError.message);
      } else {
        console.log('   ✅ Professional profile created');
      }
    }

    console.log('   🎉 User successfully created!\n');
    return { success: true };

  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return { success: false, reason: error.message };
  }
}

async function main() {
  console.log('🏥 CREATING SOGARA DEMO USERS');
  console.log('═'.repeat(60));
  console.log(`\nTarget: ${SUPABASE_URL}`);
  console.log(`Creating ${sogaraUsers.length} users...\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of sogaraUsers) {
    const result = await createUser(user);
    if (result.success) {
      created++;
    } else if (result.reason === 'exists') {
      skipped++;
    } else {
      failed++;
    }
  }

  console.log('═'.repeat(60));
  console.log('\n📊 SUMMARY:');
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped (already exist): ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📝 Total: ${sogaraUsers.length}\n`);

  if (created > 0 || skipped > 0) {
    console.log('🎯 TEST ACCOUNTS:');
    console.log('   Admin: admin@sogara.com / Admin@SOGARA2024');
    console.log('   Doctor: dr.okemba@sogara.com / Okemba@2024Med');
    console.log('   Nurse: nurse.mba@sogara.com / MbaSI@2024\n');
    
    console.log('🌐 LOGIN URL:');
    console.log('   http://localhost:5173/login/professional\n');
    
    console.log('📚 Full credentials list: SOGARA_IDENTIFIANTS_COMPLETS.md');
  }

  if (failed > 0) {
    console.log('\n⚠️  Some users failed to create. Check errors above.');
    process.exit(1);
  }
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

