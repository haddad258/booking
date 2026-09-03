import { useTranslation } from 'react-i18next';
import Button from './ui/Button';

export default function FilterPanel({ filters, onChange, amenities = [], showRating }) {
  const { t } = useTranslation();

  const toggleAmenity = (id) => {
    const current = filters.amenityIds || [];
    const next = current.includes(id) ? current.filter((a) => a !== id) : [...current, id];
    onChange({ ...filters, amenityIds: next });
  };

  return (
    <div className="rounded-[20px] border border-ink/10 dark:border-white/10 bg-white dark:bg-brand-800 p-5">
      <h3 className="eyebrow mb-4 text-ink dark:text-white">{t('listing.filters')}</h3>

      <div className="mb-5">
        <p className="mb-2 text-sm font-semibold text-ink dark:text-white">{t('listing.priceRange')}</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full rounded-lg border border-ink/15 dark:border-white/15 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400"
          />
          <span className="text-ink/40 dark:text-white/40">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full rounded-lg border border-ink/15 dark:border-white/15 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400"
          />
        </div>
      </div>

      {showRating && (
        <div className="mb-5 border-t border-ink/10 dark:border-white/10 pt-4">
          <p className="mb-2 text-sm font-semibold text-ink dark:text-white">{t('listing.rating')}</p>
          <div className="flex flex-col gap-1.5">
            {[5, 4, 3, 2].map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm text-ink/80 dark:text-white/80">
                <input
                  type="checkbox"
                  checked={filters.rating === r}
                  onChange={() => onChange({ ...filters, rating: filters.rating === r ? undefined : r })}
                  className="h-4 w-4 rounded border-ink/30 dark:border-white/30 text-brand-700 dark:text-gold-300 focus:ring-brand-300"
                />
                {r}+ stars
              </label>
            ))}
          </div>
        </div>
      )}

      {amenities.length > 0 && (
        <div className="mb-5 max-h-56 overflow-y-auto border-t border-ink/10 dark:border-white/10 pt-4">
          <p className="mb-2 text-sm font-semibold text-ink dark:text-white">{t('listing.amenities')}</p>
          <div className="flex flex-col gap-1.5">
            {amenities.map((a) => (
              <label key={a.id} className="flex items-center gap-2 text-sm text-ink/80 dark:text-white/80">
                <input
                  type="checkbox"
                  checked={(filters.amenityIds || []).includes(a.id)}
                  onChange={() => toggleAmenity(a.id)}
                  className="h-4 w-4 rounded border-ink/30 dark:border-white/30 text-brand-700 dark:text-gold-300 focus:ring-brand-300"
                />
                {a.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <Button variant="ghost" size="sm" fullWidth onClick={() => onChange({})}>Clear all</Button>
    </div>
  );
}
