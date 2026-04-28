const EQCharts = {
  charts: {},

  destroy() { Object.values(this.charts).forEach(c => c.destroy()); this.charts = {}; },

  render(quakes) {
    this.destroy();
    document.getElementById('stats-panel').classList.remove('hidden');
    this.magHistogram(quakes);
    this.timeline(quakes);
    this.depthScatter(quakes);
  },

  magHistogram(quakes) {
    const bins = [0,0,0,0,0,0,0,0];
    const labels = ['2-3','3-4','4-5','5-6','6-7','7-8','8-9','9+'];
    quakes.forEach(q => {
      const m = q.properties.mag;
      const i = Math.min(Math.floor(m) - 2, 7);
      if (i >= 0) bins[i]++;
    });
    this.charts.hist = new Chart(document.getElementById('chart-mag'), {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: bins, backgroundColor: '#e94560' }] },
      options: { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Magnitude Distribution', color: '#eee' } }, scales: { x: { ticks: { color: '#aaa' } }, y: { ticks: { color: '#aaa' }, beginAtZero: true } } }
    });
  },

  timeline(quakes) {
    const hours = {};
    quakes.forEach(q => {
      const d = new Date(q.properties.time);
      const key = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:00`;
      hours[key] = (hours[key] || 0) + 1;
    });
    const sorted = Object.entries(hours).sort((a, b) => a[0].localeCompare(b[0]));
    this.charts.timeline = new Chart(document.getElementById('chart-timeline'), {
      type: 'line',
      data: { labels: sorted.map(e => e[0]), datasets: [{ label: 'Earthquakes', data: sorted.map(e => e[1]), borderColor: '#00ff88', tension: 0.3, fill: false, pointRadius: 2 }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Earthquakes per Hour', color: '#eee' } }, scales: { x: { ticks: { color: '#aaa', maxTicksLimit: 12 } }, y: { ticks: { color: '#aaa' }, beginAtZero: true } } }
    });
  },

  depthScatter(quakes) {
    const data = quakes.map(q => ({ x: q.properties.mag, y: q.geometry.coordinates[2] }));
    this.charts.scatter = new Chart(document.getElementById('chart-depth'), {
      type: 'scatter',
      data: { datasets: [{ label: 'Depth vs Mag', data, backgroundColor: '#ffcc00', pointRadius: 3 }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Depth vs Magnitude', color: '#eee' } }, scales: { x: { title: { display: true, text: 'Magnitude', color: '#aaa' }, ticks: { color: '#aaa' } }, y: { title: { display: true, text: 'Depth (km)', color: '#aaa' }, ticks: { color: '#aaa' } } } }
    });
  }
};
