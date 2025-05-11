let db = [];
fetch('products.json')
  .then(r => r.json())
  .then(d => db = d)
  .then(() => render())           // initial render
  .catch(err => alert('Could not load products: '+err));

/********* helpers to collect selected filters *********/
const getSelectedText = (sel) =>
  [...document.querySelectorAll(sel+'.selected')]
       .map(el => el.dataset.lineage || el.dataset.terp);

function clearLineage(){ document.querySelectorAll('#lineage-row .selected')
  .forEach(el => el.classList.remove('selected')); render(); }
function clearTerps(){ document.querySelectorAll('#terpene-row .selected')
  .forEach(el => el.classList.remove('selected')); render(); }

/********* click-toggle on all chips *********/
document.querySelectorAll('.chip').forEach(chip=>{
  chip.addEventListener('click',()=>{
    chip.classList.toggle('selected');
    render();
  });
});

/********* main filter + render *********/
function render(){
  const selTerps   = getSelectedText('#terpene-row .chip');
  const selLineage = getSelectedText('#lineage-row .chip');

  let list = db.slice();

  if (selTerps.length){
    selTerps.forEach(t=>{
      list = list.filter(s =>
        (s.Terpenes || '').toLowerCase().includes(t.toLowerCase()));
    });
  }
  /* ---------- sort by rank of first selected terp ---------- */
if (selTerps.length === 1){
  const term = selTerps[0].toLowerCase();
  list.sort((a, b) => {
    const ai = (a.Terpenes || '').toLowerCase().indexOf(term);
    const bi = (b.Terpenes || '').toLowerCase().indexOf(term);
    // strains where term not found get big index (push to bottom)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
} else if (selTerps.length > 1){
  /* simple score: sum of indexes (lower is better) */
  list.sort((a, b) => {
    const score = s => selTerps.reduce((sum, t)=>{
       const i = (s.Terpenes || '').toLowerCase().indexOf(t.toLowerCase());
       return sum + (i === -1 ? 999 : i);
    }, 0);
    return score(a) - score(b);
  });
}
  if (selLineage.length){
    list = list.filter(s => selLineage.includes(s.Lineage));
  }

  const box = document.getElementById('results');
  box.innerHTML = list.length
    ? `<ul>${list.map(s => `
        <li>
          <div class="strain">${s.Strain}</div>
          <div class="meta">${s.Lineage} · ${s.Cultivator || 'Unknown'}</div>
          <div class="meta">CBG: ${s.CBG ?? 'n/a'}</div>
          <div class="meta">${s.Terpenes}</div>
        </li>`).join('')}</ul>`
    : '<p>No strains found.</p>';
}
