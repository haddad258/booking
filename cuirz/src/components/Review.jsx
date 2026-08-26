import { useState } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import reviewService from '../services/review.service';
import { apiErrorMessage } from '../services/api';
import Rating from './ui/Rating';
import { Textarea } from './ui/Input';
import Button from './ui/Button';

export function ReviewList({ reviews, averageRating, reviewCount }) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="font-display text-4xl font-bold text-ink">{averageRating?.toFixed(1) || '—'}</span>
        <div>
          <Rating value={averageRating || 0} />
          <p className="mt-0.5 text-xs text-ink/50">{reviewCount || 0} {t('detail.reviews').toLowerCase()}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {reviews.length === 0 && (
          <p className="text-sm text-ink/50">No reviews yet — be the first to share your experience.</p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-brand-800/10 pb-5">
            <div className="mb-1 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-brand-700">
                {r.first_name?.[0]}{r.last_name?.[0]}
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{r.first_name} {r.last_name}</p>
                <p className="text-xs text-ink/45">{format(new Date(r.created_at), 'MMM d, yyyy')}</p>
              </div>
            </div>
            <Rating value={Number(r.rating)} className="mb-1" />
            {r.comment && <p className="text-sm text-ink/80">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewForm({ bookableType, bookableId, onSubmitted }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const toast = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const submit = async () => {
    setLoading(true);
    try {
      await reviewService.create({ bookableType, bookableId, rating, comment });
      toast.success('Thanks! Your review is pending moderation.');
      setComment('');
      onSubmitted?.();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-brand-800/10 p-5">
      <h4 className="mb-3 text-sm font-bold text-ink">{t('detail.writeReview')}</h4>
      <Rating value={rating} onChange={setRating} size="h-6 w-6" className="mb-3" />
      <Textarea rows={3} placeholder="Share your experience…" value={comment} onChange={(e) => setComment(e.target.value)} className="mb-3" />
      <Button onClick={submit} disabled={loading}>Submit review</Button>
    </div>
  );
}
