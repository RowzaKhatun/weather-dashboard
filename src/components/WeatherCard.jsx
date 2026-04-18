import "./WeatherCard.css";

function WeatherCard({ weather, onClick }) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className="weather-card" onClick={() => onClick(weather)} role="button" tabIndex={0}>
      <div className="card-header">
        <div>
          <h3 className="card-city">
            {weather.city}, <span className="card-country">{weather.country}</span>
          </h3>
          <p className="card-condition">{weather.description}</p>
        </div>
        <img src={iconUrl} alt={weather.description} className="card-icon" />
      </div>
      <div className="card-stats">
        <div className="card-temp">
          <span className="temp-value">{weather.temp}°</span>
          <span className="temp-unit">C</span>
        </div>
        <div className="card-details">
          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{weather.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind</span>
            <span className="detail-value">{weather.windSpeed} km/h</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Feels like</span>
            <span className="detail-value">{weather.feelsLike}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
