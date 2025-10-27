import AuthService from './AuthService.js';
import PermissionService from './PermissionService.js';
import Logger from '../../core/Logger.js';

const logger = new Logger('AuthMiddleware');

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by ${req.user.email} (${req.user.role})`);
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

export const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const hasPermission = PermissionService.hasAllPermissions(
      req.user.role,
      requiredPermissions
    );

    if (!hasPermission) {
      logger.warn(`Permission denied for ${req.user.email}: ${requiredPermissions.join(', ')}`);
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: requiredPermissions
      });
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      req.user = AuthService.verifyToken(token);
    }

    next();
  } catch (error) {
    next();
  }
};

export default {
  authenticate,
  authorize,
  requirePermission,
  optionalAuth
};
