const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');

router.use(authenticate, requireAdmin, requirePermission('dashboard.view'));

router.get('/overview', dashboardController.overview);
router.get('/charts/revenue', dashboardController.revenueChart);
router.get('/charts/bookings-by-status', dashboardController.bookingsByStatus);
router.get('/occupancy-rate', dashboardController.occupancyRate);
router.get('/reports/bookings', dashboardController.bookingReport);
router.get('/reports/revenue', dashboardController.revenueReport);

module.exports = router;
