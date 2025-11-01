// Script pour générer tous les établissements de santé du Gabon
// Total: 238 établissements

import { Establishment } from "../src/types/establishment";

const provinces = [
  { name: 'Estuaire', capital: 'Libreville', coords: { lat: 0.3901, lng: 9.4544 } },
  { name: 'Haut-Ogooué', capital: 'Franceville', coords: { lat: -1.6333, lng: 13.5833 } },
  { name: 'Moyen-Ogooué', capital: 'Lambaréné', coords: { lat: -0.7000, lng: 10.2300 } },
  { name: 'Ngounié', capital: 'Mouila', coords: { lat: -1.8667, lng: 11.0556 } },
  { name: 'Nyanga', capital: 'Tchibanga', coords: { lat: -2.8500, lng: 11.0167 } },
  { name: 'Ogooué-Ivindo', capital: 'Makokou', coords: { lat: 0.5738, lng: 12.8647 } },
  { name: 'Ogooué-Lolo', capital: 'Koulamoutou', coords: { lat: -1.1333, lng: 12.4833 } },
  { name: 'Ogooué-Maritime', capital: 'Port-Gentil', coords: { lat: -0.7193, lng: 8.7823 } },
  { name: 'Woleu-Ntem', capital: 'Oyem', coords: { lat: 1.5993, lng: 11.5793 } }
];

// CHD - Centres Hospitaliers Départementaux (15 au total)
const generateCHD = () => {
  const chd: any[] = [];
  let id = 15;
  
  const chdList = [
    { city: 'Ntoum', province: 'Estuaire', beds: 60 },
    { city: 'Kango', province: 'Estuaire', beds: 55 },
    { city: 'Cocobeach', province: 'Estuaire', beds: 50 },
    { city: 'Moanda', province: 'Haut-Ogooué', beds: 85 },
    { city: 'Akieni', province: 'Haut-Ogooué', beds: 45 },
    { city: 'Ndjolé', province: 'Moyen-Ogooué', beds: 50 },
    { city: 'Fougamou', province: 'Ngounié', beds: 55 },
    { city: 'Mandji', province: 'Ngounié', beds: 45 },
    { city: 'Mayumba', province: 'Nyanga', beds: 60 },
    { city: 'Mekambo', province: 'Ogooué-Ivindo', beds: 40 },
    { city: 'Lastoursville', province: 'Ogooué-Lolo', beds: 65 },
    { city: 'Omboué', province: 'Ogooué-Maritime', beds: 50 },
    { city: 'Gamba', province: 'Ogooué-Maritime', beds: 55 },
    { city: 'Bitam', province: 'Woleu-Ntem', beds: 75 },
    { city: 'Mitzic', province: 'Woleu-Ntem', beds: 50 }
  ];

  chdList.forEach((item, index) => {
    chd.push({
      id: `est-${String(id++).padStart(3, '0')}`,
      code: `CHD-${item.city.substring(0, 3).toUpperCase()}-001`,
      name: `CHD de ${item.city}`,
      fullName: `Centre Hospitalier Départemental de ${item.city}`,
      category: 'departemental',
      level: 'departemental',
      status: 'operationnel',
      managingAuthority: 'Ministère de la Santé',
      director: `Dr. ${['Marie', 'Paul', 'Jean', 'Sophie'][index % 4]} ${['NZAMBA', 'OBIANG', 'MABIKA', 'ONDO'][index % 4]}`,
      location: {
        address: 'Centre-ville',
        city: item.city,
        province: item.province,
        coordinates: provinces.find(p => p.name === item.province)?.coords || { lat: 0, lng: 0 }
      },
      contact: {
        phoneMain: `+241 01-${90 + index}-${10 + index}-${10 + index}`,
        phoneEmergency: `+241 01-${90 + index}-${10 + index}-00`,
        email: `contact@chd${item.city.toLowerCase()}.ga`
      },
      metrics: {
        totalBeds: item.beds,
        occupiedBeds: Math.floor(item.beds * 0.6),
        occupancyRate: 60,
        consultationsMonthly: item.beds * 30,
        surgeriesMonthly: Math.floor(item.beds * 0.8),
        emergenciesMonthly: item.beds * 10,
        patientSatisfaction: 3.5 + Math.random() * 0.5,
        averageWaitTime: '3h00',
        averageStayDuration: '4 jours'
      },
      staff: {
        doctors: Math.floor(item.beds / 5),
        specialists: Math.floor(item.beds / 10),
        nurses: Math.floor(item.beds * 1.2),
        technicians: Math.floor(item.beds / 6),
        administrative: Math.floor(item.beds / 8),
        support: Math.floor(item.beds / 4),
        total: Math.floor(item.beds * 3)
      },
      services: [
        {
          id: `srv-${id * 10}`,
          name: 'Urgences',
          category: 'urgence',
          available: true,
          operationalHours: '24/7',
          staffCount: Math.floor(item.beds / 8)
        },
        {
          id: `srv-${id * 10 + 1}`,
          name: 'Maternité',
          category: 'hospitalisation',
          available: true,
          operationalHours: '24/7',
          staffCount: Math.floor(item.beds / 6)
        }
      ],
      equipment: [
        {
          id: `eq-${id * 10}`,
          name: 'Radiographie',
          category: 'imagerie',
          quantity: 1,
          functional: 1,
          maintenance: 0,
          broken: 0
        }
      ],
      certifications: [{
        id: `cert-${id}`,
        type: 'autorisation',
        name: 'Autorisation d\'exploitation',
        issuedBy: 'Direction Régionale de la Santé',
        issuedDate: '2020-01-01',
        expiryDate: '2025-01-01',
        status: 'valide'
      }],
      insuranceAccepted: ['CNAMGS', 'CNSS'],
      createdAt: '1975-01-01',
      updatedAt: '2025-11-01',
      isPublic: true,
      isEmergencyCenter: true,
      isReferralCenter: false,
      isTeachingHospital: false,
      hasAmbulance: true,
      hasPharmacy: true,
      hasLaboratory: index < 5,
      hasMortuary: true
    });
  });

  return chd;
};

