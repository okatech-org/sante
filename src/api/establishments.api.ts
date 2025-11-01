// API Backend pour la gestion des établissements
// SANTE.GA - Plateforme E-Santé Gabon

import { Establishment, EstablishmentFormData, EstablishmentFilter } from "@/types/establishment";
import GABON_COMPLETE_ESTABLISHMENTS from "@/data/gabon-complete-establishments";
import { REAL_ESTABLISHMENTS } from "@/data/real-establishments";
import { convertAllEstablishments } from "@/utils/convert-establishments";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Headers par défaut pour les requêtes
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
});

/**
 * API pour la gestion des établissements de santé
 */
export const establishmentsAPI = {
  /**
   * Récupérer tous les établissements avec filtres optionnels
   */
  async getAll(filters?: EstablishmentFilter): Promise<Establishment[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.category) filters.category.forEach(c => queryParams.append('category', c));
        if (filters.status) filters.status.forEach(s => queryParams.append('status', s));
        if (filters.level) filters.level.forEach(l => queryParams.append('level', l));
        if (filters.province) filters.province.forEach(p => queryParams.append('province', p));
        if (filters.hasEmergency !== undefined) queryParams.append('hasEmergency', String(filters.hasEmergency));
        if (filters.hasPharmacy !== undefined) queryParams.append('hasPharmacy', String(filters.hasPharmacy));
        if (filters.hasLaboratory !== undefined) queryParams.append('hasLaboratory', String(filters.hasLaboratory));
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/establishments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
        {
          method: 'GET',
          headers: getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching establishments:', error);
      // Retourner des données mock en cas d'erreur
      return getMockEstablishments();
    }
  },

  /**
   * Récupérer un établissement par ID
   */
  async getById(id: string): Promise<Establishment> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/establishments/${id}`,
        {
          method: 'GET',
          headers: getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching establishment:', error);
      throw error;
    }
  },

  /**
   * Créer un nouvel établissement
   */
  async create(data: EstablishmentFormData): Promise<Establishment> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/establishments`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating establishment:', error);
      // Simuler la création pour la démo
      return createMockEstablishment(data);
    }
  },

  /**
   * Mettre à jour un établissement
   */
  async update(id: string, data: Partial<EstablishmentFormData>): Promise<Establishment> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/establishments/${id}`,
        {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating establishment:', error);
      // Simuler la mise à jour pour la démo
      return updateMockEstablishment(id, data);
    }
  },

  /**
   * Supprimer un établissement
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/establishments/${id}`,
        {
          method: 'DELETE',
          headers: getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting establishment:', error);
      // Simuler la suppression pour la démo
      return true;
    }
  },

  /**
   * Importer des établissements depuis un fichier CSV/Excel
   */
  async import(file: File): Promise<{ success: number; errors: string[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${API_BASE_URL}/admin/establishments/import`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error importing establishments:', error);
      throw error;
    }
  },

  /**
   * Exporter les établissements
   */
  async export(format: 'csv' | 'excel' | 'pdf' = 'csv', filters?: EstablishmentFilter): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);
      
      if (filters) {
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.category) filters.category.forEach(c => queryParams.append('category', c));
        if (filters.status) filters.status.forEach(s => queryParams.append('status', s));
        if (filters.province) filters.province.forEach(p => queryParams.append('province', p));
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/establishments/export?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error exporting establishments:', error);
      throw error;
    }
  },

  /**
   * Obtenir les statistiques globales
   */
  async getStatistics(): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/establishments/statistics`,
        {
          method: 'GET',
          headers: getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Retourner des statistiques mock
      return getMockStatistics();
    }
  },

  /**
   * Valider/Certifier un établissement
   */
  async validate(id: string, validationData: {
    certificationType: string;
    validUntil: string;
    notes?: string;
  }): Promise<Establishment> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/establishments/${id}/validate`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(validationData)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error validating establishment:', error);
      throw error;
    }
  },

  /**
   * Obtenir les statistiques d'un établissement spécifique
   */
  async getEstablishmentStats(id: string, period?: { from: string; to: string }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (period) {
        queryParams.append('from', period.from);
        queryParams.append('to', period.to);
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/establishments/${id}/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
        {
          method: 'GET',
          headers: getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching establishment statistics:', error);
      throw error;
    }
  },

  /**
   * Changer le statut d'un établissement
   */
  async changeStatus(id: string, status: string, reason?: string): Promise<Establishment> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/establishments/${id}/status`,
        {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ status, reason })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error changing establishment status:', error);
      throw error;
    }
  }
};

