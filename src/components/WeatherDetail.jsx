import "./WeatherDetail.css";

function WeatherDetail({ weather, onBack }) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;

  const formatTime = (value) => {
    if (!value) return "—";
    const date = typeof value === "number" ? new Date(value * 1000) : new Date(value);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <div className="weather-detail">
      <button className="back-button" onClick={onBack} id="back-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Dashboard
      </button>

      <div className="detail-hero">
        <div className="detail-hero-info">
          <h2>
            {weather.city}, <span>{weather.country}</span>
          </h2>
          <p className="detail-description">{weather.description}</p>
          <div className="detail-temp-main">
            <span className="detail-temp-value">{weather.temp}°C</span>
          </div>
          <p className="detail-feels">Feels like {weather.feelsLike}°C</p>
        </div>
        <img src={iconUrl} alt={weather.description} className="detail-icon" />
      </div>

      <div className="detail-grid">
        <div className="detail-grid-item">
          <span className="grid-label">High / Low</span>
          <span className="grid-value">
            {weather.tempMax}° / {weather.tempMin}°
          </span>
        </div>
        <div className="detail-grid-item">
          <span className="grid-label">Humidity</span>
          <span className="grid-value">{weather.humidity}%</span>
        </div>
        <div className="detail-grid-item">
          <span className="grid-label">Wind Speed</span>
          <span className="grid-value">{weather.windSpeed} km/h</span>
        </div>
        <div className="detail-grid-item">
          <span className="grid-label">Pressure</span>
          <span className="grid-value">{weather.pressure} hPa</span>
        </div>
        {weather.visibility != null && (
          <div className="detail-grid-item">
            <span className="grid-label">Visibility</span>
            <span className="grid-value">{(weather.visibility / 1000).toFixed(1)} km</span>
          </div>
        )}
        <div className="detail-grid-item">
          <span className="grid-label">Sunrise</span>
          <span className="grid-value">{formatTime(weather.sunrise)}</span>
        </div>
        <div className="detail-grid-item">
          <span className="grid-label">Sunset</span>
          <span className="grid-value">{formatTime(weather.sunset)}</span>
        </div>
        <div className="detail-grid-item">
          <span className="grid-label">Condition</span>
          <span className="grid-value">{weather.condition}</span>
        </div>
        {weather.aqi != null && (
          <div className="detail-grid-item">
            <span className="grid-label">Air Quality (US AQI)</span>
            <span className="grid-value">{weather.aqi}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherDetail;
