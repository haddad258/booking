import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import bookingService from '../services/booking.service';
import Spinner from '../components/ui/Spinner';

export default function AccountDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.myBookings({ limit: 3 }).then((res) => { setBookings(res.data || []); setLoading(false); });
  }, []);

  return (
    <div className="rounded-[20px] border border-ink/10 dark:border-white/10 bg-white dark:bg-brand-800 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="eyebrow text-ink dark:text-white">Recent bookings</h2>
        <RouterLink to="/account/bookings" className="text-sm font-semibold text-brand-700 dark:text-gold-300 hover:underline">View all</RouterLink>
      </div>

      {loading ? (
        <Spinner className="h-6 w-6" />
      ) : bookings.length === 0 ? (
        <p className="text-sm text-ink/50 dark:text-white/50">You haven't made any bookings yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-2xl border border-ink/10 dark:border-white/10 p-4">
              <p className="font-mono font-bold text-ink dark:text-white">{b.booking_number}</p>
              <p className="text-sm text-ink/60 dark:text-white/60">
                {format(new Date(b.check_in), 'MMM d')} → {format(new Date(b.check_out), 'MMM d, yyyy')} · ${Number(b.total_price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
