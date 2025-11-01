// Types pour le module Accueil Hospitalisation

export interface Chambre {
  id: string;
  numero: string;
  etage: number;
  service: string;
  categorie: 'standard' | 'superieure' | 'vip' | 'suite';
  nombreLits: 1 | 2;
  statut: 'libre' | 'occupee' | 'nettoyage' | 'maintenance' | 'reservee';
  equipements: string[];
  tarifJournalier: number;
  patient?: {
    id: string;
    nom: string;
    prenom: string;
    dateAdmission: string;
    dateSortiePrevue?: string;
    medecin: string;
    assurance: boolean;
  };
  prochaineDisponibilite?: string;
}

export interface DossierHospitalisation {
  id: string;
  numeroAdmission: string; // HOS-YYYYMMDD-XXX
  patientId: string;
  patientInfo: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    sexe: 'M' | 'F';
    telephone: string;
    numeroAssure?: string;
    contactUrgence: {
      nom: string;
      telephone: string;
      lien: string;
    };
  };
  origine: 'hdj' | 'urgences' | 'programmee' | 'transfert';
  dateAdmission: string;
  dateSortiePrevue?: string;
  chambreId?: string;
  service: string;
  medecinTraitant: {
    id: string;
    nom: string;
    specialite: string;
  };
  diagnostic?: string;
  motifAdmission: string;
  assurance: {
    type: 'CNAMGS' | 'CNSS' | 'privee' | 'aucune';
    numeroAssure?: string;
    plafondRestant?: number;
    priseEnCharge?: number;
    statut: 'verifiee' | 'en_attente' | 'rejetee';
  };
  frais: {
    estimationSejour: number;
    acompteVerse: number;
    resteAPayer: number;
    factures: Array<{
      id: string;
      date: string;
      montant: number;
      description: string;
      payee: boolean;
    }>;
  };
  documents: Array<{
    type: 'consentement' | 'decharge' | 'identite' | 'assurance' | 'autre';
    nom: string;
    statut: 'fourni' | 'en_attente' | 'non_requis';
    url?: string;
  }>;
  statut: 'pre_admission' | 'admis' | 'en_cours' | 'sortie_prevue' | 'sorti';
  notes: string[];
  historique: Array<{
    date: string;
    action: string;
    utilisateur: string;
  }>;
}

export interface StatistiquesHospitalisation {
  chambresTotal: number;
  chambresOccupees: number;
  chambresLibres: number;
  chambresNettoyage: number;
  chambresMaintenance: number;
  tauxOccupation: number;
  admissionsJour: number;
  sortiesPrevues: number;
  dureeSejourMoyenne: number;
  patientsParService: Record<string, number>;
  revenus: {
    jour: number;
    mois: number;
  };
}

export interface ServiceHospitalier {
  id: string;
  nom: string;
  code: string;
  etage: number;
  responsable: string;
  capaciteLits: number;
  litsOccupes: number;
  specialites: string[];
}

export interface TransfertInterne {
  id: string;
  patientId: string;
  patientNom: string;
  deService: string;
  deChambre: string;
  versService: string;
  versChambre?: string;
  dateTransfert: string;
  motif: string;
  statut: 'demande' | 'approuve' | 'en_cours' | 'complete' | 'annule';
  demandePar: string;
  approuvePar?: string;
}

export interface VisitePatient {
  id: string;
  patientId: string;
  chambreNumero: string;
  visiteur: {
    nom: string;
    prenom: string;
    telephone: string;
    lienPatient: string;
    pieceIdentite: string;
  };
  dateVisite: string;
  heureArrivee: string;
  heureDepart?: string;
  badgeNumero?: string;
  statut: 'en_cours' | 'terminee';
}

export interface PlanificationSortie {
  id: string;
  dossierHospitalisationId: string;
  patientNom: string;
  chambreNumero: string;
  dateSortiePrevue: string;
  heureSortiePrevue?: string;
  type: 'normale' | 'transfert' | 'deces' | 'contre_avis_medical';
  documentsSortie: {
    ordonnance: boolean;
    compteRendu: boolean;
    certificat: boolean;
    factureReglee: boolean;
  };
  transportOrganise: boolean;
  rdvSuivi?: {
    date: string;
    service: string;
    medecin: string;
  };
  statut: 'planifiee' | 'en_preparation' | 'prete' | 'completee';
}
