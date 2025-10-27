import BaseNeuron from '../core/BaseNeuron.js';
import { EventTypes } from '../types/events.js';
import PatientService from './patient/PatientService.js';
import DMPService from './patient/DMPService.js';

class PatientNeuron extends BaseNeuron {
  constructor() {
    super('PatientNeuron');
  }

  async onActivate() {
    this.logger.info('👥 PatientNeuron activating...');
  }

  getSubscriptions() {
    return [
      {
        eventType: EventTypes.PATIENT_REGISTERED,
        handler: this.handlePatientRegistered
      },
      {
        eventType: EventTypes.PATIENT_INSURANCE_VERIFIED,
        handler: this.handleInsuranceVerified
      }
    ];
  }

  async handlePatientRegistered(event) {
    const { user, profile } = event.data;
    
    this.logger.info(`📝 Creating patient profile: ${user.id}`);

    try {
      const patientProfile = await PatientService.createProfile(user.id, profile);

      if (profile?.cnamgsNumber || profile?.cnssNumber) {
        const insuranceResults = await PatientService.verifyInsurances(patientProfile.id);
        
        await this.emit(EventTypes.PATIENT_INSURANCE_VERIFIED, {
          patientId: patientProfile.id,
          cnamgs: insuranceResults.cnamgs,
          cnss: insuranceResults.cnss
        });
      }
    } catch (error) {
      this.logger.error('Error creating patient profile:', error);
    }
  }

  async handleInsuranceVerified(event) {
    const { patientId, cnamgs } = event.data;
    
    this.logger.info(`✅ Insurance verified for patient: ${patientId}`);

    await this.emit(EventTypes.NOTIFICATION_SENT, {
      userId: patientId,
      type: 'insurance_verified',
      message: `Votre couverture CNAMGS est de ${cnamgs?.coveragePercent || 80}%`
    });
  }

  async getProfile(patientId) {
    return PatientService.getProfile(patientId);
  }

  async updateProfile(patientId, updates) {
    return PatientService.updateProfile(patientId, updates);
  }

  async getFullDMP(patientId, requestingUserId) {
    return DMPService.getFullDMP(patientId, requestingUserId);
  }

  async verifyInsurances(patientId) {
    const results = await PatientService.verifyInsurances(patientId);
    
    await this.emit(EventTypes.PATIENT_INSURANCE_VERIFIED, {
      patientId,
      ...results
    });
    
    return results;
  }

  async addConsultation(consultationData) {
    const consultation = await DMPService.addConsultation(consultationData);
    
    await this.emit('CONSULTATION_ADDED', {
      patientId: consultationData.patientId,
      consultationId: consultation.id
    });

    return consultation;
  }

  async addMedicalHistory(patientId, historyData) {
    return PatientService.addMedicalHistory(patientId, historyData);
  }

  async addVaccination(patientId, vaccinationData) {
    return PatientService.addVaccination(patientId, vaccinationData);
  }

  async grantConsent(consentData) {
    return DMPService.grantConsent(consentData);
  }
}

const patientNeuron = new PatientNeuron();
export default patientNeuron;