// Générer les centres de santé
const generateCentresSante = () => {
  const centres: any[] = [];
  let id = 30;
  
  provinces.forEach(province => {
    const centresPerProvince = province.name === 'Estuaire' ? 15 : 8;
    
    for (let i = 0; i < centresPerProvince; i++) {
      centres.push({
        id: `est-${String(id++).padStart(3, '0')}`,
        code: `CS-${province.name.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
        name: `Centre de Santé ${province.capital} ${i + 1}`,
        category: 'centre_sante',
        level: 'local',
        status: i % 15 === 0 ? 'partiel' : 'operationnel',
        managingAuthority: `Direction Provinciale de la Santé - ${province.name}`,
        location: {
          address: `Quartier ${i + 1}`,
          city: province.capital,
          province: province.name,
          coordinates: {
            latitude: province.coords.lat + (Math.random() - 0.5) * 0.05,
            longitude: province.coords.lng + (Math.random() - 0.5) * 0.05
          }
        },
        contact: {
          phoneMain: `+241 07-${String(20 + id).padStart(2, '0')}-${String(10 + i).padStart(2, '0')}-${String(15 + i).padStart(2, '0')}`,
          email: `cs${i + 1}.${province.capital.toLowerCase()}@sante.gouv.ga`
        },
        metrics: {
          totalBeds: 15,
          occupiedBeds: Math.floor(15 * 0.7),
          occupancyRate: 70,
          consultationsMonthly: 800 + Math.floor(Math.random() * 400),
          surgeriesMonthly: 0,
          emergenciesMonthly: 180 + Math.floor(Math.random() * 100),
          patientSatisfaction: 3.5 + Math.random() * 0.8,
          averageWaitTime: '1h30',
          averageStayDuration: '2 jours'
        },
        staff: {
          doctors: 2,
          specialists: 0,
          nurses: 8,
          technicians: 2,
          administrative: 3,
          support: 4,
          total: 19
        },
        services: [
          {
            id: `srv-${id * 100}`,
            name: 'Consultation générale',
            category: 'consultation',
            available: true,
            operationalHours: '07h00 - 17h00',
            staffCount: 5
          }
        ],
        equipment: [],
        certifications: [{
          id: `cert-${id}`,
          type: 'autorisation',
          name: 'Autorisation d\'exploitation',
          issuedBy: 'Direction Provinciale de la Santé',
          issuedDate: '2018-01-01',
          expiryDate: '2023-01-01',
          status: i % 10 === 0 ? 'expire' : 'valide'
        }],
        insuranceAccepted: ['CNAMGS', 'CNSS'],
        createdAt: '2010-01-01',
        updatedAt: '2025-11-01',
        isPublic: true,
        isEmergencyCenter: false,
        isReferralCenter: false,
        isTeachingHospital: false,
        hasAmbulance: false,
        hasPharmacy: i % 3 === 0,
        hasLaboratory: false,
        hasMortuary: false
      });
    }
  });
  
  return centres;
};

// Générer cliniques privées
const generateCliniquesPrivees = () => {
  const cliniques: any[] = [];
  let id = 130;
  
  const cliniquesLibreville = [
    'Clinique Jeanne Ebori',
    'Clinique du Rond-Point',
    'Clinique Beau Séjour',
    'Clinique Arc-en-Ciel',
    'Clinique Chambrier',
    'Clinique Mandji',
    'Clinique Les Bouquets',
    'Clinique Sainte-Marie',
    'Clinique La Providence',
    'Clinique du Plateau',
    'Clinique Mont-Bouët',
    'Clinique Glass',
    'Clinique Nzeng-Ayong',
    'Clinique Akand',
    'Clinique Owendo'
  ];

  cliniquesLibreville.forEach((nom, i) => {
    cliniques.push({
      id: `est-${String(id++).padStart(3, '0')}`,
      code: `CLN-LBV-${String(i + 2).padStart(3, '0')}`,
      name: nom,
      category: 'prive',
      level: 'local',
      status: 'operationnel',
      managingAuthority: 'Privé',
      director: `Dr. ${['Michel', 'Sophie', 'Jean', 'Marie', 'Paul', 'Diane'][i % 6]} ${['OBIANG', 'NGUEMA', 'MABIKA', 'ONDO', 'MOUSSAVOU', 'EKOMI'][i % 6]}`,
      location: {
        address: `Quartier ${['Louis', 'Batterie IV', 'Akébé', 'Nombakélé', 'Lalala', 'Mont-Bouët', 'Glass', 'Nzeng-Ayong'][i % 8]}`,
        city: 'Libreville',
        province: 'Estuaire',
        coordinates: { latitude: 0.3901 + (i * 0.01), longitude: 9.4544 + (i * 0.01) }
      },
      contact: {
        phoneMain: `+241 01-${70 + i}-${10 + i}-00`,
        phoneEmergency: `+241 01-${70 + i}-${10 + i}-15`,
        email: `contact@${nom.toLowerCase().replace(/\s+/g, '')}.ga`
      },
      metrics: {
        totalBeds: 30 + Math.floor(Math.random() * 50),
        occupiedBeds: 0,
        occupancyRate: 65 + Math.floor(Math.random() * 25),
        consultationsMonthly: 1500 + Math.floor(Math.random() * 2000),
        surgeriesMonthly: 50 + Math.floor(Math.random() * 100),
        emergenciesMonthly: 300 + Math.floor(Math.random() * 400),
        patientSatisfaction: 4.0 + Math.random() * 0.8,
        averageWaitTime: '1h00',
        averageStayDuration: '3 jours'
      },
      staff: {
        doctors: 8 + Math.floor(Math.random() * 12),
        specialists: 4 + Math.floor(Math.random() * 8),
        nurses: 25 + Math.floor(Math.random() * 30),
        technicians: 8 + Math.floor(Math.random() * 10),
        administrative: 12 + Math.floor(Math.random() * 10),
        support: 15 + Math.floor(Math.random() * 15),
        total: 72 + Math.floor(Math.random() * 85)
      },
      services: [
        {
          id: `srv-${id * 10}`,
          name: 'Consultation générale',
          category: 'consultation',
          available: true,
          operationalHours: '07h00 - 20h00',
          staffCount: 10
        },
        {
          id: `srv-${id * 10 + 1}`,
          name: 'Urgences',
          category: 'urgence',
          available: i < 10,
          operationalHours: i < 10 ? '24/7' : '08h00 - 20h00',
          staffCount: 8
        }
      ],
      equipment: [
        {
          id: `eq-${id * 10}`,
          name: 'Échographie',
          category: 'imagerie',
          quantity: 1 + Math.floor(Math.random() * 2),
          functional: 1,
          maintenance: 0,
          broken: 0
        }
      ],
      certifications: [{
        id: `cert-${id}`,
        type: 'autorisation',
        name: 'Autorisation d\'exploitation privée',
        issuedBy: 'Ministère de la Santé',
        issuedDate: '2018-01-01',
        expiryDate: '2028-01-01',
        status: 'valide'
      }],
      insuranceAccepted: ['CNAMGS', 'CNSS', 'Privé'],
      createdAt: '2005-01-01',
      updatedAt: '2025-11-01',
      isPublic: false,
      isEmergencyCenter: i < 10,
      isReferralCenter: false,
      isTeachingHospital: false,
      hasAmbulance: i < 5,
      hasPharmacy: true,
      hasLaboratory: i < 8,
      hasMortuary: false
    });
  });

  return cliniques;
};

// Générer dispensaires
const generateDispensaires = () => {
  const dispensaires: any[] = [];
  let id = 150;
  
  provinces.forEach(province => {
    const count = province.name === 'Estuaire' ? 5 : 2;
    
    for (let i = 0; i < count; i++) {
      dispensaires.push({
        id: `est-${String(id++).padStart(3, '0')}`,
        code: `DIS-${province.name.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
        name: `Dispensaire ${province.capital} ${i + 1}`,
        category: 'dispensaire',
        level: 'communautaire',
        status: 'operationnel',
        managingAuthority: i % 2 === 0 ? 'Ministère de la Santé' : 'Confessionnel',
        location: {
          address: `Village/Quartier ${i + 1}`,
          city: province.capital,
          province: province.name,
          coordinates: {
            latitude: province.coords.lat + (Math.random() - 0.5) * 0.1,
            longitude: province.coords.lng + (Math.random() - 0.5) * 0.1
          }
        },
        contact: {
          phoneMain: `+241 07-${60 + id}-${10 + i}-00`,
          email: `dispensaire${i + 1}.${province.capital.toLowerCase()}@sante.gouv.ga`
        },
        metrics: {
          totalBeds: 5,
          occupiedBeds: 3,
          occupancyRate: 60,
          consultationsMonthly: 300 + Math.floor(Math.random() * 200),
          surgeriesMonthly: 0,
          emergenciesMonthly: 80 + Math.floor(Math.random() * 50),
          patientSatisfaction: 3.8 + Math.random() * 0.5,
          averageWaitTime: '30min',
          averageStayDuration: '1 jour'
        },
        staff: {
          doctors: 0,
          specialists: 0,
          nurses: 3,
          technicians: 1,
          administrative: 1,
          support: 2,
          total: 7
        },
        services: [
          {
            id: `srv-${id * 10}`,
            name: 'Soins primaires',
            category: 'consultation',
            available: true,
            operationalHours: '08h00 - 17h00',
            staffCount: 3
          }
        ],
        equipment: [],
        certifications: [{
          id: `cert-${id}`,
          type: 'autorisation',
          name: 'Autorisation d\'exploitation',
          issuedBy: 'Direction Provinciale de la Santé',
          issuedDate: '2015-01-01',
          expiryDate: '2025-01-01',
          status: 'valide'
        }],
        insuranceAccepted: ['CNAMGS', 'CNSS'],
        createdAt: '2000-01-01',
        updatedAt: '2025-11-01',
        isPublic: i % 2 === 0,
        isEmergencyCenter: false,
        isReferralCenter: false,
        isTeachingHospital: false,
        hasAmbulance: false,
        hasPharmacy: false,
        hasLaboratory: false,
        hasMortuary: false
      });
    }
  });
  
  return dispensaires;
};

// Générer pharmacies
const generatePharmacies = () => {
  const pharmacies: any[] = [];
  let id = 180;
  
  const pharmaciesLibreville = [
    'Pharmacie Centrale',
    'Pharmacie du Port',
    'Pharmacie Mont-Bouët',
    'Pharmacie Glass',
    'Pharmacie Nombakélé',
    'Pharmacie Akébé',
    'Pharmacie Owendo',
    'Pharmacie Sotega',
    'Pharmacie du Rond-Point',
    'Pharmacie Batterie IV'
  ];

  pharmaciesLibreville.forEach((nom, i) => {
    pharmacies.push({
      id: `est-${String(id++).padStart(3, '0')}`,
      code: `PHA-LBV-${String(i + 1).padStart(3, '0')}`,
      name: nom,
      category: 'pharmacie',
      level: 'local',
      status: 'operationnel',
      managingAuthority: 'Ordre des Pharmaciens du Gabon',
      director: `Pharm. ${['Marie', 'Paul', 'Jean'][i % 3]} ${['NZAMBA', 'OBIANG', 'MABIKA'][i % 3]}`,
      location: {
        address: `Quartier ${['Louis', 'Batterie IV', 'Mont-Bouët', 'Glass'][i % 4]}`,
        city: 'Libreville',
        province: 'Estuaire',
        coordinates: { latitude: 0.3901 + (i * 0.01), longitude: 9.4544 + (i * 0.01) }
      },
      contact: {
        phoneMain: `+241 01-${75 + i}-${20 + i}-00`,
        email: `${nom.toLowerCase().replace(/\s+/g, '')}@pharmacies.ga`
      },
      metrics: {
        totalBeds: 0,
        occupiedBeds: 0,
        occupancyRate: 0,
        consultationsMonthly: 2000 + Math.floor(Math.random() * 1500),
        surgeriesMonthly: 0,
        emergenciesMonthly: 0,
        patientSatisfaction: 4.2 + Math.random() * 0.6,
        averageWaitTime: '15min',
        averageStayDuration: 'N/A'
      },
      staff: {
        doctors: 0,
        specialists: 0,
        nurses: 0,
        technicians: 3 + Math.floor(Math.random() * 3),
        administrative: 2,
        support: 2,
        total: 7 + Math.floor(Math.random() * 5)
      },
      services: [
        {
          id: `srv-${id * 10}`,
          name: 'Dispensation médicaments',
          category: 'pharmacie',
          available: true,
          operationalHours: '08h00 - 20h00',
          staffCount: 4
        }
      ],
      equipment: [],
      certifications: [{
        id: `cert-${id}`,
        type: 'licence',
        name: 'Licence de pharmacie',
        issuedBy: 'Ordre des Pharmaciens du Gabon',
        issuedDate: '2015-01-01',
        expiryDate: '2030-01-01',
        status: 'valide'
      }],
      insuranceAccepted: ['CNAMGS', 'CNSS', 'Privé'],
      createdAt: '2008-01-01',
      updatedAt: '2025-11-01',
      isPublic: false,
      isEmergencyCenter: false,
      isReferralCenter: false,
      isTeachingHospital: false,
      hasAmbulance: false,
      hasPharmacy: true,
      hasLaboratory: false,
      hasMortuary: false
    });
  });
  
  return pharmacies;
};

// Générer laboratoires
const generateLaboratoires = () => {
  const laboratoires: any[] = [];
  let id = 190;
  
  const labos = [
    { nom: 'Laboratoire CERMEL', ville: 'Libreville', province: 'Estuaire' },
    { nom: 'Laboratoire CIRMF', ville: 'Franceville', province: 'Haut-Ogooué' },
    { nom: 'Laboratoire LNSP', ville: 'Libreville', province: 'Estuaire' },
    { nom: 'Laboratoire Bio-Santé', ville: 'Port-Gentil', province: 'Ogooué-Maritime' }
  ];

  labos.forEach((labo, i) => {
    laboratoires.push({
      id: `est-${String(id++).padStart(3, '0')}`,
      code: `LAB-${labo.ville.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      name: labo.nom,
      category: 'laboratoire',
      level: 'local',
      status: 'operationnel',
      managingAuthority: i < 2 ? 'Recherche Publique' : 'Privé',
      director: `Dr. ${['Pierre', 'Marie', 'Joseph', 'Sophie'][i]} ${['ANGA', 'OBAME', 'IKOGOU', 'NTOUTOUME'][i]}`,
      location: {
        address: `Zone ${['Universitaire', 'Recherche', 'Industrielle', 'Centre-ville'][i]}`,
        city: labo.ville,
        province: labo.province,
        coordinates: provinces.find(p => p.name === labo.province)!.coords
      },
      contact: {
        phoneMain: `+241 01-${78 + i}-00-00`,
        email: `contact@${labo.nom.toLowerCase().replace(/\s+/g, '')}.ga`
      },
      metrics: {
        totalBeds: 0,
        occupiedBeds: 0,
        occupancyRate: 0,
        consultationsMonthly: 3000 + Math.floor(Math.random() * 2000),
        surgeriesMonthly: 0,
        emergenciesMonthly: 0,
        patientSatisfaction: 4.3 + Math.random() * 0.5,
        averageWaitTime: '45min',
        averageStayDuration: 'N/A'
      },
      staff: {
        doctors: 5 + Math.floor(Math.random() * 10),
        specialists: 3 + Math.floor(Math.random() * 7),
        nurses: 0,
        technicians: 15 + Math.floor(Math.random() * 20),
        administrative: 8,
        support: 10,
        total: 41 + Math.floor(Math.random() * 37)
      },
      services: [
        {
          id: `srv-${id * 10}`,
          name: 'Analyses médicales',
          category: 'laboratoire',
          available: true,
          operationalHours: '07h00 - 18h00',
          staffCount: 12
        }
      ],
      equipment: [
        {
          id: `eq-${id * 10}`,
          name: 'Analyseur hématologie',
          category: 'laboratoire',
          quantity: 2,
          functional: 2,
          maintenance: 0,
          broken: 0
        }
      ],
      certifications: [{
        id: `cert-${id}`,
        type: 'accreditation',
        name: 'Accréditation Laboratoire',
        issuedBy: 'Ministère de la Santé',
        issuedDate: '2022-01-01',
        expiryDate: '2027-01-01',
        status: 'valide'
      }],
      insuranceAccepted: ['CNAMGS', 'CNSS', 'Privé'],
      createdAt: '2010-01-01',
      updatedAt: '2025-11-01',
      isPublic: i < 2,
      isEmergencyCenter: false,
      isReferralCenter: false,
      isTeachingHospital: i === 1,
      hasAmbulance: false,
      hasPharmacy: false,
      hasLaboratory: true,
      hasMortuary: false
    });
  });
  
  return laboratoires;
};

export const generateAllEstablishments = (): Establishment[] => {
  const chd = generateCHD();
  const centres = generateCentresSante();
  const cliniques = generateCliniquesPrivees();
  const dispensaires = generateDispensaires();
  const pharmacies = generatePharmacies();
  const laboratoires = generateLaboratoires();
  
  return [
    ...chd,         // 15
    ...centres,     // 95
    ...cliniques,   // 15
    ...dispensaires,// 29
    ...pharmacies,  // 10
    ...laboratoires // 4
    // Total généré: ~168
    // À ajouter aux 14 existants = ~182
    // Reste ~56 à générer manuellement ou via import
  ];
};

console.log('Script de génération prêt. Exécutez generateAllEstablishments() pour générer les établissements.');

