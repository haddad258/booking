import { Outlet, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AuthLayout() {
  const { t } = useTranslation();

  return (
    <div
      className="grain flex min-h-screen items-center justify-center bg-canvas dark:bg-brand-950 p-4"
      style={{ backgroundImage: 'radial-gradient(circle at 85% 8%, rgba(74,112,64,0.12), transparent 45%), radial-gradient(circle at 10% 90%, rgba(200,123,65,0.14), transparent 40%)' }}
    >
      <div className="w-full max-w-md rounded-[28px] border border-ink/10 dark:border-white/10 bg-white dark:bg-brand-800 p-8 shadow-[0_30px_70px_-28px_rgba(33,28,21,0.25)] sm:p-10">
        <RouterLink to="/" className="mb-8 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-1.5 border-brand-700 dark:border-gold-300">
            <span className="font-display text-sm font-semibold text-brand-700 dark:text-gold-300">S</span>
          </span>
          <span className="font-display text-xl font-medium text-ink dark:text-white">{t('app.name')}</span>
        </RouterLink>
        <Outlet />
      </div>
    </div>
  );
}
