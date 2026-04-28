# 🌍 Earthquake & Weather Dashboard

Real-time earthquake and weather monitoring dashboard built with vanilla JavaScript, Leaflet.js, and Chart.js.

![Dashboard Screenshot](screenshot.png)

## Features

- **Live Earthquake Map** — Leaflet map with USGS earthquake data. Markers sized by magnitude, colored by depth.
- **Earthquake Details** — Click any marker to see magnitude, location, depth, time, and coordinates.
- **Weather Overlay** — Fetches current weather (Open-Meteo) for any clicked earthquake location.
- **Filters** — Filter by magnitude range and time period (24h / 7d / 30d).
- **Charts** — Magnitude histogram, earthquakes-per-hour timeline, depth vs magnitude scatter plot.
- **Auto-Refresh** — Data refreshes every 5 minutes.
- **Desktop Notifications** — Alerts for M5.0+ earthquakes.
- **Responsive** — Works on desktop and mobile.

## APIs

| API | Purpose |
|-----|---------|
| [USGS Earthquake Feed](https://earthquake.usgs.gov/earthquakes/feed/) | Earthquake data (GeoJSON) |
| [Open-Meteo](https://open-meteo.com/) | Weather data (no API key needed) |

## Tech Stack

- HTML / CSS / Vanilla JavaScript
- [Leaflet.js](https://leafletjs.com/) — Interactive maps
- [Chart.js](https://www.chartjs.org/) — Data visualizations
- CARTO dark basemap tiles

## Getting Started

1. Clone the repo
2. Open `index.html` in a browser (or use a local server)

```bash
# Option: use Python's built-in server
python3 -m http.server 8000
```

No build step, no dependencies to install.

## Project Structure

```
├── index.html          # Main page
├── css/style.css       # Dark theme styles
├── js/
│   ├── api.js          # USGS earthquake API
│   ├── map.js          # Leaflet map setup and markers
│   ├── weather.js      # Open-Meteo weather API
│   ├── charts.js       # Chart.js visualizations
│   └── app.js          # App initialization and state
└── README.md
```

## License

MIT
