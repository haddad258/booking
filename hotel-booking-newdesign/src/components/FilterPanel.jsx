import { Paper, Typography, Slider, Stack, FormControlLabel, Checkbox, Divider, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function FilterPanel({ filters, onChange, amenities = [], showRating }) {
  const { t } = useTranslation();

  const handlePriceChange = (e, value) => onChange({ ...filters, minPrice: value[0], maxPrice: value[1] });

  const toggleAmenity = (id) => {
    const current = filters.amenityIds || [];
    const next = current.includes(id) ? current.filter((a) => a !== id) : [...current, id];
    onChange({ ...filters, amenityIds: next });
  };

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>{t('listing.filters')}</Typography>

      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>{t('listing.priceRange')}</Typography>
      <Slider
        value={[filters.minPrice || 0, filters.maxPrice || 1000]}
        onChange={handlePriceChange}
        min={0}
        max={1000}
        step={10}
        valueLabelDisplay="auto"
        color="secondary"
        sx={{ mb: 2 }}
      />

      {showRating && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>{t('listing.rating')}</Typography>
          <Stack>
            {[5, 4, 3, 2].map((r) => (
              <FormControlLabel
                key={r}
                control={<Checkbox size="small" checked={filters.rating === r} onChange={() => onChange({ ...filters, rating: filters.rating === r ? undefined : r })} />}
                label={`${r}+ stars`}
              />
            ))}
          </Stack>
        </>
      )}

      {amenities.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>{t('listing.amenities')}</Typography>
          <Stack sx={{ maxHeight: 220, overflowY: 'auto' }}>
            {amenities.map((a) => (
              <FormControlLabel
                key={a.id}
                control={<Checkbox size="small" checked={(filters.amenityIds || []).includes(a.id)} onChange={() => toggleAmenity(a.id)} />}
                label={a.name}
              />
            ))}
          </Stack>
        </>
      )}

      <Button fullWidth variant="text" size="small" sx={{ mt: 2 }} onClick={() => onChange({})}>
        Clear all
      </Button>
    </Paper>
  );
}
