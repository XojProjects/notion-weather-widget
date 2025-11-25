import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-31.95&longitude=115.86&current_weather=true"
        );
        if (!res.ok) throw new Error("Weather error");
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (e) {
        setError(true);
      }
    }

    loadWeather();
  }, []);

  const decodeWeather = (code) => {
    if (code === 0) return "Clear";
    if (code === 1 || code === 2) return "Partly Cloudy";
    if (code === 3) return "Overcast";
    if (code >= 51 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Showers";
    if (code >= 95) return "Storm";
    return "Cloudy";
  };

  return (
    <div className="widget-root">
      <div className="weather-card">
        <div className="label">ENVIRONMENT</div>

        {weather && !error && (
          <>
            <div className="temp-row">
              <div className="temp">{Math.round(weather.temperature)}°</div>
              <div className="cond">{decodeWeather(weather.weathercode)}</div>
            </div>

            <div className="meta">
              <span>Perth</span>
              <span>Wind {Math.round(weather.windspeed)} km/h</span>
            </div>
          </>
        )}

        {!weather && !error && (
          <div className="status">Loading…</div>
        )}

        {error && (
          <div className="status error">Weather unavailable</div>
        )}
      </div>
    </div>
  );
}
