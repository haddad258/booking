const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const adminService = require('../services/admin.service');

const list = catchAsync(async (req, res) => {
  const { data, page, limit, total } = await adminService.listAdmins(req.query);
  ApiResponse.paginated(res, { data, page, limit, total });
});

const getById = catchAsync(async (req, res) => {
  const admin = await adminService.getAdminById(req.params.id);
  ApiResponse.send(res, { data: admin });
});

const create = catchAsync(async (req, res) => {
  const admin = await adminService.createAdmin(req.body);
  ApiResponse.send(res, { statusCode: 201, message: 'Admin created', data: admin });
});

const update = catchAsync(async (req, res) => {
  const admin = await adminService.updateAdmin(req.params.id, req.body);
  ApiResponse.send(res, { message: 'Admin updated', data: admin });
});

const remove = catchAsync(async (req, res) => {
  await adminService.deleteAdmin(req.params.id, req.admin.id);
  ApiResponse.send(res, { message: 'Admin deleted' });
});

const me = catchAsync(async (req, res) => {
  const admin = await adminService.getAdminById(req.admin.id);
  ApiResponse.send(res, { data: admin });
});

// Roles & permissions

const listRoles = catchAsync(async (req, res) => {
  const roles = await adminService.listRoles();
  ApiResponse.send(res, { data: roles });
});

const createRole = catchAsync(async (req, res) => {
  const role = await adminService.createRole(req.body);
  ApiResponse.send(res, { statusCode: 201, message: 'Role created', data: role });
});

const updateRolePermissions = catchAsync(async (req, res) => {
  const roles = await adminService.updateRolePermissions(req.params.id, req.body.permissionIds);
  ApiResponse.send(res, { message: 'Role permissions updated', data: roles });
});

const deleteRole = catchAsync(async (req, res) => {
  await adminService.deleteRole(req.params.id);
  ApiResponse.send(res, { message: 'Role deleted' });
});

const listPermissions = catchAsync(async (req, res) => {
  const permissions = await adminService.listPermissions();
  ApiResponse.send(res, { data: permissions });
});

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  me,
  listRoles,
  createRole,
  updateRolePermissions,
  deleteRole,
  listPermissions,
};
