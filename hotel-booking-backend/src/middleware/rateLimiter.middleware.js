const rateLimit = require('express-rate-limit');
const { rateLimit: rlConfig } = require('../config/env');

const generalLimiter = rateLimit({
  windowMs: rlConfig.windowMs,
  max: rlConfig.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

/** Stricter limiter for login/register/forgot-password to slow brute force attempts. */
const authLimiter = rateLimit({
  windowMs: rlConfig.windowMs,
  max: rlConfig.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later.' },
});

module.exports = { generalLimiter, authLimiter };
