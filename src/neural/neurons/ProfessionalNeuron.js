import BaseNeuron from '../core/BaseNeuron.js';
import EventTypes from '../types/events.js';
import ProfessionalService from './professional/ProfessionalService.js';

class ProfessionalNeuron extends BaseNeuron {
  constructor() {
    super('ProfessionalNeuron');
  }

  getSubscriptions() {
    return [
      {
        eventType: EventTypes.PROFESSIONAL_REGISTERED,
        handler: this.handleProfessionalRegistered.bind(this)
      },
      {
        eventType: EventTypes.PROFESSIONAL_VERIFIED,
        handler: this.handleProfessionalVerified.bind(this)
      }
    ];
  }

  async handleProfessionalRegistered(event) {
    const { user, profile } = event.data;
    
    this.logger.info(`👨‍⚕️ Creating professional profile: ${user.id}`);

    try {
      const professionalProfile = await ProfessionalService.createProfile(user.id, profile);

      await this.emit(EventTypes.LICENSE_VERIFICATION_REQUESTED, {
        professionalId: professionalProfile.id,
        licenseNumber: profile.licenseNumber
      });

      await this.emit(EventTypes.NOTIFICATION_SENT, {
        userId: user.id,
        type: 'profile_created',
        message: 'Votre profil professionnel a été créé. Vérification en cours...'
      });
    } catch (error) {
      this.logger.error('Error creating professional profile:', error);
    }
  }

  async handleProfessionalVerified(event) {
    const { professionalId } = event.data;
    
    this.logger.info(`✅ Professional verified: ${professionalId}`);

    try {
      await ProfessionalService.verifyLicense(professionalId, '');

      await this.emit(EventTypes.NOTIFICATION_SENT, {
        professionalId,
        type: 'verification_success',
        message: 'Votre profil professionnel a été vérifié'
      });
    } catch (error) {
      this.logger.error('Error verifying professional:', error);
    }
  }

  async getProfile(professionalId) {
    return ProfessionalService.getProfile(professionalId);
  }

  async searchProfessionals(filters) {
    return ProfessionalService.searchProfessionals(filters);
  }

  async updateProfile(professionalId, updates) {
    return ProfessionalService.updateProfile(professionalId, updates);
  }

  async setSchedule(professionalId, schedule) {
    return ProfessionalService.setSchedule(professionalId, schedule);
  }
}

const professionalNeuron = new ProfessionalNeuron();
export default professionalNeuron;