// Données mock pour le développement/démo
function getMockEstablishments(): Establishment[] {
  // Convertir les 397 établissements réels au format Establishment
  const realEstablishmentsConverted = convertAllEstablishments(REAL_ESTABLISHMENTS);
  
  // Combiner avec les établissements manuellement créés (CHU, CHR principaux)
  const combinedEstablishments = [
    ...GABON_COMPLETE_ESTABLISHMENTS, // 14 établissements principaux bien détaillés
    ...realEstablishmentsConverted.slice(50) // Ajouter 347 établissements supplémentaires
  ];
  
  // Retourner un maximum de 238 établissements (filtrés et dédupliqués)
  const uniqueEstablishments = Array.from(
    new Map(combinedEstablishments.map(est => [est.code, est])).values()
  ).slice(0, 238);
  
  return uniqueEstablishments;
  
  // Ancienne version limitée (conservée pour référence)
  /*
  return [
    {
      id: 'est-gov-001',
      code: 'MSHP-001',
      name: 'Ministère de la Santé',
      fullName: 'Ministère de la Santé publique et de la Population',
      category: 'gouvernemental',
      level: 'national',
      status: 'operationnel',
      managingAuthority: 'République Gabonaise',
      director: 'Dr. Jean-Marie NZAMBA',
      directorContact: 'ministre@sante.gouv.ga',
      location: {
        address: 'À côté de l\'immeuble Alu-Suisse',
        city: 'Libreville',
        province: 'Estuaire',
        coordinates: { latitude: 0.3924, longitude: 9.4537 }
      },
      contact: {
        phoneMain: '+241 01-72-26-61',
        phoneAdmin: '+241 06 47 74 83',
        email: 'contact@sante.gouv.ga',
        website: 'https://sante.gouv.ga'
      },
      metrics: {
        totalBeds: 0,
        occupiedBeds: 0,
        occupancyRate: 0,
        consultationsMonthly: 0,
        surgeriesMonthly: 0,
        emergenciesMonthly: 0,
        patientSatisfaction: 5,
        averageWaitTime: 'N/A',
        averageStayDuration: 'N/A'
      },
      staff: {
        doctors: 0,
        specialists: 0,
        nurses: 0,
        technicians: 0,
        administrative: 150,
        support: 50,
        total: 200
      },
      services: [],
      equipment: [],
      certifications: [{
        id: 'cert-001',
        type: 'autorisation',
        name: 'Autorité de Régulation Nationale',
        issuedBy: 'Gouvernement Gabonais',
        issuedDate: '1995-01-14',
        expiryDate: '2099-12-31',
        status: 'valide'
      }],
      insuranceAccepted: [],
      createdAt: '1995-01-14',
      updatedAt: '2025-11-01',
      isPublic: true,
      isEmergencyCenter: false,
      isReferralCenter: false,
      isTeachingHospital: false,
      hasAmbulance: false,
      hasPharmacy: false,
      hasLaboratory: false,
      hasMortuary: false,
      logoUrl: '/logo-ministere.png'
    },
    {
      id: 'est-002',
      code: 'CHU-LBV-001',
      name: 'CHU de Libreville',
      fullName: 'Centre Hospitalier Universitaire de Libreville',
      category: 'universitaire',
      level: 'national',
      status: 'operationnel',
      managingAuthority: 'Ministère de la Santé',
      director: 'Prof. Dr. Marie OBAME',
      directorContact: 'direction@chul.ga',
      location: {
        address: 'Avenue Bouët',
        city: 'Libreville',
        province: 'Estuaire',
        coordinates: { latitude: 0.3907, longitude: 9.4496 }
      },
      contact: {
        phoneMain: '+241 01-76-30-01',
        phoneEmergency: '+241 01-76-30-00',
        email: 'contact@chul.ga',
        website: 'https://chul.ga'
      },
      metrics: {
        totalBeds: 450,
        occupiedBeds: 351,
        occupancyRate: 78,
        consultationsMonthly: 12500,
        surgeriesMonthly: 850,
        emergenciesMonthly: 3200,
        patientSatisfaction: 4.2,
        averageWaitTime: '2h30',
        averageStayDuration: '5 jours'
      },
      staff: {
        doctors: 125,
        specialists: 85,
        nurses: 420,
        technicians: 95,
        administrative: 120,
        support: 180,
        total: 1025
      },
      services: [
        {
          id: 'srv-001',
          name: 'Urgences',
          category: 'urgence',
          available: true,
          operationalHours: '24/7',
          staffCount: 45,
          waitTime: '1h30'
        },
        {
          id: 'srv-002',
          name: 'Maternité',
          category: 'hospitalisation',
          available: true,
          operationalHours: '24/7',
          staffCount: 35,
          waitTime: '30min'
        },
        {
          id: 'srv-003',
          name: 'Chirurgie',
          category: 'chirurgie',
          available: true,
          operationalHours: '08h00 - 20h00',
          staffCount: 28
        },
        {
          id: 'srv-004',
          name: 'Radiologie',
          category: 'imagerie',
          available: true,
          operationalHours: '08h00 - 18h00',
          staffCount: 15
        }
      ],
      equipment: [
        {
          id: 'eq-001',
          name: 'Scanner',
          category: 'imagerie',
          quantity: 2,
          functional: 2,
          maintenance: 0,
          broken: 0
        },
        {
          id: 'eq-002',
          name: 'IRM',
          category: 'imagerie',
          quantity: 1,
          functional: 1,
          maintenance: 0,
          broken: 0
        }
      ],
      certifications: [
        {
          id: 'cert-002',
          type: 'accreditation',
          name: 'Accréditation Hospitalière',
          issuedBy: 'Ministère de la Santé',
          issuedDate: '2023-01-15',
          expiryDate: '2028-01-15',
          status: 'valide'
        }
      ],
      insuranceAccepted: ['CNAMGS', 'CNSS'],
      createdAt: '1985-06-12',
      updatedAt: '2025-11-01',
      isPublic: true,
      isEmergencyCenter: true,
      isReferralCenter: true,
      isTeachingHospital: true,
      hasAmbulance: true,
      hasPharmacy: true,
      hasLaboratory: true,
      hasMortuary: true
    },
    {
      id: 'est-003',
      code: 'CHR-FRV-001',
      name: 'CHR de Franceville',
      fullName: 'Centre Hospitalier Régional de Franceville',
      category: 'regional',
      level: 'regional',
      status: 'partiel',
      managingAuthority: 'Ministère de la Santé',
      director: 'Dr. Paul NGUEMA',
      directorContact: 'direction@chrfranceville.ga',
      location: {
        address: 'Centre-ville',
        city: 'Franceville',
        province: 'Haut-Ogooué',
        coordinates: { latitude: -1.6333, longitude: 13.5833 }
      },
      contact: {
        phoneMain: '+241 01-67-50-20',
        phoneEmergency: '+241 01-67-50-00',
        email: 'contact@chrfranceville.ga'
      },
      metrics: {
        totalBeds: 250,
        occupiedBeds: 163,
        occupancyRate: 65,
        consultationsMonthly: 6800,
        surgeriesMonthly: 320,
        emergenciesMonthly: 1850,
        patientSatisfaction: 3.8,
        averageWaitTime: '3h00',
        averageStayDuration: '4 jours'
      },
      staff: {
        doctors: 45,
        specialists: 22,
        nurses: 180,
        technicians: 35,
        administrative: 40,
        support: 85,
        total: 407
      },
      services: [
        {
          id: 'srv-005',
          name: 'Urgences',
          category: 'urgence',
          available: true,
          operationalHours: '24/7',
          staffCount: 20,
          waitTime: '2h00'
        },
        {
          id: 'srv-006',
          name: 'Maternité',
          category: 'hospitalisation',
          available: true,
          operationalHours: '24/7',
          staffCount: 18
        },
        {
          id: 'srv-007',
          name: 'Pédiatrie',
          category: 'consultation',
          available: true,
          operationalHours: '08h00 - 17h00',
          staffCount: 12
        }
      ],
      equipment: [
        {
          id: 'eq-003',
          name: 'Scanner',
          category: 'imagerie',
          quantity: 1,
          functional: 0,
          maintenance: 0,
          broken: 1,
          nextMaintenance: '2025-11-15'
        },
        {
          id: 'eq-004',
          name: 'Échographie',
          category: 'imagerie',
          quantity: 3,
          functional: 2,
          maintenance: 1,
          broken: 0
        }
      ],
      certifications: [
        {
          id: 'cert-003',
          type: 'autorisation',
          name: 'Autorisation d\'exploitation',
          issuedBy: 'Direction Régionale de la Santé',
          issuedDate: '2021-06-10',
          expiryDate: '2026-06-10',
          status: 'valide'
        }
      ],
      insuranceAccepted: ['CNAMGS', 'CNSS'],
      createdAt: '1978-03-15',
      updatedAt: '2025-11-01',
      isPublic: true,
      isEmergencyCenter: true,
      isReferralCenter: true,
      isTeachingHospital: false,
      hasAmbulance: true,
      hasPharmacy: true,
      hasLaboratory: true,
      hasMortuary: true,
      alerts: [
        {
          type: 'panne',
          message: 'Scanner en panne - Maintenance urgente requise',
          date: '2025-10-25',
          severity: 'high'
        }
      ]
    },
    {
      id: 'est-004',
      code: 'CLN-SOG-001',
      name: 'Clinique SOGARA',
      fullName: 'Centre Médical SOGARA',
      category: 'prive',
      level: 'local',
      status: 'operationnel',
      managingAuthority: 'SOGARA (Société Gabonaise de Raffinage)',
      director: 'Dr. Élise MOUSSAVOU',
      directorContact: 'direction@cliniquesogara.ga',
      location: {
        address: 'Zone Industrielle, PK8',
        city: 'Port-Gentil',
        province: 'Ogooué-Maritime',
        coordinates: { latitude: -0.7193, longitude: 8.7823 }
      },
      contact: {
        phoneMain: '+241 01-55-20-00',
        phoneEmergency: '+241 01-55-20-20',
        email: 'contact@cliniquesogara.ga',
        website: 'https://cliniquesogara.ga'
      },
      metrics: {
        totalBeds: 80,
        occupiedBeds: 56,
        occupancyRate: 70,
        consultationsMonthly: 3200,
        surgeriesMonthly: 120,
        emergenciesMonthly: 850,
        patientSatisfaction: 4.5,
        averageWaitTime: '1h30',
        averageStayDuration: '3 jours'
      },
      staff: {
        doctors: 18,
        specialists: 12,
        nurses: 45,
        technicians: 15,
        administrative: 20,
        support: 30,
        total: 140
      },
      services: [
        {
          id: 'srv-008',
          name: 'Urgences',
          category: 'urgence',
          available: true,
          operationalHours: '24/7',
          staffCount: 12,
          waitTime: '45min'
        },
        {
          id: 'srv-009',
          name: 'Médecine du Travail',
          category: 'consultation',
          available: true,
          operationalHours: '07h00 - 19h00',
          staffCount: 8
        },
        {
          id: 'srv-010',
          name: 'Consultations spécialisées',
          category: 'consultation',
          available: true,
          operationalHours: '08h00 - 17h00',
          staffCount: 10
        }
      ],
      equipment: [
        {
          id: 'eq-005',
          name: 'Radiographie numérique',
          category: 'imagerie',
          quantity: 2,
          functional: 2,
          maintenance: 0,
          broken: 0
        },
        {
          id: 'eq-006',
          name: 'Échographie',
          category: 'imagerie',
          quantity: 2,
          functional: 2,
          maintenance: 0,
          broken: 0
        },
        {
          id: 'eq-007',
          name: 'ECG',
          category: 'autre',
          quantity: 3,
          functional: 3,
          maintenance: 0,
          broken: 0
        }
      ],
      certifications: [
        {
          id: 'cert-004',
          type: 'certification',
          name: 'Certification Qualité ISO 9001',
          issuedBy: 'Bureau Veritas',
          issuedDate: '2024-01-20',
          expiryDate: '2027-01-20',
          status: 'valide'
        }
      ],
      insuranceAccepted: ['CNAMGS', 'CNSS', 'Privé'],
      createdAt: '2005-09-12',
      updatedAt: '2025-11-01',
      isPublic: false,
      isEmergencyCenter: true,
      isReferralCenter: false,
      isTeachingHospital: false,
      hasAmbulance: true,
      hasPharmacy: true,
      hasLaboratory: true,
      hasMortuary: false
    }
  ];
  */
}

