const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const {
  loginRules,
  refreshTokenRules,
  forgotPasswordRules,
  resetPasswordRules,
} = require('../validators/auth.validator');

/**
 * @openapi
 * /api/v1/auth/admin/login:
 *   post:
 *     tags: [Auth - Admin]
 *     summary: Log in as an admin
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', authLimiter, loginRules, validate, authController.adminLogin);

router.post('/refresh-token', refreshTokenRules, validate, authController.refreshAdminToken);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', authLimiter, forgotPasswordRules, validate, authController.forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordRules, validate, authController.resetPassword);

module.exports = router;
