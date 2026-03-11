/* ============================
   HELPERS GERAIS
============================= */
const byName = (a,b)=> a.nome.localeCompare(b.nome);

/* ============================
   UI REFS
============================= */
const DRIVER_SEL = document.getElementById("driver");
const EXP_COB = document.getElementById("expCobradores");
const EXP_APX = document.getElementById("expApaixonados");
const EXP_PERR = document.getElementById("expPerrengues");
const EXP_ESTOU_NO_BUSAO = document.getElementById("expEstouNoBusao");
const EXP_LENDAS_URBANAS = document.getElementById("expLendasUrbanas");
const EXP_GRUPO_PAGODE = document.getElementById("expGrupoPagode");
const EXP_ROTAS_DIARIAS = document.getElementById("expRotasDiarias");
const DRIVER_INFO = document.getElementById("driverInfo");
const IMPROV_BUTTONS_WRAP = document.getElementById("improvButtons");
const IMPROV_INFO = document.getElementById("improvInfo");
const PERR_SECTION = document.getElementById("perrenguesSection");
const PERR_BUTTONS_WRAP = document.getElementById("perrenguesButtons");
const PERR_INFO = document.getElementById("perrenguesInfo");
const ROTAS_DIARIAS_SECTION = document.getElementById("rotasDiariasSection");
const ROTAS_DIARIAS_BUTTONS_WRAP = document.getElementById("rotasDiariasButtons");
const ROTAS_DIARIAS_INFO = document.getElementById("rotasDiariasInfo");
const GRID = document.getElementById("grid");
const EXPLAIN = document.getElementById("explain");
const totalScoreEl = document.getElementById("totalScore");
const sumPassengersEl = document.getElementById("sumPassengers");
const sumDriverEl = document.getElementById("sumDriver");
const sumImprovEl = document.getElementById("sumImprov");
const sumPerrenguesEl = document.getElementById("sumPerrengues");
const sumRotasDiariasEl = document.getElementById("sumRotasDiarias");
const sumHandEl = document.getElementById("sumHand");
const warningsEl = document.getElementById("warnings");
const playerNameEl = document.getElementById("playerName");
const playerTagEl = document.getElementById("playerTag");
const handCountEl = document.getElementById("handCount");
const rankTableBody = document.querySelector("#rankTable tbody");
const btnClearSeats = document.getElementById("btnClearSeats");
const btnNewRound = document.getElementById("btnNewRound");
const btnSaveScore = document.getElementById("btnSaveScore");
const btnResetRanking = document.getElementById("btnResetRanking");

/* ============================
   ABAS (topo)
============================= */
const topTabBtns = Array.from(document.querySelectorAll(".tabs-top .tabbtn"));
const topViews = {
  "tab-config": document.getElementById("tab-config"),
  "tab-seats": document.getElementById("tab-seats"),
  "tab-catalog": document.getElementById("tab-catalog"),
  "tab-regrasfaq": document.getElementById("tab-regrasfaq"),
};
topTabBtns.forEach(b=>{
  b.onclick = ()=>{
    topTabBtns.forEach(x=>x.classList.toggle("act", x===b));
    Object.entries(topViews).forEach(([k,el])=> el.classList.toggle("act", k===b.dataset.tab));
  };
});

/* ============================
   ABAS INTERNAS (Regras/FAQ)
============================= */
const itabBtns = Array.from(document.querySelectorAll(".itab"));
const itabPans = { regras: document.querySelector(".rules-container"), faq: document.getElementById("itab-faq") };
itabBtns.forEach(b=>{
  b.onclick = ()=>{
    itabBtns.forEach(x=> x.classList.remove("act"));
    b.classList.add("act");
    Object.entries(itabPans).forEach(([k,el]) => {
      if (el) el.style.display = k === b.dataset.itab ? 'block' : 'none';
    });
    itabBtns.forEach(x=> {
      const isAct = x.classList.contains("act");
      x.style.borderBottomColor = isAct ? "#60a5fa" : "transparent";
      x.style.color = isAct ? "#60a5fa" : "#cbd5e1";
    });
  };
});

/* ============================
   INIT CONFIG
============================= */
function buildOptions(list){
  const frag = document.createDocumentFragment();
  list.forEach(x=>{ const opt = document.createElement("option"); opt.value=x.id; opt.textContent=x.nome; frag.appendChild(opt); });
  return frag;
}

function mountLeft(){
  DRIVER_SEL.appendChild(buildOptions(DRIVERS));
  DRIVER_SEL.addEventListener("change", ()=>{ renderDriverInfo(); render(); });

  EXP_COB.addEventListener("change", ()=>{ rebuildSeatSelectOptions(); refreshSeatSelects(); render(); });
  EXP_APX.addEventListener("change", ()=>{ rebuildSeatSelectOptions(); refreshSeatSelects(); render(); });
  EXP_ESTOU_NO_BUSAO.addEventListener("change", ()=>{ rebuildSeatSelectOptions(); refreshSeatSelects(); render(); });
  EXP_LENDAS_URBANAS.addEventListener("change", ()=>{ rebuildSeatSelectOptions(); refreshSeatSelects(); render(); });
  EXP_GRUPO_PAGODE.addEventListener("change", ()=>{ rebuildSeatSelectOptions(); refreshSeatSelects(); render(); });

  EXP_PERR.addEventListener("change", ()=>{
    PERR_SECTION.style.display = EXP_PERR.checked ? "block" : "none";
    if (EXP_PERR.checked) {
      buildPerrengueButtons();
    } else {
      selectedPerrengueIds.clear();
    }
    render();
  });

  EXP_ROTAS_DIARIAS.addEventListener("change", ()=>{
    ROTAS_DIARIAS_SECTION.style.display = EXP_ROTAS_DIARIAS.checked ? "block" : "none";
    if (EXP_ROTAS_DIARIAS.checked) {
      buildRotasDiariasButtons();
    } else {
      selectedRotasDiariasIds.clear();
    }
    render();
  });

  buildImprovementButtons();

  playerNameEl.addEventListener("input", ()=>{ playerTagEl.textContent = playerNameEl.value? `Jogador: ${playerNameEl.value}`:""; });
  handCountEl.addEventListener("input", render);
  renderDriverInfo();
}

function renderDriverInfo(){
  const d = DRIVERS.find(x=>x.id===DRIVER_SEL.value);
  if(d?.id){
    DRIVER_INFO.innerHTML = `<div class="driver-card"><div><b>${d.nome}</b></div><div class="muted">+1 por cada ocorrência de: ${d.bonus.join(" • ")}</div></div>`;
  }else{
    DRIVER_INFO.innerHTML = `<div class="driver-card"><div><b>Sem motorista</b></div><div class="muted">Selecione um motorista para ativar o bônus.</div></div>`;
  }
  renderImprovInfo();
}

