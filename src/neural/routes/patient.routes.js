import express from 'express';
import patientNeuron from '../neurons/PatientNeuron.js';
import { authenticate } from '../neurons/auth/AuthMiddleware.js';

const router = express.Router();

router.get('/me', authenticate, async (req, res) => {
  try {
    const patientId = `patient_${req.user.userId}`;
    const profile = await patientNeuron.getProfile(patientId);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(404).json({ error: 'Profile not found' });
  }
});

router.put('/me', authenticate, async (req, res) => {
  try {
    const patientId = `patient_${req.user.userId}`;
    const profile = await patientNeuron.updateProfile(patientId, req.body);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/me/verify-insurance', authenticate, async (req, res) => {
  try {
    const patientId = `patient_${req.user.userId}`;
    const results = await patientNeuron.verifyInsurances(patientId);
    res.json({ success: true, insurance: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me/dmp', authenticate, async (req, res) => {
  try {
    const patientId = `patient_${req.user.userId}`;
    const dmp = await patientNeuron.getFullDMP(patientId, req.user.userId);
    res.json({ success: true, dmp });
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
});

router.get('/:id/dmp', authenticate, async (req, res) => {
  try {
    const dmp = await patientNeuron.getFullDMP(req.params.id, req.user.userId);
    res.json({ success: true, dmp });
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
});

router.post('/me/medical-history', authenticate, async (req, res) => {
  try {
    const patientId = `patient_${req.user.userId}`;
    const history = await patientNeuron.addMedicalHistory(patientId, req.body);
    res.status(201).json({ success: true, history });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/me/vaccinations', authenticate, async (req, res) => {
  try {
    const patientId = `patient_${req.user.userId}`;
    const vaccination = await patientNeuron.addVaccination(patientId, req.body);
    res.status(201).json({ success: true, vaccination });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/me/consultations', authenticate, async (req, res) => {
  try {
    const patientId = `patient_${req.user.userId}`;
    const consultation = await patientNeuron.addConsultation({
      ...req.body,
      patientId
    });
    res.status(201).json({ success: true, consultation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/me/consents', authenticate, async (req, res) => {
  try {
    const patientId = `patient_${req.user.userId}`;
    const consent = await patientNeuron.grantConsent({
      ...req.body,
      patientId,
      grantedBy: req.user.userId
    });
    res.status(201).json({ success: true, consent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
