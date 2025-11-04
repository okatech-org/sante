import dotenv from 'dotenv';
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'sante_ga',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  },

  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10)
  },

  jwt: {
    secret: (() => {
      const s = process.env.JWT_SECRET;
      if (!s) {
        throw new Error('[Config] Missing JWT_SECRET environment variable.');
      }
      return s;
    })(),
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

export default config;
