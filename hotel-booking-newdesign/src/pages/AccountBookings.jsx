import { useEffect, useState } from 'react';
import { Paper, Typography, Stack, Box, Button, Chip, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import bookingService from '../services/booking.service';
import { apiErrorMessage } from '../services/api';

const STATUS_COLOR = { pending: 'warning', confirmed: 'success', cancelled: 'error', completed: 'default' };

export default function AccountBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await bookingService.myBookings({ limit: 50 });
    setBookings(res.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    setError('');
    try {
      await bookingService.cancel(id);
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Your bookings</Typography>
      {error && <Typography color="error" variant="body2" sx={{ mb: 2 }}>{error}</Typography>}

      {loading ? (
        <CircularProgress size={24} color="secondary" />
      ) : bookings.length === 0 ? (
        <Typography color="text.secondary">No bookings yet.</Typography>
      ) : (
        <Stack spacing={1.5}>
          {bookings.map((b) => (
            <Box key={b.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                <Box>
                  <Typography fontWeight={700} className="mono">{b.booking_number}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {b.bookable_type === 'hotel' ? 'Hotel' : 'Chalet'} · {format(new Date(b.check_in), 'MMM d')} → {format(new Date(b.check_out), 'MMM d, yyyy')}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>${Number(b.total_price).toFixed(2)}</Typography>
                </Box>
                <Stack alignItems="flex-end" spacing={1}>
                  <Chip label={b.status} color={STATUS_COLOR[b.status] || 'default'} size="small" />
                  {['pending', 'confirmed'].includes(b.status) && (
                    <Button size="small" color="error" onClick={() => handleCancel(b.id)}>Cancel</Button>
                  )}
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
