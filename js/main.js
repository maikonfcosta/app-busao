/* ============================
    MOTORISTAS & MELHORIAS
============================= */
const DRIVERS = [
  { id:"",       nome:"— selecione um motorista —", bonus:[] },
  { id:"bigode",   nome:"Bigode",   bonus:["Jovem","Caótico","Barulhento"] },
  { id:"lucinha",  nome:"Lucinha",  bonus:["Adulto","Tranquilo","Silencioso"] },
  { id:"montanha", nome:"Montanha", bonus:["Idoso","Equilibrado","Comunicativo"] },
  { id:"paty",     nome:"Paty",     bonus:["Jovem","Tranquilo","Comunicativo"] },
  { id:"pedrinho", nome:"Pedrinho", bonus:["Adulto","Caótico","Silencioso"] },
  { id:"pereirao", nome:"Pereirão", bonus:["Idoso","Equilibrado","Barulhento"] },
];

const IMPROVEMENTS = [
  { id:"acess", nome:"Acessibilidade", bonus:["Idoso","Tranquilo"], reqTag:"Acessibilidade" },
  { id:"ar", nome:"Ar-condicionado", bonus:["Caótico","Silencioso"] },
  { id:"reclinaveis", nome:"Assentos Reclináveis", bonus:["Adulto","Barulhento"], reqTag:"Assentos Reclináveis" },
  { id:"banheiro", nome:"Banheiro", bonus:["Adulto","Silencioso"] },
  { id:"cortinas", nome:"Cortinas", bonus:["Idoso","Caótico"] },
  { id:"som", nome:"Sistema de Som", bonus:["Barulhento","Caótico"] },
  { id:"tv", nome:"TV de Bordo", bonus:["Equilibrado","Comunicativo"] }, /* corrigido para Equilibrado */
  { id:"wifi", nome:"Wi-Fi e Tomadas", bonus:["Jovem","Comunicativo"], reqTag:"Wi-Fi e Tomadas" },
];

/* ============================
    CARTAS (passageiros)
============================= */
function P(obj){ return Object.assign({base:0,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",
  impacto:"final", ability:null, penalty:null, require:null, note:null, text:null, isCobrador:false}, obj); }

