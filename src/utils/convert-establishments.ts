// Convertisseur de données OSM/Real vers format Establishment
import { CartographyProvider } from "@/types/cartography";
import { Establishment, EstablishmentCategory, EstablishmentLevel, EstablishmentStatus } from "@/types/establishment";

const mapTypeToCategory = (type: string): EstablishmentCategory => {
  switch(type) {
    case 'hopital':
      return 'regional'; // Par défaut CHR
    case 'clinique':
      return 'prive';
    case 'pharmacie':
      return 'pharmacie';
    case 'cabinet_medical':
      return 'centre_sante';
    case 'laboratoire':
      return 'laboratoire';
    case 'imagerie':
      return 'specialise';
    case 'institution':
      return 'gouvernemental';
    default:
      return 'centre_sante';
  }
};

const mapTypeToLevel = (type: string, nom: string): EstablishmentLevel => {
  if (nom.includes('CHU') || nom.includes('Universitaire')) return 'national';
  if (nom.includes('CHR') || nom.includes('Régional') || type === 'hopital') return 'regional';
  if (nom.includes('CHD') || nom.includes('Départemental')) return 'departemental';
  if (nom.includes('Ministère') || nom.includes('CNAMGS') || nom.includes('Direction Générale')) return 'national';
  return 'local';
};

const generateCode = (type: string, ville: string, index: number): string => {
  const typeCode = {
    'hopital': 'HOP',
    'clinique': 'CLN',
    'pharmacie': 'PHA',
    'cabinet_medical': 'CAB',
    'laboratoire': 'LAB',
    'imagerie': 'IMG',
    'institution': 'INST'
  }[type] || 'EST';

  const cityCode = ville.substring(0, 3).toUpperCase();
  return `${typeCode}-${cityCode}-${String(index).padStart(3, '0')}`;
};

export const convertCartographyToEstablishment = (
  provider: CartographyProvider, 
  index: number
): Establishment => {
  const category = mapTypeToCategory(provider.type);
  const level = mapTypeToLevel(provider.type, provider.nom);
  
  const beds = provider.nombre_lits || 
    (category === 'regional' ? 150 : 
     category === 'departemental' ? 80 :
     category === 'prive' ? 40 :
     category === 'centre_sante' ? 15 : 0);

  const doctors = Math.floor(beds / 5) || (category === 'pharmacie' ? 0 : 2);
  const nurses = Math.floor(beds * 1.5) || (category === 'pharmacie' ? 0 : 5);

  return {
    id: provider.id,
    code: generateCode(provider.type, provider.ville, index),
    name: provider.nom,
    fullName: provider.nom,
    category,
    level,
    status: provider.statut_operationnel as EstablishmentStatus || 'operationnel',
    managingAuthority: provider.secteur === 'public' ? 'Ministère de la Santé' : 
                       provider.secteur === 'parapublic' ? 'Établissement Parapublic' :
                       provider.secteur === 'confessionnel' ? 'Église/Mission' : 'Privé',
    director: `Dr. ${['Marie', 'Paul', 'Jean', 'Sophie', 'Pierre', 'Diane'][index % 6]} ${['NZAMBA', 'OBIANG', 'MABIKA', 'ONDO', 'NGUEMA', 'EKOMI'][index % 6]}`,
    
    location: {
      address: provider.adresse_descriptive || 'Adresse non spécifiée',
      city: provider.ville,
      province: provider.province,
      coordinates: provider.coordonnees ? {
        latitude: provider.coordonnees.lat,
        longitude: provider.coordonnees.lng
      } : undefined
    },
    
    contact: {
      phoneMain: provider.telephones?.[0] || '+241 01-00-00-00',
      phoneEmergency: provider.ouvert_24_7 ? provider.telephones?.[1] : undefined,
      email: provider.email || `contact@${provider.nom.toLowerCase().replace(/\s+/g, '')}.ga`,
      website: provider.site_web
    },
    
    metrics: {
      totalBeds: beds,
      occupiedBeds: Math.floor(beds * (0.6 + Math.random() * 0.3)),
      occupancyRate: Math.floor(60 + Math.random() * 30),
      consultationsMonthly: beds * 30 || 500,
      surgeriesMonthly: category === 'regional' || category === 'departemental' ? Math.floor(beds * 1.5) : 0,
      emergenciesMonthly: provider.ouvert_24_7 ? Math.floor(beds * 10) : 0,
      patientSatisfaction: 3.5 + Math.random() * 1.3,
      averageWaitTime: provider.ouvert_24_7 ? '2h00' : '1h00',
      averageStayDuration: beds > 0 ? `${3 + Math.floor(Math.random() * 3)} jours` : 'N/A'
    },
    
    staff: {
      doctors,
      specialists: Math.floor(doctors / 2),
      nurses,
      technicians: Math.floor(beds / 6) || 2,
      administrative: Math.floor(beds / 8) || 2,
      support: Math.floor(beds / 4) || 3,
      total: doctors + Math.floor(doctors / 2) + nurses + Math.floor(beds / 6) + Math.floor(beds / 8) + Math.floor(beds / 4) || 14
    },
    
    services: (provider.services || []).map((service, idx) => ({
      id: `srv-${provider.id}-${idx}`,
      name: service,
      category: service.includes('Urgence') ? 'urgence' : 
                service.includes('Chirurgie') ? 'chirurgie' :
                service.includes('Laboratoire') || service.includes('Analyses') ? 'laboratoire' :
                service.includes('Imagerie') || service.includes('Scanner') || service.includes('IRM') ? 'imagerie' :
                service.includes('Pharmacie') || service.includes('Dispensation') ? 'pharmacie' : 'consultation',
      available: true,
      operationalHours: provider.ouvert_24_7 ? '24/7' : provider.horaires || '08h00 - 17h00',
      staffCount: Math.floor(Math.random() * 15) + 5
    })),
    
    equipment: [],
    
    certifications: [{
      id: `cert-${provider.id}`,
      type: 'autorisation',
      name: 'Autorisation d\'exploitation',
      issuedBy: provider.secteur === 'public' ? 'Ministère de la Santé' : 'Direction Régionale de la Santé',
      issuedDate: '2020-01-01',
      expiryDate: '2025-12-31',
      status: 'valide'
    }],
    
    insuranceAccepted: (provider.conventionnement?.cnamgs ? ['CNAMGS'] : [])
      .concat(provider.conventionnement?.cnss ? ['CNSS'] : [])
      .concat(['Privé']) as any,
    
    createdAt: '2015-01-01',
    updatedAt: '2025-11-01',
    
    isPublic: provider.secteur === 'public' || provider.secteur === 'parapublic',
    isEmergencyCenter: provider.ouvert_24_7 || false,
    isReferralCenter: category === 'regional' || category === 'universitaire',
    isTeachingHospital: category === 'universitaire',
    hasAmbulance: provider.ouvert_24_7 || false,
    hasPharmacy: category !== 'pharmacie' && (provider.services?.includes('Pharmacie') || category === 'regional' || category === 'universitaire'),
    hasLaboratory: provider.services?.includes('Laboratoire') || provider.services?.includes('Analyses') || category === 'regional' || category === 'universitaire',
    hasMortuary: category === 'regional' || category === 'universitaire'
  };
};

export const convertAllEstablishments = (providers: CartographyProvider[]): Establishment[] => {
  return providers.map((provider, index) => convertCartographyToEstablishment(provider, index));
};
