import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/solid';

/**
 * Lightweight, dependency-free "map" visualization. Plots each property as a
 * pin positioned by its normalized latitude/longitude within the current
 * result set's bounding box. Properties without coordinates get a stable
 * pseudo-position derived from their id, so the view still populates
 * meaningfully for demo data. No external maps API/key required.
 */
function hashPosition(id) {
  const h = Math.abs(Math.sin(id * 999.19) * 10000);
  const frac = h - Math.floor(h);
  const h2 = Math.abs(Math.sin(id * 45.7) * 10000);
  const frac2 = h2 - Math.floor(h2);
  return { x: 10 + frac * 80, y: 10 + frac2 * 80 };
}

export default function MapView({ properties, type, activeId, onHover }) {
  const [hovered, setHovered] = useState(null);

  const withCoords = properties.filter((p) => p.latitude != null && p.longitude != null);

  const bounds = useMemo(() => {
    if (withCoords.length < 2) return null;
    const lats = withCoords.map((p) => Number(p.latitude));
    const lngs = withCoords.map((p) => Number(p.longitude));
    return {
      minLat: Math.min(...lats), maxLat: Math.max(...lats),
      minLng: Math.min(...lngs), maxLng: Math.max(...lngs),
    };
  }, [withCoords]);

  const positioned = properties.map((p) => {
    if (bounds && p.latitude != null && p.longitude != null) {
      const latRange = bounds.maxLat - bounds.minLat || 1;
      const lngRange = bounds.maxLng - bounds.minLng || 1;
      const x = 8 + ((Number(p.longitude) - bounds.minLng) / lngRange) * 84;
      const y = 8 + (1 - (Number(p.latitude) - bounds.minLat) / latRange) * 84;
      return { ...p, __x: x, __y: y };
    }
    const { x, y } = hashPosition(p.id);
    return { ...p, __x: x, __y: y };
  });

  const detailPath = (p) => (type === 'hotel' ? `/hotels/${p.id}` : `/chalets/${p.id}`);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-brand-800/10 bg-brand-50">
      {/* Stylized terrain backdrop — abstract, no external map tiles needed */}
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-brand-200" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <path d="M0,70 Q25,55 45,68 T100,60 L100,100 L0,100 Z" className="fill-brand-100" />
        <path d="M0,85 Q30,75 55,85 T100,78 L100,100 L0,100 Z" className="fill-brand-200/60" />
      </svg>

      {positioned.map((p) => {
        const isActive = hovered === p.id || activeId === p.id;
        return (
          <RouterLink
            key={p.id}
            to={detailPath(p)}
            onMouseEnter={() => { setHovered(p.id); onHover?.(p.id); }}
            onMouseLeave={() => { setHovered(null); onHover?.(null); }}
            className="absolute -translate-x-1/2 -translate-y-full transition-transform"
            style={{ left: `${p.__x}%`, top: `${p.__y}%`, zIndex: isActive ? 20 : 10 }}
          >
            <div
              className={[
                'animate-pop-in flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-lg transition-all',
                isActive ? 'scale-110 bg-gold-500 text-white' : 'bg-white text-ink hover:bg-brand-800 hover:text-white',
              ].join(' ')}
            >
              ${Number(p.base_price).toFixed(0)}
            </div>
            <MapPinIcon className={`mx-auto -mt-0.5 h-4 w-4 ${isActive ? 'text-gold-500' : 'text-ink/70'}`} />
          </RouterLink>
        );
      })}

      {properties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-ink/40">No properties to show</div>
      )}
    </div>
  );
}
