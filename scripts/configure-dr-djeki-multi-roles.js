import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger le .env depuis la racine du projet
dotenv.config({ path: join(__dirname, '..', '.env') });

// Hardcoded values pour ce script uniquement
const supabaseUrl = 'https://bolidzesitkkfojdyuyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbGlkemVzaXRra2ZvamR5dXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTMxMzUsImV4cCI6MjA3NDkyOTEzNX0.bKmwG96ju8nRHLOizeMtp-VleN658wI6CpOkCChgc2A';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function configureDrDjekiMultiRoles() {
  console.log('🎯 Configuration multi-rôles pour Dr. Jules DJEKI');
  console.log('================================================\n');

  try {
    // 1. Récupérer l'utilisateur via profiles (accessible avec anon key)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'directeur.sogara@sante.ga')
      .single();
    
    if (profileError || !profile) {
      console.error('❌ Profil non trouvé:', profileError?.message);
      console.log('   Vérifiez que l\'utilisateur directeur.sogara@sante.ga existe');
      return;
    }

    console.log('✅ Profil utilisateur trouvé:', profile.id);
    console.log('   Email:', profile.email);
    console.log('   Nom:', profile.full_name);

    // 2. Récupérer le profil professionnel
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', profile.id)
      .single();

    if (profError || !professional) {
      console.error('❌ Profil professionnel non trouvé');
      return;
    }

    console.log('✅ Profil professionnel:', professional.id);
    console.log('   Nom complet:', professional.full_name);

    // 3. Récupérer l'établissement CMST SOGARA
    const { data: establishment, error: estError } = await supabase
      .from('establishments')
      .select('*')
      .ilike('name', '%CMST SOGARA%')
      .single();

    if (estError || !establishment) {
      console.error('❌ Établissement CMST SOGARA non trouvé');
      return;
    }

    console.log('✅ Établissement trouvé:', establishment.id);
    console.log('   Nom:', establishment.name);

    // 4. Supprimer les anciennes affiliations
    const { error: deleteError } = await supabase
      .from('establishment_staff')
      .delete()
      .eq('professional_id', professional.id)
      .eq('establishment_id', establishment.id);

    if (deleteError) {
      console.log('⚠️  Erreur lors de la suppression des anciennes affiliations:', deleteError.message);
    }

    // 5. Créer RÔLE 1 : Directeur
    const { data: directorRole, error: dirError } = await supabase
      .from('establishment_staff')
      .insert({
        establishment_id: establishment.id,
        professional_id: professional.id,
        role_in_establishment: 'director',
        department: 'Direction Médicale',
        job_position: 'Médecin en Chef',
        matricule: 'DIR-001',
        is_admin: true,
        is_department_head: true,
        permissions: ['all'],
        status: 'active',
        start_date: '2024-01-01',
        created_by: profile.id
      })
      .select()
      .single();

    if (dirError) {
      console.error('❌ Erreur création rôle Directeur:', dirError.message);
    } else {
      console.log('✅ Rôle DIRECTEUR créé');
      console.log('   ID:', directorRole.id);
      console.log('   Département:', directorRole.department);
      console.log('   Admin:', directorRole.is_admin);
    }

    // 6. Créer RÔLE 2 : Médecin
    const { data: doctorRole, error: docError } = await supabase
      .from('establishment_staff')
      .insert({
        establishment_id: establishment.id,
        professional_id: professional.id,
        role_in_establishment: 'doctor',
        department: 'Médecine Générale',
        job_position: 'Médecin Généraliste',
        matricule: 'MED-001',
        is_admin: false,
        is_department_head: false,
        permissions: ['consultation', 'prescription', 'view_dmp', 'edit_dmp'],
        status: 'active',
        start_date: '2024-01-01',
        created_by: profile.id
      })
      .select()
      .single();

    if (docError) {
      console.error('❌ Erreur création rôle Médecin:', docError.message);
    } else {
      console.log('✅ Rôle MÉDECIN créé');
      console.log('   ID:', doctorRole.id);
      console.log('   Département:', doctorRole.department);
      console.log('   Admin:', doctorRole.is_admin);
    }

    // 7. Vérifier les rôles créés
    const { data: allRoles, error: rolesError } = await supabase
      .from('establishment_staff')
      .select('*')
      .eq('professional_id', professional.id)
      .eq('establishment_id', establishment.id);

    if (!rolesError && allRoles) {
      console.log('\n📊 RÉSUMÉ - Dr. DJEKI a maintenant', allRoles.length, 'rôles:');
      allRoles.forEach(role => {
        console.log(`   - ${role.role_in_establishment.toUpperCase()} (${role.department})`);
      });
    }

    console.log('\n✅ Configuration multi-rôles terminée !');
    console.log('💡 Dr. DJEKI peut maintenant basculer entre DIRECTEUR et MÉDECIN');
    console.log('🌐 Testez sur http://localhost:8080/professional/');

  } catch (error) {
    console.error('❌ Erreur globale:', error);
  } finally {
    process.exit(0);
  }
}

// Exécuter
configureDrDjekiMultiRoles();
