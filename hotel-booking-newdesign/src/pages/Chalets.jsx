import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container, Grid, Typography, Box, Pagination, CircularProgress, TextField, Button, Drawer, IconButton, Stack,
} from '@mui/material';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h4" sx={{ mb: 1 }}>{t('nav.chalets')}</Typography>

      <Stack direction="row" spacing={1.5} sx={{ mb: 3 }} alignItems="center">
        <TextField
          placeholder="Search by name…"
          size="small"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          sx={{ maxWidth: 320, flex: 1 }}
        />
        <Button
          variant="outlined"
          startIcon={<TuneRoundedIcon />}
          onClick={() => setFiltersOpen(true)}
          sx={{ display: { xs: 'inline-flex', md: 'none' }, flexShrink: 0 }}
        >
          {t('listing.filters')}
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ position: 'sticky', top: 96 }}>
            <FilterPanel filters={filters} onChange={setFilters} amenities={amenities} />
          </Box>
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

      <Drawer anchor="right" open={filtersOpen} onClose={() => setFiltersOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 360 }, p: 2 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>{t('listing.filters')}</Typography>
          <IconButton onClick={() => setFiltersOpen(false)}><CloseIcon /></IconButton>
        </Stack>
        <FilterPanel filters={filters} onChange={setFilters} amenities={amenities} />
        <Button fullWidth variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => setFiltersOpen(false)}>
          Show {total} results
        </Button>
      </Drawer>
    </Container>
  );
}
