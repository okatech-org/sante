import BaseNeuron from '../core/BaseNeuron.js';
import { EventTypes } from '../types/events.js';
import AuthService from './auth/AuthService.js';

class AuthNeuron extends BaseNeuron {
  constructor() {
    super('AuthNeuron');
  }

  async onActivate() {
    this.logger.info('🔐 AuthNeuron activating...');
  }

  getSubscriptions() {
    return [
      {
        eventType: EventTypes.USER_REGISTERED,
        handler: this.handleUserRegistered
      },
      {
        eventType: EventTypes.USER_LOGIN,
        handler: this.handleUserLogin
      },
      {
        eventType: EventTypes.PASSWORD_RESET_REQUESTED,
        handler: this.handlePasswordResetRequested
      }
    ];
  }

  async handleUserRegistered(event) {
    const { user, role } = event.data;
    
    this.logger.info(`📝 Processing registration: ${user.email || user.phone} (${role})`);

    if (role === 'patient') {
      await this.emit(EventTypes.PATIENT_REGISTERED, { user });
    } else if (role.startsWith('doctor_') || role.startsWith('nurse') || role.startsWith('pharmacist')) {
      await this.emit(EventTypes.PROFESSIONAL_REGISTERED, { 
        user, 
        type: role,
        profile: event.data.profile || {}
      });
    }

    await this.emit(EventTypes.EMAIL_SENT, {
      to: user.email,
      template: 'welcome',
      data: { role }
    });
  }

  async handleUserLogin(event) {
    const { user, role } = event.data;
    
    this.logger.info(`🔓 User logged in: ${user.email || user.phone} (${role})`);

    await this.emit('ANALYTICS_EVENT', {
      type: 'login',
      userId: user.id,
      role,
      timestamp: new Date().toISOString()
    });
  }

  async handlePasswordResetRequested(event) {
    const { email } = event.data;
    
    this.logger.info(`🔑 Password reset requested: ${email}`);

    try {
      await AuthService.requestPasswordReset(email);
      
      await this.emit(EventTypes.EMAIL_SENT, {
        to: email,
        template: 'password_reset',
        data: {}
      });
    } catch (error) {
      this.logger.error('Error processing password reset:', error);
    }
  }

  async register(userData) {
    try {
      const result = await AuthService.register(userData);

      await this.emit(EventTypes.USER_REGISTERED, {
        user: result.user,
        role: userData.role,
        profile: userData.profile || {}
      });

      return result;
    } catch (error) {
      this.logger.error('Registration failed:', error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const result = await AuthService.login(credentials);

      await this.emit(EventTypes.USER_LOGIN, {
        user: result.user,
        role: result.role
      });

      return result;
    } catch (error) {
      this.logger.error('Login failed:', error);
      throw error;
    }
  }

  verifyToken(token) {
    return AuthService.verifyToken(token);
  }

  async logout(userId) {
    return AuthService.logout(userId);
  }
}

const authNeuron = new AuthNeuron();
export default authNeuron;