/* ============================
   MELHORIAS como BOTÕES
============================= */
let selectedImprovementIds = new Set();

function buildImprovementButtons(){
  IMPROV_BUTTONS_WRAP.innerHTML = "";
  IMPROVEMENTS.forEach(imp=>{
    const b = document.createElement("button");
    b.type="button";
    b.className = "btn btn-toggle btn-pill";
    b.textContent = imp.nome;
    b.onclick = ()=>{
      if(selectedImprovementIds.has(imp.id)){
        selectedImprovementIds.delete(imp.id);
        b.classList.remove("sel");
      }else{
        if(selectedImprovementIds.size>=3){
          alert("Você já selecionou 3 melhorias. Desmarque uma para escolher outra.");
          return;
        }
        selectedImprovementIds.add(imp.id);
        b.classList.add("sel");
      }
      renderImprovInfo();
      refreshSeatSelects();
      render();
    };
    IMPROV_BUTTONS_WRAP.appendChild(b);
  });
}

function getImprovements(){
  return [...selectedImprovementIds].map(id=>IMPROVEMENTS.find(i=>i.id===id)).filter(Boolean);
}

function renderImprovInfo(){
  const imps = getImprovements();
  IMPROV_INFO.innerHTML = imps.length
    ? imps.map(i => `<div class="improv-card"><div><b>${i.nome}</b></div><div class="muted">+1 por cada ocorrência de: ${i.bonus.join(" • ")}</div></div>`).join("")
    : `<div class="improv-card"><div><b>Nenhuma melhoria selecionada</b></div><div class="muted">Você pode ativar até 3 melhorias.</div></div>`;
}

/* ============================
   PERRENGUES como BOTÕES
============================= */
let selectedPerrengueIds = new Set();

function buildPerrengueButtons(){
  PERR_BUTTONS_WRAP.innerHTML = "";
  PERRENGUES.forEach(perr=>{
    const b = document.createElement("button");
    b.type="button";
    b.className = "btn btn-toggle btn-pill";
    b.textContent = perr.nome;
    b.onclick = ()=>{
      if(selectedPerrengueIds.has(perr.id)){
        selectedPerrengueIds.delete(perr.id);
        b.classList.remove("sel");
      }else{
        selectedPerrengueIds.add(perr.id);
        b.classList.add("sel");
      }
      renderPerrengueInfo();
      render();
    };
    PERR_BUTTONS_WRAP.appendChild(b);
  });
}

function getPerrengues(){
  return [...selectedPerrengueIds].map(id=>PERRENGUES.find(p=>p.id===id)).filter(Boolean);
}

function renderPerrengueInfo(){
  const perrengues = getPerrengues();
  PERR_INFO.innerHTML = perrengues.length
    ? perrengues.map(p => `<div class="improv-card"><div><b>${p.nome}</b></div><div class="muted">${p.efeito}</div></div>`).join("")
    : `<div class="improv-card"><div><b>Nenhum perrengue selecionado</b></div><div class="muted">Selecione os perrengues ativos.</div></div>`;
}

/* ============================
   ROTAS DIÁRIAS como BOTÕES
============================= */
let selectedRotasDiariasIds = new Set();

function buildRotasDiariasButtons(){
  ROTAS_DIARIAS_BUTTONS_WRAP.innerHTML = "";
  ROTAS_DIARIAS.forEach(rota=>{
    const b = document.createElement("button");
    b.type="button";
    b.className = "btn btn-toggle btn-pill";
    b.textContent = rota.nome;
    b.onclick = ()=>{
      if(selectedRotasDiariasIds.has(rota.id)){
        selectedRotasDiariasIds.delete(rota.id);
        b.classList.remove("sel");
      }else{
        selectedRotasDiariasIds.add(rota.id);
        b.classList.add("sel");
      }
      renderRotasDiariasInfo();
      render();
    };
    ROTAS_DIARIAS_BUTTONS_WRAP.appendChild(b);
  });
}

function getRotasDiarias(){
  return [...selectedRotasDiariasIds].map(id=>ROTAS_DIARIAS.find(r=>r.id===id)).filter(Boolean);
}

function renderRotasDiariasInfo(){
  const rotas = getRotasDiarias();
  ROTAS_DIARIAS_INFO.innerHTML = rotas.length
    ? rotas.map(r => `<div class="improv-card"><div><b>${r.nome}</b></div><div class="muted">${r.efeito}</div></div>`).join("")
    : `<div class="improv-card"><div><b>Nenhuma rota diária selecionada</b></div><div class="muted">Selecione as rotas diárias ativas.</div></div>`;
}

/* ============================
   GRID 2 × 6 (com selects escondidos)
============================= */
function mountGrid(){
  GRID.innerHTML="";
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const seatNo = r===0 ? (c+1) : (6+c+1);
      const seat = document.createElement("div");
      seat.className="seat";
      seat.dataset.row=r; seat.dataset.col=c; seat.dataset.seatno=seatNo;

      const pos = document.createElement("div"); pos.className="pos"; pos.textContent = `Assento ${seatNo}`; seat.appendChild(pos);

      const slot = document.createElement("div"); slot.className="slot";
      const sel = document.createElement("select");
      sel.className = "hidden-select seat-select";
      sel.appendChild(buildCardOptions(
        EXP_COB.checked,
        EXP_APX.checked,
        EXP_ESTOU_NO_BUSAO.checked,
        EXP_LENDAS_URBANAS.checked,
        EXP_GRUPO_PAGODE.checked
      ));
      sel.dataset.row=r; sel.dataset.col=c;

      sel.addEventListener("change", ()=>{
        const chosen = findAnyCard(sel.value);
        name.textContent = chosen ? chosen.nome : " Adicionar ";
        refreshSeatSelects();
        updateBusVisualLabels(collectState());
        render();
      });

      const name = document.createElement("div");
      name.className="slot-name muted"; name.textContent = "Adicionar ";

      seat.addEventListener("click", (ev)=>{
        if(ev.target.tagName.toLowerCase()==="select") return;
        openPickerForSeat(seatNo);
      });

      slot.appendChild(sel); seat.appendChild(slot); seat.appendChild(name); GRID.appendChild(seat);
    }
  }
  refreshSeatSelects();
}