const CARD_DB = [
  // Habilidades
  P({id:"caio",nome:"Caio (O Estudante)",base:4,faixa:"Jovem",temper:"Caótico",comp:"Silencioso",
    text:"+1 Ponto para cada Silencioso adjacente.",
    ability:(p,ctx,log)=>{ const n=ctx.countAdj(p, c=>c.comp==="Silencioso"); if(n) log(`+${n} por Silencioso adj.`); return n; }
  }),
  P({id:"leandro",nome:"Leandro (O Dorminhoco)",base:3,faixa:"Adulto",temper:"Equilibrado",comp:"Silencioso",
    text:"+1 Ponto para cada Silencioso adjacente.",
    ability:(p,ctx,log)=>{ const n=ctx.countAdj(p, c=>c.comp==="Silencioso"); if(n) log(`+${n} por Silencioso adj.`); return n; }
  }),
  P({id:"sol",nome:"Sol (Good Vibes)",base:2,faixa:"Jovem",temper:"Tranquilo",comp:"Silencioso",
    text:"+1 Ponto por cada Equilibrado e cada Comunicativo no Busão.",
    ability:(p,ctx,log)=>{ const e=ctx.countBus(c=>!c.isCobrador && c.temper==="Equilibrado"); const cm=ctx.countBus(c=>!c.isCobrador && c.comp==="Comunicativo");
      let s=0; if(e){log(`+${e} por Equilibrado no busão`); s+=e;} if(cm){log(`+${cm} por Comunicativo no busão`); s+=cm;} return s; }
  }),
  P({id:"rato",nome:"Rato (O Malandro)",base:1,faixa:"Jovem",temper:"Caótico",comp:"Barulhento",
    text:"+2 pontos por Idoso no busão.",
    ability:(p,ctx,log)=>{ const n=ctx.countBus(c=>!c.isCobrador && c.faixa==="Idoso"); if(n){log(`+${2*n} (+2 por ${n} Idoso no busão)`);} return 2*n; }
  }),
  P({id:"raul",nome:"Raul (O Pancada)",base:3,faixa:"Idoso",temper:"Equilibrado",comp:"Barulhento",
    text:"+1 Ponto por cada Jovem e cada Comunicativo Adjacente.",
    ability:(p,ctx,log)=>{ const j=ctx.countAdj(p,c=>c.faixa==="Jovem"); const co=ctx.countAdj(p,c=>c.comp==="Comunicativo");
      let s=0; if(j){log(`+${j} por Jovem adj.`); s+=j;} if(co){log(`+${co} por Comunicativo adj.`); s+=co;} return s; }
  }),
  P({id:"dona_cida",nome:"Dona Cida (A Tagarela)",base:4,faixa:"Idoso",temper:"Caótico",comp:"Barulhento",impacto:"durante-final",
    text:"Ao embarcar, pode fazer um Silencioso desembarcar. +1 Ponto por cada Barulhento adjacente.",
    ability:(p,ctx,log)=>{ const n=ctx.countAdj(p,c=>c.comp==="Barulhento"); if(n){log(`+${n} por Barulhento adj.`);} return n; },
    note:"Ao embarcar, pode fazer um Silencioso desembarcar."
  }),
  P({id:"fabio",nome:"Fábio (O Vendedor)",base:3,faixa:"Adulto",temper:"Caótico",comp:"Barulhento", text:"Sem efeito." }),
  P({id:"seu_amadeu",nome:"Seu Amadeu (O Irritado)",base:5,faixa:"Idoso",temper:"Caótico",comp:"Barulhento",impacto:"durante-final",
    text:"Ao embarcar, pode fazer um Silencioso desembarcar. +1 Ponto por cada Barulhento adjacente.",
    ability:(p,ctx,log)=>{ const n=ctx.countAdj(p,c=>c.comp==="Barulhento"); if(n){log(`+${n} por Barulhento adj.`);} return n; },
    note:"Ao embarcar, pode fazer um Silencioso desembarcar."
  }),
  P({id:"wesley",nome:"Wesley (DJ do busão)",base:3,faixa:"Jovem",temper:"Caótico",comp:"Barulhento",impacto:"durante",
    text:"Ao embarcar, todos os Silenciosos adjacentes desembarcam.",
    note:"Ao embarcar, todos os Silenciosos adjacentes desembarcam."
  }),
  P({id:"sophia",nome:"Sophia (A Blogueira)",base:2,faixa:"Jovem",temper:"Caótico",comp:"Barulhento",
    text:"Se houver a melhoria Wi-Fi e Tomadas, +2 pontos por cada Jovem no Busão.",
    ability:(p,ctx,log)=>{ if(!ctx.hasImprovement("Wi-Fi e Tomadas")) return 0; const n=ctx.countBus(c=>!c.isCobrador && c.faixa==="Jovem");
      if(n){log(`+${2*n} (Wi-Fi ativo: +2 por ${n} Jovem no busão)`);} return 2*n; }
  }),
  P({id:"seu_horacio",nome:"Seu Horácio (O Antissocial)",base:3,faixa:"Idoso",temper:"Equilibrado",comp:"Silencioso",
    text:"+3 Pontos para cada espaço vazio adjacente.",
    ability:(p,ctx,log)=>{ const e=ctx.countAdjEmpty(p); if(e){log(`+${3*e} (+3 por ${e} vazio adj.)`);} return 3*e; }
  }),
  P({id:"sheila",nome:"Sheila (A “Barraqueira”)",base:4,faixa:"Jovem",temper:"Caótico",comp:"Barulhento",impacto:"durante",
    text:"Não pode ser forçada a desembarcar. Ao embarcar, uma coluna inteira desembarca.",
    note:"Ao embarcar, uma coluna inteira desembarca. Não pode ser forçada a desembarcar."
  }),

  // Penalidades
  P({id:"celio",nome:"Célio (O Claustrofóbico)",base:3,faixa:"Jovem",temper:"Caótico",comp:"Silencioso",
    text:"-1 para cada passageiro adjacente. Não embarca se não houver pelo menos 1 espaço vazio adjacente.",
    penalty:(p,ctx,log)=>{ const n=ctx.countAdj(p,()=>true); if(n){log(`-${n} ( -1 por adj.)`);} 
      const e=ctx.countAdjEmpty(p); if(e===0) ctx.warn("Célio: precisa de ao menos 1 espaço vazio adjacente (condição de embarque).");
      return -n; }
  }),
  P({id:"marcia_enzo",nome:"Márcia e Enzo (Mãe e Pestinha)",base:2,faixa:"Adulto",temper:"Equilibrado",comp:"Barulhento",
    text:"-2 Pontos para cada Silencioso no Busão.",
    penalty:(p,ctx,log)=>{ const n=ctx.countBus(c=>!c.isCobrador && c.comp==="Silencioso"); if(n){log(`-${2*n} ( -2 por ${n} Silencioso no busão )`);} return -2*n; }
  }),
  P({id:"motolover",nome:"Luíz (Motolover)",base:3,faixa:"Adulto",temper:"Equilibrado",comp:"Silencioso",
    text:"-2 Pontos por passageiro no Busão que estiver sentado entre ele e o motorista.",
    penalty:(p,ctx,log)=>{ const n=ctx.countAheadBothRows(p); if(n){log(`-${2*n} ( -2 por ${n} entre ele e o motorista )`);} return -2*n; }
  }),
  P({id:"fobao",nome:"Fabão (O Grandão)",base:1,faixa:"Adulto",temper:"Caótico",comp:"Silencioso",impacto:"durante",
    text:"Ao embarcar entra em um espaço ocupado e faz a coluna inteira deste local desembarcar.",
    note:"Ao embarcar entra em espaço ocupado e faz a coluna inteira desembarcar."
  }),
  P({id:"waldisnei",nome:"Waldisnei (O “Cheiroso”)",base:0,faixa:"Jovem",temper:"Caótico",comp:"Comunicativo",impacto:"durante-final",
    text:"-1 Ponto para qualquer passageiro adjacente. Ao embarcar, a primeira fileira da frente desembarca.",
    penalty:(p,ctx,log)=>{ const n=ctx.countAdj(p,()=>true); if(n){log(`-${n} ( -1 por adj.)`);} return -n; },
    note:"Ao embarcar, a primeira fileira da frente desembarca."
  }),
  P({id:"claudio",nome:"Cláudio (O Pastor)",base:2,faixa:"Adulto",temper:"Caótico",comp:"Barulhento",impacto:"durante-final",
    text:"-1 ponto para cada Silencioso no busão. Jovens adjacentes desembarcam.",
    penalty:(p,ctx,log)=>{ const n=ctx.countBus(c=>!c.isCobrador && c.comp==="Silencioso"); if(n){log(`-${n} ( -1 por ${n} Silencioso no busão )`);} return -n; },
    note:"Ao embarcar, todos os Jovens adjacentes desembarcam."
  }),
  P({id:"roberto",nome:"Roberto (O “Bonzinho”)",base:6,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",impacto:"durante",
    text:"Se, depois dele, um Idoso ou “A Gestante” embarcar, ele deverá desembarcar para ceder o lugar.",
    note:"Se depois dele um Idoso ou “A Gestante” embarcar, ele cede o lugar."
  }),
  P({id:"charles",nome:"Charles (O Maromba)",base:4,faixa:"Adulto",temper:"Equilibrado",comp:"Barulhento",
    text:"-1 ponto para cada passageiro adjacente. -3 pontos se “O Grandão” estiver no Busão.",
    penalty:(p,ctx,log)=>{ const adj=ctx.countAdj(p,()=>true); let s=-adj; if(ctx.existsId("fobao")){ s-=3; log("-3 adicionais: Grandão presente"); }
      if(adj) log(`-${adj} ( -1 por adj.)`); return s; }
  }),

  // Exigências
  P({id:"ana_gestante",nome:"Ana (A Gestante)",base:5,faixa:"Adulto",temper:"Tranquilo",comp:"Comunicativo",
    text:"Só embarca se no Busão estiver a melhoria Assentos Reclináveis.",
    require:(ctx)=> reqImprovement(ctx,"Assentos Reclináveis")
  }),
  P({id:"joao_pcd",nome:"João (PCD)",base:6,faixa:"Jovem",temper:"Equilibrado",comp:"Silencioso",
    text:"Só embarca se no Busão estiver a melhoria Acessibilidade.",
    require:(ctx)=> reqImprovement(ctx,"Acessibilidade")
  }),
  P({id:"peter",nome:"Peter (O Playboy)",base:7,faixa:"Jovem",temper:"Equilibrado",comp:"Barulhento",
    text:"Só embarca se no Busão estiverem todas as 3 melhorias.",
    require:(ctx)=> ({ok: ctx.improvements.length===3, msg:"Precisa das 3 melhorias ativas."})
  }),
  P({id:"mari",nome:"Mari (A Conectada)",base:4,faixa:"Jovem",temper:"Tranquilo",comp:"Silencioso",
    text:"Só embarca se houver a melhoria Wi-Fi e Tomadas.",
    require:(ctx)=> reqImprovement(ctx,"Wi-Fi e Tomadas")
  }),
  P({id:"wilson",nome:"Wilson (O Pai de Planta)",base:5,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",
    text:"Ocupa os 2 lugares da fileira. +1 Ponto para cada Idoso adjacente.",
    ability:(p,ctx,log)=>{ const n=ctx.countAdj(p,c=>c.faixa==="Idoso"); if(n){log(`+${n} por Idoso adj.`);} return n; },
    require:(ctx,p)=> {
      const other = p.row===0 ? ctx.getPos(1,p.col) : ctx.getPos(0,p.col);
      const ok = !other.card;
      return {ok, msg:"Wilson ocupa os 2 lugares do assento (deixe vazio o outro da coluna)."};
    }
  }),
  P({id:"dona_mirtes",nome:"Dona Mirtes (A Fofoqueira)",base:5,faixa:"Adulto",temper:"Tranquilo",comp:"Comunicativo",
    text:"Só pontua se estiver adjacente a pelo menos um Comunicativo.",
    require:(ctx,p)=> ({ok: ctx.countAdj(p,c=>c.comp==="Comunicativo")>0, msg:"Precisa estar adjacente a pelo menos 1 Comunicativo."})
  }),
  P({id:"misterioso",nome:"SEM NOME (Cara Misterioso)",base:4,faixa:"Adulto",temper:"Tranquilo",comp:"Silencioso",
    text:"Só embarca se puder se sentar no fundo do Busão (coluna 6).",
    require:(ctx,p)=> ({ok: p.col===5, msg:"Só embarca no fundo do busão (coluna 6)."})
  }),

  // Especiais
  P({id:"jorge",nome:"Jorge (O Perdido)",base:4,faixa:"Adulto",temper:"Caótico",comp:"Barulhento",impacto:"durante",
    text:"Embarque imediato; troca de Busão ao fim de cada rodada; pontua onde terminar."
  }),
  P({id:"dabs",nome:"Dabs (A Board Gamer)",base:6,faixa:"Adulto",temper:"Tranquilo",comp:"Comunicativo",impacto:"durante",
    text:"Ao embarcar, pode fazer até dois passageiros com Penalidade desembarcarem."
  }),
  P({id:"dona_fausta",nome:"Dona Fausta (A Desconfiada)",base:1,faixa:"Idoso",temper:"Caótico",comp:"Silencioso",
    text:"Se estiver no fim da partida, as melhorias do busão não dão pontos extras."
  }),
];

