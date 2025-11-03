// ============================================
// SYSTÈME DE PERMISSIONS PHARMACIE - RBAC
// Date: 3 novembre 2025
// ============================================

import { PermissionPharmacie, PERMISSIONS_PAR_ROLE, TypeProfessionnel } from '@/types/pharmacy';

// ============================================
// VÉRIFICATION PERMISSIONS
// ============================================

export const hasPermission = (
  userPermissions: string[],
  requiredPermission: PermissionPharmacie
): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (
  userPermissions: string[],
  requiredPermissions: PermissionPharmacie[]
): boolean => {
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  );
};

export const hasAllPermissions = (
  userPermissions: string[],
  requiredPermissions: PermissionPharmacie[]
): boolean => {
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
};

// ============================================
// OBTENIR PERMISSIONS PAR RÔLE
// ============================================

export const getPermissionsByRole = (
  typeProfessionnel: TypeProfessionnel,
  estTitulaire: boolean
): PermissionPharmacie[] => {
  if (typeProfessionnel === 'dr_pharmacie') {
    return estTitulaire 
      ? PERMISSIONS_PAR_ROLE.dr_pharmacie_titulaire
      : PERMISSIONS_PAR_ROLE.dr_pharmacie_salarie;
  }
  
  return PERMISSIONS_PAR_ROLE.vendeur_pharmacie;
};

// ============================================
// VÉRIFICATIONS SPÉCIFIQUES
// ============================================

export const canManagePharmacy = (permissions: string[]): boolean => {
  return hasPermission(permissions as PermissionPharmacie[], 'pharmacie:update');
};

export const canManageStock = (permissions: string[]): boolean => {
  return hasAnyPermission(permissions as PermissionPharmacie[], [
    'stock:create',
    'stock:update',
    'stock:delete'
  ]);
};

export const canValidateOrdonnances = (permissions: string[]): boolean => {
  return hasPermission(permissions as PermissionPharmacie[], 'ordonnances:validate');
};

export const canDispenseOrdonnances = (permissions: string[]): boolean => {
  return hasPermission(permissions as PermissionPharmacie[], 'ordonnances:dispense');
};

export const canManageEmployees = (permissions: string[]): boolean => {
  return hasAnyPermission(permissions as PermissionPharmacie[], [
    'employes:create',
    'employes:update',
    'employes:delete'
  ]);
};

export const canAccessReports = (permissions: string[]): boolean => {
  return hasPermission(permissions as PermissionPharmacie[], 'rapports:read');
};

export const canManageBilling = (permissions: string[]): boolean => {
  return hasAnyPermission(permissions as PermissionPharmacie[], [
    'facturation:create',
    'facturation:update'
  ]);
};

// ============================================
// LABELS PERMISSIONS (i18n)
// ============================================

export const PERMISSION_LABELS: Record<PermissionPharmacie, string> = {
  'pharmacie:read': 'Consulter la pharmacie',
  'pharmacie:update': 'Modifier la pharmacie',
  'pharmacie:manage_settings': 'Gérer les paramètres',
  
  'stock:read': 'Consulter le stock',
  'stock:create': 'Créer des produits',
  'stock:update': 'Mettre à jour le stock',
  'stock:delete': 'Supprimer des produits',
  'stock:declare_rupture': 'Déclarer une rupture',
  
  'ordonnances:read': 'Consulter les ordonnances',
  'ordonnances:validate': 'Valider les ordonnances',
  'ordonnances:dispense': 'Dispenser les ordonnances',
  'ordonnances:reject': 'Rejeter les ordonnances',
  
  'employes:read': 'Consulter les employés',
  'employes:create': 'Ajouter des employés',
  'employes:update': 'Modifier les employés',
  'employes:delete': 'Supprimer des employés',
  'employes:manage_permissions': 'Gérer les permissions',
  
  'rapports:read': 'Consulter les rapports',
  'rapports:export': 'Exporter les rapports',
  
  'facturation:read': 'Consulter la facturation',
  'facturation:create': 'Créer des factures',
  'facturation:update': 'Modifier les factures',
  'facturation:cnamgs_submit': 'Soumettre CNAMGS',
  
  'patients:read': 'Consulter les patients',
  
  'settings:manage': 'Gérer les paramètres'
};

// ============================================
// GROUPES DE PERMISSIONS
// ============================================

export const PERMISSION_GROUPS = {
  pharmacie: {
    label: 'Gestion Pharmacie',
    permissions: [
      'pharmacie:read',
      'pharmacie:update',
      'pharmacie:manage_settings'
    ] as PermissionPharmacie[]
  },
  stock: {
    label: 'Gestion Stock',
    permissions: [
      'stock:read',
      'stock:create',
      'stock:update',
      'stock:delete',
      'stock:declare_rupture'
    ] as PermissionPharmacie[]
  },
  ordonnances: {
    label: 'Ordonnances',
    permissions: [
      'ordonnances:read',
      'ordonnances:validate',
      'ordonnances:dispense',
      'ordonnances:reject'
    ] as PermissionPharmacie[]
  },
  employes: {
    label: 'Gestion Employés',
    permissions: [
      'employes:read',
      'employes:create',
      'employes:update',
      'employes:delete',
      'employes:manage_permissions'
    ] as PermissionPharmacie[]
  },
  rapports: {
    label: 'Rapports',
    permissions: [
      'rapports:read',
      'rapports:export'
    ] as PermissionPharmacie[]
  },
  facturation: {
    label: 'Facturation',
    permissions: [
      'facturation:read',
      'facturation:create',
      'facturation:update',
      'facturation:cnamgs_submit'
    ] as PermissionPharmacie[]
  }
};

// ============================================
// HELPER: Obtenir label groupe
// ============================================

export const getPermissionGroupLabel = (permission: PermissionPharmacie): string => {
  for (const [key, group] of Object.entries(PERMISSION_GROUPS)) {
    if (group.permissions.includes(permission)) {
      return group.label;
    }
  }
  return 'Autres';
};

