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
  const [createdUsername, setCreatedUsername] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setLoading(true);
    setServerError('');
    try {
      const newUser = await registerCustomer(values);
      // The username is system-generated (e.g. "john.doe") — surface it
      // immediately rather than silently redirecting, since it's the only
      // way the user finds out what to log in with later.
      setCreatedUsername(newUser.username);
    } catch (err) {
      setServerError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (createdUsername) {
    return (
      <div className="text-center">
        <h1 className="font-display mb-4 text-2xl font-extrabold text-ink dark:text-white">{t('nav.register')} 🎉</h1>
        <div className="mx-auto mb-6 max-w-xs rounded-2xl bg-gold-50 dark:bg-gold-500/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-700 dark:text-gold-300">{t('auth.generatedUsername')}</p>
          <p className="font-mono text-lg font-bold text-ink dark:text-white">{createdUsername}</p>
          <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{t('auth.generatedUsernameHint')}</p>
        </div>
        <Button onClick={() => navigate('/')}>Continue</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-extrabold text-ink dark:text-white">{t('auth.register')}</h1>
      {serverError && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>}
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
      <p className="mt-6 text-center text-sm text-ink/60 dark:text-white/60">
        {t('auth.haveAccount')} <RouterLink to="/login" className="font-semibold text-brand-600 dark:text-gold-300 hover:underline">{t('nav.login')}</RouterLink>
      </p>
    </div>
  );
}
