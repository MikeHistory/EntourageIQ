let db = [];

fetch('products.json')
  .then(r => r.json())
  .then(data => db = data)
  .catch(err => alert('Could not load products.json: '+err));

const q = document.getElementById('q');
q.addEventListener('keydown', e => {
  if (e.key === 'Enter') search(q.value.trim().toLowerCase());
});

function search(term){
  const list = document.getElementById('results');
  if (!term){ list.innerHTML=''; return; }

  const hits = db.filter(s =>
    (s.Terpenes || '').toLowerCase().includes(term)
  );

  list.innerHTML = hits.length
    ? hits.map(s => `
        <li>
          <div class="strain">${s.Strain}</div>
          <div class="meta">${s.Lineage} · ${s.Weight} · $${s.Price}</div>
          <div class="meta">${s.Terpenes}</div>
        </li>`).join('')
    : '<li>No strains found.</li>';
}