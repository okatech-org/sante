export type ProviderType = 
  | "hopital"
  | "clinique"
  | "cabinet_medical"
  | "cabinet_dentaire"
  | "pharmacie"
  | "laboratoire"
  | "imagerie"
  | "service_urgence"
  | "institution";

export type Secteur = "public" | "prive" | "parapublic" | "confessionnel" | "ong" | "militaire";
export type NiveauReference = "primaire" | "secondaire" | "tertiaire";
export type StatutOperationnel = "operationnel" | "en_cours" | "inconnu";

export interface Coordonnees {
  lat: number;
  lng: number;
}

export interface Conventionnement {
  cnamgs: boolean;
  cnss: boolean;
  mutuelles?: string[];
}

export interface CartographyProvider {
  id: string;
  type: ProviderType;
  nom: string;
  province: string;
  ville: string;
  coordonnees?: Coordonnees;
  adresse_descriptive: string;
  telephones: string[];
  email?: string;
  site_web?: string;
  horaires?: string;
  services: string[];
  specialites?: string[];
  ouvert_24_7?: boolean;
  conventionnement: Conventionnement;
  secteur: Secteur;
  equipements_specialises?: string[];
  niveau_reference?: NiveauReference;
  statut_operationnel?: StatutOperationnel;
  contact_urgence?: string;
  notes?: string;
  distance?: number; // Calculé dynamiquement
  has_account?: boolean; // Indique si l'établissement a un compte sur la plateforme
  source?: string; // Source des données (ex: 'OpenStreetMap', 'Manuel', etc.)
  osm_id?: number | string; // ID OpenStreetMap si applicable
  nombre_lits?: number; // Nombre de lits disponibles
  avatar_url?: string; // URL de l'avatar du professionnel (pour les cabinets médicaux)
}

export interface Province {
  id: string;
  nom: string;
  chef_lieu: string;
  coordonnees_centre: Coordonnees;
  population_estimee: number;
  villes_principales: Array<{
    nom: string;
    coordonnees: Coordonnees;
  }>;
}

export interface CartographyFilters {
  types: ProviderType[];
  province: string;
  ouvert24_7: boolean;
  cnamgs: boolean;
  urgent: boolean;
  proche: boolean;
  specialite: string | null;
  equipement: string | null;
  maxDistance: number | null;
  searchText: string;
}

export interface Stats {
  totalProviders: number;
  byProvince: Record<string, number>;
  byType: Record<string, number>;
  services247: number;
  imagerieLourde: number;
}
