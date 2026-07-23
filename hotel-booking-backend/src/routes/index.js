const express = require('express');
const router = express.Router();

router.use('/auth/customer', require('./auth.customer.routes'));
router.use('/auth/admin', require('./auth.admin.routes'));

router.use('/admin/admins', require('./admin.routes'));
router.use('/admin/customers', require('./admin.customers.routes'));
router.use('/admin/dashboard', require('./dashboard.routes'));

router.use('/customers', require('./customer.routes'));

router.use('/hotels', require('./hotel.routes'));
router.use('/chalets', require('./chalet.routes'));
router.use('/amenities', require('./amenity.routes'));
router.use('/bookings', require('./booking.routes'));
router.use('/payments', require('./payment.routes'));
router.use('/reviews', require('./review.routes'));
router.use('/settings', require('./settings.routes'));

router.get('/health', (req, res) => res.json({ success: true, message: 'API is healthy' }));

module.exports = router;
