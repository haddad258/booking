import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { resolveImageUrl } from '../lib/media';
import ResponsiveImage from './ui/ResponsiveImage';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -36],
});

const activeIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [32, 52],
  iconAnchor: [16, 52],
  popupAnchor: [0, -46],
  className: 'hue-rotate-[15deg] saturate-150', // subtle highlight for the hovered card's pin
});

const DEFAULT_CENTER = [36.8065, 10.1815]; // sensible fallback (Tunis) when nothing has coordinates yet

/** Pans/zooms the map to fit every marker whenever the marker set changes. */
function FitToMarkers({ positions }) {
  const map = useMap();
  useMemo(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 13);
    } else {
      map.fitBounds(positions, { padding: [40, 40], maxZoom: 14 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(positions)]);
  return null;
}

/**
 * Real interactive map (Leaflet + OpenStreetMap, no API key) for the
 * hotel/chalet listing pages — plots every property that has real
 * latitude/longitude, with a popup on click showing the property's image,
 * name, price, and a link to its detail page. Properties without
 * coordinates are simply not plotted (no fake/hashed positions on a real
 * map — that would show wrong locations).
 */
export default function PropertiesMapView({ properties, type, activeId, onHover }) {
  const { t } = useTranslation();
  const withCoords = properties.filter((p) => p.latitude != null && p.longitude != null);
  const positions = withCoords.map((p) => [Number(p.latitude), Number(p.longitude)]);

  const detailPath = (p) => (type === 'hotel' ? `/hotels/${p.id}` : `/chalets/${p.id}`);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[20px] border border-ink/10 dark:border-white/10">
      <MapContainer center={DEFAULT_CENTER} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToMarkers positions={positions} />

        {withCoords.map((p) => (
          <Marker
            key={p.id}
            position={[Number(p.latitude), Number(p.longitude)]}
            icon={activeId === p.id ? activeIcon : defaultIcon}
            eventHandlers={{
              mouseover: () => onHover?.(p.id),
              mouseout: () => onHover?.(null),
            }}
          >
            <Popup minWidth={220}>
              <div className="w-full">
                <ResponsiveImage
                  src={resolveImageUrl(p.cover_image_url || p.images?.[0]?.url)}
                  alt={p.name}
                  frameClassName="aspect-video"
                  className="mb-2 rounded-lg"
                />
                <p className="font-display text-sm font-bold leading-tight text-ink dark:text-white">{p.name}</p>
                <p className="mb-1.5 text-xs text-ink/55 dark:text-white/55">{p.city}, {p.country}</p>
                <p className="mb-2 font-display text-base font-semibold text-brand-700 dark:text-gold-300">
                  ${Number(p.base_price).toFixed(0)}
                  <span className="ml-1 text-xs font-medium text-ink/50 dark:text-white/50">{t('listing.perNight')}</span>
                </p>
                <RouterLink
                  to={detailPath(p)}
                  className="inline-block w-full rounded-full bg-brand-800 px-3 py-1.5 text-center text-xs font-semibold text-canvas"
                >
                  {t('listing.viewDetails')}
                </RouterLink>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {withCoords.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-canvas/85 dark:bg-brand-950/85">
          <p className="rounded-lg bg-white dark:bg-brand-800 px-4 py-2 text-sm text-ink/50 dark:text-white/50 shadow">No property locations available yet</p>
        </div>
      )}
    </div>
  );
}
