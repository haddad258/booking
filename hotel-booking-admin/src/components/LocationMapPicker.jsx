import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Box, Typography, Grid, TextField, Alert } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Leaflet's default marker icon paths break under Vite's bundling (it
// looks for the images at a URL that doesn't exist in the built output)
// unless explicitly re-pointed at the bundled asset URLs like this.
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DEFAULT_CENTER = [36.8065, 10.1815]; // Tunis, as a sensible default for this platform

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * Interactive location picker (Phase 5): click anywhere on the map, or
 * drag the marker, to set latitude/longitude. Also editable directly via
 * the two number fields below the map, since typing exact coordinates is
 * sometimes faster than pixel-hunting on a map. Uses OpenStreetMap tiles
 * via Leaflet — free, no API key, no billing account needed (the audit's
 * recommendation given this project's cost/ease-of-integration priorities).
 */
export default function LocationMapPicker({ latitude, longitude, onChange }) {
  const hasCoords = latitude != null && longitude != null;
  const center = hasCoords ? [Number(latitude), Number(longitude)] : DEFAULT_CENTER;
  const [zoom] = useState(hasCoords ? 13 : 5);

  const handlePick = useCallback(
    (lat, lng) => {
      onChange({ latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) });
    },
    [onChange]
  );

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        Location
      </Typography>
      <Box
        sx={{
          height: 280,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          mb: 1.5,
        }}
      >
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={handlePick} />
          {hasCoords && (
            <Marker
              position={center}
              icon={defaultIcon}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const pos = e.target.getLatLng();
                  handlePick(pos.lat, pos.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </Box>

      {!hasCoords && (
        <Alert severity="info" sx={{ mb: 1.5 }}>
          Click anywhere on the map to drop a pin, or enter coordinates directly below.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Latitude"
            value={latitude ?? ''}
            inputProps={{ step: 'any', min: -90, max: 90 }}
            onChange={(e) => {
              const lat = e.target.value === '' ? null : Number(e.target.value);
              onChange({ latitude: lat, longitude: longitude ?? null });
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Longitude"
            value={longitude ?? ''}
            inputProps={{ step: 'any', min: -180, max: 180 }}
            onChange={(e) => {
              const lng = e.target.value === '' ? null : Number(e.target.value);
              onChange({ latitude: latitude ?? null, longitude: lng });
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
