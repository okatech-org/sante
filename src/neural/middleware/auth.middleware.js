import jwt from 'jsonwebtoken';
import Logger from '../core/Logger.js';

const logger = new Logger('AuthMiddleware');
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('[AuthMiddleware] Missing JWT_SECRET environment variable. Set a strong secret before starting the server.');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Missing or invalid Authorization header');
    return res.status(401).json({
      success: false,
      error: 'Token d\'authentification manquant ou invalide',
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    logger.info(`User authenticated: ${decoded.email} (${decoded.role})`);
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error.message);
    return res.status(403).json({
      success: false,
      error: 'Token expiré ou invalide',
    });
  }
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Access denied for role ${req.user.role}. Required: ${allowedRoles.join(', ')}`);
      return res.status(403).json({
        success: false,
        error: `Accès non autorisé. Rôles requis: ${allowedRoles.join(', ')}`,
      });
    }

    logger.info(`Role ${req.user.role} authorized`);
    next();
  };
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export default {
  authenticateJWT,
  requireRole,
  generateToken,
};

