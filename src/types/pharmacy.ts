// ============================================
// TYPES PHARMACIES & PROFESSIONNELS - SANTE.GA
// Date: 3 novembre 2025
// Conformité: ONPG (Ordre National des Pharmaciens du Gabon)
// ============================================

// ============================================
// TYPES DE BASE
// ============================================

export type TypeProfessionnel = 'dr_pharmacie' | 'vendeur_pharmacie';
export type TypeStructure = 'officine_privee' | 'officine_publique' | 'pharmacie_hospitaliere';
export type StatutVerification = 'en_attente' | 'verifie' | 'refuse' | 'suspendu';
export type StatutONPG = 'actif' | 'suspendu' | 'radie';
export type StatutEmploi = 'titulaire' | 'salarie' | 'remplacant' | 'stagiaire' | 'liberal';
export type TypeContrat = 'CDI' | 'CDD' | 'Remplacement' | 'Stage';
export type MotifFin = 'demission' | 'licenciement' | 'fin_contrat' | 'retraite' | 'mutation';

export type ModesPaiement = 'especes' | 'carte_bancaire' | 'mobile_money' | 'cheque';
export type ServicesDisponibles = 
  | 'garde_24h' 
  | 'livraison' 
  | 'mobile_money' 
  | 'conseil_pharmaceutique' 
  | 'tests_rapides'
  | 'depot_ordonnance'
  | 'click_and_collect';

export type JoursSemaine = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche';

// ============================================
// INTERFACES HORAIRES
// ============================================

export interface PlageHoraire {
  debut: string; // Format "HH:mm"
  fin: string;   // Format "HH:mm"
}

export interface HoraireJour {
  ouvert: boolean;
  horaires: PlageHoraire[];
}

export interface HorairesPharmacie {
  mode?: '24_7' | 'standard';
  lundi: HoraireJour;
  mardi: HoraireJour;
  mercredi: HoraireJour;
  jeudi: HoraireJour;
  vendredi: HoraireJour;
  samedi: HoraireJour;
  dimanche: HoraireJour;
}

// ============================================
// INTERFACE PHARMACIE (Établissement)
// ============================================

export interface Pharmacie {
  id: string;
  code_pharmacie: string; // Format: PHAR-001

  // Informations Établissement
  nom_commercial: string;
  enseigne?: string;
  type_structure: TypeStructure;
  numero_autorisation_ouverture?: string;
  date_autorisation?: string;

  // Inscription ONPG
  numero_inscription_onpg?: string;
  date_inscription_onpg?: string;
  statut_onpg: StatutONPG;

  // Localisation
  adresse_complete: string;
  quartier?: string;
  ville: string;
  province: string;
  code_postal?: string;
  
  // Géolocalisation
  latitude: number;
  longitude: number;
  reperes_geographiques?: string;

  // Contact
  telephone_principal: string;
  telephone_secondaire?: string;
  telephone_urgence?: string;
  email?: string;
  site_web?: string;

  // Horaires
  ouvert_24_7: boolean;
  horaires: HorairesPharmacie;
  jours_fermeture?: string[];

  // Services
  services_disponibles: ServicesDisponibles[];
  modes_paiement: ModesPaiement[];
  mobile_money_providers?: string[]; // ['airtel_money', 'moov_money']

  // Assurances
  conventionnement_cnamgs: boolean;
  numero_convention_cnamgs?: string;
  autres_assurances_acceptees?: string[];

  // Équipements
  dispose_chambre_froide: boolean;
  dispose_armoire_securisee: boolean;
  dispose_balance_electronique: boolean;

  // Capacité
  nombre_employes: number;
  surface_m2?: number;
  capacite_stockage_medicaments?: number;

  // Visibilité
  visible_plateforme: boolean;
  accepte_commandes_en_ligne: boolean;
  accepte_reservations: boolean;
  delai_preparation_moyen_minutes: number;

  // Images
  logo_url?: string;
  photos_pharmacie?: string[];

  // Statut & Validation
  statut_verification: StatutVerification;
  verifie_par_admin?: string;
  date_verification?: string;
  motif_refus?: string;

  // Pharmacien Titulaire
  pharmacien_titulaire_id?: string;
  pharmacien_titulaire?: ProfessionnelSantePharmacie;

  // Performance
  note_moyenne: number;
  nombre_avis: number;
  nombre_commandes_total: number;

  // Audit
  created_at: string;
  updated_at: string;
  created_by?: string;

  // Propriétés calculées (frontend)
  ouvert_maintenant?: boolean;
  prochaine_ouverture?: string;
  distance_km?: number;
  equipe?: ProfessionnelSantePharmacie[];
}

