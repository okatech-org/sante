import { LucideIcon, Home, Calendar, Users, Video, ClipboardList, Pill, DollarSign, TrendingUp, Mail, Stethoscope, Link2, Settings, BarChart3, Shield, Activity, FileText, Package, Building2, UserPlus, BookOpen, Briefcase, Clipboard, LayoutDashboard, UserCog, MessageSquare } from "lucide-react";

export interface MenuSection {
  label: string;
  items: MenuItem[];
}

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
  permission?: string;
}

// Types d'établissements
export type EstablishmentType = 
  | 'hopital' 
  | 'clinique' 
  | 'centre_medical' 
  | 'cabinet_medical' 
  | 'pharmacie' 
  | 'laboratoire'
  | 'centre_sante';

// Rôles professionnels
export type ProfessionalRole = 
  | 'admin' 
  | 'director' 
  | 'doctor' 
  | 'nurse' 
  | 'pharmacist' 
  | 'laborantin' 
  | 'receptionist';

// ============= MENUS ADMIN =============

// Menu Admin pour Hôpital/Clinique
const adminHospitalMenu: MenuSection[] = [
  {
    label: "Général",
    items: [
      { icon: Home, label: "Tableau de bord", href: "/dashboard/professional" },
      { icon: BarChart3, label: "Statistiques", href: "/professional/stats" }
    ]
  },
  {
    label: "Activité Médicale",
    items: [
      { icon: Calendar, label: "Agenda & RDV", href: "/professional/agenda", badge: 8, permission: "manage_appointments" },
      { icon: Users, label: "Patients", href: "/professional/patients", permission: "view_patients" },
      { icon: ClipboardList, label: "Consultations", href: "/professional/consultations", permission: "view_consultations" },
      { icon: Video, label: "Téléconsultations", href: "/professional/teleconsultations" }
    ]
  },
  {
    label: "Direction Médicale",
    items: [
      { icon: Stethoscope, label: "Corps médical", href: "/professional/medical-staff", permission: "manage_staff" },
      { icon: Activity, label: "Services", href: "/professional/departments", permission: "manage_departments" },
      { icon: FileText, label: "Protocoles", href: "/professional/protocols" }
    ]
  },
  {
    label: "Administration",
    items: [
      { icon: Shield, label: "Personnel", href: "/professional/staff", permission: "manage_staff" },
      { icon: DollarSign, label: "Finances & CNAMGS", href: "/professional/finances", permission: "view_finances" },
      { icon: Building2, label: "Infrastructure", href: "/professional/infrastructure" },
      { icon: Package, label: "Stocks & Pharmacie", href: "/professional/inventory" }
    ]
  },
  {
    label: "Communication",
    items: [
      { icon: Mail, label: "Messages", href: "/professional/messages", badge: 5 },
      { icon: Link2, label: "Intégrations", href: "/professional/integrations" },
      { icon: Settings, label: "Paramètres", href: "/professional/settings", permission: "edit_settings" }
    ]
  }
];

// Menu Admin pour Cabinet Médical
const adminCabinetMenu: MenuSection[] = [
  {
    label: "Général",
    items: [
      { icon: Home, label: "Tableau de bord", href: "/dashboard/professional" },
      { icon: Calendar, label: "Agenda", href: "/professional/agenda", badge: 8 }
    ]
  },
  {
    label: "Patients & Soins",
    items: [
      { icon: Users, label: "Patients", href: "/professional/patients" },
      { icon: ClipboardList, label: "Consultations", href: "/professional/consultations" },
      { icon: Pill, label: "Prescriptions", href: "/professional/prescriptions" },
      { icon: Video, label: "Téléconsultations", href: "/professional/teleconsultations" }
    ]
  },
  {
    label: "Gestion",
    items: [
      { icon: DollarSign, label: "Finances", href: "/professional/finances" },
      { icon: TrendingUp, label: "Statistiques", href: "/professional/stats" },
      { icon: UserPlus, label: "Personnel", href: "/professional/staff" }
    ]
  },
  {
    label: "Paramètres",
    items: [
      { icon: Mail, label: "Messages", href: "/professional/messages", badge: 3 },
      { icon: Settings, label: "Paramètres", href: "/professional/settings" }
    ]
  }
];

