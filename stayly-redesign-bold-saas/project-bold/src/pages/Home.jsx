import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import Rating from '../components/ui/Rating';
import useFavorites from '../hooks/useFavorites';
import hotelService from '../services/hotel.service';
import chaletService from '../services/chalet.service';

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
      <section className="relative overflow-hidden bg-brand-950 pb-28 pt-20 text-white sm:pb-40 sm:pt-28">
        <div className="orb animate-drift -left-32 top-0 h-[420px] w-[420px] bg-brand-500" />
        <div className="orb animate-drift right-0 top-20 h-[380px] w-[380px] bg-gold-400" style={{ animationDelay: '4s' }} />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="eyebrow animate-fade-in-up mb-5 justify-center text-gold-300">{t('app.name')}</p>
          <h1 className="font-display animate-fade-in-up mb-5 text-4xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl">
            <span className="text-gradient">{t('home.heroTitle')}</span>
          </h1>
          <p className="animate-fade-in-up mx-auto mb-10 max-w-xl text-base font-normal text-white/70 sm:text-lg" style={{ animationDelay: '80ms' }}>
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
            <h2 className="font-display text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">{t('home.featuredHotels')}</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((h) => (
            <PropertyCard key={h.id} property={h} type="hotel" isFavorite={isFavorite('hotel', h.id)} onToggleFavorite={(p) => toggle(p, 'hotel')} />
          ))}
        </div>
      </section>

      {/* Popular destinations */}
      <section className="bg-brand-500/5 dark:bg-white/5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="eyebrow mb-3 text-gold-600 dark:text-gold-400">{t('home.kickerDestinations')}</p>
          <h2 className="font-display mb-8 text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">{t('home.popularDestinations')}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {DESTINATIONS.map((d, i) => (
              <div
                key={d.name}
                className={`hover-lift relative flex ${i % 2 === 1 ? 'h-40 md:mt-8' : 'h-40'} cursor-pointer items-end overflow-hidden rounded-3xl bg-cover bg-center p-4 text-white sm:h-56`}
                style={{ backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(13,10,32,0.85)), url(${d.image})` }}
              >
                <div>
                  <p className="font-display text-lg font-bold">{d.name}</p>
                  <p className="text-xs uppercase tracking-wide text-gold-200 opacity-90">{d.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured chalets */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow mb-3 text-gold-600 dark:text-gold-400">{t('home.kickerRetreats')}</p>
        <h2 className="font-display mb-8 text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">{t('home.featuredChalets')}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {chalets.map((c) => (
            <PropertyCard key={c.id} property={c} type="chalet" isFavorite={isFavorite('chalet', c.id)} onToggleFavorite={(p) => toggle(p, 'chalet')} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden bg-brand-950 py-16 text-white sm:py-24">
        <div className="orb -bottom-20 left-1/3 h-96 w-96 bg-brand-500" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="eyebrow mb-3 justify-center text-center text-gold-300">{t('home.kickerReviews')}</p>
          <h2 className="font-display mb-12 text-center text-3xl font-extrabold sm:text-4xl">{t('home.testimonials')}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((tst) => (
              <div key={tst.name} className="glass glow-ring rounded-3xl p-7">
                <Rating value={tst.rating} className="mb-4" />
                <p className="font-display mb-6 text-lg font-medium leading-snug text-white/90">&ldquo;{tst.quote}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <span className="brand-gradient flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white">
                    {tst.name[0]}
                  </span>
                  <span className="text-sm font-medium">{tst.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!featuredLoading && hasFeatured && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="font-display mb-2 text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">{t('home.mostRequested')}</h2>
          <p className="mb-10 text-ink/55 dark:text-white/55">{t('home.mostRequestedSubtitle')}</p>

          {featuredHotels.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-ink/50 dark:text-white/50">
                {t('nav.hotels')}
                <span className="h-px flex-1 bg-brand-500/10 dark:bg-white/10" />
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
              <h3 className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-ink/50 dark:text-white/50">
                {t('nav.chalets')}
                <span className="h-px flex-1 bg-brand-500/10 dark:bg-white/10" />
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