// ============================================
// INTERFACE PROFESSIONNEL PHARMACIE
// ============================================

export interface ProfessionnelSantePharmacie {
  id: string;
  user_id: string;
  code_professionnel: string; // Format: PHARM-001, VEND-001
  type_professionnel: TypeProfessionnel;

  // Informations Personnelles
  nom: string;
  prenom: string;
  nom_complet?: string;
  sexe?: 'M' | 'F' | 'Autre';
  date_naissance?: string;
  lieu_naissance?: string;
  nationalite: string;

  // Contact
  telephone_mobile: string;
  telephone_fixe?: string;
  email_professionnel: string;
  adresse_personnelle?: string;
  ville_residence?: string;

  // Photo
  photo_url?: string;

  // Formation Dr en Pharmacie
  diplome_pharmacie?: string;
  universite?: string;
  pays_obtention_diplome?: string;
  annee_obtention_diplome?: number;
  specialisation?: 'pharmacie_clinique' | 'pharmacie_hospitaliere' | 'biologie_medicale' | 'pharmacie_industrielle';

  // Inscription ONPG (Obligatoire Dr Pharmacie)
  numero_inscription_onpg?: string;
  date_inscription_onpg?: string;
  statut_onpg?: StatutONPG;
  numero_autorisation_exercice?: string;
  date_autorisation_exercice?: string;
  autorite_delivrance?: string;
  annees_experience?: number;

  // Documents
  copie_diplome_url?: string;
  copie_carte_onpg_url?: string;
  copie_cni_url?: string;
  extrait_casier_judiciaire_url?: string;
  certificat_nationalite_url?: string;

  // Formation Vendeur
  niveau_etude?: string;
  formation_professionnelle?: string;
  certificat_formation_url?: string;

  // Supervision (Vendeur uniquement)
  supervise_par_pharmacien_id?: string;
  supervise_par?: ProfessionnelSantePharmacie;

  // Rattachement Pharmacie
  pharmacie_principale_id?: string;
  pharmacie_principale?: Pharmacie;
  est_pharmacien_titulaire: boolean;
  pharmacies_secondaires?: Array<{ pharmacie_id: string; role: string }>;
  statut_emploi: StatutEmploi;
  date_embauche?: string;
  date_fin_contrat?: string;

  // Permissions
  permissions: string[];
  acces_gestion_stocks: boolean;
  acces_facturation: boolean;
  acces_rapports_activite: boolean;
  acces_administration: boolean;

  // Statut & Validation
  statut_verification: StatutVerification;
  verifie_par_admin?: string;
  date_verification?: string;
  motif_refus?: string;
  compte_actif: boolean;
  date_desactivation?: string;
  motif_desactivation?: string;

  // Performance
  nombre_dispensations: number;
  nombre_validations_ordonnances: number;
  note_moyenne: number;
  nombre_evaluations: number;
  derniere_connexion?: string;

  // Audit
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// ============================================
// INTERFACE HISTORIQUE EMPLOI
// ============================================

export interface PharmacieEmploye {
  id: string;
  pharmacie_id: string;
  professionnel_id: string;
  type_relation: StatutEmploi;
  date_debut: string;
  date_fin?: string;
  est_actif: boolean;
  type_contrat?: TypeContrat;
  nombre_heures_semaine?: number;
  salaire_mensuel?: number;
  permissions_specifiques?: string[];
  motif_fin?: MotifFin;
  commentaire?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// FORMULAIRES D'INSCRIPTION
// ============================================

export interface InscriptionPharmacienFormData {
  // Compte
  email: string;
  password: string;
  password_confirmation: string;

  // Informations Personnelles
  nom: string;
  prenom: string;
  sexe?: 'M' | 'F';
  date_naissance?: string;
  nationalite: string; // OBLIGATOIRE Gabonaise
  telephone_mobile: string;

  // Formation
  diplome_pharmacie: string;
  universite: string;
  annee_obtention_diplome: number;

  // ONPG (OBLIGATOIRE)
  numero_inscription_onpg: string;
  date_inscription_onpg: string;

  // Expérience
  annees_experience?: number;

  // Pharmacie (optionnel)
  pharmacie_id?: string;
  est_pharmacien_titulaire?: boolean;
  statut_emploi?: StatutEmploi;
}

export interface InscriptionVendeurFormData {
  // Compte
  email: string;
  password: string;
  password_confirmation: string;

  // Informations Personnelles
  nom: string;
  prenom: string;
  sexe?: 'M' | 'F';
  date_naissance?: string;
  nationalite?: string;
  telephone_mobile: string;

