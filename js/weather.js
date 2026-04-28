const WeatherAPI = {
  WMO_CODES: {
    0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
    45:'Fog',48:'Rime fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',
    61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',
    80:'Light showers',81:'Showers',82:'Heavy showers',95:'Thunderstorm',96:'Thunderstorm w/ hail',99:'Heavy thunderstorm'
  },

  async fetchWeather(lat, lng) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    return res.json();
  },

  render(data, lat, lng) {
    const c = data.current;
    const condition = this.WMO_CODES[c.weather_code] || 'Unknown';
    return `
      <h2>🌤 Weather</h2>
      <div class="detail-card">
        <p><strong>Location:</strong> ${lat.toFixed(2)}°, ${lng.toFixed(2)}°</p>
        <p><strong>Condition:</strong> ${condition}</p>
        <p><strong>Temperature:</strong> ${c.temperature_2m}°C</p>
        <p><strong>Humidity:</strong> ${c.relative_humidity_2m}%</p>
        <p><strong>Wind:</strong> ${c.wind_speed_10m} km/h</p>
      </div>`;
  }
};
