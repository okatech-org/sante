// ============================================
// TYPES: Rôles Pharmaceutiques - SANTE.GA
// Date: 3 novembre 2025
// Contexte: Métiers de la pharmacie au Gabon
// ============================================

export type PharmacyRoleType =
  | 'pharmacien_titulaire'
  | 'pharmacien_adjoint'
  | 'pharmacien_hospitalier'
  | 'pharmacien_industriel'
  | 'pharmacien_grossiste'
  | 'preparateur'
  | 'technicien'
  | 'aide';

export interface PharmacyRole {
  id: string;
  type: PharmacyRoleType;
  name: string;
  description: string;
  requirements: {
    formation: string;
    inscription_onpg: boolean;
    nationalite_gabonaise?: boolean;
  };
  responsibilities: string[];
  available_positions?: number;
  current_staff?: number;
  salary_range?: {
    min: number;
    max: number;
  };
}

export const PHARMACY_ROLES: Record<PharmacyRoleType, PharmacyRole> = {
  pharmacien_titulaire: {
    id: 'role-001',
    type: 'pharmacien_titulaire',
    name: 'Pharmacien(ne) Titulaire',
    description: 'Propriétaire et responsable légal d\'une officine. Responsable de toutes les activités pharmaceutiques.',
    requirements: {
      formation: 'Doctorat en Pharmacie',
      inscription_onpg: true,
      nationalite_gabonaise: true, // Particularité Gabon
    },
    responsibilities: [
      'Dispensation des médicaments',
      'Validation des ordonnances',
      'Alerte interactions médicamenteuses',
      'Conseils pharmaceutiques aux patients',
      'Gestion globale de l\'établissement',
      'Supervision du personnel',
      'Conformité réglementaire'
    ]
  },
  pharmacien_adjoint: {
    id: 'role-002',
    type: 'pharmacien_adjoint',
    name: 'Pharmacien(ne) Adjoint(e)',
    description: 'Pharmacien salarié dans une officine. Remplace le titulaire en son absence.',
    requirements: {
      formation: 'Doctorat en Pharmacie',
      inscription_onpg: true,
    },
    responsibilities: [
      'Dispensation des médicaments',
      'Validation des ordonnances',
      'Conseils pharmaceutiques',
      'Remplacement du pharmacien titulaire',
      'Gestion quotidienne de l\'officine',
      'Supervision des préparateurs'
    ]
  },
  pharmacien_hospitalier: {
    id: 'role-003',
    type: 'pharmacien_hospitalier',
    name: 'Pharmacien(ne) Hospitalier(ère)',
    description: 'Exerce dans les hôpitaux publics (CHU, CHR) ou cliniques privées. Gère la Pharmacie à Usage Intérieur (PUI).',
    requirements: {
      formation: 'Doctorat en Pharmacie',
      inscription_onpg: true,
    },
    responsibilities: [
      'Gestion de la PUI (Pharmacie à Usage Intérieur)',
      'Approvisionnement médicaments',
      'Préparations magistrales',
      'Conseil aux équipes soignantes',
      'Pharmacovigilance',
      'Gestion des stupéfiants',
      'Formation du personnel'
    ]
  },
  pharmacien_industriel: {
    id: 'role-004',
    type: 'pharmacien_industriel',
    name: 'Pharmacien(ne) Industriel(le)',
    description: 'Secteur pharmaceutique (production, contrôle qualité). Moins présent au Gabon.',
    requirements: {
      formation: 'Doctorat en Pharmacie + Spécialisation',
      inscription_onpg: true,
    },
    responsibilities: [
      'Production pharmaceutique',
      'Contrôle qualité',
      'Développement galénique',
      'Validation des process',
      'Conformité BPF (Bonnes Pratiques de Fabrication)',
      'Gestion réglementaire'
    ]
  },
  pharmacien_grossiste: {
    id: 'role-005',
    type: 'pharmacien_grossiste',
    name: 'Pharmacien(ne) Grossiste-Répartiteur',
    description: 'Travaille pour des structures comme UbiPharm Gabon. Logistique et distribution.',
    requirements: {
      formation: 'Doctorat en Pharmacie',
      inscription_onpg: true,
    },
    responsibilities: [
      'Logistique pharmaceutique',
      'Distribution aux officines',
      'Interface laboratoires-officines',
      'Gestion des stocks',
      'Respect de la chaîne du froid',
      'Traçabilité des médicaments'
    ]
  },
  preparateur: {
    id: 'role-006',
    type: 'preparateur',
    name: 'Préparateur(trice) en Pharmacie',
    description: 'Formation Bac+2 (Brevet Professionnel). Assiste le pharmacien dans les activités pharmaceutiques.',
    requirements: {
      formation: 'Bac+2 - Brevet Professionnel',
      inscription_onpg: false,
    },
    responsibilities: [
      'Assistance au pharmacien',
      'Préparation des commandes',
      'Conseil de premier niveau (sous supervision)',
      'Gestion des stocks',
      'Réception des livraisons',
      'Rangement et organisation',
      'Préparations simples'
    ]
  },
  technicien: {
    id: 'role-007',
    type: 'technicien',
    name: 'Technicien(ne) en Pharmacie',
    description: 'Gestion administrative de l\'officine. Comptabilité, tiers-payant CNAMGS, secrétariat.',
    requirements: {
      formation: 'Bac + Formation comptabilité/gestion',
      inscription_onpg: false,
    },
    responsibilities: [
      'Gestion administrative',
      'Comptabilité de l\'officine',
      'Traitement tiers-payant CNAMGS',
      'Facturation',
      'Secrétariat',
      'Relations avec les assurances',
      'Suivi des paiements'
    ]
  },
  aide: {
    id: 'role-008',
    type: 'aide',
    name: 'Aide en Pharmacie',
    description: 'Niveau Bac. Accueil, conseil parapharmacie, rangement.',
    requirements: {
      formation: 'Niveau Bac',
      inscription_onpg: false,
    },
    responsibilities: [
      'Accueil des clients',
      'Conseil parapharmacie',
      'Rangement des rayons',
      'Nettoyage et entretien',
      'Gestion des stocks parapharmacie',
      'Mise en rayon',
      'Support logistique'
    ]
  }
};

