import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, IconButton, Stack, Badge, Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightIcon from '@mui/icons-material/ChevronRightRounded';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, addMonths, subMonths,
} from 'date-fns';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import bookingService from '../services/booking.service';

export default function Calendar() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await bookingService.list({ limit: 100 });
      setBookings(res.data || []);
    })();
  }, [month]);

  const bookingsByDay = useMemo(() => {
    const map = {};
    for (const b of bookings) {
      const key = format(new Date(b.check_in), 'yyyy-MM-dd');
      (map[key] = map[key] || []).push(b);
    }
    return map;
  }, [bookings]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    const arr = [];
    let cur = start;
    while (cur <= end) {
      arr.push(cur);
      cur = addDays(cur, 1);
    }
    return arr;
  }, [month]);

  const selectedBookings = selectedDay ? bookingsByDay[format(selectedDay, 'yyyy-MM-dd')] || [] : [];

  return (
    <Box>
      <PageHeader title="Reservation calendar" subtitle="Check-ins by day across all properties" />

      <Paper elevation={0} sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <IconButton onClick={() => setMonth((m) => subMonths(m, 1))}><ChevronLeftIcon /></IconButton>
          <Typography variant="h6" fontWeight={700}>{format(month, 'MMMM yyyy')}</Typography>
          <IconButton onClick={() => setMonth((m) => addMonths(m, 1))}><ChevronRightIcon /></IconButton>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <Typography key={d} variant="caption" fontWeight={700} align="center" color="text.secondary">{d}</Typography>
          ))}
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const dayBookings = bookingsByDay[key] || [];
            const inMonth = isSameMonth(day, month);
            return (
              <Box
                key={key}
                onClick={() => dayBookings.length && setSelectedDay(day)}
                sx={{
                  minHeight: 72,
                  p: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: isSameDay(day, new Date()) ? 'secondary.main' : 'divider',
                  opacity: inMonth ? 1 : 0.35,
                  cursor: dayBookings.length ? 'pointer' : 'default',
                  '&:hover': dayBookings.length ? { bgcolor: 'action.hover' } : {},
                }}
              >
                <Typography variant="caption" fontWeight={600}>{format(day, 'd')}</Typography>
                {dayBookings.length > 0 && (
                  <Badge badgeContent={dayBookings.length} color="secondary" sx={{ mt: 1, ml: 1 }} />
                )}
              </Box>
            );
          })}
        </Box>
      </Paper>

      <Drawer anchor="right" open={!!selectedDay} onClose={() => setSelectedDay(null)}>
        <Box sx={{ width: 340, p: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            {selectedDay && format(selectedDay, 'PPP')}
          </Typography>
          <List disablePadding>
            {selectedBookings.map((b) => (
              <ListItemButton key={b.id} onClick={() => navigate(`/bookings/${b.id}`)} sx={{ borderRadius: 1, mb: 1, border: '1px solid', borderColor: 'divider' }}>
                <ListItemText
                  primary={<span className="mono">{b.booking_number}</span>}
                  secondary={`${b.bookable_type} · $${Number(b.total_price).toFixed(2)}`}
                />
                <StatusChip status={b.status} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
