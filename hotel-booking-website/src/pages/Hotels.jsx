import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Grid, Typography, Box, Pagination, CircularProgress, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropertyCard from '../components/PropertyCard';
import FilterPanel from '../components/FilterPanel';
import useFavorites from '../hooks/useFavorites';
import hotelService from '../services/hotel.service';
import siteService from '../services/site.service';

export default function Hotels() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { isFavorite, toggle } = useFavorites();
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [total, setTotal] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    siteService.listAmenities('hotel').then(setAmenities);
  }, []);

  useEffect(() => {
    setLoading(true);
    hotelService
      .list({
        page,
        limit: 12,
        city: searchParams.get('city') || undefined,
        search: search || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating,
      })
      .then((res) => {
        setHotels(res.data || []);
        setTotal(res.meta?.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page, search, filters, searchParams]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>{t('nav.hotels')}</Typography>
      <TextField
        placeholder="Search by name…"
        size="small"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        sx={{ mb: 3, maxWidth: 320 }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <FilterPanel filters={filters} onChange={setFilters} amenities={amenities} showRating />
        </Grid>
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress color="secondary" /></Box>
          ) : hotels.length === 0 ? (
            <Typography color="text.secondary">{t('listing.noResults')}</Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {hotels.map((h) => (
                  <Grid item xs={12} sm={6} lg={4} key={h.id}>
                    <PropertyCard property={h} type="hotel" isFavorite={isFavorite('hotel', h.id)} onToggleFavorite={(p) => toggle(p, 'hotel')} />
                  </Grid>
                ))}
              </Grid>
              {total > 12 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination count={Math.ceil(total / 12)} page={page} onChange={(e, p) => setPage(p)} color="secondary" />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
