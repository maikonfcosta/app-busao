/* ============================
   MOTORISTAS & MELHORIAS
============================= */
const DRIVERS = [
  { id:"",        nome:"— selecione um motorista —", bonus:[] },
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
  { id:"tv", nome:"TV de Bordo", bonus:["Equilibrado","Comunicativo"] },
  { id:"wifi", nome:"Wi-Fi e Tomadas", bonus:["Jovem","Comunicativo"], reqTag:"Wi-Fi e Tomadas" },
];

/* ============================
   PERRENGUES (EXPANSÃO)
============================= */
const PERRENGUES = [
  { 
    id: "transito", 
    nome: "Trânsito Parado", 
    efeito: "Durante este perrengue todos os jogadores possuem 4 pontos de ação. Fim de jogo: Passageiros Barulhentos +1 ponto.", 
    bonus: ["Barulhento"],
    pontos: 1
  },
  { 
    id: "fiscalizacao", 
    nome: "Fiscalização Surpresa", 
    efeito: "Ninguém pode realizar a ação especial de Melhoria no Busão enquanto este evento estiver ativo. Fim de jogo: Passageiros Tranquilos +2 pontos.", 
    bonus: ["Tranquilo"],
    pontos: 2
  },
  { 
    id: "flatulencia", 
    nome: "Flatulência no Busão", 
    efeito: "Metade dos passageiros (arredondado para cima) desembarca; o jogador decide quem sai. Fim de jogo: Passageiros Caóticos +1 ponto.", 
    bonus: ["Caótico"],
    pontos: 1
  },
  { 
    id: "alagamento", 
    nome: "Ilhado no Busão", 
    efeito: "Durante este Perrengue nenhum passageiro pode ser forçado a desembarcar. Fim de jogo: Passageiros Equilibrados +1 ponto.", 
    bonus: ["Equilibrado"],
    pontos: 1
  },
  { 
    id: "greve", 
    nome: "Greve dos Rodoviários", 
    efeito: "Se este evento estiver ativo no fim do turno, os motoristas não concedem pontos extras. Fim de jogo: Passageiros Jovens +1 ponto.", 
    bonus: ["Jovem"],
    pontos: 1
  },
  { 
    id: "obra", 
    nome: "Obra na Avenida Principal", 
    efeito: "Cada Jogador deve mover 2 passageiros do seu busão para um busão adversário no sentido horário, e realizam seus efeitos de embarque caso tenha. Fim de jogo: Passageiros Adultos –1 ponto.", 
    bonus: ["Adulto"],
    pontos: -1
  },
  { 
    id: "roubo", 
    nome: "Roubo de Celular", 
    efeito: "Todos os passageiros Jovens desembarcam, exceto 'O Trombadinha' (se estiver no busão). Fim de jogo: Passageiros Silenciosos +1 ponto.", 
    bonus: ["Silencioso"],
    pontos: 1
  },
  { 
    id: "pneu", 
    nome: "Pneu Furado", 
    efeito: "Todos os jogadores têm apenas 2 pontos de ação neste turno. Fim de jogo: Passageiros Idosos +2 pontos.", 
    bonus: ["Idoso"],
    pontos: 2
  },
  { 
    id: "troca", 
    nome: "Troca de Turno", 
    efeito: "Todos os motoristas são substituídos por novos motoristas não usados na preparação do jogo. Caso não haja, os jogadores trocam de motoristas entre si no sentido horário. Fim de jogo: Passageiros Comunicativos +1 ponto.", 
    bonus: ["Comunicativo"],
    pontos: 1
  },
  { 
    id: "acidente", 
    nome: "Acidente de Trânsito", 
    efeito: "Durante este perrengue, os jogadores não podem realizar a ação de Pegar Passageiros. Fim de jogo: Escolha a categoria que seu motorista mais concede pontos e dobre estes pontos concedidos.", 
    bonus: [],
    pontos: 0 // Será calculado dinamicamente
  }
];

