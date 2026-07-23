const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');

router.use(authenticate, requireAdmin);

router.post('/:id/refund', requirePermission('payments.refund'), paymentController.refund);

module.exports = router;
