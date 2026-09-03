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
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [featuredChalets, setFeaturedChalets] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    hotelService.list({ limit: 4 }).then((res) => setHotels(res.data || []));
    chaletService.list({ limit: 4 }).then((res) => setChalets(res.data || []));
    // "Les plus demandés" — properties an admin has explicitly marked as
    // important/featured, never a hardcoded list.
    Promise.all([
      hotelService.list({ important: true, limit: 8 }),
      chaletService.list({ important: true, limit: 8 }),
    ])
      .then(([hotelsRes, chaletsRes]) => {
        setFeaturedHotels(hotelsRes.data || []);
        setFeaturedChalets(chaletsRes.data || []);
      })
      .finally(() => setFeaturedLoading(false));
  }, []);

  const hasFeatured = featuredHotels.length > 0 || featuredChalets.length > 0;

  return (
    <div>
      {/* Hero */}
      <section
        className="grain relative flex min-h-[600px] items-center overflow-hidden bg-cover bg-center sm:min-h-[680px]"
        style={{ backgroundImage: `linear-gradient(170deg, rgba(10,19,11,0.72), rgba(10,19,11,0.4) 55%, rgba(173,97,44,0.28)), url(${HERO_IMAGE})` }}
      >
        <div className="relative mx-auto w-full max-w-5xl px-4 text-center text-white sm:px-6">
          <p className="eyebrow animate-fade-in-up mb-4 justify-center text-gold-200">
            {t('app.name')}
          </p>
          <h1 className="font-display animate-fade-in-up mb-5 text-4xl font-medium leading-[1.08] sm:text-6xl md:text-7xl">
            {t('home.heroTitle')}
          </h1>
          <p className="animate-fade-in-up mx-auto mb-10 max-w-xl text-base font-normal text-white/85 sm:text-lg" style={{ animationDelay: '80ms' }}>
            {t('home.heroSubtitle')}
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured hotels */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3 text-gold-600 dark:text-gold-400">{t('home.kickerStays')}</p>
            <h2 className="font-display text-3xl font-medium text-ink dark:text-white sm:text-4xl">{t('home.featuredHotels')}</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((h) => (
            <PropertyCard key={h.id} property={h} type="hotel" isFavorite={isFavorite('hotel', h.id)} onToggleFavorite={(p) => toggle(p, 'hotel')} />
          ))}
        </div>
      </section>

      {/* Popular destinations */}
      <section className="bg-brand-50 dark:bg-white/5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="eyebrow mb-3 text-gold-600 dark:text-gold-400">{t('home.kickerDestinations')}</p>
          <h2 className="font-display mb-8 text-3xl font-medium text-ink dark:text-white sm:text-4xl">{t('home.popularDestinations')}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {DESTINATIONS.map((d, i) => (
              <div
                key={d.name}
                className={`hover-lift relative flex ${i % 2 === 1 ? 'h-40 md:mt-8' : 'h-40'} cursor-pointer items-end overflow-hidden rounded-[20px] bg-cover bg-center p-4 text-white sm:h-56`}
                style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(10,19,11,0.75)), url(${d.image})` }}
              >
                <div>
                  <p className="font-display text-lg font-medium">{d.name}</p>
                  <p className="text-xs uppercase tracking-wide opacity-75">{d.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured chalets */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow mb-3 text-gold-600 dark:text-gold-400">{t('home.kickerRetreats')}</p>
        <h2 className="font-display mb-8 text-3xl font-medium text-ink dark:text-white sm:text-4xl">{t('home.featuredChalets')}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {chalets.map((c) => (
            <PropertyCard key={c.id} property={c} type="chalet" isFavorite={isFavorite('chalet', c.id)} onToggleFavorite={(p) => toggle(p, 'chalet')} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="grain relative overflow-hidden bg-brand-900 py-16 text-white sm:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="eyebrow mb-3 justify-center text-gold-300 text-center">{t('home.kickerReviews')}</p>
          <h2 className="font-display mb-12 text-center text-3xl font-medium sm:text-4xl">{t('home.testimonials')}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((tst) => (
              <div key={tst.name} className="rounded-[20px] border border-white/12 bg-white/[0.04] p-7">
                <Rating value={tst.rating} className="mb-4" />
                <p className="font-display mb-6 text-lg italic leading-snug text-white/90">&ldquo;{tst.quote}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-400 text-xs font-bold text-brand-950">
                    {tst.name[0]}
                  </span>
                  <span className="text-sm font-medium">{tst.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Les plus demandés — only rendered once we know whether there's
          anything to show, and not rendered at all if there isn't. */}
      {!featuredLoading && hasFeatured && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="font-display mb-2 text-3xl font-medium text-ink dark:text-white sm:text-4xl">{t('home.mostRequested')}</h2>
          <p className="mb-10 text-ink/55 dark:text-white/55">{t('home.mostRequestedSubtitle')}</p>

          {featuredHotels.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-5 flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-ink/50 dark:text-white/50">
                {t('nav.hotels')}
                <span className="h-px flex-1 bg-ink/10 dark:bg-white/10" />
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredHotels.map((h) => (
                  <PropertyCard key={h.id} property={h} type="hotel" isFavorite={isFavorite('hotel', h.id)} onToggleFavorite={(p) => toggle(p, 'hotel')} />
                ))}
              </div>
            </div>
          )}

          {featuredChalets.length > 0 && (
            <div>
              <h3 className="mb-5 flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-ink/50 dark:text-white/50">
                {t('nav.chalets')}
                <span className="h-px flex-1 bg-ink/10 dark:bg-white/10" />
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredChalets.map((c) => (
                  <PropertyCard key={c.id} property={c} type="chalet" isFavorite={isFavorite('chalet', c.id)} onToggleFavorite={(p) => toggle(p, 'chalet')} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
