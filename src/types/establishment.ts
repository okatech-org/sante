// Types pour la gestion des établissements - SANTE.GA
// Date: 1er novembre 2025

export type EstablishmentCategory = 
  | 'gouvernemental'     // Ministère, organismes publics
  | 'universitaire'      // CHU
  | 'regional'          // CHR
  | 'departemental'     // CHD
  | 'militaire'         // Hôpitaux militaires
  | 'prive'            // Cliniques privées
  | 'confessionnel'    // Établissements religieux
  | 'centre_sante'     // Centres de santé
  | 'dispensaire'      // Dispensaires
  | 'laboratoire'      // Laboratoires
  | 'pharmacie'        // Pharmacies
  | 'specialise';      // Centres spécialisés

export type EstablishmentStatus = 
  | 'operationnel'     // Pleinement opérationnel
  | 'partiel'         // Partiellement opérationnel
  | 'maintenance'     // En maintenance
  | 'construction'    // En construction
  | 'renovation'      // En rénovation
  | 'ferme'          // Fermé temporairement
  | 'inactive';      // Inactif

export type EstablishmentLevel =
  | 'national'       // Niveau national (Ministère, CHU)
  | 'regional'       // Niveau régional (CHR)
  | 'provincial'     // Niveau provincial
  | 'departemental'  // Niveau départemental (CHD)
  | 'local'         // Niveau local (centres, dispensaires)
  | 'communautaire'; // Niveau communautaire

export interface EstablishmentEquipment {
  id: string;
  name: string;
  category: 'imagerie' | 'laboratoire' | 'urgence' | 'chirurgie' | 'autre';
  quantity: number;
  functional: number;
  maintenance: number;
  broken: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
}

export interface EstablishmentService {
  id: string;
  name: string;
  category: 'consultation' | 'urgence' | 'hospitalisation' | 'chirurgie' | 'imagerie' | 'laboratoire' | 'pharmacie';
  available: boolean;
  operationalHours?: string;
  staffCount: number;
  waitTime?: string; // Temps d'attente moyen
}

export interface EstablishmentStaff {
  doctors: number;
  specialists: number;
  nurses: number;
  technicians: number;
  administrative: number;
  support: number;
  total: number;
}

export interface EstablishmentMetrics {
  totalBeds: number;
  occupiedBeds: number;
  occupancyRate: number;
  consultationsMonthly: number;
  surgeriesMonthly: number;
  emergenciesMonthly: number;
  patientSatisfaction: number; // Sur 5
  averageWaitTime: string;
  averageStayDuration: string;
}

export interface EstablishmentFinance {
  annualBudget: string;
  executionRate: number;
  cnamgsRevenue: string;
  cnssRevenue: string;
  privateRevenue: string;
  operatingCosts: string;
  investmentBudget: string;
  debtAmount?: string;
}

export interface EstablishmentCertification {
  id: string;
  type: 'autorisation' | 'accreditation' | 'certification' | 'licence';
  name: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  status: 'valide' | 'expire' | 'suspendu' | 'en_renouvellement';
  documentUrl?: string;
}

export interface EstablishmentContact {
  phoneMain: string;
  phoneEmergency?: string;
  phoneAdmin?: string;
  email: string;
  emailAdmin?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface EstablishmentLocation {
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  accessInfo?: string; // Instructions d'accès
  publicTransport?: string[];
  parkingSpaces?: number;
}

export interface Establishment {
  id: string;
  code: string; // Code unique (ex: CHU-LBV-001)
  name: string;
  fullName?: string;
  category: EstablishmentCategory;
  level: EstablishmentLevel;
  status: EstablishmentStatus;
  
  // Organisation
  parentId?: string; // Pour les structures hiérarchiques
  managingAuthority: string; // Autorité de tutelle
  director?: string;
  directorContact?: string;
  
  // Localisation
  location: EstablishmentLocation;
  
  // Contact
  contact: EstablishmentContact;
  
  // Capacités
  metrics: EstablishmentMetrics;
  staff: EstablishmentStaff;
  services: EstablishmentService[];
  equipment: EstablishmentEquipment[];
  
  // Finances
  finance?: EstablishmentFinance;
  
  // Certifications
  certifications: EstablishmentCertification[];
  insuranceAccepted: ('CNAMGS' | 'CNSS' | 'Privé')[];
  
