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
import dashboardRoutes from './routes/dashboard.routes.js';
import { authenticate, authorize } from './neurons/auth/AuthMiddleware.js';
import { UserRoles } from './neurons/auth/RoleDefinitions.js';

import authNeuron from './neurons/AuthNeuron.js';
import patientNeuron from './neurons/PatientNeuron.js';
import professionalNeuron from './neurons/ProfessionalNeuron.js';
import appointmentNeuron from './neurons/AppointmentNeuron.js';
import notificationNeuron from './neurons/NotificationNeuron.js';

const logger = new Logger('Server');
const app = express();

// Trust proxy (needed for correct IP when behind reverse proxy)
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet());

// Strict CORS based on env allowlist
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:8081').split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow curl / health checks
    const ok = allowedOrigins.includes(origin);
    callback(ok ? null : new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Lightweight in-memory rate limiter (per IP)
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10); // 1 min
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '300', 10); // 300 req/min
const buckets = new Map();
app.use((req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  let b = buckets.get(key);
  if (!b || now - b.start > RATE_LIMIT_WINDOW_MS) {
    b = { start: now, count: 0 };
    buckets.set(key, b);
  }
  b.count += 1;
  if (b.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', authenticate, authorize([UserRoles.MINISTRE, UserRoles.ADMIN, UserRoles.SUPER_ADMIN]), dashboardRoutes);

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

app.get('/metrics/eventbus', authenticate, authorize([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]), (req, res) => {
  res.json(eventBus.getMetrics());
});

app.get('/events/history', authenticate, authorize([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]), (req, res) => {
  const { limit = 100, type } = req.query;
  res.json(eventBus.getHistory(parseInt(limit, 10), type));
});

app.use((err, req, res, next) => {
  logger.error('Error:', err);
  const payload = { error: 'Internal server error' };
  if (config.env !== 'production') {
    payload.message = err.message;
  }
  res.status(500).json(payload);
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
