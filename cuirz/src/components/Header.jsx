import { useEffect, useState, Fragment } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Bars3Icon, GlobeAltIcon, MapIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import useFavorites from '../hooks/useFavorites';
import Button from './ui/Button';
import Drawer from './ui/Drawer';
import ThemeToggle from './ui/ThemeToggle';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
];

const NAV_LINKS = [
  { to: '/hotels', label: 'nav.hotels' },
  { to: '/chalets', label: 'nav.chalets' },
  { to: '/blog', label: 'nav.blog' },
  { to: '/about', label: 'nav.about' },
  { to: '/contact', label: 'nav.contact' },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const initials = user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() : '';

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header
      className={[
        'glass sticky top-0 z-40 border-b transition-shadow',
        scrolled ? 'border-brand-800/10 shadow-[0_4px_24px_-8px_rgba(13,19,33,0.18)]' : 'border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-6">
        <button className="mr-1 rounded-lg p-2 hover:bg-hover md:hidden" onClick={() => setMobileOpen(true)}>
          <Bars3Icon className="h-6 w-6" />
        </button>

        <RouterLink to="/" className="mr-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800">
            <MapIcon className="h-5 w-5 text-gold-300" />
          </span>
          <span className="font-display text-2xl font-semibold text-ink">{t('app.name')}</span>
        </RouterLink>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <RouterLink
              key={link.to}
              to={link.to}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-ink/80 transition hover:bg-hover hover:text-ink"
            >
              {t(link.label)}
            </RouterLink>
          ))}
        </nav>

        <div className="flex flex-1 justify-end md:flex-none" />

        <ThemeToggle className="mr-1 hidden sm:inline-flex" />

        <RouterLink to="/favorites" className="relative rounded-lg p-2 hover:bg-hover" title="Saved properties">
          <HeartIcon className="h-5 w-5" />
          {favorites.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
              {favorites.length > 9 ? '9+' : favorites.length}
            </span>
          )}
        </RouterLink>

        <Menu as="div" className="relative">
          <MenuButton className="rounded-lg p-2 hover:bg-hover">
            <GlobeAltIcon className="h-5 w-5" />
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl border border-brand-800/10 bg-white p-1.5 shadow-xl focus:outline-none">
              {LANGUAGES.map((lang) => (
                <MenuItem key={lang.code}>
                  {({ focus }) => (
                    <button
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        document.dir = lang.code === 'ar' ? 'rtl' : 'ltr';
                      }}
                      className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm ${focus ? 'bg-hover' : ''} ${i18n.language === lang.code ? 'font-bold text-brand-700' : 'text-ink'}`}
                    >
                      {lang.label}
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Transition>
        </Menu>

        {user ? (
          <Menu as="div" className="relative ml-1">
            <MenuButton className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-500 text-sm font-bold text-ink">
              {initials}
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-brand-800/10 bg-white p-1.5 shadow-xl focus:outline-none">
                <MenuItem>
                  {({ focus }) => (
                    <RouterLink to="/account" className={`block rounded-lg px-3 py-2 text-sm ${focus ? 'bg-hover' : ''}`}>{t('nav.account')}</RouterLink>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <RouterLink to="/account/bookings" className={`block rounded-lg px-3 py-2 text-sm ${focus ? 'bg-hover' : ''}`}>{t('nav.myBookings')}</RouterLink>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <RouterLink to="/favorites" className={`block rounded-lg px-3 py-2 text-sm ${focus ? 'bg-hover' : ''}`}>{t('nav.favorites')}</RouterLink>
                  )}
                </MenuItem>
                <div className="my-1 border-t border-brand-800/10" />
                <MenuItem>
                  {({ focus }) => (
                    <button onClick={handleLogout} className={`block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 ${focus ? 'bg-red-50' : ''}`}>{t('nav.logout')}</button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        ) : (
          <div className="ml-1 hidden items-center gap-2 sm:flex">
            <Button to="/login" variant="ghost" size="md">{t('nav.login')}</Button>
            <Button to="/register" variant="primary" size="md">{t('nav.register')}</Button>
          </div>
        )}
      </div>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} side="left" title={t('app.name')}>
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <RouterLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 font-semibold text-ink hover:bg-hover"
            >
              {t(link.label)}
            </RouterLink>
          ))}
          <RouterLink
            to="/favorites"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-semibold text-ink hover:bg-hover"
          >
            <HeartIcon className="h-4 w-4" /> {t('nav.favorites')}
            {favorites.length > 0 && <span className="text-xs font-normal text-ink/50">({favorites.length})</span>}
          </RouterLink>
        </nav>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-hover px-3 py-2.5">
          <span className="text-sm font-semibold text-ink">Dark mode</span>
          <ThemeToggle />
        </div>
        <div className="mt-4 flex flex-col gap-2 border-t border-brand-800/10 pt-4">
          {user ? (
            <>
              <Button to="/account" variant="outline" fullWidth onClick={() => setMobileOpen(false)}>{t('nav.account')}</Button>
              <Button variant="danger" fullWidth onClick={handleLogout}>{t('nav.logout')}</Button>
            </>
          ) : (
            <>
              <Button to="/login" variant="outline" fullWidth onClick={() => setMobileOpen(false)}>{t('nav.login')}</Button>
              <Button to="/register" variant="primary" fullWidth onClick={() => setMobileOpen(false)}>{t('nav.register')}</Button>
            </>
          )}
        </div>
      </Drawer>
    </header>
  );
}
