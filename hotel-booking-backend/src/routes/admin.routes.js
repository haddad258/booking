const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { requireSuperAdmin, requirePermission } = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');
const { createAdminRules, updateAdminRules, idParamRule, createRoleRules } = require('../validators/admin.validator');

router.use(authenticate, requireAdmin);

router.get('/me', adminController.me);

// Admins CRUD (super admin only, since admins manage other admins)
router.get('/', requireSuperAdmin, adminController.list);
router.get('/:id', requireSuperAdmin, idParamRule, validate, adminController.getById);
router.post('/', requireSuperAdmin, createAdminRules, validate, adminController.create);
router.patch('/:id', requireSuperAdmin, updateAdminRules, validate, adminController.update);
router.delete('/:id', requireSuperAdmin, idParamRule, validate, adminController.remove);

// Roles & permissions
router.get('/roles/all', requirePermission('roles.view'), adminController.listRoles);
router.post('/roles', requireSuperAdmin, createRoleRules, validate, adminController.createRole);
router.patch('/roles/:id/permissions', requireSuperAdmin, idParamRule, validate, adminController.updateRolePermissions);
router.delete('/roles/:id', requireSuperAdmin, idParamRule, validate, adminController.deleteRole);
router.get('/permissions/all', requireSuperAdmin, adminController.listPermissions);

module.exports = router;
