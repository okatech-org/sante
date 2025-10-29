#!/usr/bin/env node

// Script pour générer les requêtes SQL de création des comptes SOGARA
// À exécuter directement dans la console Supabase

const accounts = [
  {
    email: "admin@sogara.com",
    password: "Admin@SOGARA2024",
    full_name: "Jean-Pierre Mbadinga",
    role: "hospital",
    department: "Administration",
    matricule: "ADM-001",
    is_admin: true
  },
  {
    email: "directeur@sogara.com",
    password: "DirecteurSOGARA2024!",
    full_name: "Dr. François Obiang",
    role: "hospital",
    department: "Direction Médicale",
    matricule: "DIR-001",
    is_admin: true
  },
  {
    email: "dr.okemba@sogara.com",
    password: "Okemba@2024Med",
    full_name: "Dr. Marie Okemba",
    role: "doctor",
    department: "Médecine Générale",
    matricule: "MED-012"
  },
  {
    email: "dr.nguema@sogara.com",
    password: "Nguema@Urgence24",
    full_name: "Dr. Paul Nguema",
    role: "doctor",
    department: "Urgences",
    matricule: "MED-015"
  },
  {
    email: "dr.mbina@sogara.com",
    password: "Mbina@Cardio2024",
    full_name: "Dr. Léa Mbina",
    role: "doctor",
    department: "Cardiologie",
    matricule: "MED-018"
  },
  {
    email: "dr.mezui@sogara.com",
    password: "Mezui@Pediatrie24",
    full_name: "Dr. Thomas Mezui",
    role: "doctor",
    department: "Pédiatrie",
    matricule: "MED-022"
  },
  {
    email: "nurse.mba@sogara.com",
    password: "MbaSI@2024",
    full_name: "Sylvie Mba",
    role: "medical_staff",
    department: "Soins Intensifs",
    matricule: "INF-025",
    professional_type: "nurse"
  },
  {
    email: "nurse.nze@sogara.com",
    password: "NzeUrg@2024",
    full_name: "Patricia Nze",
    role: "medical_staff",
    department: "Urgences",
    matricule: "INF-028",
    professional_type: "nurse"
  },
  {
    email: "nurse.andeme@sogara.com",
    password: "Andeme@Mat2024",
    full_name: "Claire Andeme",
    role: "medical_staff",
    department: "Maternité",
    matricule: "INF-030",
    professional_type: "nurse"
  },
  {
    email: "lab.tech@sogara.com",
    password: "LabSOGARA@2024",
    full_name: "André Moussavou",
    role: "laboratory",
    department: "Laboratoire",
    matricule: "LAB-008"
  },
  {
    email: "pharma@sogara.com",
    password: "PharmaSOGARA@24",
    full_name: "Dr. Lydie Kombila",
    role: "pharmacy",
    department: "Pharmacie",
    matricule: "PHAR-004"
  },
  {
    email: "accueil@sogara.com",
    password: "AccueilSOGARA@24",
    full_name: "Nadège Oyono",
    role: "medical_staff",
    department: "Accueil",
    matricule: "REC-002",
    professional_type: "receptionist"
  }
];

console.log('\n🏥 INSTRUCTIONS POUR CRÉER LES COMPTES CMST SOGARA');
console.log('═'.repeat(60));
console.log('\n1. Allez sur https://app.supabase.com');
console.log('2. Connectez-vous à votre projet');
console.log('3. Allez dans "Authentication" > "Users"');
console.log('4. Pour CHAQUE compte ci-dessous:');
console.log('   - Cliquez sur "Add user" > "Create new user"');
console.log('   - Remplissez les informations');
console.log('   - Cochez "Auto Confirm User"');
console.log('\n═'.repeat(60));

console.log('\n📋 COMPTES À CRÉER:\n');

