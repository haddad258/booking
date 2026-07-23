import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Paper, Typography, Stack, Box, Button, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import bookingService from '../services/booking.service';

const STATUS_COLOR = { pending: 'warning', confirmed: 'success', cancelled: 'error', completed: 'default' };

export default function AccountDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.myBookings({ limit: 3 }).then((res) => {
      setBookings(res.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>Recent bookings</Typography>
        <Button component={RouterLink} to="/account/bookings" size="small">View all</Button>
      </Stack>

      {loading ? (
        <CircularProgress size={24} color="secondary" />
      ) : bookings.length === 0 ? (
        <Typography color="text.secondary">You haven't made any bookings yet.</Typography>
      ) : (
        <Stack spacing={1.5}>
          {bookings.map((b) => (
            <Box key={b.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography fontWeight={700} className="mono">{b.booking_number}</Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(b.check_in), 'MMM d')} → {format(new Date(b.check_out), 'MMM d, yyyy')} · ${Number(b.total_price).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
