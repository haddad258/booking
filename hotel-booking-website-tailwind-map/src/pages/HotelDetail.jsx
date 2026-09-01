import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { ReviewList, ReviewForm } from '../components/Review';
import PropertyCard from '../components/PropertyCard';
import PropertyGallery from '../components/PropertyGallery';
import PropertyLocationMap from '../components/PropertyLocationMap';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import hotelService from '../services/hotel.service';
import reviewService from '../services/review.service';
import useFavorites from '../hooks/useFavorites';

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink dark:text-white sm:text-4xl">{hotel.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink/55 dark:text-white/55">
            <MapPinIcon className="h-4 w-4" /> {hotel.address}, {hotel.city}, {hotel.country}
          </p>
        </div>
        <Button variant="outline" onClick={() => toggle(hotel, 'hotel')}>
          {isFavorite('hotel', hotel.id) ? 'Saved' : 'Save'}
        </Button>
      </div>

      {hotel.star_rating > 0 && <Rating value={hotel.star_rating} size="h-5 w-5" className="mb-6" />}

      <PropertyGallery images={hotel.images} name={hotel.name} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {hotel.description && <p className="mb-6 text-ink/75 dark:text-white/75">{hotel.description}</p>}

          <h2 className="font-display mb-3 text-xl font-semibold text-ink dark:text-white">{t('detail.amenities')}</h2>
          <div className="mb-8 flex flex-wrap gap-2">
            {hotel.amenities?.map((a) => <Badge key={a.id}>{a.name}</Badge>)}
          </div>

          <div className="mb-8 border-t border-brand-800/10 dark:border-white/10" />

          <h2 className="font-display mb-3 text-xl font-semibold text-ink dark:text-white">{t('detail.location')}</h2>
          <div className="mb-8">
            <PropertyLocationMap
              name={hotel.name}
              address={hotel.address}
              city={hotel.city}
              country={hotel.country}
              latitude={hotel.latitude}
              longitude={hotel.longitude}
            />
          </div>

          <div className="mb-8 border-t border-brand-800/10 dark:border-white/10" />

          <h2 className="font-display mb-4 text-xl font-semibold text-ink dark:text-white">{t('detail.reviews')}</h2>
          <ReviewList reviews={reviews} averageRating={hotel.averageRating} reviewCount={hotel.reviewCount} />
          <ReviewForm bookableType="hotel" bookableId={Number(id)} onSubmitted={load} />
        </div>

        <div>
          <div className="sticky top-24 rounded-2xl border border-brand-800/10 dark:border-white/10 bg-white dark:bg-brand-800 p-5">
            <h2 className="font-display mb-4 text-lg font-semibold text-ink dark:text-white">{t('detail.selectRoom')}</h2>
            <div className="flex flex-col gap-3">
              {hotel.rooms?.length ? (
                hotel.rooms.map((room) => (
                  <div key={room.id} className="rounded-xl border border-brand-800/10 dark:border-white/10 p-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-ink dark:text-white">{room.name}</p>
                        <p className="text-xs text-ink/50 dark:text-white/50">{room.capacity_adults} adults · {room.capacity_children} children</p>
                      </div>
                      <p className="font-display font-bold text-brand-700 dark:text-brand-200">${Number(room.price).toFixed(0)}</p>
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
                <p className="text-sm text-ink/50 dark:text-white/50">No rooms available right now.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display mb-5 text-2xl font-semibold text-ink dark:text-white">{t('detail.similar')}</h2>
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