// Menu Admin pour Pharmacie
const adminPharmacieMenu: MenuSection[] = [
  {
    label: "Général",
    items: [
      { icon: Home, label: "Tableau de bord", href: "/dashboard/professional" },
      { icon: TrendingUp, label: "Statistiques", href: "/professional/stats" }
    ]
  },
  {
    label: "Pharmacie",
    items: [
      { icon: Package, label: "Stocks", href: "/professional/inventory" },
      { icon: Pill, label: "Ordonnances", href: "/professional/prescriptions" },
      { icon: ClipboardList, label: "Dispensations", href: "/professional/dispensations" },
      { icon: Briefcase, label: "Fournisseurs", href: "/professional/suppliers" }
    ]
  },
  {
    label: "Gestion",
    items: [
      { icon: Users, label: "Clients", href: "/professional/patients" },
      { icon: DollarSign, label: "Finances", href: "/professional/finances" },
      { icon: Shield, label: "Personnel", href: "/professional/staff" }
    ]
  },
  {
    label: "Paramètres",
    items: [
      { icon: Mail, label: "Messages", href: "/professional/messages" },
      { icon: Settings, label: "Paramètres", href: "/professional/settings" }
    ]
  }
];

// ============= MENUS MÉDECIN =============

// Menu Médecin pour Hôpital/Clinique
const doctorHospitalMenu: MenuSection[] = [
  {
    label: "Général",
    items: [
      { icon: Home, label: "Tableau de bord", href: "/dashboard/professional" },
      { icon: Calendar, label: "Mon agenda", href: "/professional/agenda", badge: 8 }
    ]
  },
  {
    label: "Activité Médicale",
    items: [
      { icon: Users, label: "Mes patients", href: "/professional/patients" },
      { icon: ClipboardList, label: "Consultations", href: "/professional/consultations" },
      { icon: Video, label: "Téléconsultations", href: "/professional/teleconsultations" },
      { icon: Pill, label: "Prescriptions", href: "/professional/prescriptions" },
      { icon: Stethoscope, label: "Télé-expertise", href: "/professional/tele-expertise" }
    ]
  },
  {
    label: "Personnel",
    items: [
      { icon: TrendingUp, label: "Mes statistiques", href: "/professional/stats" },
      { icon: DollarSign, label: "Mes finances", href: "/professional/finances" },
      { icon: Mail, label: "Messages", href: "/professional/messages", badge: 5 }
    ]
  },
  {
    label: "Paramètres",
    items: [
      { icon: Settings, label: "Paramètres", href: "/professional/settings" }
    ]
  }
];

// Menu Médecin pour Cabinet Médical
const doctorCabinetMenu: MenuSection[] = [
  {
    label: "Général",
    items: [
      { icon: Home, label: "Tableau de bord", href: "/dashboard/professional" },
      { icon: Calendar, label: "Agenda & RDV", href: "/professional/agenda", badge: 5 }
    ]
  },
  {
    label: "Patients & Soins",
    items: [
      { icon: Users, label: "Mes patients", href: "/professional/patients" },
      { icon: ClipboardList, label: "Consultations", href: "/professional/consultations" },
      { icon: Video, label: "Téléconsultations", href: "/professional/teleconsultations" },
      { icon: Pill, label: "Prescriptions", href: "/professional/prescriptions" }
    ]
  },
  {
    label: "Gestion",
    items: [
      { icon: DollarSign, label: "Finances", href: "/professional/finances" },
      { icon: TrendingUp, label: "Statistiques", href: "/professional/stats" }
    ]
  },
  {
    label: "Paramètres",
    items: [
      { icon: Mail, label: "Messages", href: "/professional/messages", badge: 3 },
      { icon: Settings, label: "Paramètres", href: "/professional/settings" }
    ]
  }
];