  // Formation
  niveau_etude?: string;
  formation_professionnelle?: string;

  // Rattachement (OBLIGATOIRE)
  pharmacie_id: string;
  supervise_par_pharmacien_id: string;
  statut_emploi: StatutEmploi;
}

export interface InscriptionPharmacieFormData {
  // Informations Établissement
  nom_commercial: string;
  type_structure: TypeStructure;

  // Autorisation
  numero_autorisation_ouverture?: string;
  date_autorisation?: string;
  numero_inscription_onpg?: string;

  // Localisation
  adresse_complete: string;
  quartier?: string;
  ville: string;
  province: string;
  latitude: number;
  longitude: number;
  reperes_geographiques?: string;

  // Contact
  telephone_principal: string;
  email?: string;

  // Horaires
  ouvert_24_7: boolean;
  horaires: HorairesPharmacie;

  // Services
  services_disponibles: ServicesDisponibles[];
  modes_paiement: ModesPaiement[];
  mobile_money_providers?: string[];

  // Conventionnement
  conventionnement_cnamgs: boolean;
  numero_convention_cnamgs?: string;

  // Équipements
  dispose_chambre_froide: boolean;
  dispose_armoire_securisee: boolean;

  // Visibilité
  visible_plateforme: boolean;
  accepte_commandes_en_ligne: boolean;
  accepte_reservations: boolean;
  delai_preparation_moyen_minutes: number;

  // Pharmacien Titulaire
  pharmacien_titulaire_id: string;
}

// ============================================
// FILTRES & RECHERCHE
// ============================================

export interface PharmacieSearchFilters {
  // Géolocalisation
  latitude?: number;
  longitude?: number;
  rayon_km?: number;

  // Recherche textuelle
  search?: string;
  ville?: string;
  province?: string;
  quartier?: string;

  // Filtres
  ouvert_maintenant?: boolean;
  ouvert_24_7?: boolean;
  conventionnement_cnamgs?: boolean;
  accepte_commandes_en_ligne?: boolean;
  services_disponibles?: ServicesDisponibles[];
  modes_paiement?: ModesPaiement[];

  // Pagination
  page?: number;
  limit?: number;
}

export interface PharmacieSearchResult {
  results: Pharmacie[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  filtres_appliques: PharmacieSearchFilters;
  statistiques?: {
    total_pharmacies_province?: number;
    pharmacies_24_7?: number;
    pharmacies_cnamgs?: number;
  };
}

// ============================================
// STATISTIQUES
// ============================================

export interface PharmacieStats {
  pharmacie_id: string;
  periode: string; // Format: YYYY-MM

  commandes: {
    total: number;
    completees: number;
    annulees: number;
    taux_completion: number;
    valeur_totale_fcfa: number;
    panier_moyen_fcfa: number;
  };

  ordonnances: {
    total_dispensees: number;
    ordonnances_cnamgs: number;
    ordonnances_privees: number;
    medicaments_dispenses: number;
  };

  stocks: {
    ruptures_declarees: number;
    alertes_stock_bas: number;
    taux_disponibilite: number;
  };

  clients: {
    nouveaux: number;
    recurrents: number;
    taux_fidelisation: number;
  };