function buildCardOptions(includeCobradores, includeApaixonados, includeEstouNoBusao, includeLendasUrbanas, includeGrupoPagode){
  const frag = document.createDocumentFragment();
  const empty = document.createElement("option"); empty.value=""; empty.textContent="— vazio —"; frag.appendChild(empty);

  const ogPass = document.createElement("optgroup"); ogPass.label="Passageiros";
  CARD_DB.slice().sort(byName).forEach(x=>{ const o=document.createElement("option"); o.value=x.id; o.textContent=x.nome; ogPass.appendChild(o); });
  frag.appendChild(ogPass);

  if(includeCobradores){
    const ogCob = document.createElement("optgroup"); ogCob.label="Cobradores (expansão)";
    COBRADORES.slice().sort(byName).forEach(x=>{ const o=document.createElement("option"); o.value=x.id; o.textContent=x.nome; ogCob.appendChild(o); });
    frag.appendChild(ogCob);
  }
  if(includeApaixonados){
    const ogApx = document.createElement("optgroup"); ogApx.label="Os Apaixonados (expansão)";
    APAIXONADOS.slice().sort(byName).forEach(x=>{ const o=document.createElement("option"); o.value=x.id; o.textContent=x.nome; ogApx.appendChild(o); });
    frag.appendChild(ogApx);
  }
  if(includeEstouNoBusao){
    const ogEstou = document.createElement("optgroup"); ogEstou.label="Estou no Busão (expansão)";
    ESTOU_NO_BUSAO.slice().sort(byName).forEach(x=>{ const o=document.createElement("option"); o.value=x.id; o.textContent=x.nome; ogEstou.appendChild(o); });
    frag.appendChild(ogEstou);
  }
  if(includeLendasUrbanas){
    const ogLendas = document.createElement("optgroup"); ogLendas.label="Lendas Urbanas (expansão)";
    LENDAS_URBANAS.slice().sort(byName).forEach(x=>{ const o=document.createElement("option"); o.value=x.id; o.textContent=x.nome; ogLendas.appendChild(o); });
    frag.appendChild(ogLendas);
  }
  if(includeGrupoPagode){
    const ogPagode = document.createElement("optgroup"); ogPagode.label="Grupo de Pagode (expansão)";
    GRUPO_PAGODE.slice().sort(byName).forEach(x=>{ const o=document.createElement("option"); o.value=x.id; o.textContent=x.nome; ogPagode.appendChild(o); });
    frag.appendChild(ogPagode);
  }
  return frag;
}

function rebuildSeatSelectOptions(){
  GRID.querySelectorAll("select.seat-select").forEach(sel=>{
    const prev = sel.value;
    sel.innerHTML = "";
    sel.appendChild(buildCardOptions(
      EXP_COB.checked,
      EXP_APX.checked,
      EXP_ESTOU_NO_BUSAO.checked,
      EXP_LENDAS_URBANAS.checked,
      EXP_GRUPO_PAGODE.checked
    ));

    const cardStillExists = !!findAnyCard(prev);
    sel.value = cardStillExists ? prev : "";

    const nameEl = sel.parentElement.nextElementSibling;
    const currentCard = findAnyCard(sel.value);
    if(nameEl) nameEl.textContent = currentCard ? currentCard.nome : " Adicionar ";
  });
}

/* ============================
   DUPLICATAS
============================= */
function getSelectedCardIds(){
  const ids=[]; GRID.querySelectorAll("select.seat-select").forEach(s=>{ if(s.value) ids.push(s.value); });
  return ids;
}

function allowDuplicate(id){
  const card = findAnyCard(id); return !!card?.allowDup;
}

/* ============================
   COBRADORES: só 1
============================= */
function countSelectedCobradores(exceptSel=null){
  let n=0;
  GRID.querySelectorAll("select.seat-select").forEach(s=>{
    if(exceptSel && s===exceptSel) return;
    if(isCobradorId(s.value)) n++;
  });
  return n;
}

function anyCobradorSelected(exceptSel=null){ return countSelectedCobradores(exceptSel)>0; }

/* ============================
   HELPERS DE POSIÇÃO
============================= */
function otherPos(pos){ return {row: pos.row===0?1:0, col: pos.col}; }
function seatNumToRC(n){ return n<=6 ? {row:0,col:n-1} : {row:1,col:n-7}; }

function isSeatBlockedByWilson(pos){
  const other = otherPos(pos);
  const otherSel = GRID.querySelector(`select.seat-select[data-row="${other.row}"][data-col="${other.col}"]`);
  return otherSel?.value === "wilson";
}

/* ============================
   HELPERS DE IDENTIFICAÇÃO
============================= */
function findAnyCard(id){
  if(!id) return null;
  return CARD_DB.find(x=>x.id===id) ||
         COBRADORES.find(x=>x.id===id) ||
         APAIXONADOS.find(x=>x.id===id) ||
         ESTOU_NO_BUSAO.find(x=>x.id===id) ||
         LENDAS_URBANAS.find(x=>x.id===id) ||
         GRUPO_PAGODE.find(x=>x.id===id) ||
         null;
}

function isCobradorId(id){ return COBRADORES.some(x=>x.id===id); }

/* ============================
   REGRAS DE EMBARQUE POR POSIÇÃO
============================= */
function hasCobradorElsewhere(state, pos){
  let n=0;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(r===pos.row && c===pos.col) continue;
    const card = state.grid[r][c].card;
    if(card?.isCobrador) n++;
  }
  return n>0;
}

function checkCardAllowedAt(card, pos, state){
  if(!card) return {ok:true};

  if(!card.allowDup && !card.isApaixonado){
    let dup=false;
    GRID.querySelectorAll("select.seat-select").forEach(s=>{
      if(+s.dataset.row===pos.row && +s.dataset.col===pos.col) return;
      if(s.value===card.id) dup=true;
    });
    if(dup) return {ok:false, reason:"Você já colocou esta carta em outro assento."};
  }

  if(isSeatBlockedByWilson(pos) && card.id!==""){
    return {ok:false, reason:"O Wilson está no ônibus e ocupa os 2 lugares desta coluna. Deixe este assento vazio."};
  }

  if(card.isCobrador && hasCobradorElsewhere(state, pos)){
    return {ok:false, reason:"Sô é permitido 1 cobrador por ônibus."};
  }

  if(typeof card.require === "function"){
    const {ctx} = buildCtx(state);
    try{
      const rq = card.require(ctx, pos);
      if(!rq.ok) return {ok:false, reason: rq.msg || "Exigência não atendida para embarcar."};
    }catch(e){
      console.error("Exigência de embarque inválida:", e);
      return {ok:false, reason:"Exigência não atendida para embarcar."};
    }
  }

  return {ok:true};
}

/* ============================
   CONTEXTO (cartas ativas)
============================= */
function neighbors(pos){
  const out=[];
  if(pos.col-1>=0) out.push({row:pos.row,col:pos.col-1});
  if(pos.col+1<COLS) out.push({row:pos.row,col:pos.col+1});
  const other = pos.row===0?1:0;
  for(let dc=-1; dc<=1; dc++){
    const cc = pos.col+dc;
    if(cc>=0 && cc<COLS) out.push({row:other,col:cc});
  }
  return out;
}