// Afficher les comptes par catégorie
console.log('👮 ADMINISTRATEURS:');
console.log('─'.repeat(40));
accounts.filter(a => a.is_admin).forEach((acc, i) => {
  console.log(`\n${i+1}. ${acc.full_name}`);
  console.log(`   📧 Email: ${acc.email}`);
  console.log(`   🔑 Password: ${acc.password}`);
  console.log(`   🏢 Département: ${acc.department}`);
  console.log(`   📌 Matricule: ${acc.matricule}`);
});

console.log('\n\n👨‍⚕️ MÉDECINS:');
console.log('─'.repeat(40));
accounts.filter(a => a.role === 'doctor').forEach((acc, i) => {
  console.log(`\n${i+1}. ${acc.full_name}`);
  console.log(`   📧 Email: ${acc.email}`);
  console.log(`   🔑 Password: ${acc.password}`);
  console.log(`   🏢 Département: ${acc.department}`);
  console.log(`   📌 Matricule: ${acc.matricule}`);
});

console.log('\n\n👩‍⚕️ PERSONNEL MÉDICAL:');
console.log('─'.repeat(40));
accounts.filter(a => a.role === 'medical_staff').forEach((acc, i) => {
  console.log(`\n${i+1}. ${acc.full_name}`);
  console.log(`   📧 Email: ${acc.email}`);
  console.log(`   🔑 Password: ${acc.password}`);
  console.log(`   🏢 Département: ${acc.department}`);
  console.log(`   📌 Matricule: ${acc.matricule}`);
});

console.log('\n\n🔬 LABORATOIRE & PHARMACIE:');
console.log('─'.repeat(40));
accounts.filter(a => ['laboratory', 'pharmacy'].includes(a.role)).forEach((acc, i) => {
  console.log(`\n${i+1}. ${acc.full_name}`);
  console.log(`   📧 Email: ${acc.email}`);
  console.log(`   🔑 Password: ${acc.password}`);
  console.log(`   🏢 Département: ${acc.department}`);
  console.log(`   📌 Matricule: ${acc.matricule}`);
});

console.log('\n\n═'.repeat(60));
console.log('\n5. Après avoir créé les comptes, exécutez ce SQL dans SQL Editor:\n');

// Générer le SQL pour les profils et rôles
console.log('-- SQL pour configurer les profils et rôles');
console.log('-- À exécuter après création des comptes dans Supabase\n');

accounts.forEach(acc => {
  console.log(`-- Configuration pour ${acc.full_name}`);
  console.log(`DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Récupérer l'ID de l'utilisateur
  SELECT id INTO v_user_id FROM auth.users WHERE email = '${acc.email}';
  
  IF v_user_id IS NOT NULL THEN
    -- Créer/Mettre à jour le profil
    INSERT INTO public.profiles (id, full_name, email, phone)
    VALUES (v_user_id, '${acc.full_name}', '${acc.email}', '${acc.matricule}')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;
    
    -- Assigner le rôle
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, '${acc.role}')
    ON CONFLICT DO NOTHING;
    
    ${acc.role !== 'patient' ? `-- Créer le profil professionnel
    INSERT INTO public.professionals (user_id, professional_type, numero_ordre, specialite, etablissement, is_verified)
    VALUES (v_user_id, '${acc.professional_type || (acc.role === 'doctor' ? 'doctor' : acc.role === 'pharmacy' ? 'pharmacist' : acc.role === 'laboratory' ? 'lab_tech' : 'other')}', '${acc.matricule}', '${acc.department}', 'CMST SOGARA', true)
    ON CONFLICT (user_id) DO UPDATE SET professional_type = EXCLUDED.professional_type, numero_ordre = EXCLUDED.numero_ordre;` : ''}
    
    RAISE NOTICE 'Utilisateur ${acc.full_name} configuré avec succès';
  ELSE
    RAISE NOTICE 'Utilisateur ${acc.email} non trouvé - Créez d''abord le compte dans Authentication';
  END IF;
END $$;\n`);
});

console.log('\n\n✅ Une fois terminé, testez la connexion sur:');
console.log('   http://localhost:8080/login/professional\n');
