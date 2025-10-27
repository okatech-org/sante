import BaseNeuron from '../core/BaseNeuron.js';
import EventTypes from '../types/events.js';

class AppointmentNeuron extends BaseNeuron {
  constructor() {
    super('AppointmentNeuron');
    this.appointments = new Map();
    this.reminders = new Map();
  }

  getSubscriptions() {
    return [
      {
        eventType: EventTypes.APPOINTMENT_CREATED,
        handler: this.handleAppointmentCreated.bind(this)
      },
      {
        eventType: EventTypes.APPOINTMENT_CONFIRMED,
        handler: this.handleAppointmentConfirmed.bind(this)
      },
      {
        eventType: EventTypes.APPOINTMENT_CANCELLED,
        handler: this.handleAppointmentCancelled.bind(this)
      }
    ];
  }

  async handleAppointmentCreated(event) {
    const { appointment } = event.data;
    
    this.logger.info(`📅 Appointment created: ${appointment.id}`);

    await this.emit(EventTypes.NOTIFICATION_SENT, {
      userId: appointment.patientId,
      type: 'appointment_created',
      message: `RDV créé pour le ${new Date(appointment.appointmentDate).toLocaleString('fr-FR')}`
    });

    await this.emit(EventTypes.NOTIFICATION_SENT, {
      userId: appointment.professionalId,
      type: 'new_appointment',
      message: `Nouveau RDV pour le ${new Date(appointment.appointmentDate).toLocaleString('fr-FR')}`
    });

    this._scheduleReminder(appointment);
  }

  async handleAppointmentConfirmed(event) {
    const { appointmentId } = event.data;
    
    const appt = this.appointments.get(appointmentId);
    if (appt) {
      appt.status = 'confirmed';
      appt.updatedAt = new Date().toISOString();
      this.appointments.set(appointmentId, appt);
      this.logger.info(`✅ Appointment confirmed: ${appointmentId}`);
    }
  }

  async handleAppointmentCancelled(event) {
    const { appointmentId, reason } = event.data;
    
    const appt = this.appointments.get(appointmentId);
    if (appt) {
      appt.status = 'cancelled';
      appt.cancelledAt = new Date().toISOString();
      appt.cancelReason = reason;
      appt.updatedAt = new Date().toISOString();
      this.appointments.set(appointmentId, appt);
      this.logger.info(`❌ Appointment cancelled: ${appointmentId}`);
    }

    if (this.reminders.has(appointmentId)) {
      clearTimeout(this.reminders.get(appointmentId));
      this.reminders.delete(appointmentId);
    }
  }

  async createAppointment(appointmentData) {
    const appointmentId = `appt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const appointment = {
      id: appointmentId,
      patientId: appointmentData.patientId,
      professionalId: appointmentData.professionalId,
      appointmentDate: appointmentData.appointmentDate,
      duration: appointmentData.duration || 30,
      type: appointmentData.type || 'in_person',
      status: 'pending',
      reason: appointmentData.reason,
      notes: appointmentData.notes,
      consultationPrice: appointmentData.consultationPrice || 0,
      cnamgsCoverage: appointmentData.cnamgsCoverage || 0,
      patientPayment: appointmentData.patientPayment || 0,
      reminderSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      cancelledAt: null,
      cancelReason: null
    };

    this.appointments.set(appointmentId, appointment);
    
    await this.emit(EventTypes.APPOINTMENT_CREATED, { appointment });
    
    return appointment;
  }

  async getPatientAppointments(patientId, filters = {}) {
    let results = Array.from(this.appointments.values())
      .filter(a => a.patientId === patientId);

    if (filters.status) {
      results = results.filter(a => a.status === filters.status);
    }

    if (filters.upcoming) {
      const now = new Date();
      results = results.filter(a => new Date(a.appointmentDate) >= now);
    }

    return results.sort((a, b) => 
      new Date(a.appointmentDate) - new Date(b.appointmentDate)
    );
  }

  async getProfessionalAppointments(professionalId, filters = {}) {
    let results = Array.from(this.appointments.values())
      .filter(a => a.professionalId === professionalId);

    if (filters.status) {
      results = results.filter(a => a.status === filters.status);
    }

    if (filters.date) {
      const filterDate = new Date(filters.date).toDateString();
      results = results.filter(a => 
        new Date(a.appointmentDate).toDateString() === filterDate
      );
    }

    return results.sort((a, b) => 
      new Date(a.appointmentDate) - new Date(b.appointmentDate)
    );
  }

  async cancelAppointment(appointmentId, reason) {
    await this.emit(EventTypes.APPOINTMENT_CANCELLED, { appointmentId, reason });
  }

  async confirmAppointment(appointmentId) {
    await this.emit(EventTypes.APPOINTMENT_CONFIRMED, { appointmentId });
  }

  _scheduleReminder(appointment) {
    const appointmentTime = new Date(appointment.appointmentDate).getTime();
    const reminderTime = appointmentTime - (24 * 60 * 60 * 1000);
    const now = Date.now();

    if (reminderTime > now) {
      const timeout = setTimeout(async () => {
        await this.emit(EventTypes.APPOINTMENT_REMINDER_SENT, {
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          professionalId: appointment.professionalId,
          appointmentDate: appointment.appointmentDate
        });
        this.reminders.delete(appointment.id);
      }, reminderTime - now);

      this.reminders.set(appointment.id, timeout);
      this.logger.info(`⏰ Reminder scheduled for appointment: ${appointment.id}`);
    }
  }
}

const appointmentNeuron = new AppointmentNeuron();
export default appointmentNeuron;
