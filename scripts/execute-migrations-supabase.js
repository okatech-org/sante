/**
 * Script pour exécuter les migrations SQL dans Supabase
 * Date: 30/10/2025
 * 
 * Ce script exécute toutes les migrations nécessaires pour activer
 * le système multi-établissements directement dans Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration Supabase
const SUPABASE_URL = 'https://bolidzesitkkfojdyuyg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante');
  console.log('\n📝 Pour obtenir votre service_role key :');
  console.log('1. Allez sur https://supabase.com/dashboard');
  console.log('2. Sélectionnez votre projet');
  console.log('3. Settings > API > service_role key');
  console.log('\nPuis exécutez :');
  console.log('SUPABASE_SERVICE_ROLE_KEY="your_key" node scripts/execute-migrations-supabase.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function executeMigrations() {
  console.log('🚀 Exécution des migrations Supabase\n');
  console.log('================================================\n');
  console.log('📍 Projet : bolidzesitkkfojdyuyg');
  console.log('🔗 URL : https://bolidzesitkkfojdyuyg.supabase.co');
  console.log('\n');

  try {
    // Liste des fichiers SQL à exécuter dans l'ordre
    const migrations = [
      '../supabase/migrations/20251030_multi_establishments.sql',
      '../supabase/migrations/20251030_invitations_requests.sql',
      '../supabase/activate-multi-establishments-complete.sql'
    ];

    console.log('📋 Migrations à exécuter :');
    migrations.forEach((m, i) => {
      console.log(`   ${i + 1}. ${path.basename(m)}`);
    });
    console.log('\n');

    // Exécuter chaque migration
    for (const migrationFile of migrations) {
      const filePath = path.join(__dirname, migrationFile);
      const fileName = path.basename(migrationFile);
      
      console.log(`📝 Exécution de ${fileName}...`);
      
      // Vérifier que le fichier existe
      if (!fs.existsSync(filePath)) {
        console.error(`   ❌ Fichier non trouvé : ${filePath}`);
        continue;
      }

      // Lire le contenu SQL
      const sqlContent = fs.readFileSync(filePath, 'utf8');
      
      // Note: Supabase JS SDK n'a pas de méthode directe pour exécuter du SQL brut
      // Vous devrez exécuter ces migrations via :
      // 1. Supabase Dashboard > SQL Editor
      // 2. Supabase CLI
      // 3. Ou créer les tables/fonctions individuellement via le SDK
      
      console.log(`   ⚠️ Migration ${fileName} prête à être exécutée`);
      console.log(`   📄 Taille : ${(sqlContent.length / 1024).toFixed(2)} KB`);
      console.log('');
    }

    console.log('================================================\n');
    console.log('⚠️ IMPORTANT :\n');
    console.log('Les migrations SQL ne peuvent pas être exécutées directement via le SDK JS.');
    console.log('\n📝 Options pour exécuter les migrations :\n');
    
    console.log('Option 1 : Via Supabase Dashboard');
    console.log('─────────────────────────────────');
    console.log('1. Allez sur https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/sql');
    console.log('2. Copiez le contenu de chaque fichier SQL');
    console.log('3. Exécutez dans l\'ordre');
    console.log('');
    
    console.log('Option 2 : Via Supabase CLI');
    console.log('──────────────────────────');
    console.log('# Installation');
    console.log('npm install -g supabase');
    console.log('');
    console.log('# Connexion');
    console.log('supabase login');
    console.log('');
    console.log('# Lien au projet');
    console.log('supabase link --project-ref bolidzesitkkfojdyuyg');
    console.log('');
    console.log('# Exécution des migrations');
    console.log('supabase db push');
    console.log('');
    
    console.log('Option 3 : Via Lovable Cloud');
    console.log('────────────────────────────');
    console.log('Si vous utilisez Lovable Cloud, accédez au SQL Editor intégré');
    console.log('');

    // Test de connexion pour vérifier que les credentials fonctionnent
    console.log('🔌 Test de connexion à Supabase...');
    const { data: test, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion :', error.message);
    } else {
      console.log('✅ Connexion à Supabase réussie !');
      console.log('');
      console.log('📊 État actuel :');
      
      // Vérifier si les tables existent déjà
      const tables = [
        'professionals',
        'establishments', 
        'establishment_staff',
        'establishment_invitations',
        'establishment_requests'
      ];
      
      for (const table of tables) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`   ❌ Table ${table} : Non trouvée`);
        } else {
          console.log(`   ✅ Table ${table} : Existe (${count || 0} entrées)`);
        }
      }
    }

  } catch (error) {
    console.error('\n❌ Erreur :', error.message);
  }
}

// Exécuter le script
executeMigrations();
