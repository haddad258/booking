const express = require('express');
const router = express.Router();

const amenityController = require('../controllers/amenity.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');

router.get('/', amenityController.list);

router.post('/', authenticate, requireAdmin, requirePermission('amenities.manage'), amenityController.create);
router.patch('/:id', authenticate, requireAdmin, requirePermission('amenities.manage'), amenityController.update);
router.delete('/:id', authenticate, requireAdmin, requirePermission('amenities.manage'), amenityController.remove);

module.exports = router;
