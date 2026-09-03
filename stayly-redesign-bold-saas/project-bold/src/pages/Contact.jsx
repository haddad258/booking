import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input, Textarea } from '../components/ui/Input';
import Button from '../components/ui/Button';

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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="font-display mb-2 text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">{t('contact.title')}</h1>
      <p className="mb-8 text-ink/60 dark:text-white/60">{t('contact.subtitle')}</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-3xl border border-brand-500/10 dark:border-white/10 bg-white dark:bg-brand-900 p-6">
          {sent && <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{t('contact.sent')}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label={t('contact.name')} error={!!errors.name} {...register('name', { required: true })} />
            <Input label={t('contact.email')} error={!!errors.email} {...register('email', { required: true })} />
            <Textarea rows={4} label={t('contact.message')} error={!!errors.message} {...register('message', { required: true })} />
            <Button type="submit" size="lg">{t('contact.send')}</Button>
          </form>
        </div>
        <div className="lg:col-span-2 overflow-hidden rounded-3xl border border-brand-500/10 dark:border-white/10">
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=Paris&t=&z=11&ie=UTF8&iwloc=&output=embed"
            className="h-full min-h-64 w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
