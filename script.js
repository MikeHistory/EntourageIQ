let db = [];

fetch('products.json')
  .then(r => r.json())
  .then(data => db = data)
  .catch(err => alert('Could not load products.json: '+err));

const q = document.getElementById('q');
q.addEventListener('keydown', e => {
  if (e.key === 'Enter') search(q.value.trim().toLowerCase());
});

function render(filters, list) {
  const box = document.getElementById('results');

  const hdrParts = [];
  if (filters.terpenes?.length) hdrParts.push(filters.terpenes.join(', '));
  if (filters.lineage?.length)  hdrParts.push(filters.lineage.join(', '));
  if (filters.weights?.length)  hdrParts.push(filters.weights.join(', '));  // keep if you still have weight buttons
  const title = 'Matches for ' + (hdrParts.join(' · ') || 'all');

  box.innerHTML = list.length
    ? `<h3>${title}</h3><ul>${
        list.map(s => `
          <li>
            <div class="strain">${s.Strain}</div>
            <div class="meta">${s.Lineage} · ${s.Cultivator || 'Unknown Cultivator'}</div>
            <div class="meta">CBG: ${s.CBG ?? 'n/a'}</div>
            <div class="meta">${s.Terpenes}</div>
          </li>
        `).join('')
      }</ul>`
    : '<p>No strains match those filters.</p>';
}