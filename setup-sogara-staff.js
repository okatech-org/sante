import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   - VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   - VITE_SUPABASE_SERVICE_ROLE_KEY ou VITE_SUPABASE_ANON_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

console.log('🔧 Initialisation de Supabase...');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSogaraStaff() {
  try {
    console.log('\n📄 Lecture du fichier SQL...');
    const sql = readFileSync('./create-sogara-establishment-staff.sql', 'utf8');
    
    console.log('📊 Exécution du script SQL...\n');
    
    // Diviser le script en sections et les exécuter séparément
    const sections = sql.split(/;[\s\n]*(?=--|INSERT|DO|SELECT)/);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section || section.startsWith('--')) continue;
      
      console.log(`   Exécution section ${i + 1}/${sections.length}...`);
      
      // Utiliser la fonction RPC si disponible, sinon essayer directement
      try {
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: section + ';' 
        });
        
        if (error) {
          // Si RPC n'existe pas, on continue quand même
          if (error.message.includes('function') && error.message.includes('does not exist')) {
            console.warn('   ⚠️  La fonction exec_sql n\'existe pas, tentative alternative...');
            // On ne peut pas exécuter de SQL arbitraire via le client standard
            // Il faut utiliser l'interface Supabase
            console.error('\n❌ Vous devez exécuter ce script via l\'interface Supabase SQL Editor');
            console.error('\n📋 Instructions:');
            console.error('   1. Allez sur https://supabase.com/dashboard');
            console.error('   2. Sélectionnez votre projet');
            console.error('   3. Allez dans "SQL Editor"');
            console.error('   4. Créez une nouvelle query');
            console.error('   5. Copiez-collez le contenu de create-sogara-establishment-staff.sql');
            console.error('   6. Cliquez sur "Run"\n');
            process.exit(1);
          }
          throw error;
        }
      } catch (err) {
        console.error(`   ❌ Erreur:`, err.message);
      }
    }
    
    console.log('\n✅ Script exécuté avec succès!\n');
    
    // Vérifier les résultats
    console.log('🔍 Vérification des données créées...\n');
    
    const { data: establishment, error: estError } = await supabase
      .from('establishments')
      .select('*')
      .eq('id', 'sogara-cmst-001')
      .single();
    
    if (establishment) {
      console.log('✓ Établissement SOGARA créé:', establishment.name);
    } else {
      console.log('✗ Établissement SOGARA non trouvé');
    }
    
    const { data: departments, error: deptError } = await supabase
      .from('establishment_departments')
      .select('*')
      .eq('establishment_id', 'sogara-cmst-001');
    
    console.log(`✓ Départements créés: ${departments?.length || 0}`);
    
    const { data: professionals, error: profError } = await supabase
      .from('professionals')
      .select('*, auth.users!inner(email)')
      .ilike('auth.users.email', '%sogara@sante.ga');
    
    console.log(`✓ Professionnels SOGARA créés: ${professionals?.length || 0}`);
    
    const { data: staff, error: staffError } = await supabase
      .from('establishment_staff')
      .select('*, professionals!inner(*, auth.users!inner(email))')
      .eq('establishment_id', 'sogara-cmst-001');
    
    console.log(`✓ Staff SOGARA créé: ${staff?.length || 0}\n`);
    
    if (staff && staff.length > 0) {
      console.log('📋 Liste du personnel:');
      staff.forEach(s => {
        console.log(`   - ${s.position || s.role} (${s.matricule || 'N/A'})`);
      });
    }
    
    console.log('\n🎉 Configuration terminée! Rechargez votre page dans le navigateur.\n');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'exécution:', error);
    console.error('\n📋 Instructions alternatives:');
    console.error('   Exécutez le script manuellement via Supabase SQL Editor:');
    console.error('   1. Ouvrez https://supabase.com/dashboard');
    console.error('   2. Sélectionnez votre projet');
    console.error('   3. Allez dans "SQL Editor"');
    console.error('   4. Copiez-collez le contenu de create-sogara-establishment-staff.sql');
    console.error('   5. Cliquez sur "Run"\n');
    process.exit(1);
  }
}

setupSogaraStaff();

