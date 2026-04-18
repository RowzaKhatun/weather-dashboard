const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const AQI_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

/**
 * Look up a city by name using Open-Meteo geocoding.
 * Returns the first matching result.
 */
async function geocodeCity(city) {
  const res = await fetch(
    `${GEOCODE_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );

  if (!res.ok) {
    throw new Error("Geocoding service unavailable. Please try again later.");
  }

  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found. Please check the spelling.`);
  }

  return data.results[0];
}

/**
 * Map WMO weather code to a human-readable condition + icon name.
 * https://open-meteo.com/en/docs#weathervariables
 */
function interpretWeatherCode(code) {
  const map = {
    0: { condition: "Clear Sky", icon: "01d" },
    1: { condition: "Mainly Clear", icon: "02d" },
    2: { condition: "Partly Cloudy", icon: "03d" },
    3: { condition: "Overcast", icon: "04d" },
    45: { condition: "Foggy", icon: "50d" },
    48: { condition: "Depositing Rime Fog", icon: "50d" },
    51: { condition: "Light Drizzle", icon: "09d" },
    53: { condition: "Moderate Drizzle", icon: "09d" },
    55: { condition: "Dense Drizzle", icon: "09d" },
    61: { condition: "Slight Rain", icon: "10d" },
    63: { condition: "Moderate Rain", icon: "10d" },
    65: { condition: "Heavy Rain", icon: "10d" },
    71: { condition: "Slight Snowfall", icon: "13d" },
    73: { condition: "Moderate Snowfall", icon: "13d" },
    75: { condition: "Heavy Snowfall", icon: "13d" },
    80: { condition: "Slight Rain Showers", icon: "09d" },
    81: { condition: "Moderate Rain Showers", icon: "09d" },
    82: { condition: "Violent Rain Showers", icon: "09d" },
    95: { condition: "Thunderstorm", icon: "11d" },
    96: { condition: "Thunderstorm with Hail", icon: "11d" },
    99: { condition: "Thunderstorm with Heavy Hail", icon: "11d" },
  };

  return map[code] || { condition: "Unknown", icon: "03d" };
}

/**
 * Fetch current weather data for a city.
 * Uses Open-Meteo (free, no API key required).
 */
export async function fetchWeather(city) {
  // Step 1 — resolve city name to lat/lon
  const geo = await geocodeCity(city);

  // Step 2 — fetch current weather
  const params = new URLSearchParams({
    latitude: geo.latitude,
    longitude: geo.longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
      "surface_pressure",
    ].join(","),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
    ].join(","),
    timezone: "auto",
    forecast_days: 1,
  });

  const aqiParams = new URLSearchParams({
    latitude: geo.latitude,
    longitude: geo.longitude,
    current: "us_aqi",
  });

  const [res, aqiRes] = await Promise.all([
    fetch(`${WEATHER_URL}?${params}`),
    fetch(`${AQI_URL}?${aqiParams}`).catch(() => null), // fail gracefully
  ]);

  if (!res.ok) {
    throw new Error("Failed to fetch weather data. Please try again later.");
  }

  const data = await res.json();
  let aqi = null;
  if (aqiRes && aqiRes.ok) {
    try {
      const aqiData = await aqiRes.json();
      aqi = aqiData.current?.us_aqi;
    } catch (e) {
      // ignore AQI parsing errors
    }
  }

  const current = data.current;
  const daily = data.daily;
  const { condition, icon } = interpretWeatherCode(current.weather_code);

  return {
    id: geo.id,
    city: geo.name,
    country: geo.country_code || geo.country || "",
    temp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    tempMin: Math.round(daily.temperature_2m_min[0]),
    tempMax: Math.round(daily.temperature_2m_max[0]),
    humidity: current.relative_humidity_2m,
    pressure: Math.round(current.surface_pressure),
    windSpeed: current.wind_speed_10m,
    visibility: null, // not available in Open-Meteo free tier
    aqi, // Air Quality Index
    condition,
    description: condition.toLowerCase(),
    icon,
    sunrise: daily.sunrise[0],
    sunset: daily.sunset[0],
  };
}
