import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Typography, Button, IconButton, Menu, MenuItem, Avatar, Divider, Drawer, List, ListItemButton, ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/MenuRounded';
import LanguageIcon from '@mui/icons-material/Language';
import CottageIcon from '@mui/icons-material/CottageRounded';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

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

  const initials = user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() : '';

  const handleLogout = async () => {
    await logout();
    setUserAnchor(null);
    navigate('/');
  };

  return (
    <AppBar position="sticky" color="transparent" elevation={0} className="glass" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ py: 1 }}>
        <IconButton edge="start" sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: 1 }} onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </IconButton>

        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }}>
          <CottageIcon color="primary" />
          <Typography variant="h6" fontWeight={700} color="primary.main">{t('app.name')}</Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, flex: 1 }}>
          {NAV_LINKS.map((link) => (
            <Button key={link.to} component={RouterLink} to={link.to} color="inherit" sx={{ fontWeight: 500 }}>
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
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: '0.85rem' }}>{initials}</Avatar>
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
          <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
            <Button component={RouterLink} to="/login" color="inherit">{t('nav.login')}</Button>
            <Button component={RouterLink} to="/register" variant="contained" color="secondary">{t('nav.register')}</Button>
          </Box>
        )}
      </Toolbar>

      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <List>
            {NAV_LINKS.map((link) => (
              <ListItemButton key={link.to} component={RouterLink} to={link.to} onClick={() => setMobileOpen(false)}>
                <ListItemText primary={t(link.label)} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
