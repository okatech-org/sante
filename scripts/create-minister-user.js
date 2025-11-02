import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Configuration Supabase manquante');
  console.error('Veuillez définir VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createMinisterUser() {
  console.log('🚀 Création de l\'utilisateur Ministre...\n');

  const email = 'ministre@sante.ga';
  const password = 'Ministre2025!';
  const role = 'MINISTRE';

  try {
    // Générer hash bcrypt
    console.log('🔐 Génération du hash bcrypt...');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(`✅ Hash généré: ${passwordHash.substring(0, 20)}...\n`);

    // Vérifier si l'utilisateur existe
    const { data: existing } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', email)
      .single();

    if (existing) {
      console.log('⚠️  Utilisateur déjà existant:');
      console.log(`   Email: ${existing.email}`);
      console.log(`   Role: ${existing.role}`);
      console.log(`   ID: ${existing.id}\n`);

      // Mettre à jour le mot de passe
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          password: passwordHash,
          role: role,
          first_name: 'Adrien',
          last_name: 'MOUGOUGOU',
        })
        .eq('email', email);

      if (updateError) throw updateError;

      console.log('✅ Mot de passe et informations mis à jour\n');
    } else {
      // Créer l'utilisateur
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email,
          password: passwordHash,
          first_name: 'Adrien',
          last_name: 'MOUGOUGOU',
          role,
          phone: '+241 01 23 45 67',
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Utilisateur créé avec succès:');
      console.log(`   Email: ${data.email}`);
      console.log(`   Role: ${data.role}`);
      console.log(`   ID: ${data.id}\n`);
    }

    console.log('📋 IDENTIFIANTS DE CONNEXION:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email      : ${email}`);
    console.log(`   Password   : ${password}`);
    console.log(`   Role       : ${role}`);
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🎯 ÉTAPES SUIVANTES:');
    console.log('   1. Démarrer le serveur: npm run start');
    console.log('   2. Ouvrir: http://localhost:8080/gouv/login');
    console.log('   3. Se connecter avec les identifiants ci-dessus');
    console.log('   4. Accéder au dashboard: http://localhost:8080/gouv/dashboard\n');

    console.log('✅ CONFIGURATION TERMINÉE!\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de la création de l\'utilisateur:');
    console.error(error.message);
    console.error('\n💡 Solution alternative:');
    console.error('   Créer l\'utilisateur manuellement via Supabase Studio');
    console.error('   Table: users');
    console.error('   Utiliser https://bcrypt-generator.com/ pour générer le hash\n');
    process.exit(1);
  }
}

createMinisterUser();

