const EQCharts = {
  charts: {},

  init() {
    Chart.defaults.color = '#888';
    Chart.defaults.borderColor = '#0f3460';
  },

  update(features) {
    this.histogram(features);
    this.timeline(features);
    this.scatter(features);
  },

  getOrCreate(id, config) {
    if (this.charts[id]) { this.charts[id].destroy(); }
    this.charts[id] = new Chart(document.getElementById(id), config);
  },

  histogram(features) {
    const bins = [0, 0, 0, 0, 0, 0];
    const labels = ['2-3', '3-4', '4-5', '5-6', '6-7', '7+'];
    features.forEach(f => {
      const m = f.properties.mag;
      const i = Math.min(Math.floor(m) - 2, 5);
      if (i >= 0) bins[i]++;
    });
    this.getOrCreate('chart-histogram', {
      type: 'bar',
      data: { labels, datasets: [{ data: bins, backgroundColor: '#e94560' }] },
      options: { plugins: { legend: { display: false }, title: { display: true, text: 'Magnitude Distribution' } }, scales: { y: { beginAtZero: true } } }
    });
  },

  timeline(features) {
    const hours = {};
    features.forEach(f => {
      const h = new Date(f.properties.time);
      h.setMinutes(0, 0, 0);
      const key = h.toISOString();
      hours[key] = (hours[key] || 0) + 1;
    });
    const sorted = Object.entries(hours).sort((a, b) => a[0].localeCompare(b[0]));
    this.getOrCreate('chart-timeline', {
      type: 'line',
      data: {
        labels: sorted.map(([k]) => new Date(k).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit' })),
        datasets: [{ data: sorted.map(([, v]) => v), borderColor: '#e94560', fill: true, backgroundColor: 'rgba(233,69,96,0.1)', tension: 0.3, pointRadius: 0 }]
      },
      options: { plugins: { legend: { display: false }, title: { display: true, text: 'Earthquakes per Hour' } }, scales: { y: { beginAtZero: true } } }
    });
  },

  scatter(features) {
    const data = features.map(f => ({ x: f.properties.mag, y: f.geometry.coordinates[2] }));
    this.getOrCreate('chart-scatter', {
      type: 'scatter',
      data: { datasets: [{ data, backgroundColor: 'rgba(233,69,96,0.5)', pointRadius: 3 }] },
      options: { plugins: { legend: { display: false }, title: { display: true, text: 'Depth vs Magnitude' } }, scales: { x: { title: { display: true, text: 'Magnitude' } }, y: { title: { display: true, text: 'Depth (km)' }, reverse: true } } }
    });
  }
};
