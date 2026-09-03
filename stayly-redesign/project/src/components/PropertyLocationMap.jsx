import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Same fix as the admin picker: Leaflet's default marker icon paths break
// under Vite bundling unless explicitly re-pointed at the bundled URLs.
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -36],
});

/**
 * Real interactive map for a single property's detail page — actual
 * OpenStreetMap tiles via Leaflet, showing the property's true
 * latitude/longitude with a marker and popup. Distinct from MapView.jsx
 * (used on the search/listing pages), which plots multiple properties as
 * abstract pins and falls back to a hashed position when there's fewer
 * than two properties to compute a bounding box from — meaning it can
 * never show a real single-property location correctly. This component
 * always renders the property's true coordinates.
 *
 * Falls back to a friendly "location not available" state when the
 * property has no lat/lng set yet (rather than showing a wrong position).
 */
export default function PropertyLocationMap({ name, address, city, country, latitude, longitude }) {
  const hasCoords = latitude != null && longitude != null;

  if (!hasCoords) {
    return (
      <div className="flex h-64 items-center justify-center rounded-[20px] border border-dashed border-ink/20 dark:border-white/20 bg-brand-50 dark:bg-white/5 text-center sm:h-80">
        <div className="px-6">
          <p className="font-medium text-ink/60 dark:text-white/60">Exact location not available yet</p>
          <p className="mt-1 text-sm text-ink/45 dark:text-white/45">{address}, {city}, {country}</p>
        </div>
      </div>
    );
  }

  const position = [Number(latitude), Number(longitude)];

  return (
    <div className="h-64 overflow-hidden rounded-[20px] border border-ink/10 dark:border-white/10 sm:h-80">
      <MapContainer
        center={position}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={defaultIcon}>
          <Popup>
            <strong>{name}</strong>
            <br />
            {address}, {city}, {country}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
