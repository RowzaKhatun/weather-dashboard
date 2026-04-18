import WeatherCard from "./WeatherCard";
import "./WeatherList.css";

const ITEMS_PER_PAGE = 6;

function WeatherList({ items, visibleCount, onLoadMore, onSelectCity }) {
  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No cities added yet. Search for a city above to get started!</p>
      </div>
    );
  }

  return (
    <div className="weather-list-wrapper">
      <div className="weather-list">
        {visible.map((weather) => (
          <WeatherCard key={weather.id} weather={weather} onClick={onSelectCity} />
        ))}
      </div>
      {hasMore && (
        <button className="load-more-button" onClick={onLoadMore} id="load-more-button">
          Load More
        </button>
      )}
    </div>
  );
}

export { ITEMS_PER_PAGE };
export default WeatherList;
