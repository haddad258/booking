import { useState, useEffect } from 'react';

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop';

/**
 * A single, consistent "image frame" used everywhere in the app.
 *
 * Problem this solves: source photos come in wildly different sizes and
 * aspect ratios (e.g. a 1200×1600 portrait next to a 1600×900 landscape),
 * but every place we show one — property cards, galleries, map popups,
 * blog thumbnails — needs a fixed, predictable frame that never distorts
 * the image and never shifts the surrounding layout while loading.
 *
 * How it works:
 *   - The outer frame reserves its space via a CSS `aspect-ratio` (through
 *     Tailwind's `aspect-[W/H]` utility), so the layout never jumps once
 *     the image arrives — this works at *any* container width, unlike a
 *     fixed pixel height, so it stays correct from a small phone up to a
 *     wide desktop card.
 *   - `object-cover` (default) fills that frame completely regardless of
 *     the source image's own ratio, cropping instead of stretching.
 *     `fit="contain"` is available for cases where cropping would be
 *     wrong (e.g. a logo).
 *   - A skeleton pulse fills the frame until the image has actually
 *     decoded, then it fades in — no blank flash, no layout pop.
 *   - If the image URL 404s or otherwise fails, it swaps to a fallback
 *     image instead of showing a broken-image icon.
 *   - Lazy-loaded by default (`loading="lazy"`); pass `eager` for
 *     above-the-fold images (hero/cover photos) so they aren't delayed.
 *
 * @param {string} src
 * @param {string} alt
 * @param {string} frameClassName - sizing classes for the outer frame: either
 *   an aspect-ratio utility (e.g. "aspect-[4/3]", "aspect-video") for frames
 *   that should scale proportionally with width, or a height utility (e.g.
 *   "h-full") for frames that must fill a fixed-height row (e.g. an
 *   equal-height gallery grid) — both are valid "well-defined containers",
 *   just driven by different constraints depending on the layout.
 * @param {'cover'|'contain'} fit
 * @param {boolean} eager - load immediately instead of lazily (use for above-the-fold images)
 * @param {string} className - extra classes on the outer frame (rounded corners, etc.)
 * @param {string} imgClassName - extra classes on the <img> itself (e.g. hover scale)
 * @param {string} fallback - override the default fallback image
 */
export default function ResponsiveImage({
  src,
  alt = '',
  frameClassName = 'aspect-[4/3]',
  fit = 'cover',
  eager = false,
  className = '',
  imgClassName = '',
  fallback = DEFAULT_FALLBACK,
}) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  // Reset the loading state if the image source changes underneath us
  // (e.g. swapping between gallery photos), otherwise a stale "loaded"
  // flag would skip the skeleton/fade-in for the new image.
  useEffect(() => {
    setStatus('loading');
  }, [src]);

  const resolvedSrc = status === 'error' || !src ? fallback : src;

  return (
    <div className={`relative w-full overflow-hidden bg-brand-500/8 dark:bg-white/5 ${frameClassName} ${className}`}>
      {status !== 'loaded' && (
        <div className="absolute inset-0 animate-pulse bg-brand-500/8 dark:bg-white/5" aria-hidden="true" />
      )}
      <img
        src={resolvedSrc}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={[
          'h-full w-full',
          fit === 'cover' ? 'object-cover' : 'object-contain',
          'transition duration-500',
          status === 'loaded' ? 'opacity-100' : 'opacity-0',
          imgClassName,
        ].join(' ')}
      />
    </div>
  );
}
