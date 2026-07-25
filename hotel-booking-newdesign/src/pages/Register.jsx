import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, Link, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { apiErrorMessage } from '../services/api';

export default function Register() {
  const { t } = useTranslation();
  const { register: registerCustomer } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setLoading(true);
    setServerError('');
    try {
      await registerCustomer(values);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>{t('auth.register')}</Typography>
      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField fullWidth label={t('auth.firstName')} margin="normal" {...register('firstName', { required: true })} error={!!errors.firstName} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label={t('auth.lastName')} margin="normal" {...register('lastName', { required: true })} error={!!errors.lastName} />
          </Grid>
        </Grid>
        <TextField fullWidth label={t('auth.email')} margin="normal" {...register('email', { required: true })} error={!!errors.email} />
        <TextField fullWidth label={t('auth.phone')} margin="normal" {...register('phone')} />
        <TextField
          fullWidth
          type="password"
          label={t('auth.password')}
          margin="normal"
          {...register('password', { required: true, minLength: 8 })}
          error={!!errors.password}
          helperText={errors.password && 'At least 8 characters, including a number'}
        />
        <Button type="submit" fullWidth variant="contained" color="secondary" size="large" disabled={loading} sx={{ mt: 2 }}>
          {t('nav.register')}
        </Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
        {t('auth.haveAccount')} <Link component={RouterLink} to="/login">{t('nav.login')}</Link>
      </Typography>
    </Box>
  );
}
