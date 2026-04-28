let earthquakes = [];
let filters = { minMag: 2.5, maxMag: 10, period: 'day' };
let seenIds = new Set();
const REFRESH_MS = 5 * 60 * 1000;

async function loadEarthquakes() {
  try {
    earthquakes = await EarthquakeAPI.fetchRecent(filters.period, filters.minMag);
    checkNewLargeQuakes(earthquakes);
    applyFilters();
  } catch (e) { console.error('Failed to load earthquakes:', e); }
}

function checkNewLargeQuakes(quakes) {
  quakes.forEach(q => {
    if (!seenIds.has(q.id) && q.properties.mag >= 5) {
      notify(`M${q.properties.mag.toFixed(1)} Earthquake`, q.properties.place);
    }
    seenIds.add(q.id);
  });
}

function notify(title, body) {
  if (Notification.permission === 'granted') new Notification(title, { body, icon: '🌍' });
  else if (Notification.permission !== 'denied') Notification.requestPermission().then(p => { if (p === 'granted') new Notification(title, { body }); });
}

async function loadEarthquakes() {
  try {
    earthquakes = await EarthquakeAPI.fetchRecent(filters.period, filters.minMag);
    applyFilters();
  } catch (e) { console.error('Failed to load earthquakes:', e); }
}

function applyFilters() {
  const filtered = earthquakes.filter(q => {
    const mag = q.properties.mag;
    return mag >= filters.minMag && mag <= filters.maxMag;
  });
  EQMap.plotEarthquakes(filtered, onQuakeClick);
  renderList(filtered);
  EQCharts.render(filtered);
}

function onQuakeClick(q) {
  const [lng, lat, depth] = q.geometry.coordinates;
  const { mag, place, time } = q.properties;
  EQMap.flyTo(lat, lng);
  // Fetch weather for this location
  const wp = document.getElementById('weather-panel');
  wp.classList.remove('hidden');
  wp.innerHTML = '<h2>🌤 Weather</h2><p>Loading...</p>';
  WeatherAPI.fetchWeather(lat, lng).then(data => {
    wp.innerHTML = WeatherAPI.render(data, lat, lng);
  }).catch(() => { wp.innerHTML = '<h2>🌤 Weather</h2><p>Failed to load weather.</p>'; });
  const detail = document.getElementById('eq-detail');
  detail.classList.remove('hidden');
  detail.innerHTML = `
    <h2>Earthquake Detail</h2>
    <div class="detail-card">
      <div class="detail-mag">M${mag.toFixed(1)}</div>
      <p><strong>Location:</strong> ${place}</p>
      <p><strong>Depth:</strong> ${depth.toFixed(1)} km</p>
      <p><strong>Time:</strong> ${new Date(time).toLocaleString()}</p>
      <p><strong>Coordinates:</strong> ${lat.toFixed(3)}°, ${lng.toFixed(3)}°</p>
    </div>`;
}

function renderList(quakes) {
  const ul = document.getElementById('eq-list');
  const sorted = [...quakes].sort((a, b) => b.properties.time - a.properties.time);
  document.getElementById('eq-count').textContent = `(${sorted.length})`;
  ul.innerHTML = sorted.slice(0, 50).map(q => {
    const { mag, place, time } = q.properties;
    return `<li class="eq-item" data-id="${q.id}">
      <span class="mag">M${mag.toFixed(1)}</span><span class="place">${place}</span>
      <span class="time">${new Date(time).toLocaleString()}</span>
    </li>`;
  }).join('');
  ul.querySelectorAll('.eq-item').forEach(li => {
    li.addEventListener('click', () => {
      const q = quakes.find(e => e.id === li.dataset.id);
      if (q) onQuakeClick(q);
    });
  });
}

function initFilters() {
  const el = document.getElementById('filters');
  el.innerHTML = `
    <h2>Filters</h2>
    <label>Min Magnitude<input type="range" id="f-min" min="0" max="9" step="0.5" value="${filters.minMag}"><span id="f-min-v">${filters.minMag}</span></label>
    <label>Max Magnitude<input type="range" id="f-max" min="1" max="10" step="0.5" value="${filters.maxMag}"><span id="f-max-v">${filters.maxMag}</span></label>
    <label>Time Period<select id="f-period">
      <option value="day" selected>Last 24 Hours</option>
      <option value="week">Last 7 Days</option>
      <option value="month">Last 30 Days</option>
    </select></label>`;
  el.querySelector('#f-min').addEventListener('input', e => {
    filters.minMag = +e.target.value;
    el.querySelector('#f-min-v').textContent = filters.minMag;
    applyFilters();
  });
  el.querySelector('#f-max').addEventListener('input', e => {
    filters.maxMag = +e.target.value;
    el.querySelector('#f-max-v').textContent = filters.maxMag;
    applyFilters();
  });
  el.querySelector('#f-period').addEventListener('change', e => {
    filters.period = e.target.value;
    loadEarthquakes();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  EQMap.init();
  initFilters();
  loadEarthquakes();
  setInterval(loadEarthquakes, REFRESH_MS);
  if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
});
