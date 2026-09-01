/**
 * Skeleton placeholder matching PropertyCard's exact shape (image block +
 * title/location/price lines), rendered in a grid while a listing page is
 * loading. Replaces the previous single centered spinner, which caused a
 * layout "pop" the instant data arrived and read as noticeably less
 * polished than the rest of the site on every page navigation.
 */
export default function PropertySkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-800/10 dark:border-white/10 bg-white dark:bg-brand-800">
      <div className="aspect-[4/3] w-full animate-pulse bg-brand-100 dark:bg-white/10" />
      <div className="p-4">
        <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-brand-100 dark:bg-white/10" />
        <div className="mb-3 h-3 w-1/2 animate-pulse rounded bg-brand-100 dark:bg-white/10" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-brand-100 dark:bg-white/10" />
      </div>
    </div>
  );
}
