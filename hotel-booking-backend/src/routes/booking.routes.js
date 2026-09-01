const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/booking.controller');
const paymentController = require('../controllers/payment.controller');
const { authenticate, requireCustomer, requireAdmin } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createBookingRules,
  createGuestBookingRules,
  updateBookingStatusRules,
  idParamRule,
  listBookingsRules,
} = require('../validators/booking.validator');

// --- Public: checkout without an existing login (registered BEFORE the
// blanket `authenticate` below, so it's reachable with no Bearer token) ---
router.post('/guest', authLimiter, createGuestBookingRules, validate, bookingController.createGuest);

router.use(authenticate);

// --- Customer-facing ---
router.post('/', requireCustomer, createBookingRules, validate, bookingController.create);
router.get('/my', requireCustomer, listBookingsRules, validate, bookingController.myBookings);
router.get('/my/:id', requireCustomer, idParamRule, validate, bookingController.getMyBookingById);
router.post('/my/:id/cancel', requireCustomer, idParamRule, validate, bookingController.cancel);

// --- Admin-facing ---
router.get('/', requireAdmin, requirePermission('bookings.view'), listBookingsRules, validate, bookingController.list);
router.get('/:id', requireAdmin, requirePermission('bookings.view'), idParamRule, validate, bookingController.getById);
router.patch(
  '/:id/status',
  requireAdmin,
  requirePermission('bookings.update'),
  updateBookingStatusRules,
  validate,
  bookingController.updateStatus
);

// Payments nested under a booking
router.post('/:bookingId/payments', requireAdmin, requirePermission('bookings.update'), paymentController.recordPayment);
router.get('/:bookingId/payments', requireAdmin, requirePermission('bookings.view'), paymentController.listForBooking);

module.exports = router;
