let earthquakes = [];

async function loadEarthquakes() {
  try {
    earthquakes = await EarthquakeAPI.fetchRecent('day', 2.5);
    EQMap.plotEarthquakes(earthquakes);
    renderList(earthquakes);
  } catch (e) { console.error('Failed to load earthquakes:', e); }
}

function renderList(quakes) {
  const ul = document.getElementById('eq-list');
  const sorted = [...quakes].sort((a, b) => b.properties.time - a.properties.time);
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
      if (q) EQMap.flyTo(q.geometry.coordinates[1], q.geometry.coordinates[0]);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  EQMap.init();
  loadEarthquakes();
});
