const express = require('express');
const router = express.Router();

const hotelController = require('../controllers/hotel.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { upload, uploadTo, verifyMagicBytes } = require('../middleware/upload.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createHotelRules,
  updateHotelRules,
  idParamRule,
  listHotelsRules,
  createRoomRules,
} = require('../validators/hotel.validator');

// --- Public routes ---
router.get('/', listHotelsRules, validate, hotelController.list);
router.get('/:id', idParamRule, validate, hotelController.getById);
router.get('/:id/availability', hotelController.checkAvailability);

// --- Admin routes ---
router.use(authenticate, requireAdmin);

router.post('/', requirePermission('hotels.create'), createHotelRules, validate, hotelController.create);
router.patch('/:id', requirePermission('hotels.update'), updateHotelRules, validate, hotelController.update);
router.delete('/:id', requirePermission('hotels.delete'), idParamRule, validate, hotelController.remove);

router.post(
  '/:id/images',
  requirePermission('hotels.update'),
  idParamRule,
  validate,
  uploadTo('hotels'),
  upload.array('images', 10),
  verifyMagicBytes,
  hotelController.uploadImages
);
router.delete('/:id/images/:imageId', requirePermission('hotels.update'), hotelController.removeImage);
router.put('/:id/images/reorder', requirePermission('hotels.update'), hotelController.reorderImages);
router.put('/:id/images/:imageId/cover', requirePermission('hotels.update'), hotelController.setCoverImage);

router.post('/:id/rooms', requirePermission('hotels.update'), createRoomRules, validate, hotelController.addRoom);
router.patch('/:id/rooms/:roomId', requirePermission('hotels.update'), hotelController.updateRoom);
router.delete('/:id/rooms/:roomId', requirePermission('hotels.update'), hotelController.deleteRoom);

router.put('/:id/rooms/:roomId/availability', requirePermission('hotels.update'), hotelController.setAvailability);

module.exports = router;
