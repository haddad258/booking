import { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/ui/Spinner';
import useFavorites from '../hooks/useFavorites';
import hotelService from '../services/hotel.service';
import chaletService from '../services/chalet.service';

export default function AccountFavorites() {
  const { favorites, toggle } = useFavorites();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await Promise.all(
        favorites.map(async (f) => {
          try {
            const data = f.bookable_type === 'hotel' ? await hotelService.getById(f.bookable_id) : await chaletService.getById(f.bookable_id);
            return { ...data, __type: f.bookable_type };
          } catch { return null; }
        })
      );
      setProperties(results.filter(Boolean));
      setLoading(false);
    })();
  }, [favorites]);

  if (loading) return <div className="flex justify-center py-10"><Spinner className="h-6 w-6" /></div>;
  if (properties.length === 0) return <p className="text-sm text-ink/50">You haven't saved any properties yet.</p>;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {properties.map((p) => (
        <PropertyCard key={`${p.__type}-${p.id}`} property={p} type={p.__type} isFavorite onToggleFavorite={(prop) => toggle(prop, p.__type)} />
      ))}
    </div>
  );
}
