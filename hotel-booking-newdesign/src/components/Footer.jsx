import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, Stack, TextField, Button, Divider, IconButton } from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExploreRounded';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useTranslation } from 'react-i18next';
import { tokens } from '../styles/theme';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Box component="footer" sx={{ bgcolor: '#0B1120', color: '#fff', mt: 8, pt: 7, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: tokens.gradient }}>
                <TravelExploreIcon sx={{ color: '#fff', fontSize: 18 }} />
              </Box>
              <Typography variant="h6" fontWeight={800}>{t('app.name')}</Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.7, mb: 2, maxWidth: 320 }}>
              {t('home.heroSubtitle')}
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}><FacebookIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}><InstagramIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}><TwitterIcon fontSize="small" /></IconButton>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, opacity: 0.9 }}>{t('footer.company')}</Typography>
            <Stack spacing={1}>
              <Typography component={RouterLink} to="/about" variant="body2" sx={{ opacity: 0.7 }}>{t('nav.about')}</Typography>
              <Typography component={RouterLink} to="/blog" variant="body2" sx={{ opacity: 0.7 }}>{t('nav.blog')}</Typography>
              <Typography component={RouterLink} to="/contact" variant="body2" sx={{ opacity: 0.7 }}>{t('nav.contact')}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, opacity: 0.9 }}>{t('footer.support')}</Typography>
            <Stack spacing={1}>
              <Typography component={RouterLink} to="/hotels" variant="body2" sx={{ opacity: 0.7 }}>{t('nav.hotels')}</Typography>
              <Typography component={RouterLink} to="/chalets" variant="body2" sx={{ opacity: 0.7 }}>{t('nav.chalets')}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, opacity: 0.9 }}>{t('home.newsletterTitle')}</Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="you@email.com"
                sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 999, input: { color: '#fff' }, '& fieldset': { border: '1px solid rgba(255,255,255,0.15)' } }}
              />
              <Button variant="contained" color="secondary" sx={{ flexShrink: 0 }}>{t('home.newsletterCta')}</Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1.5}>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            © {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
          </Typography>
          <Stack direction="row" spacing={2.5}>
            <Typography component={RouterLink} to="/privacy" variant="caption" sx={{ opacity: 0.6 }}>{t('footer.privacy')}</Typography>
            <Typography component={RouterLink} to="/terms" variant="caption" sx={{ opacity: 0.6 }}>{t('footer.terms')}</Typography>
            <Typography component={RouterLink} to="/cookies" variant="caption" sx={{ opacity: 0.6 }}>{t('footer.cookies')}</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