/* ============================
    EXPANSÃO – COBRADORES
============================= */
const COBRADORES = [
  P({id:"cob_candinha",nome:"Dona Candinha (A Protetora dos Idosos) [Cobrador]",isCobrador:true,base:0,
    text:"+2 pontos para cada Idoso",
    ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.faixa==="Idoso"); if(n) log(`+${2*n} (+2 por ${n} Idoso)`); return 2*n;}
  }),
  P({id:"cob_ze",nome:"Zé (O Tiozão) [Cobrador]",isCobrador:true,base:0,
    text:"+2 pontos para cada Adulto",
    ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.faixa==="Adulto"); if(n) log(`+${2*n} (+2 por ${n} Adulto)`); return 2*n;}
  }),
  P({id:"cob_brenda",nome:"Brenda (A Jovenzona) [Cobrador]",isCobrador:true,base:0,
    text:"+2 pontos para cada Jovem",
    ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.faixa==="Jovem"); if(n) log(`+${2*n} (+2 por ${n} Jovem)`); return 2*n;}
  }),
  P({id:"cob_tereza",nome:"Tereza (A Paz no Busão) [Cobrador]",isCobrador:true,base:0,
    text:"+2 pontos para cada Tranquilo",
    ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.temper==="Tranquilo"); if(n) log(`+${2*n} (+2 por ${n} Tranquilo)`); return 2*n;}
  }),
  P({id:"cob_saulo",nome:"Saulo (O Sem Tempo Irmão) [Cobrador]",isCobrador:true,base:0,
    text:"+2 pontos para cada Equilibrado",
    ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.temper==="Equilibrado"); if(n) log(`+${2*n} (+2 por ${n} Equilibrado)`); return 2*n;}
  }),
  P({id:"cob_leozinho",nome:"Léozinho (O Causador) [Cobrador]",isCobrador:true,base:0,
    text:"+2 pontos para cada Caótico",
    ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.temper==="Caótico"); if(n) log(`+${2*n} (+2 por ${n} Caótico)`); return 2*n;}
  }),
  P({id:"cob_padilha",nome:"Padilha (O Sossegado) [Cobrador]",isCobrador:true,base:0,
    text:"+2 pontos para cada Silencioso",
    ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.comp==="Silencioso"); if(n) log(`+${2*n} (+2 por ${n} Silencioso)`); return 2*n;}
  }),
  P({id:"cob_dandara",nome:"Dandara (A Conversadeira) [Cobrador]",isCobrador:true,base:0,
    text:"+2 pontos para cada Comunicativo",
    ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.comp==="Comunicativo"); if(n) log(`+${2*n} (+2 por ${n} Comunicativo)`); return 2*n;}
  }),
  P({id:"cob_genesio",nome:"Genésio (O Berrador) [Cobrador]",isCobrador:true,base:0,
    text:"+2 pontos para cada Barulhento",
    ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.comp==="Barulhento"); if(n) log(`+${2*n} (+2 por ${n} Barulhento)`); return 2*n;}
  }),
];

