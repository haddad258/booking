const { body, param, query } = require('express-validator');

const createChaletRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').optional().isString(),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('bedrooms').isInt({ min: 1 }).withMessage('Bedrooms must be at least 1'),
  body('bathrooms').optional().isInt({ min: 1 }),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('rating must be between 0 and 5'),
  body('ratedPrice').optional().isFloat({ min: 0 }).withMessage('ratedPrice must be a positive number'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('amenityIds').optional().isArray(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('important').optional().isBoolean(),
];

const updateChaletRules = [
  param('id').isInt().withMessage('Invalid chalet id'),
  body('name').optional().trim().notEmpty(),
  body('basePrice').optional().isFloat({ min: 0 }),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('rating must be between 0 and 5'),
  body('ratedPrice').optional().isFloat({ min: 0 }).withMessage('ratedPrice must be a positive number'),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('important').optional().isBoolean(),
];

const idParamRule = [param('id').isInt().withMessage('Invalid id')];

const listChaletsRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('city').optional().isString(),
  query('minCapacity').optional().isInt({ min: 1 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('important').optional().isBoolean(),
];

const upsertDescriptionRules = [
  param('id').isInt().withMessage('Invalid chalet id'),
  body('language').trim().notEmpty().isLength({ min: 2, max: 10 }).withMessage('language is required (e.g. "en", "fr", "ar")'),
  body('description').trim().notEmpty().withMessage('description is required'),
  body('isDefault').optional().isBoolean(),
];

const descriptionIdParamRule = [
  param('id').isInt().withMessage('Invalid chalet id'),
  param('descriptionId').isInt().withMessage('Invalid description id'),
];

module.exports = {
  createChaletRules,
  updateChaletRules,
  idParamRule,
  listChaletsRules,
  upsertDescriptionRules,
  descriptionIdParamRule,
};
