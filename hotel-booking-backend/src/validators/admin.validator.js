const { body, param } = require('express-validator');

const createAdminRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('roleId').optional().isInt({ min: 1 }),
  body('isSuperAdmin').optional().isBoolean(),
];

const updateAdminRules = [
  param('id').isInt().withMessage('Invalid admin id'),
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('roleId').optional().isInt({ min: 1 }),
  body('status').optional().isIn(['active', 'suspended']),
];

const idParamRule = [param('id').isInt().withMessage('Invalid id')];

const createRoleRules = [
  body('name').trim().notEmpty().withMessage('Role name is required'),
  body('description').optional().isString(),
  body('permissionIds').optional().isArray(),
];

module.exports = { createAdminRules, updateAdminRules, idParamRule, createRoleRules };
