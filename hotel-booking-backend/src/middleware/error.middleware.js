const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/** Catches unmatched routes and forwards a 404 ApiError. */
function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

/** Normalizes known DB / library errors into ApiError instances. */
function normalizeError(err) {
  if (err instanceof ApiError) return err;

  // Postgres unique_violation
  if (err.code === '23505') {
    return ApiError.conflict('A record with these details already exists');
  }
  // Postgres foreign_key_violation
  if (err.code === '23503') {
    return ApiError.badRequest('Related resource does not exist or is still referenced');
  }
  // Postgres not_null_violation
  if (err.code === '23502') {
    return ApiError.badRequest(`Missing required field: ${err.column || 'unknown'}`);
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Invalid or expired token');
  }
  if (err.name === 'MulterError') {
    return ApiError.badRequest(`File upload error: ${err.message}`);
  }
  if (err.message === 'Not allowed by CORS') {
    return new ApiError(403, 'This origin is not permitted to access the API');
  }

  return ApiError.internal(err.message || 'Internal Server Error');
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const apiError = normalizeError(err);

  if (!apiError.isOperational) {
    logger.error(err);
  } else if (apiError.statusCode >= 500) {
    logger.error(err);
  }

  const response = {
    success: false,
    message: apiError.message,
  };
  if (apiError.errors) response.errors = apiError.errors;
  if (process.env.NODE_ENV === 'development' && !apiError.isOperational) {
    response.stack = err.stack;
  }

  res.status(apiError.statusCode || 500).json(response);
}

module.exports = { notFoundHandler, errorHandler };
