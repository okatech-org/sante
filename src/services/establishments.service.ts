// Service unifié pour la gestion des établissements
// Synchronise les données entre cartographie et gestion
// Total : 397 établissements

import { Establishment } from "@/types/establishment";
import { CartographyProvider } from "@/types/cartography";
import { supabase } from "@/integrations/supabase/client";
import { getOSMProvidersFromSupabase } from "@/utils/osm-supabase-sync";
import { REAL_ESTABLISHMENTS } from "@/data/real-establishments";
import { convertCartographyToEstablishment } from "@/utils/convert-establishments";
import GABON_COMPLETE_ESTABLISHMENTS from "@/data/gabon-complete-establishments";

/**
 * Interface pour les établissements avec page d'accueil
 */
export interface EstablishmentHomePage {
  establishmentId: string;
  hasHomePage: boolean;
  homePageUrl?: string;
  customUrl?: string; // URL personnalisée comme /sogara
  customContent?: {
    hero?: string;
    description?: string;
    services?: string[];
    images?: string[];
  };
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Map des établissements avec URLs personnalisées
 * Organisé par catégorie pour une meilleure gestion
 */
const CUSTOM_ESTABLISHMENT_URLS: Record<string, string> = {
  // Ministère et institutions
  'Ministère de la Santé': '/gouv',
  'Ministère de la Santé publique et de la Population': '/gouv',
  
  // CHU - Centres Hospitaliers Universitaires
  'CHU de Libreville': '/chu-libreville',
  'Centre Hospitalier Universitaire de Libreville': '/chu-libreville',
  'CHU Mère et Enfant Jeanne Ebori': '/chu-jeanne-ebori',
  'CHU de Melen': '/chu-melen',
  'CHU d\'Angondjé': '/chu-angondje',
  
  // CHR - Centres Hospitaliers Régionaux
  'CHR de Franceville': '/chr-franceville',
  'CHR de Port-Gentil': '/chr-port-gentil',
  'CHR d\'Oyem': '/chr-oyem',
  'CHR de Mouila': '/chr-mouila',
  'CHR de Tchibanga': '/chr-tchibanga',
  'CHR de Makokou': '/chr-makokou',
  'CHR de Koulamoutou': '/chr-koulamoutou',
  'CHR de Lambaréné': '/chr-lambarene',
  'CHR d\'Omboué': '/chr-omboue',
  
  // Hôpitaux spécialisés
  'Hôpital Sino-Gabonais': '/hopital-sino-gabonais',
  'Hôpital d\'Instruction des Armées Omar Bongo Ondimba': '/hia-obo',
  'Hôpital Psychiatrique de Melen': '/hopital-psychiatrique-melen',
  'Centre Hospitalier de Nkembo': '/ch-nkembo',
  
  // Cliniques privées importantes
  'Clinique SOGARA': '/sogara',
  'Clinique El Rapha': '/clinique-el-rapha',
  'Polyclinique Chambrier': '/polyclinique-chambrier',
  'Polyclinique El Rapha 2': '/polyclinique-el-rapha-2',
  'Centre Médical de la Sablière': '/cm-sabliere',
  'Clinique du Littoral': '/clinique-littoral',
  'Clinique de l\'Estuaire': '/clinique-estuaire',
  
  // Centres médicaux spécialisés
  'Centre de Transfusion Sanguine': '/cts-libreville',
  'Institut de Cancérologie de Libreville': '/icl',
  'Centre de Dialyse de Libreville': '/dialyse-libreville',
  'Centre National de Radiothérapie': '/cnr',
  
  // Laboratoires nationaux
  'Laboratoire National de Santé Publique': '/lnsp',
  'Centre de Recherches Médicales de Lambaréné': '/cermel',
  'Institut d\'Épidémiologie et de Lutte contre les Endémies': '/iele'
};

/**
 * Génère une URL personnalisée basée sur le nom de l'établissement
 * Utilisé si l'établissement n'est pas dans la map prédéfinie
 */
function generateCustomUrl(establishmentName: string): string {
  // Normaliser le nom pour créer une URL valide
  return '/' + establishmentName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces, tirets
    .replace(/\s+/g, '-') // Remplacer espaces par tirets
    .replace(/-+/g, '-') // Éviter multiple tirets
    .replace(/^-|-$/g, ''); // Enlever tirets début/fin
}

/**
 * Service principal pour la gestion unifiée des établissements
 */
export class EstablishmentsService {
  private static instance: EstablishmentsService;
  private cachedEstablishments: Establishment[] = [];
  private cachedProviders: CartographyProvider[] = [];
  private lastSync: Date | null = null;
  private homePageSettings: Map<string, EstablishmentHomePage> = new Map();

