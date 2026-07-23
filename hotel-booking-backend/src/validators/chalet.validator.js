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
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('amenityIds').optional().isArray(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
];

const updateChaletRules = [
  param('id').isInt().withMessage('Invalid chalet id'),
  body('name').optional().trim().notEmpty(),
  body('basePrice').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(['draft', 'published', 'archived']),
];

const idParamRule = [param('id').isInt().withMessage('Invalid id')];

const listChaletsRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('city').optional().isString(),
  query('minCapacity').optional().isInt({ min: 1 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
];

module.exports = { createChaletRules, updateChaletRules, idParamRule, listChaletsRules };
