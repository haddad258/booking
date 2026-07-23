import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Grid, Typography, Box, Pagination, CircularProgress, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropertyCard from '../components/PropertyCard';
import FilterPanel from '../components/FilterPanel';
import useFavorites from '../hooks/useFavorites';
import chaletService from '../services/chalet.service';
import siteService from '../services/site.service';

export default function Chalets() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { isFavorite, toggle } = useFavorites();
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [chalets, setChalets] = useState([]);
  const [total, setTotal] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    siteService.listAmenities('chalet').then(setAmenities);
  }, []);

  useEffect(() => {
    setLoading(true);
    chaletService
      .list({
        page,
        limit: 12,
        city: searchParams.get('city') || undefined,
        search: search || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minCapacity: searchParams.get('guests') || undefined,
      })
      .then((res) => {
        setChalets(res.data || []);
        setTotal(res.meta?.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page, search, filters, searchParams]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>{t('nav.chalets')}</Typography>
      <TextField
        placeholder="Search by name…"
        size="small"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        sx={{ mb: 3, maxWidth: 320 }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <FilterPanel filters={filters} onChange={setFilters} amenities={amenities} />
        </Grid>
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress color="secondary" /></Box>
          ) : chalets.length === 0 ? (
            <Typography color="text.secondary">{t('listing.noResults')}</Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {chalets.map((c) => (
                  <Grid item xs={12} sm={6} lg={4} key={c.id}>
                    <PropertyCard property={c} type="chalet" isFavorite={isFavorite('chalet', c.id)} onToggleFavorite={(p) => toggle(p, 'chalet')} />
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
