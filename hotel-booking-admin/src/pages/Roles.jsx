import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box, Paper, Typography, Checkbox, Button, TextField, Stack, IconButton, Grid, Table, TableHead,
  TableRow, TableCell, TableBody,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddIcon from '@mui/icons-material/AddRounded';
import PageHeader from '../components/PageHeader';
import EntityDialog from '../components/EntityDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import useToast from '../hooks/useToast';
import adminService from '../services/admin.service';

export default function Roles() {
  const toast = useToast();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState({}); // { [roleId]: Set(permissionIds) }

  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    const [rolesData, permsData] = await Promise.all([adminService.listRoles(), adminService.listPermissions()]);
    setRoles(rolesData);
    setPermissions(permsData);
    setDirty({});
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const modulesByName = permissions.reduce((acc, p) => {
    (acc[p.module] = acc[p.module] || []).push(p);
    return acc;
  }, {});

  const isChecked = (role, permId) => {
    const dirtySet = dirty[role.id];
    if (dirtySet) return dirtySet.has(permId);
    return role.permissions.some((p) => p.id === permId);
  };

  const toggle = (role, permId) => {
    setDirty((prev) => {
      const current = new Set(prev[role.id] || role.permissions.map((p) => p.id));
      if (current.has(permId)) current.delete(permId);
      else current.add(permId);
      return { ...prev, [role.id]: current };
    });
  };

  const savePermissions = async (roleId) => {
    setSaving(true);
    try {
      await adminService.updateRolePermissions(roleId, Array.from(dirty[roleId] || []));
      toast.success('Permissions updated');
      load();
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  const onCreateRole = async (values) => {
    setSaving(true);
    try {
      await adminService.createRole({ name: values.name, description: values.description, permissionIds: [] });
      toast.success('Role created');
      setCreateOpen(false);
      reset();
      load();
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteRole = async () => {
    try {
      await adminService.deleteRole(deleting.id);
      toast.success('Role deleted');
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading) return null;

  return (
    <Box>
      <PageHeader
        title="Roles & Permissions"
        subtitle="Control what each admin role can see and do"
        actionLabel="Add role"
        onAction={() => setCreateOpen(true)}
        actionIcon={<AddIcon />}
      />

      <Stack spacing={2}>
        {roles.map((role) => (
          <Paper key={role.id} elevation={0} sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>{role.name}</Typography>
                {role.description && <Typography variant="body2" color="text.secondary">{role.description}</Typography>}
              </Box>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="contained" color="secondary" disabled={!dirty[role.id] || saving} onClick={() => savePermissions(role.id)}>
                  Save
                </Button>
                <IconButton size="small" onClick={() => setDeleting(role)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Module</TableCell>
                  <TableCell align="center">View</TableCell>
                  <TableCell align="center">Create</TableCell>
                  <TableCell align="center">Update</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(modulesByName).map(([moduleName, perms]) => (
                  <TableRow key={moduleName}>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{moduleName}</TableCell>
                    {['view', 'create', 'update', 'delete'].map((action) => {
                      const perm = perms.find((p) => p.name === `${moduleName}.${action}`);
                      return (
                        <TableCell key={action} align="center">
                          {perm ? (
                            <Checkbox
                              size="small"
                              checked={isChecked(role, perm.id)}
                              onChange={() => toggle(role, perm.id)}
                            />
                          ) : (
                            '—'
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ))}
      </Stack>

      <EntityDialog open={createOpen} title="Add role" onClose={() => setCreateOpen(false)} onSubmit={handleSubmit(onCreateRole)} loading={saving}>
        <TextField fullWidth label="Role name" {...register('name', { required: true })} />
        <TextField fullWidth label="Description" {...register('description')} />
      </EntityDialog>

      <ConfirmDialog open={!!deleting} message={`Delete role "${deleting?.name}"?`} onConfirm={confirmDeleteRole} onCancel={() => setDeleting(null)} />
    </Box>
  );
}
