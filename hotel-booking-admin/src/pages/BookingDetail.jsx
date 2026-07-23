import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Grid, Stack, Button, CircularProgress, Divider, TextField, MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded';
import { format } from 'date-fns';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import EntityDialog from '../components/EntityDialog';
import useToast from '../hooks/useToast';
import bookingService from '../services/booking.service';
import { useForm } from 'react-hook-form';

const NEXT_STATUS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  cancelled: [],
  completed: [],
};

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    const data = await bookingService.getById(id);
    setBooking(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      await bookingService.updateStatus(id, status);
      toast.success(`Booking marked as ${status}`);
      load();
    } catch (err) {
      toast.error(err);
    }
  };

  const openPayDialog = () => {
    reset({ amount: booking.total_price, method: 'card', status: 'paid', transactionRef: '' });
    setPayDialogOpen(true);
  };

  const onSubmitPayment = async (values) => {
    setSaving(true);
    try {
      await bookingService.recordPayment(id, { ...values, amount: Number(values.amount) });
      toast.success('Payment recorded');
      setPayDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRefund = async (paymentId) => {
    try {
      await bookingService.refundPayment(paymentId);
      toast.success('Payment refunded');
      load();
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading || !booking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const availableTransitions = NEXT_STATUS[booking.status] || [];

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/bookings')} sx={{ mb: 2 }}>
        Back to bookings
      </Button>

      <PageHeader
        title={<span className="mono">{booking.booking_number}</span>}
        subtitle={`${booking.bookable_type === 'hotel' ? 'Hotel' : 'Chalet'} reservation`}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 2.5, mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>Reservation details</Typography>
              <StatusChip status={booking.status} />
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Check-in</Typography>
                <Typography fontWeight={600}>{format(new Date(booking.check_in), 'PPP')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Check-out</Typography>
                <Typography fontWeight={600}>{format(new Date(booking.check_out), 'PPP')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Guests</Typography>
                <Typography fontWeight={600}>{booking.guests_adults} adults, {booking.guests_children} children</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Total price</Typography>
                <Typography fontWeight={700} className="mono">${Number(booking.total_price).toFixed(2)} {booking.currency}</Typography>
              </Grid>
              {booking.notes && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Notes</Typography>
                  <Typography>{booking.notes}</Typography>
                </Grid>
              )}
            </Grid>

            {availableTransitions.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1}>
                  {availableTransitions.map((status) => (
                    <Button key={status} variant="outlined" size="small" onClick={() => handleStatusChange(status)}>
                      Mark as {status}
                    </Button>
                  ))}
                </Stack>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={700}>Payments</Typography>
              <Button size="small" onClick={openPayDialog}>Record payment</Button>
            </Stack>
            <Stack spacing={1}>
              {booking.payments?.length ? (
                booking.payments.map((p) => (
                  <Box key={p.id} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight={600} className="mono">${Number(p.amount).toFixed(2)}</Typography>
                      <StatusChip status={p.status} />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {p.method} · {p.transaction_ref || 'no ref'}
                    </Typography>
                    {p.status === 'paid' && (
                      <Box sx={{ mt: 1 }}>
                        <Button size="small" color="error" onClick={() => handleRefund(p.id)}>Refund</Button>
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No payments recorded yet.</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <EntityDialog
        open={payDialogOpen}
        title="Record payment"
        onClose={() => setPayDialogOpen(false)}
        onSubmit={handleSubmit(onSubmitPayment)}
        loading={saving}
      >
        <TextField fullWidth type="number" label="Amount" {...register('amount', { required: true })} />
        <TextField select fullWidth label="Method" defaultValue="card" {...register('method')}>
          {['card', 'paypal', 'cash', 'bank_transfer'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </TextField>
        <TextField select fullWidth label="Status" defaultValue="paid" {...register('status')}>
          {['pending', 'paid', 'failed'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField fullWidth label="Transaction reference" {...register('transactionRef')} />
      </EntityDialog>
    </Box>
  );
}
