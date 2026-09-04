import { useState } from 'react';
import {
  Box, Typography, Stack, Button, TextField, MenuItem, Chip, IconButton, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/AddRounded';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorderRounded';
import EntityDialog from './EntityDialog';
import ConfirmDialog from './ConfirmDialog';
import useToast from '../hooks/useToast';

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English (en)' },
  { code: 'fr', label: 'Français (fr)' },
  { code: 'ar', label: 'العربية (ar)' },
  { code: 'es', label: 'Español (es)' },
  { code: 'de', label: 'Deutsch (de)' },
];

/**
 * Per-property multilingual description management (Requirement #7).
 * Lets an admin add/edit a description per language and choose which one
 * is the default — the fallback the public site shows when a visitor's
 * selected language has no matching description (see the website's
 * lib/descriptions.js for the corresponding frontend logic).
 *
 * `descriptions` is the array as returned by the API: [{ id, language,
 * description, is_default }]. The parent page owns the actual save/reload
 * calls, passed in as `onSave(payload)`, `onSetDefault(id)`, and
 * `onDelete(id)` — this component is presentation + form state only.
 */
export default function DescriptionsManager({ descriptions = [], onSave, onSetDefault, onDelete }) {
  const toast = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null); // the description row being edited, or null for "add new"
  const [language, setLanguage] = useState('en');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const usedLanguages = new Set(descriptions.map((d) => d.language));

  const openAdd = () => {
    setEditing(null);
    // Default to the first language that doesn't already have a description yet, if any.
    const nextLang = LANGUAGE_OPTIONS.find((l) => !usedLanguages.has(l.code))?.code || 'en';
    setLanguage(nextLang);
    setText('');
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setLanguage(row.language);
    setText(row.description);
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    try {
      await onSave({ language, description: text.trim() });
      toast.success(`Description saved for "${language}"`);
      setDialogOpen(false);
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (row) => {
    try {
      await onSetDefault(row.id);
      toast.success(`"${row.language}" is now the default description`);
    } catch (err) {
      toast.error(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await onDelete(deleting.id);
      toast.success('Description deleted');
      setDeleting(null);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700}>Descriptions</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={openAdd}>Add Description</Button>
      </Stack>

      {descriptions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No descriptions yet — add one per language. The public site falls back to whichever one is marked "Default" if a visitor's language isn't available.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {descriptions.map((row) => (
            <Box
              key={row.id}
              sx={{
                border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5,
                display: 'flex', alignItems: 'flex-start', gap: 1.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Chip label={row.language.toUpperCase()} size="small" color={row.is_default ? 'secondary' : 'default'} />
                  {row.is_default && <Chip label="Default" size="small" variant="outlined" />}
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {row.description}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.5}>
                <Tooltip title={row.is_default ? 'Default description' : 'Set as default'}>
                  <span>
                    <IconButton size="small" onClick={() => handleSetDefault(row)} disabled={row.is_default}>
                      {row.is_default ? <StarIcon fontSize="small" color="secondary" /> : <StarBorderIcon fontSize="small" />}
                    </IconButton>
                  </span>
                </Tooltip>
                <IconButton size="small" onClick={() => openEdit(row)}><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => setDeleting(row)}><DeleteIcon fontSize="small" /></IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      <EntityDialog
        open={dialogOpen}
        title={editing ? `Edit description (${editing.language})` : 'Add Description'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <TextField
          select
          fullWidth
          label="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={!!editing}
          helperText={editing ? 'Language cannot be changed once created — delete and re-add instead.' : 'One description per language; saving again for the same language overwrites it.'}
        >
          {LANGUAGE_OPTIONS.map((l) => (
            <MenuItem key={l.code} value={l.code}>
              {l.label}{usedLanguages.has(l.code) && l.code !== editing?.language ? ' (already exists)' : ''}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          multiline
          rows={5}
          label="Description text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mt: 2 }}
        />
      </EntityDialog>

      <ConfirmDialog
        open={!!deleting}
        title="Delete description"
        message={`Delete the "${deleting?.language}" description? ${deleting?.is_default ? 'Another description will automatically become the default.' : ''}`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </Box>
  );
}
