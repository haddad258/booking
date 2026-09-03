import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { apiErrorMessage } from '../services/api';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';

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
      await login(values.username, values.password);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setServerError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-extrabold text-ink dark:text-white">{t('auth.login')}</h1>
      {serverError && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label={t('auth.username')} error={!!errors.username} {...register('username', { required: true })} />
        <Input type="password" label={t('auth.password')} error={!!errors.password} {...register('password', { required: true })} />
        <div className="text-right">
          <RouterLink to="/forgot-password" className="text-sm font-semibold text-brand-600 dark:text-gold-300 hover:underline">{t('auth.forgotPassword')}</RouterLink>
        </div>
        <Button type="submit" fullWidth size="lg" disabled={loading}>{t('auth.login')}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60 dark:text-white/60">
        {t('auth.noAccount')} <RouterLink to="/register" className="font-semibold text-brand-600 dark:text-gold-300 hover:underline">{t('nav.register')}</RouterLink>
      </p>
    </div>
  );
}
