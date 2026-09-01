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

// Guest checkout: the booking fields above, plus the contact info needed
// to create the Customer record, plus an optional account-creation step.
const createGuestBookingRules = [
  ...createBookingRules,
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').optional().isString(),
  body('createAccount').optional().isBoolean(),
  body('password').custom((value, { req }) => {
    const wantsAccount = req.body.createAccount === true || req.body.createAccount === 'true';
    if (!wantsAccount) return true;
    if (!value || value.length < 8) throw new Error('Password must be at least 8 characters');
    if (!/\d/.test(value)) throw new Error('Password must contain at least one number');
    return true;
  }),
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

module.exports = { createBookingRules, createGuestBookingRules, updateBookingStatusRules, idParamRule, listBookingsRules };
