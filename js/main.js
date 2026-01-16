/* ============================
   GRID 2 × 6 (com selects escondidos)
============================= */
const ROWS=2, COLS=6;

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
      sel.className = "hidden-select seat-select"; // escondido; controlado pelo modal
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

/* Opções por select */
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

/* ======= DUPLICATAS ======= */
function getSelectedCardIds(){
  const ids=[]; GRID.querySelectorAll("select.seat-select").forEach(s=>{ if(s.value) ids.push(s.value); });
  return ids;
}

function allowDuplicate(id){
  const card = findAnyCard(id); return !!card?.allowDup;
}

function isCardSelectedElsewhere(id, sel){
  let dup=false;
  GRID.querySelectorAll("select.seat-select").forEach(s=>{
    if(s!==sel && s.value===id) dup=true;
  });
  return dup && !allowDuplicate(id);
}

/* ======= COBRADORES: só 1 ======= */
function countSelectedCobradores(exceptSel=null){
  let n=0;
  GRID.querySelectorAll("select.seat-select").forEach(s=>{
    if(exceptSel && s===exceptSel) return;
    if(isCobradorId(s.value)) n++;
  });
  return n;
}

function anyCobradorSelected(exceptSel=null){ return countSelectedCobradores(exceptSel)>0; }

/* helpers posição */
function otherPos(pos){ return {row: pos.row===0?1:0, col: pos.col}; }
function seatNumToRC(n){ if(n<=6) return {row:0,col:n-1}; return {row:1,col:n-7}; }

function isSeatBlockedByWilson(pos){
  const other = otherPos(pos);
  const otherSel = GRID.querySelector(`select.seat-select[data-row="${other.row}"][data-col="${other.col}"]`);
  return otherSel && otherSel.value==="wilson";
}

/* ============================
   CONTEXTO (cartas ativas)
============================= */
function buildCtx(state){
  const warnings = [];
  const memo = new Map();
  const key = (r,c)=> `${r},${c}`;
  const getPos = (r,c)=> state.grid[r][c];
  
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
  
  function neighborsList(pos){ return neighbors(pos); }
  
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
  
  function existsIdActive(id){ let found=false; forEachActive((p,c)=>{ if(c.id===id) found=true; }); return found; }

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
    neighbors: neighborsList,
  };
  return {ctx, warnings, isActiveAt};
}

function collectState(){
  const grid = [...Array(ROWS)].map(()=>[...Array(COLS)].map(()=>({card:null})));
  GRID.querySelectorAll("select.seat-select").forEach(sel=>{
    const id = sel.value; const r=+sel.dataset.row, c=+sel.dataset.col;
    grid[r][c].card = id ? findAnyCard(id) : null;
  });
  const d = DRIVERS.find(x=>x.id===DRIVER_SEL.value);
  const driver = d && d.id ? d : null;
  const improvements = getImprovements();
  const perrengues = getPerrengues();
  const rotasDiarias = getRotasDiarias();
  const hand = Math.max(0, +handCountEl.value||0);
  return {grid, driver, improvements, perrengues, rotasDiarias, hand};
}

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

function isCobradorId(id){ return !!COBRADORES.find(x=>x.id===id); }
function isApaixonadoId(id){ return !!APAIXONADOS.find(x=>x.id===id); }
function isEstouNoBusaoId(id){ return !!ESTOU_NO_BUSAO.find(x=>x.id===id); }
function isLendaId(id){ return !!LENDAS_URBANAS.find(x=>x.id===id); }
function isPagodeId(id){ return !!GRUPO_PAGODE.find(x=>x.id===id); }

/* ======= Regras de embarque por posição ======= */
function hasCobradorElsewhere(state, pos){
  let n=0;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(r===pos.row && c===pos.col) continue;
    const card = state.grid[r][c].card;
    if(card && card.isCobrador) n++;
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
      return {ok:false, reason:"Exigência não atendida para embarcar."};
    }
  }
  
  return {ok:true};
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
    el.setAttribute("data-label", label);
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
   Pontuação
============================= */
function scoreDriver(state, ctx){
  if(!state.driver) return 0;
  const b = state.driver.bonus;
  let n=0;
  
  ctx.forEachCard((p,c)=>{ 
    if(c.isCobrador || c.id === 'mateus') return;
    if([c.faixa,c.temper,c.comp].some(tag=>b.includes(tag))) n++; 
  });
  
  const hasVovoMichel = ctx.existsId("vovo_michel");
  if(hasVovoMichel) {
    n = n * 2;
  }
  
  return n;
}

