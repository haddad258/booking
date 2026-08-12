const express = require('express');
const router = express.Router();

const chaletController = require('../controllers/chalet.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { upload, uploadTo, verifyMagicBytes } = require('../middleware/upload.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createChaletRules,
  updateChaletRules,
  idParamRule,
  listChaletsRules,
} = require('../validators/chalet.validator');

// --- Public routes ---
router.get('/', listChaletsRules, validate, chaletController.list);
router.get('/:id', idParamRule, validate, chaletController.getById);
router.get('/:id/availability', chaletController.checkAvailability);

// --- Admin routes ---
router.use(authenticate, requireAdmin);

router.post('/', requirePermission('chalets.create'), createChaletRules, validate, chaletController.create);
router.patch('/:id', requirePermission('chalets.update'), updateChaletRules, validate, chaletController.update);
router.delete('/:id', requirePermission('chalets.delete'), idParamRule, validate, chaletController.remove);

router.post(
  '/:id/images',
  requirePermission('chalets.update'),
  idParamRule,
  validate,
  uploadTo('chalets'),
  upload.array('images', 10),
  verifyMagicBytes,
  chaletController.uploadImages
);
router.delete('/:id/images/:imageId', requirePermission('chalets.update'), chaletController.removeImage);

router.put('/:id/availability', requirePermission('chalets.update'), chaletController.setAvailability);

module.exports = router;