function buildCtx(state){
  const warnings = [];
  const memo = new Map();
  const key = (r,c)=> `${r},${c}`;
  const getPos = (r,c)=> state.grid[r][c];

  function isActiveAt(pos){
    const k = key(pos.row,pos.col);
    if(memo.has(k)) return memo.get(k);
    const card = getPos(pos.row,pos.col).card;
    let ok = false;
    if(card){
      if(typeof card.require === "function"){
        const proxy = {
          grid: state.grid,
          improvements: state.improvements,
          driver: state.driver,
          hasImprovement: (name)=> state.improvements.some(i=>i.nome===name),
          getPos,
          countBus: (pred)=> countBusActive(pred),
          countAdj: (p,pred)=> countAdjActive(p,pred),
          countAdjEmpty: (p)=> countAdjEmptyActive(p),
          countAheadBothRows: (p)=> countAheadBothRowsActive(p),
          existsId: (id)=> existsIdActive(id),
          isActiveAt: (p)=> isActiveAt(p),
        };
        try{ ok = !!card.require(proxy, pos)?.ok; }catch{ ok = false; }
      }else{
        ok = true;
      }
    }
    memo.set(k, ok);
    return ok;
  }

  function forEachActive(fn){
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      const card = state.grid[r][c].card;
      if(card && isActiveAt({row:r,col:c})) fn({row:r,col:c}, card);
    }
  }

  function countBusActive(pred){ let n=0; forEachActive((p,card)=>{ if(pred(card,p)) n++; }); return n; }


  function countAdjActive(pos,pred){
    let n=0; for(const nb of neighbors(pos)){ const card = state.grid[nb.row][nb.col].card; if(card && isActiveAt(nb) && pred(card, nb)) n++; } return n;
  }

  function countAdjEmptyActive(pos){
    let n=0; for(const nb of neighbors(pos)){ const card = state.grid[nb.row][nb.col].card; if(!card || !isActiveAt(nb)) n++; } return n;
  }

  function countAheadBothRowsActive(pos){
    let n=0; for(let c=0;c<pos.col;c++){
      const a = {row:0,col:c}, b={row:1,col:c};
      if(state.grid[a.row][a.col].card && isActiveAt(a)) n++;
      if(state.grid[b.row][b.col].card && isActiveAt(b)) n++;
    } return n;
  }

  function existsIdActive(id){ let found=false; forEachActive((_p,c)=>{ if(c.id===id) found=true; }); return found; }

  const ctx = {
    grid: state.grid,
    improvements: state.improvements,
    driver: state.driver,
    perrengues: state.perrengues,
    rotasDiarias: state.rotasDiarias,
    warn: (msg)=>warnings.push(msg),
    hasImprovement: (name)=> state.improvements.some(i=>i.nome===name),
    existsId: existsIdActive,
    getPos,
    forEachCard: forEachActive,
    countBus: (pred)=> countBusActive(pred),
    countAdj: (pos,pred)=> countAdjActive(pos,pred),
    countAdjEmpty: (pos)=> countAdjEmptyActive(pos),
    countAheadBothRows: (pos)=> countAheadBothRowsActive(pos),
    neighbors,
    isActiveAt,
  };
  return {ctx, warnings, isActiveAt};
}

function collectState(){
  const grid = Array.from({length:ROWS}, ()=>Array.from({length:COLS}, ()=>({card:null})));
  GRID.querySelectorAll("select.seat-select").forEach(sel=>{
    const id = sel.value; const r=+sel.dataset.row, c=+sel.dataset.col;
    grid[r][c].card = id ? findAnyCard(id) : null;
  });
  const d = DRIVERS.find(x=>x.id===DRIVER_SEL.value);
  const driver = d?.id ? d : null;
  const improvements = getImprovements();
  const perrengues = getPerrengues();
  const rotasDiarias = getRotasDiarias();
  const hand = Math.max(0, +handCountEl.value||0);
  return {grid, driver, improvements, perrengues, rotasDiarias, hand};
}

/* ============================
   BUS VISUAL
============================= */
const BUS_SEATS = document.getElementById("busVisualSeats");
let currentBusFocus = null;

function mountBusVisual(){
  BUS_SEATS.innerHTML = "";
  for(let n=1;n<=12;n++){
    const b = document.createElement("button");
    b.type="button"; b.className="bseat"; b.textContent = n;
    b.dataset.seatno = n;
    b.addEventListener("click", ()=>{ focusGridSeat(n,true); openPickerForSeat(n); });
    BUS_SEATS.appendChild(b);
  }
  document.getElementById("btnVisualHelp").onclick=()=>document.getElementById("visualHelp").classList.toggle("open");
}

function updateBusVisualLabels(state){
  const items = BUS_SEATS.querySelectorAll(".bseat");
  items.forEach(el=>{
    const n = +el.dataset.seatno;
    const {row,col} = seatNumToRC(n);
    const card = state.grid[row][col].card;
    const label = card ? `${n} — ${card.nome}` : `${n} — Vazio`;
    el.dataset.label = label;
    el.setAttribute("aria-current", currentBusFocus===n ? "true" : "false");
    el.classList.toggle("occ", !!card);
  });
}

function seatNumber(pos){ return pos.row===0 ? (pos.col+1) : (6+pos.col+1); }

function focusGridSeat(n, fromBus=false){
  const {row,col} = seatNumToRC(n);
  const seatEl = GRID.querySelector(`.seat[data-row="${row}"][data-col="${col}"]`);
  if(seatEl){
    seatEl.classList.add("hl");
    setTimeout(()=> seatEl.classList.remove("hl"), 700);
    if(fromBus){ currentBusFocus = n; updateBusVisualLabels(collectState()); }
    seatEl.scrollIntoView({behavior:"smooth", block:"center"});
    scrollExplainToSeat(n);
  }
}

/* ============================
   RENDER / DETALHES
   Cálculo delegado a GameLogic.js
============================= */

function buildPassengerRow(d) {
  if (d.inactive) {
    const msg = `<span class="req-badge">Exigência não atendida</span> <span class="req-text">${d.requireMsg || ""}</span>\n${d.cardInfo}`;
    return rowLine(d.who, 0, msg, d.seatId, "req");
  }
  if (d.mateusBonus !== undefined) {
    const mateusDetail = d.mateusBonus.score > 0
      ? `${d.cardInfo}\nBônus Coringa: +${d.mateusBonus.score}. Tags escolhidas: ${d.mateusBonus.breakdown}.`
      : `${d.cardInfo}\nBônus Coringa: +0. <span class="req-text">Selecione um motorista ou melhorias para calcular o bônus ideal.</span>`;
    return rowLine(d.who, d.delta, mateusDetail, d.seatId);
  }
  const notes = [d.cardInfo, ...(d.abilityNotes || [])];
  if (d.scoreSuppressed) {
    notes.push(`<span class="noscore-badge">Sem pontuação</span> <span class="req-text">${d.scoreReqMsg || ""}</span>\n(Continua contando para motorista, melhorias e adjacências)`);
  }
  if (d.duringNote) notes.push(`Nota: ${d.duringNote}`);
  return rowLine(d.who, d.delta, notes.join("\n"), d.seatId, d.scoreSuppressed ? "sc" : "");
}

