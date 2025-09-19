import React, { useEffect, useState } from "react";
import "./WeatherWidget.css";
import { fetchCurrentWeather } from "../../services/weather";

export default function WeatherWidget({ city = "Abidjan,CI" }) {
  const [data, setData] = useState(null);
  const [state, setState] = useState("idle"); // idle | loading | error
  const [err, setErr] = useState("");

  useEffect(() => {
    let isMounted = true;
    setState("loading");
    setErr("");

    fetchCurrentWeather(city)
      .then((json) => {
        if (!isMounted) return;
        setData(json);
        setState("idle");
      })
      .catch((e) => {
        if (!isMounted) return;
        setState("error");
        setErr(e.message || "Failed to load weather");
      });

    return () => {
      isMounted = false;
    };
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
