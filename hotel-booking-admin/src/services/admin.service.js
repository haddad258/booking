import api from './api';
import createResourceService from './resource.service';

const admins = createResourceService('/admin/admins');

async function listRoles() {
  const { data } = await api.get('/admin/admins/roles/all');
  return data.data;
}

async function createRole(payload) {
  const { data } = await api.post('/admin/admins/roles', payload);
  return data.data;
}

async function updateRolePermissions(roleId, permissionIds) {
  const { data } = await api.patch(`/admin/admins/roles/${roleId}/permissions`, { permissionIds });
  return data.data;
}

async function deleteRole(roleId) {
  const { data } = await api.delete(`/admin/admins/roles/${roleId}`);
  return data;
}

async function listPermissions() {
  const { data } = await api.get('/admin/admins/permissions/all');
  return data.data;
}

export default { ...admins, listRoles, createRole, updateRolePermissions, deleteRole, listPermissions };
