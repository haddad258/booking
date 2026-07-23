const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const {
  registerRules,
  loginRules,
  refreshTokenRules,
  forgotPasswordRules,
  resetPasswordRules,
} = require('../validators/auth.validator');

/**
 * @openapi
 * /api/v1/auth/customer/register:
 *   post:
 *     tags: [Auth - Customer]
 *     summary: Register a new customer account
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Registration successful
 */
router.post('/register', authLimiter, registerRules, validate, authController.register);

/**
 * @openapi
 * /api/v1/auth/customer/login:
 *   post:
 *     tags: [Auth - Customer]
 *     summary: Log in as a customer
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', authLimiter, loginRules, validate, authController.customerLogin);

router.post('/refresh-token', refreshTokenRules, validate, authController.refreshCustomerToken);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', authLimiter, forgotPasswordRules, validate, authController.forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordRules, validate, authController.resetPassword);

module.exports = router;
