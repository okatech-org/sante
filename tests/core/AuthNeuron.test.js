import AuthService from '../../src/neural/neurons/auth/AuthService.js';
import PermissionService from '../../src/neural/neurons/auth/PermissionService.js';
import { UserRoles, Permissions } from '../../src/neural/neurons/auth/RoleDefinitions.js';

describe('Authentication System', () => {
  describe('AuthService', () => {
    test('should register a new patient', async () => {
      const result = await AuthService.register({
        email: 'patient@test.ga',
        password: 'SecurePass123!',
        role: UserRoles.PATIENT,
        profile: { firstName: 'Jean', lastName: 'Test' }
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('patient@test.ga');
      expect(result.user.role).toBe(UserRoles.PATIENT);
    });

    test('should register a doctor', async () => {
      const result = await AuthService.register({
        email: 'doctor@test.ga',
        password: 'SecurePass123!',
        role: UserRoles.DOCTOR_GENERAL,
        profile: { firstName: 'Dr.', lastName: 'Smith' }
      });

      expect(result.user.role).toBe(UserRoles.DOCTOR_GENERAL);
    });

    test('should login with email', async () => {
      await AuthService.register({
        email: 'login@test.ga',
        password: 'SecurePass123!',
        role: UserRoles.PATIENT
      });

      const result = await AuthService.login({
        email: 'login@test.ga',
        password: 'SecurePass123!'
      });

      expect(result.token).toBeDefined();
      expect(result.role).toBe(UserRoles.PATIENT);
      expect(result.permissions).toContain(Permissions.READ_OWN_DMP);
    });

    test('should fail with wrong password', async () => {
      await AuthService.register({
        email: 'wrong@test.ga',
        password: 'CorrectPass123!',
        role: UserRoles.PATIENT
      });

      await expect(
        AuthService.login({
          email: 'wrong@test.ga',
          password: 'WrongPass123!'
        })
      ).rejects.toThrow('Invalid password');
    });

    test('should verify valid token', async () => {
      const loginResult = await AuthService.login({
        email: 'login@test.ga',
        password: 'SecurePass123!'
      });

      const decoded = AuthService.verifyToken(loginResult.token);
      expect(decoded.email).toBe('login@test.ga');
      expect(decoded.role).toBe(UserRoles.PATIENT);
    });

    test('should reject invalid token', () => {
      expect(() => {
        AuthService.verifyToken('invalid.token.here');
      }).toThrow('Invalid token');
    });
  });

  describe('PermissionService', () => {
    test('patient should have read_own_dmp permission', () => {
      const hasPermission = PermissionService.hasPermission(
        UserRoles.PATIENT,
        Permissions.READ_OWN_DMP
      );
      expect(hasPermission).toBe(true);
    });

    test('patient should not have write_patient_dmp permission', () => {
      const hasPermission = PermissionService.hasPermission(
        UserRoles.PATIENT,
        Permissions.WRITE_PATIENT_DMP
      );
      expect(hasPermission).toBe(false);
    });

    test('doctor should have write_patient_dmp permission', () => {
      const hasPermission = PermissionService.hasPermission(
        UserRoles.DOCTOR_GENERAL,
        Permissions.WRITE_PATIENT_DMP
      );
      expect(hasPermission).toBe(true);
    });

    test('should return all permissions for super_admin', () => {
      const permissions = PermissionService.getRolePermissions(UserRoles.SUPER_ADMIN);
      expect(permissions.length).toBeGreaterThan(10);
    });

    test('should verify hasAllPermissions correctly', () => {
      const has = PermissionService.hasAllPermissions(
        UserRoles.DOCTOR_GENERAL,
        [Permissions.READ_PATIENT_DMP, Permissions.WRITE_PATIENT_DMP]
      );
      expect(has).toBe(true);

      const hasNot = PermissionService.hasAllPermissions(
        UserRoles.PATIENT,
        [Permissions.READ_PATIENT_DMP, Permissions.WRITE_PATIENT_DMP]
      );
      expect(hasNot).toBe(false);
    });
  });
});
