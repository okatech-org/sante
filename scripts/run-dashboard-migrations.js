import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  console.log(`\n🔄 Exécution de ${fileName}...`);
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error(`❌ Erreur dans ${fileName}:`, error.message);
      return false;
    }
    
    console.log(`✅ ${fileName} exécuté avec succès`);
    return true;
  } catch (error) {
    console.error(`❌ Exception dans ${fileName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Démarrage des migrations Dashboard Ministre...\n');
  
  const migrationsDir = path.resolve(__dirname, '../supabase/migrations');
  
  const migrations = [
    '20251102_dashboard_minister_tables.sql',
    '20251102_dashboard_minister_seed.sql',
  ];

  let successCount = 0;
  let failCount = 0;

  for (const migration of migrations) {
    const filePath = path.join(migrationsDir, migration);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Fichier non trouvé: ${migration}`);
      continue;
    }

    const success = await runMigration(filePath);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n📊 RÉSUMÉ DES MIGRATIONS');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Échecs: ${failCount}`);
  
  if (failCount > 0) {
    console.log('\n⚠️  Certaines migrations ont échoué.');
    console.log('Vous pouvez les exécuter manuellement via Supabase Studio:');
    console.log('https://supabase.com/dashboard → SQL Editor');
    process.exit(1);
  }

  console.log('\n✅ Toutes les migrations ont été exécutées avec succès!');
  console.log('🎯 Tables Dashboard Ministre prêtes à l\'emploi\n');
}

main().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});

