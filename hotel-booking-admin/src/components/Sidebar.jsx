import { NavLink, useLocation } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DashboardIcon from '@mui/icons-material/SpaceDashboardOutlined';
import BookingIcon from '@mui/icons-material/EventNoteOutlined';
import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined';
import HotelIcon from '@mui/icons-material/ApartmentOutlined';
import ChaletIcon from '@mui/icons-material/CabinOutlined';
import AmenityIcon from '@mui/icons-material/SpaOutlined';
import CustomerIcon from '@mui/icons-material/PeopleAltOutlined';
import ReviewIcon from '@mui/icons-material/StarBorderRounded';
import ReportIcon from '@mui/icons-material/InsightsOutlined';
import AdminIcon from '@mui/icons-material/BadgeOutlined';
import RoleIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SettingsIcon from '@mui/icons-material/TuneOutlined';
import KeyIcon from '@mui/icons-material/VpnKeyRounded';
import { useAuth } from '../contexts/AuthContext';

const GROUPS = [
  {
    items: [{ to: '/', label: 'nav.dashboard', icon: DashboardIcon, exact: true }],
  },
  {
    label: 'Operations',
    items: [
      { to: '/bookings', label: 'nav.bookings', icon: BookingIcon },
      { to: '/calendar', label: 'nav.calendar', icon: CalendarIcon },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { to: '/hotels', label: 'nav.hotels', icon: HotelIcon },
      { to: '/chalets', label: 'nav.chalets', icon: ChaletIcon },
      { to: '/amenities', label: 'nav.amenities', icon: AmenityIcon },
    ],
  },
  {
    label: 'Guests',
    items: [
      { to: '/customers', label: 'nav.customers', icon: CustomerIcon },
      { to: '/reviews', label: 'nav.reviews', icon: ReviewIcon },
    ],
  },
  {
    label: 'Insights',
    items: [{ to: '/reports', label: 'nav.reports', icon: ReportIcon }],
  },
  {
    label: 'Administration',
    superAdminOnly: true,
    items: [
      { to: '/admins', label: 'nav.admins', icon: AdminIcon, superAdminOnly: true },
      { to: '/roles', label: 'nav.roles', icon: RoleIcon, superAdminOnly: true },
      { to: '/settings', label: 'nav.settings', icon: SettingsIcon },
    ],
  },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'primary.main', color: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, py: 2.5 }}>
        <KeyIcon sx={{ color: 'secondary.main' }} />
        <Typography variant="h6" sx={{ fontSize: '1.1rem', letterSpacing: '0.02em' }}>
          {t('app.name')}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <List sx={{ flex: 1, overflowY: 'auto', px: 1.25, py: 1.5 }}>
        {GROUPS.map((group, gi) => {
          if (group.superAdminOnly && !user?.is_super_admin) return null;
          const items = group.items.filter((it) => !it.superAdminOnly || user?.is_super_admin);
          if (!items.length) return null;

          return (
            <Box key={gi} sx={{ mb: 1.5 }}>
              {group.label && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    px: 1.5,
                    pt: 1,
                    pb: 0.5,
                    color: 'rgba(255,255,255,0.45)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                  }}
                >
                  {group.label}
                </Typography>
              )}
              {items.map(({ to, label, icon: Icon, exact }) => {
                const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
                return (
                  <ListItemButton
                    key={to}
                    component={NavLink}
                    to={to}
                    sx={{
                      position: 'relative',
                      borderRadius: 1,
                      mb: 0.5,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
                      bgcolor: isActive ? 'rgba(184,134,59,0.18)' : 'transparent',
                      '&:hover': { bgcolor: isActive ? 'rgba(184,134,59,0.24)' : 'rgba(255,255,255,0.06)' },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: -1,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: isActive ? 4 : 0,
                        height: 20,
                        bgcolor: 'secondary.main',
                        borderRadius: '0 4px 4px 0',
                        transition: 'width 120ms ease',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(label)}
                      primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 700 : 500 }}
                    />
                  </ListItemButton>
                );
              })}
            </Box>
          );
        })}
      </List>
    </Box>
  );
}
