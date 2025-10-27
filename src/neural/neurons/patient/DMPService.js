import Logger from '../../core/Logger.js';

const logger = new Logger('DMPService');

class DMPService {
  constructor() {
    this.consultations = new Map();
    this.prescriptions = new Map();
    this.labResults = new Map();
    this.imagingResults = new Map();
    this.consents = new Map();
  }

  async getFullDMP(patientId, requestingUserId) {
    try {
      const hasAccess = await this.checkAccess(patientId, requestingUserId);
      if (!hasAccess) {
        throw new Error('Access denied - no consent');
      }

      const consultations = this._getConsultations(patientId);
      const prescriptions = this._getPrescriptions(patientId);
      const labResults = this._getLabResults(patientId);
      const imagingResults = this._getImagingResults(patientId);

      return {
        consultations,
        prescriptions,
        labResults,
        imagingResults
      };
    } catch (error) {
      logger.error('Error fetching DMP:', error);
      throw error;
    }
  }

  async checkAccess(patientId, requestingUserId) {
    if (patientId === requestingUserId) {
      return true;
    }

    const consents = Array.from(this.consents.values())
      .filter(c => c.patientId === patientId && c.professionalId === requestingUserId);

    if (consents.length === 0) return false;

    const consent = consents[0];
    if (consent.revokedAt) return false;
    if (consent.expiresAt && new Date(consent.expiresAt) < new Date()) return false;

    return true;
  }

  async addConsultation(consultationData) {
    try {
      const id = `consultation_${Date.now()}`;
      const consultation = {
        id,
        ...consultationData,
        createdAt: new Date().toISOString()
      };

      this.consultations.set(id, consultation);
      logger.info(`✅ Consultation added to DMP: ${id}`);
      return consultation;
    } catch (error) {
      logger.error('Error adding consultation:', error);
      throw error;
    }
  }

  async addPrescription(prescriptionData) {
    try {
      const id = `prescription_${Date.now()}`;
      const prescription = {
        id,
        ...prescriptionData,
        createdAt: new Date().toISOString()
      };

      this.prescriptions.set(id, prescription);
      logger.info(`✅ Prescription added to DMP: ${id}`);
      return prescription;
    } catch (error) {
      logger.error('Error adding prescription:', error);
      throw error;
    }
  }

  async grantConsent(consentData) {
    try {
      const id = `consent_${Date.now()}`;
      const consent = {
        id,
        ...consentData,
        grantedAt: new Date().toISOString()
      };

      this.consents.set(id, consent);
      logger.info(`✅ Consent granted: ${id}`);
      return consent;
    } catch (error) {
      logger.error('Error granting consent:', error);
      throw error;
    }
  }

  _getConsultations(patientId) {
    return Array.from(this.consultations.values())
      .filter(c => c.patientId === patientId)
      .sort((a, b) => new Date(b.consultationDate) - new Date(a.consultationDate));
  }

  _getPrescriptions(patientId) {
    return Array.from(this.prescriptions.values())
      .filter(p => p.patientId === patientId)
      .sort((a, b) => new Date(b.prescriptionDate) - new Date(a.prescriptionDate));
  }

  _getLabResults(patientId) {
    return Array.from(this.labResults.values())
      .filter(r => r.patientId === patientId)
      .sort((a, b) => new Date(b.testDate) - new Date(a.testDate));
  }

  _getImagingResults(patientId) {
    return Array.from(this.imagingResults.values())
      .filter(i => i.patientId === patientId)
      .sort((a, b) => new Date(b.examDate) - new Date(a.examDate));
  }
}

export default new DMPService();
