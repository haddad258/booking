import { useState } from 'react';
import { useForm } from 'react-hook-form';
import customerService from '../services/customer.service';
import { apiErrorMessage } from '../services/api';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function AccountPassword() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setSaving(true); setError(''); setSuccess(false);
    try {
      await customerService.changePassword(values.currentPassword, values.newPassword);
      setSuccess(true);
      reset();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand-800/10 bg-white p-6">
      <h2 className="font-display mb-4 text-lg font-semibold text-ink">Change password</h2>
      {success && <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Password changed successfully</div>}
      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input type="password" label="Current password" error={!!errors.currentPassword} {...register('currentPassword', { required: true })} />
        <Input
          type="password"
          label="New password"
          error={!!errors.newPassword}
          helperText={errors.newPassword && 'At least 8 characters, including a number'}
          {...register('newPassword', { required: true, minLength: 8 })}
        />
        <Button type="submit" disabled={saving}>Update password</Button>
      </form>
    </div>
  );
}
