require('dotenv').config();

const KNOWN_WEAK_DEFAULTS = new Set([
  'access_secret',
  'refresh_secret',
  'reset_secret',
  'change_this_access_secret',
  'change_this_refresh_secret',
  'change_this_reset_secret',
]);

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:3001',
  // Comma-separated list of additional allowed CORS origins, e.g.
  // "https://admin.example.com,https://app.example.com". clientUrl/adminUrl
  // and localhost dev ports are always included; this is for anything else
  // (staging domains, a VPS IP, etc.) without needing a code change.
  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  // Set to '1'/'true' when running behind a reverse proxy (nginx, Caddy, a
  // cloud load balancer) so express-rate-limit and req.ip see the real
  // client IP from X-Forwarded-For instead of the proxy's IP.
  trustProxy: ['1', 'true'].includes((process.env.TRUST_PROXY || '').toLowerCase()),

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
    // Lives outside src/ so runtime-written files never mix with source code
    // (cleaner containerization, and a fresh checkout/rebuild can't wipe it).
    dir: process.env.UPLOAD_DIR || 'storage/public/uploads',
  },

  // Where public image URLs should be resolved against. Today this is the
  // same origin as the API (uploads are served by the same Express app via
  // /uploads), but keeping it as its own var means a future dedicated image
  // server / CDN is a one-variable change, not a code change.
  imageServerUrl: process.env.IMAGE_SERVER_URL || null,

  defaults: {
    currency: process.env.DEFAULT_CURRENCY || 'KWD',
    language: process.env.DEFAULT_LANGUAGE || 'en',
  },

  isKnownWeakSecret: (value) => KNOWN_WEAK_DEFAULTS.has(value),
};
