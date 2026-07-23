const db = require('../config/database');
const ApiError = require('../utils/ApiError');
const { hashPassword } = require('../helpers/password.helper');
const { getPagination } = require('../utils/pagination');

function sanitize(admin) {
  if (!admin) return admin;
  const { password, refresh_token, ...safe } = admin;
  return safe;
}

async function listAdmins(query) {
  const { page, limit, offset } = getPagination(query);
  const qb = db('admins').select('*');
  if (query.status) qb.where('status', query.status);
  if (query.search) qb.where((b) => b.where('first_name', 'ilike', `%${query.search}%`).orWhere('last_name', 'ilike', `%${query.search}%`).orWhere('email', 'ilike', `%${query.search}%`));

  const totalQuery = qb.clone().clearSelect().count('* as count').first();
  const rowsQuery = qb.clone().orderBy('created_at', 'desc').limit(limit).offset(offset);
  const [{ count }, admins] = await Promise.all([totalQuery, rowsQuery]);

  return { data: admins.map(sanitize), page, limit, total: Number(count) };
}

async function getAdminById(id) {
  const admin = await db('admins').where({ id }).first();
  if (!admin) throw ApiError.notFound('Admin not found');
  return sanitize(admin);
}

async function createAdmin(payload) {
  const existing = await db('admins').where({ email: payload.email }).first();
  if (existing) throw ApiError.conflict('An admin with this email already exists');

  const hashed = await hashPassword(payload.password);
  const [admin] = await db('admins')
    .insert({
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      password: hashed,
      role_id: payload.roleId || null,
      is_super_admin: payload.isSuperAdmin || false,
    })
    .returning('*');

  return sanitize(admin);
}

async function updateAdmin(id, payload) {
  const admin = await db('admins').where({ id }).first();
  if (!admin) throw ApiError.notFound('Admin not found');

  const updates = {};
  const map = {
    firstName: 'first_name',
    lastName: 'last_name',
    email: 'email',
    roleId: 'role_id',
    status: 'status',
  };
  for (const [key, column] of Object.entries(map)) {
    if (payload[key] !== undefined) updates[column] = payload[key];
  }
  updates.updated_at = db.fn.now();

  await db('admins').where({ id }).update(updates);
  return getAdminById(id);
}

async function deleteAdmin(id, requesterId) {
  if (Number(id) === Number(requesterId)) {
    throw ApiError.badRequest('You cannot delete your own account');
  }
  const deleted = await db('admins').where({ id }).del();
  if (!deleted) throw ApiError.notFound('Admin not found');
}

// --- Roles & Permissions ---

async function listRoles() {
  const roles = await db('roles').select('*');
  const permissions = await db('role_permissions as rp')
    .join('permissions as p', 'p.id', 'rp.permission_id')
    .select('rp.role_id', 'p.id', 'p.name', 'p.module');

  return roles.map((role) => ({
    ...role,
    permissions: permissions.filter((p) => p.role_id === role.id).map(({ role_id, ...p }) => p),
  }));
}

async function createRole({ name, description, permissionIds }) {
  const existing = await db('roles').where({ name }).first();
  if (existing) throw ApiError.conflict('A role with this name already exists');

  const [role] = await db('roles').insert({ name, description: description || null }).returning('*');

  if (Array.isArray(permissionIds) && permissionIds.length) {
    const rows = permissionIds.map((permission_id) => ({ role_id: role.id, permission_id }));
    await db('role_permissions').insert(rows);
  }
  return role;
}

async function updateRolePermissions(roleId, permissionIds) {
  const role = await db('roles').where({ id: roleId }).first();
  if (!role) throw ApiError.notFound('Role not found');

  await db('role_permissions').where({ role_id: roleId }).del();
  if (Array.isArray(permissionIds) && permissionIds.length) {
    const rows = permissionIds.map((permission_id) => ({ role_id: roleId, permission_id }));
    await db('role_permissions').insert(rows);
  }
  return listRoles();
}

async function deleteRole(roleId) {
  const deleted = await db('roles').where({ id: roleId }).del();
  if (!deleted) throw ApiError.notFound('Role not found');
}

async function listPermissions() {
  return db('permissions').select('*').orderBy('module');
}

module.exports = {
  listAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  listRoles,
  createRole,
  updateRolePermissions,
  deleteRole,
  listPermissions,
  sanitize,
};
