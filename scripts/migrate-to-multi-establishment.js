/**
 * Script de migration vers l'architecture multi-établissements
 * Date: 30/10/2025
 * 
 * Ce script migre les données existantes vers la nouvelle architecture
 * avec support multi-établissements et rôles contextuels
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.log('Assurez-vous que VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ID de l'établissement CMST SOGARA
const CMST_SOGARA_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

// Mapping des emails vers les rôles et départements
const STAFF_MAPPING = {
  'directeur.sogara@sante.ga': {
    role: 'director',
    department: 'DIR',
    position: 'Directeur Médical',
    isAdmin: true,
    isDepartmentHead: true
  },
  'admin.sogara@sante.ga': {
    role: 'admin',
    department: 'ADM',
    position: 'Administrateur Principal',
    isAdmin: true,
    isDepartmentHead: false
  },
  'dr.okemba.sogara@sante.ga': {
    role: 'doctor',
    department: 'MED',
    position: 'Médecin Généraliste',
    isAdmin: false,
    isDepartmentHead: false
  },
  'dr.nguema.sogara@sante.ga': {
    role: 'doctor',
    department: 'URG',
    position: 'Médecin Urgentiste',
    isAdmin: false,
    isDepartmentHead: true
  },
  'dr.mbina.sogara@sante.ga': {
    role: 'doctor',
    department: 'CARD',
    position: 'Cardiologue',
    isAdmin: false,
    isDepartmentHead: false
  },
  'dr.mezui.sogara@sante.ga': {
    role: 'doctor',
    department: 'PED',
    position: 'Pédiatre',
    isAdmin: false,
    isDepartmentHead: false
  },
  'nurse.mba.sogara@sante.ga': {
    role: 'nurse',
    department: 'SI',
    position: 'Infirmier(e) Chef',
    isAdmin: false,
    isDepartmentHead: false
  },
  'nurse.nze.sogara@sante.ga': {
    role: 'nurse',
    department: 'URG',
    position: 'Infirmier(e)',
    isAdmin: false,
    isDepartmentHead: false
  },
  'nurse.andeme.sogara@sante.ga': {
    role: 'nurse',
    department: 'MAT',
    position: 'Infirmier(e) Maternité',
    isAdmin: false,
    isDepartmentHead: false
  },
  'lab.tech.sogara@sante.ga': {
    role: 'laborantin',
    department: 'LAB',
    position: 'Technicien Laboratoire',
    isAdmin: false,
    isDepartmentHead: false
  },
  'pharma.sogara@sante.ga': {
    role: 'pharmacist',
    department: 'PHAR',
    position: 'Pharmacien(ne) Chef',
    isAdmin: false,
    isDepartmentHead: true
  },
  'accueil.sogara@sante.ga': {
    role: 'receptionist',
    department: 'ACC',
    position: 'Réceptionniste',
    isAdmin: false,
    isDepartmentHead: false
  }
};

async function migrateToMultiEstablishment() {
  console.log('🚀 Début de la migration multi-établissements...\n');

  try {
    // 1. Récupérer tous les utilisateurs SOGARA
    console.log('📋 Récupération des utilisateurs SOGARA...');
    const sogaraEmails = Object.keys(STAFF_MAPPING);
    
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('email', sogaraEmails);

    if (usersError) {
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${usersError.message}`);
    }

    console.log(`✅ ${users.length} utilisateurs SOGARA trouvés\n`);

    // 2. Récupérer les départements
    console.log('🏢 Récupération des départements...');
    const { data: departments, error: deptsError } = await supabase
      .from('establishment_departments')
      .select('id, code')
      .eq('establishment_id', CMST_SOGARA_ID);

    if (deptsError) {
      throw new Error(`Erreur lors de la récupération des départements: ${deptsError.message}`);
    }

    const deptMap = {};
    departments.forEach(dept => {
      deptMap[dept.code] = dept.id;
    });
    console.log(`✅ ${departments.length} départements trouvés\n`);

    // 3. Créer les professionnels et les affiliations
    console.log('👥 Création des profils professionnels et affiliations...\n');
    
    for (const user of users) {
      const staffInfo = STAFF_MAPPING[user.email];
      if (!staffInfo) continue;

      console.log(`Processing ${user.full_name} (${user.email})...`);

      // Créer ou mettre à jour le profil professionnel
      const { data: professional, error: profError } = await supabase
        .from('professionals')
        .upsert({
          user_id: user.id,
          email: user.email,
          full_name: user.full_name,
          professional_type: staffInfo.role === 'doctor' ? 'Médecin' : 
                            staffInfo.role === 'nurse' ? 'Infirmier(e)' :
                            staffInfo.role === 'pharmacist' ? 'Pharmacien(ne)' :
                            staffInfo.role === 'laborantin' ? 'Laborantin(e)' :
                            staffInfo.role === 'admin' ? 'Administrateur' :
                            staffInfo.role === 'director' ? 'Directeur' :
                            'Autre',
          speciality: staffInfo.department === 'CARD' ? 'Cardiologie' :
                     staffInfo.department === 'PED' ? 'Pédiatrie' :
                     staffInfo.department === 'URG' ? 'Urgences' :
                     null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id',
          returning: true
        })
        .select()
        .single();

      if (profError) {
        console.error(`  ❌ Erreur pour ${user.email}: ${profError.message}`);
        continue;
      }

      // Créer l'affiliation à l'établissement
      const departmentId = deptMap[staffInfo.department];
      
      const { error: staffError } = await supabase
        .from('establishment_staff')
        .upsert({
          professional_id: professional.id,
          establishment_id: CMST_SOGARA_ID,
          department_id: departmentId,
          role: staffInfo.role,
          position: staffInfo.position,
          is_department_head: staffInfo.isDepartmentHead,
          is_establishment_admin: staffInfo.isAdmin,
          status: 'active',
          matricule: `SOGARA-${staffInfo.department}-${Date.now().toString().slice(-4)}`,
          permissions: {},
          start_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'professional_id,establishment_id,department_id'
        });

      if (staffError) {
        console.error(`  ❌ Erreur affiliation pour ${user.email}: ${staffError.message}`);
      } else {
        console.log(`  ✅ ${user.full_name} - ${staffInfo.position}`);
      }
    }

    // 4. Créer des modules pour l'établissement
    console.log('\n📦 Activation des modules pour CMST SOGARA...');
    const modules = [
      'consultations',
      'urgences',
      'hospitalisation',
      'laboratoire',
      'pharmacie',
      'work-medicine',
      'technical-platform'
    ];

    for (const module of modules) {
      await supabase
        .from('establishment_modules')
        .upsert({
          establishment_id: CMST_SOGARA_ID,
          module_name: module,
          is_active: true,
          settings: {}
        }, {
          onConflict: 'establishment_id,module_name'
        });
    }
    console.log('✅ Modules activés');

    console.log('\n✨ Migration terminée avec succès!');
    console.log('');
    console.log('📝 Prochaines étapes:');
    console.log('1. Les utilisateurs peuvent maintenant se connecter avec leurs identifiants');
    console.log('2. Ils verront leurs établissements d\'affiliation');
    console.log('3. Le menu sera généré selon leurs permissions dans chaque établissement');
    console.log('4. Pour ajouter un utilisateur à plusieurs établissements, utilisez l\'interface admin');

  } catch (error) {
    console.error('\n❌ Erreur lors de la migration:', error.message);
    process.exit(1);
  }
}

// Exécuter la migration
migrateToMultiEstablishment();