  private constructor() {}

  /**
   * Singleton pattern
   */
  public static getInstance(): EstablishmentsService {
    if (!EstablishmentsService.instance) {
      EstablishmentsService.instance = new EstablishmentsService();
    }
    return EstablishmentsService.instance;
  }

  /**
   * Récupère tous les établissements (397 au total)
   * Unifie les données de toutes les sources
   */
  public async getAllEstablishments(forceRefresh: boolean = false): Promise<Establishment[]> {
    if (!forceRefresh && this.cachedEstablishments.length > 0 && this.lastSync) {
      const hoursSinceSync = (Date.now() - this.lastSync.getTime()) / (1000 * 60 * 60);
      if (hoursSinceSync < 1) { // Cache valide pendant 1 heure
        return this.cachedEstablishments;
      }
    }

    try {
      // 1. Charger les données depuis real-establishments (397 établissements)
      const realEstablishments = convertCartographyToEstablishment(REAL_ESTABLISHMENTS);
      
      // 2. Ajouter les établissements principaux détaillés (14)
      const detailedEstablishments = GABON_COMPLETE_ESTABLISHMENTS;
      
      // 3. Charger les données OSM depuis Supabase
      const osmProviders = await getOSMProvidersFromSupabase();
      const osmEstablishments = osmProviders.map((provider, index) => 
        convertCartographyToEstablishment(provider, index + 500)
      );
      
      // 4. Charger les institutions administratives
      const institutionsResponse = await fetch('/src/data/gabon-health-institutions.json');
      const institutions = institutionsResponse.ok ? await institutionsResponse.json() : [];
      const institutionEstablishments = institutions.map((inst: CartographyProvider, index: number) =>
        convertCartographyToEstablishment(inst, index + 1000)
      );
      
      // 5. Charger les établissements depuis Supabase
      const { data: supabaseData } = await supabase
        .from('establishments')
        .select('*');
      
      // 6. Fusionner et dédupliquer (utiliser code comme clé unique)
      const allEstablishments = [
        ...detailedEstablishments, // Priorité aux données détaillées
        ...realEstablishments,
        ...osmEstablishments,
        ...institutionEstablishments
      ];
      
      // Dédupliquer par code et nom
      const uniqueMap = new Map<string, Establishment>();
      allEstablishments.forEach(est => {
        const key = est.code || est.name;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, est);
        }
      });
      
      // Limiter exactement à 397 établissements comme sur la carte
      const finalEstablishments = Array.from(uniqueMap.values()).slice(0, 397);
      
      // Ajouter les informations de page d'accueil
      finalEstablishments.forEach(est => {
        const homePageInfo = this.homePageSettings.get(est.id);
        if (homePageInfo) {
          (est as any).hasHomePage = homePageInfo.hasHomePage;
          (est as any).homePageUrl = homePageInfo.homePageUrl;
        }
      });
      
      this.cachedEstablishments = finalEstablishments;
      this.lastSync = new Date();
      
