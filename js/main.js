/* ============================================================
   LÓGICA DE INTERFACE E CÁLCULOS (main.js)
   ============================================================ */

const ROWS = 2; const COLS = 6;
let selectedImprovementIds = new Set();
let currentSeatNo = null;

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupConfig();
  mountGrid();
  mountBusVisual();
  render();
});

function setupTabs() {
  const topTabBtns = document.querySelectorAll(".tabs-top .tabbtn");
  topTabBtns.forEach(btn => {
    btn.onclick = () => {
      topTabBtns.forEach(x => x.classList.remove("act"));
      btn.classList.add("act");
      document.querySelectorAll(".tabview").forEach(v => v.classList.remove("act"));
      const target = document.getElementById(btn.dataset.tab);
      if (target) { target.classList.add("act"); }
    };
  });
}

function setupConfig() {
  const drv = document.getElementById("driver");
  DRIVERS.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id; opt.textContent = d.nome;
    drv.appendChild(opt);
  });
  drv.onchange = render;
  document.getElementById("handCount").oninput = render;
  
  const impWrap = document.getElementById("improvButtons");
  IMPROVEMENTS.forEach(imp => {
    const b = document.createElement("button");
    b.className = "btn"; b.textContent = imp.nome;
    b.onclick = () => {
      if (selectedImprovementIds.has(imp.id)) { selectedImprovementIds.delete(imp.id); }
      else if (selectedImprovementIds.size < 3) { selectedImprovementIds.add(imp.id); }
      b.classList.toggle("accent", selectedImprovementIds.has(imp.id));
      render();
    };
    impWrap.appendChild(b);
  });
}

function render() {
  const state = collectState();
  const { ctx, isActiveAt } = buildCtx(state);
  updateBusVisualLabels(state);

  let pScore = 0; const explainRows = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const card = state.grid[r][c].card;
      if (!card) { continue; }
      const pos = { row: r, col: c };
      const active = isActiveAt(pos);
      let s = active ? card.base : 0;
      const logs = [active ? `${card.base} base` : "Inativo"];
      
      if (active && card.ability) { s += (card.ability(pos, ctx, (m) => logs.push(m)) || 0); }
      pScore += s;
      explainRows.push(`<div class="row"><b>Assento ${seatNumber(pos)}: ${card.nome}</b> (+${s})<br><small>${logs.join(" | ")}</small></div>`);
    }
  }

  const dScore = scoreDriver(state, ctx);
  const iScore = scoreImprovements(state, ctx);
  const total = pScore + dScore + iScore - state.hand;

  document.getElementById("totalScore").textContent = total;
  document.getElementById("sumPassengers").textContent = pScore;
  document.getElementById("sumDriver").textContent = dScore;
  document.getElementById("sumImprov").textContent = iScore;
  document.getElementById("sumHand").textContent = `-${state.hand}`;
  document.getElementById("explain").innerHTML = explainRows.join("");
}

function buildCtx(state) {
  return {
    isActiveAt: () => true, // Simplificado para exemplo, restaurar lógica de 'require' se necessário
    ctx: {
      countBus: (pred) => state.grid.flat().filter(cell => cell.card && pred(cell.card)).length,
      countAdj: (pos, pred) => {
        let n = 0;
        getNeighbors(pos).forEach(nb => {
          const card = state.grid[nb.row][nb.col].card;
          if (card && pred(card)) { n++; }
        });
        return n;
      }
    }
  };
}

function getNeighbors(pos) {
  const nbs = [];
  if (pos.col > 0) nbs.push({ row: pos.row, col: pos.col - 1 });
  if (pos.col < COLS - 1) nbs.push({ row: pos.row, col: pos.col + 1 });
  const otherRow = pos.row === 0 ? 1 : 0;
  for (let dc = -1; dc <= 1; dc++) {
    const cc = pos.col + dc;
    if (cc >= 0 && cc < COLS) { nbs.push({ row: otherRow, col: cc }); }
  }
  return nbs;
}

