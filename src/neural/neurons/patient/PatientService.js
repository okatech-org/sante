import InsuranceService from './InsuranceService.js';
import Logger from '../../core/Logger.js';

const logger = new Logger('PatientService');

class PatientService {
  constructor() {
    this.profiles = new Map();
    this.medicalHistory = new Map();
    this.vaccinations = new Map();
  }

  async createProfile(userId, profileData) {
    try {
      const patientId = `patient_${userId}`;
      const profile = {
        id: patientId,
        userId,
        ...profileData,
        cnamgsStatus: 'unverified',
        cnamgsCoveragePercent: 80,
        cnssVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.profiles.set(patientId, profile);
      logger.info(`✅ Patient profile created: ${patientId}`);
      return profile;
    } catch (error) {
      logger.error('Error creating patient profile:', error);
      throw error;
    }
  }

  async updateProfile(patientId, updates) {
    try {
      const profile = this.profiles.get(patientId);
      if (!profile) {
        throw new Error('Patient profile not found');
      }

      const updated = {
        ...profile,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.profiles.set(patientId, updated);
      logger.info(`✅ Patient profile updated: ${patientId}`);
      return updated;
    } catch (error) {
      logger.error('Error updating patient profile:', error);
      throw error;
    }
  }

  async getProfile(patientId) {
    try {
      const profile = this.profiles.get(patientId);
      if (!profile) {
        throw new Error('Patient profile not found');
      }
      return profile;
    } catch (error) {
      logger.error('Error getting patient profile:', error);
      throw error;
    }
  }

  async verifyInsurances(patientId) {
    try {
      const patient = await this.getProfile(patientId);
      const results = {};

      if (patient.cnamgsNumber) {
        results.cnamgs = await InsuranceService.verifyCNAMGS(patient.cnamgsNumber);
      }

      if (patient.cnssNumber) {
        results.cnss = await InsuranceService.verifyCNSS(patient.cnssNumber);
      }

      await InsuranceService.updateInsuranceStatus(
        patientId,
        results.cnamgs,
        results.cnss
      );

      return results;
    } catch (error) {
      logger.error('Error verifying insurances:', error);
      throw error;
    }
  }

  async addMedicalHistory(patientId, historyData) {
    try {
      const id = `history_${Date.now()}`;
      const history = {
        id,
        patientId,
        ...historyData,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      if (!this.medicalHistory.has(patientId)) {
        this.medicalHistory.set(patientId, []);
      }
      this.medicalHistory.get(patientId).push(history);

      logger.info(`✅ Medical history added: ${id}`);
      return history;
    } catch (error) {
      logger.error('Error adding medical history:', error);
      throw error;
    }
  }

  async addVaccination(patientId, vaccinationData) {
    try {
      const id = `vaccination_${Date.now()}`;
      const vaccination = {
        id,
        patientId,
        ...vaccinationData,
        createdAt: new Date().toISOString()
      };

      if (!this.vaccinations.has(patientId)) {
        this.vaccinations.set(patientId, []);
      }
      this.vaccinations.get(patientId).push(vaccination);

      logger.info(`✅ Vaccination added: ${id}`);
      return vaccination;
    } catch (error) {
      logger.error('Error adding vaccination:', error);
      throw error;
    }
  }

  getMedicalHistory(patientId) {
    return this.medicalHistory.get(patientId) || [];
  }

  getVaccinations(patientId) {
    return this.vaccinations.get(patientId) || [];
  }
}

export default new PatientService();