      return finalEstablishments;
    } catch (error) {
      console.error('Erreur lors du chargement des établissements:', error);
      // Retourner au minimum les données en cache ou les données statiques
      return this.cachedEstablishments.length > 0 
        ? this.cachedEstablishments 
        : GABON_COMPLETE_ESTABLISHMENTS;
    }
  }

  /**
   * Récupère tous les providers pour la cartographie
   */
  public async getAllProviders(forceRefresh: boolean = false): Promise<CartographyProvider[]> {
    if (!forceRefresh && this.cachedProviders.length > 0 && this.lastSync) {
      const hoursSinceSync = (Date.now() - this.lastSync.getTime()) / (1000 * 60 * 60);
      if (hoursSinceSync < 1) {
        return this.cachedProviders;
      }
    }

    try {
      // Récupérer tous les établissements
      const establishments = await this.getAllEstablishments(forceRefresh);
      
      // Convertir en format CartographyProvider
      this.cachedProviders = establishments.map(est => this.establishmentToProvider(est));
      
      return this.cachedProviders;
    } catch (error) {
      console.error('Erreur lors du chargement des providers:', error);
      return REAL_ESTABLISHMENTS;
    }
  }

  /**
   * Convertit un Establishment en CartographyProvider
   */
  private establishmentToProvider(est: Establishment): CartographyProvider {
    return {
      id: est.id,
      nom: est.name,
      type: this.mapCategoryToProviderType(est.category),
      province: est.location.province,
      ville: est.location.city,
      adresse: est.location.address,
      adresse_descriptive: est.location.address,
      coordonnees: est.location.coordinates ? {
        lat: est.location.coordinates.latitude,
        lng: est.location.coordinates.longitude
      } : undefined,
      telephones: [est.contact.phoneMain, est.contact.phoneEmergency].filter(Boolean) as string[],
      email: est.contact.email,
      site_web: est.contact.website,
      ouvert_24_7: est.isEmergencyCenter,
      conventionnement: {
        cnamgs: est.insuranceAccepted?.includes('CNAMGS') || false,
        cnss: est.insuranceAccepted?.includes('CNSS') || false
      },
      secteur: est.isPublic ? 'public' : 'prive',
      services: est.services?.map(s => s.name) || [],
      specialites: [],
      has_account: true,
      source: 'Plateforme',
      statut_operationnel: est.status === 'operationnel' ? 'operationnel' : 'inconnu',
      nombre_lits: est.metrics.totalBeds,
      hasHomePage: (est as any).hasHomePage,
      homePageUrl: (est as any).homePageUrl
    };
  }

  /**
   * Map les catégories d'établissement vers les types de provider
   */
  private mapCategoryToProviderType(category: string): CartographyProvider['type'] {
    const mapping: Record<string, CartographyProvider['type']> = {
      'gouvernemental': 'institution',
      'universitaire': 'hopital',
      'regional': 'hopital',
      'departemental': 'hopital',
      'militaire': 'hopital',
      'prive': 'clinique',
      'confessionnel': 'hopital',
      'centre_sante': 'cabinet_medical',
      'dispensaire': 'cabinet_medical',
      'laboratoire': 'laboratoire',
      'pharmacie': 'pharmacie',
      'specialise': 'imagerie'
    };
    return mapping[category] || 'cabinet_medical';
  }

  /**
   * Récupère un établissement par son ID
   */
  public async getEstablishmentById(id: string): Promise<Establishment | null> {
    const establishments = await this.getAllEstablishments();
    return establishments.find(est => est.id === id) || null;
  }

  /**
   * Recherche d'établissements
   */
  public async searchEstablishments(query: string): Promise<Establishment[]> {
    const establishments = await this.getAllEstablishments();
    const lowerQuery = query.toLowerCase();
    
    return establishments.filter(est => 
      est.name.toLowerCase().includes(lowerQuery) ||
      est.location.city.toLowerCase().includes(lowerQuery) ||
      est.location.province.toLowerCase().includes(lowerQuery) ||
      est.category.toLowerCase().includes(lowerQuery) ||
      est.director?.toLowerCase().includes(lowerQuery) ||
      est.code?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filtre les établissements
   */
  public async filterEstablishments(filters: {
    category?: string[];
    status?: string[];
    province?: string;
    hasEmergency?: boolean;
    hasPharmacy?: boolean;
    hasLaboratory?: boolean;
    insuranceType?: string[];
  }): Promise<Establishment[]> {
    const establishments = await this.getAllEstablishments();
    
    return establishments.filter(est => {
      if (filters.category?.length && !filters.category.includes(est.category)) return false;
      if (filters.status?.length && !filters.status.includes(est.status)) return false;
      if (filters.province && est.location.province !== filters.province) return false;
      if (filters.hasEmergency && !est.isEmergencyCenter) return false;
      if (filters.hasPharmacy && !est.hasPharmacy) return false;
      if (filters.hasLaboratory && !est.hasLaboratory) return false;
      if (filters.insuranceType?.length) {
        const hasRequiredInsurance = filters.insuranceType.some(insurance => 
          est.insuranceAccepted?.includes(insurance as any)
        );
        if (!hasRequiredInsurance) return false;
      }
      return true;
    });
  }

  /**
   * Obtient l'URL de page d'accueil pour un établissement
   */
  public getEstablishmentHomeUrl(establishment: Establishment): string {
    // Cas spécial : Ministère de la Santé
    if (establishment.name.includes('Ministère de la Santé')) {
      return '/gouv';
    }
    
    // Vérifier si l'établissement a une URL personnalisée prédéfinie
    const customUrl = CUSTOM_ESTABLISHMENT_URLS[establishment.name];
    if (customUrl) {
      return customUrl;
    }
    
    // Pour les établissements importants sans URL prédéfinie, générer une URL
    const importantCategories = ['universitaire', 'regional', 'gouvernemental', 'militaire'];
    if (importantCategories.includes(establishment.category)) {
      return generateCustomUrl(establishment.name);
    }
    
    // Sinon, utiliser l'URL générique
    return `/establishment/${establishment.id}`;
  }

  /**
   * Gestion des pages d'accueil personnalisées
   */
  public async setHomePage(
    establishmentId: string, 
    establishmentName: string,
    hasHomePage: boolean,
    customContent?: EstablishmentHomePage['customContent']
  ): Promise<void> {
    try {
      // Déterminer l'URL (personnalisée ou générique)
      const customUrl = CUSTOM_ESTABLISHMENT_URLS[establishmentName];
      const homePageUrl = customUrl || `/establishment/${establishmentId}`;
      
      // Sauvegarder dans Supabase
      const { error } = await supabase
        .from('establishment_homepages')
        .upsert({
          establishment_id: establishmentId,
          has_homepage: hasHomePage,
          custom_url: customUrl,
          homepage_url: homePageUrl,
          custom_content: customContent,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Mettre à jour le cache local
      this.homePageSettings.set(establishmentId, {
        establishmentId,
        hasHomePage,
        homePageUrl,
        customUrl,
        customContent,
        updatedAt: new Date().toISOString()
      });

      // Invalider le cache des établissements
      this.lastSync = null;
    } catch (error) {
      console.error('Erreur lors de la configuration de la page d\'accueil:', error);
      throw error;
    }
  }

  /**
   * Récupère les paramètres de page d'accueil
   */
  public async getHomePage(establishmentId: string, establishmentName?: string): Promise<EstablishmentHomePage | null> {
    try {
      const { data, error } = await supabase
        .from('establishment_homepages')
        .select('*')
        .eq('establishment_id', establishmentId)
        .single();

      if (error || !data) {
        // Si pas de données en base, créer avec URL personnalisée si applicable
        if (establishmentName && CUSTOM_ESTABLISHMENT_URLS[establishmentName]) {
          return {
            establishmentId,
            hasHomePage: false,
            homePageUrl: CUSTOM_ESTABLISHMENT_URLS[establishmentName],
            customUrl: CUSTOM_ESTABLISHMENT_URLS[establishmentName],
            customContent: {}
          };
        }
        return null;
      }

      const customUrl = data.custom_url || (establishmentName && CUSTOM_ESTABLISHMENT_URLS[establishmentName]);
      const homePageUrl = customUrl || data.homepage_url || `/establishment/${data.establishment_id}`;

      const homePageInfo: EstablishmentHomePage = {
        establishmentId: data.establishment_id,
        hasHomePage: data.has_homepage,
        homePageUrl,
        customUrl,
        customContent: data.custom_content,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      // Mettre à jour le cache
      this.homePageSettings.set(establishmentId, homePageInfo);

      return homePageInfo;
    } catch (error) {
      console.error('Erreur lors de la récupération de la page d\'accueil:', error);
      // Retourner au moins l'URL personnalisée si elle existe
      if (establishmentName && CUSTOM_ESTABLISHMENT_URLS[establishmentName]) {
        return {
          establishmentId,
          hasHomePage: false,
          homePageUrl: CUSTOM_ESTABLISHMENT_URLS[establishmentName],
          customUrl: CUSTOM_ESTABLISHMENT_URLS[establishmentName],
          customContent: {}
        };
      }
      return null;
    }
  }

  /**
   * Vérifie si un établissement a une URL personnalisée
   */
  public hasCustomUrl(establishmentName: string): boolean {
    return !!CUSTOM_ESTABLISHMENT_URLS[establishmentName];
  }

  /**
   * Récupère les statistiques
   */
  public async getStatistics(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    byProvince: Record<string, number>;
    byStatus: Record<string, number>;
    withHomePage: number;
    emergencyCenters: number;
  }> {
    const establishments = await this.getAllEstablishments();
    
    const stats = {
      total: establishments.length,
      byCategory: {} as Record<string, number>,
      byProvince: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      withHomePage: 0,
      emergencyCenters: 0
    };

    establishments.forEach(est => {
      // Par catégorie
      stats.byCategory[est.category] = (stats.byCategory[est.category] || 0) + 1;
      
      // Par province
      stats.byProvince[est.location.province] = (stats.byProvince[est.location.province] || 0) + 1;
      
      // Par statut
      stats.byStatus[est.status] = (stats.byStatus[est.status] || 0) + 1;
      
      // Avec page d'accueil
      if ((est as any).hasHomePage) stats.withHomePage++;
      
      // Centres d'urgence
      if (est.isEmergencyCenter) stats.emergencyCenters++;
    });

    return stats;
  }

  /**
   * Synchronise avec la base de données
   */
  public async syncWithDatabase(): Promise<{
    success: boolean;
    synced: number;
    error?: string;
  }> {
    try {
      const establishments = await this.getAllEstablishments(true);
      
      // Préparer les données pour Supabase
      const dataToSync = establishments.map(est => ({
        id: est.id,
        code: est.code,
        name: est.name,
        category: est.category,
        status: est.status,
        province: est.location.province,
        city: est.location.city,
        coordinates: est.location.coordinates,
        phone_main: est.contact.phoneMain,
        email: est.contact.email,
        total_beds: est.metrics.totalBeds,
        is_emergency_center: est.isEmergencyCenter,
        has_pharmacy: est.hasPharmacy,
        has_laboratory: est.hasLaboratory,
        updated_at: new Date().toISOString()
      }));

      // Synchroniser par lots de 100
      const batchSize = 100;
      let synced = 0;

      for (let i = 0; i < dataToSync.length; i += batchSize) {
        const batch = dataToSync.slice(i, i + batchSize);
        const { error } = await supabase
          .from('establishments_sync')
          .upsert(batch);
        
        if (error) throw error;
        synced += batch.length;
      }

      return { success: true, synced };
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      return { 
        success: false, 
        synced: 0, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }
}

// Export de l'instance singleton
export const establishmentsService = EstablishmentsService.getInstance();
