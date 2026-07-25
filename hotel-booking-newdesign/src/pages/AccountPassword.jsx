import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Paper, Typography, TextField, Button, Alert } from '@mui/material';
import customerService from '../services/customer.service';
import { apiErrorMessage } from '../services/api';

export default function AccountPassword() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setSaving(true);
    setError('');
    setSuccess(false);
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
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Change password</Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Password changed successfully</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          type="password"
          label="Current password"
          margin="normal"
          {...register('currentPassword', { required: true })}
          error={!!errors.currentPassword}
        />
        <TextField
          fullWidth
          type="password"
          label="New password"
          margin="normal"
          {...register('newPassword', { required: true, minLength: 8 })}
          error={!!errors.newPassword}
          helperText={errors.newPassword && 'At least 8 characters, including a number'}
        />
        <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2 }} disabled={saving}>
          Update password
        </Button>
      </form>
    </Paper>
  );
}
