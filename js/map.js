const EQMap = {
  map: null,
  markers: L.layerGroup(),

  init() {
    this.map = L.map('map', { center: [20, 0], zoom: 2, zoomControl: true });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18
    }).addTo(this.map);
    this.markers.addTo(this.map);
    return this;
  },

  depthColor(depth) {
    if (depth < 10) return '#00ff88';
    if (depth < 30) return '#88ff00';
    if (depth < 70) return '#ffcc00';
    if (depth < 150) return '#ff6600';
    return '#ff0033';
  },

  plotEarthquakes(quakes, onClick) {
    this.markers.clearLayers();
    quakes.forEach(q => {
      const { mag, place, time } = q.properties;
      const [lng, lat, depth] = q.geometry.coordinates;
      const radius = Math.max(mag * 3, 4);
      const marker = L.circleMarker([lat, lng], {
        radius, fillColor: this.depthColor(depth), color: '#fff',
        weight: 0.5, fillOpacity: 0.8
      });
      marker.bindPopup(`<b>M${mag.toFixed(1)}</b><br>${place}<br>Depth: ${depth.toFixed(1)} km<br>${new Date(time).toLocaleString()}`);
      if (onClick) marker.on('click', () => onClick(q));
      this.markers.addLayer(marker);
    });
  },

  flyTo(lat, lng) { this.map.flyTo([lat, lng], 8, { duration: 1 }); }
};