// Menu Médecin pour Pharmacie (Pharmacien responsable)
const doctorPharmacieMenu: MenuSection[] = [
  {
    label: "Général",
    items: [
      { icon: Home, label: "Tableau de bord", href: "/dashboard/professional" }
    ]
  },
  {
    label: "Activité Pharmaceutique",
    items: [
      { icon: Package, label: "Gestion stocks", href: "/professional/inventory" },
      { icon: Pill, label: "Ordonnances", href: "/professional/prescriptions" },
      { icon: ClipboardList, label: "Dispensations", href: "/professional/dispensations" },
      { icon: Users, label: "Clients", href: "/professional/patients" }
    ]
  },
  {
    label: "Gestion",
    items: [
      { icon: DollarSign, label: "Finances", href: "/professional/finances" },
      { icon: TrendingUp, label: "Statistiques", href: "/professional/stats" }
    ]
  },
  {
    label: "Paramètres",
    items: [
      { icon: Settings, label: "Paramètres", href: "/professional/settings" }
    ]
  }
];

// ============= MAPPING DES MENUS =============

export const MENU_DEFINITIONS: Record<EstablishmentType, Record<ProfessionalRole, MenuSection[]>> = {
  hopital: {
    admin: adminHospitalMenu,
    director: adminHospitalMenu,
    doctor: doctorHospitalMenu,
    nurse: doctorHospitalMenu, // Similaire au médecin mais avec permissions réduites
    pharmacist: doctorPharmacieMenu,
    laborantin: doctorHospitalMenu,
    receptionist: []
  },
  clinique: {
    admin: adminHospitalMenu,
    director: adminHospitalMenu,
    doctor: doctorHospitalMenu,
    nurse: doctorHospitalMenu,
    pharmacist: doctorPharmacieMenu,
    laborantin: doctorHospitalMenu,
    receptionist: []
  },
  centre_medical: {
    admin: adminHospitalMenu,
    director: adminHospitalMenu,
    doctor: doctorHospitalMenu,
    nurse: doctorHospitalMenu,
    pharmacist: doctorPharmacieMenu,
    laborantin: doctorHospitalMenu,
    receptionist: []
  },
  cabinet_medical: {
    admin: adminCabinetMenu,
    director: adminCabinetMenu,
    doctor: doctorCabinetMenu,
    nurse: doctorCabinetMenu,
    pharmacist: doctorCabinetMenu,
    laborantin: doctorCabinetMenu,
    receptionist: []
  },
  pharmacie: {
    admin: adminPharmacieMenu,
    director: adminPharmacieMenu,
    doctor: doctorPharmacieMenu,
    nurse: [],
    pharmacist: doctorPharmacieMenu,
    laborantin: [],
    receptionist: []
  },
  laboratoire: {
    admin: adminHospitalMenu,
    director: adminHospitalMenu,
    doctor: doctorHospitalMenu,
    nurse: [],
    pharmacist: [],
    laborantin: doctorHospitalMenu,
    receptionist: []
  },
  centre_sante: {
    admin: adminHospitalMenu,
    director: adminHospitalMenu,
    doctor: doctorHospitalMenu,
    nurse: doctorHospitalMenu,
    pharmacist: doctorPharmacieMenu,
    laborantin: doctorHospitalMenu,
    receptionist: []
  }
};

// Fonction pour obtenir le menu selon l'établissement et le rôle
export function getMenuForContext(
  establishmentType: string, 
  role: string
): MenuSection[] {
  const normalizedType = establishmentType.toLowerCase() as EstablishmentType;
  const normalizedRole = role.toLowerCase() as ProfessionalRole;
  
  // Si le type ou rôle n'existe pas, retourner menu par défaut
  if (!MENU_DEFINITIONS[normalizedType] || !MENU_DEFINITIONS[normalizedType][normalizedRole]) {
    return adminCabinetMenu; // Menu par défaut
  }
  
  return MENU_DEFINITIONS[normalizedType][normalizedRole];
}

