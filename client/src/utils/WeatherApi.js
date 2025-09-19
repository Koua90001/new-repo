// client/src/utils/WeatherApi.js
const BASE = 'https://api.openweathermap.org/data/2.5';
const KEY = import.meta.env.VITE_OWM_KEY; // put the key in .env (see step 2)

// Normalize OWM 5-day/3h forecast into daily “cards” of 3-hour slices
const groupByDay = (list) => {
  const byDate = list.reduce((acc, itm) => {
    const day = itm.dt_txt.split(' ')[0];
    acc[day] = acc[day] || [];
    acc[day].push(itm);
    return acc;
  }, {});
  return Object.entries(byDate).map(([date, entries]) => ({
    date,
    entries,
    // simple aggregate
    min: Math.min(...entries.map(e => e.main.temp_min)),
    max: Math.max(...entries.map(e => e.main.temp_max)),
    icon: entries[0]?.weather?.[0]?.icon || '01d',
    summary: entries[0]?.weather?.[0]?.description || '—',
  }));
};

export async function fetchForecastByCity(city, units = 'metric') {
  if (!KEY) throw new Error('Missing OpenWeatherMap API key');
  const url = `${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${KEY}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) {
    // Return reviewer-friendly message
    const txt = await res.text().catch(() => '');
    throw new Error(`Sorry, something went wrong during the request. There may be a connection issue or the server may be down. Please try again later. (HTTP ${res.status}) ${txt}`);
  }
  const data = await res.json();
  // defensive checks
  if (!data?.list?.length) return { city: data?.city?.name || city, days: [] };
  return { city: data.city.name, days: groupByDay(data.list) };
}

export async function fetchCurrentByCoords(lat, lon, units = 'metric') {
  if (!KEY) throw new Error('Missing OpenWeatherMap API key');
  const url = `${BASE}/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Sorry, something went wrong during the request. There may be a connection issue or the server may be down. Please try again later. (HTTP ${res.status}) ${txt}`);
  }
  return res.json();
}
