import { Outlet, Link as RouterLink } from 'react-router-dom';
import { MapIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function AuthLayout() {
  const { t } = useTranslation();

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-canvas p-4"
      style={{ backgroundImage: 'radial-gradient(circle at 85% 8%, rgba(28,53,104,0.14), transparent 45%), radial-gradient(circle at 10% 90%, rgba(255,100,82,0.14), transparent 40%)' }}
    >
      <div className="w-full max-w-md rounded-2xl border border-brand-800/10 bg-white p-8 shadow-[0_24px_60px_-24px_rgba(13,19,33,0.28)] sm:p-10">
        <RouterLink to="/" className="mb-8 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800">
            <MapIcon className="h-4.5 w-4.5 text-gold-300" />
          </span>
          <span className="font-display text-xl font-semibold text-ink">{t('app.name')}</span>
        </RouterLink>
        <Outlet />
      </div>
    </div>
  );
}
