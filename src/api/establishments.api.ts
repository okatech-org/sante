import { supabase } from '@/integrations/supabase/client';
import { Establishment, EstablishmentFormData } from '@/types/establishment';

/**
 * API pour la gestion des établissements de santé
 * Mappe les données de la table Supabase vers le format frontend
 */

// Mapping des types entre DB et frontend
const mapTypeToCategory = (type: string): any => {
  const mapping: Record<string, any> = {
    'clinique': 'prive',
    'chu': 'universitaire',
    'chr': 'regional',
    'chd': 'departemental',
    'centre_medical': 'centre_sante',
    'pharmacie': 'pharmacie',
    'laboratoire': 'laboratoire',
    'cabinet': 'prive',
  };
  return mapping[type] || 'prive';
};

const mapSecteurToLevel = (secteur: string): any => {
  const mapping: Record<string, any> = {
    'public': 'national',
    'prive': 'local',
    'parapublic': 'provincial',
  };
  return mapping[secteur] || 'local';
};

// Mapper les données DB vers le format frontend
const mapDbToEstablishment = (dbRow: any): Establishment => {
  return {
    id: dbRow.id,
    code: dbRow.numero_rccm || dbRow.id,
    name: dbRow.raison_sociale,
    fullName: dbRow.raison_sociale,
    category: mapTypeToCategory(dbRow.type_etablissement),
    level: mapSecteurToLevel(dbRow.secteur),
    status: dbRow.statut === 'actif' ? 'operationnel' : 
            dbRow.statut === 'inactif' ? 'inactive' : 
            'maintenance',
    
    // Organisation
    parentId: undefined,
    managingAuthority: dbRow.secteur === 'public' ? 'Ministère de la Santé' : 'Privé',
    director: dbRow.directeur_general_nom,
    directorContact: dbRow.directeur_general_telephone,
    
    // Localisation
    location: {
      address: dbRow.adresse_rue || '',
      city: dbRow.ville || '',
      province: dbRow.province || '',
      postalCode: dbRow.code_postal,
      coordinates: dbRow.latitude && dbRow.longitude ? {
        latitude: parseFloat(dbRow.latitude),
        longitude: parseFloat(dbRow.longitude),
      } : undefined,
      accessInfo: dbRow.repere_geographique,
      publicTransport: [],
      parkingSpaces: 0,
    },
    
    // Contact
    contact: {
      phoneMain: dbRow.telephone_standard || '',
      phoneEmergency: dbRow.telephone_urgences,
      phoneAdmin: dbRow.directeur_general_telephone,
      email: dbRow.email || '',
      emailAdmin: dbRow.directeur_general_email,
      website: dbRow.site_web,
      socialMedia: {
        facebook: dbRow.whatsapp_business,
      },
    },
    
    // Capacités
    metrics: {
      totalBeds: dbRow.nombre_lits_total || 0,
      occupiedBeds: Math.round((dbRow.nombre_lits_total || 0) * (dbRow.taux_occupation || 0) / 100),
      occupancyRate: dbRow.taux_occupation || 0,
      consultationsMonthly: 0,
      surgeriesMonthly: 0,
      emergenciesMonthly: 0,
      patientSatisfaction: dbRow.satisfaction_moyenne || 0,
      averageWaitTime: '30 min',
      averageStayDuration: '3 jours',
    },
    
    staff: {
      doctors: 0,
      specialists: 0,
      nurses: 0,
      technicians: 0,
      administrative: 0,
      support: 0,
      total: 0,
    },
    
    services: [],
    equipment: [],
    
    // Certifications
    certifications: [],
    insuranceAccepted: dbRow.cnamgs_conventionne ? ['CNAMGS'] : [],
    
    // Métadonnées
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
    lastInspection: undefined,
    nextInspection: undefined,
    
    // Flags
    isPublic: dbRow.secteur === 'public',
    isEmergencyCenter: dbRow.service_urgences_actif || false,
    isReferralCenter: false,
    isTeachingHospital: dbRow.type_etablissement === 'chu',
    hasAmbulance: false,
    hasPharmacy: false,
    hasLaboratory: false,
    hasMortuary: false,
    
    // Relations
    partnerships: [],
    referralFrom: [],
    referralTo: [],
    
    // Photos
    logoUrl: '/placeholder.svg',
    photos: [],
    
    // Notes
    notes: '',
    alerts: [],
  };
};

export const establishmentsAPI = {
  /**
   * Récupérer tous les établissements
   */
  async getAll(): Promise<Establishment[]> {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .order('raison_sociale');
    
    if (error) throw error;
    return (data || []).map(mapDbToEstablishment);
  },

  /**
   * Récupérer un établissement par ID
   */
  async getById(id: string): Promise<Establishment> {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return mapDbToEstablishment(data);
  },

  /**
   * Créer un nouvel établissement
   */
  async create(formData: EstablishmentFormData): Promise<Establishment> {
    const dbData = {
      raison_sociale: formData.name,
      numero_autorisation: `AUTH-${Date.now()}`,
      type_etablissement: formData.category === 'prive' ? 'clinique' : 'centre_medical',
      secteur: formData.isPublic ? 'public' : 'prive',
      forme_juridique: 'SARL',
      directeur_general_nom: formData.director,
      directeur_general_telephone: formData.phoneMain,
      directeur_general_email: formData.email,
      adresse_rue: formData.address,
      ville: formData.city,
      province: formData.province,
      code_postal: formData.postalCode,
      latitude: formData.latitude,
      longitude: formData.longitude,
      telephone_standard: formData.phoneMain,
      telephone_urgences: formData.phoneEmergency,
      email: formData.email,
      site_web: formData.website,
      nombre_lits_total: formData.totalBeds,
      service_urgences_actif: formData.isEmergencyCenter,
      cnamgs_conventionne: formData.insuranceAccepted.includes('CNAMGS'),
      statut: 'actif',
      date_inscription: new Date().toISOString().split('T')[0],
    } as any;

    const { data, error } = await supabase
      .from('establishments')
      .insert([dbData])
      .select()
      .single();
    
    if (error) throw error;
    return mapDbToEstablishment(data);
  },

  /**
   * Mettre à jour un établissement
   */
  async update(id: string, formData: Partial<EstablishmentFormData>): Promise<Establishment> {
    const dbData: any = {};
    
    if (formData.name) dbData.raison_sociale = formData.name;
    if (formData.director) dbData.directeur_general_nom = formData.director;
    if (formData.phoneMain) {
      dbData.telephone_standard = formData.phoneMain;
      dbData.directeur_general_telephone = formData.phoneMain;
    }
    if (formData.email) {
      dbData.email = formData.email;
      dbData.directeur_general_email = formData.email;
    }
    if (formData.address) dbData.adresse_rue = formData.address;
    if (formData.city) dbData.ville = formData.city;
    if (formData.province) dbData.province = formData.province;
    if (formData.latitude) dbData.latitude = formData.latitude;
    if (formData.longitude) dbData.longitude = formData.longitude;
    if (formData.totalBeds !== undefined) dbData.nombre_lits_total = formData.totalBeds;
    if (formData.isEmergencyCenter !== undefined) dbData.service_urgences_actif = formData.isEmergencyCenter;

    const { data, error } = await supabase
      .from('establishments')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapDbToEstablishment(data);
  },

  /**
   * Supprimer un établissement
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('establishments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
};
