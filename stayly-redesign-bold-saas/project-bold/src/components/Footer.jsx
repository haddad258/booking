import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from './ui/Button';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative mt-24 overflow-hidden bg-brand-950 text-white">
      <div className="orb -left-20 -top-20 h-72 w-72 bg-brand-500" />
      <div className="orb -bottom-24 right-0 h-80 w-80 bg-gold-400" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:grid-cols-12">
          <div className="col-span-2 sm:col-span-4 md:col-span-5">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="brand-gradient flex h-8 w-8 items-center justify-center rounded-xl shadow-md shadow-brand-500/40">
                <span className="font-display text-xs font-extrabold text-white">S</span>
              </span>
              <span className="font-display text-xl font-bold">{t('app.name')}</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">{t('home.heroSubtitle')}</p>
          </div>

          <div className="md:col-span-2">
            <h4 className="eyebrow mb-4 text-white/45">{t('footer.company')}</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><RouterLink to="/about" className="hover:text-gold-300">{t('nav.about')}</RouterLink></li>
              <li><RouterLink to="/blog" className="hover:text-gold-300">{t('nav.blog')}</RouterLink></li>
              <li><RouterLink to="/contact" className="hover:text-gold-300">{t('nav.contact')}</RouterLink></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="eyebrow mb-4 text-white/45">{t('footer.support')}</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><RouterLink to="/hotels" className="hover:text-gold-300">{t('nav.hotels')}</RouterLink></li>
              <li><RouterLink to="/chalets" className="hover:text-gold-300">{t('nav.chalets')}</RouterLink></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-4 md:col-span-3">
            <h4 className="eyebrow mb-4 text-white/45">{t('home.newsletterTitle')}</h4>
            <div className="flex gap-2">
              <input
                placeholder="you@email.com"
                className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-gold-400"
              />
              <Button variant="primary" size="sm" className="shrink-0">{t('home.newsletterCta')}</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}</p>
          <div className="flex gap-5 text-xs text-white/50">
            <RouterLink to="/privacy" className="hover:text-gold-300">{t('footer.privacy')}</RouterLink>
            <RouterLink to="/terms" className="hover:text-gold-300">{t('footer.terms')}</RouterLink>
            <RouterLink to="/cookies" className="hover:text-gold-300">{t('footer.cookies')}</RouterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
