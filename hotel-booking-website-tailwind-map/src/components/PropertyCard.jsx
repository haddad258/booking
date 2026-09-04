import { Link as RouterLink } from 'react-router-dom';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import Rating from './ui/Rating';
import ResponsiveImage from './ui/ResponsiveImage';
import { resolveImageUrl } from '../lib/media';
import { formatPrice } from '../lib/currency';

export default function PropertyCard({ property, type, isFavorite, onToggleFavorite }) {
  const { t } = useTranslation();
  const coverImage = resolveImageUrl(property.cover_image_url || property.images?.[0]?.url);
  const detailPath = type === 'hotel' ? `/hotels/${property.id}` : `/chalets/${property.id}`;
  const rating = property.rating != null ? Number(property.rating) : null;
  const ratedPrice = property.rated_price != null ? Number(property.rated_price) : null;

  return (
    <div className="hover-lift group overflow-hidden rounded-2xl border border-brand-800/10 dark:border-white/10 bg-white dark:bg-brand-800">
      <div className="relative">
        {onToggleFavorite && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavorite(property); }}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-brand-800/90 shadow backdrop-blur transition hover:bg-white dark:bg-brand-800"
          >
            {isFavorite ? <HeartSolidIcon className="h-5 w-5 text-gold-500" /> : <HeartIcon className="h-5 w-5 text-ink/70 dark:text-white/70" />}
          </button>
        )}
        {rating != null && (
          <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/90 dark:bg-brand-800/90 px-2.5 py-1 text-xs font-bold text-ink dark:text-white shadow backdrop-blur">
            <StarIcon className="h-3.5 w-3.5 text-gold-500" /> {rating.toFixed(1)}
          </span>
        )}
        <RouterLink to={detailPath} className="block">
          <ResponsiveImage
            src={coverImage}
            alt={property.name}
            frameClassName="aspect-[4/3]"
            imgClassName="group-hover:scale-105"
          />
        </RouterLink>
      </div>
      <RouterLink to={detailPath} className="block p-4">
        <h3 className="truncate font-display text-lg font-semibold text-ink dark:text-white">{property.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/55 dark:text-white/55">
          <MapPinIcon className="h-3.5 w-3.5 text-ink/40 dark:text-white/40" /> {property.city}, {property.country}
        </p>

        {type === 'hotel' && property.star_rating > 0 && <Rating value={property.star_rating} className="mt-2" />}
        {type === 'chalet' && (
          <p className="mt-2 text-xs text-ink/55 dark:text-white/55">{property.capacity} guests · {property.bedrooms} bed</p>
        )}

        <p className="mt-3 font-display text-xl font-bold text-brand-700 dark:text-brand-200">
          {formatPrice(property.base_price)}
          <span className="ml-1 font-sans text-xs font-medium text-ink/50 dark:text-white/50">{t('listing.perNight')}</span>
        </p>
        {ratedPrice != null && (
          <p className="mt-0.5 text-xs text-ink/50 dark:text-white/50">
            {t('listing.ratedPrice')}: {formatPrice(ratedPrice)}
          </p>
        )}
      </RouterLink>
    </div>
  );
}
