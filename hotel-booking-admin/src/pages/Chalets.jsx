import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, MenuItem, Grid, IconButton, Stack, Autocomplete, Chip, FormControlLabel, Checkbox, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import StarIcon from '@mui/icons-material/Star';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import EntityDialog from '../components/EntityDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusChip from '../components/StatusChip';
import useDataTable from '../hooks/useDataTable';
import useToast from '../hooks/useToast';
import chaletService from '../services/chalet.service';
import amenityService from '../services/amenity.service';

const STATUS_OPTIONS = ['draft', 'published', 'archived'];

export default function Chalets() {
  const navigate = useNavigate();
  const toast = useToast();
  const table = useDataTable(chaletService.list);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [amenities, setAmenities] = useState([]);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  useEffect(() => {
    amenityService.list().then((res) => setAmenities(res.data || []));
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', address: '', city: '', country: '', capacity: 2, bedrooms: 1, bathrooms: 1, basePrice: '', rating: '', ratedPrice: '', status: 'draft', amenityIds: [], important: false });
    setDialogOpen(true);
  };

  const openEdit = async (chalet) => {
    setEditing(chalet);
    // The list endpoint doesn't include the amenities relation (only
    // getById does), so fetch full detail to pre-populate it correctly.
    const full = await chaletService.getById(chalet.id);
    reset({
      name: full.name,
      address: full.address,
      city: full.city,
      country: full.country,
      capacity: full.capacity,
      bedrooms: full.bedrooms,
      bathrooms: full.bathrooms,
      basePrice: full.base_price,
      rating: full.rating || '',
      ratedPrice: full.rated_price || '',
      status: full.status,
      description: full.description || '',
      amenityIds: (full.amenities || []).map((a) => a.id),
      important: !!full.important,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        capacity: Number(values.capacity),
        bedrooms: Number(values.bedrooms),
        bathrooms: Number(values.bathrooms),
        basePrice: Number(values.basePrice),
        rating: values.rating !== '' && values.rating != null ? Number(values.rating) : undefined,
        ratedPrice: values.ratedPrice !== '' && values.ratedPrice != null ? Number(values.ratedPrice) : undefined,
        amenityIds: values.amenityIds || [],
      };
      if (editing) {
        await chaletService.update(editing.id, payload);
        toast.success('Chalet updated');
      } else {
        await chaletService.create(payload);
        toast.success('Chalet created');
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
      await chaletService.remove(deleting.id);
      toast.success('Chalet deleted');
      setDeleting(null);
      table.refetch();
    } catch (err) {
      toast.error(err);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (r) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {r.important && (
            <Tooltip title="Featured on homepage">
              <StarIcon fontSize="small" color="secondary" />
            </Tooltip>
          )}
          <strong>{r.name}</strong>
        </Stack>
      ),
    },
    { key: 'city', label: 'City', render: (r) => `${r.city}, ${r.country}` },
    { key: 'capacity', label: 'Capacity', render: (r) => `${r.capacity} guests · ${r.bedrooms} bed` },
    { key: 'base_price', label: 'Base price', render: (r) => <span className="mono">{Number(r.base_price).toFixed(2)} KWD</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusChip status={r.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => navigate(`/chalets/${r.id}`)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => openEdit(r)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setDeleting(r)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Chalets" subtitle="Manage chalet properties and pricing" actionLabel="Add chalet" onAction={openCreate} />

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
        searchPlaceholder="Search chalets…"
        emptyAction={{ label: 'Add your first chalet', onClick: openCreate }}
      />

      <EntityDialog
        open={dialogOpen}
        title={editing ? 'Edit chalet' : 'Add chalet'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        loading={saving}
        maxWidth="md"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Name" {...register('name', { required: true })} error={!!errors.name} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Address" {...register('address', { required: true })} error={!!errors.address} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="City" {...register('city', { required: true })} error={!!errors.city} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Country" {...register('country', { required: true })} error={!!errors.country} />
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth type="number" label="Capacity" {...register('capacity', { required: true })} />
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth type="number" label="Bedrooms" {...register('bedrooms', { required: true })} />
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth type="number" label="Bathrooms" {...register('bathrooms')} />
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth type="number" label="Base price / night (KWD)" {...register('basePrice', { required: true })} />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              type="number"
              label="Rated price (KWD)"
              helperText="Optional, e.g. weekend rate incl. fees"
              inputProps={{ min: 0, step: '0.01' }}
              {...register('ratedPrice')}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              type="number"
              label="Rating (0–5)"
              helperText="Editorial/quality rating"
              inputProps={{ min: 0, max: 5, step: '0.1' }}
              {...register('rating')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField select fullWidth label="Status" defaultValue="draft" {...register('status')}>
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox {...register('important')} defaultChecked={false} />}
              label="Featured (À la une) — show in the 'Les plus demandés' section on the homepage"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Description" {...register('description')} />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="amenityIds"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={amenities}
                  getOptionLabel={(a) => a.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={amenities.filter((a) => (field.value || []).includes(a.id))}
                  onChange={(e, selected) => field.onChange(selected.map((a) => a.id))}
                  renderInput={(params) => <TextField {...params} label="Amenities" placeholder="Select amenities" />}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip {...getTagProps({ index })} key={option.id} label={option.name} size="small" />
                    ))
                  }
                />
              )}
            />
          </Grid>
        </Grid>
      </EntityDialog>

      <ConfirmDialog
        open={!!deleting}
        message={`Delete "${deleting?.name}"? This can't be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
