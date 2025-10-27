import Logger from '../../core/Logger.js';

const logger = new Logger('InsuranceService');

class InsuranceService {
  constructor() {
    this.insuranceRecords = new Map();
  }

  async verifyCNAMGS(cnamgsNumber) {
    try {
      logger.info(`Verifying CNAMGS: ${cnamgsNumber}`);

      const mockResponse = {
        valid: true,
        status: 'active',
        coveragePercent: 80,
        isPregnant: false,
        hasALD: false,
        remainingBalance: 500000,
        lastUpdate: new Date().toISOString()
      };

      if (mockResponse.isPregnant) {
        mockResponse.coveragePercent = 100;
      } else if (mockResponse.hasALD) {
        mockResponse.coveragePercent = 90;
      }

      return mockResponse;
    } catch (error) {
      logger.error('CNAMGS verification error:', error);
      throw error;
    }
  }

  async verifyCNSS(cnssNumber) {
    try {
      logger.info(`Verifying CNSS: ${cnssNumber}`);

      const mockResponse = {
        valid: true,
        employerPaying: true,
        monthsValidated: 180,
        lastPaymentDate: '2024-11-30',
        pensionProjection: 450000
      };

      return mockResponse;
    } catch (error) {
      logger.error('CNSS verification error:', error);
      throw error;
    }
  }

  async updateInsuranceStatus(patientId, cnamgsData, cnssData) {
    try {
      this.insuranceRecords.set(patientId, {
        cnamgsStatus: cnamgsData?.valid ? 'verified' : 'invalid',
        cnamgsCoveragePercent: cnamgsData?.coveragePercent || 80,
        cnssVerified: cnssData?.valid || false,
        lastInsuranceCheck: new Date().toISOString()
      });

      logger.info(`✅ Insurance status updated for patient: ${patientId}`);
    } catch (error) {
      logger.error('Insurance update error:', error);
      throw error;
    }
  }

  getInsuranceStatus(patientId) {
    return this.insuranceRecords.get(patientId);
  }
}

export default new InsuranceService();