/* ============================
   ROTAS DIÁRIAS (EXPANSÃO)
============================= */
const ROTAS_DIARIAS = [
  { 
    id: "parada_delegacia", 
    nome: "Parada na Delegacia", 
    efeito: "+5 pontos se houver 5 ou mais Caóticos no Busão.",
    bonus: ["Caótico"],
    pontos: 5,
    condicao: (ctx) => ctx.countBus(c => !c.isCobrador && c.temper === "Caótico") >= 5
  },
  { 
    id: "parada_asilo", 
    nome: "Parada no Asilo", 
    efeito: "+5 pontos se houver 3 ou mais Idosos no Busão.",
    bonus: ["Idoso"],
    pontos: 5,
    condicao: (ctx) => ctx.countBus(c => !c.isCobrador && c.faixa === "Idoso") >= 3
  },
  { 
    id: "via_shopping", 
    nome: "Via Shopping", 
    efeito: "+3 pontos se houver 2 ou mais Jovens no Busão.",
    bonus: ["Jovem"],
    pontos: 3,
    condicao: (ctx) => ctx.countBus(c => !c.isCobrador && c.faixa === "Jovem") >= 2
  },
  { 
    id: "happy_hour", 
    nome: "Happy hour", 
    efeito: "+8 pontos se houver 5 ou mais Adultos no Busão.",
    bonus: ["Adulto"],
    pontos: 8,
    condicao: (ctx) => ctx.countBus(c => !c.isCobrador && c.faixa === "Adulto") >= 5
  },
  { 
    id: "rota_comum", 
    nome: "Rota Comum", 
    efeito: "+10 pontos se houver 5 ou mais equilibrados adjacentes.",
    bonus: ["Equilibrado"],
    pontos: 10,
    condicao: (ctx) => {
      let maxAdj = 0;
      for(let r=0;r<ROWS;r++) {
        for(let c=0;c<COLS;c++) {
          const card = ctx.grid[r][c].card;
          if(card && !card.isCobrador && card.temper === "Equilibrado") {
            const visited = new Set();
            const queue = [{row:r, col:c}];
            visited.add(`${r},${c}`);
            let count = 0;
            while(queue.length) {
              const cur = queue.shift();
              count++;
              for(const nb of ctx.neighbors(cur)) {
                const key = `${nb.row},${nb.col}`;
                if(!visited.has(key)) {
                  const nbCard = ctx.grid[nb.row][nb.col].card;
                  if(nbCard && !nbCard.isCobrador && nbCard.temper === "Equilibrado") {
                    visited.add(key);
                    queue.push(nb);
                  }
                }
              }
            }
            if(count > maxAdj) maxAdj = count;
          }
        }
      }
      return maxAdj >= 5;
    }
  },
  { 
    id: "via_paraiso", 
    nome: "Via Paraíso", 
    efeito: "+8 pontos se houver 5 ou mais Tranquilos no Busão.",
    bonus: ["Tranquilo"],
    pontos: 8,
    condicao: (ctx) => ctx.countBus(c => !c.isCobrador && c.temper === "Tranquilo") >= 5
  },
  { 
    id: "passar_cinema", 
    nome: "Passar do Cinema", 
    efeito: "+10 pontos se houver 5 ou mais Silenciosos adjacentes.",
    bonus: ["Silencioso"],
    pontos: 10,
    condicao: (ctx) => {
      let maxAdj = 0;
      for(let r=0;r<ROWS;r++) {
        for(let c=0;c<COLS;c++) {
          const card = ctx.grid[r][c].card;
          if(card && !card.isCobrador && card.comp === "Silencioso") {
            const visited = new Set();
            const queue = [{row:r, col:c}];
            visited.add(`${r},${c}`);
            let count = 0;
            while(queue.length) {
              const cur = queue.shift();
              count++;
              for(const nb of ctx.neighbors(cur)) {
                const key = `${nb.row},${nb.col}`;
                if(!visited.has(key)) {
                  const nbCard = ctx.grid[nb.row][nb.col].card;
                  if(nbCard && !nbCard.isCobrador && nbCard.comp === "Silencioso") {
                    visited.add(key);
                    queue.push(nb);
                  }
                }
              }
            }
            if(count > maxAdj) maxAdj = count;
          }
        }
      }
      return maxAdj >= 5;
    }
  },
  { 
    id: "parar_feira", 
    nome: "Parar na feira livre", 
    efeito: "+4 pontos se houver 3 ou mais Comunicativos no Busão.",
    bonus: ["Comunicativo"],
    pontos: 4,
    condicao: (ctx) => ctx.countBus(c => !c.isCobrador && c.comp === "Comunicativo") >= 3
  },
  { 
    id: "show_rock", 
    nome: "Show de Rock no Centro", 
    efeito: "+4 pontos se houver 4 ou mais Barulhentos no Busão.",
    bonus: ["Barulhento"],
    pontos: 4,
    condicao: (ctx) => ctx.countBus(c => !c.isCobrador && c.comp === "Barulhento") >= 4
  },
  { 
    id: "linha_fantasma", 
    nome: "Linha Fantasma", 
    efeito: "+8 pontos pela maior quantidade de espaços vazios no Busão no fim do jogo.",
    bonus: [],
    pontos: 8,
    condicao: (ctx) => {
      let vazios = 0;
      for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(!ctx.grid[r][c].card) vazios++;
      return vazios > 0;
    }
  }
];

/* ============================
   FUNÇÃO AUXILIAR reqImprovement (CRÍTICA)
============================= */
function reqImprovement(ctx, name) {
  return { ok: ctx.hasImprovement(name), msg: `Requer a melhoria "${name}".` };
}

/* ============================
   CARTAS (passageiros base)
============================= */
function P(obj){ return Object.assign({base:0,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",
  impacto:"final", ability:null, penalty:null, require:null, scoreReq:null, note:null, text:null, isCobrador:false, allowDup:false, isApaixonado:false}, obj); }

