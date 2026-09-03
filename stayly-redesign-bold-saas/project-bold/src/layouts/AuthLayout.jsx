import { Outlet, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AuthLayout() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas dark:bg-brand-950 p-4">
      <div className="orb animate-drift -left-24 top-10 h-96 w-96 bg-brand-400" />
      <div className="orb animate-drift bottom-0 right-0 h-96 w-96 bg-gold-300" style={{ animationDelay: '3s' }} />
      <div className="relative w-full max-w-md rounded-[28px] border border-brand-500/10 dark:border-white/10 bg-white/90 dark:bg-brand-900/90 backdrop-blur-xl p-8 shadow-[0_30px_80px_-24px_rgba(109,69,232,0.35)] sm:p-10">
        <RouterLink to="/" className="mb-8 flex items-center gap-2.5">
          <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl shadow-md shadow-brand-500/30">
            <span className="font-display text-sm font-extrabold text-white">S</span>
          </span>
          <span className="font-display text-xl font-bold text-ink dark:text-white">{t('app.name')}</span>
        </RouterLink>
        <Outlet />
      </div>
    </div>
  );
}
