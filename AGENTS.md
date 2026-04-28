# AGENTS.md

## Project Overview

Real-time earthquake and weather monitoring dashboard. Vanilla JS, no build tools.

## Architecture

- **No framework** — plain HTML/CSS/JS loaded via `<script>` tags
- **Global objects** — `EarthquakeAPI`, `EQMap`, `WeatherAPI`, `EQCharts` are globals defined in separate files
- **Entry point** — `js/app.js` orchestrates initialization and state

## Conventions

- All JS files define a single global object or set of functions
- CSS uses custom properties defined in `:root`
- No build step — open `index.html` directly or via local server
- External libs loaded from CDN (Leaflet, Chart.js)

## APIs

- USGS GeoJSON feeds: no auth required, rate-limited by USGS
- Open-Meteo: no auth required, free tier

## Key Files

| File | Responsibility |
|------|---------------|
| `js/api.js` | Fetch earthquake data from USGS |
| `js/map.js` | Leaflet map, markers, popups |
| `js/weather.js` | Fetch and render weather data |
| `js/charts.js` | Chart.js histogram, timeline, scatter |
| `js/app.js` | State, filters, auto-refresh, notifications |
