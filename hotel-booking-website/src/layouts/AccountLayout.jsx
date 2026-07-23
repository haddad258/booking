import { Outlet, NavLink } from 'react-router-dom';
import { Container, Grid, Paper, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const LINKS = [
  { to: '/account', label: 'account.dashboard', exact: true },
  { to: '/account/bookings', label: 'account.bookings' },
  { to: '/account/favorites', label: 'account.favorites' },
  { to: '/account/profile', label: 'account.profile' },
  { to: '/account/password', label: 'account.password' },
];

export default function AccountLayout() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        {user ? `${user.first_name} ${user.last_name}` : t('account.dashboard')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <List>
              {LINKS.map((link) => (
                <ListItemButton
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  end={link.exact}
                  sx={{
                    '&.active': { bgcolor: 'action.selected', fontWeight: 700, borderLeft: '3px solid', borderColor: 'secondary.main' },
                  }}
                >
                  <ListItemText primary={t(link.label)} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Outlet />
        </Grid>
      </Grid>
    </Container>
  );
}
