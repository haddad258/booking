import { Link as RouterLink } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import Rating from './ui/Rating';
import { resolveImageUrl } from '../lib/media';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80&auto=format&fit=crop';

export default function PropertyCard({ property, type, isFavorite, onToggleFavorite }) {
  const { t } = useTranslation();
  const coverImage = resolveImageUrl(property.images?.[0]?.url, PLACEHOLDER);
  const detailPath = type === 'hotel' ? `/hotels/${property.id}` : `/chalets/${property.id}`;

  return (
    <div className="hover-lift group overflow-hidden rounded-2xl border border-brand-800/10 bg-white">
      <div className="relative">
        {onToggleFavorite && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavorite(property); }}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur transition hover:bg-white"
          >
            {isFavorite ? <HeartSolidIcon className="h-5 w-5 text-gold-500" /> : <HeartIcon className="h-5 w-5 text-ink/70" />}
          </button>
        )}
        <RouterLink to={detailPath} className="block h-48 w-full overflow-hidden">
          <img
            src={coverImage}
            alt={property.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </RouterLink>
      </div>
      <RouterLink to={detailPath} className="block p-4">
        <h3 className="truncate font-display text-lg font-semibold text-ink">{property.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/55">
          <MapPinIcon className="h-3.5 w-3.5" /> {property.city}, {property.country}
        </p>

        {type === 'hotel' && property.star_rating > 0 && <Rating value={property.star_rating} className="mt-2" />}
        {type === 'chalet' && (
          <p className="mt-2 text-xs text-ink/55">{property.capacity} guests · {property.bedrooms} bed</p>
        )}

        <p className="mt-3 font-display text-xl font-bold text-brand-700">
          ${Number(property.base_price).toFixed(0)}
          <span className="ml-1 font-sans text-xs font-medium text-ink/50">{t('listing.perNight')}</span>
        </p>
      </RouterLink>
    </div>
  );
}
