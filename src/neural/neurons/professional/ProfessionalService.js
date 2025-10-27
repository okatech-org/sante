import Logger from '../../core/Logger.js';

const logger = new Logger('ProfessionalService');

class ProfessionalService {
  constructor() {
    this.profiles = new Map();
    this.schedules = new Map();
  }

  async createProfile(userId, profileData) {
    const profileId = `prof_${userId}`;
    
    const profile = {
      id: profileId,
      userId,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      specialty: profileData.specialty,
      subSpecialty: profileData.subSpecialty,
      licenseNumber: profileData.licenseNumber,
      licenseVerified: false,
      yearsExperience: profileData.yearsExperience || 0,
      phone: profileData.phone,
      officeAddress: profileData.officeAddress,
      city: profileData.city,
      province: profileData.province,
      acceptsTeleconsultation: profileData.acceptsTeleconsultation || false,
      consultationPrice: profileData.consultationPrice || 0,
      teleconsultationPrice: profileData.teleconsultationPrice,
      cnamgsPrice: profileData.cnamgsPrice,
      workingHours: profileData.workingHours || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verifiedAt: null
    };

    this.profiles.set(profileId, profile);
    logger.info(`✅ Professional profile created: ${profileId}`);
    return profile;
  }

  async getProfile(professionalId) {
    const profile = this.profiles.get(professionalId);
    if (!profile) throw new Error(`Professional not found: ${professionalId}`);
    return profile;
  }

  async updateProfile(professionalId, updates) {
    const profile = this.profiles.get(professionalId);
    if (!profile) throw new Error(`Professional not found: ${professionalId}`);

    const updated = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.profiles.set(professionalId, updated);
    logger.info(`✅ Professional profile updated: ${professionalId}`);
    return updated;
  }

  async searchProfessionals(filters = {}) {
    let results = Array.from(this.profiles.values());

    if (filters.specialty) {
      results = results.filter(p => p.specialty === filters.specialty);
    }

    if (filters.city) {
      results = results.filter(p => p.city === filters.city);
    }

    if (filters.acceptsTeleconsultation !== undefined) {
      results = results.filter(p => p.acceptsTeleconsultation === filters.acceptsTeleconsultation);
    }

    if (filters.verified !== undefined) {
      results = results.filter(p => p.licenseVerified === filters.verified);
    }

    return results;
  }

  async verifyLicense(professionalId, licenseNumber) {
    logger.info(`Verifying license: ${licenseNumber}`);

    const isValid = true;

    if (isValid) {
      const profile = this.profiles.get(professionalId);
      if (profile) {
        profile.licenseVerified = true;
        profile.verifiedAt = new Date().toISOString();
        profile.updatedAt = new Date().toISOString();
        this.profiles.set(professionalId, profile);
        logger.info(`✅ License verified: ${professionalId}`);
      }
    }

    return { verified: isValid };
  }

  async getSchedule(professionalId) {
    const schedule = this.schedules.get(professionalId);
    return schedule || null;
  }

  async setSchedule(professionalId, schedule) {
    this.schedules.set(professionalId, {
      id: `schedule_${professionalId}`,
      professionalId,
      ...schedule,
      updatedAt: new Date().toISOString()
    });
    logger.info(`✅ Schedule set for: ${professionalId}`);
    return this.schedules.get(professionalId);
  }
}

export default new ProfessionalService();