function scoreImprovements(state, ctx, breakdown){
  const fausta = ctx.existsId("dona_fausta");
  if(fausta) return {score:0, note:"Dona Fausta presente: melhorias não pontuam."};
  let s=0;
  state.improvements.forEach(imp=>{
    let k=0;
    ctx.forEachCard((p,c)=>{ 
      if(c.isCobrador || c.id === 'mateus') return;
      if([c.faixa,c.temper,c.comp].some(tag=>imp.bonus.includes(tag))) k++; 
    });
    breakdown.push({who:`[Melhoria] ${imp.nome}`, delta:+k, detail:`+${k} por correspondências no busão (somente cartas ativas)`});
    s+=k;
  });
  return {score:s};
}

function calculateMateusBonus(state) {
  const TAG_CATEGORIES = {
    faixa: ['Idoso', 'Adulto', 'Jovem'],
    temper: ['Caótico', 'Equilibrado', 'Tranquilo'],
    comp: ['Barulhento', 'Comunicativo', 'Silencioso']
  };

  const allTags = [].concat(...Object.values(TAG_CATEGORIES));
  const tagPoints = Object.fromEntries(allTags.map(tag => [tag, 0]));

  if (state.driver) {
    state.driver.bonus.forEach(tag => {
      if (tag in tagPoints) tagPoints[tag]++;
    });
  }
  
  const fausta = state.grid.flat().some(cell => cell.card && cell.card.id === 'dona_fausta');
  if (!fausta) {
    state.improvements.forEach(imp => {
      imp.bonus.forEach(tag => {
        if (tag in tagPoints) tagPoints[tag]++;
      });
    });
  }

  let totalBonus = 0;
  const chosenTags = [];
  const breakdown = [];

  for (const category in TAG_CATEGORIES) {
    let bestTag = TAG_CATEGORIES[category][0];
    let maxPoints = 0;

    TAG_CATEGORIES[category].forEach(tag => {
      if (tagPoints[tag] > maxPoints) {
        maxPoints = tagPoints[tag];
        bestTag = tag;
      }
    });
    
    totalBonus += maxPoints;
    chosenTags.push(bestTag);
    breakdown.push(`${bestTag} (+${maxPoints})`);
  }

  return { score: totalBonus, chosenTags, breakdown: breakdown.join(' • ') };
}

function scorePerrengues(state, ctx, breakdown) {
  let total = 0;
  
  state.perrengues.forEach(perr => {
    let pontos = 0;
    let detalhe = "";
    
    if (perr.id === "acidente") {
      if (state.driver) {
        const contagens = {};
        state.driver.bonus.forEach(categoria => {
          contagens[categoria] = ctx.countBus(c => 
            !c.isCobrador && 
            (c.faixa === categoria || c.temper === categoria || c.comp === categoria)
          );
        });
        
        let categoriaMaior = "";
        let maiorContagem = 0;
        for (const [categoria, contagem] of Object.entries(contagens)) {
          if (contagem > maiorContagem) {
            maiorContagem = contagem;
            categoriaMaior = categoria;
          }
        }
        
        if (categoriaMaior) {
          pontos = maiorContagem;
          detalhe = `Dobrou a categoria ${categoriaMaior} do motorista: +${pontos}`;
        }
      }
    } else {
      const count = ctx.countBus(c => 
        !c.isCobrador && 
        perr.bonus.some(tag => c.faixa === tag || c.temper === tag || c.comp === tag)
      );
      
      pontos = count * perr.pontos;
      const sinal = perr.pontos > 0 ? "+" : "";
      detalhe = `${sinal}${perr.pontos} por cada ${perr.bonus.join("/")}: ${count} × ${perr.pontos} = ${pontos}`;
    }
    
    breakdown.push({who: `[Perrengue] ${perr.nome}`, delta: pontos, detail: detalhe});
    total += pontos;
  });
  
  return {score: total};
}

function scoreRotasDiarias(state, ctx, breakdown) {
  let total = 0;
  
  state.rotasDiarias.forEach(rota => {
    let pontos = 0;
    if (rota.condicao(ctx)) {
      pontos = rota.pontos;
      breakdown.push({who: `[Rota Diária] ${rota.nome}`, delta: pontos, detail: rota.efeito});
    }
    total += pontos;
  });
  
  return {score: total};
}

