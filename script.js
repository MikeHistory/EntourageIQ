let db = [];

// --------------- load data once -----------------
fetch('products.json')
  .then(r => r.json())
  .then(data => db = data)
  .catch(err => alert('Could not load products.json: '+err));

// --------------- wire the input -----------------
const q = document.getElementById('q');
q.addEventListener('keydown', e => {
  if (e.key === 'Enter') search(q.value.trim().toLowerCase());
});

// --------------- render helper ------------------
function render(list){
  const box = document.getElementById('results');
  box.innerHTML = list.length
    ? `<ul>${
        list.map(s => `
          <li>
            <div class="strain">${s.Strain}</div>
            <div class="meta">${s.Lineage} · ${s.Cultivator || 'Unknown Cultivator'}</div>
            <div class="meta">CBG: ${s.CBG ?? 'n/a'}</div>
            <div class="meta">${s.Terpenes}</div>
          </li>`
        ).join('')
      }</ul>`
    : '<p>No strains found.</p>';
}

// --------------- search function ----------------
function search(term){
  if (!term){ render([]); return; }
  const hits = db.filter(s =>
    (s.Terpenes || '').toLowerCase().includes(term)
  );
  render(hits);
}