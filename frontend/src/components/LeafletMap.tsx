import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icon paths in React bundlers
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MarkerItem {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  category?: string;
}

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  markers?: MarkerItem[];
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom = 10,
  markers = [],
  height = '400px',
}) => {
  return (
    <div style={{ height, width: '100%' }} className="rounded-xl overflow-hidden shadow-md border border-ivory-100 relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.latitude, m.longitude]} icon={customIcon}>
            <Popup>
              <div className="p-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-600 block">
                  {m.category || 'Location'}
                </span>
                <h4 className="font-serif font-bold text-navy-900 text-sm">{m.name}</h4>
                {m.description && <p className="text-xs text-muted mt-1 leading-relaxed">{m.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
