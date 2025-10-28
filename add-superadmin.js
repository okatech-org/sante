#!/usr/bin/env node

/**
 * Script pour ajouter le rôle super_admin à un utilisateur
 * Usage: node add-superadmin.js votre-email@example.com
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERREUR: Variables manquantes dans .env.local');
  console.error('   Assurez-vous que SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis');
  process.exit(1);
}

const email = process.argv[2];

if (!email) {
  console.error('❌ ERREUR: Email requis');
  console.error('   Usage: node add-superadmin.js votre-email@example.com');
  process.exit(1);
}

// Créer client Supabase avec service_role key (bypass RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addSuperAdmin(userEmail) {
  try {
    console.log(`🔍 Recherche de l'utilisateur: ${userEmail}`);
    
    // 1. Trouver l'utilisateur dans auth.users
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      throw new Error(`Erreur lors de la recherche: ${userError.message}`);
    }
    
    const user = users.users.find(u => u.email === userEmail);
    
    if (!user) {
      throw new Error(`Utilisateur non trouvé avec l'email: ${userEmail}`);
    }
    
    console.log(`✅ Utilisateur trouvé: ${user.id}`);
    
    // 2. Vérifier si le rôle existe déjà
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'super_admin')
      .single();
    
    if (existingRole) {
      console.log('ℹ️  L\'utilisateur a déjà le rôle super_admin');
      return;
    }
    
    // 3. Ajouter le rôle super_admin
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: 'super_admin'
      });
    
    if (insertError) {
      throw new Error(`Erreur lors de l'ajout du rôle: ${insertError.message}`);
    }
    
    console.log('🎉 SUCCESS! Rôle super_admin ajouté avec succès');
    console.log('');
    console.log('📝 Prochaines étapes:');
    console.log('   1. Déconnectez-vous de l\'application');
    console.log('   2. Reconnectez-vous avec cet email');
    console.log('   3. Accédez à /admin pour le panneau super admin');
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    process.exit(1);
  }
}

// Exécuter
addSuperAdmin(email);
