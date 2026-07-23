const { body, param, query } = require('express-validator');

const createBookingRules = [
  body('bookableType').isIn(['hotel', 'chalet']).withMessage('bookableType must be hotel or chalet'),
  body('bookableId').isInt({ min: 1 }).withMessage('bookableId is required'),
  body('roomId').optional().isInt({ min: 1 }),
  body('checkIn').isISO8601().withMessage('checkIn must be a valid date'),
  body('checkOut')
    .isISO8601()
    .withMessage('checkOut must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.checkIn)) {
        throw new Error('checkOut must be after checkIn');
      }
      return true;
    }),
  body('guestsAdults').optional().isInt({ min: 1 }),
  body('guestsChildren').optional().isInt({ min: 0 }),
  body('notes').optional().isString(),
];

const updateBookingStatusRules = [
  param('id').isInt().withMessage('Invalid booking id'),
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status'),
];

const idParamRule = [param('id').isInt().withMessage('Invalid id')];

const listBookingsRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']),
  query('bookableType').optional().isIn(['hotel', 'chalet']),
];

module.exports = { createBookingRules, updateBookingStatusRules, idParamRule, listBookingsRules };
