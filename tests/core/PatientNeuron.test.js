import PatientService from '../../src/neural/neurons/patient/PatientService.js';
import DMPService from '../../src/neural/neurons/patient/DMPService.js';
import InsuranceService from '../../src/neural/neurons/patient/InsuranceService.js';

describe('PatientNeuron System', () => {
  describe('PatientService', () => {
    test('should create a patient profile', async () => {
      const userId = 'user_123';
      const profileData = {
        firstName: 'Jean',
        lastName: 'OKOME',
        dateOfBirth: '1990-05-15',
        cnamgsNumber: 'CNAM123456'
      };

      const profile = await PatientService.createProfile(userId, profileData);

      expect(profile).toBeDefined();
      expect(profile.userId).toBe(userId);
      expect(profile.firstName).toBe('Jean');
      expect(profile.cnamgsStatus).toBe('unverified');
    });

    test('should update a patient profile', async () => {
      const userId = 'user_456';
      const profileData = {
        firstName: 'Marie',
        lastName: 'Test'
      };

      const created = await PatientService.createProfile(userId, profileData);
      const updated = await PatientService.updateProfile(created.id, {
        lastName: 'UPDATED'
      });

      expect(updated.lastName).toBe('UPDATED');
      expect(updated.updatedAt).toBeDefined();
    });

    test('should add medical history', async () => {
      const userId = 'user_789';
      const profile = await PatientService.createProfile(userId, {
        firstName: 'Test'
      });

      const history = await PatientService.addMedicalHistory(profile.id, {
        type: 'allergy',
        name: 'Penicillin'
      });

      expect(history).toBeDefined();
      expect(history.type).toBe('allergy');
    });

    test('should add vaccination', async () => {
      const userId = 'user_vac';
      const profile = await PatientService.createProfile(userId, {
        firstName: 'Test'
      });

      const vaccination = await PatientService.addVaccination(profile.id, {
        vaccineName: 'COVID-19',
        administeredDate: '2024-01-15'
      });

      expect(vaccination).toBeDefined();
      expect(vaccination.vaccineName).toBe('COVID-19');
    });
  });

  describe('InsuranceService', () => {
    test('should verify CNAMGS coverage', async () => {
      const result = await InsuranceService.verifyCNAMGS('CNAM123456');

      expect(result.valid).toBe(true);
      expect(result.status).toBe('active');
      expect(result.coveragePercent).toBe(80);
    });

    test('should verify CNSS coverage', async () => {
      const result = await InsuranceService.verifyCNSS('CNSS789');

      expect(result.valid).toBe(true);
      expect(result.employerPaying).toBe(true);
      expect(result.monthsValidated).toBeGreaterThan(0);
    });

    test('should update insurance status', async () => {
      const userId = 'user_ins';
      const profile = await PatientService.createProfile(userId, {
        firstName: 'Test',
        cnamgsNumber: 'CNAM999'
      });

      const cnamgsData = { valid: true, coveragePercent: 90 };
      await InsuranceService.updateInsuranceStatus(profile.id, cnamgsData, null);

      const status = InsuranceService.getInsuranceStatus(profile.id);
      expect(status.cnamgsCoveragePercent).toBe(90);
    });
  });

  describe('DMPService', () => {
    test('patient should access own DMP', async () => {
      const patientId = 'patient_dmp';
      const hasAccess = await DMPService.checkAccess(patientId, patientId);
      expect(hasAccess).toBe(true);
    });

    test('should deny access without consent', async () => {
      const hasAccess = await DMPService.checkAccess('patient_123', 'doctor_456');
      expect(hasAccess).toBe(false);
    });

    test('should add consultation to DMP', async () => {
      const consultation = await DMPService.addConsultation({
        patientId: 'patient_123',
        professionalId: 'doctor_456',
        reason: 'General checkup',
        consultationDate: new Date().toISOString()
      });

      expect(consultation).toBeDefined();
      expect(consultation.reason).toBe('General checkup');
    });

    test('should add prescription to DMP', async () => {
      const prescription = await DMPService.addPrescription({
        patientId: 'patient_123',
        professionalId: 'doctor_456',
        medications: [
          {
            name: 'Paracétamol 500mg',
            dosage: '1 comprimé',
            frequency: '3 fois par jour'
          }
        ],
        prescriptionDate: new Date().toISOString()
      });

      expect(prescription).toBeDefined();
      expect(prescription.medications).toHaveLength(1);
    });

    test('should grant consent for DMP access', async () => {
      const consent = await DMPService.grantConsent({
        patientId: 'patient_123',
        professionalId: 'doctor_456',
        accessType: 'read'
      });

      expect(consent).toBeDefined();
      expect(consent.accessType).toBe('read');
    });

    test('should return full DMP for authorized patient', async () => {
      const patientId = 'dmp_patient';
      
      await DMPService.addConsultation({
        patientId,
        professionalId: 'doc_1',
        reason: 'Test'
      });

      const dmp = await DMPService.getFullDMP(patientId, patientId);

      expect(dmp.consultations).toBeDefined();
      expect(dmp.prescriptions).toBeDefined();
      expect(dmp.consultations.length).toBeGreaterThan(0);
    });
  });

  describe('Patient-Insurance Integration', () => {
    test('should verify patient insurances', async () => {
      const userId = 'user_int';
      const profile = await PatientService.createProfile(userId, {
        firstName: 'Test',
        cnamgsNumber: 'CNAM_INT',
        cnssNumber: 'CNSS_INT'
      });

      const results = await PatientService.verifyInsurances(profile.id);

      expect(results.cnamgs).toBeDefined();
      expect(results.cnss).toBeDefined();
      expect(results.cnamgs.valid).toBe(true);
    });
  });
});
