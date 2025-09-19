import React, { useEffect } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function TestEnv() {
  useEffect(() => {
    console.log("[TestEnv] VITE_WEATHER_API_KEY =", API_KEY);

    if (API_KEY) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Abidjan,CI&appid=${API_KEY}&units=metric`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("[TestEnv] Weather data:", data);
        })
        .catch((err) => console.error("[TestEnv] Fetch error:", err));
    }
  }, []);

  return (
    <div style={{ padding: "1rem", border: "1px solid red" }}>
      <h2>TestEnv Component</h2>
      <p>Open DevTools Console and Network tab to see logs & API call.</p>
    </div>
  );
}
