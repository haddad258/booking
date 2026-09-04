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
  upsertDescriptionRules,
  descriptionIdParamRule,
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
router.put('/:id/images/reorder', requirePermission('chalets.update'), chaletController.reorderImages);
router.put('/:id/images/:imageId/cover', requirePermission('chalets.update'), chaletController.setCoverImage);

router.put('/:id/availability', requirePermission('chalets.update'), chaletController.setAvailability);

// --- Multilingual descriptions (Requirement #7) ---
router.get('/:id/descriptions', requirePermission('chalets.update'), idParamRule, validate, chaletController.listDescriptions);
router.post('/:id/descriptions', requirePermission('chalets.update'), upsertDescriptionRules, validate, chaletController.upsertDescription);
router.put('/:id/descriptions/:descriptionId/default', requirePermission('chalets.update'), descriptionIdParamRule, validate, chaletController.setDefaultDescription);
router.delete('/:id/descriptions/:descriptionId', requirePermission('chalets.update'), descriptionIdParamRule, validate, chaletController.deleteDescription);

module.exports = router;