function apaixonadosBonus(state, ctx){
  if(!EXP_APX.checked) return {score:0, parts:[]};

  const nodes = [];
  ctx.forEachCard((pos, card)=>{
    if(card.isApaixonado){ nodes.push({pos, card}); }
  });
  if(nodes.length<2) return {score:0, parts:[]};

  const visited = new Set();
  const groups = [];
  const key = (p)=> `${p.row},${p.col}`;

  const isApxAt = (p)=> {
    const cell = state.grid[p.row][p.col];
    return cell && cell.card && cell.card.isApaixonado;
  };

  for(const n of nodes){
    const k = key(n.pos);
    if(visited.has(k)) continue;
    const q=[n.pos]; visited.add(k);
    const group=[];
    while(q.length){
      const cur = q.shift();
      const card = state.grid[cur.row][cur.col].card;
      group.push({pos:cur, card});
      for(const nb of ctx.neighbors(cur)){
        const kk = key(nb);
        if(!visited.has(kk) && isApxAt(nb)) { visited.add(kk); q.push(nb); }
      }
    }
    groups.push(group);
  }

  let totalBonus=0; const parts=[]; let idx=1;
  for(const g of groups){
    if(g.length>=2){
      const sumBase = g.reduce((acc,x)=> acc + (x.card.base||0), 0);
      const bonus = sumBase;
      if(bonus>0){
        totalBonus += bonus;
        const seats = g.map(x=> seatNumber(x.pos)).sort((a,b)=>a-b).join(", ");
        parts.push({who:`[Apaixonados] Grupo ${idx} (assentos ${seats})`, delta:+bonus, detail:`Bônus de dobro da soma base: ${sumBase} → +${bonus}`});
        idx++;
      }
    }
  }
  return {score: totalBonus, parts};
}

function grupoPagodeBonus(state, ctx){
  if(!EXP_GRUPO_PAGODE.checked) return {score:0, note:""};
  
  const pagodeiros = [];
  ctx.forEachCard((p,c)=>{
    if(GRUPO_PAGODE.some(g=>g.id===c.id)) pagodeiros.push(c);
  });
  
  if(pagodeiros.length === 5){
    return {score:50, note:"Grupo de Pagode completo! +50 pontos extras!"};
  }
  
  return {score:0, note:""};
}

/* ============================
   Render / detalhes
============================= */
function cardStaticInfo(card){
  const attrs = card.isCobrador ? "[Cobrador]" : card.isApaixonado ? "[Apaixonado]" : `${card.faixa}, ${card.temper}, ${card.comp}.`;
  const pts = `${card.base} ponto${card.base===1?"":"s"}.`;
  let label = "Efeito";
  if(card.isCobrador) label="Habilidade";
  else if(card.isApaixonado) label = "Apaixonado";
  else if(card.impacto.includes("durante") && card.text && /Ao embarcar/i.test(card.text)) label = "Condição";
  else if(card.require && !card.ability && !card.penalty) label = "Exigência";
  else if(card.scoreReq && !card.ability && !card.penalty) label = "Condição de pontuação";
  else if(card.penalty && !card.ability) label = "Penalidade";
  else if(card.ability) label = "Habilidade";
  const textLine = card.text ? `\n${label}: ${card.text}` : "";
  return `${attrs} ${pts}${textLine}`;
}

