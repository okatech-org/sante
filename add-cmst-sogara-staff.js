#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERREUR: Variables manquantes dans .env.local');
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

// Client avec service role key pour les opérations admin
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const staffMembers = [
  {
    email: 'medecin.cmst@sogara.ga',
    password: 'Demo2025!',
    fullName: 'Dr. Jean-Paul NZENZE',
    role: 'doctor',
    phone: '+241 06 XX XX XX',
    professionalType: 'medecin_du_travail',
    specialty: 'Médecine du Travail'
  },
  {
    email: 'infirmiere.cmst@sogara.ga',
    password: 'Demo2025!',
    fullName: 'Marie BOUNDA',
    role: 'nurse',
    phone: '+241 06 XX XX XX',
    professionalType: 'infirmier'
  },
  {
    email: 'admin.cmst@sogara.ga',
    password: 'Demo2025!',
    fullName: 'Paul OKANDZE',
    role: 'admin',
    phone: '+241 06 XX XX XX'
  }
];

async function addStaffMember(member) {
  try {
    console.log(`\n📝 Traitement: ${member.fullName} (${member.email})`);

    // Vérifier si le compte existe déjà
    console.log(`   ├─ Vérification du compte...`);
    try {
      const { data: existingUsers } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', member.email)
        .single();

      if (existingUsers) {
        console.log(`   ├─ ℹ️  Le compte existe déjà`);
        return;
      }
    } catch (e) {
      // Le profil n'existe pas, on peut continuer
    }

    // 1. Créer le compte utilisateur
    console.log(`   ├─ Création du compte utilisateur...`);
    const { data: { user }, error: authError } = await supabaseAnon.auth.signUp({
      email: member.email,
      password: member.password
    });

    if (authError && !authError.message.includes('already registered')) {
      throw new Error(`Auth: ${authError.message}`);
    }

    // Si l'utilisateur existe déjà, le récupérer
    let userId = user?.id;
    if (!userId) {
      // Récupérer l'ID de l'utilisateur existant via admin
      try {
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users?.users?.find(u => u.email === member.email);
        if (existingUser) {
          userId = existingUser.id;
        } else {
          throw new Error('Impossible de récupérer l\'ID utilisateur');
        }
      } catch (e) {
        throw new Error(`Impossible de récupérer l'utilisateur: ${e.message}`);
      }
    }

    console.log(`   ├─ ✅ Compte créé/récupéré (${userId})`);

    // 2. Ajouter le rôle
    console.log(`   ├─ Ajout du rôle...`);
    try {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: userId,
          role: member.role
        });

      if (roleError && !roleError.message.includes('duplicate') && !roleError.message.includes('exists')) {
        console.log(`   ├─ ⚠️  Rôle: ${roleError.message}`);
      } else {
        console.log(`   ├─ ✅ Rôle ajouté: ${member.role}`);
      }
    } catch (e) {
      console.log(`   ├─ ⚠️  Rôle: ${e.message}`);
    }

    // 3. Créer/Mettre à jour le profil
    console.log(`   ├─ Mise à jour du profil...`);
    try {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          full_name: member.fullName,
          email: member.email,
          phone: member.phone,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.log(`   ├─ ⚠️  Profil: ${profileError.message}`);
      } else {
        console.log(`   ├─ ✅ Profil mis à jour`);
      }
    } catch (e) {
      console.log(`   ├─ ⚠️  Profil: ${e.message}`);
    }

    // 4. Si c'est un professionnel, créer le profil professionnel
    if (['doctor', 'nurse'].includes(member.role)) {
      await createProfessionalProfile(userId, member);
    }

    console.log(`   └─ ✅ ${member.fullName} ajouté avec succès!\n`);

  } catch (error) {
    console.error(`   └─ ❌ ERREUR: ${error.message}\n`);
  }
}

async function createProfessionalProfile(userId, member) {
  console.log(`   ├─ Création du profil professionnel...`);
  
  const professionalData = {
    user_id: userId,
    full_name: member.fullName,
    email: member.email,
    phone: member.phone,
    professional_type: member.professionalType,
    gender: 'homme',
    title: member.professionalType === 'medecin_du_travail' ? 'docteur' : 'infirmier',
    birth_date: '1985-03-20',
    nationality: 'Gabonaise',
    numero_ordre: member.professionalType === 'medecin_du_travail' 
      ? '241-MDT-2025-001' 
      : '241-INF-2025-001',
    status: 'actif',
    verified: true,
    documents_verified: true,
    verification_date: new Date().toISOString()
  };

  let existing = null;
  try {
    const result = await supabaseAdmin
      .from('professionals')
      .select('id')
      .eq('user_id', userId)
      .single();
    existing = result.data;
  } catch (e) {
    // Le professionnel n'existe pas
  }

  if (!existing) {
    try {
      const { error: profError } = await supabaseAdmin
        .from('professionals')
        .insert(professionalData);

      if (profError) {
        console.log(`   ├─ ⚠️  Profil professionnel: ${profError.message}`);
        return;
      }
    } catch (e) {
      console.log(`   ├─ ⚠️  Profil professionnel: ${e.message}`);
      return;
    }
  }
  
  console.log(`   ├─ ✅ Profil professionnel créé`);
}

async function main() {
  console.log('\n🏥 AJOUT DES PROFESSIONNELS - CMST SOGARA');
  console.log('═'.repeat(50));

  try {
    for (const member of staffMembers) {
      await addStaffMember(member);
    }

    console.log('\n✅ SUCCÈS! Tous les professionnels ont été ajoutés');
    console.log('\n📝 Identifiants d\'accès:');
    console.log('─'.repeat(50));
    staffMembers.forEach(member => {
      console.log(`  📧 ${member.email}`);
      console.log(`     🔑 ${member.password}\n`);
    });

    console.log('💡 Prochaines étapes:');
    console.log('  1. Se connecter avec ces comptes sur https://sante.ga');
    console.log('  2. Remplir les informations professionnelles');
    console.log('  3. Connecter à l\'établissement CMST SOGARA');

  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error.message);
    process.exit(1);
  }
}

main();
