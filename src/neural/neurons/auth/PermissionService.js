import { UserRoles, RolePermissions, RoleToCategoryMap } from './RoleDefinitions.js';

class PermissionService {
  hasPermission(userRole, permission) {
    const permissions = RolePermissions[userRole] || [];
    return permissions.includes(permission);
  }

  hasAllPermissions(userRole, requiredPermissions) {
    return requiredPermissions.every(permission => 
      this.hasPermission(userRole, permission)
    );
  }

  hasAnyPermission(userRole, requiredPermissions) {
    return requiredPermissions.some(permission => 
      this.hasPermission(userRole, permission)
    );
  }

  getRoleCategory(role) {
    return RoleToCategoryMap[role] || null;
  }

  isInCategory(role, category) {
    return this.getRoleCategory(role) === category;
  }

  getRolePermissions(role) {
    return RolePermissions[role] || [];
  }
}

export default new PermissionService();