function render(){
  const state = collectState();
  const {ctx, warnings, isActiveAt} = buildCtx(state);
  updateBusVisualLabels(state);

  const rows=[]; let passengersScore=0;

  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const card = state.grid[r][c].card;
      if(!card) continue;
      const pos = {row:r,col:c};

      if(!isActiveAt(pos) && typeof card.require==="function"){
        const rq = card.require(ctx,pos) || {ok:false,msg:"Exigência não atendida."};
        const msg = `<span class="req-badge">Exigência não atendida</span> <span class="req-text">${rq.msg || ""}</span>\n${cardStaticInfo(card)}`;
        rows.push(rowLine(`Assento ${seatNumber(pos)} — ${card.nome}`, 0, msg, seatNumber(pos), "req"));
        continue;
      }
      
      if (card.id === 'mateus') {
        const mateusBonus = calculateMateusBonus(state);
        const totalMateus = card.base + mateusBonus.score;
        passengersScore += totalMateus;
        
        let detail = cardStaticInfo(card);
        if (mateusBonus.score > 0) {
          detail += `\nBônus Coringa: +${mateusBonus.score}. Tags escolhidas: ${mateusBonus.breakdown}.`;
        } else {
          detail += `\nBônus Coringa: +0. <span class="req-text">Selecione um motorista ou melhorias para calcular o bônus ideal.</span>`;
        }
        rows.push(rowLine(`Assento ${seatNumber(pos)} — ${card.nome}`, totalMateus, detail, seatNumber(pos)));
        continue;
      }

      let s = card.base; const notes = []; const log = (t)=> notes.push(t);
      notes.push(cardStaticInfo(card));
      if(card.ability) s += (card.ability(pos,ctx,log) || 0);
      if(card.penalty) s += (card.penalty(pos,ctx,log) || 0);

      let extraCls = "";
      if(typeof card.scoreReq === "function"){
        const sr = card.scoreReq(ctx,pos);
        if(!sr.ok){
          notes.push(`<span class="noscore-badge">Sem pontuação</span> <span class="req-text">${sr.msg||""}</span>\n(Continua contando para motorista, melhorias e adjacências)`);
          s = 0; extraCls = "sc";
        }
      }
      if(card.note && card.impacto.includes("durante")) notes.push(`Nota: ${card.note}`);

      rows.push(rowLine(`Assento ${seatNumber(pos)} — ${card.nome}`, s, notes.join("\n"), seatNumber(pos), extraCls));
      passengersScore += s;
    }
  }

  const driverPts = scoreDriver(state, ctx);
  const improvBreak=[]; const {score:improvPts, note:improvNote} = scoreImprovements(state, ctx, improvBreak);
  
  const perrenguesBreak = [];
  const {score: perrenguesPts} = scorePerrengues(state, ctx, perrenguesBreak);
  
  const rotasDiariasBreak = [];
  const {score: rotasDiariasPts} = scoreRotasDiarias(state, ctx, rotasDiariasBreak);
  
  const apx = apaixonadosBonus(state, ctx);
  
  const pagodeBonus = grupoPagodeBonus(state, ctx);
  
  const hasIsabel = ctx.existsId("isabel");
  const handPenalty = hasIsabel ? 0 : -(state.hand||0);

  sumPassengersEl.textContent = passengersScore;
  sumDriverEl.textContent = driverPts;
  sumImprovEl.textContent = improvPts;
  sumPerrenguesEl.textContent = perrenguesPts;
  sumRotasDiariasEl.textContent = rotasDiariasPts;
  sumHandEl.textContent = handPenalty;

  const total = passengersScore + driverPts + improvPts + perrenguesPts + rotasDiariasPts + apx.score + pagodeBonus.score + handPenalty;
  totalScoreEl.textContent = total;
  totalScoreEl.className = "v kpi " + (total>0?"good":(total<0?"bad":"neu"));

  const w = []; 
  if(improvNote) w.push(improvNote);
  if(pagodeBonus.note) w.push(pagodeBonus.note);
  if(hasIsabel && state.hand > 0) w.push(`Isabel (A Artesã) presente: cartas na mão não descontam pontos.`);
  if(warnings.length) w.push(...warnings);
  warningsEl.innerHTML = w.length ? `<div class="kpi warn">⚠ ${w.join("<br>⚠ ")}</div>` : "";

  const lines = [
    ...rows,
    ...improvBreak.map(x=>rowLine(x.who,x.delta,x.detail)),
    ...perrenguesBreak.map(x=>rowLine(x.who, x.delta, x.detail)),
    ...rotasDiariasBreak.map(x=>rowLine(x.who, x.delta, x.detail)),
    ...(apx.parts||[]).map(x=>rowLine(x.who, x.delta, x.detail)),
  ];
  
  if(pagodeBonus.score > 0){
    lines.push(rowLine("[Grupo de Pagode] Completo!", pagodeBonus.score, "Reuniu os 5 integrantes do Grupo de Pagode!"));
  }
  
  lines.push(rowLine("[Mão]", handPenalty, handPenalty? `${handPenalty} (–1 por ${Math.abs(handPenalty)} carta(s) na mão)` : (hasIsabel && state.hand > 0 ? "0 (Isabel presente)" : "0")));
  
  EXPLAIN.innerHTML = lines.join("");
  if(currentBusFocus) scrollExplainToSeat(currentBusFocus);
}

