import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, MenuItem, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import EntityDialog from '../components/EntityDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusChip from '../components/StatusChip';
import useDataTable from '../hooks/useDataTable';
import useToast from '../hooks/useToast';
import adminService from '../services/admin.service';
import { useAuth } from '../contexts/AuthContext';

export default function Admins() {
  const { user } = useAuth();
  const toast = useToast();
  const table = useDataTable(adminService.list);
  const [roles, setRoles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    adminService.listRoles().then(setRoles);
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ firstName: '', lastName: '', email: '', password: '', roleId: '' });
    setDialogOpen(true);
  };

  const openEdit = (admin) => {
    setEditing(admin);
    reset({ firstName: admin.first_name, lastName: admin.last_name, email: admin.email, roleId: admin.role_id || '', status: admin.status });
    setDialogOpen(true);
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      if (editing) {
        const { password, ...rest } = values;
        await adminService.update(editing.id, rest);
        toast.success('Admin updated');
      } else {
        await adminService.create(values);
        toast.success('Admin created');
      }
      setDialogOpen(false);
      table.refetch();
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await adminService.remove(deleting.id);
      toast.success('Admin deleted');
      setDeleting(null);
      table.refetch();
    } catch (err) {
      toast.error(err);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (r) => <strong>{r.first_name} {r.last_name}</strong> },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (r) => (r.is_super_admin ? 'Super Admin' : roles.find((role) => role.id === r.role_id)?.name || '—') },
    { key: 'status', label: 'Status', render: (r) => <StatusChip status={r.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => openEdit(r)} disabled={r.is_super_admin && r.id !== user.id}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setDeleting(r)} disabled={r.id === user.id}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Admins" subtitle="Manage admin accounts and role assignments" actionLabel="Add admin" onAction={openCreate} />

      <DataTable
        columns={columns}
        rows={table.rows}
        total={table.total}
        page={table.page}
        limit={table.limit}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        onSearch={table.onSearch}
        loading={table.loading}
        searchPlaceholder="Search admins…"
        emptyAction={{ label: 'Add your first admin', onClick: openCreate }}
      />

      <EntityDialog
        open={dialogOpen}
        title={editing ? 'Edit admin' : 'Add admin'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        loading={saving}
      >
        <TextField fullWidth label="First name" {...register('firstName', { required: true })} error={!!errors.firstName} />
        <TextField fullWidth label="Last name" {...register('lastName', { required: true })} error={!!errors.lastName} />
        <TextField fullWidth label="Email" {...register('email', { required: true })} error={!!errors.email} disabled={!!editing} />
        {!editing && (
          <TextField fullWidth type="password" label="Password" {...register('password', { required: !editing, minLength: 8 })} />
        )}
        <TextField select fullWidth label="Role" defaultValue="" {...register('roleId')}>
          <MenuItem value="">No role</MenuItem>
          {roles.map((role) => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}
        </TextField>
        {editing && (
          <TextField select fullWidth label="Status" defaultValue={editing.status} {...register('status')}>
            <MenuItem value="active">active</MenuItem>
            <MenuItem value="suspended">suspended</MenuItem>
          </TextField>
        )}
      </EntityDialog>

      <ConfirmDialog
        open={!!deleting}
        message={`Delete admin "${deleting?.first_name} ${deleting?.last_name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
