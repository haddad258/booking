import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../services/auth.service';
import { apiErrorMessage } from '../services/api';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';

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
    <div>
      <h1 className="font-display mb-6 text-2xl font-semibold text-ink dark:text-white">{t('auth.resetPassword')}</h1>
      {!token && <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">Missing or invalid reset link.</div>}
      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="password"
          label="New password"
          error={!!errors.password}
          helperText={errors.password && 'At least 8 characters'}
          {...register('password', { required: true, minLength: 8 })}
        />
        <Button type="submit" fullWidth size="lg" disabled={loading || !token}>{t('auth.resetPassword')}</Button>
      </form>
    </div>
  );
}
