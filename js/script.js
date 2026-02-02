/* ==========================================================================
   1. BANCO DE DADOS - MOTORISTAS, MELHORIAS E EXPANSÕES
   ========================================================================== */
const DRIVERS = [
    { id: "", nome: "— selecione um motorista —", bonus: [] },
    { id: "bigode", nome: "Bigode", bonus: ["Jovem", "Caótico", "Barulhento"] },
    { id: "lucinha", nome: "Lucinha", bonus: ["Adulto", "Tranquilo", "Silencioso"] },
    { id: "montanha", nome: "Montanha", bonus: ["Idoso", "Equilibrado", "Comunicativo"] },
    { id: "paty", nome: "Paty", bonus: ["Jovem", "Tranquilo", "Comunicativo"] },
    { id: "pedrinho", nome: "Pedrinho", bonus: ["Adulto", "Caótico", "Silencioso"] },
    { id: "pereirao", nome: "Pereirão", bonus: ["Idoso", "Equilibrado", "Barulhento"] },
];

const IMPROVEMENTS = [
    { id: "acess", nome: "Acessibilidade", bonus: ["Idoso", "Tranquilo"], reqTag: "Acessibilidade" },
    { id: "ar", nome: "Ar-condicionado", bonus: ["Caótico", "Silencioso"] },
    { id: "reclinaveis", nome: "Assentos Reclináveis", bonus: ["Adulto", "Barulhento"], reqTag: "Assentos Reclináveis" },
    { id: "banheiro", nome: "Banheiro", bonus: ["Adulto", "Silencioso"] },
    { id: "cortinas", nome: "Cortinas", bonus: ["Idoso", "Caótico"] },
    { id: "som", nome: "Sistema de Som", bonus: ["Barulhento", "Caótico"] },
    { id: "tv", nome: "TV de Bordo", bonus: ["Equilibrado", "Comunicativo"] },
    { id: "wifi", nome: "Wi-Fi e Tomadas", bonus: ["Jovem", "Comunicativo"], reqTag: "Wi-Fi e Tomadas" },
    { id: "seguranca", nome: "Sistema de Segurança", bonus: ["Jovem", "Tranquilo"], reqTag: "Sistema de Segurança" }
];

const PERRENGUES = [
    { id: "transito", nome: "Trânsito Parado", efeito: "Fim de jogo: Passageiros Barulhentos +1 ponto.", bonus: ["Barulhento"], pontos: 1 },
    { id: "fiscalizacao", nome: "Fiscalização", efeito: "Fim de jogo: Passageiros Tranquilos +2 pontos.", bonus: ["Tranquilo"], pontos: 2 },
    { id: "flatulencia", nome: "Flatulência", efeito: "Fim de jogo: Passageiros Caóticos +1 ponto.", bonus: ["Caótico"], pontos: 1 },
    { id: "alagamento", nome: "Ilhado", efeito: "Fim de jogo: Passageiros Equilibrados +1 ponto.", bonus: ["Equilibrado"], pontos: 1 },
    { id: "greve", nome: "Greve", efeito: "Fim de jogo: Passageiros Jovens +1 ponto.", bonus: ["Jovem"], pontos: 1 },
    { id: "obra", nome: "Obra na Avenida", efeito: "Fim de jogo: Passageiros Adultos –1 ponto.", bonus: ["Adulto"], pontos: -1 },
    { id: "roubo", nome: "Roubo de Celular", efeito: "Fim de jogo: Passageiros Silenciosos +1 ponto.", bonus: ["Silencioso"], pontos: 1 },
    { id: "pneu", nome: "Pneu Furado", efeito: "Fim de jogo: Passageiros Idosos +2 pontos.", bonus: ["Idoso"], pontos: 2 },
    { id: "troca", nome: "Troca de Turno", efeito: "Fim de jogo: Passageiros Comunicativos +1 ponto.", bonus: ["Comunicativo"], pontos: 1 },
    { id: "acidente", nome: "Acidente", efeito: "Dobre a maior categoria do seu motorista.", bonus: [], pontos: 0 }
];

