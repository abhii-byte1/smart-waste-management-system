import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
};

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14);
  }, [center, map]);
  return null;
};

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [center, setCenter] = useState([40.7128, -74.0060]); // Default NYC

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setCenter(coords);
          setPosition(coords); // Automatically drop pin at their location
        },
        (err) => console.log('Geolocation error:', err.message),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (position) {
      onLocationSelect({ lat: position[0] ?? position.lat, lng: position[1] ?? position.lng });
    }
  }, [position, onLocationSelect]);

  return (
    <div className="h-64 w-full overflow-hidden rounded-xl border border-white/10 sm:h-80 relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        <LocationMarker position={position} setPosition={setPosition} />
        <MapUpdater center={center} />
      </MapContainer>
      <style>{`
        /* Dark mode map tiles filter */
        .map-tiles {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
        }
        .leaflet-container {
          background-color: #0f172a; /* Slate 900 */
        }
        .leaflet-control-zoom a {
          background-color: #1e293b !important; /* Slate 800 */
          color: #94a3b8 !important; /* Slate 400 */
          border-color: rgba(255,255,255,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default LocationPicker;
