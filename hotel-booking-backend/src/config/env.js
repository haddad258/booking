require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:3001',

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    resetSecret: process.env.JWT_RESET_SECRET || 'reset_secret',
    resetExpiresIn: process.env.JWT_RESET_EXPIRES_IN || '1h',
  },

  bcrypt: {
    saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 200,
    authMax: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM || 'Hotel Booking Platform <no-reply@hotelbooking.com>',
  },

  uploads: {
    maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 5,
    dir: process.env.UPLOAD_DIR || 'src/uploads',
  },

  defaults: {
    currency: process.env.DEFAULT_CURRENCY || 'USD',
    language: process.env.DEFAULT_LANGUAGE || 'en',
  },
};