/* ==========================================================================
   2. FUNÇÕES AUXILIARES DE CRIAÇÃO DE CARTAS
   ========================================================================== */
function P(obj) {
    return Object.assign({
        base: 0, faixa: "Adulto", temper: "Equilibrado", comp: "Comunicativo",
        impacto: "final", ability: null, penalty: null, require: null, scoreReq: null,
        note: null, text: null, isCobrador: false, allowDup: false, isApaixonado: false
    }, obj);
}

const CARD_DB = [
    P({ id: "caio", nome: "Caio (Estudante)", base: 4, faixa: "Jovem", temper: "Caótico", comp: "Silencioso", text: "+1 por Silencioso adjacente.", ability: (p, ctx, log) => { const n = ctx.countAdj(p, c => c.comp === "Silencioso"); if (n) log(`+${n} por Silencioso adj.`); return n; } }),
    P({ id: "sol", nome: "Sol (Good Vibes)", base: 2, faixa: "Jovem", temper: "Tranquilo", comp: "Silencioso", text: "+1 por cada Equilibrado e Comunicativo no Busão.", ability: (p, ctx, log) => { const e = ctx.countBus(c => !c.isCobrador && c.temper === "Equilibrado"); const cm = ctx.countBus(c => !c.isCobrador && c.comp === "Comunicativo"); let s = 0; if (e) { log(`+${e} por Equilibrado`); s += e; } if (cm) { log(`+${cm} por Comunicativo`); s += cm; } return s; } }),
    P({ id: "rato", nome: "Rato (Malandro)", base: 1, faixa: "Jovem", temper: "Caótico", comp: "Barulhento", text: "+2 por cada Idoso no busão.", ability: (p, ctx, log) => { const n = ctx.countBus(c => !c.isCobrador && c.faixa === "Idoso"); if (n) log(`+${2 * n} por Idosos`); return 2 * n; } }),
    P({ id: "seu_horacio", nome: "Seu Horácio (Antissocial)", base: 3, faixa: "Idoso", temper: "Equilibrado", comp: "Silencioso", text: "+3 por espaço vazio adjacente.", ability: (p, ctx, log) => { const e = ctx.countAdjEmpty(p); if (e) log(`+${3 * e} por vazios adj.`); return 3 * e; } }),
    P({ id: "ana_gestante", nome: "Ana (Gestante)", base: 5, faixa: "Adulto", temper: "Tranquilo", comp: "Comunicativo", text: "Requer Assentos Reclináveis.", require: (ctx) => ({ ok: ctx.hasImprovement("Assentos Reclináveis"), msg: "Requer Assentos Reclináveis" }) }),
    P({ id: "joao_cadeirante", nome: "João (Cadeirante)", base: 6, faixa: "Jovem", temper: "Equilibrado", comp: "Silencioso", text: "Requer Acessibilidade.", require: (ctx) => ({ ok: ctx.hasImprovement("Acessibilidade"), msg: "Requer Acessibilidade" }) }),
    P({ id: "misterioso", nome: "O Misterioso", base: 4, faixa: "Adulto", temper: "Tranquilo", comp: "Silencioso", text: "Só senta no fundo (coluna 6).", require: (ctx, p) => ({ ok: p.col === 5, msg: "Só senta na coluna 6" }) }),
    P({ id: "vovo_michel", nome: "Vovó Michel", base: 0, faixa: "Idoso", temper: "Equilibrado", comp: "Barulhento", text: "Dobra pontos do motorista.", note: "Dobra pontos do motorista." }),
    P({ id: "dona_fausta", nome: "Dona Fausta", base: 1, faixa: "Idoso", temper: "Caótico", comp: "Silencioso", text: "Melhorias não pontuam.", note: "Melhorias não pontuam." }),
    P({ id: "costelinha", nome: "Costelinha (Caramelo)", base: 1, faixa: "?", temper: "?", comp: "?", text: "+1 por passageiro no busão.", ability: (p, ctx, log) => { const n = ctx.countBus(c => !c.isCobrador); if (n) log(`+${n} por passageiros`); return n; } })
];

