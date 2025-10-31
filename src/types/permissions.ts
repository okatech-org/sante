// Types pour les permissions du système SANTE.GA

export type Permission =
  // DMP & Consultation
  | 'view_dmp'
  | 'edit_dmp'
  | 'access_patient_dmp'
  | 'consultation'
  | 'prescription'
  // Examens
  | 'order_lab_test'
  | 'view_lab_results'
  | 'validate_lab_results'
  // Hospitalisation
  | 'admit_patient'
  | 'discharge_patient'
  | 'view_hospitalization'
  // Urgences
  | 'emergency_access'
  | 'triage'
  // Rendez-vous
  | 'manage_appointments'
  | 'view_appointments'
  | 'add_appointment'
  // Personnel & Administration
  | 'manage_staff'
  | 'view_staff'
  | 'view_analytics'
  // Facturation
  | 'manage_billing'
  | 'view_billing'
  | 'billing'
  // Inventaire & Pharmacie
  | 'dispense_medication'
  | 'manage_stock'
  | 'view_inventory'
  // Services
  | 'manage_services'
  | 'manage_schedule'
  // Rapports & Technique
  | 'view_reports'
  | 'view_technical'
  // Patients
  | 'view_patients'
  | 'view_consultations'
  | 'view_prescriptions'
  | 'add_consultation'
  // Configuration
  | 'edit_settings'
  // Admin total
  | 'all';

export type ProfessionalRole =
  | 'director'
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'midwife'
  | 'pharmacist'
  | 'pharmacy_tech'
  | 'lab_tech'
  | 'radiologist'
  | 'receptionist'
  | 'medical_secretary'
  | 'psychologist'
  | 'physiotherapist'
  | 'nutritionist';

export interface ProfessionalContext {
  professional_id: string;
  professional_name: string;
  professional_email: string;
  professional_phone: string;
  professional_photo_url: string | null;
  professional_specialization: string | null;
  professional_matricule: string | null;
  establishment_id: string;
  establishment_name: string;
  role_in_establishment: string; // Permet string pour compatibilité avec DB
  department: string | null;
  job_position: string | null;
  matricule: string | null;
  is_admin: boolean;
  is_department_head: boolean;
  permissions: string[]; // Permet string[] pour compatibilité avec DB
  status: string;
  
  // Computed properties pour compatibilité legacy
  id?: string;
  role?: string;
  establishmentId?: string;
  isDepartmentHead?: boolean;
  establishment?: {
    id: string;
    name: string;
    type?: string;
    subType?: string;
    city?: string;
    logoUrl?: string;
  };
  isAdmin?: boolean;
}

export interface EstablishmentAffiliation {
  staff_id: string;
  establishment_id: string;
  establishment_name: string;
  establishment_type: string;
  role_in_establishment: string; // Permet string pour compatibilité avec DB
  department: string | null;
  job_position: string | null;
  is_admin: boolean;
  permissions: string[]; // Permet string[] pour compatibilité avec DB
  status: string;
  
  // Computed properties pour compatibilité legacy
  id?: string;
  establishmentId?: string;
  role?: string;
  isAdmin?: boolean;
  position?: string;
  matricule?: string;
  isDepartmentHead?: boolean;
  isEstablishmentAdmin?: boolean;
  establishment?: {
    id: string;
    name: string;
    type?: string;
    subType?: string;
    city?: string;
    logoUrl?: string;
  };
}

// Mapping des rôles vers permissions par défaut
export const ROLE_PERMISSIONS: Record<ProfessionalRole, Permission[]> = {
  director: ['all'],
  admin: ['manage_staff', 'view_analytics', 'manage_billing', 'manage_schedule', 'manage_services'],
  doctor: ['view_dmp', 'edit_dmp', 'consultation', 'prescription', 'order_lab_test', 'view_lab_results', 'admit_patient', 'discharge_patient'],
  nurse: ['view_dmp', 'edit_dmp', 'emergency_access', 'triage', 'manage_appointments'],
  midwife: ['view_dmp', 'edit_dmp', 'consultation', 'manage_appointments'],
  pharmacist: ['dispense_medication', 'manage_stock', 'view_dmp'],
  pharmacy_tech: ['dispense_medication'],
  lab_tech: ['order_lab_test', 'validate_lab_results', 'view_lab_results'],
  radiologist: ['order_lab_test', 'view_lab_results', 'validate_lab_results'],
  receptionist: ['manage_appointments', 'view_analytics'],
  medical_secretary: ['manage_appointments', 'view_analytics'],
  psychologist: ['view_dmp', 'edit_dmp', 'consultation'],
  physiotherapist: ['view_dmp', 'consultation', 'manage_appointments'],
  nutritionist: ['view_dmp', 'consultation', 'manage_appointments'],
};
