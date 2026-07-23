import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import authService from '../services/auth.service';
import { apiErrorMessage } from '../services/api';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ password }) => {
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(token, password);
      navigate('/login');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('auth.resetPassword')}
      </Typography>

      {!token && <Alert severity="warning" sx={{ mt: 2 }}>Missing or invalid reset link.</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
        <TextField
          fullWidth
          type="password"
          label={t('auth.newPassword')}
          margin="normal"
          {...register('password', { required: true, minLength: 8 })}
          error={!!errors.password}
          helperText={errors.password && 'At least 8 characters'}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          size="large"
          disabled={loading || !token}
          sx={{ mt: 2 }}
        >
          {t('auth.resetPassword')}
        </Button>
      </Box>
    </Box>
  );
}
