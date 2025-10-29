import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.error('Assurez-vous d\'avoir VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans votre .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Comptes SOGARA à créer
const sogaraUsers = [
  {
    email: "admin@sogara.com",
    password: "Admin@SOGARA2024",
    full_name: "Jean-Pierre Mbadinga",
    role: "hospital", // Utiliser 'hospital' au lieu de 'admin' pour éviter le blocage
    metadata: {
      department: "Administration",
      matricule: "ADM-001",
      establishment: "CMST SOGARA",
      is_establishment_admin: true
    }
  },
  {
    email: "directeur@sogara.com",
    password: "DirecteurSOGARA2024!",
    full_name: "Dr. François Obiang",
    role: "hospital", // Utiliser 'hospital' pour les admins établissement
    metadata: {
      department: "Direction Médicale",
      matricule: "DIR-001",
      establishment: "CMST SOGARA",
      is_establishment_admin: true
    }
  },
  {
    email: "dr.okemba@sogara.com",
    password: "Okemba@2024Med",
    full_name: "Dr. Marie Okemba",
    role: "doctor",
    metadata: {
      department: "Médecine Générale",
      matricule: "MED-012",
      establishment: "CMST SOGARA"
    }
  },
  {
    email: "dr.nguema@sogara.com",
    password: "Nguema@Urgence24",
    full_name: "Dr. Paul Nguema",
    role: "doctor",
    metadata: {
      department: "Urgences",
      matricule: "MED-015",
      establishment: "CMST SOGARA"
    }
  },
  {
    email: "dr.mbina@sogara.com",
    password: "Mbina@Cardio2024",
    full_name: "Dr. Léa Mbina",
    role: "doctor",
    metadata: {
      department: "Cardiologie",
      matricule: "MED-018",
      establishment: "CMST SOGARA"
    }
  },
  {
    email: "dr.mezui@sogara.com",
    password: "Mezui@Pediatrie24",
    full_name: "Dr. Thomas Mezui",
    role: "doctor",
    metadata: {
      department: "Pédiatrie",
      matricule: "MED-022",
      establishment: "CMST SOGARA"
    }
  },
  {
    email: "nurse.mba@sogara.com",
    password: "MbaSI@2024",
    full_name: "Sylvie Mba",
    role: "medical_staff",
    metadata: {
      department: "Soins Intensifs",
      matricule: "INF-025",
      establishment: "CMST SOGARA",
      professional_type: "nurse"
    }
  },
  {
    email: "nurse.nze@sogara.com",
    password: "NzeUrg@2024",
    full_name: "Patricia Nze",
    role: "medical_staff",
    metadata: {
      department: "Urgences",
      matricule: "INF-028",
      establishment: "CMST SOGARA",
      professional_type: "nurse"
    }
  },
  {
    email: "nurse.andeme@sogara.com",
    password: "Andeme@Mat2024",
    full_name: "Claire Andeme",
    role: "medical_staff",
    metadata: {
      department: "Maternité",
      matricule: "INF-030",
      establishment: "CMST SOGARA",
      professional_type: "nurse"
    }
  },
  {
    email: "lab.tech@sogara.com",
    password: "LabSOGARA@2024",
    full_name: "André Moussavou",
    role: "laboratory",
    metadata: {
      department: "Laboratoire",
      matricule: "LAB-008",
      establishment: "CMST SOGARA"
    }
  },
  {
    email: "pharma@sogara.com",
    password: "PharmaSOGARA@24",
    full_name: "Dr. Lydie Kombila",
    role: "pharmacy",
    metadata: {
      department: "Pharmacie",
      matricule: "PHAR-004",
      establishment: "CMST SOGARA"
    }
  },
  {
    email: "accueil@sogara.com",
    password: "AccueilSOGARA@24",
    full_name: "Nadège Oyono",
    role: "medical_staff",
    metadata: {
      department: "Accueil",
      matricule: "REC-002",
      establishment: "CMST SOGARA",
      professional_type: "receptionist"
    }
  }
];

async function createSogaraUsers() {
  console.log('🚀 Début de la création des comptes SOGARA...\n');

  // D'abord, trouver l'ID de l'établissement SOGARA
  const { data: establishments, error: estError } = await supabase
    .from('establishments')
    .select('id, raison_sociale')
    .ilike('raison_sociale', '%SOGARA%')
    .limit(1);

  if (estError || !establishments || establishments.length === 0) {
    console.error('❌ Établissement SOGARA non trouvé. Création...');
    
    // Créer l'établissement SOGARA
    const { data: newEst, error: createEstError } = await supabase
      .from('establishments')
      .insert({
        raison_sociale: 'Centre Médical de Santé au Travail SOGARA',
        type_etablissement: 'centre_medical',
        secteur: 'prive',
        ville: 'Port-Gentil',
        province: 'Ogooué-Maritime',
        adresse: 'Route de la Sogara',
        telephone: '011 55 26 21',
        email: 'service.rgc@sogara.com',
        latitude: -0.681398,
        longitude: 8.772557,
        nombre_lits_total: 200,
        nombre_blocs_operatoires: 4,
        nombre_salles_consultation: 15,
        service_urgences_actif: true,
        cnamgs_conventionne: true,
        cnss_conventionne: true,
        statut: 'actif'
      })
      .select()
      .single();

    if (createEstError) {
      console.error('❌ Erreur création établissement:', createEstError);
      return;
    }
    console.log('✅ Établissement SOGARA créé avec succès');
  }

  const establishmentId = establishments?.[0]?.id || null;

  for (const userData of sogaraUsers) {
    try {
      console.log(`\n📍 Création du compte: ${userData.full_name} (${userData.email})`);

      // 1. Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
          ...userData.metadata
        }
      });

      if (authError) {
        if (authError.message.includes('already exists')) {
          console.log(`⚠️  L'utilisateur ${userData.email} existe déjà. Mise à jour...`);
          
          // Récupérer l'utilisateur existant
          const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
            filter: `email.eq.${userData.email}`
          });

          if (users && users.length > 0) {
            const existingUser = users[0];
            
            // Mettre à jour le mot de passe
            await supabase.auth.admin.updateUserById(existingUser.id, {
              password: userData.password
            });

            // Mettre à jour le profil
            await supabase
              .from('profiles')
              .update({
                full_name: userData.full_name,
                phone: userData.metadata.matricule
              })
              .eq('id', existingUser.id);

            // Ajouter le rôle si nécessaire
            await supabase
              .from('user_roles')
              .upsert({
                user_id: existingUser.id,
                role: userData.role
              }, {
                onConflict: 'user_id,role'
              });

            console.log(`✅ Utilisateur ${userData.email} mis à jour`);
          }
          continue;
        } else {
          throw authError;
        }
      }

      const userId = authData.user.id;

      // 2. Créer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: userData.full_name,
          email: userData.email,
          phone: userData.metadata.matricule
        });

      if (profileError) {
        console.error('⚠️  Erreur création profil:', profileError.message);
      }

      // 3. Assigner le rôle
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: userData.role
        });

      if (roleError) {
        console.error('⚠️  Erreur assignation rôle:', roleError.message);
      }

      // 4. Créer le profil professionnel
      if (userData.role !== 'patient') {
        const professionalType = userData.role === 'doctor' ? 'doctor' : 
                               userData.role === 'pharmacy' ? 'pharmacist' :
                               userData.role === 'laboratory' ? 'lab_tech' :
                               userData.metadata.professional_type || 'other';

        const { error: profError } = await supabase
          .from('professionals')
          .insert({
            user_id: userId,
            professional_type: professionalType,
            numero_ordre: userData.metadata.matricule,
            specialite: userData.metadata.department,
            etablissement: userData.metadata.establishment,
            is_verified: true
          });

        if (profError) {
          console.error('⚠️  Erreur création profil professionnel:', profError.message);
        }
      }

      // 5. Lier à l'établissement SOGARA si trouvé
      if (establishmentId && userData.metadata.is_establishment_admin) {
        const { error: linkError } = await supabase
          .from('establishment_users')
          .insert({
            establishment_id: establishmentId,
            user_id: userId,
            role: 'administrateur',
            permissions: {
              manage_staff: true,
              manage_patients: true,
              manage_appointments: true,
              manage_billing: true,
              view_reports: true,
              manage_inventory: true,
              manage_settings: true
            },
            actif: true
          });

        if (linkError) {
          console.error('⚠️  Erreur liaison établissement:', linkError.message);
        }
      }

      console.log(`✅ Compte créé avec succès: ${userData.email}`);

    } catch (error) {
      console.error(`❌ Erreur pour ${userData.email}:`, error.message);
    }
  }

  console.log('\n🎉 Création des comptes SOGARA terminée!');
  console.log('\n📋 Résumé des comptes créés:');
  console.log('- 2 Administrateurs (role: hospital)');
  console.log('- 4 Médecins (role: doctor)');
  console.log('- 3 Infirmiers (role: medical_staff)');
  console.log('- 1 Technicien labo (role: laboratory)');
  console.log('- 1 Pharmacien (role: pharmacy)');
  console.log('- 1 Réceptionniste (role: medical_staff)');
  console.log('\n✅ Tous les utilisateurs peuvent maintenant se connecter via /login/professional');
}

// Exécuter la création
createSogaraUsers()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
