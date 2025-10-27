// ============================================================================
// Service de Gestion des Permissions Multi-Établissements
// ============================================================================

export interface Permission {
  code: string;
  label: string;
  description: string;
  category: 'medical' | 'administrative' | 'financial' | 'system';
}

// Définition complète des permissions
export const PERMISSIONS: Record<string, Permission> = {
  // Permissions Médicales
  'consultation': {
    code: 'consultation',
    label: 'Créer des consultations',
    description: 'Permet de créer et gérer des consultations médicales',
    category: 'medical'
  },
  'prescription': {
    code: 'prescription',
    label: 'Émettre des prescriptions',
    description: 'Permet de rédiger des ordonnances et prescriptions',
    category: 'medical'
  },
  'access_patient_dmp': {
    code: 'access_patient_dmp',
    label: 'Accéder au DMP',
    description: 'Consulter le Dossier Médical Partagé des patients',
    category: 'medical'
  },
  'modify_patient_dmp': {
    code: 'modify_patient_dmp',
    label: 'Modifier le DMP',
    description: 'Ajouter ou modifier des informations dans le DMP',
    category: 'medical'
  },
  'order_exams': {
    code: 'order_exams',
    label: 'Commander des examens',
    description: 'Prescrire des examens de laboratoire ou imagerie',
    category: 'medical'
  },
  'view_exam_results': {
    code: 'view_exam_results',
    label: 'Voir les résultats',
    description: 'Consulter les résultats d\'examens',
    category: 'medical'
  },
  'surgery': {
    code: 'surgery',
    label: 'Actes chirurgicaux',
    description: 'Effectuer et programmer des interventions chirurgicales',
    category: 'medical'
  },
  'emergency_care': {
    code: 'emergency_care',
    label: 'Soins d\'urgence',
    description: 'Prendre en charge les urgences médicales',
    category: 'medical'
  },
  'refer_patient': {
    code: 'refer_patient',
    label: 'Référer des patients',
    description: 'Orienter les patients vers d\'autres spécialistes',
    category: 'medical'
  },

  // Permissions Administratives
  'manage_appointments': {
    code: 'manage_appointments',
    label: 'Gérer les rendez-vous',
    description: 'Créer, modifier et annuler des rendez-vous',
    category: 'administrative'
  },
  'patient_registration': {
    code: 'patient_registration',
    label: 'Enregistrer des patients',
    description: 'Créer et modifier les dossiers patients',
    category: 'administrative'
  },
  'manage_staff': {
    code: 'manage_staff',
    label: 'Gérer le personnel',
    description: 'Gérer les comptes et permissions du personnel',
    category: 'administrative'
  },
  'department_management': {
    code: 'department_management',
    label: 'Gérer le département',
    description: 'Administration d\'un service ou département',
    category: 'administrative'
  },
  'view_analytics': {
    code: 'view_analytics',
    label: 'Voir les statistiques',
    description: 'Accéder aux tableaux de bord et rapports',
    category: 'administrative'
  },
  'manage_inventory': {
    code: 'manage_inventory',
    label: 'Gérer l\'inventaire',
    description: 'Gérer les stocks de médicaments et matériel',
    category: 'administrative'
  },

  // Permissions Financières
  'billing': {
    code: 'billing',
    label: 'Facturation',
    description: 'Créer et gérer les factures patients',
    category: 'financial'
  },
  'insurance_claims': {
    code: 'insurance_claims',
    label: 'Déclarations assurance',
    description: 'Gérer les demandes CNAMGS/CNSS',
    category: 'financial'
  },
  'financial_reports': {
    code: 'financial_reports',
    label: 'Rapports financiers',
    description: 'Accéder aux rapports financiers détaillés',
    category: 'financial'
  },
  'manage_pricing': {
    code: 'manage_pricing',
    label: 'Gérer les tarifs',
    description: 'Définir et modifier les tarifs des prestations',
    category: 'financial'
  },

  // Permissions Système
  'system_admin': {
    code: 'system_admin',
    label: 'Administration système',
    description: 'Accès complet à l\'administration',
    category: 'system'
  },
  'manage_establishment': {
    code: 'manage_establishment',
    label: 'Gérer l\'établissement',
    description: 'Paramétrer et configurer l\'établissement',
    category: 'system'
  },
  'audit_logs': {
    code: 'audit_logs',
    label: 'Logs d\'audit',
    description: 'Consulter les journaux d\'activité',
    category: 'system'
  }
};

