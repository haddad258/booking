import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Grid, TextField, Button, MenuItem, ToggleButtonGroup, ToggleButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchRounded';
import { useTranslation } from 'react-i18next';

export default function SearchBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [type, setType] = useState('hotel');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('city', destination);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/${type === 'hotel' ? 'hotels' : 'chalets'}?${params.toString()}`);
  };

  return (
    <Paper
      elevation={0}
      className="glass"
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 24px 60px -20px rgba(15,23,42,0.35)',
        maxWidth: 960,
        mx: 'auto',
      }}
    >
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={(e, v) => v && setType(v)}
        size="small"
        sx={{ mb: 2, bgcolor: 'background.paper', borderRadius: 999, p: 0.5, gap: 0.5 }}
      >
        <ToggleButton value="hotel" sx={{ borderRadius: 999, px: 2.5, border: 'none', fontWeight: 600, '&.Mui-selected': { backgroundImage: (t) => t.palette.mode === 'light' ? 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)' : undefined, color: '#fff' } }}>
          {t('nav.hotels')}
        </ToggleButton>
        <ToggleButton value="chalet" sx={{ borderRadius: 999, px: 2.5, border: 'none', fontWeight: 600, '&.Mui-selected': { backgroundImage: (t) => t.palette.mode === 'light' ? 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)' : undefined, color: '#fff' } }}>
          {t('nav.chalets')}
        </ToggleButton>
      </ToggleButtonGroup>

      <Grid container spacing={1.5} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            placeholder={t('home.searchDestination')}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={6} sm={2.5}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label={t('home.searchCheckIn')}
            InputLabelProps={{ shrink: true }}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={6} sm={2.5}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label={t('home.searchCheckOut')}
            InputLabelProps={{ shrink: true }}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={8} sm={1.5}>
          <TextField
            select
            fullWidth
            size="small"
            label={t('home.searchGuests')}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={4} sm={1.5}>
          <Button fullWidth variant="contained" color="secondary" size="large" startIcon={<SearchIcon />} onClick={handleSearch} sx={{ height: 40 }}>
            {t('home.searchCta')}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
