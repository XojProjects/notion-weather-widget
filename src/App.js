import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=-31.95&longitude=115.86&current_weather=true")
      .then(res => res.json())
      .then(data => setWeather(data.current_weather))
      .catch(() => setError(true));
  }, []);

  const decodeWeather = (code) => {
    if (code === 0) return "Clear";
    if (code <= 2) return "Partly Cloudy";
    if (code === 3) return "Overcast";
    if (code >= 51 && code <= 67) return "Rain";
    if (code >= 80) return "Storm";
    return "Cloudy";
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-start font-mono text-[#c084fc] px-2">
      <div className="w-full max-w-[260px] p-2">
        <div className="text-[0.7rem] tracking-[0.3em] text-purple-300 uppercase mb-1">
          ENVIRONMENT
        </div>

        {weather && (
          <>
            <div className="text-[2.5rem] text-[#e9d5ff] leading-tight">
              {Math.round(weather.temperature)}°
            </div>

            <div className="text-[0.7rem] tracking-[0.15em] text-[#a78bfa]/80 uppercase">
              Perth · {decodeWeather(weather.weathercode)}
            </div>

            <div className="text-[0.65rem] text-[#a5b4fc]/70 mt-1">
              Wind {Math.round(weather.windspeed)} km/h
            </div>
          </>
        )}

        {!weather && !error && (
          <div className="text-[0.7rem] text-[#a5b4fc]/60">
            Loading…
          </div>
        )}

        {error && (
          <div className="text-[0.7rem] text-red-400">
            Weather Unavailable
          </div>
        )}
      </div>
    </div>
  );
}
