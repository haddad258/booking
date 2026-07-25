import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Grid, Typography, TextField, Button, Box, Alert, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = () => {
    // No dedicated contact-message backend endpoint exists yet; this simply
    // confirms receipt client-side. Wire up to a real endpoint when available.
    setSent(true);
    reset();
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>{t('contact.title')}</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>{t('contact.subtitle')}</Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            {sent && <Alert severity="success" sx={{ mb: 2 }}>{t('contact.sent')}</Alert>}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField fullWidth label={t('contact.name')} margin="normal" {...register('name', { required: true })} error={!!errors.name} />
              <TextField fullWidth label={t('contact.email')} margin="normal" {...register('email', { required: true })} error={!!errors.email} />
              <TextField fullWidth multiline rows={4} label={t('contact.message')} margin="normal" {...register('message', { required: true })} error={!!errors.message} />
              <Button type="submit" variant="contained" color="secondary" size="large" sx={{ mt: 2 }}>
                {t('contact.send')}
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            component="iframe"
            title="map"
            src="https://maps.google.com/maps?q=Paris&t=&z=11&ie=UTF8&iwloc=&output=embed"
            sx={{ width: '100%', height: '100%', minHeight: 260, border: 0, borderRadius: 3 }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
