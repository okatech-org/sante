import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './core/Config.js';
import Logger from './core/Logger.js';
import eventBus from './core/EventBus.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patient.routes.js';
import professionalRoutes from './routes/professional.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import notificationRoutes from './routes/notification.routes.js';

import authNeuron from './neurons/AuthNeuron.js';
import patientNeuron from './neurons/PatientNeuron.js';
import professionalNeuron from './neurons/ProfessionalNeuron.js';
import appointmentNeuron from './neurons/AppointmentNeuron.js';
import notificationNeuron from './neurons/NotificationNeuron.js';

const logger = new Logger('Server');
const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Servir les fichiers statiques React sur /gouv
app.use('/gouv', express.static(path.resolve(__dirname, '../../dist')));

// Fallback pour React Router (SPA)
app.get(['/gouv', '/gouv/*'], (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    eventBusMetrics: eventBus.getMetrics(),
    neurons: {
      authNeuron: authNeuron.isActive ? 'active' : 'inactive',
      patientNeuron: patientNeuron.isActive ? 'active' : 'inactive',
      professionalNeuron: professionalNeuron.isActive ? 'active' : 'inactive',
      appointmentNeuron: appointmentNeuron.isActive ? 'active' : 'inactive',
      notificationNeuron: notificationNeuron.isActive ? 'active' : 'inactive'
    }
  });
});

app.get('/metrics/eventbus', (req, res) => {
  res.json(eventBus.getMetrics());
});

app.get('/events/history', (req, res) => {
  const { limit = 100, type } = req.query;
  res.json(eventBus.getHistory(parseInt(limit), type));
});

app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const start = async () => {
  try {
    logger.info('🚀 Starting SANTE.GA Neural Server...');
    
    await authNeuron.activate();
    await patientNeuron.activate();
    await professionalNeuron.activate();
    await appointmentNeuron.activate();
    await notificationNeuron.activate();

    app.listen(config.port, () => {
      logger.info(`✅ Server running on port ${config.port}`);
      logger.info(`📊 Environment: ${config.env}`);
      logger.info(`🧠 Event Bus ready`);
      logger.info(`🔐 AuthNeuron activated`);
      logger.info(`👥 PatientNeuron activated`);
      logger.info(`👨‍⚕️ ProfessionalNeuron activated`);
      logger.info(`📅 AppointmentNeuron activated`);
      logger.info(`🔔 NotificationNeuron activated`);
      logger.info('');
      logger.info('🎯 SANTE.GA NEURAL ARCHITECTURE READY! 🧠');
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  logger.info('🛑 SIGTERM received, shutting down gracefully...');
  
  await authNeuron.deactivate();
  await patientNeuron.deactivate();
  await professionalNeuron.deactivate();
  await appointmentNeuron.deactivate();
  await notificationNeuron.deactivate();
  
  process.exit(0);
});

start();

export default app;
