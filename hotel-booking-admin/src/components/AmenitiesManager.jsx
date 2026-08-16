import { useState } from 'react';
import {
  Box, Typography, Chip, Stack, Button, Autocomplete, TextField, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/AddRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import EntityDialog from './EntityDialog';
import useToast from '../hooks/useToast';
import amenityService from '../services/amenity.service';

const TYPE_OPTIONS = ['hotel', 'chalet', 'both'];

/**
 * Per-property amenities management section: shows currently assigned
 * amenities as removable chips, and an "Add Amenity" button that opens a
 * dialog to either attach existing amenities from the shared catalog or
 * create a brand-new one on the spot (which is then immediately attached).
 *
 * `onSave(nextAmenityIds)` is called with the full new amenity id list
 * whenever the assignment changes (add, remove, or newly created) — the
 * parent page owns the actual hotel/chalet update call and reload.
 */
export default function AmenitiesManager({ amenities = [], allAmenities = [], onSave, onCatalogRefresh, defaultType = 'both' }) {
  const toast = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState(defaultType);

  const currentIds = amenities.map((a) => a.id);
  const availableToAdd = allAmenities.filter((a) => !currentIds.includes(a.id));

  const openDialog = () => {
    setSelected([]);
    setNewName('');
    setNewType(defaultType);
    setDialogOpen(true);
  };

  const handleAttachSelected = async () => {
    if (selected.length === 0) return;
    setSaving(true);
    try {
      const nextIds = [...currentIds, ...selected.map((a) => a.id)];
      await onSave(nextIds);
      toast.success('Amenities added');
      setDialogOpen(false);
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAndAttach = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const created = await amenityService.create({ name: newName.trim(), type: newType });
      await onCatalogRefresh?.();
      const nextIds = [...currentIds, created.id];
      await onSave(nextIds);
      toast.success(`"${created.name}" created and added`);
      setDialogOpen(false);
    } catch (err) {
      toast.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleRemove = async (amenityId) => {
    try {
      const nextIds = currentIds.filter((id) => id !== amenityId);
      await onSave(nextIds);
      toast.success('Amenity removed');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700}>Amenities</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={openDialog}>Add Amenity</Button>
      </Stack>

      <Stack direction="row" flexWrap="wrap" gap={1}>
        {amenities.length ? (
          amenities.map((a) => (
            <Chip
              key={a.id}
              label={a.name}
              size="small"
              onDelete={() => handleRemove(a.id)}
              deleteIcon={<CloseIcon fontSize="small" />}
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">No amenities assigned yet.</Typography>
        )}
      </Stack>

      <EntityDialog
        open={dialogOpen}
        title="Add Amenity"
        onClose={() => setDialogOpen(false)}
        onSubmit={(e) => { e.preventDefault(); handleAttachSelected(); }}
        loading={saving}
      >
        <Autocomplete
          multiple
          options={availableToAdd}
          getOptionLabel={(a) => a.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          value={selected}
          onChange={(e, value) => setSelected(value)}
          renderInput={(params) => <TextField {...params} label="Attach existing amenities" placeholder="Search…" />}
        />

        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2.5, mt: 0.5 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
            Or create a new amenity
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <TextField
              size="small"
              fullWidth
              label="New amenity name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <TextField
              select
              size="small"
              label="Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              {TYPE_OPTIONS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </Stack>
          <Button
            size="small"
            variant="outlined"
            sx={{ mt: 1.5 }}
            disabled={!newName.trim() || creating}
            onClick={handleCreateAndAttach}
          >
            Create &amp; attach
          </Button>
        </Box>
      </EntityDialog>
    </Box>
  );
}
