import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const LINKS = [
  { to: '/account', label: 'account.dashboard', exact: true },
  { to: '/account/bookings', label: 'account.bookings' },
  { to: '/favorites', label: 'account.favorites' },
  { to: '/account/profile', label: 'account.profile' },
  { to: '/account/password', label: 'account.password' },
];

export default function AccountLayout() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow mb-2 text-gold-600 dark:text-gold-400">{t('nav.account')}</p>
      <h1 className="font-display mb-8 text-3xl font-medium text-ink dark:text-white sm:text-4xl">
        {user ? `${user.first_name} ${user.last_name}` : t('account.dashboard')}
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <aside className="md:col-span-1">
          <nav className="flex gap-1 overflow-x-auto rounded-[20px] border border-ink/10 dark:border-white/10 bg-white dark:bg-brand-800 p-2 md:flex-col md:overflow-visible">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  [
                    'shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition',
                    isActive ? 'bg-brand-800 text-canvas dark:bg-gold-300 dark:text-brand-950' : 'text-ink/70 hover:bg-ink/5 dark:text-white/70 dark:hover:bg-white/10',
                  ].join(' ')
                }
              >
                {t(link.label)}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
