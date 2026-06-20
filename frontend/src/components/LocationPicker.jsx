import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { RefreshCcw } from 'lucide-react';
import { applyLeafletIconFix } from '../utils/leafletIconFix.js';

applyLeafletIconFix();

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

  const handleRefreshLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setCenter(coords);
          setPosition(coords);
        },
        (err) => console.log('Geolocation error:', err.message),
        { enableHighAccuracy: true }
      );
    }
  };

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
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          className="map-tiles"
        />
        <LocationMarker position={position} setPosition={setPosition} />
        <MapUpdater center={center} />
      </MapContainer>

      <button
        type="button"
        onClick={handleRefreshLocation}
        className="absolute bottom-4 right-4 z-[1000] flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs font-semibold text-slate-200 shadow-xl backdrop-blur-md transition-all duration-200 hover:bg-slate-900 hover:text-white active:scale-95 hover:border-brand-500/30"
        title="Refresh & Recenter Current Location"
      >
        <RefreshCcw className="h-3.5 w-3.5" />
        <span>Locate Me</span>
      </button>

      <style>{`
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
