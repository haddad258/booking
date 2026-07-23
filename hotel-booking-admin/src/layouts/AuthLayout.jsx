import { Outlet } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import KeyIcon from '@mui/icons-material/VpnKeyRounded';

export default function AuthLayout() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(184,134,59,0.12), transparent 40%)',
        p: 2,
      }}
    >
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 5 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
          <KeyIcon sx={{ color: 'secondary.main' }} />
          <Typography variant="h6" fontWeight={700}>
            {t('app.name')}
          </Typography>
        </Box>
        <Outlet />
      </Paper>
    </Box>
  );
}
