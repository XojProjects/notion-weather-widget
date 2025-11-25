import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Perth,AU&units=metric&appid=YOUR_API_KEY`
      );
      const data = await res.json();
      setWeather(data);
    }

    fetchWeather();
  }, []);

  if (!weather) return <div className="loader">Loading...</div>;

  return (
    <div className="weather-widget">
      <div className="label">ENVIRONMENT</div>

      <div className="main">
        <div className="temp">{Math.round(weather.main.temp)}°</div>
        <div className="desc">{weather.weather[0].description}</div>
      </div>

      <div className="details">
        <div>📍 Perth</div>
        <div>💨 {weather.wind.speed} km/h</div>
      </div>
    </div>
  );
}
