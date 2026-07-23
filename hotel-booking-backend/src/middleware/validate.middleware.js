const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after an array of express-validator chains. If any failed, responds
 * with 400 and a structured list of field errors.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));
  next(ApiError.badRequest('Validation failed', formatted));
}

module.exports = validate;
