import "./Loader.css";

function Loader() {
  return (
    <div className="loader-wrapper" role="status">
      <div className="spinner" />
      <p className="loader-text">Fetching weather data...</p>
    </div>
  );
}

export default Loader;
