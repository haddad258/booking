import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Grid, Box, Typography, Chip, Stack, Button, Paper, CircularProgress, Divider,
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useTranslation } from 'react-i18next';
import { ReviewList, ReviewForm } from '../components/Review';
import PropertyCard from '../components/PropertyCard';
import chaletService from '../services/chalet.service';
import reviewService from '../services/review.service';
import useFavorites from '../hooks/useFavorites';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1$/, '');
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

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !chalet) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="secondary" /></Box>;
  }

  const cover = chalet.images?.[0]?.url ? `${API_ORIGIN}${chalet.images[0].url}` : PLACEHOLDER;
  const gallery = chalet.images?.length ? chalet.images.slice(1, 5) : [];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>{chalet.name}</Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
            <LocationOnOutlinedIcon fontSize="small" />
            <Typography variant="body2">{chalet.address}, {chalet.city}, {chalet.country}</Typography>
          </Stack>
        </Box>
        <Button variant="outlined" color="secondary" onClick={() => toggle(chalet, 'chalet')}>
          {isFavorite('chalet', chalet.id) ? 'Saved' : 'Save'}
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Chip label={`${chalet.capacity} guests`} />
        <Chip label={`${chalet.bedrooms} bedrooms`} />
        <Chip label={`${chalet.bathrooms} bathrooms`} />
      </Stack>

      <Grid container spacing={1} sx={{ mb: 4, height: { xs: 240, md: 380 } }}>
        <Grid item xs={12} md={7} sx={{ height: '100%' }}>
          <Box sx={{ height: '100%', borderRadius: 3, backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </Grid>
        <Grid item xs={12} md={5} sx={{ height: '100%' }}>
          <Grid container spacing={1} sx={{ height: '100%' }}>
            {(gallery.length ? gallery : [{ url: null }, { url: null }, { url: null }, { url: null }]).slice(0, 4).map((img, idx) => (
              <Grid item xs={6} key={idx} sx={{ height: '50%' }}>
                <Box
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    backgroundImage: `url(${img.url ? `${API_ORIGIN}${img.url}` : PLACEHOLDER})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          {chalet.description && <Typography sx={{ mb: 3 }}>{chalet.description}</Typography>}

          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>{t('detail.amenities')}</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
            {chalet.amenities?.map((a) => <Chip key={a.id} label={a.name} variant="outlined" />)}
          </Stack>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{t('detail.reviews')}</Typography>
          <ReviewList reviews={reviews} averageRating={chalet.averageRating} reviewCount={chalet.reviewCount} />
          <ReviewForm bookableType="chalet" bookableId={Number(id)} onSubmitted={load} />
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 90 }}>
            <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ mb: 0.5 }}>
              ${Number(chalet.base_price).toFixed(0)} <Typography component="span" variant="body2" color="text.secondary">{t('listing.perNight')}</Typography>
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mt: 2 }}
              onClick={() => navigate(`/book/chalet/${chalet.id}?price=${chalet.base_price}`)}
            >
              {t('detail.bookNow')}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {similar.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>{t('detail.similar')}</Typography>
          <Grid container spacing={3}>
            {similar.map((c) => (
              <Grid item xs={12} sm={6} md={3} key={c.id}>
                <PropertyCard property={c} type="chalet" isFavorite={isFavorite('chalet', c.id)} onToggleFavorite={(p) => toggle(p, 'chalet')} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