// Helper functions
export const getPharmacyRoleLabel = (type: PharmacyRoleType): string => {
  return PHARMACY_ROLES[type]?.name || type;
};

export const getPharmacyRoleDescription = (type: PharmacyRoleType): string => {
  return PHARMACY_ROLES[type]?.description || '';
};

export const getPharmacyRoleRequirements = (type: PharmacyRoleType): PharmacyRole['requirements'] => {
  return PHARMACY_ROLES[type]?.requirements;
};

export const getPharmacyRoleResponsibilities = (type: PharmacyRoleType): string[] => {
  return PHARMACY_ROLES[type]?.responsibilities || [];
};

// Groupement des rôles par catégorie
export const PHARMACY_ROLE_CATEGORIES = {
  pharmaciens: {
    label: 'Pharmaciens',
    icon: '👨‍⚕️',
    roles: ['pharmacien_titulaire', 'pharmacien_adjoint', 'pharmacien_hospitalier', 'pharmacien_industriel', 'pharmacien_grossiste'] as PharmacyRoleType[]
  },
  personnel_technique: {
    label: 'Personnel Technique',
    icon: '🔬',
    roles: ['preparateur'] as PharmacyRoleType[]
  },
  personnel_administratif: {
    label: 'Personnel Administratif et Support',
    icon: '💼',
    roles: ['technicien', 'aide'] as PharmacyRoleType[]
  }
};

// Contexte gabonais - Défis
export const GABON_PHARMACY_CONTEXT = {
  challenges: [
    'Déserts pharmaceutiques - 4 provinces sans officine privée documentée',
    'Monopole urbain - 80%+ des infrastructures à Libreville',
    'Ruptures de médicaments - Problème récurrent',
    'Dépendance importation - Pas de production locale significative'
  ],
  coverage: {
    libreville: '12+ pharmacies dont 2 ouvertes 24/7',
    port_gentil: '2 pharmacies',
    franceville: '2 pharmacies',
    oyem: '1 pharmacie',
    provinces_sans_pharmacie: ['Moyen-Ogooué', 'Ngounié', 'Nyanga', 'Ogooué-Lolo']
  }
};