function scoreDriver(state, ctx) {
  if (!state.driver?.id) { return 0; }
  let pts = 0;
  state.driver.bonus.forEach(tag => {
    pts += ctx.countBus(c => c.faixa === tag || c.temper === tag || c.comp === tag);
  });
  return pts;
}

function scoreImprovements(state, ctx) {
  let pts = 0;
  state.improvements.forEach(imp => {
    imp.bonus.forEach(tag => {
      pts += ctx.countBus(c => c.faixa === tag || c.temper === tag || c.comp === tag);
    });
  });
  return pts;
}

function collectState() {
  const grid = [...new Array(ROWS)].map(() => [...new Array(COLS)].map(() => ({ card: null })));
  document.querySelectorAll(".seat-val").forEach(el => {
    const id = el.dataset.id;
    if (id) { grid[el.dataset.row][el.dataset.col].card = findAnyCard(id); }
  });
  return {
    grid,
    driver: DRIVERS.find(d => d.id === document.getElementById("driver").value),
    improvements: [...selectedImprovementIds].map(id => IMPROVEMENTS.find(i => i.id === id)),
    hand: Number.parseInt(document.getElementById("handCount").value, 10) || 0
  };
}

function findAnyCard(id) {
  return [...CARD_DB, ...COBRADORES].find(c => c.id === id);
}

function mountGrid() {
  const g = document.getElementById("grid");
  for (let i = 1; i <= 12; i++) {
    const { row, col } = seatNumToRC(i);
    const s = document.createElement("div");
    s.className = "seat";
    s.innerHTML = `<span class="pos">${i}</span><div class="seat-val" id="s-${i}" data-row="${row}" data-col="${col}" data-id="">Vazio</div>`;
    s.onclick = () => openPicker(i);
    g.appendChild(s);
  }
}

function seatNumToRC(n) { return n <= 6 ? { row: 0, col: n - 1 } : { row: 1, col: n - 7 }; }
function seatNumber(pos) { return pos.row === 0 ? (pos.col + 1) : (6 + pos.col + 1); }

function openPicker(n) {
  currentSeatNo = n;
  document.getElementById("pickerSeatLabel").textContent = `Assento ${n}`;
  document.getElementById("pickerModal").classList.add("open");
  buildPickerGrid();
}

function buildPickerGrid() {
  const pg = document.getElementById("pickerGrid"); pg.innerHTML = "";
  [...CARD_DB, ...COBRADORES].forEach(c => {
    const item = document.createElement("div");
    item.className = "picker-item"; item.textContent = c.nome;
    item.onclick = () => {
      const el = document.getElementById(`s-${currentSeatNo}`);
      el.dataset.id = c.id; el.textContent = c.nome;
      document.getElementById("pickerModal").classList.remove("open");
      render();
    };
    pg.appendChild(item);
  });
}

function mountBusVisual() {
  const bv = document.getElementById("busVisualSeats");
  for (let i = 1; i <= 12; i++) {
    const b = document.createElement("button");
    b.className = "bseat"; b.onclick = () => openPicker(i);
    bv.appendChild(b);
  }
}

function updateBusVisualLabels(state) {
  const bseats = document.querySelectorAll(".bseat");
  bseats.forEach((b, i) => {
    const { row, col } = seatNumToRC(i + 1);
    b.classList.toggle("occ", !!state.grid[row][col].card);
  });
}

function limparAssentos() { document.querySelectorAll(".seat-val").forEach(el => { el.dataset.id = ""; el.textContent = "Vazio"; }); render(); }
function novaPontuacao() { location.reload(); }
document.getElementById("pickerClose").onclick = () => document.getElementById("pickerModal").classList.remove("open");
document.getElementById("pickerClear").onclick = () => { document.getElementById(`s-${currentSeatNo}`).dataset.id = ""; document.getElementById(`s-${currentSeatNo}`).textContent = "Vazio"; document.getElementById("pickerModal").classList.remove("open"); render(); };