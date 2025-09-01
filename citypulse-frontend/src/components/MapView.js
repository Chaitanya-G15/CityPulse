import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchReports } from '../services/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.2/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.2/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.2/dist/images/marker-shadow.png',
});

export default function MapView({ userPosition }) {
  const [accuracy, setAccuracy] = useState(0);
  const [reports, setReports] = useState([]);

  // Fetch reports every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchReports();
      setReports(data);
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer center={userPosition} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={userPosition}>
        <Popup>You are here</Popup>
      </Marker>
      <Circle center={userPosition} radius={accuracy} />
      {reports.map((r) => (
        <Marker key={r.id} position={[r.lat, r.lng]}>
          <Popup>
            <b>{r.type}</b><br />
            {r.description}<br />
            {new Date(r.timestamp.seconds * 1000).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
