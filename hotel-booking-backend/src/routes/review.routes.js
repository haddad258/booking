const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/review.controller');
const { authenticate, requireCustomer, requireAdmin } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createReviewRules,
  updateReviewRules,
  moderateReviewRules,
  idParamRule,
} = require('../validators/review.validator');

// Public: list approved reviews for a hotel/chalet
router.get('/', reviewController.list);

// Customer-facing
router.post('/', authenticate, requireCustomer, createReviewRules, validate, reviewController.create);
router.patch('/:id', authenticate, requireCustomer, updateReviewRules, validate, reviewController.update);
router.delete('/:id', authenticate, requireCustomer, idParamRule, validate, reviewController.remove);

// Admin moderation
router.get(
  '/admin/all',
  authenticate,
  requireAdmin,
  requirePermission('reviews.moderate'),
  reviewController.listForModeration
);
router.patch(
  '/:id/moderate',
  authenticate,
  requireAdmin,
  requirePermission('reviews.moderate'),
  moderateReviewRules,
  validate,
  reviewController.moderate
);

module.exports = router;
