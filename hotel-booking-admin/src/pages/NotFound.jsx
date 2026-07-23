import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
      <Typography variant="h2" fontWeight={700} color="secondary.main">404</Typography>
      <Typography color="text.secondary">This page doesn't exist.</Typography>
      <Button component={Link} to="/" variant="contained" color="secondary">Back to dashboard</Button>
    </Box>
  );
}
