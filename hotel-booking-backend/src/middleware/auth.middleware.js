const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { verifyAccessToken } = require('../helpers/token.helper');
const db = require('../config/database');

function extractToken(req) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.split(' ')[1];
  return null;
}

/**
 * Verifies the access token and attaches `req.user = { id, type, role }`.
 * `type` is either 'admin' or 'customer'.
 */
const authenticate = catchAsync(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) throw ApiError.unauthorized('Authentication token is missing');

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  req.user = { id: payload.sub, type: payload.type, role: payload.role };
  next();
});

/** Restricts access to authenticated admins only. */
const requireAdmin = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.type !== 'admin') {
    throw ApiError.forbidden('Admin access required');
  }
  const admin = await db('admins').where({ id: req.user.id }).first();
  if (!admin || admin.status !== 'active') {
    throw ApiError.forbidden('Admin account is inactive');
  }
  req.admin = admin;
  next();
});

/** Restricts access to authenticated customers only. */
const requireCustomer = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.type !== 'customer') {
    throw ApiError.forbidden('Customer access required');
  }
  const customer = await db('customers').where({ id: req.user.id }).first();
  if (!customer || customer.status !== 'active') {
    throw ApiError.forbidden('Customer account is inactive');
  }
  req.customer = customer;
  next();
});

module.exports = { authenticate, requireAdmin, requireCustomer };
