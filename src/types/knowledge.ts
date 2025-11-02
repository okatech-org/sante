export interface KnowledgeDocument {
  id: string;
  titre: string;
  description: string;
  categorie: "loi" | "decret" | "rapport" | "etude" | "guide" | "strategie" | "autre";
  tags: string[];
  auteur: string;
  date_publication: string;
  date_ajout: string;
  fichier_url?: string;
  fichier_type?: string;
  fichier_taille?: number;
  contenu_extrait?: string;
  metadonnees: {
    nombre_pages?: number;
    langue?: string;
    version?: string;
    statut?: "brouillon" | "validé" | "archivé";
  };
  pertinence_score?: number;
  nombre_consultations: number;
  derniere_consultation?: string;
}

export interface KnowledgeFilter {
  categorie?: string;
  tags?: string[];
  dateDebut?: string;
  dateFin?: string;
  recherche?: string;
}

export type SortOption = 
  | "date_desc" 
  | "date_asc" 
  | "pertinence" 
  | "consultations" 
  | "titre_asc" 
  | "titre_desc";

export interface ExtractedMetadata {
  titre: string;
  auteur: string;
  date: string;
  categorie: string;
  tags: string[];
  resume: string;
  mots_cles: string[];
}