function render(){
  const state = collectState();
  updateBusVisualLabels(state);

  const tableCards = [];
  for(let r = 0; r < ROWS; r++) for(let c = 0; c < COLS; c++) {
    if(state.grid[r][c].card) tableCards.push({ card: state.grid[r][c].card, row: r, col: c });
  }

  const logic = new GameLogic({
    driver:       state.driver,
    improvements: state.improvements,
    perrengues:   state.perrengues,
    rotasDiarias: state.rotasDiarias,
    expansions:   { apaixonados: EXP_APX.checked, grupoPagode: EXP_GRUPO_PAGODE.checked },
  });

  const { total, breakdown, warnings } = logic.calculate(tableCards, state.hand);

  sumPassengersEl.textContent   = breakdown.passengers.score;
  sumDriverEl.textContent       = breakdown.driver.score;
  sumImprovEl.textContent       = breakdown.improvements.score;
  sumPerrenguesEl.textContent   = breakdown.perrengues.score;
  sumRotasDiariasEl.textContent = breakdown.rotasDiarias.score;
  sumHandEl.textContent         = breakdown.hand.score;

  totalScoreEl.textContent = total;
  let scoreClass = "neu";
  if(total > 0) scoreClass = "good";
  else if(total < 0) scoreClass = "bad";
  totalScoreEl.className = "v kpi " + scoreClass;

  const w = [];
  if(breakdown.improvements.note) w.push(breakdown.improvements.note);
  if(breakdown.grupoPagode.note)  w.push(breakdown.grupoPagode.note);
  if(breakdown.hand.hasIsabel && state.hand > 0 && !breakdown.hand.hasEdio)
    w.push("Isabel (A Artesã) presente: cartas na mão não descontam pontos.");
  if(breakdown.hand.hasIsabel && breakdown.hand.hasEdio && state.hand > 0)
    w.push("Édio e Isabel juntos: cartas na mão valem +1 ponto cada.");
  if(warnings.length) w.push(...warnings);
  warningsEl.innerHTML = w.length ? `<div class="kpi warn">⚠ ${w.join("<br>⚠ ")}</div>` : "";

  const lines = [
    ...breakdown.passengers.details.map(buildPassengerRow),
    ...breakdown.improvements.details.map(x => rowLine(x.who, x.delta, x.detail)),
    ...breakdown.perrengues.details.map(x   => rowLine(x.who, x.delta, x.detail)),
    ...breakdown.rotasDiarias.details.map(x  => rowLine(x.who, x.delta, x.detail)),
    ...(breakdown.apaixonados.details || []).map(x => rowLine(x.who, x.delta, x.detail)),
  ];

  if(breakdown.grupoPagode.score > 0) {
    lines.push(rowLine("[Grupo de Pagode] Completo!", breakdown.grupoPagode.score, "Reuniu os 5 integrantes do Grupo de Pagode!"));
  }

  lines.push(rowLine("[Mão]", breakdown.hand.score, breakdown.hand.detail));

  EXPLAIN.innerHTML = lines.join("");
  if(currentBusFocus) scrollExplainToSeat(currentBusFocus);
}

function scoreSpan(score){
  if(score > 0) return `<span class="kpi good">+${score}</span>`;
  if(score < 0) return `<span class="kpi bad">${score}</span>`;
  return `<span class="kpi neu">${score}</span>`;
}

function rowLine(name,score,detail,seatId, extraCls=""){
  const idAttr = seatId ? `id="exp-seat-${seatId}"` : "";
  return `<div class="row ${extraCls}" ${idAttr}>
    <div class="h"><div class="name">${name}</div><div class="score">${scoreSpan(score)}</div></div>
    ${detail?`<div class="d">${detail}</div>`:""}
  </div>`;
}

function scrollExplainToSeat(n){
  const el=document.getElementById(`exp-seat-${n}`);
  if(el){ el.classList.add("hl"); setTimeout(()=>el.classList.remove("hl"),1200); el.scrollIntoView({behavior:"smooth",block:"nearest"}); }
}

/* ============================
   DESABILITAR OPÇÕES NO SELECT
============================= */
function refreshSeatSelects(){
  const state = collectState();

  GRID.querySelectorAll("select.seat-select").forEach(sel=>{
    const r = +sel.dataset.row, c = +sel.dataset.col;
    const pos = {row:r,col:c};
    const blockedByWilson = isSeatBlockedByWilson(pos);
    const otherHasCobrador = anyCobradorSelected(sel);

    Array.from(sel.options).forEach(opt=>{
      if(!opt.value){ opt.disabled=false; return; }
      const id = opt.value;
      const isDup = getSelectedCardIds().includes(id) && sel.value!==id && !allowDuplicate(id);
      let disable = isDup;

      if(blockedByWilson) disable = true;

      if(!disable){
        const card = findAnyCard(id);
        if(card){
          if(card.isCobrador && otherHasCobrador) disable = true;
          else{
            const {ok} = checkCardAllowedAt(card, pos, state);
            disable = !ok;
          }
        }
      }
      opt.disabled = disable;
    });

    sel.title = blockedByWilson ? "Bloqueado: Wilson ocupa os 2 lugares desta coluna." : "";
    const card = findAnyCard(sel.value);
    const nameEl = sel.parentElement.nextElementSibling;
    if(nameEl) nameEl.textContent = card ? card.nome : " Adicionar ";
  });
}

/* ============================
   CATÁLOGO + BUSCA
============================= */
const BADGE_LABELS = {
  exp:"Expansão", req:"Exigência", pen:"Penalidade", hab:"Habilidade",
  motorista:"Motorista", melhoria:"Melhoria", perrengue:"Perrengue",
  rotadiaria:"Rota Diária", pagode:"Pagode", lenda:"Lenda", estounobusao:"Estou no Busão"
};

const catalogContentEl = document.getElementById("catalogContent");
const catalogSearchEl = document.getElementById("catalogSearch");

const catalogFilters = { faixa: null, temper: null, comp: null, expansao: null };

function refreshCatalog(){ buildCatalog(catalogSearchEl.value); }

document.getElementById("clearCatalogSearch").onclick = ()=>{
  catalogSearchEl.value = "";
  catalogFilters.faixa = null; catalogFilters.temper = null;
  catalogFilters.comp = null; catalogFilters.expansao = null;
  document.querySelectorAll(".cat-filter-btn.act").forEach(b=>b.classList.remove("act"));
  buildCatalog("");
};
catalogSearchEl?.addEventListener("input", refreshCatalog);

