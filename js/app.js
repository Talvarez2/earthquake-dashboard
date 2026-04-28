const App = {
  data: null,
  period: '24h',
  minMag: 2.5,

  async init() {
    EQMap.init();
    document.getElementById('filter-mag').addEventListener('change', e => {
      this.minMag = parseFloat(e.target.value);
      this.applyFilters();
    });
    document.getElementById('filter-period').addEventListener('change', e => {
      this.period = e.target.value;
      this.loadData();
    });
    await this.loadData();
  },

  async loadData() {
    try {
      this.data = await EarthquakeAPI.fetch(this.period);
      this.applyFilters();
      document.getElementById('status').textContent =
        `${this.data.metadata.count} earthquakes loaded — ${new Date().toLocaleTimeString()}`;
    } catch (e) {
      document.getElementById('status').textContent = `Error: ${e.message}`;
    }
  },

  applyFilters() {
    if (!this.data) return;
    const filtered = {
      ...this.data,
      features: this.data.features.filter(f => f.properties.mag >= this.minMag)
    };
    EQMap.render(filtered, f => this.selectEarthquake(f));
    this.renderList(filtered.features);
  },

  renderList(features) {
    const list = document.getElementById('earthquake-list');
    const sorted = [...features].sort((a, b) => b.properties.time - a.properties.time);
    list.innerHTML = sorted.slice(0, 100).map(f => {
      const p = f.properties;
      return `<div class="eq-item" data-id="${f.id}">
        <span class="mag" style="color:${EQMap.depthColor(f.geometry.coordinates[2])}">${p.mag.toFixed(1)}</span>
        <span class="place">${p.place}</span>
        <span class="time">${new Date(p.time).toLocaleString()}</span>
      </div>`;
    }).join('');
    list.querySelectorAll('.eq-item').forEach((el, i) => {
      el.addEventListener('click', () => this.selectEarthquake(sorted[i]));
    });
  },

  selectEarthquake(f) {
    const p = f.properties;
    const [lng, lat, depth] = f.geometry.coordinates;
    const panel = document.getElementById('detail-panel');
    document.getElementById('detail-content').innerHTML = `
      <dt>Magnitude</dt><dd>${p.mag.toFixed(1)}</dd>
      <dt>Location</dt><dd>${p.place}</dd>
      <dt>Depth</dt><dd>${depth.toFixed(1)} km</dd>
      <dt>Time</dt><dd>${new Date(p.time).toLocaleString()}</dd>
      <dt>Coordinates</dt><dd>${lat.toFixed(3)}, ${lng.toFixed(3)}</dd>`;
    panel.classList.add('active');
    EQMap.map.flyTo([lat, lng], 6);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
