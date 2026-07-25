import { useEffect, useState } from 'react';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import PropertyCard from '../components/PropertyCard';
import useFavorites from '../hooks/useFavorites';
import hotelService from '../services/hotel.service';
import chaletService from '../services/chalet.service';

export default function AccountFavorites() {
  const { favorites, toggle } = useFavorites();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await Promise.all(
        favorites.map(async (f) => {
          try {
            const data = f.bookable_type === 'hotel'
              ? await hotelService.getById(f.bookable_id)
              : await chaletService.getById(f.bookable_id);
            return { ...data, __type: f.bookable_type };
          } catch {
            return null;
          }
        })
      );
      setProperties(results.filter(Boolean));
      setLoading(false);
    })();
  }, [favorites]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress color="secondary" /></Box>;
  }

  if (properties.length === 0) {
    return <Typography color="text.secondary">You haven't saved any properties yet.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {properties.map((p) => (
        <Grid item xs={12} sm={6} key={`${p.__type}-${p.id}`}>
          <PropertyCard property={p} type={p.__type} isFavorite onToggleFavorite={(prop) => toggle(prop, p.__type)} />
        </Grid>
      ))}
    </Grid>
  );
}
