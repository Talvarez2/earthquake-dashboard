const EarthquakeAPI = {
  async fetchRecent(period = 'day', minMagnitude = 2.5) {
    const urls = {
      day: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${minMagnitude >= 4.5 ? '4.5' : minMagnitude >= 2.5 ? '2.5' : '1.0'}_day.geojson`,
      week: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${minMagnitude >= 4.5 ? '4.5' : minMagnitude >= 2.5 ? '2.5' : '1.0'}_week.geojson`,
      month: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${minMagnitude >= 4.5 ? '4.5' : minMagnitude >= 2.5 ? '2.5' : '1.0'}_month.geojson`,
    };
    const res = await fetch(urls[period] || urls.day);
    if (!res.ok) throw new Error(`USGS API error: ${res.status}`);
    const data = await res.json();
    return data.features.filter(f => f.properties.mag >= minMagnitude);
  }
};