/* ============================
    UI refs
============================= */
const byName = (a,b)=> a.nome.localeCompare(b.nome);
const DRIVER_SEL = document.getElementById("driver");
const EXP_COB = document.getElementById("expCobradores");
const DRIVER_INFO = document.getElementById("driverInfo");
const IMPROV_SELECTS = Array.from(document.querySelectorAll(".improv"));
const IMPROV_INFO = document.getElementById("improvInfo");
const GRID = document.getElementById("grid");
const EXPLAIN = document.getElementById("explain");
const totalScoreEl = document.getElementById("totalScore");
const sumPassengersEl = document.getElementById("sumPassengers");
const sumDriverEl = document.getElementById("sumDriver");
const sumImprovEl = document.getElementById("sumImprov");
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
const tabEls = document.querySelectorAll(".tab");
const tabPans = { regras: document.getElementById("tab-regras"), faq: document.getElementById("tab-faq") };
document.getElementById("btnRules").onclick=()=>activateTab("regras");
document.getElementById("btnFaq").onclick=()=>activateTab("faq");
tabEls.forEach(t=> t.onclick = ()=> activateTab(t.dataset.t));
function activateTab(key){ tabEls.forEach(t=>t.classList.toggle("act", t.dataset.t===key)); Object.entries(tabPans).forEach(([k,el])=> el.classList.toggle("act", k===key)); }