const CARD_DB = [
  // Passageiros com Habilidades
  P({id:"caio",nome:"Caio (O Estudante)",base:4,faixa:"Jovem",temper:"Caótico",comp:"Silencioso",
     text:"+1 Ponto para cada Silencioso adjacente.",
     ability:(p,ctx,log)=>{ const n=ctx.countAdj(p, c=>c.comp==="Silencioso"); if(n) log(`+${n} por Silencioso adj.`); return n; }
  }),
  P({id:"leandro",nome:"Leandro (O Dorminhoco)",base:3,faixa:"Adulto",temper:"Equilibrado",comp:"Silencioso",
     text:"+1 Ponto para cada Silencioso no busão.",
     ability:(p,ctx,log)=>{ const n=ctx.countBus(c=>!c.isCobrador && c.comp==="Silencioso"); if(n) log(`+${n} por Silencioso no busão`); return n; }
  }),
  P({id:"sol",nome:"Sol (Good Vibes)",base:2,faixa:"Jovem",temper:"Tranquilo",comp:"Silencioso",
     text:"+1 Ponto por cada Equilibrado e cada Comunicativo no Busão.",
     ability:(p,ctx,log)=>{ const e=ctx.countBus(c=>!c.isCobrador && c.temper==="Equilibrado"); const cm=ctx.countBus(c=>!c.isCobrador && c.comp==="Comunicativo");
       let s=0; if(e){log(`+${e} por Equilibrado no busão`); s+=e;} if(cm){log(`+${cm} por Comunicativo no busão`); s+=cm;} return s; }
  }),
  P({id:"rato",nome:"Rato (O Malandro)",base:1,faixa:"Jovem",temper:"Caótico",comp:"Barulhento",
     text:"+2 pontos por cada Idoso no busão.",
     ability:(p,ctx,log)=>{ const n=ctx.countBus(c=>!c.isCobrador && c.faixa==="Idoso"); if(n){log(`+${2*n} (+2 por ${n} Idoso no busão)`);} return 2*n; }
  }),
  P({id:"raul",nome:"Raul (O Pancada)",base:3,faixa:"Idoso",temper:"Equilibrado",comp:"Barulhento",
     text:"+1 Ponto por cada Jovem e cada Comunicativo Adjacente.",
     ability:(p,ctx,log)=>{ const j=ctx.countAdj(p,c=>c.faixa==="Jovem"); const co=ctx.countAdj(p,c=>c.comp==="Comunicativo");
       let s=0; if(j){log(`+${j} por Jovem adj.`); s+=j;} if(co){log(`+${co} por Comunicativo adj.`); s+=co;} return s; }
  }),
  P({id:"dona_cida",nome:"Dona Cida (A Tagarela)",base:4,faixa:"Idoso",temper:"Caótico",comp:"Barulhento",impacto:"durante-final",
     text:"Pode fazer um Silencioso desembarcar. +1 Ponto por cada Barulhento adjacente.",
     ability:(p,ctx,log)=>{ const n=ctx.countAdj(p,c=>c.comp==="Barulhento"); if(n){log(`+${n} por Barulhento adj.`);} return n; },
     note:"Pode fazer um Silencioso desembarcar."
  }),
  P({id:"ceber",nome:"Céber (O Vendedor)",base:3,faixa:"Adulto",temper:"Caótico",comp:"Barulhento",impacto:"durante",
     text:"Pode fazer um adulto ou um jovem desembarcar.",
     note:"Pode fazer um adulto ou um jovem desembarcar."
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
  P({id:"sheila",nome:"Sheila (A Barraqueira)",base:4,faixa:"Jovem",temper:"Caótico",comp:"Barulhento",impacto:"durante",
     text:"Não pode ser forçada a desembarcar. Ao embarcar, outros 2 passageiros desembarcam.",
     note:"Não pode ser forçada a desembarcar. Ao embarcar, outros 2 passageiros desembarcam."
  }),
  P({id:"feitosa",nome:"Feitosa (O Policial)",base:2,faixa:"Adulto",temper:"Caótico",comp:"Comunicativo",impacto:"durante-final",
     text:"+1 ponto por cada Tranquilo no Busão. Força 'O Trombadinha' a desembarcar e impede seu embarque.",
     ability:(p,ctx,log)=>{ const n=ctx.countBus(c=>!c.isCobrador && c.temper==="Tranquilo"); if(n) log(`+${n} por Tranquilo no busão`); return n; },
     note:"Força 'Faísca (O Trombadinha)' a desembarcar e impede seu embarque."
  }),

  // Passageiros com Penalidades
  P({id:"seu_amadeu",nome:"Seu Amadeu (O Irritado)",base:5,faixa:"Idoso",temper:"Caótico",comp:"Barulhento",impacto:"durante",
     text:"Faz todos os Jovens adjacentes desembarcarem.",
     note:"Faz todos os Jovens adjacentes desembarcarem."
  }),
  P({id:"wesley",nome:"Wesley (O DJ do busão)",base:3,faixa:"Jovem",temper:"Caótico",comp:"Barulhento",impacto:"durante",
     text:"Faz todos os Silenciosos adjacentes desembarcarem.",
     note:"Faz todos os Silenciosos adjacentes desembarcarem."
  }),
  P({id:"celio",nome:"Célio (O Claustrofóbico)",base:3,faixa:"Jovem",temper:"Caótico",comp:"Silencioso",
     text:"Não embarca se não houver pelo menos 1 espaço vazio adjacente. -1 ponto por cada passageiro adjacente.",
     penalty:(p,ctx,log)=>{ const n=ctx.countAdj(p,()=>true); if(n){log(`-${n} ( -1 por adj.)`);} 
       const e=ctx.countAdjEmpty(p); if(e===0) ctx.warn("Célio: precisa de ao menos 1 espaço vazio adjacente durante o jogo (condição de embarque).");
       return -n; }
  }),
  P({id:"marcia_enzo",nome:"Márcia e Enzo (Mãe e Pestinha)",base:2,faixa:"Adulto",temper:"Equilibrado",comp:"Barulhento",
     text:"-2 Pontos para cada Silencioso no Busão.",
     penalty:(p,ctx,log)=>{ const n=ctx.countBus(c=>!c.isCobrador && c.comp==="Silencioso"); if(n){log(`-${2*n} ( -2 por ${n} Silencioso no busão )`);} return -2*n; }
  }),
  P({id:"motolover",nome:"Luiz (Motolover)",base:3,faixa:"Adulto",temper:"Equilibrado",comp:"Silencioso",
     text:"-2 Pontos por cada passageiro no Busão que estiver sentado entre ele e o motorista.",
     penalty:(p,ctx,log)=>{ const n=ctx.countAheadBothRows(p); if(n){log(`-${2*n} ( -2 por ${n} entre ele e o motorista )`);} return -2*n; }
  }),
  P({id:"fabao",nome:"Fabão (O Grandão)",base:1,faixa:"Adulto",temper:"Caótico",comp:"Silencioso",impacto:"durante",
     text:"Ocupa 1 espaço com passageiros e faz todos neste local desembarcarem.",
     note:"Ocupa 1 espaço com passageiros e faz todos neste local desembarcarem."
  }),
  P({id:"waldisnei",nome:"Waldisnei (O Cheiroso)",base:0,faixa:"Jovem",temper:"Caótico",comp:"Comunicativo",impacto:"durante",
     text:"Ao embarcar, faz 2 passageiros adjacentes desembarcarem. -1 Ponto por cada passageiro adjacente.",
     penalty:(p,ctx,log)=>{ const n=ctx.countAdj(p,()=>true); if(n){log(`-${n} ( -1 por adj.)`);} return -n; },
     note:"Ao embarcar, faz 2 passageiros adjacentes desembarcarem."
  }),
  P({id:"claudio",nome:"Cláudio (O Pastor)",base:2,faixa:"Adulto",temper:"Caótico",comp:"Barulhento",impacto:"durante",
     text:"Ao embarcar faz todos os Jovens adjacentes desembarcarem. -1 ponto para cada Silencioso no Busão.",
     penalty:(p,ctx,log)=>{ const n=ctx.countBus(c=>!c.isCobrador && c.comp==="Silencioso"); if(n){log(`-${n} ( -1 por ${n} Silencioso no busão )`);} return -n; },
     note:"Ao embarcar faz todos os Jovens adjacentes desembarcarem."
  }),
  P({id:"roberto",nome:"Roberto (O Bonzinho)",base:6,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",impacto:"durante",
     text:"Se, depois dele, um Idoso ou 'A Gestante' embarcar, ele desembarca para ceder o seu lugar.",
     note:"Se, depois dele, um Idoso ou 'A Gestante' embarcar, ele desembarca para ceder o seu lugar."
  }),
  P({id:"charles",nome:"Charles (O Maromba)",base:4,faixa:"Adulto",temper:"Equilibrado",comp:"Barulhento",
     text:"-1 ponto por cada passageiro adjacente. -3 Pontos se 'O Grandão' estiver no Busão.",
     penalty:(p,ctx,log)=>{ const adj=ctx.countAdj(p,()=>true); let s=-adj; if(ctx.existsId("fabao")){ s-=3; log("-3 adicionais: Grandão presente"); }
       if(adj) log(`-${adj} ( -1 por adj.)`); return s; }
  }),
  P({id:"yasmin",nome:"Yasmin (A Louca por Gatos)",base:2,faixa:"Adulto",temper:"Tranquilo",comp:"Comunicativo",
     text:"-1 ponto por cada passageiro Adulto no Busão, -5 pontos se 'O Caramelo' estiver no Busão.",
     penalty:(p,ctx,log)=>{ 
       const adultos = ctx.countBus(c=>!c.isCobrador && c.faixa==="Adulto");
       let s = -adultos;
       if(ctx.existsId("costelinha")) { s -= 5; log("-5 adicionais: Caramelo presente"); }
       if(adultos) log(`-${adultos} ( -1 por ${adultos} Adulto no busão )`);
       return s;
     }
  }),

  // Passageiros com Exigências
  P({id:"ana_gestante",nome:"Ana (A Gestante)",base:5,faixa:"Adulto",temper:"Tranquilo",comp:"Comunicativo",
     text:"Só embarca se o Busão estiver equipado com a melhoria Assentos Reclináveis.",
     require:(ctx)=> reqImprovement(ctx,"Assentos Reclináveis")
  }),
  P({id:"joao_cadeirante",nome:"João (O Cadeirante)",base:6,faixa:"Jovem",temper:"Equilibrado",comp:"Silencioso",
     text:"Só embarca se o Busão estiver equipado com a melhoria Acessibilidade.",
     require:(ctx)=> reqImprovement(ctx,"Acessibilidade")
  }),
  P({id:"peter",nome:"Peter (O Playboy)",base:7,faixa:"Jovem",temper:"Equilibrado",comp:"Barulhento",
     text:"Só embarca se o Busão estiver equipado com todas as 3 melhorias possíveis.",
     require:(ctx)=> ({ok: ctx.improvements.length===3, msg:"Precisa das 3 melhorias ativas."})
  }),
  P({id:"mari",nome:"Mari (A Conectada)",base:4,faixa:"Jovem",temper:"Tranquilo",comp:"Silencioso",
     text:"Só embarca se o Busão estiver equipado com a melhoria Wi-Fi e Tomadas.",
     require:(ctx)=> reqImprovement(ctx,"Wi-Fi e Tomadas")
  }),
  P({id:"wilson",nome:"Wilson (O Pai de Planta)",base:5,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",
     text:"Só embarca se puder ocupar os 2 Assentos de uma mesma coluna. +1 Ponto para cada Idoso adjacente.",
     ability:(p,ctx,log)=>{ const n=ctx.countAdj(p,c=>c.faixa==="Idoso"); if(n){log(`+${n} por Idoso adj.`);} return n; },
     require:(ctx,p)=> {
       const other = p.row===0 ? ctx.getPos(1,p.col) : ctx.getPos(0,p.col);
       const ok = !other.card;
       return {ok, msg:"Wilson ocupa os 2 lugares (deixe vazio o par da coluna)."};
     }
  }),
  P({id:"dona_mirtes",nome:"Dona Mirtes (A Fofoqueira)",base:5,faixa:"Adulto",temper:"Tranquilo",comp:"Comunicativo",
     text:"Só pontua se estiver adjacente a pelo menos um Comunicativo.",
     scoreReq:(ctx,p)=> ({ok: ctx.countAdj(p,c=>c.comp==="Comunicativo")>0, msg:"Precisa estar adjacente a pelo menos 1 Comunicativo para pontuar."})
  }),
  P({id:"misterioso",nome:"O Misterioso",base:4,faixa:"Adulto",temper:"Tranquilo",comp:"Silencioso",
     text:"Só embarca se puder se sentar no fundo do Busão (coluna 6).",
     require:(ctx,p)=> ({ok: p.col===5, msg:"Só embarca no fundo do busão (coluna 6)."})
  }),

  // Passageiros Especiais
  P({id:"jorge",nome:"Jorge (O Perdido)",base:4,faixa:"Adulto",temper:"Caótico",comp:"Barulhento",impacto:"durante",
     text:"Embarque imediato sem custo. Troca de Busão no sentido horário ao final de cada rodada.",
     note:"Embarque imediato sem custo. Troca de Busão no sentido horário ao final de cada rodada."
  }),
  P({id:"dabs",nome:"Dabs (A Board Gamer)",base:6,faixa:"Adulto",temper:"Tranquilo",comp:"Comunicativo",impacto:"durante",
     text:"Ao embarcar, pode fazer até dois passageiros com Penalidade desembarcarem.",
     note:"Ao embarcar, pode fazer até dois passageiros com Penalidade desembarcarem."
  }),
  P({id:"dona_fausta",nome:"Dona Fausta (A Desconfiada)",base:1,faixa:"Idoso",temper:"Caótico",comp:"Silencioso",
     text:"Se estiver no Busão no fim da partida, as melhorias do busão não dão pontos extras.",
     note:"Se estiver no Busão no fim da partida, as melhorias do busão não dão pontos extras."
  }),
  P({id:"costelinha",nome:"Costelinha (O Caramelo)",base:1,faixa:"?",temper:"?",comp:"?",
     text:"+1 ponto para cada passageiro no Busão.",
     ability:(p,ctx,log)=>{ const n=ctx.countBus(c=>!c.isCobrador); if(n){log(`+${n} por ${n} passageiro(s) no busão`);} return n; }
  }),
  P({id:"vovo_michel",nome:"Vovó Michel (O Guia do Busão)",base:0,faixa:"Idoso",temper:"Equilibrado",comp:"Barulhento",
     text:"Dobra os pontos concedidos pelo motorista.",
     note:"Dobra os pontos concedidos pelo motorista.",
  }),
  P({id:"alison",nome:"Alison (O Mago de Araque)",base:3,faixa:"Adulto",temper:"Tranquilo",comp:"Comunicativo",impacto:"durante",
     text:"Ao embarcar faz um passageiro à sua escolha em cada Busão adversário desembarcar.",
     note:"Ao embarcar faz um passageiro à sua escolha em cada Busão adversário desembarcar."
  }),
  P({id:"soraya",nome:"Soraya (A Cigana)",base:4,faixa:"Idoso",temper:"Caótico",comp:"Comunicativo",impacto:"durante-final",
     text:"Olhe a mão de um jogador e pegue uma carta para você. +1 ponto para Adultos adjacentes.",
     ability:(p,ctx,log)=>{ const n=ctx.countAdj(p, c=>c.faixa==="Adulto"); if(n) log(`+${n} por Adulto adj.`); return n; },
     note:"Efeito de jogo: Olhe a mão de um jogador e pegue uma carta para você."
  }),
  P({id:"bianca_bombom",nome:"Bianca Bombom (A Drag Queen)",base:5,faixa:"Adulto",temper:"Equilibrado",comp:"Barulhento",impacto:"durante",
     text:"Ao embarcar, pode trocar até 3 passageiros de lugar dentro do Busão.",
     note:"Ao embarcar, pode trocar até 3 passageiros de lugar dentro do Busão."
  }),
  P({id:"faisca",nome:"Faísca (O Trombadinha)",base:1,faixa:"Jovem",temper:"Caótico",comp:"Silencioso",impacto:"durante-final",
     text:"Puxe 1 carta da mão de cada jogador adversário para você.",
     note:"Efeito de jogo: Puxe 1 carta da mão de cada jogador adversário para você.",
     require:(ctx)=> ({ok: !ctx.existsId("feitosa"), msg:"Não embarca se Feitosa (O Policial) estiver no busão."})
  }),
  P({id:"marcelo",nome:"Marcelo (O Papai Noel de Shopping)",base:1,faixa:"Idoso",temper:"Equilibrado",comp:"Silencioso",impacto:"durante",
     text:"Ganhe 1 carta da mão de cada jogador. Em seguida dê uma carta da sua mão a um jogador à sua escolha.",
     note:"Efeito de jogo: Ganhe 1 carta da mão de cada jogador. Em seguida dê uma carta da sua mão a um jogador à sua escolha."
  }),
  P({id:"douglas",nome:"Douglas (O Rapper do Busão)",base:3,faixa:"Adulto",temper:"Equilibrado",comp:"Barulhento",impacto:"durante",
     text:"Anuncie o nome de um passageiro ou cobrador. Procure-o no terminal e embarque o sem custo.",
     note:"Efeito de jogo: Anuncie o nome de um passageiro ou cobrador. Procure-o no terminal e embarque o sem custo."
  }),
  P({id:"serjao",nome:"Serjão (O Mecânico)",base:3,faixa:"Adulto",temper:"Tranquilo",comp:"Silencioso",impacto:"durante",
     text:"Ao embarcar, pode realizar uma Melhoria do Busão sem custo.",
     note:"Ao embarcar, pode realizar uma Melhoria do Busão sem custo."
  }),
  P({id:"dona_neuza",nome:"Dona Neuza (A Salcoleira)",base:4,faixa:"Adulto",temper:"Caótico",comp:"Comunicativo",impacto:"durante",
     text:"Enquanto ela estiver embarcada, quem controla o Busão recebe +1 ponto de ação.",
     note:"Enquanto ela estiver embarcada, quem controla o Busão recebe +1 ponto de ação."
  })
];

/* ============================
   EXPANSÃO – COBRADORES (máx. 1)
============================= */
const COBRADORES = [
  P({id:"cob_marlene",nome:"Marlene (O Anjo da Terceira idade) [Cobrador]",isCobrador:true,base:0,
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
  P({id:"cob_angelina",nome:"Angelina (A tranquilidade em pessoa) [Cobrador]",isCobrador:true,base:0,
     text:"+2 pontos para cada Tranquilo",
     ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.temper==="Tranquilo"); if(n) log(`+${2*n} (+2 por ${n} Tranquilo)`); return 2*n;}
  }),
  P({id:"cob_saulo",nome:"Saulo (O Indiferente) [Cobrador]",isCobrador:true,base:0,
     text:"+2 pontos para cada Equilibrado",
     ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.temper==="Equilibrado"); if(n) log(`+${2*n} (+2 por ${n} Equilibrado)`); return 2*n;}
  }),
  P({id:"cob_leozinho",nome:"Léozinho (O Causador) [Cobrador]",isCobrador:true,base:0,
     text:"+2 pontos para cada Caótico",
     ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.temper==="Caótico"); if(n) log(`+${2*n} (+2 por ${n} Caótico)`); return 2*n;}
  }),
  P({id:"cob_padilha",nome:"Padilha (O Cansado) [Cobrador]",isCobrador:true,base:0,
     text:"+2 pontos para cada Silencioso",
     ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.comp==="Silencioso"); if(n) log(`+${2*n} (+2 por ${n} Silencioso)`); return 2*n;}
  }),
  P({id:"cob_camila",nome:"Camila (A Conversadeira) [Cobrador]",isCobrador:true,base:0,
     text:"+2 pontos para cada Comunicativo",
     ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.comp==="Comunicativo"); if(n) log(`+${2*n} (+2 por ${n} Comunicativo)`); return 2*n;}
  }),
  P({id:"cob_gilmar",nome:"Gilmar (O Escandaloso) [Cobrador]",isCobrador:true,base:0,
     text:"+2 pontos para cada Barulhento",
     ability:(p,ctx,log)=>{const n=ctx.countBus(c=>!c.isCobrador && c.comp==="Barulhento"); if(n) log(`+${2*n} (+2 por ${n} Barulhento)`); return 2*n;}
  }),
];

