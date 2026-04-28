const EarthquakeAPI = {
  feeds: {
    '24h': 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson',
    '7d': 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson',
    '30d': 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson',
  },

  async fetch(period = '24h') {
    const res = await fetch(this.feeds[period]);
    if (!res.ok) throw new Error(`USGS API error: ${res.status}`);
    return res.json();
  }
};
