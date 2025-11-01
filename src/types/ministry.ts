// Types pour le Module Ministère de la Santé - SANTE.GA
// Date: 1er novembre 2025

export interface MinistryIdentity {
  id: string;
  type: 'institution_gouvernementale';
  nom_officiel: string;
  sigle: string;
  tutelle: string;
  status: string;
  secteur: 'public';
  niveau: 'national';
}

export interface MinistryContact {
  adresse_physique: string;
  boite_postale: string;
  telephone_principal: string;
  telephone_secretariat: string;
  email_officiel: string;
  site_web: string;
  horaires: {
    lundi_vendredi: string;
    weekend: string;
    jours_feries: string;
  };
}

export interface NationalStatistics {
  population_couverte_cnamgs: number;
  taux_couverture: string;
  etablissements_operationnels: number;
  professionnels_actifs: {
    medecins: number;
    infirmiers: number;
    pharmaciens: number;
  };
  consultations_mensuelles: number;
  teleconsultations_mensuelles: number;
}

export interface Alert {
  id: string;
  type: 'rupture_medicament' | 'equipement_panne' | 'epidemie' | 'autre';
  titre: string;
  description: string;
  province: string;
  niveau_priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
  date_signalement: string;
  status: 'active' | 'en_cours' | 'resolue';
  affected_establishments?: string[];
}

export interface ProvincialPerformance {
  province: string;
  taux_occupation_lits: number;
  delai_moyen_rdv: string;
  satisfaction_patients: number;
  etablissements_actifs: number;
  professionnels_total: number;
  population_couverte: number;
}

export interface MinistryFinances {
  budget_annuel: string;
  execution_budgetaire: number;
  arrieres_cnamgs: string;
  economies_evasan: string;
}

export interface MinistryDashboard {
  statistiques_nationales: NationalStatistics;
  alertes_prioritaires: {
    ruptures_medicaments: Alert[];
    equipements_panne: Alert[];
    epidemies_signalees: Alert[];
    evasan_hebdomadaires: number;
  };
  performance_provinces: ProvincialPerformance[];
  finances: MinistryFinances;
}

export interface NationalProgram {
  id: string;
  nom: string;
  categorie: 'maternelle_infantile' | 'lutte_maladies' | 'renforcement_systeme' | 'formation' | 'information_sanitaire';
  description: string;
  objectifs: string[];
  indicateurs: {
    nom: string;
    valeur_actuelle: number | string;
    cible: number | string;
    unite: string;
  }[];
  budget_alloue: string;
  taux_execution: number;
  responsable: string;
  provinces_ciblees: string[];
  date_debut: string;
  date_fin: string;
  status: 'planifie' | 'en_cours' | 'termine' | 'suspendu';
}

export interface HealthEstablishment {
  id: string;
  nom: string;
  type: 'chu' | 'chr' | 'chd' | 'centre_sante' | 'clinique' | 'hopital_militaire' | 'dispensaire';
  sous_type?: string;
  province: string;
  ville: string;
  adresse: string;
  telephone?: string;
  email?: string;
  secteur: 'public' | 'prive' | 'confessionnel' | 'militaire';
  status_operationnel: 'operationnel' | 'partiel' | 'en_maintenance' | 'ferme';
  capacite_lits: number;
  taux_occupation: number;
  services_disponibles: string[];
  equipements_majeurs: {
    nom: string;
    quantite: number;
    etat: 'fonctionnel' | 'en_panne' | 'en_maintenance';
  }[];
  coordonnees_gps?: {
    latitude: number;
    longitude: number;
  };
  date_derniere_inspection?: string;
  autorisation_exploitation: {
    numero: string;
    date_delivrance: string;
    date_expiration: string;
  };
}

export interface MinistryReport {
  id: string;
  titre: string;
  type: 'annuel' | 'trimestriel' | 'special' | 'evaluation_programme' | 'epidemiologique';
  categorie: string;
  description: string;
  auteur: string;
  date_publication: string;
  periode_couverte: {
    debut: string;
    fin: string;
  };
  fichier_url: string;
  fichier_taille: string;
  format: 'pdf' | 'word' | 'excel';
  tags: string[];
  telechargements: number;
  confidentialite: 'public' | 'restreint' | 'confidentiel';
}

export interface MinistryNews {
  id: string;
  titre: string;
  categorie: 'annonce' | 'campagne' | 'inauguration' | 'nomination' | 'communique' | 'alerte_sanitaire';
  contenu: string;
  resume: string;
  image_url?: string;
  date_publication: string;
  auteur: string;
  province_concernee?: string;
  urgence: boolean;
  tags: string[];
  fichiers_attaches?: {
    nom: string;
    url: string;
    type: string;
  }[];
}

export interface StrategicKPI {
  nom: string;
  categorie: 'couverture' | 'mortalite' | 'ressources_humaines' | 'infrastructures' | 'finances';
  valeur_actuelle: number | string;
  valeur_cible_2028: number | string;
  unite: string;
  progression_annuelle: string;
  status: 'en_retard' | 'conforme' | 'en_avance';
  derniere_mise_a_jour: string;
}

export enum MinistryUserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN_NATIONAL = 'admin_national',
  ADMIN_DIRECTION = 'admin_direction',
  ADMIN_PROVINCIAL = 'admin_provincial',
  VIEWER_PUBLIC = 'viewer_public'
}

export interface MinistryUser {
  id: string;
  nom_complet: string;
  email: string;
  role: MinistryUserRole;
  direction?: 'DGS' | 'DGPM' | 'DGPS' | 'Secrétariat Général' | 'Cabinet';
  province?: string;
  telephone?: string;
  photo_url?: string;
  dernier_acces: string;
  status: 'actif' | 'inactif' | 'suspendu';
}

export interface Authorization {
  id: string;
  type: 'ouverture_etablissement' | 'exercice_professionnel' | 'importation_medicaments' | 'autre';
  demandeur: {
    nom: string;
    type: 'personne' | 'etablissement' | 'entreprise';
    email: string;
    telephone: string;
  };
  objet: string;
  description: string;
  documents_fournis: {
    nom: string;
    url: string;
    date_upload: string;
  }[];
  date_demande: string;
  date_traitement?: string;
  status: 'en_attente' | 'en_cours' | 'approuve' | 'refuse' | 'complement_info';
  responsable_traitement?: string;
  commentaire?: string;
  numero_autorisation?: string;
  date_expiration?: string;
}

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

export type GabonProvince = typeof GABON_PROVINCES[number];

export const MINISTRY_COLORS = {
  primary: '#1e40af',
  secondary: '#3b82f6',
  accent: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  neutral: '#6b7280'
} as const;

export const STRATEGIC_AXES_PNDS = [
  {
    id: 'axe1',
    nom: 'Gouvernance et Leadership',
    description: 'Renforcement de la gouvernance du secteur de la santé'
  },
  {
    id: 'axe2',
    nom: 'Offre de Soins',
    description: 'Amélioration de l\'offre de soins et des services de santé'
  },
  {
    id: 'axe3',
    nom: 'Ressources Humaines',
    description: 'Développement des ressources humaines en santé'
  },
  {
    id: 'axe4',
    nom: 'Financement de la Santé',
    description: 'Financement durable de la santé'
  },
  {
    id: 'axe5',
    nom: 'Promotion et Prévention',
    description: 'Promotion de la santé et prévention des maladies'
  }
] as const;