// Labels pour les rôles
export const ROLE_LABELS: Record<string, string> = {
  'director': 'Directeur',
  'admin': 'Administrateur',
  'doctor': 'Médecin',
  'nurse': 'Infirmier(e)',
  'pharmacist': 'Pharmacien(ne)',
  'laborantin': 'Laborantin(e)',
  'receptionist': 'Réceptionniste'
};

// ============= MENU DIRECTEUR (5 sections) =============
export const DIRECTOR_MENU: MenuSection[] = [
  {
    id: 'general',
    label: 'GÉNÉRAL',
    items: [
      { label: "Vue d'ensemble", href: '/professional/dashboard', icon: LayoutDashboard },
      { label: 'Statistiques', href: '/professional/statistics', icon: BarChart3 }
    ]
  },
  {
    id: 'medical-activity', 
    label: 'ACTIVITÉ MÉDICALE',
    items: [
      { label: 'Rendez-vous', href: '/professional/appointments', icon: Calendar, badge: 8 },
      { label: 'Consultations', href: '/professional/consultations', icon: Stethoscope },
      { label: 'Prescriptions', href: '/professional/prescriptions', icon: FileText },
      { label: 'Mes Patients', href: '/professional/patients', icon: Users }
    ]
  },
  {
    id: 'medical-direction',
    label: 'DIRECTION MÉDICALE', 
    items: [
      { label: 'Hospitalisation', href: '/professional/hospitalization', icon: Building2 },
      { label: 'Plateaux Techniques', href: '/professional/technical', icon: Activity }
    ]
  },
  {
    id: 'administration',
    label: 'ADMINISTRATION',
    items: [
      { label: 'Personnel', href: '/professional/staff', icon: UserCog, permission: 'manage_staff' },
      { label: 'Facturation', href: '/professional/billing', icon: DollarSign, permission: 'manage_billing' },
      { label: 'Inventaire', href: '/professional/inventory', icon: Package },
      { label: 'Rapports', href: '/professional/reports', icon: FileText }
    ]
  },
  {
    id: 'communication',
    label: 'COMMUNICATION',
    items: [
      { label: 'Messages', href: '/professional/messages', icon: MessageSquare, badge: 3 }
    ]
  }
];

// ============= MENU MÉDECIN (4 sections) =============
export const DOCTOR_MENU: MenuSection[] = [
  {
    id: 'general',
    label: 'GÉNÉRAL',
    items: [
      { label: "Vue d'ensemble", href: '/professional/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    id: 'medical-activity',
    label: 'ACTIVITÉ MÉDICALE', 
    items: [
      { label: 'Rendez-vous', href: '/professional/appointments', icon: Calendar, badge: 'Nouveau' },
      { label: 'Consultations', href: '/professional/consultations', icon: Stethoscope },
      { label: 'Prescriptions', href: '/professional/prescriptions', icon: FileText },
      { label: 'Mes Patients', href: '/professional/patients', icon: Users }
    ]
  },
  {
    id: 'medical-direction',
    label: 'DIRECTION MÉDICALE',
    items: [
      { label: 'Hospitalisation', href: '/professional/hospitalization', icon: Building2 },
      { label: 'Plateaux Techniques', href: '/professional/technical', icon: Activity }
    ]
  },
  {
    id: 'communication',
    label: 'COMMUNICATION',
    items: [
      { label: 'Messages', href: '/professional/messages', icon: MessageSquare, badge: 3 }
    ]
  }
];

// Fonction pour obtenir le menu selon le rôle
export const getMenuForRole = (role: string): MenuSection[] => {
  switch (role) {
    case 'director':
      return DIRECTOR_MENU;
    case 'doctor':
      return DOCTOR_MENU;
    case 'admin':
      return DIRECTOR_MENU; // Admin a les mêmes accès que directeur
    default:
      return DOCTOR_MENU; // Par défaut, menu médecin
  }
};
