const express = require('express');
const router = express.Router();

const settingsController = require('../controllers/settings.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');

// Public: website/theme/language/currency settings needed by the public site & admin panel
router.get('/', settingsController.getAll);
router.get('/:group', settingsController.getGroup);

// Admin: update a settings group
router.put(
  '/:group',
  authenticate,
  requireAdmin,
  requirePermission('settings.update'),
  settingsController.updateGroup
);

module.exports = router;
