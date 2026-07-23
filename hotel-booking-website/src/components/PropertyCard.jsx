import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Box, Typography, Chip, Rating, Stack, IconButton } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteIcon from '@mui/icons-material/FavoriteRounded';
import { useTranslation } from 'react-i18next';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1$/, '');
const PLACEHOLDER = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80&auto=format&fit=crop';

export default function PropertyCard({ property, type, isFavorite, onToggleFavorite }) {
  const { t } = useTranslation();
  const coverImage = property.images?.[0]?.url ? `${API_ORIGIN}${property.images[0].url}` : PLACEHOLDER;
  const detailPath = type === 'hotel' ? `/hotels/${property.id}` : `/chalets/${property.id}`;

  return (
    <Card sx={{ position: 'relative', '&:hover': { boxShadow: '0 12px 32px rgba(31,58,52,0.12)', transform: 'translateY(-3px)' } }}>
      {onToggleFavorite && (
        <IconButton
          size="small"
          onClick={(e) => { e.preventDefault(); onToggleFavorite(property); }}
          sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: '#fff' } }}
        >
          {isFavorite ? <FavoriteIcon fontSize="small" color="secondary" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
      )}
      <CardActionArea component={RouterLink} to={detailPath}>
        <Box
          sx={{
            height: 190,
            backgroundImage: `url(${coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ maxWidth: '80%' }}>
              {property.name}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary', mb: 1 }}>
            <LocationOnOutlinedIcon fontSize="inherit" />
            <Typography variant="caption">{property.city}, {property.country}</Typography>
          </Stack>

          {type === 'hotel' && property.star_rating > 0 && (
            <Rating value={property.star_rating} readOnly size="small" sx={{ mb: 1 }} />
          )}
          {type === 'chalet' && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {property.capacity} guests · {property.bedrooms} bed
            </Typography>
          )}

          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography variant="h6" fontWeight={700} color="primary.main">
              ${Number(property.base_price).toFixed(0)}
              <Typography component="span" variant="caption" color="text.secondary"> {t('listing.perNight')}</Typography>
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
