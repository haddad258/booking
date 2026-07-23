import { useState } from 'react';
import { Box, Typography, Rating, Stack, Avatar, Button, TextField, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import reviewService from '../services/review.service';
import { apiErrorMessage } from '../services/api';

export function ReviewList({ reviews, averageRating, reviewCount }) {
  const { t } = useTranslation();

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>{averageRating?.toFixed(1) || '—'}</Typography>
        <Box>
          <Rating value={averageRating || 0} precision={0.5} readOnly size="small" />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {reviewCount || 0} {t('detail.reviews').toLowerCase()}
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={2.5}>
        {reviews.length === 0 && (
          <Typography variant="body2" color="text.secondary">No reviews yet — be the first to share your experience.</Typography>
        )}
        {reviews.map((r) => (
          <Box key={r.id} sx={{ pb: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
              <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                {r.first_name?.[0]}{r.last_name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={700}>{r.first_name} {r.last_name}</Typography>
                <Typography variant="caption" color="text.secondary">{format(new Date(r.created_at), 'MMM d, yyyy')}</Typography>
              </Box>
            </Stack>
            <Rating value={Number(r.rating)} precision={0.5} readOnly size="small" sx={{ mb: 0.5 }} />
            {r.comment && <Typography variant="body2">{r.comment}</Typography>}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export function ReviewForm({ bookableType, bookableId, onSubmitted }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      await reviewService.create({ bookableType, bookableId, rating, comment });
      setSuccess(true);
      setComment('');
      onSubmitted?.();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3, p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>{t('detail.writeReview')}</Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Thanks! Your review is pending moderation.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Rating value={rating} onChange={(e, v) => setRating(v)} sx={{ mb: 1.5 }} />
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Share your experience…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 1.5 }}
      />
      <Button variant="contained" color="secondary" onClick={submit} disabled={loading}>
        Submit review
      </Button>
    </Box>
  );
}
