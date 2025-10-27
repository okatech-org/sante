import winston from 'winston';

class Logger {
  constructor(context = 'App') {
    this.context = context;
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
          const metaStr = Object.keys(meta).length 
            ? `\n${JSON.stringify(meta, null, 2)}` 
            : '';
          return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}${metaStr}`;
        })
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
              const metaStr = Object.keys(meta).length 
                ? `\n${JSON.stringify(meta, null, 2)}` 
                : '';
              return `[${timestamp}] [${level}] [${context}] ${message}${metaStr}`;
            })
          )
        }),
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error' 
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log' 
        })
      ]
    });
  }

  info(message, meta = {}) {
    this.logger.info(message, { context: this.context, ...meta });
  }

  error(message, error = {}) {
    this.logger.error(message, { 
      context: this.context, 
      error: error.message,
      stack: error.stack
    });
  }

  warn(message, meta = {}) {
    this.logger.warn(message, { context: this.context, ...meta });
  }

  debug(message, meta = {}) {
    this.logger.debug(message, { context: this.context, ...meta });
  }
}

export default Logger;
