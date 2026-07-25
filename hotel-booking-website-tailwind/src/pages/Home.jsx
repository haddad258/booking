import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import Rating from '../components/ui/Rating';
import useFavorites from '../hooks/useFavorites';
import hotelService from '../services/hotel.service';
import chaletService from '../services/chalet.service';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80&auto=format&fit=crop';

const DESTINATIONS = [
  { name: 'Nice', country: 'France', image: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=500&q=80&auto=format&fit=crop' },
  { name: 'Chamonix', country: 'France', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80&auto=format&fit=crop' },
  { name: 'Marrakech', country: 'Morocco', image: 'https://images.unsplash.com/photo-1553603227-2358aabe821e?w=500&q=80&auto=format&fit=crop' },
  { name: 'Zermatt', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&q=80&auto=format&fit=crop' },
];

const TESTIMONIALS = [
  { name: 'Amelia R.', quote: 'The chalet booking was seamless and the mountain views were unreal.', rating: 5 },
  { name: 'Karim B.', quote: 'Customer support helped us change dates in minutes. Would book again.', rating: 5 },
  { name: 'Sofia M.', quote: 'Loved the curated hotel picks — every stay felt handpicked for us.', rating: 4.5 },
];

export default function Home() {
  const { t } = useTranslation();
  const { isFavorite, toggle } = useFavorites();
  const [hotels, setHotels] = useState([]);
  const [chalets, setChalets] = useState([]);

  useEffect(() => {
    hotelService.list({ limit: 4 }).then((res) => setHotels(res.data || []));
    chaletService.list({ limit: 4 }).then((res) => setChalets(res.data || []));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative flex min-h-[560px] items-center bg-cover bg-center sm:min-h-[640px]"
        style={{ backgroundImage: `linear-gradient(160deg, rgba(28,38,32,0.6), rgba(73,117,96,0.45)), url(${HERO_IMAGE})` }}
      >
        <div className="mx-auto w-full max-w-5xl px-4 text-center text-white sm:px-6">
          <h1 className="font-display animate-fade-in-up mb-4 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            {t('home.heroTitle')}
          </h1>
          <p className="animate-fade-in-up mb-8 text-base font-medium text-white/90 sm:text-lg" style={{ animationDelay: '80ms' }}>
            {t('home.heroSubtitle')}
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured hotels */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="font-display mb-6 text-2xl font-semibold text-ink sm:text-3xl">{t('home.featuredHotels')}</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((h) => (
            <PropertyCard key={h.id} property={h} type="hotel" isFavorite={isFavorite('hotel', h.id)} onToggleFavorite={(p) => toggle(p, 'hotel')} />
          ))}
        </div>
      </section>

      {/* Popular destinations */}
      <section className="bg-brand-50 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display mb-6 text-2xl font-semibold text-ink sm:text-3xl">{t('home.popularDestinations')}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {DESTINATIONS.map((d) => (
              <div
                key={d.name}
                className="hover-lift relative flex h-48 cursor-pointer items-end overflow-hidden rounded-2xl bg-cover bg-center p-4 text-white"
                style={{ backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.65)), url(${d.image})` }}
              >
                <div>
                  <p className="font-bold">{d.name}</p>
                  <p className="text-xs opacity-80">{d.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured chalets */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="font-display mb-6 text-2xl font-semibold text-ink sm:text-3xl">{t('home.featuredChalets')}</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {chalets.map((c) => (
            <PropertyCard key={c.id} property={c} type="chalet" isFavorite={isFavorite('chalet', c.id)} onToggleFavorite={(p) => toggle(p, 'chalet')} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-900 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display mb-8 text-center text-2xl font-semibold sm:text-3xl">{t('home.testimonials')}</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((tst) => (
              <div key={tst.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <Rating value={tst.rating} className="mb-3" />
                <p className="mb-4 text-white/85">&ldquo;{tst.quote}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-500 text-xs font-bold text-brand-900">
                    {tst.name[0]}
                  </span>
                  <span className="text-sm font-semibold">{tst.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