/* ============================
   EXPANSÃO – OS APAIXONADOS (duplicáveis)
============================= */
const APAIXONADOS = [
  P({id:"apa_paulo",nome:"Paulo (O Apaixonado)", base:3, faixa:"Jovem", temper:"Equilibrado", comp:"Comunicativo",
     text:"Pode atrair um outro Apaixonado(a) que estiver visível no Ponto de Ônibus ou no Terminal para dentro do seu Busão.", allowDup:true, isApaixonado:true }),
  P({id:"apa_silvinha",nome:"Silvinha (A Apaixonada)", base:2, faixa:"Jovem", temper:"Tranquilo", comp:"Silencioso",
     text:"Pode procurar por um Apaixonado(a) dentro do Terminal e embarcar imediatamente sem custo ao seu lado.", allowDup:true, isApaixonado:true }),
  P({id:"apa_igor",nome:"Igor (O Apaixonado)", base:1, faixa:"Jovem", temper:"Caótico", comp:"Silencioso",
     text:"Pode atrair um(a) outro(a) apaixonado(a) de dentro de um Busão adversário para a sua mão.", allowDup:true, isApaixonado:true }),
  P({id:"apa_jessica",nome:"Jéssica (A Apaixonada)", base:4, faixa:"Jovem", temper:"Equilibrado", comp:"Barulhento",
     text:"Só pontua se estiver com outro(a) apaixonado(a) no Busão.", allowDup:true, isApaixonado:true,
     scoreReq:(ctx,p)=> ({ok: ctx.countBus(c=>c.isApaixonado)>1, msg:"Precisa estar com outro apaixonado no busão para pontuar."})
  }),
];

