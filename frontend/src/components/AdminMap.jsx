import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { PRIORITY_STYLES } from '../utils/constants.js';
import { applyLeafletIconFix } from '../utils/leafletIconFix.js';

applyLeafletIconFix();

// Create colored icons based on priority
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  High: createIcon('red'),
  Medium: createIcon('gold'),
  Low: createIcon('green')
};

const AdminMap = ({ complaints }) => {
  // Default to a central city location
  const defaultCenter = [40.7128, -74.0060]; // Example: NYC

  // Find the first complaint with coordinates to center the map, or use default
  const validComplaints = complaints.filter(c => c.coordinates && c.coordinates.lat && c.coordinates.lng);
  const center = validComplaints.length > 0 
    ? [validComplaints[0].coordinates.lat, validComplaints[0].coordinates.lng] 
    : defaultCenter;

  return (
    <div className="h-[600px] w-full overflow-hidden rounded-2xl border border-white/10 bg-surface/50 p-2 backdrop-blur relative z-0">
      <div className="h-full w-full rounded-xl overflow-hidden relative z-0">
        <MapContainer 
          center={center} 
          zoom={12} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            className="map-tiles"
          />
          <MarkerClusterGroup chunkedLoading maxClusterRadius={60}>
            {validComplaints.map((complaint) => (
              <Marker 
                key={complaint._id} 
                position={[complaint.coordinates.lat, complaint.coordinates.lng]}
                icon={icons[complaint.priority] || icons.Low}
              >
                <Popup className="dark-popup">
                  <div className="flex flex-col gap-2 p-1 max-w-[200px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">#{complaint.ticketId || 'TKT'}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${complaint.priority === 'High' ? 'bg-red-100 text-red-700' : complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {complaint.priority}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 leading-tight">{complaint.location}</p>
                    <p className="text-xs text-slate-600 line-clamp-3">{complaint.description}</p>
                    {complaint.image && (
                      <img src={complaint.image} loading="lazy" alt="Ticket" className="w-full h-24 object-cover rounded mt-1" />
                    )}
                    <div className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">
                      Status: {complaint.status}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
        <style>{`
          .leaflet-container {
            background-color: #0f172a;
          }
          .leaflet-control-zoom a {
            background-color: #1e293b !important;
            color: #94a3b8 !important;
            border-color: rgba(255,255,255,0.1) !important;
          }
          .dark-popup .leaflet-popup-content-wrapper {
            background-color: #f8fafc;
            color: #0f172a;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          }
          .dark-popup .leaflet-popup-tip {
            background-color: #f8fafc;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AdminMap;
