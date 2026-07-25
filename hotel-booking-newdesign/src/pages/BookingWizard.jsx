import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Stepper, Step, StepLabel, Box, Typography, TextField, Grid, Button, Alert, MenuItem, Divider, Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import bookingService from '../services/booking.service';
import { apiErrorMessage } from '../services/api';

const STEPS = ['booking.step1', 'booking.step2', 'booking.step3'];

export default function BookingWizard() {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const roomId = searchParams.get('roomId');
  const pricePerNight = Number(searchParams.get('price') || 0);

  const [activeStep, setActiveStep] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);

  const nights = checkIn && checkOut ? Math.max(Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000), 0) : 0;
  const total = nights * pricePerNight;

  const handleNext = () => {
    if (activeStep === 0 && (!checkIn || !checkOut)) {
      setError('Please select check-in and check-out dates');
      return;
    }
    setError('');
    setActiveStep((s) => s + 1);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        bookableType: type,
        bookableId: Number(id),
        checkIn,
        checkOut,
        guestsAdults: Number(adults),
        guestsChildren: Number(children),
        notes,
      };
      if (type === 'hotel' && roomId) payload.roomId = Number(roomId);

      const created = await bookingService.create(payload);
      setBooking(created);
      setActiveStep(2);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: '1px solid', borderColor: 'divider' }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((s) => (
            <Step key={s}><StepLabel>{t(s)}</StepLabel></Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {activeStep === 0 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('booking.checkIn')}
                  InputLabelProps={{ shrink: true }}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('booking.checkOut')}
                  InputLabelProps={{ shrink: true }}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField select fullWidth label={t('booking.adults')} value={adults} onChange={(e) => setAdults(e.target.value)}>
                  {[1, 2, 3, 4, 5, 6].map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField select fullWidth label={t('booking.children')} value={children} onChange={(e) => setChildren(e.target.value)}>
                  {[0, 1, 2, 3, 4].map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={2} label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </Grid>
            </Grid>

            {nights > 0 && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="body2">${pricePerNight} × {nights} nights</Typography>
                <Typography variant="h6" fontWeight={700}>{t('booking.total')}: ${total.toFixed(2)}</Typography>
              </Box>
            )}

            <Button fullWidth variant="contained" color="secondary" size="large" sx={{ mt: 3 }} onClick={handleNext}>
              Continue
            </Button>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Payment is arranged with our team after confirmation — no card details needed to reserve.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="body2">Check-in: {checkIn}</Typography>
              <Typography variant="body2">Check-out: {checkOut}</Typography>
              <Typography variant="body2">Guests: {adults} adults, {children} children</Typography>
              <Typography variant="h6" fontWeight={700}>{t('booking.total')}: ${total.toFixed(2)}</Typography>
            </Stack>
            <Button fullWidth variant="contained" color="secondary" size="large" onClick={handleConfirm} disabled={loading}>
              {t('booking.confirmBooking')}
            </Button>
          </Box>
        )}

        {activeStep === 2 && booking && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>{t('booking.bookingConfirmed')}</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {t('booking.bookingNumber')}: <strong className="mono">{booking.booking_number}</strong>
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => navigate('/account/bookings')}>
              {t('nav.myBookings')}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
