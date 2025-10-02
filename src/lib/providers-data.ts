// Données mockées des prestataires de santé au Gabon
export type ProviderType = 'medecin' | 'pharmacie' | 'laboratoire' | 'hopital' | 'imagerie';
export type Speciality = 'generaliste' | 'cardiologue' | 'gynecologue' | 'pediatre' | 'dentiste' | 'autre';

export interface Provider {
  id: string;
  type: ProviderType;
  name: string;
  specialty?: Speciality;
  specialtyLabel?: string;
  photo?: string;
  rating: number;
  reviewCount: number;
  address: string;
  city: string;
  province: string;
  distance?: number;
  lat: number;
  lng: number;
  phone: string;
  email?: string;
  
  // Disponibilité
  isOpen24h?: boolean;
  isOpenNow?: boolean;
  availableToday?: boolean;
  acceptsNewPatients?: boolean;
  
  // Assurances
  cnamgsConventioned: boolean;
  acceptsCNSS: boolean;
  mutuelles?: string[];
  
  // Services
  telemedicine?: boolean;
  onlineBooking?: boolean;
  onlinePayment?: boolean;
  hasImaging?: boolean;
  hasLaboratory?: boolean;
  hasEmergency?: boolean;
  
  // Tarifs
  consultationPrice?: number;
  cnamgsPrice?: number;
  
  // Horaires
  schedule?: {
    [key: string]: string;
  };
  
  // Description
  description?: string;
  equipment?: string[];
  paymentMethods?: string[];
}

