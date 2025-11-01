// Base de données complète des établissements de santé du Gabon
// Date: 1er novembre 2025

import { Establishment } from "@/types/establishment";

export const GABON_COMPLETE_ESTABLISHMENTS: Establishment[] = [
  // ===== INSTITUTIONS GOUVERNEMENTALES =====
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

  // ===== PROVINCE ESTUAIRE - CHU ET CHR =====
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
    code: 'CHU-LBV-002',
    name: 'CHU de Melen',
    fullName: 'Centre Hospitalier Universitaire de Melen',
    category: 'universitaire',
    level: 'national',
    status: 'operationnel',
    managingAuthority: 'Ministère de la Santé',
    director: 'Prof. Dr. Paulin MEKUI',
    directorContact: 'direction@chumelen.ga',
    location: {
      address: 'Quartier Melen',
      city: 'Libreville',
      province: 'Estuaire',
      coordinates: { latitude: 0.4157, longitude: 9.4318 }
    },
    contact: {
      phoneMain: '+241 01-73-52-00',
      phoneEmergency: '+241 01-73-52-01',
      email: 'contact@chumelen.ga'
    },
    metrics: {
      totalBeds: 280,
      occupiedBeds: 224,
      occupancyRate: 80,
      consultationsMonthly: 8500,
      surgeriesMonthly: 450,
      emergenciesMonthly: 2100,
      patientSatisfaction: 4.0,
      averageWaitTime: '2h00',
      averageStayDuration: '4 jours'
    },
    staff: {
      doctors: 68,
      specialists: 42,
      nurses: 245,
      technicians: 58,
      administrative: 85,
      support: 120,
      total: 618
    },
    services: [
      {
        id: 'srv-005',
        name: 'Urgences',
        category: 'urgence',
        available: true,
        operationalHours: '24/7',
        staffCount: 32
      },
      {
        id: 'srv-006',
        name: 'Pédiatrie',
        category: 'consultation',
        available: true,
        operationalHours: '08h00 - 18h00',
        staffCount: 25
      }
    ],
    equipment: [
      {
        id: 'eq-003',
        name: 'Scanner',
        category: 'imagerie',
        quantity: 1,
        functional: 1,
        maintenance: 0,
        broken: 0
      },
      {
        id: 'eq-004',
        name: 'Échographie',
        category: 'imagerie',
        quantity: 3,
        functional: 3,
        maintenance: 0,
        broken: 0
      }
    ],
    certifications: [
      {
        id: 'cert-003',
        type: 'accreditation',
        name: 'Accréditation Hospitalière',
        issuedBy: 'Ministère de la Santé',
        issuedDate: '2022-06-10',
        expiryDate: '2027-06-10',
        status: 'valide'
      }
    ],
    insuranceAccepted: ['CNAMGS', 'CNSS'],
    createdAt: '2010-03-15',
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
    id: 'est-004',
    code: 'CHU-LBV-003',
    name: 'CHU de Jeanne Ebori (Gynéco-Obstétrique)',
    fullName: 'Centre Hospitalier Universitaire de Gynécologie-Obstétrique',
    category: 'universitaire',
    level: 'national',
    status: 'operationnel',
    managingAuthority: 'Ministère de la Santé',
    director: 'Prof. Dr. Diane NTOUTOUME',
    directorContact: 'direction@chugo.ga',
    location: {
      address: 'Boulevard Triomphal',
      city: 'Libreville',
      province: 'Estuaire',
      coordinates: { latitude: 0.3945, longitude: 9.4523 }
    },
    contact: {
      phoneMain: '+241 01-76-42-00',
      phoneEmergency: '+241 01-76-42-10',
      email: 'contact@chugo.ga'
    },
    metrics: {
      totalBeds: 180,
      occupiedBeds: 153,
      occupancyRate: 85,
      consultationsMonthly: 6200,
      surgeriesMonthly: 320,
      emergenciesMonthly: 850,
      patientSatisfaction: 4.3,
      averageWaitTime: '1h30',
      averageStayDuration: '3 jours'
    },
    staff: {
      doctors: 45,
      specialists: 38,
      nurses: 180,
      technicians: 32,
      administrative: 45,
      support: 65,
      total: 405
    },
    services: [
      {
        id: 'srv-007',
        name: 'Maternité',
        category: 'hospitalisation',
        available: true,
        operationalHours: '24/7',
        staffCount: 55
      },
      {
        id: 'srv-008',
        name: 'Gynécologie',
        category: 'consultation',
        available: true,
        operationalHours: '08h00 - 17h00',
        staffCount: 28
      }
    ],
    equipment: [
      {
        id: 'eq-005',
        name: 'Échographie obstétricale',
        category: 'imagerie',
        quantity: 5,
        functional: 5,
        maintenance: 0,
        broken: 0
      }
    ],
    certifications: [
      {
        id: 'cert-004',
        type: 'accreditation',
        name: 'Accréditation Maternité',
        issuedBy: 'Ministère de la Santé',
        issuedDate: '2023-09-01',
        expiryDate: '2028-09-01',
        status: 'valide'
      }
    ],
    insuranceAccepted: ['CNAMGS', 'CNSS'],
    createdAt: '1975-08-20',
    updatedAt: '2025-11-01',
    isPublic: true,
    isEmergencyCenter: true,
    isReferralCenter: true,
    isTeachingHospital: true,
    hasAmbulance: true,
    hasPharmacy: true,
    hasLaboratory: true,
    hasMortuary: false
  },

  {
    id: 'est-005',
    code: 'CHU-LBV-004',
    name: 'CHU Angondjé (Pédiatrique)',
    fullName: 'Centre Hospitalier Universitaire Pédiatrique d\'Angondjé',
    category: 'universitaire',
    level: 'national',
    status: 'operationnel',
    managingAuthority: 'Ministère de la Santé',
    director: 'Prof. Dr. Georgette KOKO',
    directorContact: 'direction@chuangonje.ga',
    location: {
      address: 'Quartier Angondjé',
      city: 'Libreville',
      province: 'Estuaire',
      coordinates: { latitude: 0.4258, longitude: 9.4721 }
    },
    contact: {
      phoneMain: '+241 01-79-15-00',
      phoneEmergency: '+241 01-79-15-15',
      email: 'contact@chuangonje.ga'
    },
    metrics: {
      totalBeds: 150,
      occupiedBeds: 128,
      occupancyRate: 85,
      consultationsMonthly: 7800,
      surgeriesMonthly: 180,
      emergenciesMonthly: 1950,
      patientSatisfaction: 4.5,
      averageWaitTime: '1h15',
      averageStayDuration: '4 jours'
    },
    staff: {
      doctors: 42,
      specialists: 35,
      nurses: 160,
      technicians: 28,
      administrative: 38,
      support: 55,
      total: 358
    },
    services: [
      {
        id: 'srv-009',
        name: 'Pédiatrie',
        category: 'consultation',
        available: true,
        operationalHours: '24/7',
        staffCount: 48
      },
      {
        id: 'srv-010',
        name: 'Urgences Pédiatriques',
        category: 'urgence',
        available: true,
        operationalHours: '24/7',
        staffCount: 25
      }
    ],
    equipment: [
      {
        id: 'eq-006',
        name: 'Échographie pédiatrique',
        category: 'imagerie',
        quantity: 3,
        functional: 3,
        maintenance: 0,
        broken: 0
      }
    ],
    certifications: [
      {
        id: 'cert-005',
        type: 'accreditation',
        name: 'Accréditation Pédiatrique',
        issuedBy: 'Ministère de la Santé',
        issuedDate: '2024-02-15',
        expiryDate: '2029-02-15',
        status: 'valide'
      }
    ],
    insuranceAccepted: ['CNAMGS', 'CNSS'],
    createdAt: '2008-11-10',
    updatedAt: '2025-11-01',
    isPublic: true,
    isEmergencyCenter: true,
    isReferralCenter: true,
    isTeachingHospital: true,
    hasAmbulance: true,
    hasPharmacy: true,
    hasLaboratory: true,
    hasMortuary: false
  },

  // === CLINIQUES PRIVÉES LIBREVILLE ===
  {
    id: 'est-006',
    code: 'CLN-LBV-001',
    name: 'Clinique El Rapha',
    category: 'prive',
    level: 'local',
    status: 'operationnel',
    managingAuthority: 'Groupe El Rapha',
    director: 'Dr. Michel OBIANG',
    directorContact: 'direction@elrapha.ga',
    location: {
      address: 'Quartier Batterie IV',
      city: 'Libreville',
      province: 'Estuaire',
      coordinates: { latitude: 0.4012, longitude: 9.4683 }
    },
    contact: {
      phoneMain: '+241 01-76-85-00',
      phoneEmergency: '+241 01-76-85-15',
      email: 'contact@elrapha.ga',
      website: 'https://clinique-elrapha.ga'
    },
    metrics: {
      totalBeds: 65,
      occupiedBeds: 52,
      occupancyRate: 80,
      consultationsMonthly: 2850,
      surgeriesMonthly: 145,
      emergenciesMonthly: 650,
      patientSatisfaction: 4.6,
      averageWaitTime: '45min',
      averageStayDuration: '3 jours'
    },
    staff: {
      doctors: 22,
      specialists: 15,
      nurses: 58,
      technicians: 18,
      administrative: 25,
      support: 35,
      total: 173
    },
    services: [
      {
        id: 'srv-011',
        name: 'Consultation générale',
        category: 'consultation',
        available: true,
        operationalHours: '07h00 - 20h00',
        staffCount: 12
      },
      {
        id: 'srv-012',
        name: 'Urgences',
        category: 'urgence',
        available: true,
        operationalHours: '24/7',
        staffCount: 15
      },
      {
        id: 'srv-013',
        name: 'Imagerie médicale',
        category: 'imagerie',
        available: true,
        operationalHours: '08h00 - 18h00',
        staffCount: 8
      }
    ],
    equipment: [
      {
        id: 'eq-007',
        name: 'Scanner',
        category: 'imagerie',
        quantity: 1,
        functional: 1,
        maintenance: 0,
        broken: 0
      },
      {
        id: 'eq-008',
        name: 'Échographie',
        category: 'imagerie',
        quantity: 2,
        functional: 2,
        maintenance: 0,
        broken: 0
      }
    ],
    certifications: [
      {
        id: 'cert-006',
        type: 'certification',
        name: 'Certification Qualité ISO 9001',
        issuedBy: 'Bureau Veritas',
        issuedDate: '2023-05-10',
        expiryDate: '2026-05-10',
        status: 'valide'
      }
    ],
    insuranceAccepted: ['CNAMGS', 'CNSS', 'Privé'],
    createdAt: '2005-03-22',
    updatedAt: '2025-11-01',
    isPublic: false,
    isEmergencyCenter: true,
    isReferralCenter: false,
    isTeachingHospital: false,
    hasAmbulance: true,
    hasPharmacy: true,
    hasLaboratory: true,
    hasMortuary: false
  },

  // === HAUT-OGOOUÉ - CHR FRANCEVILLE ===
  {
    id: 'est-007',
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
        id: 'srv-014',
        name: 'Urgences',
        category: 'urgence',
        available: true,
        operationalHours: '24/7',
        staffCount: 20,
        waitTime: '2h00'
      },
      {
        id: 'srv-015',
        name: 'Maternité',
        category: 'hospitalisation',
        available: true,
        operationalHours: '24/7',
        staffCount: 18
      },
      {
        id: 'srv-016',
        name: 'Pédiatrie',
        category: 'consultation',
        available: true,
        operationalHours: '08h00 - 17h00',
        staffCount: 12
      }
    ],
    equipment: [
      {
        id: 'eq-009',
        name: 'Scanner',
        category: 'imagerie',
        quantity: 1,
        functional: 0,
        maintenance: 0,
        broken: 1,
        nextMaintenance: '2025-11-15'
      },
      {
        id: 'eq-010',
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
        id: 'cert-007',
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

  // === OGOOUÉ-MARITIME - PORT-GENTIL ===
  {
    id: 'est-008',
    code: 'CLN-PG-001',
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
        id: 'srv-017',
        name: 'Urgences',
        category: 'urgence',
        available: true,
        operationalHours: '24/7',
        staffCount: 12,
        waitTime: '45min'
      },
      {
        id: 'srv-018',
        name: 'Médecine du Travail',
        category: 'consultation',
        available: true,
        operationalHours: '07h00 - 19h00',
        staffCount: 8
      },
      {
        id: 'srv-019',
        name: 'Consultations spécialisées',
        category: 'consultation',
        available: true,
        operationalHours: '08h00 - 17h00',
        staffCount: 10
      }
    ],
    equipment: [
      {
        id: 'eq-011',
        name: 'Radiographie numérique',
        category: 'imagerie',
        quantity: 2,
        functional: 2,
        maintenance: 0,
        broken: 0
      },
      {
        id: 'eq-012',
        name: 'Échographie',
        category: 'imagerie',
        quantity: 2,
        functional: 2,
        maintenance: 0,
        broken: 0
      },
      {
        id: 'eq-013',
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
        id: 'cert-008',
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
  },

  // === PROVINCE WOLEU-NTEM ===
  {
    id: 'est-009',
    code: 'CHR-OYE-001',
    name: 'CHR de Oyem',
    fullName: 'Centre Hospitalier Régional de Oyem',
    category: 'regional',
    level: 'regional',
    status: 'operationnel',
    managingAuthority: 'Ministère de la Santé',
    director: 'Dr. Joseph ONDO',
    directorContact: 'direction@chroyem.ga',
    location: {
      address: 'Avenue Principale',
      city: 'Oyem',
      province: 'Woleu-Ntem',
      coordinates: { latitude: 1.5993, longitude: 11.5793 }
    },
    contact: {
      phoneMain: '+241 01-98-20-15',
      phoneEmergency: '+241 01-98-20-00',
      email: 'contact@chroyem.ga'
    },
    metrics: {
      totalBeds: 180,
      occupiedBeds: 95,
      occupancyRate: 53,
      consultationsMonthly: 4200,
      surgeriesMonthly: 165,
      emergenciesMonthly: 980,
      patientSatisfaction: 3.9,
      averageWaitTime: '2h45',
      averageStayDuration: '4 jours'
    },
    staff: {
      doctors: 32,
      specialists: 12,
      nurses: 125,
      technicians: 22,
      administrative: 28,
      support: 55,
      total: 274
    },
    services: [
      {
        id: 'srv-020',
        name: 'Urgences',
        category: 'urgence',
        available: true,
        operationalHours: '24/7',
        staffCount: 15
      },
      {
        id: 'srv-021',
        name: 'Chirurgie générale',
        category: 'chirurgie',
        available: true,
        operationalHours: '08h00 - 18h00',
        staffCount: 12
      }
    ],
    equipment: [
      {
        id: 'eq-014',
        name: 'Radiographie',
        category: 'imagerie',
        quantity: 2,
        functional: 2,
        maintenance: 0,
        broken: 0
      },
      {
        id: 'eq-015',
        name: 'Échographie',
        category: 'imagerie',
        quantity: 2,
        functional: 2,
        maintenance: 0,
        broken: 0
      }
    ],
    certifications: [
      {
        id: 'cert-009',
        type: 'autorisation',
        name: 'Autorisation d\'exploitation',
        issuedBy: 'Direction Régionale de la Santé',
        issuedDate: '2020-08-15',
        expiryDate: '2025-08-15',
        status: 'valide'
      }
    ],
    insuranceAccepted: ['CNAMGS', 'CNSS'],
    createdAt: '1975-10-05',
    updatedAt: '2025-11-01',
    isPublic: true,
    isEmergencyCenter: true,
    isReferralCenter: true,
    isTeachingHospital: false,
    hasAmbulance: true,
    hasPharmacy: true,
    hasLaboratory: true,
    hasMortuary: true
  },

  // === PROVINCE NYANGA ===
  {
    id: 'est-010',
    code: 'CHR-TCH-001',
    name: 'CHR de Tchibanga',
    fullName: 'Centre Hospitalier Régional de Tchibanga',
    category: 'regional',
    level: 'regional',
    status: 'operationnel',
    managingAuthority: 'Ministère de la Santé',
    director: 'Dr. Sylvie MAVOUNGOU',
    directorContact: 'direction@chrtchibanga.ga',
    location: {
      address: 'Centre-ville',
      city: 'Tchibanga',
      province: 'Nyanga',
      coordinates: { latitude: -2.8500, longitude: 11.0167 }
    },
    contact: {
      phoneMain: '+241 01-96-30-12',
      phoneEmergency: '+241 01-96-30-00',
      email: 'contact@chrtchibanga.ga'
    },
    metrics: {
      totalBeds: 120,
      occupiedBeds: 62,
      occupancyRate: 52,
      consultationsMonthly: 2800,
      surgeriesMonthly: 85,
      emergenciesMonthly: 520,
      patientSatisfaction: 3.7,
      averageWaitTime: '4h00',
      averageStayDuration: '5 jours'
    },
    staff: {
      doctors: 18,
      specialists: 8,
      nurses: 75,
      technicians: 12,
      administrative: 15,
      support: 32,
      total: 160
    },
    services: [
      {
        id: 'srv-022',
        name: 'Urgences',
        category: 'urgence',
        available: true,
        operationalHours: '24/7',
        staffCount: 10
      }
    ],
    equipment: [
      {
        id: 'eq-016',
        name: 'Radiographie',
        category: 'imagerie',
        quantity: 1,
        functional: 1,
        maintenance: 0,
        broken: 0
      }
    ],
    certifications: [
      {
        id: 'cert-010',
        type: 'autorisation',
        name: 'Autorisation d\'exploitation',
        issuedBy: 'Direction Régionale de la Santé',
        issuedDate: '2019-03-20',
        expiryDate: '2024-03-20',
        status: 'en_renouvellement'
      }
    ],
    insuranceAccepted: ['CNAMGS', 'CNSS'],
    createdAt: '1976-05-12',
    updatedAt: '2025-11-01',
    isPublic: true,
    isEmergencyCenter: true,
    isReferralCenter: true,
    isTeachingHospital: false,
    hasAmbulance: true,
    hasPharmacy: true,
    hasLaboratory: false,
    hasMortuary: true
  },

  // === PROVINCE NGOUNIÉ ===
  {
    id: 'est-011',
    code: 'CHR-MOU-001',
    name: 'CHR de Mouila',
    fullName: 'Centre Hospitalier Régional de Mouila',
    category: 'regional',
    level: 'regional',
    status: 'operationnel',
    managingAuthority: 'Ministère de la Santé',
    director: 'Dr. Bertrand MABIKA',
    directorContact: 'direction@chrmouila.ga',
    location: {
      address: 'Quartier Mission',
      city: 'Mouila',
      province: 'Ngounié',
      coordinates: { latitude: -1.8667, longitude: 11.0556 }
    },
    contact: {
      phoneMain: '+241 01-95-42-10',
      phoneEmergency: '+241 01-95-42-00',
      email: 'contact@chrmouila.ga'
    },
    metrics: {
      totalBeds: 150,
      occupiedBeds: 90,
      occupancyRate: 60,
      consultationsMonthly: 3500,
      surgeriesMonthly: 125,
      emergenciesMonthly: 720,
      patientSatisfaction: 3.9,
      averageWaitTime: '3h15',
      averageStayDuration: '4 jours'
    },
    staff: {
      doctors: 24,
      specialists: 10,
      nurses: 95,
      technicians: 18,
      administrative: 20,
      support: 38,
      total: 205
    },
    services: [
      {
        id: 'srv-023',
        name: 'Urgences',
        category: 'urgence',
        available: true,
        operationalHours: '24/7',
        staffCount: 12
      },
      {
        id: 'srv-024',
        name: 'Maternité',
        category: 'hospitalisation',
        available: true,
        operationalHours: '24/7',
        staffCount: 15
      }
    ],
    equipment: [
      {
        id: 'eq-017',
        name: 'Radiographie',
        category: 'imagerie',
        quantity: 1,
        functional: 1,
        maintenance: 0,
        broken: 0
      },
      {
        id: 'eq-018',
        name: 'Échographie',
        category: 'imagerie',
        quantity: 2,
        functional: 2,
        maintenance: 0,
        broken: 0
      }
    ],
    certifications: [
      {
        id: 'cert-011',
        type: 'autorisation',
        name: 'Autorisation d\'exploitation',
        issuedBy: 'Direction Régionale de la Santé',
        issuedDate: '2021-01-10',
        expiryDate: '2026-01-10',
        status: 'valide'
      }
    ],
    insuranceAccepted: ['CNAMGS', 'CNSS'],
    createdAt: '1977-11-08',
    updatedAt: '2025-11-01',
    isPublic: true,
    isEmergencyCenter: true,
    isReferralCenter: true,
    isTeachingHospital: false,
    hasAmbulance: true,
    hasPharmacy: true,
    hasLaboratory: true,
    hasMortuary: true
  },

  // === PROVINCE MOYEN-OGOOUÉ ===
  {
    id: 'est-012',
    code: 'CHR-LAM-001',
    name: 'CHR de Lambaréné',
    fullName: 'Centre Hospitalier Régional de Lambaréné',
    category: 'regional',
    level: 'regional',
    status: 'operationnel',
    managingAuthority: 'Ministère de la Santé',
    director: 'Dr. Pierre ANGA',
    directorContact: 'direction@chrlambarene.ga',
    location: {
      address: 'Quartier Adouma',
      city: 'Lambaréné',
      province: 'Moyen-Ogooué',
      coordinates: { latitude: -0.7000, longitude: 10.2300 }
    },
    contact: {
      phoneMain: '+241 01-58-20-05',
      phoneEmergency: '+241 01-58-20-00',
      email: 'contact@chrlambarene.ga'
    },
    metrics: {
      totalBeds: 140,
      occupiedBeds: 77,
      occupancyRate: 55,
      consultationsMonthly: 3100,
      surgeriesMonthly: 98,
      emergenciesMonthly: 650,
      patientSatisfaction: 4.0,
      averageWaitTime: '2h50',
      averageStayDuration: '4 jours'
    },
    staff: {
      doctors: 20,
      specialists: 9,
      nurses: 82,
      technicians: 15,
      administrative: 18,
      support: 35,
      total: 179
    },
    services: [
      {
        id: 'srv-025',
        name: 'Urgences',
        category: 'urgence',
        available: true,
        operationalHours: '24/7',
        staffCount: 10
      }
    ],
    equipment: [
      {
        id: 'eq-019',
        name: 'Radiographie',
        category: 'imagerie',
        quantity: 1,
        functional: 1,
        maintenance: 0,
        broken: 0
      }
    ],
    certifications: [
      {
        id: 'cert-012',
        type: 'autorisation',
        name: 'Autorisation d\'exploitation',
        issuedBy: 'Direction Régionale de la Santé',
        issuedDate: '2020-05-15',
        expiryDate: '2025-05-15',
        status: 'valide'
      }
    ],
    insuranceAccepted: ['CNAMGS', 'CNSS'],
    createdAt: '1913-01-01',
    updatedAt: '2025-11-01',
    isPublic: true,
    isEmergencyCenter: true,
    isReferralCenter: true,
    isTeachingHospital: false,
    hasAmbulance: true,
    hasPharmacy: true,
    hasLaboratory: true,
    hasMortuary: true
  },

  // === PROVINCE OGOOUÉ-IVINDO ===
  {
    id: 'est-013',
    code: 'CHR-MAK-001',
    name: 'CHR de Makokou',
    fullName: 'Centre Hospitalier Régional de Makokou',
    category: 'regional',
    level: 'regional',
    status: 'operationnel',
    managingAuthority: 'Ministère de la Santé',
    director: 'Dr. Fabrice IKOGOU',
    directorContact: 'direction@chrmakokou.ga',
    location: {
      address: 'Centre-ville',
      city: 'Makokou',
      province: 'Ogooué-Ivindo',
      coordinates: { latitude: 0.5738, longitude: 12.8647 }
    },
    contact: {
      phoneMain: '+241 01-96-70-15',
      phoneEmergency: '+241 01-96-70-00',
      email: 'contact@chrmakokou.ga'
    },
    metrics: {
      totalBeds: 100,
      occupiedBeds: 58,
      occupancyRate: 58,
      consultationsMonthly: 2200,
      surgeriesMonthly: 65,
      emergenciesMonthly: 480,
      patientSatisfaction: 3.6,
      averageWaitTime: '5h00',
      averageStayDuration: '5 jours'
    },
    staff: {
      doctors: 15,
      specialists: 5,
      nurses: 62,
      technicians: 10,
      administrative: 12,
      support: 25,
      total: 129
    },
    services: [
      {
        id: 'srv-026',
        name: 'Urgences',
        category: 'urgence',
        available: true,
        operationalHours: '24/7',
        staffCount: 8
      }
    ],
    equipment: [
      {
        id: 'eq-020',
        name: 'Radiographie',
        category: 'imagerie',
        quantity: 1,
        functional: 1,
        maintenance: 0,
        broken: 0
      }
    ],
    certifications: [
      {
        id: 'cert-013',
        type: 'autorisation',
        name: 'Autorisation d\'exploitation',
        issuedBy: 'Direction Régionale de la Santé',
        issuedDate: '2019-09-01',
        expiryDate: '2024-09-01',
        status: 'en_renouvellement'
      }
    ],
    insuranceAccepted: ['CNAMGS', 'CNSS'],
    createdAt: '1980-06-20',
    updatedAt: '2025-11-01',
    isPublic: true,
    isEmergencyCenter: true,
    isReferralCenter: true,
    isTeachingHospital: false,
    hasAmbulance: true,
    hasPharmacy: true,
    hasLaboratory: false,
    hasMortuary: true,
    alerts: [
      {
        type: 'rupture',
        message: 'Rupture antipaludéens - Stock critique',
        date: '2025-10-30',
        severity: 'high'
      }
    ]
  },

  // === PROVINCE OGOOUÉ-LOLO ===
  {
    id: 'est-014',
    code: 'CHR-KOU-001',
    name: 'CHR de Koulamoutou',
    fullName: 'Centre Hospitalier Régional de Koulamoutou',
    category: 'regional',
    level: 'regional',
    status: 'operationnel',
    managingAuthority: 'Ministère de la Santé',
    director: 'Dr. Alain MBADINGA',
    directorContact: 'direction@chrkoulamoutou.ga',
    location: {
      address: 'Route nationale',
      city: 'Koulamoutou',
      province: 'Ogooué-Lolo',
      coordinates: { latitude: -1.1333, longitude: 12.4833 }
    },
    contact: {
      phoneMain: '+241 01-66-40-12',
      phoneEmergency: '+241 01-66-40-00',
      email: 'contact@chrkoulamoutou.ga'
    },
    metrics: {
      totalBeds: 110,
      occupiedBeds: 53,
      occupancyRate: 48,
      consultationsMonthly: 2400,
      surgeriesMonthly: 72,
      emergenciesMonthly: 420,
      patientSatisfaction: 3.8,
      averageWaitTime: '4h30',
      averageStayDuration: '5 jours'
    },
    staff: {
      doctors: 16,
      specialists: 6,
      nurses: 68,
      technicians: 12,
      administrative: 14,
      support: 28,
      total: 144
    },
    services: [
      {
        id: 'srv-027',
        name: 'Urgences',
        category: 'urgence',
        available: true,
        operationalHours: '24/7',
        staffCount: 9
      }
    ],
    equipment: [
      {
        id: 'eq-021',
        name: 'Radiographie',
        category: 'imagerie',
        quantity: 1,
        functional: 1,
        maintenance: 0,
        broken: 0
      }
    ],
    certifications: [
      {
        id: 'cert-014',
        type: 'autorisation',
        name: 'Autorisation d\'exploitation',
        issuedBy: 'Direction Régionale de la Santé',
        issuedDate: '2020-11-05',
        expiryDate: '2025-11-05',
        status: 'valide'
      }
    ],
    insuranceAccepted: ['CNAMGS', 'CNSS'],
    createdAt: '1979-08-15',
    updatedAt: '2025-11-01',
    isPublic: true,
    isEmergencyCenter: true,
    isReferralCenter: true,
    isTeachingHospital: false,
    hasAmbulance: true,
    hasPharmacy: true,
    hasLaboratory: false,
    hasMortuary: true
  }
];

export default GABON_COMPLETE_ESTABLISHMENTS;

