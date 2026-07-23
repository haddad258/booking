const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customer.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');
const { idParamRule } = require('../validators/customer.validator');

router.use(authenticate, requireAdmin);

router.get('/', requirePermission('customers.view'), customerController.list);
router.get('/:id', requirePermission('customers.view'), idParamRule, validate, customerController.getById);
router.patch('/:id/status', requirePermission('customers.update'), idParamRule, validate, customerController.updateStatus);
router.delete('/:id', requirePermission('customers.delete'), idParamRule, validate, customerController.remove);

module.exports = router;
