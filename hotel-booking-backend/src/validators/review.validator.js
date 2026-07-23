const { body, param } = require('express-validator');

const createReviewRules = [
  body('bookableType').isIn(['hotel', 'chalet']).withMessage('bookableType must be hotel or chalet'),
  body('bookableId').isInt({ min: 1 }).withMessage('bookableId is required'),
  body('bookingId').optional().isInt({ min: 1 }),
  body('rating').isFloat({ min: 0, max: 5 }).withMessage('rating must be between 0 and 5'),
  body('comment').optional().isString().isLength({ max: 2000 }),
];

const updateReviewRules = [
  param('id').isInt().withMessage('Invalid review id'),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
  body('comment').optional().isString().isLength({ max: 2000 }),
];

const moderateReviewRules = [
  param('id').isInt().withMessage('Invalid review id'),
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
];

const idParamRule = [param('id').isInt().withMessage('Invalid id')];

module.exports = { createReviewRules, updateReviewRules, moderateReviewRules, idParamRule };
