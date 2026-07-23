const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customer.controller');
const { authenticate, requireCustomer } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { updateProfileRules, changePasswordRules, addAddressRules } = require('../validators/customer.validator');

router.use(authenticate, requireCustomer);

router.get('/me', customerController.me);
router.patch('/me', updateProfileRules, validate, customerController.updateProfile);
router.post('/me/change-password', changePasswordRules, validate, customerController.changePassword);

router.post('/me/addresses', addAddressRules, validate, customerController.addAddress);
router.delete('/me/addresses/:id', customerController.removeAddress);

router.get('/me/favorites', customerController.listFavorites);
router.post('/me/favorites', customerController.addFavorite);
router.delete('/me/favorites/:type/:id', customerController.removeFavorite);

router.get('/me/bookings', customerController.bookingHistory);

module.exports = router;
