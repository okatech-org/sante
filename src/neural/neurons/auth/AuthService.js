import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../core/Config.js';
import Logger from '../../core/Logger.js';
import PermissionService from './PermissionService.js';
import supabase from '../../database/supabase.js';

const logger = new Logger('AuthService');

class AuthService {
  constructor() {
    this.users = new Map();
  }

  async register({ email, password, phone, role, profile }) {
    try {
      if (!email && !phone) {
        throw new Error('Email or phone required');
      }
      if (!password) {
        throw new Error('Password required');
      }
      if (!role) {
        throw new Error('Role required');
      }

      const userId = this._generateId();
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = {
        id: userId,
        email,
        phone,
        role,
        profile: profile || {},
        createdAt: new Date().toISOString(),
        password: hashedPassword
      };

      this.users.set(userId, user);

      logger.info(`✅ User registered: ${email || phone} (${role})`);

      return {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login({ email, password, phone }) {
    try {
      if (!email && !phone) {
        throw new Error('Email or phone required');
      }
      if (!password) {
        throw new Error('Password required');
      }

      let user = null;

      if (email) {
        user = Array.from(this.users.values()).find(u => u.email === email);
      } else if (phone) {
        user = Array.from(this.users.values()).find(u => u.phone === phone);
      }

      if (!user) {
        throw new Error('User not found');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Invalid password');
      }

      const token = this._generateJWT({
        userId: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        permissions: PermissionService.getRolePermissions(user.role)
      });

      logger.info(`✅ User logged in: ${email || phone} (${user.role})`);

      return {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        role: user.role,
        token,
        permissions: PermissionService.getRolePermissions(user.role)
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async logout(userId) {
    try {
      logger.info(`✅ User logged out: ${userId}`);
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      logger.error('Token verification failed:', error.message);
      throw new Error('Invalid token');
    }
  }

  async refreshToken(oldToken) {
    try {
      const decoded = jwt.verify(oldToken, config.jwt.secret, { ignoreExpiration: true });
      
      const newToken = this._generateJWT({
        userId: decoded.userId,
        email: decoded.email,
        phone: decoded.phone,
        role: decoded.role,
        permissions: decoded.permissions
      });

      logger.info(`✅ Token refreshed for user: ${decoded.userId}`);
      return newToken;
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw error;
    }
  }

  async requestPasswordReset(email) {
    try {
      const user = Array.from(this.users.values()).find(u => u.email === email);
      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = this._generateJWT({
        userId: user.id,
        type: 'password_reset'
      }, '1h');

      logger.info(`✅ Password reset requested for: ${email}`);
      
      return {
        resetToken,
        resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      };
    } catch (error) {
      logger.error('Password reset error:', error);
      throw error;
    }
  }

  _generateJWT(payload, expiresIn = config.jwt.expiresIn) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn
    });
  }

  _generateId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getUserById(userId) {
    const user = this.users.get(userId);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt
    };
  }
}

export default new AuthService();
