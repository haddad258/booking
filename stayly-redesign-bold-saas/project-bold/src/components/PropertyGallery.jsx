import { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ResponsiveImage from './ui/ResponsiveImage';
import { resolveImageUrl } from '../lib/media';

// Fixed tile size at each breakpoint — deliberately NOT fluid/percentage
// based. The box never changes shape because of the source photo's own
// dimensions (a 1200×1600 portrait and a 1600×900 landscape both get
// cropped by object-cover to fit this exact box); it only changes across
// the three breakpoints below, and even then it's still a fixed value at
// each one, not a range.
const TILE_SIZE = 'h-[200px] w-[260px] sm:h-[240px] sm:w-[320px] lg:h-[280px] lg:w-[380px]';

/**
 * Horizontal-scrolling image gallery for the hotel/chalet detail pages.
 *
 * Every tile has a fixed width AND height (see TILE_SIZE) — set once per
 * breakpoint, never derived from the image's own size — so the strip
 * never reflows or jumps regardless of what photos are in it. Images are
 * fit inside each fixed tile with `object-cover` (via ResponsiveImage),
 * so they're cropped to match, never stretched or distorted.
 *
 * Scrolling is horizontal only: the strip uses `overflow-x-auto` with
 * `overflow-y-hidden` and `flex-nowrap` (implicit — no wrap class is
 * applied), so there is no vertical scrollbar for this section under any
 * circumstance. Scroll-snap keeps tiles aligned as the user swipes/drags;
 * chevron buttons give desktop users a click target too (hidden on touch
 * devices where swiping is the natural gesture).
 */
export default function PropertyGallery({ images = [], name = '' }) {
  const scrollerRef = useRef(null);

  const scrollByTile = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const tile = el.querySelector('[data-gallery-tile]');
    const step = tile ? tile.offsetWidth + 12 : 320; // tile width + gap
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  const items = images.length > 0 ? images : [null]; // always render at least one tile (placeholder) so the section never collapses

  return (
    <div className="relative mb-10">
      <div
        ref={scrollerRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-1"
      >
        {items.map((img, idx) => (
          <div
            key={img?.id ?? idx}
            data-gallery-tile
            className={`${TILE_SIZE} shrink-0 snap-start`}
          >
            <ResponsiveImage
              src={resolveImageUrl(img?.url)}
              alt={idx === 0 ? name : `${name} — photo ${idx + 1}`}
              frameClassName="h-full"
              className="rounded-3xl"
              eager={idx === 0}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollByTile(-1)}
            aria-label="Scroll gallery left"
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-ink shadow-lg backdrop-blur transition hover:bg-white sm:flex dark:bg-brand-800/90 dark:text-white dark:hover:bg-brand-800"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByTile(1)}
            aria-label="Scroll gallery right"
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-ink shadow-lg backdrop-blur transition hover:bg-white sm:flex dark:bg-brand-800/90 dark:text-white dark:hover:bg-brand-800"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