document.querySelectorAll(".cat-filter-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const f = btn.dataset.filter, v = btn.dataset.value;
    if(catalogFilters[f] === v){
      catalogFilters[f] = null;
      btn.classList.remove("act");
    } else {
      document.querySelectorAll(`.cat-filter-btn[data-filter="${f}"]`).forEach(b=>b.classList.remove("act"));
      catalogFilters[f] = v;
      btn.classList.add("act");
    }
    refreshCatalog();
  });
});

function norm(s){ return String(s||"").normalize("NFD").replaceAll(/\p{Diacritic}/gu,"").toLowerCase(); }

function cardMatchesFilter(card, q){
  if(q){
    const nq = norm(q);
    let tipo;
    if(card.isCobrador) tipo = "cobrador";
    else if(card.isApaixonado) tipo = "apaixonado";
    else tipo = "passageiro";
    const hay = [card.nome, card.faixa, card.temper, card.comp, card.text||"", card.note||"", tipo].join(" ");
    if(!norm(hay).includes(nq)) return false;
  }
  if(catalogFilters.faixa && card.faixa !== catalogFilters.faixa) return false;
  if(catalogFilters.temper && card.temper !== catalogFilters.temper) return false;
  if(catalogFilters.comp && card.comp !== catalogFilters.comp) return false;
  return true;
}

function buildCatalog(q){
  const tagFilterActive = catalogFilters.faixa || catalogFilters.temper || catalogFilters.comp;
  const expFilter = catalogFilters.expansao;

  const groups = [
    {
      title: "Motoristas",
      expansaoId: "motoristas",
      hasTagAttrs: false,
      items: DRIVERS.filter(d => d.id),
      render: d => ({
        name: d.nome,
        pts: "+1 por cada tag",
        tags: d.bonus.join(" • "),
        text: "Concede +1 por cada ocorrência das 3 subcategorias.",
        badges: ["motorista"]
      })
    },
    {
      title: "Melhorias",
      expansaoId: "melhorias",
      hasTagAttrs: false,
      items: IMPROVEMENTS,
      render: i => ({
        name: i.nome,
        pts: "+1 por cada tag",
        tags: i.bonus.join(" • "),
        text: "Soma +1 por cada ocorrência nas cartas ativas.",
        badges: ["melhoria"]
      })
    },
    {
      title: "Perrengues (expansão)",
      expansaoId: "perrengues",
      hasTagAttrs: false,
      items: PERRENGUES.filter(p => cardMatchesFilter(p, q)),
      render: p => ({
        name: p.nome,
        pts: "Efeito variável",
        tags: p.bonus.join(" • "),
        text: p.efeito,
        badges: ["exp", "perrengue"]
      })
    },
    {
      title: "Rotas Diárias (expansão)",
      expansaoId: "rotasdiarias",
      hasTagAttrs: false,
      items: ROTAS_DIARIAS.filter(r => cardMatchesFilter(r, q)),
      render: r => ({
        name: r.nome,
        pts: `${r.pontos} pts`,
        tags: r.bonus.join(" • "),
        text: r.efeito,
        badges: ["exp", "rotadiaria"]
      })
    },
    {
      title: "Passageiros",
      expansaoId: "base",
      hasTagAttrs: true,
      items: CARD_DB.filter(c => cardMatchesFilter(c, q)),
      render: c => ({
        name: c.nome,
        pts: `${c.base} pts`,
        tags: `${c.faixa} • ${c.temper} • ${c.comp}`,
        text: c.text || "",
        badges: [
          c.require ? "req" : "",
          c.penalty && !c.ability ? "pen" : "",
          c.ability ? "hab" : ""
        ].filter(Boolean)
      })
    },
    {
      title: "Cobradores (expansão)",
      expansaoId: "cobradores",
      hasTagAttrs: true,
      items: COBRADORES.filter(c => cardMatchesFilter(c, q)),
      render: c => ({
        name: c.nome,
        pts: "Habilidade",
        tags: "[Cobrador] • +2 por tag correspondente",
        text: c.text || "",
        badges: ["exp", "hab"]
      })
    },
    {
      title: "Apaixonados (expansão)",
      expansaoId: "apaixonados",
      hasTagAttrs: true,
      items: APAIXONADOS.filter(a => cardMatchesFilter(a, q)),
      render: a => ({
        name: a.nome,
        pts: `${a.base} pts`,
        tags: `${a.faixa} • ${a.temper} • ${a.comp} • [Apaixonado]`,
        text: a.text || "",
        badges: ["exp", "hab"]
      })
    },
    {
      title: "Estou no Busão (expansão)",
      expansaoId: "estounobusao",
      hasTagAttrs: true,
      items: ESTOU_NO_BUSAO.filter(e => cardMatchesFilter(e, q)),
      render: e => ({
        name: e.nome,
        pts: `${e.base} pts`,
        tags: `${e.faixa} • ${e.temper} • ${e.comp}`,
        text: e.text || e.note || "",
        badges: ["exp", "estounobusao"]
      })
    },
    {
      title: "Lendas Urbanas (expansão)",
      expansaoId: "lendas",
      hasTagAttrs: true,
      items: LENDAS_URBANAS.filter(l => cardMatchesFilter(l, q)),
      render: l => ({
        name: l.nome,
        pts: `${l.base} pts`,
        tags: `${l.faixa} • ${l.temper} • ${l.comp}`,
        text: l.text || "",
        badges: ["exp", "lenda"]
      })
    },
    {
      title: "Grupo de Pagode (expansão)",
      expansaoId: "pagode",
      hasTagAttrs: true,
      items: GRUPO_PAGODE.filter(g => cardMatchesFilter(g, q)),
      render: g => ({
        name: g.nome,
        pts: `${g.base} pts`,
        tags: `${g.faixa} • ${g.temper} • ${g.comp} • [Pagode]`,
        text: g.text || "",
        badges: ["exp", "pagode"]
      })
    }
  ];

  const visible = groups.filter(g => {
    if(expFilter && g.expansaoId !== expFilter) return false;
    if(tagFilterActive && !g.hasTagAttrs) return false;
    return true;
  });

  const html = visible.map(g=>{
    const inner = g.items.map(it=>{
      const m = g.render(it);
      const badges = (m.badges||[]).map(b=>{
        const label = BADGE_LABELS[b] || b;
        return `<span class="badge ${b}">${label}</span>`;
      }).join("");
      return `<div class="cat-item">
        <div class="cat-head"><div class="cat-name">${m.name}</div><div class="cat-pts">${m.pts}</div></div>
        <div class="cat-tags">${badges} ${m.tags}</div>
        ${m.text?`<div class="cat-text">${m.text}</div>`:""}
      </div>`;
    }).join("");
    return g.items.length > 0 ? `<div class="cat-group"><h3>${g.title}</h3>${inner}</div>` : "";
  }).join("");
  catalogContentEl.innerHTML = html || `<div class="muted" style="padding:12px">Nenhuma carta encontrada para os filtros selecionados.</div>`;
}

