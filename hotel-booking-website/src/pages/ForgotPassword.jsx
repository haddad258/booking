import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import authService from '../services/auth.service';
import { apiErrorMessage } from '../services/api';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>{t('auth.resetPassword')}</Typography>
      {sent ? (
        <Alert severity="success" sx={{ mt: 2 }}>If that email exists, a reset link has been sent.</Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField fullWidth label={t('auth.email')} margin="normal" {...register('email', { required: true })} />
          <Button type="submit" fullWidth variant="contained" color="secondary" size="large" disabled={loading} sx={{ mt: 2 }}>
            Send reset link
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Link component={RouterLink} to="/login" variant="body2">Back to log in</Link>
      </Box>
    </Box>
  );
}
