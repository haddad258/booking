import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { apiErrorMessage } from '../services/api';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';

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
    <div>
      <h1 className="font-display mb-6 text-2xl font-semibold text-ink">{t('auth.register')}</h1>
      {serverError && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label={t('auth.firstName')} error={!!errors.firstName} {...register('firstName', { required: true })} />
          <Input label={t('auth.lastName')} error={!!errors.lastName} {...register('lastName', { required: true })} />
        </div>
        <Input label={t('auth.email')} error={!!errors.email} {...register('email', { required: true })} />
        <Input label={t('auth.phone')} {...register('phone')} />
        <Input
          type="password"
          label={t('auth.password')}
          error={!!errors.password}
          helperText={errors.password && 'At least 8 characters, including a number'}
          {...register('password', { required: true, minLength: 8 })}
        />
        <Button type="submit" fullWidth size="lg" disabled={loading}>{t('nav.register')}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        {t('auth.haveAccount')} <RouterLink to="/login" className="font-semibold text-brand-700 hover:underline">{t('nav.login')}</RouterLink>
      </p>
    </div>
  );
}
