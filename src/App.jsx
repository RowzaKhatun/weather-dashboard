import { useState, useCallback, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherList, { ITEMS_PER_PAGE } from "./components/WeatherList";
import WeatherDetail from "./components/WeatherDetail";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import { fetchWeather } from "./services/weatherApi";
import "./App.css";

// Default cities to show on initial load
const DEFAULT_CITIES = ["London", "New York", "Tokyo", "Paris", "Sydney"];

function App() {
  const [theme, setTheme] = useState("light");
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [initialized, setInitialized] = useState(false);

  // Load default cities on first visit
  const loadDefaults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        DEFAULT_CITIES.map((city) => fetchWeather(city))
      );
      setWeatherData(results);
      setInitialized(true);
    } catch (err) {
      setError("Could not load default cities. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger default load on mount
  useEffect(() => {
    loadDefaults();
  }, [loadDefaults]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Search for a specific city
  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    setSelectedCity(null);

    try {
      const result = await fetchWeather(city);

      // If city already exists, move it to the front; otherwise add it
      setWeatherData((prev) => {
        const filtered = prev.filter((w) => w.id !== result.id);
        return [result, ...filtered];
      });
      setSearchQuery("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <h1>
            <span className="header-icon">🌤</span> Weather Dashboard
          </h1>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
        <p className="header-subtitle">
          Real-time weather for cities around the world
        </p>
      </header>

      <main className="app-main">
        {!selectedCity && (
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        )}

        {loading && <Loader />}

        {error && !loading && (
          <ErrorMessage message={error} onRetry={() => handleSearch(searchQuery)} />
        )}

        {!loading && !error && selectedCity && (
          <WeatherDetail
            weather={selectedCity}
            onBack={() => setSelectedCity(null)}
          />
        )}

        {!loading && !error && !selectedCity && (
          <WeatherList
            items={weatherData}
            visibleCount={visibleCount}
            onLoadMore={handleLoadMore}
            onSelectCity={setSelectedCity}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          Powered by{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open-Meteo
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
