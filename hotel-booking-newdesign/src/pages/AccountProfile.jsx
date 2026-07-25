import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Paper, Typography, TextField, Button, Grid, Stack, Box, Alert, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useAuth } from '../contexts/AuthContext';
import customerService from '../services/customer.service';
import { apiErrorMessage } from '../services/api';

export default function AccountProfile() {
  const { user, refresh } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ addressLine1: '', city: '', country: '' });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) reset({ firstName: user.first_name, lastName: user.last_name, phone: user.phone || '' });
    customerService.me().then((data) => setAddresses(data.addresses || []));
  }, [user, reset]);

  const onSubmit = async (values) => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await customerService.updateProfile(values);
      await refresh();
      setSuccess(true);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const addAddress = async () => {
    try {
      await customerService.addAddress(newAddress);
      const data = await customerService.me();
      setAddresses(data.addresses || []);
      setNewAddress({ addressLine1: '', city: '', country: '' });
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  const removeAddress = async (id) => {
    await customerService.removeAddress(id);
    const data = await customerService.me();
    setAddresses(data.addresses || []);
  };

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Profile</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>Profile updated</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField fullWidth label="First name" {...register('firstName')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Last name" {...register('lastName')} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Phone" {...register('phone')} /></Grid>
          </Grid>
          <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2 }} disabled={saving}>Save changes</Button>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Addresses</Typography>
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {addresses.map((a) => (
            <Stack key={a.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="body2">{a.address_line1}, {a.city}, {a.country}</Typography>
              <IconButton size="small" onClick={() => removeAddress(a.id)}><DeleteIcon fontSize="small" /></IconButton>
            </Stack>
          ))}
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="Address" value={newAddress.addressLine1} onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth size="small" label="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth size="small" label="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button fullWidth variant="outlined" onClick={addAddress}>Add</Button>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
}
