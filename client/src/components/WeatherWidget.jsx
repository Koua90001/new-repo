// client/src/components/WeatherWidget.jsx
import React, { useEffect, useState } from "react";
import "./WeatherWidget.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function WeatherWidget({ city = "Abidjan,CI" }) {
  const [data, setData] = useState(null);
  const [state, setState] = useState("idle"); // idle | loading | error
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      if (!API_KEY) {
        setState("error");
        setErr("Missing VITE_WEATHER_API_KEY");
        return;
      }
      setState("loading");
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )}&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
        setState("idle");
      } catch (e) {
        setState("error");
        setErr(e.message || "Failed to load weather");
      }
    }
    load();
  }, [city]);

  return (
    <div className="weather">
      <h3 className="weather__title">Weather — {city}</h3>
      {state === "loading" && <p className="weather__muted">Loading…</p>}
      {state === "error" && <p className="weather__error">⚠️ {err}</p>}
      {state === "idle" && data && (
        <div className="weather__row">
          <div className="weather__main">
            <div className="weather__temp">{Math.round(data.main.temp)}°C</div>
            <div className="weather__desc">
              {data.weather?.[0]?.description ?? "—"}
            </div>
          </div>
          {data.weather?.[0]?.icon && (
            <img
              className="weather__icon"
              alt={data.weather[0].description}
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            />
          )}
        </div>
      )}
    </div>
  );
}