/* ============================
   EXPANSÃO – ESTOU NO BUSAO
============================= */
const ESTOU_NO_BUSAO = [
  P({id:"gleidson",nome:"Gleidson (O Sensitivo)",base:3,faixa:"Adulto",temper:"Tranquilo",comp:"Silencioso",
     note:"Enquanto estiver embarcado, você pode olhar as 3 primeiras cartas da Rua uma vez por turno, sem custo."
  }),
  P({id:"marcos",nome:"Marcos (O Desligado)",base:5,faixa:"Adulto",temper:"Equilibrado",comp:"Silencioso",
     note:"Se algum passageiro for forçado a desembarcar, ele também desembarca."
  }),
  P({id:"ursinha",nome:"Ursinha (A Furiosa)",base:0,faixa:"?",temper:"?",comp:"?",
     penalty:(p,ctx,log)=>{ const n=ctx.countBus(c=>!c.isCobrador); if(n){log(`-${n} ( -1 por ${n} passageiro(s) no busão )`);} return -n; },
     text:"-1 ponto por cada passageiro no Busão."
  }),
  P({id:"santiago",nome:"Santiago (O Parça do Busão)",base:2,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",
     text:"+5 pontos se, ao final do jogo, o Busão estiver completo, com todos os assentos ocupados.",
     ability:(p,ctx,log)=>{ 
       let ocupados = 0;
       for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(ctx.grid[r][c].card) ocupados++;
       if(ocupados === 12) { log("+5 (Busão completo)"); return 5; }
       return 0;
     }
  }),
  P({id:"sao_dadinho",nome:"São Dadinho (O Mascote de Loja)",base:4,faixa:"Jovem",temper:"Equilibrado",comp:"Barulhento",
     note:"Ao embarcar, role um dado: se tirar 6, jogue outro turno com 3 pontos de ação, caso contrário, nada acontece."
  }),
  P({id:"bia_cosmic",nome:"Bia Cosmic (A Sonhadora)",base:4,faixa:"Idoso",temper:"Caótico",comp:"Comunicativo",
     note:"Se 'A Board Gamer' estiver no Busão, ela embarca sem custo e vice-versa."
  }),
  P({id:"sabrina",nome:"Sabrina (A Guerreira)",base:2,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",
     note:"Protege a coluna em que está. Nenhum passageiro nela pode ser forçado a desembarcar."
  }),
  P({id:"adriana",nome:"Adriana (A Professora)",base:3,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",
     note:"Ao embarcar, pode pegar todos os Jovens do Ponto de Ônibus e do topo do Terminal para sua mão sem custo."
  }),
  P({id:"elblond",nome:"Elblond (O Cosplayer)",base:0,faixa:"Adulto",temper:"Caótico",comp:"Barulhento",
     note:"Pode ser descartado no Terminal para dar lugar a outro passageiro sem custo de embarque."
  }),
  P({id:"lais_fofinha",nome:"Lais (A Fofinha)",base:1,faixa:"Jovem",temper:"Tranquilo",comp:"Comunicativo",
     text:"Se houver a melhoria Ar-condicionado, +1 ponto para cada passageiro adjacente.",
     ability:(p,ctx,log)=>{ if(!ctx.hasImprovement("Ar-condicionado")) return 0; const n=ctx.countAdj(p,()=>true); if(n){log(`+${n} (Ar-condicionado ativo: +1 por ${n} adj.)`);} return n; }
  }),
  P({id:"brenda_ti",nome:"Brenda (A moça do TI)",base:2,faixa:"Adulto",temper:"Equilibrado",comp:"Silencioso",
     note:"Pode embarcar 1 passageiro sem custo em qualquer Busão."
  }),
  P({id:"alessa",nome:"Alessa (A Multitarefas)",base:1,faixa:"Adulto",temper:"Caótico",comp:"Comunicativo",
     note:"Ao embarcar, jogue um novo turno completo com 3 Pontos de Ação."
  }),
  P({id:"lais_cansada",nome:"Lais (A Cansada)",base:3,faixa:"Adulto",temper:"Tranquilo",comp:"Silencioso",
     note:"Enquanto ela estiver embarcada, o jogador que controla o Busão em que ela está tem -1 Ponto de Ação."
  }),
  P({id:"josias",nome:"Josias (O Jogador de RPG)",base:2,faixa:"Jovem",temper:"Caótico",comp:"Comunicativo",
     note:"Efeito de jogo: Ao embarcar, role um dado. O número tirado indica quantos pontos de ação você terá no seu próximo turno."
  }),
  P({id:"edio",nome:"Édio (O Músico)",base:1,faixa:"Adulto",temper:"Tranquilo",comp:"Barulhento",
     note:"Efeito de jogo: Ao embarcar, pode trazer um passageiro de um Busão adversário para o seu Busão."
  }),
  P({id:"isabel",nome:"Isabel (A Artesã)",base:3,faixa:"Adulto",temper:"Tranquilo",comp:"Silencioso",
     text:"Se ela estiver em seu busão no fim do jogo, as cartas em sua mão não valem pontos negativos."
  }),
  P({id:"joao_monstrao",nome:"João (O Monstrão)",base:2,faixa:"Adulto",temper:"Caótico",comp:"Barulhento",
     note:"Efeito de jogo: Neste turno você tem +2 pontos de ação."
  }),
  P({id:"malk",nome:"Malk (O Vampiro Excêntrico da marginal)",base:-3,faixa:"Adulto",temper:"Caótico",comp:"Comunicativo",
     note:"Efeito de jogo: Escolha 1 jogador para perder 1 ponto de ação e outro para ganhar 1 ponto de ação extra nesta rodada."
  }),
  P({id:"mateus",nome:"Mateus (O Gente Boa)",base:4,faixa:"?",temper:"?",comp:"?",
     text:"Coringa: As 3 melhores tags (1 de cada categoria) de bônus do motorista/melhorias são atribuídas a ele automaticamente."
  }),
  P({id:"elson",nome:"Elson Dion (O Gaúcho)",base:2,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",
     text:"+2 pontos por cada Comunicativo adjacente.",
     ability:(p,ctx,log)=>{ const n=ctx.countAdj(p, c=>c.comp==="Comunicativo"); if(n) log(`+${2*n} por Comunicativo adj.`); return 2*n; }
  }),
  P({id:"manuela_natan",nome:"Manuela e Natan (Os Menores Desacompanhados)",base:4,faixa:"Jovem",temper:"Caótico",comp:"Silencioso",
     text:"Só embarcam e/ou pontuam no fim do jogo se estiverem adjacentes a um adulto.",
     require:(ctx,p)=> ({ok: ctx.countAdj(p, c=>c.faixa==="Adulto")>0, msg:"Precisa embarcar adjacente a um Adulto."}),
     scoreReq:(ctx,p)=> ({ok: ctx.countAdj(p,c=>c.faixa==="Adulto")>0, msg:"Precisa estar adjacente a pelo menos 1 Adulto para pontuar."})
  }),
  P({id:"beatriz",nome:"Beatriz (A Fisioterapeuta)",base:2,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",
     text:"Se no busão estiver a melhoria 'Acessibilidade', +3 para cada idoso adjacente.",
     ability:(p,ctx,log)=>{ if(!ctx.hasImprovement("Acessibilidade")) return 0; const n=ctx.countAdj(p,c=>c.faixa==="Idoso");
       if(n){log(`+${3*n} (Acessibilidade ativa: +3 por ${n} Idoso adj.)`);} return 3*n; }
  }),
  P({id:"lucas",nome:"Lucas (O Mario do Carnaval)",base:6,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",
     text:"Só pontua se estiver adjacente ao passageiro 'Luigi do Carnaval'.",
     scoreReq:(ctx,p)=> ({ok: ctx.countAdj(p,c=>c.id==="guilherme")>0, msg:"Precisa estar adjacente a 'Guilherme (O Luigi do Carnaval)' para pontuar."})
  }),
  P({id:"guilherme",nome:"Guilherme (O Luigi do Carnaval)",base:6,faixa:"Adulto",temper:"Equilibrado",comp:"Comunicativo",
     text:"Só pontua se estiver adjacente ao passageiro 'Mario do Carnaval'.",
     scoreReq:(ctx,p)=> ({ok: ctx.countAdj(p,c=>c.id==="lucas")>0, msg:"Precisa estar adjacente a 'Lucas (O Mario do Carnaval)' para pontuar."})
  }),
  P({id:"nelson",nome:"Nelson (O Nerd Velho)",base:8,faixa:"Adulto",temper:"Tranquilo",comp:"Silencioso",
     text:"Só pontua se estiver sozinho na coluna que ocupa.",
     scoreReq:(ctx,p)=> {
       const other = p.row===0 ? ctx.getPos(1,p.col) : ctx.getPos(0,p.col);
       const ok = !other.card;
       return {ok, msg:"Precisa estar sozinho na coluna para pontuar."};
     }
  }),
  P({id:"bia",nome:"Anna Beatriz (A Crossfiteira)",base:1,faixa:"Adulto",temper:"Caótico",comp:"Comunicativo",
     note:"Efeito de jogo: Pode trazer um passageiro de cada Busão adversário para o seu Busão."
  }),
  P({id:"adrian_giovanna",nome:"Adrian e Giovanna (Os Noivos)",base:3,faixa:"Adulto",temper:"Tranquilo",comp:"Silencioso",
     text:"+1 ponto por cada passageiro adjacente.",
     ability:(p,ctx,log)=>{ const n=ctx.countAdj(p,()=>true); if(n){log(`+${n} por passageiro adj.`);} return n; }
  })
];

