import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <Typography variant="h2" fontWeight={700} color="secondary.main">404</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>This page doesn't exist.</Typography>
      <Button component={Link} to="/" variant="contained" color="secondary">Back home</Button>
    </Container>
  );
}
