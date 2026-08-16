import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { ReviewList, ReviewForm } from '../components/Review';
import PropertyCard from '../components/PropertyCard';
import PropertyLocationMap from '../components/PropertyLocationMap';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import chaletService from '../services/chalet.service';
import reviewService from '../services/review.service';
import useFavorites from '../hooks/useFavorites';
import { resolveImageUrl } from '../lib/media';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop';

export default function ChaletDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isFavorite, toggle } = useFavorites();
  const [chalet, setChalet] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await chaletService.getById(id);
    setChalet(data);
    const reviewRes = await reviewService.listForBookable('chalet', id);
    setReviews(reviewRes.data || []);
    const similarRes = await chaletService.list({ city: data.city, limit: 4 });
    setSimilar((similarRes.data || []).filter((c) => c.id !== Number(id)));
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  if (loading || !chalet) {
    return <div className="flex justify-center py-24"><Spinner className="h-8 w-8" /></div>;
  }

  const cover = resolveImageUrl(chalet.images?.[0]?.url, PLACEHOLDER);
  const gallery = chalet.images?.length ? chalet.images.slice(1, 5) : [null, null, null, null];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{chalet.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink/55">
            <MapPinIcon className="h-4 w-4" /> {chalet.address}, {chalet.city}, {chalet.country}
          </p>
        </div>
        <Button variant="outline" onClick={() => toggle(chalet, 'chalet')}>
          {isFavorite('chalet', chalet.id) ? 'Saved' : 'Save'}
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge color="gold">{chalet.capacity} guests</Badge>
        <Badge color="gold">{chalet.bedrooms} bedrooms</Badge>
        <Badge color="gold">{chalet.bathrooms} bathrooms</Badge>
      </div>

      <div className="mb-10 grid h-64 grid-cols-1 gap-2 sm:h-96 sm:grid-cols-2">
        <div className="h-full overflow-hidden rounded-2xl">
          <img src={cover} alt={chalet.name} className="h-full w-full object-cover" />
        </div>
        <div className="grid h-full grid-cols-2 gap-2">
          {gallery.slice(0, 4).map((img, idx) => (
            <div key={idx} className="h-full overflow-hidden rounded-2xl">
              <img
                src={resolveImageUrl(img?.url, PLACEHOLDER)}
                alt={`${chalet.name} — photo ${idx + 2}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {chalet.description && <p className="mb-6 text-ink/75">{chalet.description}</p>}

          <h2 className="font-display mb-3 text-xl font-semibold text-ink">{t('detail.amenities')}</h2>
          <div className="mb-8 flex flex-wrap gap-2">
            {chalet.amenities?.map((a) => <Badge key={a.id}>{a.name}</Badge>)}
          </div>

          <div className="mb-8 border-t border-brand-800/10" />

          <h2 className="font-display mb-3 text-xl font-semibold text-ink">{t('detail.location')}</h2>
          <div className="mb-8">
            <PropertyLocationMap
              name={chalet.name}
              address={chalet.address}
              city={chalet.city}
              country={chalet.country}
              latitude={chalet.latitude}
              longitude={chalet.longitude}
            />
          </div>

          <div className="mb-8 border-t border-brand-800/10" />

          <h2 className="font-display mb-4 text-xl font-semibold text-ink">{t('detail.reviews')}</h2>
          <ReviewList reviews={reviews} averageRating={chalet.averageRating} reviewCount={chalet.reviewCount} />
          <ReviewForm bookableType="chalet" bookableId={Number(id)} onSubmitted={load} />
        </div>

        <div>
          <div className="sticky top-24 rounded-2xl border border-brand-800/10 bg-white p-5">
            <p className="font-display text-2xl font-bold text-brand-700">
              ${Number(chalet.base_price).toFixed(0)} <span className="font-sans text-sm font-medium text-ink/50">{t('listing.perNight')}</span>
            </p>
            <Button
              fullWidth
              size="lg"
              className="mt-4"
              onClick={() => navigate(`/book/chalet/${chalet.id}?price=${chalet.base_price}`)}
            >
              {t('detail.bookNow')}
            </Button>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display mb-5 text-2xl font-semibold text-ink">{t('detail.similar')}</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((c) => (
              <PropertyCard key={c.id} property={c} type="chalet" isFavorite={isFavorite('chalet', c.id)} onToggleFavorite={(p) => toggle(p, 'chalet')} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
