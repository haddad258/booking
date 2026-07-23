import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, Stack, TextField, Button, Divider, IconButton } from '@mui/material';
import CottageIcon from '@mui/icons-material/CottageRounded';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: '#fff', mt: 8, pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CottageIcon />
              <Typography variant="h6" fontWeight={700}>{t('app.name')}</Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              {t('home.heroSubtitle')}
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}><FacebookIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}><InstagramIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}><TwitterIcon fontSize="small" /></IconButton>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>{t('footer.company')}</Typography>
            <Stack spacing={1}>
              <Typography component={RouterLink} to="/about" variant="body2" sx={{ opacity: 0.8 }}>{t('nav.about')}</Typography>
              <Typography component={RouterLink} to="/blog" variant="body2" sx={{ opacity: 0.8 }}>{t('nav.blog')}</Typography>
              <Typography component={RouterLink} to="/contact" variant="body2" sx={{ opacity: 0.8 }}>{t('nav.contact')}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>{t('footer.support')}</Typography>
            <Stack spacing={1}>
              <Typography component={RouterLink} to="/hotels" variant="body2" sx={{ opacity: 0.8 }}>{t('nav.hotels')}</Typography>
              <Typography component={RouterLink} to="/chalets" variant="body2" sx={{ opacity: 0.8 }}>{t('nav.chalets')}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>{t('home.newsletterTitle')}</Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="you@email.com"
                sx={{ bgcolor: '#fff', borderRadius: 999, '& fieldset': { border: 'none' } }}
              />
              <Button variant="contained" color="secondary">{t('home.newsletterCta')}</Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', my: 3 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography component={RouterLink} to="/privacy" variant="caption" sx={{ opacity: 0.7 }}>{t('footer.privacy')}</Typography>
            <Typography component={RouterLink} to="/terms" variant="caption" sx={{ opacity: 0.7 }}>{t('footer.terms')}</Typography>
            <Typography component={RouterLink} to="/cookies" variant="caption" sx={{ opacity: 0.7 }}>{t('footer.cookies')}</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