/* ============================
    INIT LEFT PANE
============================= */
function buildOptions(list){
  const frag = document.createDocumentFragment();
  list.forEach(x=>{ const opt = document.createElement("option"); opt.value=x.id; opt.textContent=x.nome; frag.appendChild(opt); });
  return frag;
}

/* opções de melhoria: com "— vazio —" */
function buildImprovementOptions(){
  const frag = document.createDocumentFragment();
  const empty = document.createElement("option"); empty.value=""; empty.textContent="— vazio —"; frag.appendChild(empty);
  IMPROVEMENTS.forEach(i=>{ const o=document.createElement("option"); o.value=i.id; o.textContent=i.nome; frag.appendChild(o); });
  return frag;
}

/* impedir duplicadas nas melhorias */
function refreshImprovSelects(){
  const selected = new Set(IMPROV_SELECTS.map(s=>s.value).filter(Boolean));
  IMPROV_SELECTS.forEach(sel=>{
    Array.from(sel.options).forEach(opt=>{
      if(!opt.value){ opt.disabled=false; return; }
      const dup = selected.has(opt.value) && sel.value!==opt.value;
      opt.disabled = dup;
    });
  });
  renderImprovInfo();
  render();
}

function mountLeft(){
  DRIVER_SEL.appendChild(buildOptions(DRIVERS));
  DRIVER_SEL.addEventListener("change", ()=>{ renderDriverInfo(); render(); });
  EXP_COB.addEventListener("change", ()=>{ rebuildSeatSelectOptions(); render(); });

  IMPROV_SELECTS.forEach(sel=>{
    sel.appendChild(buildImprovementOptions());
    sel.value = "";              // começa vazio
    sel.addEventListener("focus", ()=> sel.dataset.prev = sel.value);
    sel.addEventListener("change", ()=>{
      const val = sel.value;
      // se outra select já tem essa melhoria, volta para anterior (ou vazio)
      if(val && IMPROV_SELECTS.some(s=> s!==sel && s.value===val)){
        sel.value = sel.dataset.prev || "";
      }
      refreshImprovSelects();
    });
  });
  refreshImprovSelects();

  playerNameEl.addEventListener("input", ()=>{ playerTagEl.textContent = playerNameEl.value? `Jogador: ${playerNameEl.value}`:""; });
  handCountEl.addEventListener("input", render);
  renderDriverInfo();
}

