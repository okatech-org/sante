import { LucideIcon, Home, Calendar, Users, Video, ClipboardList, Pill, DollarSign, TrendingUp, Mail, Stethoscope, Settings, BarChart3, Shield, Activity, FileText, Package, Building2, UserPlus, BookOpen, Briefcase, Clipboard, LayoutDashboard, UserCog, MessageSquare, GitBranch, CalendarDays, Wrench, Link, Heart } from "lucide-react";

export interface MenuSection {
  id?: string; // Optional for backward compatibility
  label: string;
  items: MenuItem[];
}

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
  permission?: string;
  description?: string;
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

// ============= MENU RÉCEPTIONNISTE =============
const receptionistMenu: MenuSection[] = [
  {
    label: "Tableau de bord",
    items: [
      { icon: Home, label: "Vue d'ensemble", href: "/dashboard/professional" }
    ]
  },
  {
    label: "Activité Médicale", 
    items: [
      { icon: Calendar, label: "Agenda & RDV", href: "/professional/agenda", badge: 8 },
      { icon: Users, label: "Patients", href: "/professional/patients" },
      { icon: ClipboardList, label: "Consultations", href: "/professional/consultations" }
    ]
  },
  {
    label: "Communication",
    items: [
      { icon: Mail, label: "Messages", href: "/professional/messages", badge: 3 },
      { icon: Settings, label: "Paramètres", href: "/professional/settings" }
    ]
  }
];

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
      { icon: Link, label: "Intégrations", href: "/professional/integrations" },
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
    receptionist: receptionistMenu
  },
  clinique: {
    admin: adminHospitalMenu,
    director: adminHospitalMenu,
    doctor: doctorHospitalMenu,
    nurse: doctorHospitalMenu,
    pharmacist: doctorPharmacieMenu,
    laborantin: doctorHospitalMenu,
    receptionist: receptionistMenu
  },
  centre_medical: {
    admin: adminHospitalMenu,
    director: adminHospitalMenu,
    doctor: doctorHospitalMenu,
    nurse: doctorHospitalMenu,
    pharmacist: doctorPharmacieMenu,
    laborantin: doctorHospitalMenu,
    receptionist: receptionistMenu
  },
  cabinet_medical: {
    admin: adminCabinetMenu,
    director: adminCabinetMenu,
    doctor: doctorCabinetMenu,
    nurse: doctorCabinetMenu,
    pharmacist: doctorCabinetMenu,
    laborantin: doctorCabinetMenu,
    receptionist: receptionistMenu
  },
  pharmacie: {
    admin: adminPharmacieMenu,
    director: adminPharmacieMenu,
    doctor: doctorPharmacieMenu,
    nurse: [],
    pharmacist: doctorPharmacieMenu,
    laborantin: [],
    receptionist: receptionistMenu
  },
  laboratoire: {
    admin: adminHospitalMenu,
    director: adminHospitalMenu,
    doctor: doctorHospitalMenu,
    nurse: [],
    pharmacist: [],
    laborantin: doctorHospitalMenu,
    receptionist: receptionistMenu
  },
  centre_sante: {
    admin: adminHospitalMenu,
    director: adminHospitalMenu,
    doctor: doctorHospitalMenu,
    nurse: doctorHospitalMenu,
    pharmacist: doctorPharmacieMenu,
    laborantin: doctorHospitalMenu,
    receptionist: receptionistMenu
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
  'director': 'Médecin en Chef CMST',
  'admin': 'Administrateur',
  'doctor': 'Médecin Généraliste',
  'nurse': 'Infirmier(e)',
  'pharmacist': 'Pharmacien(ne)',
  'laborantin': 'Laborantin(e)',
  'receptionist': 'Réceptionniste'
};

// ============= MENU DIRECTEUR (Médecin en Chef CMST) =============
export const DIRECTOR_MENU: MenuSection[] = [
  {
    id: 'general',
    label: 'GÉNÉRAL',
    items: [
      { label: 'Tableau de bord', href: '/professional/director-dashboard', icon: LayoutDashboard },
      { label: 'Statistiques', href: '/professional/statistics', icon: BarChart3 },
      { label: 'Agenda & RDV', href: '/professional/appointments', icon: Calendar, badge: 5 },
      { label: 'Patients / Ayants Droit', href: '/establishments/sogara/admin/beneficiaries', icon: Heart, description: 'Employés SOGARA et leurs familles' }
    ]
  },
  {
    id: 'medical-direction',
    label: 'DIRECTION MÉDICALE', 
    items: [
      { label: 'Corps médical', href: '/professional/medical-staff', icon: Stethoscope },
      { label: 'Services', href: '/professional/services', icon: Building2 },
      { label: 'Protocoles', href: '/professional/protocols', icon: ClipboardList }
    ]
  },
  {
    id: 'administration',
    label: 'ADMINISTRATION',
    items: [
      { label: 'Personnel', href: '/professional/staff', icon: UserCog, permission: 'manage_staff' },
      { label: 'Gestion Admissions', href: '/professional/manage-admissions', icon: UserPlus, permission: 'manage_staff', description: 'Demandes et invitations' },
      { label: 'Finances & CNAMGS', href: '/professional/billing', icon: DollarSign, permission: 'manage_billing' },
      { label: 'Infrastructure', href: '/professional/infrastructure', icon: Building2 },
      { label: 'Stocks & Pharmacie', href: '/professional/inventory', icon: Package }
    ]
  },
  {
    id: 'communication',
    label: 'COMMUNICATION',
    items: [
      { label: 'Messages', href: '/professional/messages', icon: MessageSquare, badge: 3 },
      { label: 'Paramètres', href: '/professional/settings', icon: Settings }
    ]
  }
];

// ============= MENU MÉDECIN (Médecin Généraliste) =============
export const DOCTOR_MENU: MenuSection[] = [
  {
    id: 'medical-activity',
    label: 'ACTIVITÉ MÉDICALE', 
    items: [
      { label: 'Tableau de bord', href: '/professional/doctor-dashboard', icon: LayoutDashboard },
      { label: 'Agenda & RDV', href: '/professional/appointments', icon: Calendar, badge: 8 },
      { label: 'Patients', href: '/professional/patients', icon: Users },
      { label: 'Consultations', href: '/professional/consultations', icon: Stethoscope },
      { label: 'Téléconsultations', href: '/professional/teleconsultations', icon: Video, badge: 2 }
    ]
  },
  {
    id: 'communication',
    label: 'COMMUNICATION',
    items: [
      { label: 'Messages', href: '/professional/messages', icon: MessageSquare, badge: 3 },
      { label: 'Paramètres', href: '/professional/settings', icon: Settings }
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
    case 'receptionist':
      return receptionistMenu; // Menu spécifique pour réceptionniste
    case 'nurse':
      return DOCTOR_MENU; // Pour l'instant, utilise le menu médecin
    case 'laborantin':
      return DOCTOR_MENU; // Pour l'instant, utilise le menu médecin
    case 'pharmacist':
      return DOCTOR_MENU; // Pour l'instant, utilise le menu médecin
    default:
      return DOCTOR_MENU; // Par défaut, menu médecin
  }
};
