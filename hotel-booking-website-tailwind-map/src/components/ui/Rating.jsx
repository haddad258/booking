import { StarIcon } from '@heroicons/react/24/solid';

export default function Rating({ value = 0, size = 'h-4 w-4', onChange, className = '' }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {stars.map((s) => {
        const filled = s <= Math.round(value);
        return (
          <StarIcon
            key={s}
            className={`${size} ${filled ? 'text-gold-400' : 'text-brand-800/15'} ${onChange ? 'cursor-pointer' : ''}`}
            onClick={() => onChange?.(s)}
          />
        );
      })}
    </div>
  );
}
