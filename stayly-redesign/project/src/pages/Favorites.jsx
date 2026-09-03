import { useEffect, useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import PropertyCard from '../components/PropertyCard';
import PropertySkeletonCard from '../components/PropertySkeletonCard';
import Button from '../components/ui/Button';
import useFavorites from '../hooks/useFavorites';
import hotelService from '../services/hotel.service';
import chaletService from '../services/chalet.service';

/**
 * Standalone Saved/Favorites page — deliberately NOT behind a login wall,
 * since guests can save favorites via localStorage (see useFavorites) and
 * should be able to see what they've saved without creating an account.
 * Logged-in users see the same page backed by their account instead.
 */
export default function Favorites() {
  const { favorites, toggle, loading: favoritesLoading, isGuest } = useFavorites();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favoritesLoading) return;
    (async () => {
      setLoading(true);
      const results = await Promise.all(
        favorites.map(async (f) => {
          try {
            const data = f.bookable_type === 'hotel' ? await hotelService.getById(f.bookable_id) : await chaletService.getById(f.bookable_id);
            return { ...data, __type: f.bookable_type };
          } catch {
            return null;
          }
        })
      );
      setProperties(results.filter(Boolean));
      setLoading(false);
    })();
  }, [favorites, favoritesLoading]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display mb-1 text-3xl font-medium text-ink dark:text-white sm:text-4xl">Saved properties</h1>
      <p className="mb-8 text-ink/55 dark:text-white/55">
        {isGuest
          ? "Saved on this device. Log in to keep them synced across devices."
          : 'Synced to your account.'}
      </p>

      {loading || favoritesLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <PropertySkeletonCard key={i} />)}
        </div>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-ink/20 dark:border-white/20 py-20 text-center">
          <HeartIcon className="mb-3 h-12 w-12 text-ink/20" />
          <p className="mb-1 font-medium text-ink dark:text-white">No saved properties yet</p>
          <p className="mb-5 max-w-sm text-sm text-ink/50 dark:text-white/50">
            Tap the heart icon on any hotel or chalet to save it here for later.
          </p>
          <div className="flex gap-3">
            <Button to="/hotels" variant="outline">Browse hotels</Button>
            <Button to="/chalets" variant="outline">Browse chalets</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard
              key={`${p.__type}-${p.id}`}
              property={p}
              type={p.__type}
              isFavorite
              onToggleFavorite={(prop) => toggle(prop, p.__type)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
