import express from 'express';
import { authenticate, authorize } from '../neurons/auth/AuthMiddleware.js';
import appointmentNeuron from '../neurons/AppointmentNeuron.js';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { professionalId, appointmentDate, type, reason, duration, notes } = req.body;

    const appointment = await appointmentNeuron.createAppointment({
      patientId: req.user.userId,
      professionalId,
      appointmentDate,
      type,
      reason,
      duration,
      notes
    });

    res.status(201).json({
      success: true,
      appointment
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const { status, upcoming } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (upcoming !== undefined) filters.upcoming = upcoming === 'true';

    let appointments;
    if (req.user.role === 'patient') {
      const patientId = `patient_${req.user.userId}`;
      appointments = await appointmentNeuron.getPatientAppointments(patientId, filters);
    } else {
      const professionalId = `prof_${req.user.userId}`;
      appointments = await appointmentNeuron.getProfessionalAppointments(professionalId, filters);
    }

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get('/:appointmentId', authenticate, async (req, res) => {
  try {
    const appointment = Array.from(appointmentNeuron.appointments?.values() || [])
      .find(a => a.id === req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.post('/:appointmentId/confirm', authenticate, authorize(['doctor_general', 'doctor_specialist']), async (req, res) => {
  try {
    await appointmentNeuron.confirmAppointment(req.params.appointmentId);

    res.json({
      success: true,
      message: 'Appointment confirmed'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.post('/:appointmentId/cancel', authenticate, async (req, res) => {
  try {
    const { reason } = req.body;

    await appointmentNeuron.cancelAppointment(req.params.appointmentId, reason);

    res.json({
      success: true,
      message: 'Appointment cancelled'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
