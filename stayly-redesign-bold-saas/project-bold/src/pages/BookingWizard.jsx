import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import bookingService from '../services/booking.service';
import { apiErrorMessage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

/**
 * Booking no longer requires being logged in (see the guest-checkout
 * requirement). Logged-in users skip straight to review/confirm using the
 * existing authenticated endpoint; guests get an extra step to collect
 * contact info, with an optional "create an account" checkbox — either
 * way, a Customer record is created server-side (see
 * booking.service#createGuestBooking on the backend).
 */
export default function BookingWizard() {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, refresh } = useAuth();

  const roomId = searchParams.get('roomId');
  const pricePerNight = Number(searchParams.get('price') || 0);

  const STEPS = user
    ? ['booking.step1', 'booking.step2', 'booking.step3']
    : ['booking.step1', 'booking.contactStep', 'booking.step2', 'booking.step3'];

  const [activeStep, setActiveStep] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [createdUsername, setCreatedUsername] = useState(null);

  // Guest contact fields — only used when there's no logged-in user.
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');

  const nights = checkIn && checkOut ? Math.max(Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000), 0) : 0;
  const total = nights * pricePerNight;

  const handleDatesNext = () => {
    if (!checkIn || !checkOut) { setError('Please select check-in and check-out dates'); return; }
    setError('');
    setActiveStep(1);
  };

  const handleContactNext = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please fill in your name and email to continue');
      return;
    }
    if (createAccount && (!password || password.length < 8)) {
      setError('Choose a password of at least 8 characters to create an account');
      return;
    }
    setError('');
    setActiveStep(2);
  };

  const reviewStepIndex = user ? 1 : 2;
  const confirmationStepIndex = user ? 2 : 3;

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const bookingPayload = {
        bookableType: type, bookableId: Number(id), checkIn, checkOut,
        guestsAdults: Number(adults), guestsChildren: Number(children), notes,
      };
      if (type === 'hotel' && roomId) bookingPayload.roomId = Number(roomId);

      if (user) {
        const created = await bookingService.create(bookingPayload);
        setBooking(created);
      } else {
        const result = await bookingService.createGuest({
          ...bookingPayload,
          firstName,
          lastName,
          email,
          phone,
          createAccount,
          password: createAccount ? password : undefined,
        });
        setBooking(result.booking);
        if (result.tokens) {
          setCreatedUsername(result.customer.username);
          await refresh(); // pick up the newly-logged-in user across the app (header, etc.)
        }
      }
      setActiveStep(confirmationStepIndex);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-16">
      <div className="rounded-[28px] border border-brand-500/10 dark:border-white/10 bg-white dark:bg-brand-900 p-6 sm:p-8">
        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <div className={[
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                i <= activeStep ? 'brand-gradient text-white' : 'bg-brand-500/8 dark:bg-white/5 text-ink/40 dark:text-white/40',
              ].join(' ')}>
                {i + 1}
              </div>
              <span className={`ml-2 hidden text-xs font-semibold sm:block ${i <= activeStep ? 'text-ink dark:text-white' : 'text-ink/40 dark:text-white/40'}`}>{t(s)}</span>
              {i < STEPS.length - 1 && <div className={`mx-2 h-0.5 flex-1 ${i < activeStep ? 'brand-gradient' : 'bg-brand-500/10 dark:bg-white/5'}`} />}
            </div>
          ))}
        </div>

        {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {/* Step: dates & guests */}
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
              <div className="mt-4 rounded-2xl bg-brand-500/5 dark:bg-white/5 p-4">
                <p className="text-sm text-ink/70 dark:text-white/70">${pricePerNight} × {nights} nights</p>
                <p className="font-display text-xl font-extrabold text-ink dark:text-white">{t('booking.total')}: ${total.toFixed(2)}</p>
              </div>
            )}

            <Button fullWidth size="lg" className="mt-5" onClick={handleDatesNext}>Continue</Button>
          </div>
        )}

        {/* Step: guest contact info + optional account creation (skipped entirely if already logged in) */}
        {!user && activeStep === 1 && (
          <div>
            <div className="grid grid-cols-2 gap-3">
              <Input label={t('auth.firstName')} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input label={t('auth.lastName')} value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <div className="col-span-2">
                <Input type="email" label={t('auth.email')} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="col-span-2">
                <Input label={t('auth.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <label className="mt-4 flex items-start gap-2.5 rounded-2xl border border-brand-500/10 p-3.5 dark:border-white/10">
              <input
                type="checkbox"
                checked={createAccount}
                onChange={(e) => setCreateAccount(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-brand-500/30 text-brand-600 focus:ring-brand-300"
              />
              <span>
                <span className="block text-sm font-semibold text-ink dark:text-white">{t('auth.createAccount')}</span>
                <span className="block text-xs text-ink/55 dark:text-white/55">{t('auth.createAccountHint')}</span>
              </span>
            </label>

            {createAccount && (
              <div className="mt-3">
                <Input type="password" label={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            )}

            <Button fullWidth size="lg" className="mt-5" onClick={handleContactNext}>Continue</Button>
          </div>
        )}

        {/* Step: review & confirm */}
        {activeStep === reviewStepIndex && (
          <div>
            <p className="mb-4 text-sm text-ink/60 dark:text-white/60">
              Payment is arranged with our team after confirmation — no card details needed to reserve.
            </p>
            <div className="mb-4 border-t border-brand-500/10 dark:border-white/10 pt-4 text-sm text-ink/80 dark:text-white/80 space-y-1.5">
              {!user && <p>{firstName} {lastName} · {email}</p>}
              <p>Check-in: {checkIn}</p>
              <p>Check-out: {checkOut}</p>
              <p>Guests: {adults} adults, {children} children</p>
              <p className="font-display pt-1 text-lg font-extrabold text-gradient">{t('booking.total')}: ${total.toFixed(2)}</p>
            </div>
            <Button fullWidth size="lg" onClick={handleConfirm} disabled={loading}>{t('booking.confirmBooking')}</Button>
          </div>
        )}

        {/* Step: confirmation */}
        {activeStep === confirmationStepIndex && booking && (
          <div className="py-4 text-center">
            <CheckCircleIcon className="mx-auto mb-3 h-14 w-14 text-emerald-500" />
            <h2 className="font-display mb-1 text-2xl font-semibold text-ink dark:text-white">{t('booking.bookingConfirmed')}</h2>
            <p className="mb-4 text-sm text-ink/60 dark:text-white/60">
              {t('booking.bookingNumber')}: <strong className="font-mono">{booking.booking_number}</strong>
            </p>

            {createdUsername && (
              <div className="mx-auto mb-6 max-w-xs rounded-2xl bg-gold-50 dark:bg-gold-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-700 dark:text-gold-300">{t('auth.generatedUsername')}</p>
                <p className="font-mono text-lg font-bold text-ink dark:text-white">{createdUsername}</p>
                <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{t('auth.generatedUsernameHint')}</p>
              </div>
            )}
            {!user && !createdUsername && (
              <p className="mx-auto mb-6 max-w-xs text-xs text-ink/55 dark:text-white/55">{t('auth.continueAsGuest')}</p>
            )}

            <Button onClick={() => navigate(user || createdUsername ? '/account/bookings' : '/')}>
              {user || createdUsername ? t('nav.myBookings') : t('nav.hotels')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
