import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  
const [current, setCurrent] = useState(null);
const [daily, setDaily] = useState(null);
const [error, setError] = useState(false);
const [now, setNow] = useState(new Date()); // <-- add this


 useEffect(() => {
  let cancelled = false;

  async function loadWeather() {
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=-31.95&longitude=115.86&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto"
      );
      if (!res.ok) throw new Error("Weather error");
      const data = await res.json();
      if (!cancelled) {
        setCurrent(data.current_weather);
        setDaily(data.daily);
      }
    } catch (e) {
      if (!cancelled) setError(true);
    }
  }

  // initial load
  loadWeather();

  // live clock: update every 60s
  const clockId = setInterval(() => {
    setNow(new Date());
  }, 60 * 1000);

  // OPTIONAL: live weather refresh every 15 minutes
  const weatherId = setInterval(() => {
    loadWeather();
  }, 15 * 60 * 1000);

  return () => {
    cancelled = true;
    clearInterval(clockId);
    clearInterval(weatherId);
  };
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

  const getWeatherIcon = (code) => {
    if (code === 0) return "☀️";
    if (code === 1 || code === 2) return "🌤";
    if (code === 3) return "☁️";
    if (code >= 51 && code <= 67) return "🌧";
    if (code >= 71 && code <= 77) return "🌨";
    if (code >= 80 && code <= 82) return "🌦";
    if (code >= 95) return "⛈";
    return "☁️";
  };

  const getDayLabel = (isoDate, index) => {
    if (index === 0) return "Today";
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-AU", { weekday: "short" });
  };

  const formatHeaderTime = () => {
    const now = new Date();

    const date = now.toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    const time = now.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${date} • ${time}`;
  };

  const hasData = current && daily && daily.time && daily.time.length > 0;

  return (
    <div className="widget-root">
      <div className="weather-card wide">
        <div className="label">ENVIRONMENT</div>

        {hasData && !error && (
          <>
            {/* TODAY BLOCK */}
            <div className="today-row">
              <div>
                <div className="temp-large">
                  {Math.round(current.temperature)}°
                </div>
                <div className="cond-large">
                  {decodeWeather(current.weathercode)}
                </div>
              </div>

              <div className="meta-today">
                <span className="meta-city">Perth</span>
                <span className="meta-time">{formatHeaderTime()}</span>
                <span className="meta-wind">
          <span className="meta-feels">
  Feels like {Math.round(current.temperature)}° </span>
                  Wind {Math.round(current.windspeed)} km/h
                </span>
              </div>
            </div>

            {/* 5-DAY FORECAST */}
            <div className="forecast-row">
              {daily.time.slice(0, 5).map((date, idx) => (
                <div
                  key={date}
                  className={`day-card ${idx === 0 ? "today" : ""}`}
                >
                  <div className="day-header">
                    <span className="day-label">
                      {getDayLabel(date, idx)}
                    </span>
                    <span className="day-icon">
                      {getWeatherIcon(daily.weathercode[idx])}
                    </span>
                  </div>

                  <div className="day-cond">
                    {decodeWeather(daily.weathercode[idx])}
                  </div>

                  <div className="day-temps">
                    <span className="high">
                      {Math.round(daily.temperature_2m_max[idx])}°
                    </span>
                    <span className="low">
                      {Math.round(daily.temperature_2m_min[idx])}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!hasData && !error && <div className="status">Loading…</div>}

        {error && (
          <div className="status error">Weather unavailable</div>
        )}
      </div>
    </div>
  );
}
