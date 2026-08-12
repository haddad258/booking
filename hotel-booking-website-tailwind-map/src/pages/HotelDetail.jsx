import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { ReviewList, ReviewForm } from '../components/Review';
import PropertyCard from '../components/PropertyCard';
import MapView from '../components/MapView';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import hotelService from '../services/hotel.service';
import reviewService from '../services/review.service';
import useFavorites from '../hooks/useFavorites';
import { resolveImageUrl } from '../lib/media';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80&auto=format&fit=crop';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isFavorite, toggle } = useFavorites();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await hotelService.getById(id);
    setHotel(data);
    const reviewRes = await reviewService.listForBookable('hotel', id);
    setReviews(reviewRes.data || []);
    const similarRes = await hotelService.list({ city: data.city, limit: 4 });
    setSimilar((similarRes.data || []).filter((h) => h.id !== Number(id)));
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  if (loading || !hotel) {
    return <div className="flex justify-center py-24"><Spinner className="h-8 w-8" /></div>;
  }

  const cover = resolveImageUrl(hotel.images?.[0]?.url, PLACEHOLDER);
  const gallery = hotel.images?.length ? hotel.images.slice(1, 5) : [null, null, null, null];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{hotel.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink/55">
            <MapPinIcon className="h-4 w-4" /> {hotel.address}, {hotel.city}, {hotel.country}
          </p>
        </div>
        <Button variant="outline" onClick={() => toggle(hotel, 'hotel')}>
          {isFavorite('hotel', hotel.id) ? 'Saved' : 'Save'}
        </Button>
      </div>

      {hotel.star_rating > 0 && <Rating value={hotel.star_rating} size="h-5 w-5" className="mb-6" />}

      <div className="mb-10 grid h-64 grid-cols-1 gap-2 sm:h-96 sm:grid-cols-2">
        <div className="h-full overflow-hidden rounded-2xl">
          <img src={cover} alt={hotel.name} className="h-full w-full object-cover" />
        </div>
        <div className="grid h-full grid-cols-2 gap-2">
          {gallery.slice(0, 4).map((img, idx) => (
            <div key={idx} className="h-full overflow-hidden rounded-2xl">
              <img
                src={resolveImageUrl(img?.url, PLACEHOLDER)}
                alt={`${hotel.name} — photo ${idx + 2}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {hotel.description && <p className="mb-6 text-ink/75">{hotel.description}</p>}

          <h2 className="font-display mb-3 text-xl font-semibold text-ink">{t('detail.amenities')}</h2>
          <div className="mb-8 flex flex-wrap gap-2">
            {hotel.amenities?.map((a) => <Badge key={a.id}>{a.name}</Badge>)}
          </div>

          <div className="mb-8 border-t border-brand-800/10" />

          <h2 className="font-display mb-3 text-xl font-semibold text-ink">{t('detail.location')}</h2>
          <div className="mb-8 h-64 sm:h-80">
            <MapView properties={[hotel]} type="hotel" />
          </div>

          <div className="mb-8 border-t border-brand-800/10" />

          <h2 className="font-display mb-4 text-xl font-semibold text-ink">{t('detail.reviews')}</h2>
          <ReviewList reviews={reviews} averageRating={hotel.averageRating} reviewCount={hotel.reviewCount} />
          <ReviewForm bookableType="hotel" bookableId={Number(id)} onSubmitted={load} />
        </div>

        <div>
          <div className="sticky top-24 rounded-2xl border border-brand-800/10 bg-white p-5">
            <h2 className="font-display mb-4 text-lg font-semibold text-ink">{t('detail.selectRoom')}</h2>
            <div className="flex flex-col gap-3">
              {hotel.rooms?.length ? (
                hotel.rooms.map((room) => (
                  <div key={room.id} className="rounded-xl border border-brand-800/10 p-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-ink">{room.name}</p>
                        <p className="text-xs text-ink/50">{room.capacity_adults} adults · {room.capacity_children} children</p>
                      </div>
                      <p className="font-display font-bold text-brand-700">${Number(room.price).toFixed(0)}</p>
                    </div>
                    <Button
                      fullWidth
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate(`/book/hotel/${hotel.id}?roomId=${room.id}&price=${room.price}`)}
                    >
                      {t('detail.bookNow')}
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink/50">No rooms available right now.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display mb-5 text-2xl font-semibold text-ink">{t('detail.similar')}</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((h) => (
              <PropertyCard key={h.id} property={h} type="hotel" isFavorite={isFavorite('hotel', h.id)} onToggleFavorite={(p) => toggle(p, 'hotel')} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