function renderDriverInfo(){
  const d = DRIVERS.find(x=>x.id===DRIVER_SEL.value);
  if(!d || !d.id){
    DRIVER_INFO.innerHTML = `<div class="driver-card"><div><b>Sem motorista</b></div><div class="muted">Selecione um motorista para ativar o bônus.</div></div>`;
  }else{
    DRIVER_INFO.innerHTML = `<div class="driver-card"><div><b>${d.nome}</b></div><div class="muted">+1 por: ${d.bonus.join(" • ")}</div></div>`;
  }
  renderImprovInfo();
}

function renderImprovInfo(){
  const imps = getImprovements();
  IMPROV_INFO.innerHTML = imps.map(i => `<div class="improv-card"><div><b>${i.nome}</b></div><div class="muted">+1 por: ${i.bonus.join(" • ")}</div></div>`).join("");
}

function getImprovements(){
  const ids = IMPROV_SELECTS.map(s=>s.value).filter(Boolean);
  const uniq = [...new Set(ids)];   // ainda garante unicidade para a pontuação
  return uniq.map(id=>IMPROVEMENTS.find(i=>i.id===id));
}

/* ============================
    GRID 2 × 6
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
      sel.appendChild(buildCardOptions(EXP_COB.checked));
      sel.dataset.row=r; sel.dataset.col=c;
      sel.addEventListener("change", ()=>{
        const card = findAnyCard(sel.value);
        name.textContent = card ? card.nome : "— vazio —";
        render();
      });

      const name = document.createElement("div");
      name.className="slot-name muted"; name.textContent = "— vazio —";

      slot.appendChild(sel); seat.appendChild(slot); seat.appendChild(name); GRID.appendChild(seat);
    }
  }
}

function buildCardOptions(includeCobradores){
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
  return frag;
}

function rebuildSeatSelectOptions(){
  GRID.querySelectorAll("select").forEach(sel=>{
    const prev = sel.value;
    sel.innerHTML = "";
    sel.appendChild(buildCardOptions(EXP_COB.checked));
    const canKeep = !!findAnyCard(prev) && (EXP_COB.checked || !isCobradorId(prev));
    sel.value = canKeep ? prev : "";
    const nameEl = sel.parentElement.nextElementSibling;
    const card = findAnyCard(sel.value);
    if(nameEl) nameEl.textContent = card ? card.nome : "— vazio —";
  });
}

/* ============================
    BUS VISUAL (Ajuda)
============================= */
const BUS_SEATS = document.getElementById("busVisualSeats");
let currentBusFocus = null;

