import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, MenuItem, IconButton, Stack, Chip, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import EntityDialog from '../components/EntityDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import useToast from '../hooks/useToast';
import amenityService from '../services/amenity.service';

const TYPE_OPTIONS = ['hotel', 'chalet', 'both'];

export default function Amenities() {
  const toast = useToast();
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteError, setDeleteError] = useState(null); // { message, usageCount }

  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    const res = await amenityService.list();
    setAmenities(res.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', icon: '', type: 'both' });
    setDialogOpen(true);
  };

  const openEdit = (amenity) => {
    setEditing(amenity);
    reset({ name: amenity.name, icon: amenity.icon || '', type: amenity.type });
    setDialogOpen(true);
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      if (editing) {
        await amenityService.update(editing.id, values);
        toast.success('Amenity updated');
      } else {
        await amenityService.create(values);
        toast.success('Amenity created');
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (amenity) => {
    setDeleteError(null);
    setDeleting(amenity);
  };

  // First attempt goes through without force. If the amenity is in use, the
  // backend rejects with a usage count instead of silently cascading — we
  // surface that count and let the admin explicitly confirm removing it
  // from every property that currently has it (see AUDIT-PHASE-1.md, Medium #8).
  const confirmDelete = async (force = false) => {
    try {
      await amenityService.remove(deleting.id, force);
      toast.success('Amenity deleted');
      setDeleting(null);
      setDeleteError(null);
      load();
    } catch (err) {
      const usageCount = err?.response?.data?.errors?.usageCount;
      if (err?.response?.status === 409 && usageCount) {
        setDeleteError({ message: err.response.data.message, usageCount });
      } else {
        toast.error(err);
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'icon', label: 'Icon' },
    { key: 'type', label: 'Applies to' },
    {
      key: 'usage',
      label: 'In use',
      render: (r) =>
        r.usageCount > 0 ? (
          <Chip
            size="small"
            label={`${r.usageCount} propert${r.usageCount === 1 ? 'y' : 'ies'}`}
            color="secondary"
            variant="outlined"
          />
        ) : (
          <Chip size="small" label="Unused" variant="outlined" />
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => openEdit(r)}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => openDelete(r)}><DeleteIcon fontSize="small" /></IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Amenities" subtitle="Shared amenities list used across hotels and chalets" actionLabel="Add amenity" onAction={openCreate} />

      <DataTable columns={columns} rows={amenities} total={amenities.length} loading={loading} />

      <EntityDialog
        open={dialogOpen}
        title={editing ? 'Edit amenity' : 'Add amenity'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        loading={saving}
      >
        <TextField fullWidth label="Name" {...register('name', { required: true })} />
        <TextField fullWidth label="Icon (Material icon name)" {...register('icon')} />
        <TextField select fullWidth label="Applies to" defaultValue="both" {...register('type')}>
          {TYPE_OPTIONS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
      </EntityDialog>

      <ConfirmDialog
        open={!!deleting}
        title={deleteError ? 'This amenity is in use' : 'Delete amenity'}
        message={
          deleteError ? (
            <Alert severity="warning" sx={{ mb: 0 }}>
              {deleteError.message} Deleting it will remove it from every property listed above.
            </Alert>
          ) : (
            `Delete "${deleting?.name}"?`
          )
        }
        onConfirm={() => confirmDelete(!!deleteError)}
        onCancel={() => { setDeleting(null); setDeleteError(null); }}
      />
    </>
  );
}
