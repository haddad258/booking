import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { apiErrorMessage } from '../services/api';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setLoading(true);
    setServerError('');
    try {
      await login(values.email, values.password);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setServerError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('auth.loginCta')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('auth.loginSubtitle')}
      </Typography>

      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          fullWidth
          label={t('auth.email')}
          margin="normal"
          {...register('email', { required: true })}
          error={!!errors.email}
        />
        <TextField
          fullWidth
          type="password"
          label={t('auth.password')}
          margin="normal"
          {...register('password', { required: true })}
          error={!!errors.password}
        />
        <Box sx={{ textAlign: 'right', mt: 0.5, mb: 2 }}>
          <Link component={RouterLink} to="/forgot-password" variant="body2">
            {t('auth.forgotPassword')}
          </Link>
        </Box>
        <Button type="submit" fullWidth variant="contained" color="secondary" size="large" disabled={loading}>
          {t('auth.login')}
        </Button>
      </Box>
    </Box>
  );
}
