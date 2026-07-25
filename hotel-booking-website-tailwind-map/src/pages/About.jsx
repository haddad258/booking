import { useTranslation } from 'react-i18next';

const IMAGE = 'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=1000&q=80&auto=format&fit=crop';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display mb-4 text-3xl font-semibold text-ink sm:text-4xl">Our story</h1>
          <p className="mb-2 text-ink/70">
            {t('app.name')} started with a simple idea: booking a beautiful place to stay shouldn't feel
            like a chore. We hand-pick every hotel and chalet on our platform, working directly with
            owners who care as much about the guest experience as we do.
          </p>
          <h2 className="font-display mb-1 mt-6 text-xl font-semibold text-ink">Mission</h2>
          <p className="mb-2 text-ink/70">
            Make it effortless to find and book a stay that actually matches how you want to travel —
            whether that's a city hotel for a work trip or a mountain chalet for a family reunion.
          </p>
          <h2 className="font-display mb-1 mt-6 text-xl font-semibold text-ink">Vision</h2>
          <p className="text-ink/70">
            A world where every traveler can discover a place that feels made for them, backed by honest
            reviews and a booking process that respects their time.
          </p>
        </div>
        <div className="h-80 overflow-hidden rounded-3xl sm:h-[420px]">
          <img src={IMAGE} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