/* ============================
   PICKER (modal de seleção)
============================= */
const pickerModal = document.getElementById("pickerModal");
const pickerGrid = document.getElementById("pickerGrid");
const pickerTitle = document.getElementById("pickerTitle");
const pickerSeatLabel = document.getElementById("pickerSeatLabel");
const pickerSearch = document.getElementById("pickerSearch");
const pickerClear = document.getElementById("pickerClear");
const pickerClose = document.getElementById("pickerClose");
let currentSeatNo = null;

function openPickerForSeat(seatNo){
  currentSeatNo = seatNo;
  pickerSeatLabel.textContent = `Assento ${seatNo}`;
  pickerModal.showModal();
  buildPickerGrid("pass", "");
  pickerSearch.value = "";
}

function closePicker(){ pickerModal.close(); currentSeatNo=null; }
pickerModal.addEventListener("close", ()=>{ currentSeatNo=null; });

pickerClose.onclick = closePicker;
pickerClear.onclick = ()=>{
  if(currentSeatNo){
    const {row,col} = seatNumToRC(currentSeatNo);
    const sel = GRID.querySelector(`select.seat-select[data-row="${row}"][data-col="${col}"]`);
    if(sel){ sel.value=""; sel.dispatchEvent(new Event("change")); }
    closePicker();
  }
};

function buildPickerGrid(tab, q){
  const state = collectState();
  const filter = (c)=> {
    const normText = norm(c.nome + " " + (c.text || "") + " " + (c.note || "") + " " + c.faixa + " " + c.temper + " " + c.comp);
    return normText.includes(norm(q));
  };

  let list=[];
  if(tab==="pass") list = CARD_DB.filter(filter);
  else if(tab==="cob" && EXP_COB.checked) list = COBRADORES.filter(filter);
  else if(tab==="apx" && EXP_APX.checked) list = APAIXONADOS.filter(filter);
  else if(tab==="estou" && EXP_ESTOU_NO_BUSAO.checked) list = ESTOU_NO_BUSAO.filter(filter);
  else if(tab==="lendas" && EXP_LENDAS_URBANAS.checked) list = LENDAS_URBANAS.filter(filter);
  else if(tab==="pagode" && EXP_GRUPO_PAGODE.checked) list = GRUPO_PAGODE.filter(filter);

  pickerGrid.innerHTML = "";
  list.slice().sort(byName).forEach(card=>{
    const item = document.createElement("div");
    item.className="picker-item";
    item.innerHTML = `<div class="picker-name">${card.nome}</div><div class="picker-tags">${card.faixa||""} ${card.temper||""} ${card.comp||""}</div>`;
    const {row,col} = seatNumToRC(currentSeatNo);
    const check = checkCardAllowedAt(card,{row,col},state);
    if(!check.ok){ item.classList.add("disabled"); item.title=check.reason||""; }
    item.onclick=()=>{
      if(item.classList.contains("disabled")) return;
      const sel = GRID.querySelector(`select.seat-select[data-row="${row}"][data-col="${col}"]`);
      if(sel){ sel.value=card.id; sel.dispatchEvent(new Event("change")); }
      closePicker();
    };
    pickerGrid.appendChild(item);
  });
}

document.querySelectorAll(".pill").forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll(".pill").forEach(x=>x.classList.remove("act"));
    b.classList.add("act");
    buildPickerGrid(b.dataset.tab,pickerSearch.value);
  };
});

pickerSearch.addEventListener("input", ()=>{
  const tab = document.querySelector(".pill.act")?.dataset.tab || "pass";
  buildPickerGrid(tab,pickerSearch.value);
});

/* ============================
   RANKING (localStorage)
============================= */
function saveScore(){
  const state=collectState();
  const total=+totalScoreEl.textContent;
  const entry={
    jogador: playerNameEl.value||"—",
    motorista: state.driver? state.driver.nome : "—",
    melhorias: state.improvements.map(i=>i.nome).join(", "),
    score: total
  };
  const arr = JSON.parse(localStorage.getItem("busaoRanking")||"[]");
  arr.push(entry);
  localStorage.setItem("busaoRanking", JSON.stringify(arr));
  renderRanking();
}

function resetRanking(){
  if(confirm("Deseja realmente zerar o ranking?")){
    localStorage.removeItem("busaoRanking");
    renderRanking();
  }
}

function renderRanking(){
  const arr = JSON.parse(localStorage.getItem("busaoRanking")||"[]");
  rankTableBody.innerHTML = arr.map((e,i)=>
    `<tr><td>${i+1}</td><td>${e.jogador}</td><td>${e.motorista}</td><td>${e.melhorias}</td><td class="right">${e.score}</td></tr>`
  ).join("");
}

btnSaveScore.onclick = saveScore;
btnResetRanking.onclick = resetRanking;

/* ============================
   AÇÕES DOS BOTÕES PRINCIPAIS
============================= */
btnClearSeats.onclick = ()=>{
  GRID.querySelectorAll("select.seat-select").forEach(sel=>{ sel.value=""; });
  rebuildSeatSelectOptions();
  refreshSeatSelects();
  render();
};

btnNewRound.onclick = ()=>{
  if(confirm("Deseja limpar toda a configuração (motorista, melhorias, assentos) para uma nova pontuação?")){
    GRID.querySelectorAll("select.seat-select").forEach(sel=>{ sel.value=""; });
    DRIVER_SEL.value="";
    selectedImprovementIds.clear();
    buildImprovementButtons();
    selectedPerrengueIds.clear();
    if(EXP_PERR.checked) buildPerrengueButtons();
    selectedRotasDiariasIds.clear();
    if(EXP_ROTAS_DIARIAS.checked) buildRotasDiariasButtons();
    playerNameEl.value = "";
    handCountEl.value = "0";
    rebuildSeatSelectOptions();
    refreshSeatSelects();
    renderDriverInfo();
    render();
  }
};

/* ============================
   INTEGRAÇÃO DO SCANNER (OCR)
============================= */

/**
 * Aplica o resultado do scanZonas() ao estado do formulário e exibe
 * um resumo para o usuário confirmar antes de calcular.
 *
 * @param {Object} data       — retorno de camera.scanZonas()
 * @param {HTMLElement} confirmEl — elemento onde o resumo será renderizado
 * @param {function} onConfirm   — callback chamado após o usuário confirmar
 */
