const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const db = require('../config/database');

/**
 * Restricts a route to super admins only.
 */
const requireSuperAdmin = (req, res, next) => {
  if (!req.admin || !req.admin.is_super_admin) {
    return next(ApiError.forbidden('Super admin access required'));
  }
  next();
};

/**
 * Factory that returns middleware enforcing one or more permissions
 * (e.g. 'hotels.create'). Super admins always pass. Requires `authenticate`
 * and `requireAdmin` to have run first (req.admin must be set).
 */
const requirePermission = (...permissionNames) =>
  catchAsync(async (req, res, next) => {
    if (!req.admin) throw ApiError.forbidden('Admin access required');
    if (req.admin.is_super_admin) return next();
    if (!req.admin.role_id) throw ApiError.forbidden('No role assigned');

    const rows = await db('role_permissions as rp')
      .join('permissions as p', 'p.id', 'rp.permission_id')
      .where('rp.role_id', req.admin.role_id)
      .whereIn('p.name', permissionNames)
      .select('p.name');

    const granted = new Set(rows.map((r) => r.name));
    const missing = permissionNames.filter((p) => !granted.has(p));

    if (missing.length) {
      throw ApiError.forbidden(`Missing permission(s): ${missing.join(', ')}`);
    }
    next();
  });

module.exports = { requireSuperAdmin, requirePermission };