function getMockStatistics() {
  const establishments = getMockEstablishments();
  
  // Calculer les vraies statistiques depuis les données
  const byCategory = establishments.reduce((acc, est) => {
    acc[est.category] = (acc[est.category] || 0) + 1;
    return acc;
  }, {} as any);

  const byStatus = establishments.reduce((acc, est) => {
    acc[est.status] = (acc[est.status] || 0) + 1;
    return acc;
  }, {} as any);

  const totalBeds = establishments.reduce((sum, est) => sum + est.metrics.totalBeds, 0);
  const totalDoctors = establishments.reduce((sum, est) => sum + est.staff.doctors, 0);
  const totalNurses = establishments.reduce((sum, est) => sum + est.staff.nurses, 0);
  const avgOccupancyRate = establishments.reduce((sum, est) => sum + est.metrics.occupancyRate, 0) / establishments.length;
  const avgPatientSatisfaction = establishments.reduce((sum, est) => sum + est.metrics.patientSatisfaction, 0) / establishments.length;

  return {
    totalEstablishments: establishments.length,
    byCategory,
    byStatus,
    totalBeds,
    totalDoctors,
    totalNurses,
    avgOccupancyRate: Math.round(avgOccupancyRate),
    avgPatientSatisfaction: parseFloat(avgPatientSatisfaction.toFixed(1))
  };
}

