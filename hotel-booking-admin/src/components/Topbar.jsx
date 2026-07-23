import { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Box, Avatar, Menu, MenuItem, Typography, Tooltip, Divider,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/MenuRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeModeContext';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
];

export default function Topbar({ onMenuClick }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();

  const [langAnchor, setLangAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const initials = user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() : '';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="inherit" sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ gap: 1 }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ flex: 1 }} />

        <Tooltip title="Language">
          <IconButton onClick={(e) => setLangAnchor(e.currentTarget)}>
            <LanguageIcon fontSize="small" />
          </IconButton>
        </Tooltip>
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

        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
          <IconButton onClick={toggleMode}>
            {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ ml: 0.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.8rem', color: '#1B2430' }}>
            {initials}
          </Avatar>
        </IconButton>
        <Menu anchorEl={profileAnchor} open={!!profileAnchor} onClose={() => setProfileAnchor(null)}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" fontWeight={700}>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> {t('nav.logout')}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
