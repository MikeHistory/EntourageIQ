/******** load data *********/
let db = [];
fetch("products.json")
  .then(r => r.json())
  .then(d => (db = d))
  .then(render)
  .catch(e => alert("Could not load data: " + e));

/******** utilities *********/
const qs = sel => [...document.querySelectorAll(sel)];
const selected = row =>
  qs(`${row} .chip.selected`).map(el => el.dataset.terp || el.dataset.lineage);

function clearTerps()   { qs("#terpene-row  .selected").forEach(el=>el.classList.remove("selected")); render(); }
function clearLineage() { qs("#lineage-row .selected").forEach(el=>el.classList.remove("selected")); render(); }

/******** chip toggles *********/
qs(".chip").forEach(chip =>
  chip.addEventListener("click", () => {
    chip.classList.toggle("selected");
    render();
  })
);

/******** main render *********/
function render() {
  const terps   = selected("#terpene-row");
  const lineage = selected("#lineage-row");

  /* ---- filter ---- */
  let list = db.slice();
  if (terps.length){
    terps.forEach(t=>{
      list = list.filter(s =>
        (s.Terpenes || "").toLowerCase().includes(t.toLowerCase())
      );
    });
  }
  if (lineage.length){
    list = list.filter(s => lineage.includes(s.Lineage));
  }

  /* ---- rank by first-selected terp ---- */
  if (terps.length === 1){
    const term = terps[0].toLowerCase();
    list.sort((a,b)=>{
      const ai = (a.Terpenes||"").toLowerCase().indexOf(term);
      const bi = (b.Terpenes||"").toLowerCase().indexOf(term);
      return (ai===-1?999:ai) - (bi===-1?999:bi);
    });
  }

  /* ---- render ---- */
  const box = document.getElementById("results");
  box.innerHTML = list.length
    ? `<ul>${list.map(s=>`
        <li>
          <div class="strain">${s.Strain}</div>
          <div class="meta">${s.Lineage} · ${s.Cultivator || "Unknown"}</div>
          <div class="meta">CBG: ${s.CBG ?? "n/a"}</div>
          <div class="meta">${s.Terpenes}</div>
        </li>`).join("")}</ul>`
    : "<p>No strains found.</p>";
}
