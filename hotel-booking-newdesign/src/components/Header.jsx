import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Typography, Button, IconButton, Menu, MenuItem, Avatar, Divider, Drawer, List,
  ListItemButton, ListItemText, Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/MenuRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import LanguageIcon from '@mui/icons-material/Language';
import TravelExploreIcon from '@mui/icons-material/TravelExploreRounded';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { tokens } from '../styles/theme';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
];

const NAV_LINKS = [
  { to: '/hotels', label: 'nav.hotels' },
  { to: '/chalets', label: 'nav.chalets' },
  { to: '/blog', label: 'nav.blog' },
  { to: '/about', label: 'nav.about' },
  { to: '/contact', label: 'nav.contact' },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [langAnchor, setLangAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const initials = user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() : '';

  const handleLogout = async () => {
    await logout();
    setUserAnchor(null);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      className="glass"
      sx={{
        borderBottom: '1px solid',
        borderColor: scrolled ? 'divider' : 'transparent',
        boxShadow: scrolled ? '0 4px 24px -8px rgba(15,23,42,0.12)' : 'none',
        transition: 'box-shadow 200ms ease, border-color 200ms ease',
      }}
    >
      <Toolbar sx={{ py: 1.25, maxWidth: 1280, width: '100%', mx: 'auto' }}>
        <IconButton edge="start" sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: 1 }} onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </IconButton>

        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }}>
          <Box
            sx={{
              width: 34, height: 34, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundImage: tokens.gradient,
            }}
          >
            <TravelExploreIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>{t('app.name')}</Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flex: 1 }}>
          {NAV_LINKS.map((link) => (
            <Button key={link.to} component={RouterLink} to={link.to} color="inherit" sx={{ fontWeight: 600, borderRadius: 999, px: 2 }}>
              {t(link.label)}
            </Button>
          ))}
        </Box>

        <Box sx={{ flex: { xs: 1, md: 0 } }} />

        <IconButton onClick={(e) => setLangAnchor(e.currentTarget)}>
          <LanguageIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={langAnchor} open={!!langAnchor} onClose={() => setLangAnchor(null)}>
          {LANGUAGES.map((lang) => (
            <MenuItem
              key={lang.code}
              selected={i18n.language === lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                document.dir = lang.code === 'ar' ? 'rtl' : 'ltr';
                setLangAnchor(null);
              }}
            >
              {lang.label}
            </MenuItem>
          ))}
        </Menu>

        {user ? (
          <>
            <IconButton onClick={(e) => setUserAnchor(e.currentTarget)} sx={{ ml: 1 }}>
              <Avatar sx={{ width: 34, height: 34, fontSize: '0.85rem', backgroundImage: tokens.gradient }}>{initials}</Avatar>
            </IconButton>
            <Menu anchorEl={userAnchor} open={!!userAnchor} onClose={() => setUserAnchor(null)}>
              <MenuItem component={RouterLink} to="/account" onClick={() => setUserAnchor(null)}>{t('nav.account')}</MenuItem>
              <MenuItem component={RouterLink} to="/account/bookings" onClick={() => setUserAnchor(null)}>{t('nav.myBookings')}</MenuItem>
              <MenuItem component={RouterLink} to="/account/favorites" onClick={() => setUserAnchor(null)}>{t('nav.favorites')}</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>{t('nav.logout')}</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, ml: 1 }}>
            <Button component={RouterLink} to="/login" color="inherit" sx={{ fontWeight: 600 }}>{t('nav.login')}</Button>
            <Button component={RouterLink} to="/register" variant="contained" color="secondary">{t('nav.register')}</Button>
          </Box>
        )}
      </Toolbar>

      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 280 } }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={800}>{t('app.name')}</Typography>
          <IconButton onClick={() => setMobileOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <List sx={{ px: 1 }}>
          {NAV_LINKS.map((link) => (
            <ListItemButton key={link.to} component={RouterLink} to={link.to} onClick={() => setMobileOpen(false)} sx={{ borderRadius: 2, mb: 0.5 }}>
              <ListItemText primary={t(link.label)} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <Stack spacing={1} sx={{ p: 2 }}>
          {user ? (
            <>
              <Button fullWidth component={RouterLink} to="/account" onClick={() => setMobileOpen(false)} variant="outlined">{t('nav.account')}</Button>
              <Button fullWidth onClick={handleLogout} color="error">{t('nav.logout')}</Button>
            </>
          ) : (
            <>
              <Button fullWidth component={RouterLink} to="/login" onClick={() => setMobileOpen(false)} variant="outlined">{t('nav.login')}</Button>
              <Button fullWidth component={RouterLink} to="/register" onClick={() => setMobileOpen(false)} variant="contained" color="secondary">{t('nav.register')}</Button>
            </>
          )}
        </Stack>
      </Drawer>
    </AppBar>
  );
}