const COBRADORES = [
    P({ id: "cob_marlene", nome: "Marlene (Cobradora)", isCobrador: true, text: "+2 por cada Idoso.", ability: (p, ctx, log) => { const n = ctx.countBus(c => !c.isCobrador && c.faixa === "Idoso"); if (n) log(`+${2 * n} por Idosos`); return 2 * n; } }),
    P({ id: "cob_ze", nome: "Zé (Cobrador)", isCobrador: true, text: "+2 por cada Adulto.", ability: (p, ctx, log) => { const n = ctx.countBus(c => !c.isCobrador && c.faixa === "Adulto"); if (n) log(`+${2 * n} por Adultos`); return 2 * n; } })
];

const APAIXONADOS = [
    P({ id: "apa_paulo", nome: "Paulo (Apaixonado)", base: 3, isApaixonado: true, allowDup: true }),
    P({ id: "apa_silvinha", nome: "Silvinha (Apaixonada)", base: 2, isApaixonado: true, allowDup: true })
];

/* ==========================================================================
   3. ENGINE DE CÁLCULO E LÓGICA DE ADJACÊNCIA
   ========================================================================== */
function getNeighbors(pos) {
    const nbs = [];
    const ROWS = 2, COLS = 6;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = pos.row + dr, nc = pos.col + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) nbs.push({ row: nr, col: nc });
        }
    }
    return nbs;
}

function buildCtx(state) {
    const ROWS = 2, COLS = 6;
    const isActiveAt = (p) => {
        const card = state.grid[p.row][p.col].card;
        if (!card) return false;
        if (typeof card.require === "function") return card.require(ctx, p).ok;
        return true;
    };

    const ctx = {
        grid: state.grid,
        improvements: state.improvements,
        driver: state.driver,
        hasImprovement: (name) => state.improvements.some(i => i.nome === name),
        existsId: (id) => state.grid.flat().some(cell => cell.card?.id === id && isActiveAt(cell.pos)),
        countBus: (pred) => {
            let n = 0;
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const card = state.grid[r][c].card;
                    if (card && isActiveAt({ row: r, col: c }) && pred(card)) n++;
                }
            }
            return n;
        },
        countAdj: (pos, pred) => {
            let n = 0;
            getNeighbors(pos).forEach(nb => {
                const card = state.grid[nb.row][nb.col].card;
                if (card && isActiveAt(nb) && pred(card)) n++;
            });
            return n;
        },
        countAdjEmpty: (pos) => {
            let n = 0;
            getNeighbors(pos).forEach(nb => {
                if (!state.grid[nb.row][nb.col].card) n++;
            });
            return n;
        },
        forEachCard: (fn) => {
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const card = state.grid[r][c].card;
                    if (card && isActiveAt({ row: r, col: c })) fn({ row: r, col: c }, card);
                }
            }
        }
    };
    return { ctx, isActiveAt };
}

/* ==========================================================================
   4. RENDERIZAÇÃO E UI
   ========================================================================== */
let selectedImprovementIds = new Set();
let currentSeatNo = null;

