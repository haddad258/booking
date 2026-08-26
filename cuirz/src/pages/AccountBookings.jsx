import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import bookingService from '../services/booking.service';
import { apiErrorMessage } from '../services/api';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

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
    <div className="rounded-2xl border border-brand-800/10 bg-white p-6">
      <h2 className="font-display mb-4 text-lg font-semibold text-ink">Your bookings</h2>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <Spinner className="h-6 w-6" />
      ) : bookings.length === 0 ? (
        <p className="text-sm text-ink/50">No bookings yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((b) => (
            <div key={b.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-brand-800/10 p-4">
              <div>
                <p className="font-mono font-bold text-ink">{b.booking_number}</p>
                <p className="text-sm text-ink/60">
                  {b.bookable_type === 'hotel' ? 'Hotel' : 'Chalet'} · {format(new Date(b.check_in), 'MMM d')} → {format(new Date(b.check_out), 'MMM d, yyyy')}
                </p>
                <p className="text-sm font-bold text-ink">${Number(b.total_price).toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge status={b.status} />
                {['pending', 'confirmed'].includes(b.status) && (
                  <Button variant="danger" size="sm" onClick={() => handleCancel(b.id)}>Cancel</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
