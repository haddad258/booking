import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import Button from './ui/Button';

export default function SearchBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [type, setType] = useState('hotel');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('city', destination);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/${type === 'hotel' ? 'hotels' : 'chalets'}?${params.toString()}`);
  };

  return (
    <div className="glass mx-auto max-w-4xl rounded-3xl border border-white/50 p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] sm:p-5">
      <div className="mb-3 inline-flex rounded-full bg-white p-1">
        {[
          { key: 'hotel', label: t('nav.hotels') },
          { key: 'chalet', label: t('nav.chalets') },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setType(opt.key)}
            className={[
              'rounded-full px-4 py-1.5 text-sm font-semibold transition',
              type === opt.key ? 'bg-gradient-to-br from-brand-600 to-brand-800 text-white' : 'text-ink/70',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
        <input
          placeholder={t('home.searchDestination')}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="col-span-2 rounded-xl border-none bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 outline-none ring-1 ring-transparent focus:ring-gold-300 sm:col-span-2"
        />
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="rounded-xl border-none bg-white px-3 py-2.5 text-sm text-ink outline-none ring-1 ring-transparent focus:ring-gold-300 sm:col-span-1"
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="rounded-xl border-none bg-white px-3 py-2.5 text-sm text-ink outline-none ring-1 ring-transparent focus:ring-gold-300 sm:col-span-1"
        />
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="rounded-xl border-none bg-white px-3 py-2.5 text-sm text-ink outline-none ring-1 ring-transparent focus:ring-gold-300 sm:col-span-1"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} guests</option>)}
        </select>
        <Button onClick={handleSearch} className="col-span-2 sm:col-span-1">
          <MagnifyingGlassIcon className="h-4 w-4" /> {t('home.searchCta')}
        </Button>
      </div>
    </div>
  );
}
