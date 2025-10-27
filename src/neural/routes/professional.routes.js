import express from 'express';
import { authenticate, authorize, requirePermission } from '../neurons/auth/AuthMiddleware.js';
import professionalNeuron from '../neurons/ProfessionalNeuron.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { specialty, city, teleconsultation, verified } = req.query;
    
    const filters = {};
    if (specialty) filters.specialty = specialty;
    if (city) filters.city = city;
    if (teleconsultation !== undefined) filters.acceptsTeleconsultation = teleconsultation === 'true';
    if (verified !== undefined) filters.verified = verified === 'true';

    const professionals = await professionalNeuron.searchProfessionals(filters);
    
    res.json({
      success: true,
      professionals
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get('/:professionalId', async (req, res) => {
  try {
    const professional = await professionalNeuron.getProfile(req.params.professionalId);
    
    res.json({
      success: true,
      professional
    });
  } catch (error) {
    res.status(404).json({
      error: 'Professional not found'
    });
  }
});

router.get('/:professionalId/schedule', async (req, res) => {
  try {
    const schedule = await professionalNeuron.getSchedule?.(req.params.professionalId);
    
    res.json({
      success: true,
      schedule
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.put('/:professionalId/schedule', authenticate, authorize(['doctor_general', 'doctor_specialist']), async (req, res) => {
  try {
    const schedule = await professionalNeuron.setSchedule(req.params.professionalId, req.body);
    
    res.json({
      success: true,
      schedule
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.put('/me', authenticate, authorize(['doctor_general', 'doctor_specialist']), async (req, res) => {
  try {
    const updated = await professionalNeuron.updateProfile(req.params.professionalId, req.body);
    
    res.json({
      success: true,
      professional: updated
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
