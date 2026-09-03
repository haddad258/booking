import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdjustmentsHorizontalIcon, MapIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import PropertyCard from '../components/PropertyCard';
import PropertySkeletonCard from '../components/PropertySkeletonCard';
import FilterPanel from '../components/FilterPanel';
import PropertiesMapView from '../components/PropertiesMapView';
import Drawer from '../components/ui/Drawer';
import Button from '../components/ui/Button';
import useFavorites from '../hooks/useFavorites';
import hotelService from '../services/hotel.service';
import siteService from '../services/site.service';

export default function Hotels() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { isFavorite, toggle } = useFavorites();
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [total, setTotal] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'map'
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => { siteService.listAmenities('hotel').then(setAmenities); }, []);

  useEffect(() => {
    setLoading(true);
    hotelService
      .list({
        page, limit: 12,
        city: searchParams.get('city') || undefined,
        search: search || undefined,
        minPrice: filters.minPrice, maxPrice: filters.maxPrice, rating: filters.rating,
      })
      .then((res) => { setHotels(res.data || []); setTotal(res.meta?.total || 0); })
      .finally(() => setLoading(false));
  }, [page, search, filters, searchParams]);

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">{t('nav.hotels')}</h1>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search by name…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-40 rounded-full border border-brand-500/15 dark:border-white/15 px-4 py-2 text-sm outline-none focus:border-brand-400 sm:w-56"
          />
          <Button variant="outline" size="md" onClick={() => setFiltersOpen(true)}>
            <AdjustmentsHorizontalIcon className="h-4 w-4" /> {t('listing.filters')}
          </Button>
          <div className="flex rounded-full border border-brand-500/15 dark:border-white/15 p-1 lg:hidden">
            <button
              onClick={() => setMobileView('list')}
              className={`rounded-full p-1.5 ${mobileView === 'list' ? 'brand-gradient text-white' : 'text-ink/50 dark:text-white/50'}`}
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={`rounded-full p-1.5 ${mobileView === 'map' ? 'brand-gradient text-white' : 'text-ink/50 dark:text-white/50'}`}
            >
              <MapIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr] lg:h-[calc(100vh-180px)]">
        {/* List column */}
        <div className={`${mobileView === 'map' ? 'hidden' : 'block'} overflow-y-auto pr-1 lg:block`}>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => <PropertySkeletonCard key={i} />)}
            </div>
          ) : hotels.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-brand-500/25 dark:border-white/20 py-16 text-center">
              <p className="mb-3 text-ink/50 dark:text-white/50">{t('listing.noResults')}</p>
              {(search || filters.minPrice || filters.maxPrice || filters.rating) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setSearch(''); setFilters({}); setPage(1); }}
                >
                  Clear search &amp; filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {hotels.map((h) => (
                  <div
                    key={h.id}
                    onMouseEnter={() => setHoveredId(h.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`rounded-3xl transition ${hoveredId === h.id ? 'ring-2 ring-gold-400' : ''}`}
                  >
                    <PropertyCard property={h} type="hotel" isFavorite={isFavorite('hotel', h.id)} onToggleFavorite={(p) => toggle(p, 'hotel')} />
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-9 w-9 rounded-full text-sm font-semibold transition ${p === page ? 'brand-gradient text-white' : 'text-ink/60 dark:text-white/60 hover:bg-brand-500/8 dark:hover:bg-white/10'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Map column */}
        <div className={`${mobileView === 'list' ? 'hidden' : 'block'} h-[420px] lg:sticky lg:top-24 lg:block lg:h-full`}>
          <PropertiesMapView properties={loading ? [] : hotels} type="hotel" activeId={hoveredId} onHover={setHoveredId} />
        </div>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} side="right" title={t('listing.filters')}>
        <FilterPanel filters={filters} onChange={setFilters} amenities={amenities} showRating />
        <Button fullWidth className="mt-4" onClick={() => setFiltersOpen(false)}>Show {total} results</Button>
      </Drawer>
    </div>
  );
}
