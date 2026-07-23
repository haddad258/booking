import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Grid, Stack, Button, CircularProgress, MenuItem, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import useToast from '../hooks/useToast';
import customerService from '../services/customer.service';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await customerService.getById(id);
    setCustomer(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (e) => {
    try {
      await customerService.updateStatus(id, e.target.value);
      toast.success('Customer status updated');
      load();
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading || !customer) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/customers')} sx={{ mb: 2 }}>
        Back to customers
      </Button>

      <PageHeader title={`${customer.first_name} ${customer.last_name}`} subtitle={customer.email} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Account</Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">Phone</Typography>
                <Typography>{customer.phone || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Status</Typography>
                <TextField select size="small" value={customer.status} onChange={handleStatusChange} sx={{ minWidth: 160 }}>
                  <MenuItem value="active">active</MenuItem>
                  <MenuItem value="suspended">suspended</MenuItem>
                </TextField>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Addresses</Typography>
            {customer.addresses?.length ? (
              <Stack spacing={1}>
                {customer.addresses.map((a) => (
                  <Box key={a.id} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="body2">{a.address_line1}, {a.city}, {a.country}</Typography>
                    {a.is_default && <StatusChip status="active" />}
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">No addresses on file.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
