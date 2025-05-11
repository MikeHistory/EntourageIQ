/********* load data *********/
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
