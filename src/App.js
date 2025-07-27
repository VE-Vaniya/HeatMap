import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [location, setLocation] = useState({ lat: '35.6762', lng: '139.6503' }); // Default to Tokyo
  const [aqiData, setAqiData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchAQI = async () => {
    const lat = parseFloat(location.lat);
    const lng = parseFloat(location.lng);

    if (isNaN(lat) || isNaN(lng)) {
      setError("Please enter valid numeric coordinates");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:5000/aqi-data', {
        params: { lat, lng },
        timeout: 8000 // Increased timeout
      });
      
      if (!response.data?.location) {
        throw new Error("Invalid data format from server");
      }
      
      setAqiData(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                        err.message || 
                        "Failed to connect to server";
      setError(errorMessage);
      console.error("API Error Details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateVariation = async () => {
    if (!aqiData) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/smog-variation',
        [aqiData],
        { timeout: 5000 }
      );
      setAqiData(response.data[0]);
    } catch (err) {
      setError("Variation simulation failed. " + (err.message || ""));
    }
  };

  return (
    <div className="app">
      <h1>Air Quality Index (AQI) Tracker</h1>
      
      <div className="input-group">
        <input
          type="number"
          step="any"
          placeholder="Latitude (e.g., 35.6762)"
          value={location.lat}
          onChange={(e) => setLocation({ ...location, lat: e.target.value })}
        />
        <input
          type="number"
          step="any"
          placeholder="Longitude (e.g., 139.6503)"
          value={location.lng}
          onChange={(e) => setLocation({ ...location, lng: e.target.value })}
        />
        <button 
          onClick={handleFetchAQI} 
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <span className="loading-spinner">🌀</span>
          ) : (
            'Get AQI'
          )}
        </button>
      </div>

      <div className="test-coordinates">
        <button 
          onClick={() => setLocation({ lat: '35.6762', lng: '139.6503' })}
          disabled={isLoading}
        >
          Tokyo
        </button>
        <button 
          onClick={() => setLocation({ lat: '40.7128', lng: '-74.0060' })}
          disabled={isLoading}
        >
          New York
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={() => setError('')} className="dismiss-button">
            ×
          </button>
        </div>
      )}

      {isLoading && <div className="loading-indicator">Fetching data...</div>}

      {aqiData && (
        <div className="aqi-result">
          <h2>
            Location: {aqiData.location.lat}, {aqiData.location.lng}
          </h2>
          <div className="aqi-metrics">
            <div className="metric">
              <span className="metric-label">PM2.5:</span>
              <span className="metric-value">{aqiData.pm25} µg/m³</span>
            </div>
            <div className="metric">
              <span className="metric-label">PM10:</span>
              <span className="metric-value">{aqiData.pm10} µg/m³</span>
            </div>
            <div className="metric">
              <span className="metric-label">Smog Level:</span>
              <span className="metric-value">
                {aqiData.smogLevel?.toFixed(2) ?? 'N/A'}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">AQI:</span>
              <span className="metric-value">
                {aqiData.aqiLevel} (1=Best, 5=Worst)
              </span>
            </div>
          </div>
          <button
            onClick={handleSimulateVariation}
            disabled={isLoading}
            className="simulate-button"
          >
            Simulate Variation
          </button>
        </div>
      )}
    </div>
  );
}

export default App;