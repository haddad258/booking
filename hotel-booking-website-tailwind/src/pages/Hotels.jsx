import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import PropertyCard from '../components/PropertyCard';
import FilterPanel from '../components/FilterPanel';
import Drawer from '../components/ui/Drawer';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display mb-4 text-3xl font-semibold text-ink sm:text-4xl">{t('nav.hotels')}</h1>

      <div className="mb-6 flex items-center gap-3">
        <input
          placeholder="Search by name…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full max-w-xs rounded-xl border border-brand-800/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-400"
        />
        <Button variant="outline" size="md" className="shrink-0 md:hidden" onClick={() => setFiltersOpen(true)}>
          <AdjustmentsHorizontalIcon className="h-4 w-4" /> {t('listing.filters')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <aside className="hidden md:col-span-1 md:block">
          <div className="sticky top-24">
            <FilterPanel filters={filters} onChange={setFilters} amenities={amenities} showRating />
          </div>
        </aside>

        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>
          ) : hotels.length === 0 ? (
            <p className="text-ink/50">{t('listing.noResults')}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {hotels.map((h) => (
                  <PropertyCard key={h.id} property={h} type="hotel" isFavorite={isFavorite('hotel', h.id)} onToggleFavorite={(p) => toggle(p, 'hotel')} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={[
                        'h-9 w-9 rounded-lg text-sm font-semibold transition',
                        p === page ? 'bg-brand-800 text-white' : 'text-ink/60 hover:bg-brand-50',
                      ].join(' ')}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} side="right" title={t('listing.filters')}>
        <FilterPanel filters={filters} onChange={setFilters} amenities={amenities} showRating />
        <Button fullWidth className="mt-4" onClick={() => setFiltersOpen(false)}>Show {total} results</Button>
      </Drawer>
    </div>
  );
}
