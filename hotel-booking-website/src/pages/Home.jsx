import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Chip, Stack, Avatar, Rating } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import useFavorites from '../hooks/useFavorites';
import hotelService from '../services/hotel.service';
import chaletService from '../services/chalet.service';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80&auto=format&fit=crop';

const DESTINATIONS = [
  { name: 'Nice', country: 'France', image: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=500&q=80&auto=format&fit=crop' },
  { name: 'Chamonix', country: 'France', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80&auto=format&fit=crop' },
  { name: 'Marrakech', country: 'Morocco', image: 'https://images.unsplash.com/photo-1553603227-2358aabe821e?w=500&q=80&auto=format&fit=crop' },
  { name: 'Zermatt', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&q=80&auto=format&fit=crop' },
];

const TESTIMONIALS = [
  { name: 'Amelia R.', quote: 'The chalet booking was seamless and the mountain views were unreal.', rating: 5 },
  { name: 'Karim B.', quote: 'Customer support helped us change dates in minutes. Would book again.', rating: 5 },
  { name: 'Sofia M.', quote: 'Loved the curated hotel picks — every stay felt handpicked for us.', rating: 4.5 },
];

export default function Home() {
  const { t } = useTranslation();
  const { isFavorite, toggle } = useFavorites();
  const [hotels, setHotels] = useState([]);
  const [chalets, setChalets] = useState([]);

  useEffect(() => {
    hotelService.list({ limit: 4 }).then((res) => setHotels(res.data || []));
    chaletService.list({ limit: 4 }).then((res) => setChalets(res.data || []));
  }, []);

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 460, md: 560 },
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `linear-gradient(180deg, rgba(31,58,52,0.35), rgba(31,58,52,0.55)), url(${HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center', color: '#fff' }}>
          <Typography variant="h2" fontWeight={700} sx={{ mb: 2, fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
            {t('home.heroTitle')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400, maxWidth: 560, mx: 'auto' }}>
            {t('home.heroSubtitle')}
          </Typography>
          <SearchBar />
        </Container>
      </Box>

      {/* Featured hotels */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>{t('home.featuredHotels')}</Typography>
        <Grid container spacing={3}>
          {hotels.map((h) => (
            <Grid item xs={12} sm={6} md={3} key={h.id}>
              <PropertyCard property={h} type="hotel" isFavorite={isFavorite('hotel', h.id)} onToggleFavorite={(p) => toggle(p, 'hotel')} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Popular destinations */}
      <Box sx={{ bgcolor: 'sand', py: 8, backgroundColor: '#F1E9DC' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>{t('home.popularDestinations')}</Typography>
          <Grid container spacing={3}>
            {DESTINATIONS.map((d) => (
              <Grid item xs={6} md={3} key={d.name}>
                <Box
                  sx={{
                    height: 200,
                    borderRadius: 3,
                    backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55)), url(${d.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'flex-end',
                    p: 2,
                    color: '#fff',
                  }}
                >
                  <Box>
                    <Typography fontWeight={700}>{d.name}</Typography>
                    <Typography variant="caption">{d.country}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured chalets */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>{t('home.featuredChalets')}</Typography>
        <Grid container spacing={3}>
          {chalets.map((c) => (
            <Grid item xs={12} sm={6} md={3} key={c.id}>
              <PropertyCard property={c} type="chalet" isFavorite={isFavorite('chalet', c.id)} onToggleFavorite={(p) => toggle(p, 'chalet')} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Box sx={{ bgcolor: 'primary.main', color: '#fff', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 4, textAlign: 'center' }}>{t('home.testimonials')}</Typography>
          <Grid container spacing={3}>
            {TESTIMONIALS.map((tst) => (
              <Grid item xs={12} md={4} key={tst.name}>
                <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)', height: '100%' }}>
                  <Rating value={tst.rating} precision={0.5} readOnly size="small" sx={{ mb: 1.5 }} />
                  <Typography sx={{ mb: 2, opacity: 0.9 }}>&ldquo;{tst.quote}&rdquo;</Typography>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{ width: 32, height: 32 }}>{tst.name[0]}</Avatar>
                    <Typography variant="body2" fontWeight={600}>{tst.name}</Typography>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