  // Métadonnées
  createdAt: string;
  updatedAt: string;
  lastInspection?: string;
  nextInspection?: string;
  
  // Flags
  isPublic: boolean;
  isEmergencyCenter: boolean;
  isReferralCenter: boolean;
  isTeachingHospital: boolean;
  hasAmbulance: boolean;
  hasPharmacy: boolean;
  hasLaboratory: boolean;
  hasMortuary: boolean;
  
  // Relations
  partnerships?: string[];
  referralFrom?: string[]; // Établissements qui réfèrent vers celui-ci
  referralTo?: string[]; // Établissements vers lesquels on réfère
  
  // Photos
  logoUrl?: string;
  photos?: string[];
  
  // Notes
  notes?: string;
  alerts?: {
    type: 'rupture' | 'panne' | 'maintenance' | 'epidemie' | 'autre';
    message: string;
    date: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
}

export interface EstablishmentStatistics {
  totalCount: number;
  byCategory: Record<EstablishmentCategory, number>;
  byStatus: Record<EstablishmentStatus, number>;
  byProvince: Record<string, number>;
  byLevel: Record<EstablishmentLevel, number>;
  
  totalBeds: number;
  totalDoctors: number;
  totalNurses: number;
  totalStaff: number;
  
  avgOccupancyRate: number;
  avgPatientSatisfaction: number;
  totalConsultationsMonthly: number;
  totalEmergenciesMonthly: number;
}

export interface EstablishmentFilter {
  search?: string;
  category?: EstablishmentCategory[];
  status?: EstablishmentStatus[];
  level?: EstablishmentLevel[];
  province?: string[];
  city?: string[];
  hasEmergency?: boolean;
  hasPharmacy?: boolean;
  hasLaboratory?: boolean;
  insuranceAccepted?: ('CNAMGS' | 'CNSS' | 'Privé')[];
  minBeds?: number;
  maxBeds?: number;
  // Segmentation intelligente (governmental, tertiaryHospitals, ...)
  segment?: string[];
}

export interface EstablishmentFormData {
  name: string;
  fullName?: string;
  category: EstablishmentCategory;
  level: EstablishmentLevel;
  status: EstablishmentStatus;
  managingAuthority: string;
  director?: string;
  directorContact?: string;
  
  // Location
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  
  // Contact
  phoneMain: string;
  phoneEmergency?: string;
  email: string;
  website?: string;
  
  // Capacities
  totalBeds: number;
  doctors: number;
  nurses: number;
  
  // Services
  services: string[];
  
  // Insurance
  insuranceAccepted: ('CNAMGS' | 'CNSS' | 'Privé')[];
  