/* ============================
   EXPANSÃO – LENDAS URBANAS
============================= */
const LENDAS_URBANAS = [
  P({id:"paula",nome:"Paula (A Loira do Banheiro)",base:1,faixa:"Adulto",temper:"Caótico",comp:"Comunicativo",
     text:"Exigência: -7 pontos se não tiver a melhoria Banheiro no Busão.",
     require:(ctx)=> ({ok: ctx.hasImprovement("Banheiro"), msg:"Requer a melhoria Banheiro, caso contrário, -7 pontos."}),
     penalty:(p,ctx,log)=> {
       if(!ctx.hasImprovement("Banheiro")) { log("-7 por não ter Banheiro"); return -7; }
       return 0;
     }
  }),
  P({id:"tomate",nome:"Tomate (O Palhaço Sinistro)",base:2,faixa:"Adulto",temper:"Caótico",comp:"Comunicativo",
     text:"Penalidade: Todos os idosos e jovens adjacentes desembarcam.",
     note:"Penalidade: Todos os idosos e jovens adjacentes desembarcam."
  }),
  P({id:"seu_osvaldo",nome:"Seu Osvaldo (O Velho do Saco)",base:2,faixa:"Idoso",temper:"Caótico",comp:"Barulhento",
     text:"Penalidade: -3 pontos para cada jovem e cada tranquilo no Busão.",
     penalty:(p,ctx,log)=> {
       const jovens = ctx.countBus(c=>!c.isCobrador && c.faixa==="Jovem");
       const tranquilos = ctx.countBus(c=>!c.isCobrador && c.temper==="Tranquilo");
       const total = (jovens + tranquilos) * -3;
       if(total < 0) log(`${total} (-3 por cada Jovem e cada Tranquilo: ${jovens}+${tranquilos}=${jovens+tranquilos})`);
       return total;
     }
  }),
  P({id:"seu_valdir",nome:"Seu Valdir (O Lobisomem de Bairro)",base:4,faixa:"Idoso",temper:"Tranquilo",comp:"Silencioso",
     text:"Especial: Afasta os passageiros adjacentes um espaço para longe. Quem não tiver para onde ir, desembarca.",
     note:"Especial: Afasta os passageiros adjacentes um espaço para longe. Quem não tiver para onde ir, desembarca."
  }),
  P({id:"gerson",nome:"Gerson (O Fantasma do Último Ponto)",base:-5,faixa:"Jovem",temper:"Equilibrado",comp:"Silencioso",
     text:"Penalidade: Não pode ser forçado a desembarcar. A não ser que seja a rodada final.",
     note:"Penalidade: Não pode ser forçado a desembarcar. A não ser que seja a rodada final."
  })
];

