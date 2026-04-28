const App = {
  data: null,

  async init() {
    EQMap.init();
    await this.loadData();
  },

  async loadData() {
    try {
      this.data = await EarthquakeAPI.fetch('24h');
      const count = this.data.features.length;
      document.getElementById('status-bar').textContent = `${count} earthquakes loaded`;
      EQMap.render(this.data, f => this.selectQuake(f));
      this.renderList(this.data.features);
    } catch (e) {
      document.getElementById('status-bar').textContent = 'Error loading data';
      console.error(e);
    }
  },

  selectQuake(f) {
    const p = f.properties;
    const [lng, lat, depth] = f.geometry.coordinates;
    const panel = document.getElementById('detail-panel');
    panel.className = 'sidebar-section active';
    panel.innerHTML = `<h3>Earthquake Details</h3>
      <table>
        <tr><td>Magnitude</td><td>${p.mag}</td></tr>
        <tr><td>Location</td><td>${p.place}</td></tr>
        <tr><td>Depth</td><td>${depth.toFixed(1)} km</td></tr>
        <tr><td>Time</td><td>${new Date(p.time).toLocaleString()}</td></tr>
        <tr><td>Coordinates</td><td>${lat.toFixed(3)}, ${lng.toFixed(3)}</td></tr>
      </table>`;
  },

  renderList(features) {
    const list = document.getElementById('earthquake-list');
    const sorted = [...features].sort((a, b) => b.properties.time - a.properties.time);
    list.innerHTML = sorted.map(f => {
      const p = f.properties;
      return `<div class="eq-item" data-id="${f.id}">
        <span class="mag">${p.mag.toFixed(1)}</span>
        <span class="place">${p.place}</span>
        <span class="time">${new Date(p.time).toLocaleString()}</span>
      </div>`;
    }).join('');
    list.addEventListener('click', e => {
      const item = e.target.closest('.eq-item');
      if (!item) return;
      const f = features.find(f => f.id === item.dataset.id);
      if (f) this.selectQuake(f);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
