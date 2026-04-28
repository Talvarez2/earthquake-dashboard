const WeatherAPI = {
  async fetch(lat, lng) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();
    return data.current;
  },

  weatherDesc(code) {
    const map = {
      0: '☀️ Clear', 1: '🌤 Mostly Clear', 2: '⛅ Partly Cloudy', 3: '☁️ Overcast',
      45: '🌫 Fog', 48: '🌫 Rime Fog',
      51: '🌦 Light Drizzle', 53: '🌦 Drizzle', 55: '🌧 Heavy Drizzle',
      61: '🌧 Light Rain', 63: '🌧 Rain', 65: '🌧 Heavy Rain',
      71: '🌨 Light Snow', 73: '🌨 Snow', 75: '🌨 Heavy Snow',
      80: '🌦 Light Showers', 81: '🌧 Showers', 82: '🌧 Heavy Showers',
      95: '⛈ Thunderstorm', 96: '⛈ Hail Storm', 99: '⛈ Severe Storm'
    };
    return map[code] || `Code ${code}`;
  },

  render(current) {
    const panel = document.getElementById('weather-panel');
    document.getElementById('weather-content').innerHTML = `
      <div class="weather-grid">
        <div class="weather-main">${this.weatherDesc(current.weather_code)}</div>
        <div class="weather-stat"><span>🌡</span> ${current.temperature_2m}°C</div>
        <div class="weather-stat"><span>💨</span> ${current.wind_speed_10m} km/h</div>
        <div class="weather-stat"><span>💧</span> ${current.relative_humidity_2m}%</div>
      </div>`;
    panel.classList.add('active');
  }
};
