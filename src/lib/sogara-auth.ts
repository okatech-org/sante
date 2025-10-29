// Comptes SOGARA pré-configurés
export const SOGARA_ACCOUNTS = [
  {
    email: "admin@sogara.com",
    password: "Admin@SOGARA2024",
    full_name: "Jean-Pierre Mbadinga",
    role: "hospital",
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
    role: "hospital",
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

// Vérifier si un compte est un compte SOGARA
export function isSogaraAccount(email: string, password: string): any {
  return SOGARA_ACCOUNTS.find(
    account => account.email === email && account.password === password
  );
}

// Créer un utilisateur mock pour SOGARA
export function createMockSogaraUser(account: any) {
  return {
    id: `sogara-${account.email.replace('@', '-').replace('.', '-')}`,
    email: account.email,
    user_metadata: {
      full_name: account.full_name,
      ...account.metadata
    },
    app_metadata: {
      provider: 'email',
      providers: ['email']
    },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    role: 'authenticated'
  };
}