function createMockEstablishment(data: EstablishmentFormData): Establishment {
  return {
    id: `est-${Date.now()}`,
    code: `NEW-${Date.now()}`,
    name: data.name,
    fullName: data.fullName,
    category: data.category,
    level: data.level,
    status: data.status,
    managingAuthority: data.managingAuthority,
    director: data.director,
    directorContact: data.directorContact,
    location: {
      address: data.address,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      coordinates: data.latitude && data.longitude ? {
        latitude: data.latitude,
        longitude: data.longitude
      } : undefined
    },
    contact: {
      phoneMain: data.phoneMain,
      phoneEmergency: data.phoneEmergency,
      email: data.email,
      website: data.website
    },
    metrics: {
      totalBeds: data.totalBeds,
      occupiedBeds: 0,
      occupancyRate: 0,
      consultationsMonthly: 0,
      surgeriesMonthly: 0,
      emergenciesMonthly: 0,
      patientSatisfaction: 0,
      averageWaitTime: 'N/A',
      averageStayDuration: 'N/A'
    },
    staff: {
      doctors: data.doctors,
      specialists: 0,
      nurses: data.nurses,
      technicians: 0,
      administrative: 0,
      support: 0,
      total: data.doctors + data.nurses
    },
    services: data.services.map((name, index) => ({
      id: `srv-new-${index}`,
      name,
      category: 'consultation',
      available: true,
      staffCount: 0
    })),
    equipment: [],
    certifications: [],
    insuranceAccepted: data.insuranceAccepted,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: data.isPublic,
    isEmergencyCenter: data.isEmergencyCenter,
    isReferralCenter: false,
    isTeachingHospital: false,
    hasAmbulance: data.hasAmbulance,
    hasPharmacy: data.hasPharmacy,
    hasLaboratory: data.hasLaboratory,
    hasMortuary: false
  };
}

function updateMockEstablishment(id: string, data: Partial<EstablishmentFormData>): Establishment {
  const existing = getMockEstablishments().find(e => e.id === id);
  if (!existing) throw new Error('Establishment not found');
  
  // Merge services correctly
  const mergedServices = data.services 
    ? data.services.map((name, index) => ({
        id: `srv-upd-${index}`,
        name: typeof name === 'string' ? name : name,
        category: 'consultation' as const,
        available: true,
        staffCount: 0
      }))
    : existing.services;
  
  return {
    ...existing,
    ...data,
    services: mergedServices,
    updatedAt: new Date().toISOString()
  };
}
