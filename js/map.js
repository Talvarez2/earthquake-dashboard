const EQMap = {
  map: null,
  markers: null,

  init() {
    this.map = L.map('map', { center: [20, 0], zoom: 2, zoomControl: false });
    L.control.zoom({ position: 'topright' }).addTo(this.map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18
    }).addTo(this.map);
    this.markers = L.layerGroup().addTo(this.map);
  },

  depthColor(d) {
    return d > 300 ? '#800026' : d > 150 ? '#bd0026' : d > 70 ? '#e31a1c' :
           d > 30 ? '#fc4e2a' : d > 10 ? '#fd8d3c' : '#feb24c';
  },

  render(geojson, onClick) {
    this.markers.clearLayers();
    geojson.features.forEach(f => {
      const [lng, lat, depth] = f.geometry.coordinates;
      const mag = f.properties.mag;
      const marker = L.circleMarker([lat, lng], {
        radius: Math.max(mag * 3, 4),
        fillColor: this.depthColor(depth),
        color: '#fff',
        weight: 0.5,
        fillOpacity: 0.8
      });
      marker.on('click', () => onClick(f));
      this.markers.addLayer(marker);
    });
  }
};
