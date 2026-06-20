import L from 'leaflet';

/**
 * Fix for Leaflet's default marker icons breaking in Webpack/Vite builds.
 * Must be imported once before any MapContainer is rendered.
 * Extracted to avoid duplication across AdminMap and LocationPicker.
 */

// Only run once
let applied = false;
export const applyLeafletIconFix = () => {
  if (applied) return;
  applied = true;

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};
