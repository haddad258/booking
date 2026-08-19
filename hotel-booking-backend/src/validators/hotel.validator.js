const { body, param, query } = require('express-validator');

const createHotelRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').optional().isString(),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 }),
  body('starRating').optional().isInt({ min: 0, max: 5 }),
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('amenityIds').optional().isArray(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('important').optional().isBoolean(),
];

const updateHotelRules = [
  param('id').isInt().withMessage('Invalid hotel id'),
  body('name').optional().trim().notEmpty(),
  body('basePrice').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('important').optional().isBoolean(),
];

const idParamRule = [param('id').isInt().withMessage('Invalid id')];

const listHotelsRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('city').optional().isString(),
  query('country').optional().isString(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('rating').optional().isInt({ min: 0, max: 5 }),
  query('status').optional().isIn(['draft', 'published', 'archived']),
  query('important').optional().isBoolean(),
];

const createRoomRules = [
  param('id').isInt().withMessage('Invalid hotel id'),
  body('name').trim().notEmpty().withMessage('Room name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('capacityAdults').optional().isInt({ min: 1 }),
  body('capacityChildren').optional().isInt({ min: 0 }),
  body('quantity').optional().isInt({ min: 1 }),
];

module.exports = {
  createHotelRules,
  updateHotelRules,
  idParamRule,
  listHotelsRules,
  createRoomRules,
};