/* ============================
   EXPANSÃO – GRUPO DE PAGODE
============================= */
const GRUPO_PAGODE = [
  P({id:"dudu",nome:"Dudu (O Pagodeiro no Cavaquinho)",base:2,faixa:"Jovem",temper:"Equilibrado",comp:"Comunicativo",
     text:"Penalidade: Pode fazer um pagodeiro de outro Busão desembarcar.",
     note:"Penalidade: Pode fazer um pagodeiro de outro Busão desembarcar."
  }),
  P({id:"zeca",nome:"Zeca (O Pagodeiro no Pandeiro)",base:3,faixa:"Adulto",temper:"Tranquilo",comp:"Barulhento",
     text:"Especial: Pode ativar novamente o efeito de embarque de outro passageiro já embarcado em seu Busão.",
     note:"Especial: Pode ativar novamente o efeito de embarque de outro passageiro já embarcado em seu Busão."
  }),
  P({id:"thiago",nome:"Thiago (O Pagodeiro no Tamborim)",base:4,faixa:"Jovem",temper:"Caótico",comp:"Silencioso",
     text:"Especial: Pode trocar de lugar com algum outro passageiro no Busão 1 vez a qualquer momento do jogo.",
     note:"Especial: Pode trocar de lugar com algum outro passageiro no Busão 1 vez a qualquer momento do jogo."
  }),
  P({id:"arlindo",nome:"Arlindo (O Pagodeiro no Tantan)",base:5,faixa:"Adulto",temper:"Equilibrado",comp:"Silencioso",
     text:"Exigência: Só embarca se outro passageiro do grupo de Pagode já estiver no Busão.",
     require:(ctx)=> ({ok: ctx.countBus(c=>c.id && GRUPO_PAGODE.map(g=>g.id).includes(c.id)) > 0, msg:"Requer outro pagodeiro no busão."})
  }),
  P({id:"xande",nome:"Xande (O Pagodeiro no Reco-reco)",base:1,faixa:"Adulto",temper:"Caótico",comp:"Comunicativo",
     text:"Especial: Pode fazer um outro pagodeiro da sua mão embarcar sem custo.",
     note:"Especial: Pode fazer um outro pagodeiro da sua mão embarcar sem custo."
  })
];

/* ============================
   UI refs
============================= */
const byName = (a,b)=> a.nome.localeCompare(b.nome);
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

/* ======= Abas (topo) ======= */
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

/* ======= Abinhas internas (Regras/FAQ) ======= */
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
  if(!d || !d.id){
    DRIVER_INFO.innerHTML = `<div class="driver-card"><div><b>Sem motorista</b></div><div class="muted">Selecione um motorista para ativar o bônus.</div></div>`;
  }else{
    DRIVER_INFO.innerHTML = `<div class="driver-card"><div><b>${d.nome}</b></div><div class="muted">+1 por: ${d.bonus.join(" • ")}</div></div>`;
  }
  renderImprovInfo();
}

/* ======= Melhorias como BOTÕES ======= */
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
    ? imps.map(i => `<div class="improv-card"><div><b>${i.nome}</b></div><div class="muted">+1 por: ${i.bonus.join(" • ")}</div></div>`).join("")
    : `<div class="improv-card"><div><b>Nenhuma melhoria selecionada</b></div><div class="muted">Você pode ativar até 3 melhorias.</div></div>`;
}

/* ======= Perrengues como BOTÕES ======= */
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

/* ======= Rotas Diárias como BOTÕES ======= */
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