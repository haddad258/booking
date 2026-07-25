import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExploreRounded';
import { useTranslation } from 'react-i18next';
import { tokens } from '../styles/theme';

export default function AuthLayout() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        backgroundImage: 'radial-gradient(circle at 85% 8%, rgba(79,70,229,0.14), transparent 45%), radial-gradient(circle at 10% 90%, rgba(6,182,212,0.12), transparent 40%)',
        p: 2,
      }}
    >
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 440, p: { xs: 3, sm: 5 }, border: '1px solid', borderColor: 'divider', boxShadow: '0 24px 60px -24px rgba(15,23,42,0.18)' }}>
        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
          <Box sx={{ width: 32, height: 32, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: tokens.gradient }}>
            <TravelExploreIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Typography variant="h6" fontWeight={800}>{t('app.name')}</Typography>
        </Box>
        <Outlet />
      </Paper>
    </Box>
  );
}
