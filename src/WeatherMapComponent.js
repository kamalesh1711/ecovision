import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix Leaflet's default icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
//   iconUrl: require('leaflet/dist/images/marker-icon.png').default,
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
// });

const WeatherMapComponent = () => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [zoom, setZoom] = useState(2);
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');

  const fetchWeatherAndLocation = async (location) => {
    try {
      const weatherApiKey = '657e03aa3afbdc342be876cb01f46d0b'; // Replace with your OpenWeatherMap API key
      const responseWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`);
      setWeatherData(responseWeather.data);

      const responseLocation = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
      if (responseLocation.data.length > 0) {
        const { lat, lon } = responseLocation.data[0];
        setPosition([lat, lon]);
        setZoom(10); // Adjust zoom level as needed
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setWeatherData(null);
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherAndLocation(city);
  };

  return (
    <div>
      <h1>Weather and Map Locator</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={city} onChange={handleCityChange} placeholder="Enter city" />
        <button type="submit">Get Weather and Map</button>
      </form>

      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity} %</p>
        </div>
      )}

      <MapContainer center={position} zoom={zoom} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            {weatherData ? (
              <div>
                <h3>{weatherData.name}</h3>
                <p>Temperature: {weatherData.main.temp} °C</p>
                <p>Weather: {weatherData.weather[0].description}</p>
              </div>
            ) : (
              'Loading...'
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default WeatherMapComponent;