export const UserRoles = {
  PATIENT: 'patient',
  
  HOSPITAL: 'hospital',
  CLINIC: 'clinic',
  
  DOCTOR_GENERAL: 'doctor_general',
  DOCTOR_SPECIALIST: 'doctor_specialist',
  
  NURSE: 'nurse',
  MIDWIFE: 'midwife',
  PHYSIOTHERAPIST: 'physiotherapist',
  PSYCHOLOGIST: 'psychologist',
  
  PHARMACIST: 'pharmacist',
  PHARMACY: 'pharmacy',
  
  LAB_TECHNICIAN: 'lab_technician',
  LABORATORY: 'laboratory',
  
  RADIOLOGIST: 'radiologist',
  IMAGING_CENTER: 'imaging_center',
  
  ADMIN_ESTABLISHMENT: 'admin_establishment',
  SUPER_ADMIN: 'super_admin'
};

export const UserCategories = {
  PATIENT: 'patient',
  PROFESSIONAL_MEDICAL: 'professional_medical',
  PROFESSIONAL_PARAMEDICAL: 'professional_paramedical',
  ESTABLISHMENT: 'establishment',
  PHARMACY_NETWORK: 'pharmacy_network',
  LABORATORY: 'laboratory',
  IMAGING_CENTER: 'imaging_center',
  ADMINISTRATOR: 'administrator'
};

export const RoleToCategoryMap = {
  [UserRoles.PATIENT]: UserCategories.PATIENT,
  
  [UserRoles.DOCTOR_GENERAL]: UserCategories.PROFESSIONAL_MEDICAL,
  [UserRoles.DOCTOR_SPECIALIST]: UserCategories.PROFESSIONAL_MEDICAL,
  
  [UserRoles.NURSE]: UserCategories.PROFESSIONAL_PARAMEDICAL,
  [UserRoles.MIDWIFE]: UserCategories.PROFESSIONAL_PARAMEDICAL,
  [UserRoles.PHYSIOTHERAPIST]: UserCategories.PROFESSIONAL_PARAMEDICAL,
  [UserRoles.PSYCHOLOGIST]: UserCategories.PROFESSIONAL_PARAMEDICAL,
  
  [UserRoles.HOSPITAL]: UserCategories.ESTABLISHMENT,
  [UserRoles.CLINIC]: UserCategories.ESTABLISHMENT,
  
  [UserRoles.PHARMACIST]: UserCategories.PHARMACY_NETWORK,
  [UserRoles.PHARMACY]: UserCategories.PHARMACY_NETWORK,
  
  [UserRoles.LAB_TECHNICIAN]: UserCategories.LABORATORY,
  [UserRoles.LABORATORY]: UserCategories.LABORATORY,
  
  [UserRoles.RADIOLOGIST]: UserCategories.IMAGING_CENTER,
  [UserRoles.IMAGING_CENTER]: UserCategories.IMAGING_CENTER,
  
  [UserRoles.ADMIN_ESTABLISHMENT]: UserCategories.ADMINISTRATOR,
  [UserRoles.SUPER_ADMIN]: UserCategories.ADMINISTRATOR
};

export const Permissions = {
  READ_OWN_DMP: 'read_own_dmp',
  READ_PATIENT_DMP: 'read_patient_dmp',
  WRITE_PATIENT_DMP: 'write_patient_dmp',
  
  CREATE_PRESCRIPTION: 'create_prescription',
  READ_PRESCRIPTION: 'read_prescription',
  DISPENSE_MEDICATION: 'dispense_medication',
  
  CREATE_APPOINTMENT: 'create_appointment',
  MANAGE_APPOINTMENTS: 'manage_appointments',
  
  REQUEST_EXAM: 'request_exam',
  PERFORM_EXAM: 'perform_exam',
  VALIDATE_RESULTS: 'validate_results',
  
  MANAGE_USERS: 'manage_users',
  MANAGE_ESTABLISHMENT: 'manage_establishment',
  VIEW_ANALYTICS: 'view_analytics',
  SYSTEM_CONFIG: 'system_config'
};

export const RolePermissions = {
  [UserRoles.PATIENT]: [
    Permissions.READ_OWN_DMP,
    Permissions.CREATE_APPOINTMENT,
    Permissions.READ_PRESCRIPTION
  ],
  
  [UserRoles.DOCTOR_GENERAL]: [
    Permissions.READ_PATIENT_DMP,
    Permissions.WRITE_PATIENT_DMP,
    Permissions.CREATE_PRESCRIPTION,
    Permissions.MANAGE_APPOINTMENTS,
    Permissions.REQUEST_EXAM
  ],
  
  [UserRoles.DOCTOR_SPECIALIST]: [
    Permissions.READ_PATIENT_DMP,
    Permissions.WRITE_PATIENT_DMP,
    Permissions.CREATE_PRESCRIPTION,
    Permissions.MANAGE_APPOINTMENTS,
    Permissions.REQUEST_EXAM,
    Permissions.PERFORM_EXAM,
    Permissions.VALIDATE_RESULTS
  ],
  
  [UserRoles.NURSE]: [
    Permissions.READ_PATIENT_DMP,
    Permissions.WRITE_PATIENT_DMP,
    Permissions.MANAGE_APPOINTMENTS
  ],
  
  [UserRoles.PHARMACIST]: [
    Permissions.READ_PRESCRIPTION,
    Permissions.DISPENSE_MEDICATION
  ],
  
  [UserRoles.PHARMACY]: [
    Permissions.READ_PRESCRIPTION,
    Permissions.DISPENSE_MEDICATION,
    Permissions.MANAGE_USERS
  ],
  
  [UserRoles.LAB_TECHNICIAN]: [
    Permissions.PERFORM_EXAM,
    Permissions.WRITE_PATIENT_DMP
  ],
  
  [UserRoles.RADIOLOGIST]: [
    Permissions.READ_PATIENT_DMP,
    Permissions.PERFORM_EXAM,
    Permissions.VALIDATE_RESULTS,
    Permissions.WRITE_PATIENT_DMP
  ],
  
  [UserRoles.SUPER_ADMIN]: Object.values(Permissions)
};

export default {
  UserRoles,
  UserCategories,
  RoleToCategoryMap,
  Permissions,
  RolePermissions
};