  // Flags
  isPublic: boolean;
  isEmergencyCenter: boolean;
  hasAmbulance: boolean;
  hasPharmacy: boolean;
  hasLaboratory: boolean;
}

// Données de segmentation intelligente avec exemples détaillés
export const ESTABLISHMENT_SEGMENTS = {
  governmental: {
    label: 'Administrations',
    icon: '🏛️',
    color: 'blue',
    priority: 1,
    description: 'Ministères et organismes publics de santé',
    examples: [
      'Ministère de la Santé',
      'Direction Générale de la Santé',
      'CNAMGS (Caisse Nationale d\'Assurance Maladie)',
      'CNSS (Caisse Nationale de Sécurité Sociale)',
      'DPML (Direction de la Pharmacie et du Médicament)',
      'ONPG (Ordre National des Pharmaciens)'
    ]
  },
  tertiaryHospitals: {
    label: 'Hôpitaux de Référence',
    icon: '🏥',
    color: 'purple',
    priority: 2,
    description: 'CHU, CHR - Soins tertiaires et quaternaires',
    examples: [
      'CHU de Libreville',
      'CHU d\'Owendo',
      'CHR de Franceville',
      'CHR d\'Oyem',
      'CHR de Port-Gentil',
      'Hôpitaux militaires de référence'
    ]
  },
  secondaryHospitals: {
    label: 'Hôpitaux Secondaires',
    icon: '🏨',
    color: 'green',
    priority: 3,
    description: 'CHD, Hôpitaux départementaux et régionaux',
    examples: [
      'CHD de Moanda',
      'CHD de Lambaréné',
      'CHD de Tchibanga',
      'Hôpitaux départementaux',
      'Hôpitaux régionaux',
      'Hôpitaux confessionnels (mission, église)'
    ]
  },
  primaryCare: {
    label: 'Soins Primaires',
    icon: '🏪',
    color: 'teal',
    priority: 4,
    description: 'Centres de santé, dispensaires, cabinets médicaux et paramédicaux',
    examples: [
      'Centres de santé intégrés',
      'Centres médicaux de quartier',
      'Dispensaires',
      'Cabinets de médecins généralistes',
      'Cabinets de pédiatres',
      'Cabinets de gynécologues',
      'Cabinets de kinésithérapeutes',
      'Cabinets de psychologues',
      'Cabinets d\'infirmiers',
      'Cabinets de sages-femmes',
      'Cabinets dentaires',
      'Cabinets d\'ophtalmologues',
      'Postes de santé communautaires'
    ]
  },
  privateClinics: {
    label: 'Cliniques Privées',
    icon: '💼',
    color: 'orange',
    priority: 5,
    description: 'Établissements privés et semi-privés',
    examples: [
      'Cliniques privées généralistes',
      'Cliniques de chirurgie',
      'Cliniques de maternité',
      'Polycliniques',
      'Centres médicaux privés',
      'Cliniques dentaires privées',
      'Centres d\'ophtalmologie privés'
    ]
  },
  specializedCenters: {
    label: 'Centres Spécialisés',
    icon: '🔬',
    color: 'pink',
    priority: 6,
    description: 'Centres spécialisés et de référence thématique',
    examples: [
      'Centre National de Transfusion Sanguine',
      'Centres de lutte contre le VIH/SIDA',
      'Centres de lutte contre la tuberculose',
      'Centres de santé mentale',
      'Centres de dialyse',
      'Centres de cancérologie',
      'Centres de rééducation',
      'Centres de drépanocytose',
      'Centres de diabétologie',
      'Centres de cardiologie',
      'Maternités spécialisées'
    ]
  },
  supportServices: {
    label: 'Services de Support',
    icon: '🏭',
    color: 'gray',
    priority: 7,
    description: 'Laboratoires, pharmacies, imagerie et services annexes',
    examples: [
      'Pharmacies d\'officine',
      'Pharmacies hospitalières',
      'Pharmacies de dépôt',
      'Laboratoires d\'analyses médicales',
      'Laboratoires de biologie médicale',
      'Centres d\'imagerie médicale',
      'Centres de radiologie',
      'Centres d\'échographie',
      'Centres de scanner',
      'Centres d\'IRM',
      'Dépôts pharmaceutiques',
      'Banques de sang'
    ]
  }
} as const;

// Provinces du Gabon
export const GABON_PROVINCES = [
  'Estuaire',
  'Haut-Ogooué',
  'Moyen-Ogooué',
  'Ngounié',
  'Nyanga',
  'Ogooué-Ivindo',
  'Ogooué-Lolo',
  'Ogooué-Maritime',
  'Woleu-Ntem'
] as const;

// Validation des formulaires
export const validateEstablishment = (data: Partial<EstablishmentFormData>) => {
  const errors: Record<string, string> = {};
  
  if (!data.name?.trim()) errors.name = 'Le nom est requis';
  if (!data.category) errors.category = 'La catégorie est requise';
  if (!data.level) errors.level = 'Le niveau est requis';
  if (!data.status) errors.status = 'Le statut est requis';
  if (!data.managingAuthority?.trim()) errors.managingAuthority = 'L\'autorité de tutelle est requise';
  
  if (!data.address?.trim()) errors.address = 'L\'adresse est requise';
  if (!data.city?.trim()) errors.city = 'La ville est requise';
  if (!data.province) errors.province = 'La province est requise';
  
  if (!data.phoneMain?.trim()) errors.phoneMain = 'Le téléphone principal est requis';
  if (!data.email?.trim()) errors.email = 'L\'email est requis';
  if (data.email && !isValidEmail(data.email)) errors.email = 'Email invalide';
  
  if (data.totalBeds !== undefined && data.totalBeds < 0) errors.totalBeds = 'Nombre de lits invalide';
  if (data.doctors !== undefined && data.doctors < 0) errors.doctors = 'Nombre de médecins invalide';
  if (data.nurses !== undefined && data.nurses < 0) errors.nurses = 'Nombre d\'infirmiers invalide';
  
  return errors;
};

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
