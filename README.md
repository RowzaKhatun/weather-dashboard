# 🌤 Weather Dashboard

A clean, real-time weather dashboard built with React. Search any city and instantly see current conditions, temperature, humidity, wind, and more.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

## Features

- **Real-time weather data** — powered by the OpenWeatherMap API
- **City search** — type a city name and hit Search (or press Enter)
- **Weather cards** — at-a-glance view with temperature, humidity, wind, and condition
- **Detail view** — click any card for an expanded breakdown (high/low, pressure, visibility, sunrise/sunset)
- **Load More pagination** — cards are paginated; click "Load More" to reveal more
- **Loading spinner** — visual feedback while data is being fetched
- **Error handling** — friendly messages for bad searches or network failures
- **Responsive design** — works on desktop, tablet, and mobile

## Tech Stack

| Layer       | Choice                      |
| ----------- | --------------------------- |
| Framework   | React 19 (functional only)  |
| Build tool  | Vite                        |
| Styling     | Vanilla CSS (no frameworks) |
| Data source | Open-Meteo API (free, no key) |
| State       | React hooks (useState, useEffect, useCallback) |

## Project Structure

```
weather-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── ErrorMessage.jsx / .css
│   │   ├── Loader.jsx / .css
│   │   ├── SearchBar.jsx / .css
│   │   ├── WeatherCard.jsx / .css
│   │   ├── WeatherDetail.jsx / .css
│   │   └── WeatherList.jsx / .css
│   ├── hooks/
│   │   └── useDebounce.js
│   ├── services/
│   │   └── weatherApi.js
│   ├── App.jsx / .css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## API

This project uses [Open-Meteo](https://open-meteo.com/) — a free, open-source weather API that requires **no API key**.

| Endpoint | Purpose |
| -------- | ------- |
| `GET geocoding-api.open-meteo.com/v1/search?name={city}` | Resolve city name → lat/lon |
| `GET api.open-meteo.com/v1/forecast?latitude=...&longitude=...` | Fetch current weather |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
# Clone the repo (or navigate to the project folder)
cd weather-dashboard

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at **http://localhost:5173** (default Vite port).

### Build for Production

```bash
npm run build
npm run preview
```

## Component Overview

| Component       | Responsibility |
| --------------- | -------------- |
| `App`           | Root state management, orchestrates all child components |
| `SearchBar`     | Text input + submit button; emits search queries |
| `WeatherList`   | Renders a grid of `WeatherCard` components with "Load More" |
| `WeatherCard`   | Displays a single city's weather at a glance |
| `WeatherDetail` | Expanded detail view when a card is clicked |
| `Loader`        | Spinner shown during API calls |
| `ErrorMessage`  | User-friendly error display with optional retry |

## License

MIT
