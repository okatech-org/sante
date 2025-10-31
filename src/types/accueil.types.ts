// Types pour le module Accueil Hospitalier

// ============= Types Communs =============

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  telephone: string;
  email?: string;
  numeroAssureCNAMGS?: string;
  photo?: string;
  adresse?: string;
  groupeSanguin?: string;
  allergies?: string[];
  antecedents?: string[];
}

export interface DroitsCNAMGS {
  statutAssure: 'actif' | 'suspendu' | 'inactif';
  fond: 'public' | 'prive' | 'gef' | 'femme_enceinte';
  plafondAnnuel: number;
  consomme: number;
  tauxPriseEnCharge: 80 | 90 | 100;
  droitsSpeciaux?: {
    maternite?: boolean;
    ald?: boolean;
  };
  dateVerification?: string;
}

export interface CalculResteCharge {
  tarifConventionne: number;
  tarifPratique: number;
  priseEnChargeAssurance: number;
  ticketModerateur: number;
  gap: number;
  resteACharge: number;
  detailCalcul?: string;
}

// ============= Types Hôpital du Jour (HDJ) =============

export type StatutRDV = 'confirme' | 'arrive' | 'en_consultation' | 'termine' | 'annule';

export interface RendezVous {
  id: string;
  patient: Patient;
  dateHeure: string;
  service: string;
  medecin: {
    id: string;
    nom: string;
    prenom: string;
    specialite: string;
  };
  motif: string;
  statut: StatutRDV;
  notes?: string;
  heureArrivee?: string;
  numeroDossier?: string;
  droitsCNAMGS?: DroitsCNAMGS;
  resteACharge?: CalculResteCharge;
}

export interface DossierAccueilHDJ {
  id: string;
  numeroDossier: string; // Format: HDJ-YYYYMMDD-XXX
  rendezVous: RendezVous;
  patient: Patient;
  heureArrivee: string;
  droitsVerifies?: DroitsCNAMGS;
  resteACharge?: CalculResteCharge;
  serviceDestination: string;
  statutFileAttente: 'en_attente' | 'appele' | 'en_consultation' | 'termine';
  tempsAttenteEstime?: number; // En minutes
  ficheAccueil?: string; // URL ou base64 du PDF
  createdAt: string;
  updatedAt: string;
}

// ============= Types Urgences =============

export type NiveauGravite = 1 | 2 | 3 | 4 | 5;

export interface ConstantesVitales {
  tensionArterielle?: {
    systolique: number;
    diastolique: number;
  };
  frequenceCardiaque?: number;
  temperature?: number;
  saturationO2?: number;
  douleur?: number; // Échelle 0-10
  frequenceRespiratoire?: number;
  glycemie?: number;
}

export type StatutUrgence = 
  | 'attente_triage' 
  | 'triage' 
  | 'en_attente' 
  | 'en_consultation' 
  | 'en_examen' 
  | 'en_observation' 
  | 'sortie' 
  | 'hospitalisation';

export interface DossierUrgence {
  id: string;
  numeroDossier: string; // Format: URG-YYYYMMDD-XXX
  patient?: Patient; // Peut être incomplet au début
  patientInfo: { // Info minimales pour triage rapide
    nom: string;
    prenom?: string;
    age?: number;
    sexe: 'M' | 'F';
  };
  heureArrivee: string;
  motifConsultation: string;
  niveauGravite: NiveauGravite;
  constantesVitales?: ConstantesVitales;
  statut: StatutUrgence;
  boxId?: string;
  medecin?: {
    id: string;
    nom: string;
    prenom: string;
  };
  infirmiereTriage?: {
    id: string;
    nom: string;
  };
  enregistrementAdminComplet: boolean;
  droitsVerifies?: DroitsCNAMGS;
  resteACharge?: CalculResteCharge;
  notes: string[];
  alertes: string[];
  tempsAttente?: number; // En minutes, calculé en temps réel
  delaiMaximal?: number; // En minutes, selon niveau gravité
  createdAt: string;
  updatedAt: string;
  transitions: {
    statut: StatutUrgence;
    timestamp: string;
    userId: string;
  }[];
}