  performance: {
    delai_preparation_moyen_minutes: number;
    note_satisfaction: number;
    nombre_avis_periode: number;
  };
}

// ============================================
// PERMISSIONS PHARMACIE
// ============================================

export type PermissionPharmacie = 
  // Pharmacie
  | 'pharmacie:read'
  | 'pharmacie:update'
  | 'pharmacie:manage_settings'
  // Stock
  | 'stock:read'
  | 'stock:create'
  | 'stock:update'
  | 'stock:delete'
  | 'stock:declare_rupture'
  // Ordonnances
  | 'ordonnances:read'
  | 'ordonnances:validate'
  | 'ordonnances:dispense'
  | 'ordonnances:reject'
  // Employés
  | 'employes:read'
  | 'employes:create'
  | 'employes:update'
  | 'employes:delete'
  | 'employes:manage_permissions'
  // Rapports
  | 'rapports:read'
  | 'rapports:export'
  // Facturation
  | 'facturation:read'
  | 'facturation:create'
  | 'facturation:update'
  | 'facturation:cnamgs_submit'
  // Patients
  | 'patients:read'
  // Settings
  | 'settings:manage';

export interface RolePermissions {
  dr_pharmacie_titulaire: PermissionPharmacie[];
  dr_pharmacie_salarie: PermissionPharmacie[];
  vendeur_pharmacie: PermissionPharmacie[];
}

// ============================================
// CONSTANTES
// ============================================

export const PROVINCES_GABON = [
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

export const VILLES_PRINCIPALES = [
  'Libreville',
  'Port-Gentil',
  'Franceville',
  'Oyem',
  'Moanda',
  'Mouila',
  'Lambaréné',
  'Tchibanga',
  'Koulamoutou',
  'Makokou'
] as const;

// Mapping des permissions par rôle
export const PERMISSIONS_PAR_ROLE: RolePermissions = {
  dr_pharmacie_titulaire: [
    'pharmacie:read',
    'pharmacie:update',
    'pharmacie:manage_settings',
    'stock:read',
    'stock:create',
    'stock:update',
    'stock:delete',
    'stock:declare_rupture',
    'ordonnances:read',
    'ordonnances:validate',
    'ordonnances:dispense',
    'ordonnances:reject',
    'employes:read',
    'employes:create',
    'employes:update',
    'employes:delete',
    'employes:manage_permissions',
    'rapports:read',
    'rapports:export',
    'facturation:read',
    'facturation:create',
    'facturation:update',
    'facturation:cnamgs_submit',
    'patients:read',
    'settings:manage'
  ],
  
  dr_pharmacie_salarie: [
    'pharmacie:read',
    'stock:read',
    'stock:update',
    'stock:declare_rupture',
    'ordonnances:read',
    'ordonnances:validate',
    'ordonnances:dispense',
    'rapports:read',
    'facturation:read',
    'facturation:create',
    'patients:read'
  ],
  
  vendeur_pharmacie: [
    'pharmacie:read',
    'stock:read',
    'ordonnances:read',
    'ordonnances:dispense',
    'facturation:read',
    'facturation:create',
    'patients:read'
  ]
};

// ============================================
// VALIDATION
// ============================================

export const validatePharmacieForm = (data: Partial<InscriptionPharmacieFormData>) => {
  const errors: Record<string, string> = {};

  if (!data.nom_commercial?.trim()) errors.nom_commercial = 'Le nom commercial est requis';
  if (!data.type_structure) errors.type_structure = 'Le type de structure est requis';
  if (!data.adresse_complete?.trim()) errors.adresse_complete = 'L\'adresse est requise';
  if (!data.ville?.trim()) errors.ville = 'La ville est requise';
  if (!data.province) errors.province = 'La province est requise';
  if (!data.telephone_principal?.trim()) errors.telephone_principal = 'Le téléphone est requis';
  if (data.latitude === undefined || data.latitude < -90 || data.latitude > 90) {
    errors.latitude = 'Latitude invalide';
  }
  if (data.longitude === undefined || data.longitude < -180 || data.longitude > 180) {
    errors.longitude = 'Longitude invalide';
  }
  if (!data.pharmacien_titulaire_id) errors.pharmacien_titulaire_id = 'Pharmacien titulaire requis';

  return errors;
};

export const validatePharmacienForm = (data: Partial<InscriptionPharmacienFormData>) => {
  const errors: Record<string, string> = {};

  if (!data.email?.trim()) errors.email = 'L\'email est requis';
  if (!data.password) errors.password = 'Le mot de passe est requis';
  if (data.password !== data.password_confirmation) {
    errors.password_confirmation = 'Les mots de passe ne correspondent pas';
  }
  if (!data.nom?.trim()) errors.nom = 'Le nom est requis';
  if (!data.prenom?.trim()) errors.prenom = 'Le prénom est requis';
  if (data.nationalite !== 'Gabonaise') {
    errors.nationalite = 'La nationalité gabonaise est requise pour les Dr en Pharmacie';
  }
  if (!data.numero_inscription_onpg?.trim()) {
    errors.numero_inscription_onpg = 'Le numéro ONPG est obligatoire';
  }

  return errors;
};

export const validateVendeurForm = (data: Partial<InscriptionVendeurFormData>) => {
  const errors: Record<string, string> = {};

  if (!data.email?.trim()) errors.email = 'L\'email est requis';
  if (!data.password) errors.password = 'Le mot de passe est requis';
  if (data.password !== data.password_confirmation) {
    errors.password_confirmation = 'Les mots de passe ne correspondent pas';
  }
  if (!data.nom?.trim()) errors.nom = 'Le nom est requis';
  if (!data.prenom?.trim()) errors.prenom = 'Le prénom est requis';
  if (!data.pharmacie_id) errors.pharmacie_id = 'Pharmacie requise';
  if (!data.supervise_par_pharmacien_id) {
    errors.supervise_par_pharmacien_id = 'Pharmacien superviseur requis';
  }

  return errors;
};