function mountBusVisual(){
  BUS_SEATS.innerHTML = "";
  for(let n=1;n<=12;n++){
    const b = document.createElement("button");
    b.type="button"; b.className="bseat"; b.textContent = n;
    b.dataset.seatno = n;
    b.addEventListener("click", ()=>focusGridSeat(n,true));
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
function seatNumToRC(n){ if(n<=6) return {row:0,col:n-1}; return {row:1,col:n-7}; }
function focusGridSeat(n, fromBus=false){
  const {row,col} = seatNumToRC(n);
  const seatEl = GRID.querySelector(`.seat[data-row="${row}"][data-col="${col}"]`);
  if(seatEl){
    seatEl.classList.add("hl");
    setTimeout(()=> seatEl.classList.remove("hl"), 700);
    const sel = seatEl.querySelector("select"); sel?.focus();
    if(fromBus){ currentBusFocus = n; updateBusVisualLabels(collectState()); }
    seatEl.scrollIntoView({behavior:"smooth", block:"center"});
    scrollExplainToSeat(n);
  }
}

/* ============================
    ENGINE / CONTEXTO
============================= */
function clearAllSeats(){
  GRID.querySelectorAll("select").forEach(s=>{ s.value=""; const name=s.parentElement.nextElementSibling; if(name) name.textContent="— vazio —"; });
  render();
}
function findAnyCard(id){
  if(!id) return null;
  return CARD_DB.find(x=>x.id===id) || COBRADORES.find(x=>x.id===id) || null;
}
function isCobradorId(id){ return !!COBRADORES.find(x=>x.id===id); }

function collectState(){
  const grid = [...Array(ROWS)].map(()=>[...Array(COLS)].map(()=>({card:null})));
  GRID.querySelectorAll("select").forEach(sel=>{
    const id = sel.value; const r=+sel.dataset.row, c=+sel.dataset.col;
    grid[r][c].card = id ? findAnyCard(id) : null;
  });
  const d = DRIVERS.find(x=>x.id===DRIVER_SEL.value);
  const driver = d && d.id ? d : null;
  const improvements = getImprovements();
  const hand = Math.max(0, +handCountEl.value||0);
  return {grid, driver, improvements, hand};
}
function buildCtx(state){
  const warnings = [];
  const ctx = {
    grid: state.grid, improvements: state.improvements, driver: state.driver,
    warn: (msg)=>warnings.push(msg),
    hasImprovement: (name)=> state.improvements.some(i=>i.nome===name),
    existsId: (id)=> anyCard(state.grid, c=>c.id===id),
    getPos:(r,c)=> state.grid[r][c],
    forEachCard: (fn)=> forEachCard(state.grid, fn),
    countBus: (pred)=> countBus(state.grid, pred),
    countAdj: (pos,pred)=> countAdj(state.grid,pos,pred),
    countAdjEmpty: (pos)=> countAdjEmpty(state.grid,pos),
    countAheadBothRows:(pos)=> countAheadBothRows(state.grid,pos),
  };
  return {ctx, warnings};
}
function forEachCard(grid, fn){ for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ const card = grid[r][c].card; if(card) fn({row:r,col:c}, card); } }
function anyCard(grid, pred){ let found=false; forEachCard(grid,(p,card)=>{ if(!found && pred(card,p)) found=true; }); return found; }
function countBus(grid, pred){ let n=0; forEachCard(grid,(p,card)=>{ if(pred(card,p)) n++; }); return n; }
function neighbors(pos){ const out=[]; if(pos.col-1>=0) out.push({row:pos.row,col:pos.col-1}); if(pos.col+1<COLS) out.push({row:pos.row,col:pos.col+1});
  const other = pos.row===0?1:0; for(let dc=-1; dc<=1; dc++){ const cc = pos.col+dc; if(cc>=0 && cc<COLS) out.push({row:other,col:cc}); } return out; }
function countAdj(grid,pos,pred){ let n=0; for(const nb of neighbors(pos)){ const card = grid[nb.row][nb.col].card; if(card && pred(card, nb)) n++; } return n; }
function countAdjEmpty(grid,pos){ let n=0; for(const nb of neighbors(pos)){ if(!grid[nb.row][nb.col].card) n++; } return n; }
function countAheadBothRows(grid,pos){ let n=0; for(let c=0;c<pos.col;c++){ if(grid[0][c].card) n++; if(grid[1][c].card) n++; } return n; }

/* ============================
    Pontuação – motorista, melhorias e mão
============================= */
function scoreDriver(state){
  if(!state.driver) return 0;
  const b = state.driver.bonus; let n=0;
  forEachCard(state.grid,(p,c)=>{ if(c.isCobrador) return; if([c.faixa,c.temper,c.comp].some(tag=>b.includes(tag))) n++; });
  return n;
}
function scoreImprovements(state, ctx, breakdown){
  const fausta = ctx.existsId("dona_fausta");
  if(fausta) return {score:0, note:"Dona Fausta presente: melhorias não pontuam."};
  let s=0;
  state.improvements.forEach(imp=>{
    let k=0;
    forEachCard(state.grid,(p,c)=>{ if(c.isCobrador) return; if([c.faixa,c.temper,c.comp].some(tag=>imp.bonus.includes(tag))) k++; });
    breakdown.push({who:`[Melhoria] ${imp.nome}`, delta:+k, detail:`+${k} por correspondências no busão`});
    s+=k;
  });
  return {score:s};
}

/* ============================
    Render / detalhes
============================= */
function seatNumber(pos){ return pos.row===0 ? (pos.col+1) : (6+pos.col+1); }

function cardStaticInfo(card){
  const attrs = card.isCobrador ? "[Cobrador]" : `${card.faixa}, ${card.temper}, ${card.comp}.`;
  const pts = `${card.base} ponto${card.base===1?"":"s"}.`;
  let label = "Efeito";
  if(card.isCobrador) label="Habilidade";
  else if(card.impacto.includes("durante") && card.text && /Ao embarcar/i.test(card.text)) label = "Condição";
  else if(card.require && !card.ability && !card.penalty) label = "Exigência";
  else if(card.penalty && !card.ability) label = "Penalidade";
  else if(card.ability) label = "Habilidade";
  const textLine = card.text ? `\n${label}: ${card.text}` : "";
  return `${attrs} ${pts}${textLine}`;
}

function render(){
  const state = collectState();
  const {ctx, warnings} = buildCtx(state);

  updateBusVisualLabels(state);

  const rows=[]; let passengersScore=0;

  ctx.forEachCard((pos,card)=>{
    let s = card.base; const notes = []; const log = (t)=> notes.push(t);
    notes.push(cardStaticInfo(card));

    if(card.require){
      const rq = card.require(ctx,pos);
      if(!rq.ok){
        rows.push(rowLine(`Assento ${seatNumber(pos)} — ${card.nome}`, 0, `Exigência não atendida: ${rq.msg || ""}\n${cardStaticInfo(card)}`, seatNumber(pos)));
        return;
      }
    }
    if(card.ability) s += (card.ability(pos,ctx,log) || 0);
    if(card.penalty) s += (card.penalty(pos,ctx,log) || 0);
    if(card.note && card.impacto.includes("durante")) notes.push(`Nota: ${card.note}`);

    rows.push(rowLine(`Assento ${seatNumber(pos)} — ${card.nome}`, s, notes.join("\n"), seatNumber(pos)));
    passengersScore += s;
  });

  const driverPts = scoreDriver(state);
  const improvBreak=[]; const {score:improvPts, note:improvNote} = scoreImprovements(state, ctx, improvBreak);
  const handPenalty = -(state.hand||0);

  sumPassengersEl.textContent = passengersScore;
  sumDriverEl.textContent = driverPts;
  sumImprovEl.textContent = improvPts;
  sumHandEl.textContent = handPenalty;

  const total = passengersScore + driverPts + improvPts + handPenalty;
  totalScoreEl.textContent = total;
  totalScoreEl.className = "v kpi " + (total>0?"good":(total<0?"bad":"neu"));

  const w = []; if(improvNote) w.push(improvNote); if(warnings.length) w.push(...warnings);
  warningsEl.innerHTML = w.length ? `<div class="kpi warn">⚠ ${w.join("<br>⚠ ")}</div>` : "";

  const lines = [
    ...rows,
    ...improvBreak.map(x=>rowLine(x.who,x.delta,x.detail)),
    rowLine("[Mão]", handPenalty, handPenalty? `${handPenalty} (–1 por ${Math.abs(handPenalty)} carta(s) na mão)` : "")
  ];
  EXPLAIN.innerHTML = lines.join("");
  if(currentBusFocus) scrollExplainToSeat(currentBusFocus);
}

function rowLine(name,score,detail,seatId){
  return `<div class="row" ${seatId?`id="exp-seat-${seatId}"`:``}>
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
    Ranking (localStorage)
============================= */
const LS_KEY = "busao_ranking_v1";
function loadRanking(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)||"[]"); }catch(e){ return []; } }
function saveRanking(list){ localStorage.setItem(LS_KEY, JSON.stringify(list)); }
function pushScore(entry){ const list = loadRanking(); list.push(entry); list.sort((a,b)=> b.score - a.score); saveRanking(list); renderRanking(); }
function renderRanking(){
  const list = loadRanking();
  rankTableBody.innerHTML = list.map((x,i)=>`
    <tr><td>${i+1}</td><td>${escapeHtml(x.player||"-")}</td>
    <td>${escapeHtml(x.driver||"-")}</td>
    <td>${escapeHtml(x.improvements||"-")}</td>
    <td class="right"><b>${x.score}</b></td></tr>`).join("");
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m])); }

/* ============================
    Botões
============================= */
btnClearSeats.onclick = clearAllSeats;
btnNewRound.onclick = ()=>{
  clearAllSeats();
  DRIVER_SEL.value=""; renderDriverInfo();
  EXP_COB.checked=false; rebuildSeatSelectOptions();
  IMPROV_SELECTS.forEach(s=> s.value="");
  refreshImprovSelects();
  playerNameEl.value=""; playerTagEl.textContent=""; handCountEl.value=0;
  render();
};
btnSaveScore.onclick = ()=>{
  const total = +totalScoreEl.textContent || 0;
  const entry = {
    player: playerNameEl.value || "Sem nome",
    driver: (DRIVERS.find(d=>d.id===DRIVER_SEL.value)||{}).nome || "-",
    improvements: getImprovements().map(i=>i.nome).join(", ") || "-",
    score: total, ts: Date.now()
  };
  pushScore(entry);
  btnNewRound.click();
};
btnResetRanking.onclick = ()=>{ if(confirm("Apagar todo o ranking salvo neste navegador?")){ saveRanking([]); renderRanking(); } };

/* ============================
    init
============================= */
function init(){
  mountLeft();
  mountGrid();
  mountBusVisual();
  render();
  renderRanking();
  GRID.addEventListener("change", render);
}
init();

/* helpers requerimentos */
function reqImprovement(ctx,name){ return {ok: ctx.hasImprovement(name), msg:`Precisa da melhoria ${name}.`} }