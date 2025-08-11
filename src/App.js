import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';
import './App.css';

function HeatmapLayer({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!data.length) return;

    const heatLayer = L.heatLayer(data, {
      radius: 25,
      blur: 15,
      maxZoom: 8,
      gradient: {
        0.1: 'blue',
        0.3: 'cyan',
        0.5: 'lime',
        0.7: 'yellow',
        1.0: 'red'
      }
    }).addTo(map);

    return () => map.removeLayer(heatLayer);
  }, [data, map]);

  return null;
}

function SmogDensityMap() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [location1, setLocation1] = useState({ lat: '', lng: '' });
  const [location2, setLocation2] = useState({ lat: '', lng: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSmogData = async (lat, lng) => {
    try {
      const response = await fetch(`http://localhost:5000/aqi-data?lat=${lat}&lng=${lng}`);
      if (!response.ok) throw new Error('Failed to fetch smog data');
      return await response.json();
    } catch (err) {
      console.error('Error fetching smog data:', err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Fetch data for both locations
      const [data1, data2] = await Promise.all([
        fetchSmogData(location1.lat, location1.lng),
        fetchSmogData(location2.lat, location2.lng)
      ]);

      // Normalize smog levels to 0-1 range for heatmap
      const maxSmog = Math.max(data1.smogLevel, data2.smogLevel);
      const normalizedData = [
        [parseFloat(location1.lat), parseFloat(location1.lng), data1.smogLevel / maxSmog],
        [parseFloat(location2.lat), parseFloat(location2.lng), data2.smogLevel / maxSmog]
      ];

      setHeatmapData(normalizedData);
    } catch (err) {
      setError('Failed to load smog data. Please check coordinates and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Pakistan Smog Density Map</h1>
      
      <div className="input-form">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <h3>Location 1</h3>
            <input
              type="text"
              placeholder="Latitude"
              value={location1.lat}
              onChange={(e) => setLocation1({...location1, lat: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Longitude"
              value={location1.lng}
              onChange={(e) => setLocation1({...location1, lng: e.target.value})}
              required
            />
          </div>
          
          <div className="input-group">
            <h3>Location 2</h3>
            <input
              type="text"
              placeholder="Latitude"
              value={location2.lat}
              onChange={(e) => setLocation2({...location2, lat: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Longitude"
              value={location2.lng}
              onChange={(e) => setLocation2({...location2, lng: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Show Smog Density'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      <MapContainer
        center={[30.3753, 69.3451]} // Center on Pakistan
        zoom={6}
        style={{ height: '70vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <HeatmapLayer data={heatmapData} />
        
        {/* Markers for the input locations */}
        {heatmapData.length > 0 && (
          <>
            <Marker position={[heatmapData[0][0], heatmapData[0][1]]}>
              <Popup>
                <strong>Location 1</strong><br />
                Smog Level: {(heatmapData[0][2] * 100).toFixed(1)}%
              </Popup>
            </Marker>
            <Marker position={[heatmapData[1][0], heatmapData[1][1]]}>
              <Popup>
                <strong>Location 2</strong><br />
                Smog Level: {(heatmapData[1][2] * 100).toFixed(1)}%
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      <div className="legend">
        <h4>Smog Density</h4>
        <div><span style={{ background: 'blue' }}></span>Low</div>
        <div><span style={{ background: 'cyan' }}></span>Moderate</div>
        <div><span style={{ background: 'lime' }}></span>High</div>
        <div><span style={{ background: 'yellow' }}></span>Very High</div>
        <div><span style={{ background: 'red' }}></span>Extreme</div>
      </div>
    </div>
  );
}

export default SmogDensityMap;