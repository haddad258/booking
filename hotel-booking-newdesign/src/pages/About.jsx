import { Container, Typography, Grid, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const IMAGE = 'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=1000&q=80&auto=format&fit=crop';

export default function About() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" fontWeight={700} gutterBottom>Our story</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {t('app.name')} started with a simple idea: booking a beautiful place to stay shouldn't feel
            like a chore. We hand-pick every hotel and chalet on our platform, working directly with
            owners who care as much about the guest experience as we do.
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mt: 4, mb: 1 }}>Mission</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Make it effortless to find and book a stay that actually matches how you want to travel —
            whether that's a city hotel for a work trip or a mountain chalet for a family reunion.
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mt: 4, mb: 1 }}>Vision</Typography>
          <Typography color="text.secondary">
            A world where every traveler can discover a place that feels made for them, backed by honest
            reviews and a booking process that respects their time.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 420, borderRadius: 4, backgroundImage: `url(${IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </Grid>
      </Grid>
    </Container>
  );
}
