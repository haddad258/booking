import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import CottageIcon from '@mui/icons-material/CottageRounded';
import { useTranslation } from 'react-i18next';

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
        backgroundImage: 'radial-gradient(circle at 80% 10%, rgba(232,147,91,0.14), transparent 45%)',
        p: 2,
      }}
    >
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 440, p: { xs: 3, sm: 5 }, border: '1px solid', borderColor: 'divider' }}>
        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
          <CottageIcon color="primary" />
          <Typography variant="h6" fontWeight={700} color="primary.main">{t('app.name')}</Typography>
        </Box>
        <Outlet />
      </Paper>
    </Box>
  );
}
