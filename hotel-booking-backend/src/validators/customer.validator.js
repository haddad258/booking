const { body, param } = require('express-validator');

const updateProfileRules = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phone').optional().isString(),
];

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('New password must contain at least one number'),
];

const addAddressRules = [
  body('addressLine1').trim().notEmpty().withMessage('Address line 1 is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('label').optional().isString(),
  body('isDefault').optional().isBoolean(),
];

const idParamRule = [param('id').isInt().withMessage('Invalid id')];

module.exports = { updateProfileRules, changePasswordRules, addAddressRules, idParamRule };
