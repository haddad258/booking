import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdjustmentsHorizontalIcon, MapIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import PropertyCard from '../components/PropertyCard';
import PropertySkeletonCard from '../components/PropertySkeletonCard';
import FilterPanel from '../components/FilterPanel';
import MapView from '../components/MapView';
import Drawer from '../components/ui/Drawer';
import Button from '../components/ui/Button';
import useFavorites from '../hooks/useFavorites';
import chaletService from '../services/chalet.service';
import siteService from '../services/site.service';

export default function Chalets() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { isFavorite, toggle } = useFavorites();
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [chalets, setChalets] = useState([]);
  const [total, setTotal] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => { siteService.listAmenities('chalet').then(setAmenities); }, []);

  useEffect(() => {
    setLoading(true);
    chaletService
      .list({
        page, limit: 12,
        city: searchParams.get('city') || undefined,
        search: search || undefined,
        minPrice: filters.minPrice, maxPrice: filters.maxPrice,
        minCapacity: searchParams.get('guests') || undefined,
      })
      .then((res) => { setChalets(res.data || []); setTotal(res.meta?.total || 0); })
      .finally(() => setLoading(false));
  }, [page, search, filters, searchParams]);

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t('nav.chalets')}</h1>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search by name…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-40 rounded-xl border border-brand-800/15 px-3.5 py-2 text-sm outline-none focus:border-gold-400 sm:w-56"
          />
          <Button variant="outline" size="md" onClick={() => setFiltersOpen(true)}>
            <AdjustmentsHorizontalIcon className="h-4 w-4" /> {t('listing.filters')}
          </Button>
          <div className="flex rounded-xl border border-brand-800/15 p-1 lg:hidden">
            <button
              onClick={() => setMobileView('list')}
              className={`rounded-lg p-1.5 ${mobileView === 'list' ? 'bg-brand-800 text-white' : 'text-ink/50'}`}
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={`rounded-lg p-1.5 ${mobileView === 'map' ? 'bg-brand-800 text-white' : 'text-ink/50'}`}
            >
              <MapIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr] lg:h-[calc(100vh-180px)]">
        <div className={`${mobileView === 'map' ? 'hidden' : 'block'} overflow-y-auto pr-1 lg:block`}>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => <PropertySkeletonCard key={i} />)}
            </div>
          ) : chalets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-800/20 py-16 text-center">
              <p className="mb-3 text-ink/50">{t('listing.noResults')}</p>
              {(search || filters.minPrice || filters.maxPrice) && (
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
                {chalets.map((c) => (
                  <div
                    key={c.id}
                    onMouseEnter={() => setHoveredId(c.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`rounded-2xl transition ${hoveredId === c.id ? 'ring-2 ring-gold-400' : ''}`}
                  >
                    <PropertyCard property={c} type="chalet" isFavorite={isFavorite('chalet', c.id)} onToggleFavorite={(p) => toggle(p, 'chalet')} />
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${p === page ? 'bg-brand-800 text-white' : 'text-ink/60 hover:bg-brand-50'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className={`${mobileView === 'list' ? 'hidden' : 'block'} h-[420px] lg:sticky lg:top-24 lg:block lg:h-full`}>
          <MapView properties={loading ? [] : chalets} type="chalet" activeId={hoveredId} onHover={setHoveredId} />
        </div>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} side="right" title={t('listing.filters')}>
        <FilterPanel filters={filters} onChange={setFilters} amenities={amenities} />
        <Button fullWidth className="mt-4" onClick={() => setFiltersOpen(false)}>Show {total} results</Button>
      </Drawer>
    </div>
  );
}
