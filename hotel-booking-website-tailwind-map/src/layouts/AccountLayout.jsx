import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const LINKS = [
  { to: '/account', label: 'account.dashboard', exact: true },
  { to: '/account/bookings', label: 'account.bookings' },
  { to: '/account/favorites', label: 'account.favorites' },
  { to: '/account/profile', label: 'account.profile' },
  { to: '/account/password', label: 'account.password' },
];

export default function AccountLayout() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display mb-6 text-3xl font-semibold text-ink sm:text-4xl">
        {user ? `${user.first_name} ${user.last_name}` : t('account.dashboard')}
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <aside className="md:col-span-1">
          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-brand-800/10 bg-white p-2 md:flex-col md:overflow-visible">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  [
                    'shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition',
                    isActive ? 'bg-brand-800 text-white' : 'text-ink/70 hover:bg-brand-50',
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