function processScanResult(data, confirmEl, onConfirm) {
  // ── Resolver objetos completos a partir dos IDs do OCR ──────────
  const driverMatch    = data.motorista?.found?.[0]    ?? null;
  const improvMatches  = (data.melhorias?.found         ?? []).slice(0, 3);
  const perrengueMatch = data.perrengue?.found?.[0]    ?? null;
  const rotaMatch      = data.rota?.found?.[0]         ?? null;
  const passMatches    = (data.passageiros?.found       ?? []).slice(0, ROWS * COLS);

  const driver       = driverMatch    ? DRIVERS.find(x => x.id === driverMatch.id)       ?? null : null;
  const improvements = improvMatches.map(m => IMPROVEMENTS.find(x => x.id === m.id)).filter(Boolean);
  const perrengueObj = perrengueMatch ? PERRENGUES.find(x => x.id === perrengueMatch.id) ?? null : null;
  const rotaObj      = rotaMatch      ? ROTAS_DIARIAS.find(x => x.id === rotaMatch.id)   ?? null : null;

  const tableCards = passMatches.map((m, i) => ({
    card: findAnyCard(m.id),
    row:  Math.floor(i / COLS),
    col:  i % COLS,
  })).filter(x => x.card);

  // ── Calcular pontuação via GameLogic ────────────────────────────
  const logic = new GameLogic({
    driver,
    improvements,
    perrengues:   perrengueObj ? [perrengueObj] : [],
    rotasDiarias: rotaObj      ? [rotaObj]      : [],
    rows: ROWS,
    cols: COLS,
  });
  const result = logic.calculate(tableCards, 0);
  const bd     = result.breakdown;

  // ── Montar Recibo de Viagem ──────────────────────────────────────
  const fmtDelta = (n) => (n >= 0 ? `+${n}` : `${n}`);

  const reciboRows = [
    { label: `Passageiros (${tableCards.length})`,     score: bd.passengers.score   },
    driver       ? { label: `Motorista: ${driver.nome}`,          score: bd.driver.score       } : null,
    improvements.length
                 ? { label: `Melhorias (${improvements.length})`, score: bd.improvements.score } : null,
    perrengueObj ? { label: `Perrengue: ${perrengueObj.nome}`,    score: bd.perrengues.score   } : null,
    rotaObj      ? { label: `Rota: ${rotaObj.nome}`,              score: bd.rotasDiarias.score } : null,
  ].filter(Boolean);

  const reciboHtml = reciboRows.map(r =>
    `<div class="recibo-row">
       <span>${r.label}</span>
       <span class="${r.score >= 0 ? 'recibo-pos' : 'recibo-neg'}">${fmtDelta(r.score)}</span>
     </div>`
  ).join('');

  // ── Texto-resumo das cartas encontradas ─────────────────────────
  const parts = [];
  if (driver)           parts.push(`motorista <b>${driver.nome}</b>`);
  else                  parts.push('nenhum motorista');
  if (improvements.length) parts.push(`${improvements.length} melhoria(s)`);
  if (perrengueObj)     parts.push(`perrengue <b>${perrengueObj.nome}</b>`);
  if (rotaObj)          parts.push(`rota <b>${rotaObj.nome}</b>`);
  parts.push(`${passMatches.length} passageiro(s)`);

  const passPreview = passMatches.length
    ? `<div class="scan-cards-preview">${
        passMatches.map(p =>
          `<span class="scan-tag">${p.nome}<span class="scan-score"> ${Math.round(p.score * 100)}%</span></span>`
        ).join('')
      }</div>`
    : '';

  confirmEl.innerHTML = `
    <div class="recibo-viagem">
      <div class="recibo-total">
        <span class="recibo-total-label">Pontuacao estimada</span>
        <span class="recibo-total-num">${result.total}</span>
      </div>
      <div class="recibo-breakdown">${reciboHtml}</div>
      <p class="scan-summary">Encontrei: ${parts.join(', ')}.</p>
      ${passPreview}
      <button id="scanConfirmBtn" class="scan-confirm-btn">Confirmar e aplicar</button>
    </div>
  `;
  confirmEl.hidden = false;

  document.getElementById('scanConfirmBtn').addEventListener('click', () => {
    _applyScanToState(driver, improvements, perrengueObj, rotaObj, passMatches);
    onConfirm?.();
  });
}

/**
 * Escreve os dados do scanner nos controles do formulário principal
 * e dispara render().
 */
function _applyScanToState(driver, improvements, perrengueObj, rotaObj, passMatches) {
  // ── Motorista ──
  if (driver) { DRIVER_SEL.value = driver.id; renderDriverInfo(); }

  // ── Melhorias ──
  selectedImprovementIds.clear();
  improvements.forEach(imp => selectedImprovementIds.add(imp.id));
  IMPROV_BUTTONS_WRAP.querySelectorAll('button').forEach(btn => {
    const imp = IMPROVEMENTS.find(i => i.nome === btn.textContent.trim());
    btn.classList.toggle('sel', !!imp && selectedImprovementIds.has(imp.id));
  });
  renderImprovInfo();

  // ── Perrengue ──
  selectedPerrengueIds.clear();
  if (perrengueObj) selectedPerrengueIds.add(perrengueObj.id);
  PERR_BUTTONS_WRAP.querySelectorAll('button').forEach(btn => {
    const p = PERRENGUES.find(x => x.nome === btn.textContent.trim());
    btn.classList.toggle('sel', !!p && selectedPerrengueIds.has(p.id));
  });
  renderPerrengueInfo();

  // ── Rota Diária ──
  selectedRotasDiariasIds.clear();
  if (rotaObj) selectedRotasDiariasIds.add(rotaObj.id);
  ROTAS_DIARIAS_BUTTONS_WRAP.querySelectorAll('button').forEach(btn => {
    const r = ROTAS_DIARIAS.find(x => x.nome === btn.textContent.trim());
    btn.classList.toggle('sel', !!r && selectedRotasDiariasIds.has(r.id));
  });
  renderRotasDiariasInfo();

  // ── Passageiros ──
  GRID.querySelectorAll('select.seat-select').forEach(sel => { sel.value = ''; });
  const seats = Array.from(GRID.querySelectorAll('select.seat-select'));
  passMatches.forEach((match, i) => {
    if (i >= seats.length) return;
    if (findAnyCard(match.id)) seats[i].value = match.id;
  });
  GRID.querySelectorAll('select.seat-select').forEach(sel => {
    const card  = findAnyCard(sel.value);
    const label = sel.parentElement.nextElementSibling;
    if (label) label.textContent = card ? card.nome : ' Adicionar ';
  });

  refreshSeatSelects();
  render();
}

/* ============================
   INICIALIZAÇÃO
============================= */
mountLeft();
mountGrid();
mountBusVisual();
buildCatalog("");
renderRanking();
render();
