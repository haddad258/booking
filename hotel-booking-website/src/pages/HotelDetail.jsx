import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Grid, Box, Typography, Chip, Stack, Rating, Button, Paper, CircularProgress, Divider,
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useTranslation } from 'react-i18next';
import { ReviewList, ReviewForm } from '../components/Review';
import PropertyCard from '../components/PropertyCard';
import hotelService from '../services/hotel.service';
import reviewService from '../services/review.service';
import useFavorites from '../hooks/useFavorites';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1$/, '');
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

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !hotel) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="secondary" /></Box>;
  }

  const cover = hotel.images?.[0]?.url ? `${API_ORIGIN}${hotel.images[0].url}` : PLACEHOLDER;
  const gallery = hotel.images?.length ? hotel.images.slice(1, 5) : [];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>{hotel.name}</Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
            <LocationOnOutlinedIcon fontSize="small" />
            <Typography variant="body2">{hotel.address}, {hotel.city}, {hotel.country}</Typography>
          </Stack>
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => toggle(hotel, 'hotel')}
        >
          {isFavorite('hotel', hotel.id) ? 'Saved' : 'Save'}
        </Button>
      </Stack>

      {hotel.star_rating > 0 && <Rating value={hotel.star_rating} readOnly sx={{ mb: 3 }} />}

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
          {hotel.description && <Typography sx={{ mb: 3 }}>{hotel.description}</Typography>}

          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>{t('detail.amenities')}</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
            {hotel.amenities?.map((a) => <Chip key={a.id} label={a.name} variant="outlined" />)}
          </Stack>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{t('detail.reviews')}</Typography>
          <ReviewList reviews={reviews} averageRating={hotel.averageRating} reviewCount={hotel.reviewCount} />
          <ReviewForm bookableType="hotel" bookableId={Number(id)} onSubmitted={load} />
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 90 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{t('detail.selectRoom')}</Typography>
            <Stack spacing={1.5}>
              {hotel.rooms?.length ? (
                hotel.rooms.map((room) => (
                  <Box key={room.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography fontWeight={700}>{room.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {room.capacity_adults} adults · {room.capacity_children} children
                        </Typography>
                      </Box>
                      <Typography fontWeight={700} color="primary.main">${Number(room.price).toFixed(0)}</Typography>
                    </Stack>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      sx={{ mt: 1.5 }}
                      onClick={() => navigate(`/book/hotel/${hotel.id}?roomId=${room.id}&price=${room.price}`)}
                    >
                      {t('detail.bookNow')}
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No rooms available right now.</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {similar.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>{t('detail.similar')}</Typography>
          <Grid container spacing={3}>
            {similar.map((h) => (
              <Grid item xs={12} sm={6} md={3} key={h.id}>
                <PropertyCard property={h} type="hotel" isFavorite={isFavorite('hotel', h.id)} onToggleFavorite={(p) => toggle(p, 'hotel')} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
