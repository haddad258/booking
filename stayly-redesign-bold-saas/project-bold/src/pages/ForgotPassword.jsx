import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../services/auth.service';
import { apiErrorMessage } from '../services/api';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ username }) => {
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(username);
      setSent(true);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-extrabold text-ink dark:text-white">{t('auth.resetPassword')}</h1>
      {sent ? (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">If that username exists, a reset link has been sent to the account's email.</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <Input label={t('auth.username')} {...register('username', { required: true })} />
          <Button type="submit" fullWidth size="lg" disabled={loading}>Send reset link</Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm">
        <RouterLink to="/login" className="font-semibold text-brand-600 dark:text-gold-300 hover:underline">Back to log in</RouterLink>
      </p>
    </div>
  );
}
