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
  console.error('❌ Configuration Supabase manquante');
  console.error('\n📝 Veuillez exécuter les migrations manuellement via Supabase Studio:');
  console.error('   1. Ouvrir https://supabase.com/dashboard');
  console.error('   2. SQL Editor → Nouvelle requête');
  console.error('   3. Copier/coller supabase/migrations/20251102_dashboard_minister_tables.sql');
  console.error('   4. Run');
  console.error('   5. Répéter avec 20251102_dashboard_minister_seed.sql');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

console.log('🚀 Script d\'application des migrations Dashboard Ministre\n');
console.log('⚠️  INFORMATION IMPORTANTE:');
console.log('   Ce script nécessite SUPABASE_SERVICE_ROLE_KEY dans .env');
console.log('   Si non disponible, utilisez Supabase Studio (voir GUIDE_MIGRATION_DASHBOARD.md)\n');

console.log('📋 ALTERNATIVE RECOMMANDÉE:');
console.log('   Exécuter les migrations via Supabase Studio:\n');
console.log('   1. https://supabase.com/dashboard → votre projet');
console.log('   2. SQL Editor → New query');
console.log('   3. Copier/coller le contenu de:');
console.log('      • supabase/migrations/20251102_dashboard_minister_tables.sql');
console.log('      • supabase/migrations/20251102_dashboard_minister_seed.sql');
console.log('   4. Run chaque requête\n');

// Tester la connexion
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('dashboard_kpis')
      .select('count')
      .limit(1);

    if (!error) {
      console.log('✅ Connexion Supabase OK');
      console.log('✅ Tables Dashboard déjà créées');
      console.log('\n🎯 Les migrations semblent déjà appliquées!');
      return true;
    }

    console.log('⚠️  Tables Dashboard non trouvées');
    console.log('📝 Veuillez exécuter les migrations via Supabase Studio\n');
    return false;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    process.exit(0);
  } else {
    console.log('📖 Consultez GUIDE_MIGRATION_DASHBOARD.md pour les instructions détaillées');
    process.exit(0);
  }
});

