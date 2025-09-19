// central place for weather-related network calls

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function fetchCurrentWeather(city) {
  if (!API_KEY) {
    throw new Error("Missing VITE_WEATHER_API_KEY");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) {
    // Surface helpful error messages
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) msg = body.message;
    } catch (_) {}
    throw new Error(msg);
  }
  return res.json();
}