function rowLine(name,score,detail,seatId, extraCls=""){
  return `<div class="row ${extraCls}" ${seatId?`id="exp-seat-${seatId}"`:``}>
    <div class="h"><div class="name">${name}</div><div class="score">${
      score>0?`<span class="kpi good">+${score}</span>`: (score<0?`<span class="kpi bad">${score}</span>`:`<span class="kpi neu">${score}</span>`)
    }</div></div>
    ${detail?`<div class="d">${detail}</div>`:""}
  </div>`;
}

function scrollExplainToSeat(n){
  const el=document.getElementById(`exp-seat-${n}`);
  if(el){ el.classList.add("hl"); setTimeout(()=>el.classList.remove("hl"),1200); el.scrollIntoView({behavior:"smooth",block:"nearest"}); }
}

/* ============================
   Desabilitar opções no select conforme regras
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
   Catálogo + Busca
============================= */
const catalogContentEl = document.getElementById("catalogContent");
const catalogSearchEl = document.getElementById("catalogSearch");
document.getElementById("clearCatalogSearch").onclick = ()=>{ catalogSearchEl.value = ""; buildCatalog(""); };
catalogSearchEl?.addEventListener("input", ()=> buildCatalog(catalogSearchEl.value));

function norm(s){ return String(s||"").normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase(); }

function cardMatchesFilter(card, q){
  if(!q) return true;
  const nq = norm(q);
  const hay = [
    card.nome,
    card.faixa, card.temper, card.comp,
    card.text || "", card.note || "",
    card.isCobrador ? "cobrador" : card.isApaixonado ? "apaixonado" : "passageiro"
  ].join(" ");
  return norm(hay).includes(nq);
}

function buildCatalog(q){
  const groups = [
    {
      title: "Motoristas", 
      items: DRIVERS.filter(d => d.id), 
      render: d => ({
        name: d.nome,
        pts: "+1 por tags",
        tags: d.bonus.join(" • "),
        text: "Concede +1 por cada ocorrência das 3 subcategorias.",
        badges: ["motorista"]
      })
    },
    {
      title: "Melhorias", 
      items: IMPROVEMENTS, 
      render: i => ({
        name: i.nome,
        pts: "+1 por tags",
        tags: i.bonus.join(" • "),
        text: "Soma +1 por ocorrência nas cartas ativas.",
        badges: ["melhoria"]
      })
    },
    {
      title: "Perrengues (expansão)",
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

  const html = groups.map(g=>{
    const inner = g.items.map(it=>{
      const m = g.render(it);
      const badges = (m.badges||[]).map(b=>{
        const label = b==="exp"?"Expansão": b==="req"?"Exigência": b==="pen"?"Penalidade": b==="hab"?"Habilidade": b==="motorista"?"Motorista": b==="melhoria"?"Melhoria": b==="perrengue"?"Perrengue": b==="rotadiaria"?"Rota Diária": b==="pagode"?"Pagode": b==="lenda"?"Lenda": b==="estounobusao"?"Estou no Busão":b;
        const cls = b==="exp"?"exp": b==="req"?"req": b==="pen"?"pen": b==="hab"?"hab": b==="motorista"?"motorista": b==="melhoria"?"melhoria": b==="perrengue"?"perrengue": b==="rotadiaria"?"rotadiaria": b==="pagode"?"pagode": b==="lenda"?"lenda": b==="estounobusao"?"estounobusao":b;
        return `<span class="badge ${cls}">${label}</span>`;
      }).join("");
      return `<div class="cat-item">
        <div class="cat-head"><div class="cat-name">${m.name}</div><div class="cat-pts">${m.pts}</div></div>
        <div class="cat-tags">${badges} ${m.tags}</div>
        ${m.text?`<div class="cat-text">${m.text}</div>`:""}
      </div>`;
    }).join("");
    return g.items.length > 0 ? `<div class="cat-group"><h3>${g.title}</h3>${inner}</div>` : '';
  }).join("");
  catalogContentEl.innerHTML = html;
}

/* ============================
   Picker (modal de seleção)
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
  pickerModal.classList.add("open");
  buildPickerGrid("pass", "");
  pickerSearch.value = "";
}

function closePicker(){ pickerModal.classList.remove("open"); currentSeatNo=null; }

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
   Ranking (localStorage)
============================= */
function saveScore(){
  const state=collectState();
  const {ctx}=buildCtx(state);
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
   INIT
============================= */
mountLeft();
mountGrid();
mountBusVisual();
buildCatalog("");
renderRanking();
render();

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