export const mockProviders: Provider[] = [
  // Médecins
  {
    id: '1',
    type: 'medecin',
    name: 'Dr KOMBILA Pierre',
    specialty: 'cardiologue',
    specialtyLabel: 'Cardiologue',
    photo: '/placeholder.svg',
    rating: 4.8,
    reviewCount: 124,
    address: 'Cabinet Montagne Sainte, Boulevard Triomphal',
    city: 'Libreville',
    province: 'Estuaire',
    distance: 1.8,
    lat: 0.4162,
    lng: 9.4673,
    phone: '+241 062 45 78 90',
    email: 'dr.kombila@sante.ga',
    isOpenNow: true,
    availableToday: true,
    acceptsNewPatients: true,
    cnamgsConventioned: true,
    acceptsCNSS: true,
    mutuelles: ['ASCOMA', 'SOGAC'],
    telemedicine: true,
    onlineBooking: true,
    onlinePayment: true,
    consultationPrice: 25000,
    cnamgsPrice: 9000,
    schedule: {
      'Lundi - Vendredi': '08:00 - 17:00',
      'Samedi': '09:00 - 13:00',
      'Dimanche': 'Fermé'
    },
    description: 'Spécialiste en cardiologie avec plus de 15 ans d\'expérience',
    equipment: ['Échodoppler cardiaque', 'ECG', 'Holter tensionnel'],
    paymentMethods: ['Espèces', 'Mobile Money', 'Carte bancaire']
  },
  {
    id: '2',
    type: 'medecin',
    name: 'Dr LEBIGRE Marie',
    specialty: 'gynecologue',
    specialtyLabel: 'Gynécologue-Obstétricienne',
    photo: '/placeholder.svg',
    rating: 4.9,
    reviewCount: 198,
    address: 'Polyclinique El Rapha, Quartier Louis',
    city: 'Libreville',
    province: 'Estuaire',
    distance: 3.2,
    lat: 0.4268,
    lng: 9.4514,
    phone: '+241 062 88 99 00',
    email: 'dr.lebigre@elrapha.ga',
    isOpenNow: true,
    availableToday: true,
    acceptsNewPatients: true,
    cnamgsConventioned: true,
    acceptsCNSS: true,
    mutuelles: ['ASCOMA', 'SAHAM', 'SOGAC'],
    telemedicine: false,
    onlineBooking: true,
    onlinePayment: false,
    consultationPrice: 30000,
    cnamgsPrice: 10000,
    schedule: {
      'Lundi - Vendredi': '08:00 - 16:00',
      'Samedi': '09:00 - 12:00',
      'Dimanche': 'Fermé'
    },
    description: 'Spécialiste en gynécologie et suivi de grossesse',
    equipment: ['Échographie obstétricale', 'Monitoring foetal'],
    paymentMethods: ['Espèces', 'Mobile Money']
  },
  {
    id: '3',
    type: 'medecin',
    name: 'Dr MOUSSAVOU Jean',
    specialty: 'generaliste',
    specialtyLabel: 'Médecin Généraliste',
    photo: '/placeholder.svg',
    rating: 4.6,
    reviewCount: 87,
    address: 'Cabinet Médical Akébé, Akébé-Plaine',
    city: 'Libreville',
    province: 'Estuaire',
    distance: 5.1,
    lat: 0.4089,
    lng: 9.4321,
    phone: '+241 062 33 44 55',
    isOpenNow: true,
    availableToday: true,
    acceptsNewPatients: true,
    cnamgsConventioned: true,
    acceptsCNSS: false,
    mutuelles: ['ASCOMA'],
    telemedicine: true,
    onlineBooking: false,
    consultationPrice: 15000,
    cnamgsPrice: 6000,
    schedule: {
      'Lundi - Vendredi': '07:30 - 19:00',
      'Samedi': '08:00 - 14:00',
      'Dimanche': '09:00 - 12:00'
    },
    paymentMethods: ['Espèces', 'Mobile Money']
  },
  
  // Pharmacies
  {
    id: '4',
    type: 'pharmacie',
    name: 'Pharmacie de la Grâce',
    rating: 4.5,
    reviewCount: 89,
    address: 'Angondjé, Route Nationale 1',
    city: 'Libreville',
    province: 'Estuaire',
    distance: 0.5,
    lat: 0.4356,
    lng: 9.4789,
    phone: '+241 062 94 94 24',
    isOpen24h: true,
    isOpenNow: true,
    cnamgsConventioned: true,
    acceptsCNSS: true,
    mutuelles: ['ASCOMA', 'SOGAC', 'SAHAM'],
    onlinePayment: true,
    schedule: {
      'Tous les jours': '24h/24'
    },
    paymentMethods: ['Espèces', 'Mobile Money', 'Carte bancaire'],
    description: 'Pharmacie de garde 24h/24, livraison à domicile disponible'
  },
  {
    id: '5',
    type: 'pharmacie',
    name: 'Pharmacie du Centre',
    rating: 4.7,
    reviewCount: 156,
    address: 'Centre-ville, Avenue du Colonel Parant',
    city: 'Libreville',
    province: 'Estuaire',
    distance: 2.1,
    lat: 0.3924,
    lng: 9.4537,
    phone: '+241 011 72 33 44',
    isOpen24h: false,
    isOpenNow: true,
    cnamgsConventioned: true,
    acceptsCNSS: true,
    mutuelles: ['ASCOMA', 'SOGAC'],
    schedule: {
      'Lundi - Samedi': '08:00 - 20:00',
      'Dimanche': '09:00 - 13:00'
    },
    paymentMethods: ['Espèces', 'Mobile Money']
  },
  
  // Hôpitaux
  {
    id: '6',
    type: 'hopital',
    name: 'Polyclinique Dr. Chambrier',
    rating: 4.9,
    reviewCount: 256,
    address: 'Montagne Sainte, Boulevard Triomphal',
    city: 'Libreville',
    province: 'Estuaire',
    distance: 2.3,
    lat: 0.4145,
    lng: 9.4701,
    phone: '+241 011 76 14 68',
    email: 'contact@chambrier.ga',
    isOpen24h: true,
    isOpenNow: true,
    cnamgsConventioned: true,
    acceptsCNSS: true,
    mutuelles: ['ASCOMA', 'SOGAC', 'SAHAM'],
    hasImaging: true,
    hasLaboratory: true,
    hasEmergency: true,
    onlineBooking: true,
    schedule: {
      'Urgences': '24h/24 - 7j/7',
      'Consultations': 'Lun-Ven 08:00-18:00'
    },
    description: 'Établissement privé avec plateau technique complet',
    equipment: ['IRM', 'Scanner', 'Échographie', 'Radiologie', 'Laboratoire complet'],
    paymentMethods: ['Espèces', 'Mobile Money', 'Carte bancaire', 'Assurances']
  },
  {
    id: '7',
    type: 'hopital',
    name: 'CHU de Libreville',
    rating: 4.2,
    reviewCount: 412,
    address: 'Owendo, Route Nationale',
    city: 'Libreville',
    province: 'Estuaire',
    distance: 8.5,
    lat: 0.3012,
    lng: 9.5023,
    phone: '+241 011 70 00 00',
    isOpen24h: true,
    isOpenNow: true,
    cnamgsConventioned: true,
    acceptsCNSS: true,
    mutuelles: ['ASCOMA', 'SOGAC', 'SAHAM'],
    hasImaging: true,
    hasLaboratory: true,
    hasEmergency: true,
    schedule: {
      'Urgences': '24h/24 - 7j/7',
      'Consultations': 'Lun-Ven 07:00-15:00'
    },
    description: 'Centre Hospitalier Universitaire de référence',
    equipment: ['IRM', 'Scanner', 'Radiologie', 'Bloc opératoire', 'Laboratoire'],
    paymentMethods: ['Espèces', 'Assurances']
  },
  
  // Laboratoires
  {
    id: '8',
    type: 'laboratoire',
    name: 'BIOLAB Libreville',
    rating: 4.7,
    reviewCount: 178,
    address: 'Montagne Sainte, près du Rond-Point',
    city: 'Libreville',
    province: 'Estuaire',
    distance: 1.9,
    lat: 0.4178,
    lng: 9.4689,
    phone: '+241 011 73 45 67',
    isOpenNow: true,
    cnamgsConventioned: true,
    acceptsCNSS: true,
    mutuelles: ['ASCOMA', 'SOGAC'],
    onlineBooking: true,
    schedule: {
      'Lundi - Vendredi': '07:00 - 17:00',
      'Samedi': '07:30 - 12:00',
      'Dimanche': 'Fermé'
    },
    description: 'Laboratoire d\'analyses médicales complet',
    equipment: ['Biochimie', 'Hématologie', 'Sérologie', 'Bactériologie'],
    paymentMethods: ['Espèces', 'Mobile Money', 'Carte bancaire']
  },
  
  // Port-Gentil
  {
    id: '9',
    type: 'medecin',
    name: 'Dr NDONG Sylvie',
    specialty: 'pediatre',
    specialtyLabel: 'Pédiatre',
    rating: 4.8,
    reviewCount: 92,
    address: 'Centre Médical Mbambou, Quartier Mbambou',
    city: 'Port-Gentil',
    province: 'Ogooué-Maritime',
    distance: null,
    lat: -0.7193,
    lng: 8.7815,
    phone: '+241 062 55 66 77',
    isOpenNow: true,
    availableToday: true,
    acceptsNewPatients: true,
    cnamgsConventioned: true,
    acceptsCNSS: true,
    mutuelles: ['ASCOMA'],
    telemedicine: false,
    onlineBooking: false,
    consultationPrice: 20000,
    cnamgsPrice: 8000,
    schedule: {
      'Lundi - Vendredi': '08:00 - 17:00',
      'Samedi': '09:00 - 12:00',
      'Dimanche': 'Fermé'
    },
    paymentMethods: ['Espèces', 'Mobile Money']
  },
  {
    id: '10',
    type: 'pharmacie',
    name: 'Pharmacie Sogatra',
    rating: 4.6,
    reviewCount: 67,
    address: 'Boulevard Président Léon MBA',
    city: 'Port-Gentil',
    province: 'Ogooué-Maritime',
    distance: null,
    lat: -0.7213,
    lng: 8.7835,
    phone: '+241 011 55 66 77',
    isOpen24h: false,
    isOpenNow: true,
    cnamgsConventioned: true,
    acceptsCNSS: true,
    mutuelles: ['ASCOMA', 'SOGAC'],
    schedule: {
      'Lundi - Samedi': '08:00 - 19:00',
      'Dimanche': 'Fermé'
    },
    paymentMethods: ['Espèces', 'Mobile Money']
  }
];

export const providerTypeLabels: Record<ProviderType, string> = {
  medecin: 'Médecin',
  pharmacie: 'Pharmacie',
  laboratoire: 'Laboratoire',
  hopital: 'Hôpital / Clinique',
  imagerie: 'Centre d\'Imagerie'
};

export const specialityLabels: Record<Speciality, string> = {
  generaliste: 'Médecin Généraliste',
  cardiologue: 'Cardiologue',
  gynecologue: 'Gynécologue',
  pediatre: 'Pédiatre',
  dentiste: 'Dentiste',
  autre: 'Autre Spécialité'
};
