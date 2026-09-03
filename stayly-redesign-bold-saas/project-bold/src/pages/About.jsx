import { useTranslation } from 'react-i18next';
import ResponsiveImage from '../components/ui/ResponsiveImage';

const IMAGE = 'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=1000&q=80&auto=format&fit=crop';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display mb-4 text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">Our story</h1>
          <p className="mb-2 text-ink/70 dark:text-white/70">
            {t('app.name')} started with a simple idea: booking a beautiful place to stay shouldn't feel
            like a chore. We hand-pick every hotel and chalet on our platform, working directly with
            owners who care as much about the guest experience as we do.
          </p>
          <h2 className="eyebrow mb-2 mt-8 text-gold-600 dark:text-gold-400">Mission</h2>
          <p className="mb-2 text-ink/70 dark:text-white/70">
            Make it effortless to find and book a stay that actually matches how you want to travel —
            whether that's a city hotel for a work trip or a mountain chalet for a family reunion.
          </p>
          <h2 className="eyebrow mb-2 mt-8 text-gold-600 dark:text-gold-400">Vision</h2>
          <p className="text-ink/70 dark:text-white/70">
            A world where every traveler can discover a place that feels made for them, backed by honest
            reviews and a booking process that respects their time.
          </p>
        </div>
        <ResponsiveImage src={IMAGE} alt="" frameClassName="h-80 sm:h-[420px]" className="rounded-[28px]" />
      </div>
    </div>
  );
}
