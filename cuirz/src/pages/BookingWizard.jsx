import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
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
    if (!checkIn || !checkOut) { setError('Please select check-in and check-out dates'); return; }
    setError('');
    setActiveStep(1);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        bookableType: type, bookableId: Number(id), checkIn, checkOut,
        guestsAdults: Number(adults), guestsChildren: Number(children), notes,
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
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-16">
      <div className="rounded-2xl border border-brand-800/10 bg-white p-6 sm:p-8">
        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <div className={[
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                i <= activeStep ? 'bg-brand-800 text-white' : 'bg-hover text-ink/40',
              ].join(' ')}>
                {i + 1}
              </div>
              <span className={`ml-2 hidden text-xs font-semibold sm:block ${i <= activeStep ? 'text-ink' : 'text-ink/40'}`}>{t(s)}</span>
              {i < STEPS.length - 1 && <div className={`mx-2 h-0.5 flex-1 ${i < activeStep ? 'bg-brand-800' : 'bg-hover'}`} />}
            </div>
          ))}
        </div>

        {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {activeStep === 0 && (
          <div>
            <div className="grid grid-cols-2 gap-3">
              <Input type="date" label={t('booking.checkIn')} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
              <Input type="date" label={t('booking.checkOut')} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              <Select label={t('booking.adults')} value={adults} onChange={(e) => setAdults(e.target.value)}>
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
              <Select label={t('booking.children')} value={children} onChange={(e) => setChildren(e.target.value)}>
                {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
              <div className="col-span-2">
                <Input label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>

            {nights > 0 && (
              <div className="mt-4 rounded-xl bg-hover p-4">
                <p className="text-sm text-ink/70">${pricePerNight} × {nights} nights</p>
                <p className="font-display text-xl font-bold text-ink">{t('booking.total')}: ${total.toFixed(2)}</p>
              </div>
            )}

            <Button fullWidth size="lg" className="mt-5" onClick={handleNext}>Continue</Button>
          </div>
        )}

        {activeStep === 1 && (
          <div>
            <p className="mb-4 text-sm text-ink/60">
              Payment is arranged with our team after confirmation — no card details needed to reserve.
            </p>
            <div className="mb-4 border-t border-brand-800/10 pt-4 text-sm text-ink/80 space-y-1.5">
              <p>Check-in: {checkIn}</p>
              <p>Check-out: {checkOut}</p>
              <p>Guests: {adults} adults, {children} children</p>
              <p className="font-display pt-1 text-lg font-bold text-ink">{t('booking.total')}: ${total.toFixed(2)}</p>
            </div>
            <Button fullWidth size="lg" onClick={handleConfirm} disabled={loading}>{t('booking.confirmBooking')}</Button>
          </div>
        )}

        {activeStep === 2 && booking && (
          <div className="py-4 text-center">
            <CheckCircleIcon className="mx-auto mb-3 h-14 w-14 text-emerald-500" />
            <h2 className="font-display mb-1 text-2xl font-semibold text-ink">{t('booking.bookingConfirmed')}</h2>
            <p className="mb-6 text-sm text-ink/60">
              {t('booking.bookingNumber')}: <strong className="font-mono">{booking.booking_number}</strong>
            </p>
            <Button onClick={() => navigate('/account/bookings')}>{t('nav.myBookings')}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
