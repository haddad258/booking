import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Paper, Tabs, Tab, TextField, Button, Grid, CircularProgress, Switch, FormControlLabel } from '@mui/material';
import PageHeader from '../components/PageHeader';
import useToast from '../hooks/useToast';
import settingsService from '../services/settings.service';

const TABS = [
  { key: 'website', label: 'Website' },
  { key: 'smtp', label: 'SMTP' },
  { key: 'languages', label: 'Languages' },
  { key: 'currency', label: 'Currency' },
  { key: 'taxes', label: 'Taxes' },
  { key: 'seo', label: 'SEO' },
];

function GroupForm({ group, values, onSave, saving }) {
  const { register, handleSubmit, reset } = useForm({ defaultValues: values });

  useEffect(() => { reset(values); }, [values, reset]);

  const fieldsByGroup = {
    website: [
      { name: 'siteName', label: 'Site name' },
      { name: 'contactEmail', label: 'Contact email' },
      { name: 'contactPhone', label: 'Contact phone' },
      { name: 'logoUrl', label: 'Logo URL' },
    ],
    smtp: [
      { name: 'host', label: 'SMTP host' },
      { name: 'port', label: 'Port', type: 'number' },
      { name: 'user', label: 'Username' },
      { name: 'from', label: 'From address' },
    ],
    languages: [
      { name: 'default', label: 'Default language' },
    ],
    currency: [
      { name: 'default', label: 'Default currency' },
    ],
    taxes: [
      { name: 'rate', label: 'Tax rate (e.g. 0.1 for 10%)', type: 'number' },
    ],
    seo: [
      { name: 'metaTitle', label: 'Default meta title' },
      { name: 'metaDescription', label: 'Default meta description' },
      { name: 'ogImage', label: 'Default OG image URL' },
    ],
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSave)}>
      <Grid container spacing={2}>
        {(fieldsByGroup[group] || []).map((f) => (
          <Grid item xs={12} sm={6} key={f.name}>
            <TextField fullWidth label={f.label} type={f.type || 'text'} {...register(f.name)} />
          </Grid>
        ))}
      </Grid>
      <Button type="submit" variant="contained" color="secondary" sx={{ mt: 3 }} disabled={saving}>
        Save changes
      </Button>
    </Box>
  );
}

export default function Settings() {
  const toast = useToast();
  const [tab, setTab] = useState('website');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await settingsService.getAll();
    setSettings(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (group, values) => {
    setSaving(true);
    try {
      await settingsService.updateGroup(group, values);
      toast.success('Settings updated');
      load();
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Settings" subtitle="Site-wide configuration" />

      <Paper elevation={0}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable" sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 1 }}>
          {TABS.map((t) => <Tab key={t.key} value={t.key} label={t.label} />)}
        </Tabs>
        <Box sx={{ p: 3 }}>
          <GroupForm group={tab} values={settings[tab] || {}} onSave={(values) => handleSave(tab, values)} saving={saving} />
        </Box>
      </Paper>
    </Box>
  );
}
