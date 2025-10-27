import BaseNeuron from '../core/BaseNeuron.js';
import EventTypes from '../types/events.js';

class NotificationNeuron extends BaseNeuron {
  constructor() {
    super('NotificationNeuron');
    this.notifications = new Map();
  }

  getSubscriptions() {
    return [
      {
        eventType: EventTypes.NOTIFICATION_SENT,
        handler: this.handleNotification.bind(this)
      },
      {
        eventType: EventTypes.EMAIL_SENT,
        handler: this.handleEmail.bind(this)
      },
      {
        eventType: EventTypes.SMS_SENT,
        handler: this.handleSMS.bind(this)
      },
      {
        eventType: EventTypes.APPOINTMENT_REMINDER_SENT,
        handler: this.handleAppointmentReminder.bind(this)
      }
    ];
  }

  async handleNotification(event) {
    const { userId, type, message, data } = event.data;
    
    this.logger.info(`🔔 Notification: ${type} → User ${userId}`);

    try {
      await this._sendSMS(userId, message);
      await this._sendPushNotification(userId, message, data);
      await this._saveInAppNotification(userId, type, message, data);
    } catch (error) {
      this.logger.error('Error sending notification:', error);
    }
  }

  async handleEmail(event) {
    const { to, template, data } = event.data;
    
    this.logger.info(`📧 Email: ${template} → ${to}`);

    try {
      await this._sendEmail(to, template, data);
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }

  async handleSMS(event) {
    const { phone, message } = event.data;
    
    this.logger.info(`📱 SMS → ${phone}`);

    try {
      await this._sendSMS(phone, message);
    } catch (error) {
      this.logger.error('Error sending SMS:', error);
    }
  }

  async handleAppointmentReminder(event) {
    const { appointmentId, patientId, appointmentDate } = event.data;
    
    this.logger.info(`⏰ Appointment reminder: ${appointmentId}`);

    const time = new Date(appointmentDate).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const message = `Rappel : Vous avez un RDV demain à ${time}`;

    try {
      await this._sendSMS(patientId, message);
      await this._sendPushNotification(patientId, message, { appointmentId });
    } catch (error) {
      this.logger.error('Error sending reminder:', error);
    }
  }

  async _sendSMS(phoneOrUserId, message) {
    this.logger.debug(`SMS to ${phoneOrUserId}: ${message}`);
    return { success: true };
  }

  async _sendEmail(to, template, data) {
    this.logger.debug(`Email to ${to}: template=${template}`);
    return { success: true };
  }

  async _sendPushNotification(userId, message, data) {
    this.logger.debug(`Push to user ${userId}: ${message}`);
    return { success: true };
  }

  async _saveInAppNotification(userId, type, message, data) {
    const notifId = `notif_${Date.now()}`;
    
    const notification = {
      id: notifId,
      userId,
      type,
      message,
      data,
      read: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.set(notifId, notification);
    this.logger.info(`💾 In-app notification saved: ${notifId}`);
    
    return notification;
  }

  async getNotifications(userId, limit = 20) {
    const userNotifs = Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return userNotifs;
  }

  async markAsRead(notificationId) {
    const notif = this.notifications.get(notificationId);
    if (notif) {
      notif.read = true;
      this.notifications.set(notificationId, notif);
    }
    return notif;
  }
}

const notificationNeuron = new NotificationNeuron();
export default notificationNeuron;
