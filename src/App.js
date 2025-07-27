import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [locations, setLocations] = useState([
    { lat: '35.6762', lng: '139.6503' }, // Tokyo (Location 1)
    { lat: '40.7128', lng: '-74.0060' }  // New York (Location 2)
  ]);
  const [aqiData, setAqiData] = useState([null, null]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState([false, false]);

  const aqiColors = {
    1: '#00e400',  // Green
    2: '#ffff00',  // Yellow
    3: '#ff7e00',  // Orange
    4: '#ff0000',  // Red
    5: '#8f3f97'   // Purple
  };

  const getAqiColor = (level) => {
    return aqiColors[level] || '#cccccc';
  };

  const handleFetchAQI = async (index) => {
    const lat = parseFloat(locations[index].lat);
    const lng = parseFloat(locations[index].lng);

    if (isNaN(lat) || isNaN(lng)) {
      setError("Please enter valid numeric coordinates");
      return;
    }

    const newLoading = [...isLoading];
    newLoading[index] = true;
    setIsLoading(newLoading);
    setError('');

    try {
      const response = await axios.get('http://localhost:5000/aqi-data', {
        params: { lat, lng },
        timeout: 8000
      });
      
      if (!response.data?.location) {
        throw new Error("Invalid data format from server");
      }
      
      const newAqiData = [...aqiData];
      newAqiData[index] = response.data;
      setAqiData(newAqiData);
    } catch (err) {
      setError(`Location ${index+1} error: ${err.response?.data?.error || err.message || "Server error"}`);
    } finally {
      const newLoading = [...isLoading];
      newLoading[index] = false;
      setIsLoading(newLoading);
    }
  };

  const handleLocationChange = (index, field, value) => {
    const newLocations = [...locations];
    newLocations[index][field] = value;
    setLocations(newLocations);
  };

  const handleFetchAll = () => {
    handleFetchAQI(0);
    handleFetchAQI(1);
  };

  return (
    <div className="app">
      <h1>Air Quality Comparison</h1>
      
      <div className="location-inputs">
        {[0, 1].map((index) => (
          <div key={index} className="location-group">
            <h3>Location {index+1}</h3>
            <div className="input-group">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={locations[index].lat}
                onChange={(e) => handleLocationChange(index, 'lat', e.target.value)}
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={locations[index].lng}
                onChange={(e) => handleLocationChange(index, 'lng', e.target.value)}
              />
              <button 
                onClick={() => handleFetchAQI(index)}
                disabled={isLoading[index]}
              >
                {isLoading[index] ? 'Loading...' : 'Get AQI'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="fetch-all" onClick={handleFetchAll}>
        Compare Both Locations
      </button>

      <div className="test-coordinates">
        <button onClick={() => {
          handleLocationChange(0, 'lat', '35.6762');
          handleLocationChange(0, 'lng', '139.6503');
        }}>
          Tokyo (Loc 1)
        </button>
        <button onClick={() => {
          handleLocationChange(1, 'lat', '40.7128');
          handleLocationChange(1, 'lng', '-74.0060');
        }}>
          New York (Loc 2)
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

      <div className="comparison-results">
        {[0, 1].map((index) => (
          <div key={index} className="aqi-result">
            {isLoading[index] ? (
              <div className="loading-indicator">Loading Location {index+1} data...</div>
            ) : aqiData[index] ? (
              <>
                <h2>Location {index+1}: {aqiData[index].location.lat}, {aqiData[index].location.lng}</h2>
                <div className="aqi-metrics">
                  <div className="metric">
                    <span className="metric-label">PM2.5:</span>
                    <span className="metric-value">{aqiData[index].pm25} µg/m³</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">PM10:</span>
                    <span className="metric-value">{aqiData[index].pm10} µg/m³</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Smog Level:</span>
                    <span className="metric-value">
                      {aqiData[index].smogLevel?.toFixed(2) ?? 'N/A'}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">AQI:</span>
                    <span 
                      className="metric-value aqi-level"
                      style={{ backgroundColor: getAqiColor(aqiData[index].aqiLevel) }}
                    >
                      {aqiData[index].aqiLevel} (1=Best, 5=Worst)
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-data">No data for Location {index+1}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;