// ============= Types File d'Attente =============

export interface FileAttente {
  serviceId: string;
  serviceName: string;
  patients: {
    id: string;
    nom: string;
    prenom: string;
    heureArrivee: string;
    position: number;
    tempsAttenteEstime: number;
    priorite?: 'normal' | 'urgent' | 'prioritaire';
  }[];
  tempsAttenteMoyen: number;
  medecinActif: boolean;
}

// ============= Types Box d'Examen =============

export interface BoxExamen {
  id: string;
  numero: string;
  zone: 'reanimation' | 'soins_intensifs' | 'consultation' | 'observation';
  statut: 'libre' | 'occupe' | 'nettoyage' | 'hors_service';
  patient?: {
    id: string;
    nom: string;
    niveauGravite: NiveauGravite;
  };
  equipements?: string[];
}

// ============= Configuration Tarifs CNAMGS =============

export const TARIFS_CONVENTIONNES = {
  consultation_generale: 15000,
  consultation_specialisee: 25000,
  urgences: 20000,
  radiologie_simple: 30000,
  echographie: 35000,
  scanner: 150000,
  irm: 250000,
  analyses_base: 25000,
  analyses_complexes: 50000,
} as const;

export const TAUX_PRISE_EN_CHARGE = {
  public: 80,
  prive: 80,
  gef: 80,
  femme_enceinte: 100,
  ald: 90,
} as const;

// ============= Niveaux de Gravité Urgences =============

export const NIVEAUX_GRAVITE = {
  1: {
    label: 'Réanimation immédiate',
    couleur: 'red',
    delaiMaximal: 0,
    description: 'Détresse vitale',
    exemples: ['Arrêt cardio-respiratoire', 'Détresse respiratoire sévère', 'Choc hémorragique', 'Coma']
  },
  2: {
    label: 'Très urgent',
    couleur: 'orange',
    delaiMaximal: 10,
    description: 'Prise en charge < 10 min',
    exemples: ['Douleur thoracique', 'AVC suspecté', 'Convulsions', 'Trauma sévère']
  },
  3: {
    label: 'Urgent',
    couleur: 'yellow',
    delaiMaximal: 60,
    description: 'Prise en charge < 60 min',
    exemples: ['Douleur abdominale intense', 'Fièvre élevée', 'Plaie profonde', 'Fracture']
  },
  4: {
    label: 'Peu urgent',
    couleur: 'green',
    delaiMaximal: 120,
    description: 'Prise en charge < 2h',
    exemples: ['Fièvre modérée', 'Douleurs modérées', 'Plaies mineures', 'Entorse']
  },
  5: {
    label: 'Non urgent',
    couleur: 'blue',
    delaiMaximal: 240,
    description: 'Peut attendre ou réorientation',
    exemples: ['Symptômes chroniques', 'Certificats médicaux', 'Demandes administratives']
  }
} as const;

// ============= Helpers =============

export const getColorForStatut = (statut: StatutRDV | StatutUrgence): string => {
  const colors = {
    confirme: 'gray',
    arrive: 'green',
    en_consultation: 'blue',
    termine: 'gray',
    annule: 'red',
    attente_triage: 'orange',
    triage: 'yellow',
    en_attente: 'yellow',
    en_examen: 'blue',
    en_observation: 'purple',
    sortie: 'green',
    hospitalisation: 'red',
  };
  return colors[statut] || 'gray';
};

export const formatNumeroDossier = (type: 'HDJ' | 'URG', date: Date, sequence: number): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const seq = String(sequence).padStart(3, '0');
  return `${type}-${year}${month}${day}-${seq}`;
};

export const calculateAge = (dateNaissance: string): number => {
  const birth = new Date(dateNaissance);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