// Rôles prédéfinis avec leurs permissions
export const ROLE_TEMPLATES = {
  // Rôles médicaux
  'medecin_chef': {
    label: 'Médecin Chef de Service',
    permissions: [
      'consultation',
      'prescription',
      'access_patient_dmp',
      'modify_patient_dmp',
      'order_exams',
      'view_exam_results',
      'surgery',
      'emergency_care',
      'refer_patient',
      'department_management',
      'manage_staff',
      'view_analytics'
    ]
  },
  'medecin': {
    label: 'Médecin',
    permissions: [
      'consultation',
      'prescription',
      'access_patient_dmp',
      'modify_patient_dmp',
      'order_exams',
      'view_exam_results',
      'refer_patient'
    ]
  },
  'medecin_urgentiste': {
    label: 'Médecin Urgentiste',
    permissions: [
      'consultation',
      'prescription',
      'access_patient_dmp',
      'modify_patient_dmp',
      'order_exams',
      'view_exam_results',
      'emergency_care',
      'refer_patient'
    ]
  },
  'chirurgien': {
    label: 'Chirurgien',
    permissions: [
      'consultation',
      'prescription',
      'access_patient_dmp',
      'modify_patient_dmp',
      'order_exams',
      'view_exam_results',
      'surgery',
      'refer_patient'
    ]
  },
  'infirmier_chef': {
    label: 'Infirmier(e) Chef',
    permissions: [
      'access_patient_dmp',
      'view_exam_results',
      'manage_appointments',
      'patient_registration',
      'manage_inventory'
    ]
  },
  'infirmier': {
    label: 'Infirmier(e)',
    permissions: [
      'access_patient_dmp',
      'view_exam_results',
      'patient_registration'
    ]
  },
  
  // Rôles administratifs
  'directeur_etablissement': {
    label: 'Directeur d\'Établissement',
    permissions: ['*'] // Tous les droits
  },
  'administrateur_medical': {
    label: 'Administrateur Médical',
    permissions: [
      'manage_appointments',
      'patient_registration',
      'manage_staff',
      'department_management',
      'view_analytics',
      'manage_establishment'
    ]
  },
  'receptionniste': {
    label: 'Réceptionniste',
    permissions: [
      'manage_appointments',
      'patient_registration',
      'billing'
    ]
  },
  'comptable': {
    label: 'Comptable',
    permissions: [
      'billing',
      'insurance_claims',
      'financial_reports',
      'view_analytics'
    ]
  },
  'pharmacien': {
    label: 'Pharmacien',
    permissions: [
      'access_patient_dmp',
      'manage_inventory',
      'billing'
    ]
  },
  'laborantin': {
    label: 'Laborantin',
    permissions: [
      'access_patient_dmp',
      'modify_patient_dmp',
      'view_exam_results'
    ]
  }
};

// Service de gestion des permissions
export class PermissionService {
  // Vérifier si un utilisateur a une permission spécifique
  static hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    // Si l'utilisateur a la permission wildcard
    if (userPermissions.includes('*')) return true;
    
    // Si l'utilisateur a la permission système admin
    if (userPermissions.includes('system_admin')) return true;
    
    // Vérifier la permission spécifique
    return userPermissions.includes(requiredPermission);
  }

  // Vérifier plusieurs permissions (toutes requises)
  static hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every(perm => this.hasPermission(userPermissions, perm));
  }

  // Vérifier plusieurs permissions (au moins une)
  static hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.some(perm => this.hasPermission(userPermissions, perm));
  }

  // Obtenir les permissions par catégorie
  static getPermissionsByCategory(category: 'medical' | 'administrative' | 'financial' | 'system'): Permission[] {
    return Object.values(PERMISSIONS).filter(perm => perm.category === category);
  }

  // Obtenir les permissions d'un rôle template
  static getRolePermissions(roleKey: keyof typeof ROLE_TEMPLATES): string[] {
    return ROLE_TEMPLATES[roleKey]?.permissions || [];
  }

  // Valider un ensemble de permissions
  static validatePermissions(permissions: string[]): {
    valid: string[];
    invalid: string[];
  } {
    const valid: string[] = [];
    const invalid: string[] = [];

    permissions.forEach(perm => {
      if (perm === '*' || perm === 'system_admin' || PERMISSIONS[perm]) {
        valid.push(perm);
      } else {
        invalid.push(perm);
      }
    });

    return { valid, invalid };
  }

  // Générer une description lisible des permissions
  static getPermissionDescription(permissionCode: string): string {
    if (permissionCode === '*') return 'Tous les droits';
    if (permissionCode === 'system_admin') return 'Administration système complète';
    return PERMISSIONS[permissionCode]?.label || permissionCode;
  }

  // Grouper les permissions par catégorie pour affichage
  static groupPermissions(permissions: string[]): Record<string, Permission[]> {
    const grouped: Record<string, Permission[]> = {
      medical: [],
      administrative: [],
      financial: [],
      system: []
    };

    permissions.forEach(permCode => {
      const perm = PERMISSIONS[permCode];
      if (perm) {
        grouped[perm.category].push(perm);
      }
    });

    return grouped;
  }

  // Obtenir les permissions recommandées pour un type d'établissement
  static getEstablishmentDefaultPermissions(establishmentType: string): Record<string, string[]> {
    switch (establishmentType) {
      case 'hospital':
        return {
          'medecin_chef': this.getRolePermissions('medecin_chef'),
          'medecin': this.getRolePermissions('medecin'),
          'medecin_urgentiste': this.getRolePermissions('medecin_urgentiste'),
          'chirurgien': this.getRolePermissions('chirurgien'),
          'infirmier_chef': this.getRolePermissions('infirmier_chef'),
          'infirmier': this.getRolePermissions('infirmier'),
          'receptionniste': this.getRolePermissions('receptionniste'),
          'comptable': this.getRolePermissions('comptable')
        };
      
      case 'clinic':
        return {
          'medecin': this.getRolePermissions('medecin'),
          'infirmier': this.getRolePermissions('infirmier'),
          'receptionniste': this.getRolePermissions('receptionniste'),
          'comptable': this.getRolePermissions('comptable')
        };
      
      case 'cabinet':
        return {
          'medecin': this.getRolePermissions('medecin'),
          'infirmier': ['access_patient_dmp', 'patient_registration'],
          'receptionniste': ['manage_appointments', 'patient_registration', 'billing']
        };
      
      case 'pharmacy':
        return {
          'pharmacien': this.getRolePermissions('pharmacien'),
          'assistant': ['manage_inventory', 'billing']
        };
      
      case 'laboratory':
        return {
          'laborantin': this.getRolePermissions('laborantin'),
          'receptionniste': ['patient_registration', 'billing']
        };
      
      default:
        return {};
    }
  }
}