function render() {
    const state = collectState();
    const { ctx, isActiveAt } = buildCtx(state);
    let passengersScore = 0;
    const explainEl = document.getElementById("explain");
    explainEl.innerHTML = "";

    // 1. Passageiros
    ctx.forEachCard((pos, card) => {
        let s = card.base;
        const log = [];
        const logger = (msg) => log.push(msg);

        if (card.ability) s += card.ability(pos, ctx, logger);
        if (card.penalty) s += card.penalty(pos, ctx, logger);

        passengersScore += s;
        explainEl.innerHTML += `<div class="row"><b>Assento ${seatNumber(pos)}: ${card.nome}</b> (${s} pts)<br><small>${log.join(", ")}</small></div>`;
    });

    // 2. Motorista
    let driverPts = 0;
    if (state.driver) {
        state.driver.bonus.forEach(tag => {
            driverPts += ctx.countBus(c => !c.isCobrador && (c.faixa === tag || c.temper === tag || c.comp === tag));
        });
        if (ctx.existsId("vovo_michel")) driverPts *= 2;
    }

    // 3. Penalidade Mão
    let handPenalty = ctx.existsId("isabel") ? 0 : -state.hand;

    const total = passengersScore + driverPts + handPenalty;
    document.getElementById("totalScore").textContent = total;
    document.getElementById("sumPassengers").textContent = passengersScore;
    document.getElementById("sumDriver").textContent = driverPts;
    document.getElementById("sumHand").textContent = handPenalty;
}

function collectState() {
    const ROWS = 2, COLS = 6;
    const grid = [...Array(ROWS)].map((_, r) => [...Array(COLS)].map((_, c) => {
        const sel = document.querySelector(`.seat-select[data-row="${r}"][data-col="${c}"]`);
        return { pos: { row: r, col: c }, card: findAnyCard(sel?.value) };
    }));
    return {
        grid,
        driver: DRIVERS.find(d => d.id === document.getElementById("driver").value),
        improvements: [...selectedImprovementIds].map(id => IMPROVEMENTS.find(i => i.id === id)),
        hand: parseInt(document.getElementById("handCount").value) || 0
    };
}

function findAnyCard(id) {
    if (!id) return null;
    return [...CARD_DB, ...COBRADORES, ...APAIXONADOS].find(c => c.id === id);
}

function seatNumber(p) { return p.row === 0 ? p.col + 1 : p.col + 7; }

/* ==========================================================================
   5. INICIALIZAÇÃO E EVENTOS
   ========================================================================== */
function mountGrid() {
    const gridEl = document.getElementById("grid");
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 6; c++) {
            const seat = document.createElement("div");
            seat.className = "seat";
            seat.dataset.row = r; seat.dataset.col = c;
            seat.innerHTML = `<span>${r === 0 ? c + 1 : c + 7}</span>
                              <select class="seat-select hidden" data-row="${r}" data-col="${c}"></select>
                              <div class="name">Vazio</div>`;
            seat.onclick = () => openPicker(r === 0 ? c + 1 : c + 7);
            gridEl.appendChild(seat);
        }
    }
}

function openPicker(seatNo) {
    currentSeatNo = seatNo;
    document.getElementById("pickerModal").classList.add("open");
    buildPickerGrid("pass");
}

function buildPickerGrid(tab) {
    const grid = document.getElementById("pickerGrid");
    grid.innerHTML = "";
    let list = tab === "pass" ? CARD_DB : (tab === "cob" ? COBRADORES : APAIXONADOS);
    
    list.forEach(card => {
        const item = document.createElement("div");
        item.className = "picker-item";
        item.textContent = card.nome;
        item.onclick = () => {
            const row = currentSeatNo <= 6 ? 0 : 1;
            const col = currentSeatNo <= 6 ? currentSeatNo - 1 : currentSeatNo - 7;
            const sel = document.querySelector(`.seat-select[data-row="${row}"][data-col="${col}"]`);
            sel.value = card.id;
            sel.parentElement.querySelector(".name").textContent = card.nome;
            sel.parentElement.classList.add("occ");
            document.getElementById("pickerModal").classList.remove("open");
            render();
        };
        grid.appendChild(item);
    });
}

document.getElementById("pickerClose").onclick = () => document.getElementById("pickerModal").classList.remove("open");

// Setup inicial
window.onload = () => {
    const driverSel = document.getElementById("driver");
    DRIVERS.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.id; opt.textContent = d.nome;
        driverSel.appendChild(opt);
    });
    driverSel.onchange = render;
    document.getElementById("handCount").oninput = render;
    mountGrid();
};