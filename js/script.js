/* ============================
    MOTORISTAS & MELHORIAS
============================= */
const DRIVERS = [{
    id: "",
    nome: "— selecione um motorista —",
    bonus: []
}, {
    id: "bigode",
    nome: "Bigode",
    bonus: ["Jovem", "Caótico", "Barulhento"]
}, {
    id: "lucinha",
    nome: "Lucinha",
    bonus: ["Adulto", "Tranquilo", "Silencioso"]
}, {
    id: "montanha",
    nome: "Montanha",
    bonus: ["Idoso", "Equilibrado", "Comunicativo"]
}, {
    id: "paty",
    nome: "Paty",
    bonus: ["Jovem", "Tranquilo", "Comunicativo"]
}, {
    id: "pedrinho",
    nome: "Pedrinho",
    bonus: ["Adulto", "Caótico", "Silencioso"]
}, {
    id: "pereirao",
    nome: "Pereirão",
    bonus: ["Idoso", "Equilibrado", "Barulhento"]
}, ];

const IMPROVEMENTS = [{
    id: "acess",
    nome: "Acessibilidade",
    bonus: ["Idoso", "Tranquilo"],
    reqTag: "Acessibilidade"
}, {
    id: "ar",
    nome: "Ar-condicionado",
    bonus: ["Caótico", "Silencioso"]
}, {
    id: "reclinaveis",
    nome: "Assentos Reclináveis",
    bonus: ["Adulto", "Barulhento"],
    reqTag: "Assentos Reclináveis"
}, {
    id: "banheiro",
    nome: "Banheiro",
    bonus: ["Adulto", "Silencioso"]
}, {
    id: "cortinas",
    nome: "Cortinas",
    bonus: ["Idoso", "Caótico"]
}, {
    id: "som",
    nome: "Sistema de Som",
    bonus: ["Barulhento", "Caótico"]
}, {
    id: "tv",
    nome: "TV de Bordo",
    bonus: ["Equilibrado", "Comunicativo"]
}, {
    id: "wifi",
    nome: "Wi-Fi e Tomadas",
    bonus: ["Jovem", "Comunicativo"],
    reqTag: "Wi-Fi e Tomadas"
}, ];

/* ============================
    CARTAS (passageiros)
============================= */
function P(obj) {
    return Object.assign({
        base: 0,
        faixa: "Adulto",
        temper: "Equilibrado",
        comp: "Comunicativo",
        impacto: "final",
        ability: null,
        penalty: null,
        require: null,
        scoreReq: null,
        note: null,
        text: null,
        isCobrador: false,
        allowDup: false,
        isApaixonado: false
    }, obj);
}

const CARD_DB = [
    // Habilidades
    P({
        id: "caio",
        nome: "Caio (O Estudante)",
        base: 4,
        faixa: "Jovem",
        temper: "Caótico",
        comp: "Silencioso",
        text: "+1 Ponto para cada Silencioso adjacente.",
        ability: (p, ctx, log) => {
            const n = ctx.countAdj(p, c => c.comp === "Silencioso");
            if (n) log(`+${n} por Silencioso adj.`);
            return n;
        }
    }),
    P({
        id: "leandro",
        nome: "Leandro (O Dorminhoco)",
        base: 3,
        faixa: "Adulto",
        temper: "Equilibrado",
        comp: "Silencioso",
        text: "+1 Ponto para cada Silencioso adjacente.",
        ability: (p, ctx, log) => {
            const n = ctx.countAdj(p, c => c.comp === "Silencioso");
            if (n) log(`+${n} por Silencioso adj.`);
            return n;
        }
    }),
    P({
        id: "sol",
        nome: "Sol (Good Vibes)",
        base: 2,
        faixa: "Jovem",
        temper: "Tranquilo",
        comp: "Silencioso",
        text: "+1 Ponto por cada Equilibrado e cada Comunicativo no Busão.",
        ability: (p, ctx, log) => {
            const e = ctx.countBus(c => !c.isCobrador && c.temper === "Equilibrado");
            const cm = ctx.countBus(c => !c.isCobrador && c.comp === "Comunicativo");
            let s = 0;
            if (e) {
                log(`+${e} por Equilibrado no busão`);
                s += e;
            }
            if (cm) {
                log(`+${cm} por Comunicativo no busão`);
                s += cm;
            }
            return s;
        }
    }),
    P({
        id: "rato",
        nome: "Rato (O Malandro)",
        base: 1,
        faixa: "Jovem",
        temper: "Caótico",
        comp: "Barulhento",
        text: "+2 pontos por Idoso no busão.",
        ability: (p, ctx, log) => {
            const n = ctx.countBus(c => !c.isCobrador && c.faixa === "Idoso");
            if (n) {
                log(`+${2 * n} (+2 por ${n} Idoso no busão)`);
            }
            return 2 * n;
        }
    }),
    P({
        id: "raul",
        nome: "Raul (O Pancada)",
        base: 3,
        faixa: "Idoso",
        temper: "Equilibrado",
        comp: "Barulhento",
        text: "+1 Ponto por cada Jovem e cada Comunicativo Adjacente.",
        ability: (p, ctx, log) => {
            const j = ctx.countAdj(p, c => c.faixa === "Jovem");
            const co = ctx.countAdj(p, c => c.comp === "Comunicativo");
            let s = 0;
            if (j) {
                log(`+${j} por Jovem adj.`);
                s += j;
            }
            if (co) {
                log(`+${co} por Comunicativo adj.`);
                s += co;
            }
            return s;
        }
    }),
    P({
        id: "dona_cida",
        nome: "Dona Cida (A Tagarela)",
        base: 4,
        faixa: "Idoso",
        temper: "Caótico",
        comp: "Barulhento",
        impacto: "durante-final",
        text: "Ao embarcar, pode fazer um Silencioso desembarcar. +1 Ponto por cada Barulhento adjacente.",
        ability: (p, ctx, log) => {
            const n = ctx.countAdj(p, c => c.comp === "Barulhento");
            if (n) {
                log(`+${n} por Barulhento adj.`);
            }
            return n;
        },
        note: "Ao embarcar, pode fazer um Silencioso desembarcar."
    }),
    P({
        id: "fabio",
        nome: "Fábio (O Vendedor)",
        base: 3,
        faixa: "Adulto",
        temper: "Caótico",
        comp: "Barulhento",
        text: "Sem efeito."
    }),
    P({
        id: "seu_amadeu",
        nome: "Seu Amadeu (O Irritado)",
        base: 5,
        faixa: "Idoso",
        temper: "Caótico",
        comp: "Barulhento",
        impacto: "durante-final",
        text: "Ao embarcar, pode fazer um Silencioso desembarcar. +1 Ponto por cada Barulhento adjacente.",
        ability: (p, ctx, log) => {
            const n = ctx.countAdj(p, c => c.comp === "Barulhento");
            if (n) {
                log(`+${n} por Barulhento adj.`);
            }
            return n;
        },
        note: "Ao embarcar, pode fazer um Silencioso desembarcar."
    }),
    P({
        id: "wesley",
        nome: "Wesley (DJ do busão)",
        base: 3,
        faixa: "Jovem",
        temper: "Caótico",
        comp: "Barulhento",
        impacto: "durante",
        text: "Ao embarcar, todos os Silenciosos adjacentes desembarcam.",
        note: "Ao embarcar, todos os Silenciosos adjacentes desembarcam."
    }),
    P({
        id: "sophia",
        nome: "Sophia (A Blogueira)",
        base: 2,
        faixa: "Jovem",
        temper: "Caótico",
        comp: "Barulhento",
        text: "Se houver a melhoria Wi-Fi e Tomadas, +2 pontos por cada Jovem no Busão.",
        ability: (p, ctx, log) => {
            if (!ctx.hasImprovement("Wi-Fi e Tomadas")) return 0;
            const n = ctx.countBus(c => !c.isCobrador && c.faixa === "Jovem");
            if (n) {
                log(`+${2 * n} (Wi-Fi ativo: +2 por ${n} Jovem no busão)`);
            }
            return 2 * n;
        }
    }),
    P({
        id: "seu_horacio",
        nome: "Seu Horácio (O Antissocial)",
        base: 3,
        faixa: "Idoso",
        temper: "Equilibrado",
        comp: "Silencioso",
        text: "+3 Pontos para cada espaço vazio adjacente.",
        ability: (p, ctx, log) => {
            const e = ctx.countAdjEmpty(p);
            if (e) {
                log(`+${3 * e} (+3 por ${e} vazio adj.)`);
            }
            return 3 * e;
        }
    }),
    P({
        id: "sheila",
        nome: "Sheila (A “Barraqueira”)",
        base: 4,
        faixa: "Jovem",
        temper: "Caótico",
        comp: "Barulhento",
        impacto: "durante",
        text: "Não pode ser forçada a desembarcar. Ao embarcar, uma coluna inteira desembarca.",
        note: "Ao embarcar, uma coluna inteira desembarca. Não pode ser forçada a desembarcar."
    }),

    // Penalidades
    P({
        id: "celio",
        nome: "Célio (O Claustrofóbico)",
        base: 3,
        faixa: "Jovem",
        temper: "Caótico",
        comp: "Silencioso",
        text: "-1 para cada passageiro adjacente. Não embarca se não houver pelo menos 1 espaço vazio adjacente.",
        penalty: (p, ctx, log) => {
            const n = ctx.countAdj(p, () => true);
            if (n) {
                log(`-${n} ( -1 por adj.)`);
            }
            const e = ctx.countAdjEmpty(p);
            if (e === 0) ctx.warn("Célio: precisa de ao menos 1 espaço vazio adjacente durante o jogo (condição de embarque).");
            return -n;
        }
    }),
    P({
        id: "marcia_enzo",
        nome: "Márcia e Enzo (Mãe e Pestinha)",
        base: 2,
        faixa: "Adulto",
        temper: "Equilibrado",
        comp: "Barulhento",
        text: "-2 Pontos para cada Silencioso no Busão.",
        penalty: (p, ctx, log) => {
            const n = ctx.countBus(c => !c.isCobrador && c.comp === "Silencioso");
            if (n) {
                log(`-${2 * n} ( -2 por ${n} Silencioso no busão )`);
            }
            return -2 * n;
        }
    }),
    P({
        id: "motolover",
        nome: "Luíz (Motolover)",
        base: 3,
        faixa: "Adulto",
        temper: "Equilibrado",
        comp: "Silencioso",
        text: "-2 Pontos por passageiro no Busão que estiver sentado entre ele e o motorista.",
        penalty: (p, ctx, log) => {
            const n = ctx.countAheadBothRows(p);
            if (n) {
                log(`-${2 * n} ( -2 por ${n} entre ele e o motorista )`);
            }
            return -2 * n;
        }
    }),
    P({
        id: "fobao",
        nome: "Fabão (O Grandão)",
        base: 1,
        faixa: "Adulto",
        temper: "Caótico",
        comp: "Silencioso",
        impacto: "durante",
        text: "Ao embarcar entra em um espaço ocupado e faz a coluna inteira deste local desembarcar.",
        note: "Ao embarcar entra em espaço ocupado e faz a coluna inteira desembarcar."
    }),
    P({
        id: "waldisnei",
        nome: "Waldisnei (O “Cheiroso”)",
        base: 0,
        faixa: "Jovem",
        temper: "Caótico",
        comp: "Comunicativo",
        impacto: "durante-final",
        text: "-1 Ponto para qualquer passageiro adjacente. Ao embarcar, a primeira fileira da frente desembarca.",
        penalty: (p, ctx, log) => {
            const n = ctx.countAdj(p, () => true);
            if (n) {
                log(`-${n} ( -1 por adj.)`);
            }
            return -n;
        },
        note: "Ao embarcar, a primeira fileira da frente desembarca."
    }),
    P({
        id: "claudio",
        nome: "Cláudio (O Pastor)",
        base: 2,
        faixa: "Adulto",
        temper: "Caótico",
        comp: "Barulhento",
        impacto: "durante-final",
        text: "-1 ponto para cada Silencioso no busão. Jovens adjacentes desembarcam.",
        penalty: (p, ctx, log) => {
            const n = ctx.countBus(c => !c.isCobrador && c.comp === "Silencioso");
            if (n) {
                log(`-${n} ( -1 por ${n} Silencioso no busão )`);
            }
            return -n;
        },
        note: "Ao embarcar, todos os Jovens adjacentes desembarcam."
    }),
    P({
        id: "roberto",
        nome: "Roberto (O “Bonzinho”)",
        base: 6,
        faixa: "Adulto",
        temper: "Equilibrado",
        comp: "Comunicativo",
        impacto: "durante",
        text: "Se, depois dele, um Idoso ou “A Gestante” embarcar, ele deverá desembarcar para ceder o lugar.",
        note: "Se depois dele um Idoso ou “A Gestante” embarcar, ele cede o lugar."
    }),
    P({
        id: "charles",
        nome: "Charles (O Maromba)",
        base: 4,
        faixa: "Adulto",
        temper: "Equilibrado",
        comp: "Barulhento",
        text: "-1 ponto para cada passageiro adjacente. -3 pontos se “O Grandão” estiver no Busão.",
        penalty: (p, ctx, log) => {
            const adj = ctx.countAdj(p, () => true);
            let s = -adj;
            if (ctx.existsId("fobao")) {
                s -= 3;
                log("-3 adicionais: Grandão presente");
            }
            if (adj) log(`-${adj} ( -1 por adj.)`);
            return s;
        }
    }),

    // Exigências de EMBARQUE
    P({
        id: "ana_gestante",
        nome: "Ana (A Gestante)",
        base: 5,
        faixa: "Adulto",
        temper: "Tranquilo",
        comp: "Comunicativo",
        text: "Sô embarca se no Busão estiver a melhoria Assentos Reclináveis.",
        require: (ctx) => reqImprovement(ctx, "Assentos Reclináveis")
    }),
    P({
        id: "joao_pcd",
        nome: "João (PCD)",
        base: 6,
        faixa: "Jovem",
        temper: "Equilibrado",
        comp: "Silencioso",
        text: "Sô embarca se no Busão estiver a melhoria Acessibilidade.",
        require: (ctx) => reqImprovement(ctx, "Acessibilidade")
    }),
    P({
        id: "peter",
        nome: "Peter (O Playboy)",
        base: 7,
        faixa: "Jovem",
        temper: "Equilibrado",
        comp: "Barulhento",
        text: "Sô embarca se no Busão estiverem todas as 3 melhorias.",
        require: (ctx) => ({
            ok: ctx.improvements.length === 3,
            msg: "Precisa das 3 melhorias ativas."
        })
    }),
    P({
        id: "mari",
        nome: "Mari (A Conectada)",
        base: 4,
        faixa: "Jovem",
        temper: "Tranquilo",
        comp: "Silencioso",
        text: "Sô embarca se houver a melhoria Wi-Fi e Tomadas no Busão.",
        require: (ctx) => reqImprovement(ctx, "Wi-Fi e Tomadas")
    }),
    P({
        id: "wilson",
        nome: "Wilson (O Pai de Planta)",
        base: 5,
        faixa: "Adulto",
        temper: "Equilibrado",
        comp: "Comunicativo",
        text: "Ocupa os 2 lugares da fileira. +1 Ponto para cada Idoso adjacente.",
        ability: (p, ctx, log) => {
            const n = ctx.countAdj(p, c => c.faixa === "Idoso");
            if (n) {
                log(`+${n} por Idoso adj.`);
            }
            return n;
        },
        require: (ctx, p) => {
            const other = p.row === 0 ? ctx.getPos(1, p.col) : ctx.getPos(0, p.col);
            const ok = !other.card;
            return {
                ok,
                msg: "Wilson ocupa os 2 lugares (deixe vazio o par da coluna)."
            };
        }
    }),
    P({
        id: "misterioso",
        nome: "SEM NOME (Cara Misterioso)",
        base: 4,
        faixa: "Adulto",
        temper: "Tranquilo",
        comp: "Silencioso",
        text: "Sô embarca se puder se sentar no fundo do Busão (coluna 6).",
        require: (ctx, p) => ({
            ok: p.col === 5,
            msg: "Sô embarca no fundo do busão (coluna 6)."
        })
    }),

    // Condição de PONTUAÇÃO
    P({
        id: "dona_mirtes",
        nome: "Dona Mirtes (A Fofoqueira)",
        base: 5,
        faixa: "Adulto",
        temper: "Tranquilo",
        comp: "Comunicativo",
        text: "Sô pontua se estiver adjacente a pelo menos um Comunicativo.",
        scoreReq: (ctx, p) => ({
            ok: ctx.countAdj(p, c => c.comp === "Comunicativo") > 0,
            msg: "Precisa estar adjacente a pelo menos 1 Comunicativo para pontuar."
        })
    }),

    // Especiais
    P({
        id: "jorge",
        nome: "Jorge (O Perdido)",
        base: 4,
        faixa: "Adulto",
        temper: "Caótico",
        comp: "Barulhento",
        impacto: "durante",
        text: "Embarque imediato; troca de Busão ao fim de cada rodada; pontua onde terminar."
    }),
    P({
        id: "dabs",
        nome: "Dabs (A Board Gamer)",
        base: 6,
        faixa: "Adulto",
        temper: "Tranquilo",
        comp: "Comunicativo",
        impacto: "durante",
        text: "Ao embarcar, pode fazer até dois passageiros com Penalidade desembarcarem."
    }),
    P({
        id: "dona_fausta",
        nome: "Dona Fausta (A Desconfiada)",
        base: 1,
        faixa: "Idoso",
        temper: "Caótico",
        comp: "Silencioso",
        text: "Se estiver no fim da partida, as melhorias do busão não dão pontos extras."
    }),
];

/* ============================
    EXPANSÃO – COBRADORES (máx. 1)
============================= */
const COBRADORES = [{
    id: "cob_candinha",
    nome: "Dona Candinha (A Protetora dos Idosos) [Cobrador]",
    isCobrador: true,
    base: 0,
    text: "+2 pontos para cada Idoso",
    ability: (p, ctx, log) => {
        const n = ctx.countBus(c => !c.isCobrador && c.faixa === "Idoso");
        if (n) log(`+${2 * n} (+2 por ${n} Idoso)`);
        return 2 * n;
    }
}, {
    id: "cob_ze",
    nome: "Zé (O Tiozão) [Cobrador]",
    isCobrador: true,
    base: 0,
    text: "+2 pontos para cada Adulto",
    ability: (p, ctx, log) => {
        const n = ctx.countBus(c => !c.isCobrador && c.faixa === "Adulto");
        if (n) log(`+${2 * n} (+2 por ${n} Adulto)`);
        return 2 * n;
    }
}, {
    id: "cob_brenda",
    nome: "Brenda (A Jovenzona) [Cobrador]",
    isCobrador: true,
    base: 0,
    text: "+2 pontos para cada Jovem",
    ability: (p, ctx, log) => {
        const n = ctx.countBus(c => !c.isCobrador && c.faixa === "Jovem");
        if (n) log(`+${2 * n} (+2 por ${n} Jovem)`);
        return 2 * n;
    }
}, {
    id: "cob_tereza",
    nome: "Tereza (A Paz no Busão) [Cobrador]",
    isCobrador: true,
    base: 0,
    text: "+2 pontos para cada Tranquilo",
    ability: (p, ctx, log) => {
        const n = ctx.countBus(c => !c.isCobrador && c.temper === "Tranquilo");
        if (n) log(`+${2 * n} (+2 por ${n} Tranquilo)`);
        return 2 * n;
    }
}, {
    id: "cob_saulo",
    nome: "Saulo (O Sem Tempo Irmão) [Cobrador]",
    isCobrador: true,
    base: 0,
    text: "+2 pontos para cada Equilibrado",
    ability: (p, ctx, log) => {
        const n = ctx.countBus(c => !c.isCobrador && c.temper === "Equilibrado");
        if (n) log(`+${2 * n} (+2 por ${n} Equilibrado)`);
        return 2 * n;
    }
}, {
    id: "cob_leozinho",
    nome: "Léozinho (O Causador) [Cobrador]",
    isCobrador: true,
    base: 0,
    text: "+2 pontos para cada Caótico",
    ability: (p, ctx, log) => {
        const n = ctx.countBus(c => !c.isCobrador && c.temper === "Caótico");
        if (n) log(`+${2 * n} (+2 por ${n} Caótico)`);
        return 2 * n;
    }
}, {
    id: "cob_padilha",
    nome: "Padilha (O Sossegado) [Cobrador]",
    isCobrador: true,
    base: 0,
    text: "+2 pontos para cada Silencioso",
    ability: (p, ctx, log) => {
        const n = ctx.countBus(c => !c.isCobrador && c.comp === "Silencioso");
        if (n) log(`+${2 * n} (+2 por ${n} Silencioso)`);
        return 2 * n;
    }
}, {
    id: "cob_dandara",
    nome: "Dandara (A Conversadeira) [Cobrador]",
    isCobrador: true,
    base: 0,
    text: "+2 pontos para cada Comunicativo",
    ability: (p, ctx, log) => {
        const n = ctx.countBus(c => !c.isCobrador && c.comp === "Comunicativo");
        if (n) log(`+${2 * n} (+2 por ${n} Comunicativo)`);
        return 2 * n;
    }
}, {
    id: "cob_genesio",
    nome: "Genésio (O Berrador) [Cobrador]",
    isCobrador: true,
    base: 0,
    text: "+2 pontos para cada Barulhento",
    ability: (p, ctx, log) => {
        const n = ctx.countBus(c => !c.isCobrador && c.comp === "Barulhento");
        if (n) log(`+${2 * n} (+2 por ${n} Barulhento)`);
        return 2 * n;
    }
}, ];

/* ============================
    EXPANSÃO – OS APAIXONADOS (duplicáveis)
============================= */
const APAIXONADOS = [{
    id: "apa_paulo",
    nome: "Paulo – O Apaixonado",
    base: 3,
    faixa: "Jovem",
    temper: "Equilibrado",
    comp: "Comunicativo",
    text: "Especial (jogo): pode atrair um apaixonado visível no Ponto/Terminal para ao seu lado.",
    allowDup: true,
    isApaixonado: true
}, {
    id: "apa_silvinha",
    nome: "Silvinha – A Apaixonada",
    base: 2,
    faixa: "Jovem",
    temper: "Tranquilo",
    comp: "Silencioso",
    text: "Especial (jogo): pode buscar um apaixonado no Terminal e embarcar ao seu lado sem custo.",
    allowDup: true,
    isApaixonado: true
}, {
    id: "apa_higor",
    nome: "Higor – O Apaixonado",
    base: 1,
    faixa: "Jovem",
    temper: "Caótico",
    comp: "Silencioso",
    text: "Especial (jogo): pode atrair um(a) apaixonado(a) de um busão adversário para a sua mão.",
    allowDup: true,
    isApaixonado: true
}, {
    id: "apa_jessica",
    nome: "Jéssica – A Apaixonada",
    base: 4,
    faixa: "Jovem",
    temper: "Equilibrado",
    comp: "Barulhento",
    text: "Especial (jogo): pode atrair um(a) apaixonado(a) de um busão adversário para a sua mão.",
    allowDup: true,
    isApaixonado: true
}, ];

/* ============================
    UI refs
============================= */
const byName = (a, b) => a.nome.localeCompare(b.nome);
const DRIVER_SEL = document.getElementById("driver");
const EXP_COB = document.getElementById("expCobradores");
const EXP_APX = document.getElementById("expApaixonados"); // NOVO
const DRIVER_INFO = document.getElementById("driverInfo");
const IMPROV_BUTTONS_WRAP = document.getElementById("improvButtons");
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

/* ======= Abas (topo) ======= */
const topTabBtns = Array.from(document.querySelectorAll(".tabs-top .tabbtn"));
const topViews = {
    "tab-config": document.getElementById("tab-config"),
    "tab-seats": document.getElementById("tab-seats"),
    "tab-catalog": document.getElementById("tab-catalog"),
    "tab-regrasfaq": document.getElementById("tab-regrasfaq"),
};
topTabBtns.forEach(b => {
    b.onclick = () => {
        topTabBtns.forEach(x => x.classList.toggle("act", x === b));
        Object.entries(topViews).forEach(([k, el]) => el.classList.toggle("act", k === b.dataset.tab));
    };
});

/* ======= Abinhas internas (Regras/FAQ) ======= */
const itabBtns = Array.from(document.querySelectorAll(".itab"));
const itabPans = {
    regras: document.getElementById("itab-regras"),
    faq: document.getElementById("itab-faq")
};
itabBtns.forEach(b => {
    b.onclick = () => {
        itabBtns.forEach(x => x.classList.toggle("act", x === b));
        Object.entries(itabPans).forEach(([k, el]) => el.classList.toggle("act", k === b.dataset.itab));
        itabBtns.forEach(x => x.style.borderBottomColor = x.classList.contains("act") ? "#60a5fa" : "transparent");
        itabBtns.forEach(x => x.style.color = x.classList.contains("act") ? "#60a5fa" : "#cbd5e1");
    };
});

/* ============================
    INIT CONFIG
============================= */
function buildOptions(list) {
    const frag = document.createDocumentFragment();
    list.forEach(x => {
        const opt = document.createElement("option");
        opt.value = x.id;
        opt.textContent = x.nome;
        frag.appendChild(opt);
    });
    return frag;
}

function mountLeft() {
    DRIVER_SEL.appendChild(buildOptions(DRIVERS));
    DRIVER_SEL.addEventListener("change", () => {
        renderDriverInfo();
        render();
    });
    EXP_COB.addEventListener("change", () => {
        rebuildSeatSelectOptions();
        refreshSeatSelects();
        render();
    });
    EXP_APX.addEventListener("change", () => {
        rebuildSeatSelectOptions();
        refreshSeatSelects();
        render();
    }); // NOVO

    // Botões de melhorias (até 3)
    buildImprovementButtons();

    playerNameEl.addEventListener("input", () => {
        playerTagEl.textContent = playerNameEl.value ? `Jogador: ${playerNameEl.value}` : "";
    });
    handCountEl.addEventListener("input", render);
    renderDriverInfo();
}

function renderDriverInfo() {
    const d = DRIVERS.find(x => x.id === DRIVER_SEL.value);
    if (!d || !d.id) {
        DRIVER_INFO.innerHTML = `<div class="driver-card"><div><b>Sem motorista</b></div><div class="muted">Selecione um motorista para ativar o bônus.</div></div>`;
    } else {
        DRIVER_INFO.innerHTML = `<div class="driver-card"><div><b>${d.nome}</b></div><div class="muted">+1 por: ${d.bonus.join(" • ")}</div></div>`;
    }
    renderImprovInfo();
}

/* ======= Melhorias como BOTÕES (novo) ======= */
let selectedImprovementIds = new Set();

function buildImprovementButtons() {
    IMPROV_BUTTONS_WRAP.innerHTML = "";
    IMPROVEMENTS.forEach(imp => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn btn-toggle btn-pill";
        b.textContent = imp.nome;
        b.onclick = () => {
            if (selectedImprovementIds.has(imp.id)) {
                selectedImprovementIds.delete(imp.id);
                b.classList.remove("sel");
            } else {
                if (selectedImprovementIds.size >= 3) {
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

function getImprovements() {
    return [...selectedImprovementIds].map(id => IMPROVEMENTS.find(i => i.id === id)).filter(Boolean);
}

function renderImprovInfo() {
    const imps = getImprovements();
    IMPROV_INFO.innerHTML = imps.length ?
        imps.map(i => `<div class="improv-card"><div><b>${i.nome}</b></div><div class="muted">+1 por: ${i.bonus.join(" • ")}</div></div>`).join("") :
        `<div class="improv-card"><div><b>Nenhuma melhoria selecionada</b></div><div class="muted">Você pode ativar até 3 melhorias.</div></div>`;
}

/* ============================
    GRID 2 × 6 (com selects escondidos)
============================= */
const ROWS = 2,
    COLS = 6;

function mountGrid() {
    GRID.innerHTML = "";
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const seatNo = r === 0 ? (c + 1) : (6 + c + 1);
            const seat = document.createElement("div");
            seat.className = "seat";
            seat.dataset.row = r;
            seat.dataset.col = c;
            seat.dataset.seatno = seatNo;

            const pos = document.createElement("div");
            pos.className = "pos";
            pos.textContent = `Assento ${seatNo}`;
            seat.appendChild(pos);

            const slot = document.createElement("div");
            slot.className = "slot";
            const sel = document.createElement("select");
            sel.className = "hidden-select seat-select"; // escondido; controlado pelo modal
            sel.appendChild(buildCardOptions(EXP_COB.checked, EXP_APX.checked));
            sel.dataset.row = r;
            sel.dataset.col = c;

            sel.addEventListener("change", () => {
                const chosen = findAnyCard(sel.value);
                name.textContent = chosen ? chosen.nome : " Adicionar ";
                refreshSeatSelects();
                updateBusVisualLabels(collectState());
                render();
            });

            const name = document.createElement("div");
            name.className = "slot-name muted";
            name.textContent = "Adicionar ";

            // Ao clicar no "seat", abrir modal de seleção
            seat.addEventListener("click", (ev) => {
                if (ev.target.tagName.toLowerCase() === "select") return;
                openPickerForSeat(seatNo);
            });

            slot.appendChild(sel);
            seat.appendChild(slot);
            seat.appendChild(name);
            GRID.appendChild(seat);
        }
    }
    refreshSeatSelects();
}

/* Opções por select */
function buildCardOptions(includeCobradores, includeApaixonados) {
    const frag = document.createDocumentFragment();
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "— vazio —";
    frag.appendChild(empty);
    const ogPass = document.createElement("optgroup");
    ogPass.label = "Passageiros";
    CARD_DB.slice().sort(byName).forEach(x => {
        const o = document.createElement("option");
        o.value = x.id;
        o.textContent = x.nome;
        ogPass.appendChild(o);
    });
    frag.appendChild(ogPass);
    if (includeCobradores) {
        const ogCob = document.createElement("optgroup");
        ogCob.label = "Cobradores (expansão)";
        COBRADORES.slice().sort(byName).forEach(x => {
            const o = document.createElement("option");
            o.value = x.id;
            o.textContent = x.nome;
            ogCob.appendChild(o);
        });
        frag.appendChild(ogCob);
    }
    if (includeApaixonados) {
        const ogApx = document.createElement("optgroup");
        ogApx.label = "Os Apaixonados (expansão)";
        APAIXONADOS.slice().sort(byName).forEach(x => {
            const o = document.createElement("option");
            o.value = x.id;
            o.textContent = x.nome;
            ogApx.appendChild(o);
        });
        frag.appendChild(ogApx);
    }
    return frag;
}

function rebuildSeatSelectOptions() {
    GRID.querySelectorAll("select.seat-select").forEach(sel => {
        const prev = sel.value;
        sel.innerHTML = "";
        sel.appendChild(buildCardOptions(EXP_COB.checked, EXP_APX.checked));
        const canKeep = !!findAnyCard(prev) && (EXP_COB.checked || !isCobradorId(prev)) && (EXP_APX.checked || !isApaixonadoId(prev));
        sel.value = canKeep ? prev : "";
        const nameEl = sel.parentElement.nextElementSibling;
        const card = findAnyCard(sel.value);
        if (nameEl) nameEl.textContent = card ? card.nome : " Adicionar ";
    });
}

/* ======= DUPLICATAS ======= */
function getSelectedCardIds() {
    const ids = [];
    GRID.querySelectorAll("select.seat-select").forEach(s => {
        if (s.value) ids.push(s.value);
    });
    return ids;
}

function allowDuplicate(id) {
    const card = findAnyCard(id);
    return !!card?.allowDup;
}

function isCardSelectedElsewhere(id, sel) {
    let dup = false;
    GRID.querySelectorAll("select.seat-select").forEach(s => {
        if (s !== sel && s.value === id) dup = true;
    });
    return dup && !allowDuplicate(id);
}

/* ======= COBRADORES: só 1 ======= */
function countSelectedCobradores(exceptSel = null) {
    let n = 0;
    GRID.querySelectorAll("select.seat-select").forEach(s => {
        if (exceptSel && s === exceptSel) return;
        if (isCobradorId(s.value)) n++;
    });
    return n;
}

function anyCobradorSelected(exceptSel = null) {
    return countSelectedCobradores(exceptSel) > 0;
}

/* helpers posição */
function otherPos(pos) {
    return {
        row: pos.row === 0 ? 1 : 0,
        col: pos.col
    };
}

function seatNumToRC(n) {
    if (n <= 6) return {
        row: 0,
        col: n - 1
    };
    return {
        row: 1,
        col: n - 7
    };
}

function isSeatBlockedByWilson(pos) {
    const other = otherPos(pos);
    const otherSel = GRID.querySelector(`select.seat-select[data-row="${other.row}"][data-col="${other.col}"]`);
    return otherSel && otherSel.value === "wilson";
}

/* ============================
    CONTEXTO (cartas ativas)
============================= */
function buildCtx(state) {
    const warnings = [];
    const memo = new Map();
    const key = (r, c) => `${r},${c}`;
    const getPos = (r, c) => state.grid[r][c];

    function neighbors(pos) {
        const out = [];
        if (pos.col - 1 >= 0) out.push({
            row: pos.row,
            col: pos.col - 1
        });
        if (pos.col + 1 < COLS) out.push({
            row: pos.row,
            col: pos.col + 1
        });
        const other = pos.row === 0 ? 1 : 0;
        for (let dc = -1; dc <= 1; dc++) {
            const cc = pos.col + dc;
            if (cc >= 0 && cc < COLS) out.push({
                row: other,
                col: cc
            });
        }
        return out;
    }

    function isActiveAt(pos) {
        const k = key(pos.row, pos.col);
        if (memo.has(k)) return memo.get(k);
        const card = getPos(pos.row, pos.col).card;
        let ok = false;
        if (card) {
            if (typeof card.require === "function") {
                const proxy = {
                    grid: state.grid,
                    improvements: state.improvements,
                    driver: state.driver,
                    hasImprovement: (name) => state.improvements.some(i => i.nome === name),
                    getPos,
                    countBus: (pred) => countBusActive(pred),
                    countAdj: (p, pred) => countAdjActive(p, pred),
                    countAdjEmpty: (p) => countAdjEmptyActive(p),
                    countAheadBothRows: (p) => countAheadBothRowsActive(p),
                    existsId: (id) => existsIdActive(id),
                };
                try {
                    ok = !!card.require(proxy, pos)?.ok;
                } catch {
                    ok = false;
                }
            } else {
                ok = true;
            }
        }
        memo.set(k, ok);
        return ok;
    }

    function forEachActive(fn) {
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++) {
                const card = state.grid[r][c].card;
                if (card && isActiveAt({
                        row: r,
                        col: c
                    })) fn({
                    row: r,
                    col: c
                }, card);
            }
    }

    function countBusActive(pred) {
        let n = 0;
        forEachActive((p, card) => {
            if (pred(card, p)) n++;
        });
        return n;
    }

    function neighborsList(pos) {
        return neighbors(pos);
    }

    function countAdjActive(pos, pred) {
        let n = 0;
        for (const nb of neighbors(pos)) {
            const card = state.grid[nb.row][nb.col].card;
            if (card && isActiveAt(nb) && pred(card, nb)) n++;
        }
        return n;
    }

    function countAdjEmptyActive(pos) {
        let n = 0;
        for (const nb of neighbors(pos)) {
            const card = state.grid[nb.row][nb.col].card;
            if (!card || !isActiveAt(nb)) n++;
        }
        return n;
    }

    function countAheadBothRowsActive(pos) {
        let n = 0;
        for (let c = 0; c < pos.col; c++) {
            const a = {
                row: 0,
                col: c
            },
            b = {
                row: 1,
                col: c
            };
            if (state.grid[a.row][a.col].card && isActiveAt(a)) n++;
            if (state.grid[b.row][b.col].card && isActiveAt(b)) n++;
        }
        return n;
    }

    function existsIdActive(id) {
        let found = false;
        forEachActive((p, c) => {
            if (c.id === id) found = true;
        });
        return found;
    }

    const ctx = {
        grid: state.grid,
        improvements: state.improvements,
        driver: state.driver,
        warn: (msg) => warnings.push(msg),
        hasImprovement: (name) => state.improvements.some(i => i.nome === name),
        existsId: existsIdActive,
        getPos,
        forEachCard: forEachActive,
        countBus: (pred) => countBusActive(pred),
        countAdj: (pos, pred) => countAdjActive(pos, pred),
        countAdjEmpty: (pos) => countAdjEmptyActive(pos),
        countAheadBothRows: (pos) => countAheadBothRowsActive(pos),
        neighbors: neighborsList,
    };
    return {
        ctx,
        warnings,
        isActiveAt
    };
}

function collectState() {
    const grid = [...Array(ROWS)].map(() => [...Array(COLS)].map(() => ({
        card: null
    })));
    GRID.querySelectorAll("select.seat-select").forEach(sel => {
        const id = sel.value;
        const r = +sel.dataset.row,
            c = +sel.dataset.col;
        grid[r][c].card = id ? findAnyCard(id) : null;
    });
    const d = DRIVERS.find(x => x.id === DRIVER_SEL.value);
    const driver = d && d.id ? d : null;
    const improvements = getImprovements();
    const hand = Math.max(0, +handCountEl.value || 0);
    return {
        grid,
        driver,
        improvements,
        hand
    };
}

function findAnyCard(id) {
    if (!id) return null;
    return CARD_DB.find(x => x.id === id) ||
        COBRADORES.find(x => x.id === id) ||
        (EXP_APX.checked ? APAIXONADOS.find(x => x.id === id) : null) ||
        null;
}

function isCobradorId(id) {
    return !!COBRADORES.find(x => x.id === id);
}

function isApaixonadoId(id) {
    return !!APAIXONADOS.find(x => x.id === id);
} // NOVO

/* ======= Regras de embarque por posição ======= */
function hasCobradorElsewhere(state, pos) {
    let n = 0;
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
            if (r === pos.row && c === pos.col) continue;
            const card = state.grid[r][c].card;
            if (card && card.isCobrador) n++;
        }
    return n > 0;
}

function checkCardAllowedAt(card, pos, state) {
    if (!card) return {
        ok: true
    };
    if (!card.allowDup && !card.isApaixonado) { // Apaixonados podem ser duplicados
        let dup = false;
        GRID.querySelectorAll("select.seat-select").forEach(s => {
            if (+s.dataset.row === pos.row && +s.dataset.col === pos.col) return;
            if (s.value === card.id) dup = true;
        });
        if (dup) return {
            ok: false,
            reason: "Você já colocou esta carta em outro assento."
        };
    }
    if (isSeatBlockedByWilson(pos) && card.id !== "") {
        return {
            ok: false,
            reason: "O Wilson está no ônibus e ocupa os 2 lugares desta coluna. Deixe este assento vazio."
        };
    }
    if (card.isCobrador && hasCobradorElsewhere(state, pos)) {
        return {
            ok: false,
            reason: "Só é permitido 1 cobrador por ônibus."
        };
    }
    if (typeof card.require === "function") {
        const {
            ctx
        } = buildCtx(state);
        try {
            const rq = card.require(ctx, pos);
            if (!rq.ok) return {
                ok: false,
                reason: rq.msg || "Exigência não atendida para embarcar."
            };
        } catch (e) {
            return {
                ok: false,
                reason: "Exigência não atendida para embarcar."
            };
        }
    }
    return {
        ok: true
    };
}

/* ============================
    BUS VISUAL
============================= */
const BUS_SEATS = document.getElementById("busVisualSeats");
let currentBusFocus = null;

function mountBusVisual() {
    BUS_SEATS.innerHTML = "";
    for (let n = 1; n <= 12; n++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "bseat";
        b.textContent = n;
        b.dataset.seatno = n;
        b.addEventListener("click", () => {
            focusGridSeat(n, true);
            openPickerForSeat(n);
        });
        BUS_SEATS.appendChild(b);
    }
    document.getElementById("btnVisualHelp").onclick = () => document.getElementById("visualHelp").classList.toggle("open");
}

function updateBusVisualLabels(state) {
    const items = BUS_SEATS.querySelectorAll(".bseat");
    items.forEach(el => {
        const n = +el.dataset.seatno;
        const {
            row,
            col
        } = seatNumToRC(n);
        const card = state.grid[row][col].card;
        const label = card ? `${n} — ${card.nome}` : `${n} — Vazio`;
        el.setAttribute("data-label", label);
        el.setAttribute("aria-current", currentBusFocus === n ? "true" : "false");
        el.classList.toggle("occ", !!card);
    });
}

function seatNumber(pos) {
    return pos.row === 0 ? (pos.col + 1) : (6 + pos.col + 1);
}

function focusGridSeat(n, fromBus = false) {
    const {
        row,
        col
    } = seatNumToRC(n);
    const seatEl = GRID.querySelector(`.seat[data-row="${row}"][data-col="${col}"]`);
    if (seatEl) {
        seatEl.classList.add("hl");
        setTimeout(() => seatEl.classList.remove("hl"), 700);
        if (fromBus) {
            currentBusFocus = n;
            updateBusVisualLabels(collectState());
        }
        seatEl.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        scrollExplainToSeat(n);
    }
}

/* ============================
    Pontuação – motorista, melhorias e mão
============================= */
function scoreDriver(state, ctx) {
    if (!state.driver) return 0;
    const b = state.driver.bonus;
    let n = 0;
    ctx.forEachCard((p, c) => {
        if (c.isCobrador) return;
        if ([c.faixa, c.temper, c.comp].some(tag => b.includes(tag))) n++;
    });
    return n;
}

function scoreImprovements(state, ctx, breakdown) {
    const fausta = ctx.existsId("dona_fausta");
    if (fausta) return {
        score: 0,
        note: "Dona Fausta presente: melhorias não pontuam."
    };
    let s = 0;
    state.improvements.forEach(imp => {
        let k = 0;
        ctx.forEachCard((p, c) => {
            if (c.isCobrador) return;
            if ([c.faixa, c.temper, c.comp].some(tag => imp.bonus.includes(tag))) k++;
        });
        breakdown.push({
            who: `[Melhoria] ${imp.nome}`,
            delta: +k,
            detail: `+${k} por correspondências no busão (somente cartas ativas)`
        });
        s += k;
    });
    return {
        score: s
    };
}

/* ============================
    Bônus – Os Apaixonados (dobro da soma base em grupos 2+)
============================= */
function apaixonadosBonus(state, ctx) {
    if (!EXP_APX.checked) return {
        score: 0,
        parts: []
    };

    // Mapa de apaixonados ativos (posições)
    const nodes = [];
    ctx.forEachCard((pos, card) => {
        if (card.isApaixonado) {
            nodes.push({
                pos,
                card
            });
        }
    });
    if (nodes.length < 2) return {
        score: 0,
        parts: []
    };

    // Construir componentes conexas via BFS usando vizinhos de ctx
    const visited = new Set();
    const groups = [];
    const key = (p) => `${p.row},${p.col}`;

    const isApxAt = (p) => {
        const cell = state.grid[p.row][p.col];
        return cell && cell.card && cell.card.isApaixonado;
    };

    for (const n of nodes) {
        const k = key(n.pos);
        if (visited.has(k)) continue;
        // BFS
        const q = [n.pos];
        visited.add(k);
        const group = [];
        while (q.length) {
            const cur = q.shift();
            const card = state.grid[cur.row][cur.col].card;
            group.push({
                pos: cur,
                card
            });
            for (const nb of ctx.neighbors(cur)) {
                const kk = key(nb);
                if (!visited.has(kk) && isApxAt(nb)) {
                    visited.add(kk);
                    q.push(nb);
                }
            }
        }
        groups.push(group);
    }

    let totalBonus = 0;
    const parts = [];
    let idx = 1;
    for (const g of groups) {
        if (g.length >= 2) {
            const sumBase = g.reduce((acc, x) => acc + (x.card.base || 0), 0);
            const bonus = sumBase; // dobrar a soma => bônus igual à soma (base + bônus = 2×)
            if (bonus > 0) {
                totalBonus += bonus;
                const seats = g.map(x => seatNumber(x.pos)).sort((a, b) => a - b).join(", ");
                parts.push({
                    who: `[Apaixonados] Grupo ${idx} (assentos ${seats})`,
                    delta: +bonus,
                    detail: `Bônus de dobro da soma base: ${sumBase} → +${bonus}`
                });
                idx++;
            }
        }
    }
    return {
        score: totalBonus,
        parts
    };
}

/* ============================
    Render / detalhes
============================= */
function cardStaticInfo(card) {
    const attrs = card.isCobrador ? "[Cobrador]" : card.isApaixonado ? "[Apaixonado]" : `${card.faixa}, ${card.temper}, ${card.comp}.`;
    const pts = `${card.base} ponto${card.base===1?"":"s"}.`;
    let label = "Efeito";
    if (card.isCobrador) label = "Habilidade";
    else if (card.isApaixonado) label = "Apaixonado";
    else if (card.impacto.includes("durante") && card.text && /Ao embarcar/i.test(card.text)) label = "Condição";
    else if (card.require && !card.ability && !card.penalty) label = "Exigência";
    else if (card.scoreReq && !card.ability && !card.penalty) label = "Condição de pontuação";
    else if (card.penalty && !card.ability) label = "Penalidade";
    else if (card.ability) label = "Habilidade";
    const textLine = card.text ? `\n${label}: ${card.text}` : "";
    return `${attrs} ${pts}${textLine}`;
}

function render() {
    const state = collectState();
    const {
        ctx,
        warnings,
        isActiveAt
    } = buildCtx(state);
    updateBusVisualLabels(state);

    const rows = [];
    let passengersScore = 0;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const card = state.grid[r][c].card;
            if (!card) continue;
            const pos = {
                row: r,
                col: c
            };

            // Falha de EMBARQUE ⇒ não existe no busão (não conta pra nada)
            if (!isActiveAt(pos) && typeof card.require === "function") {
                const rq = card.require(ctx, pos) || {
                    ok: false,
                    msg: "Exigência não atendida."
                };
                const msg = `<span class="req-badge">Exigência não atendida</span> <span class="req-text">${rq.msg || ""}</span>\n${cardStaticInfo(card)}`;
                rows.push(rowLine(`Assento ${seatNumber(pos)} — ${card.nome}`, 0, msg, seatNumber(pos), "req"));
                continue;
            }

            let s = card.base;
            const notes = [];
            const log = (t) => notes.push(t);
            notes.push(cardStaticInfo(card));
            if (card.ability) s += (card.ability(pos, ctx, log) || 0);
            if (card.penalty) s += (card.penalty(pos, ctx, log) || 0);

            // Condição de PONTUAÇÃO (não bloqueia embarque)
            let extraCls = "";
            if (typeof card.scoreReq === "function") {
                const sr = card.scoreReq(ctx, pos);
                if (!sr.ok) {
                    notes.push(`<span class="noscore-badge">Sem pontuação</span> <span class="req-text">${sr.msg||""}</span>\n(Continua contando para motorista, melhorias e adjacências)`);
                    s = 0;
                    extraCls = "sc";
                }
            }
            if (card.note && card.impacto.includes("durante")) notes.push(`Nota: ${card.note}`);

            rows.push(rowLine(`Assento ${seatNumber(pos)} — ${card.nome}`, s, notes.join("\n"), seatNumber(pos), extraCls));
            passengersScore += s;
        }
    }

    const driverPts = scoreDriver(state, ctx);
    const improvBreak = [];
    const {
        score: improvPts,
        note: improvNote
    } = scoreImprovements(state, ctx, improvBreak);

    // BÔNUS DOS APAIXONADOS (após somar passageiros)
    const apx = apaixonadosBonus(state, ctx);

    const handPenalty = -(state.hand || 0);

    sumPassengersEl.textContent = passengersScore;
    sumDriverEl.textContent = driverPts;
    sumImprovEl.textContent = improvPts;
    sumHandEl.textContent = handPenalty;

    const total = passengersScore + driverPts + improvPts + apx.score + handPenalty;
    totalScoreEl.textContent = total;
    totalScoreEl.className = "v kpi " + (total > 0 ? "good" : (total < 0 ? "bad" : "neu"));

    const w = [];
    if (improvNote) w.push(improvNote);
    if (warnings.length) w.push(...warnings);
    warningsEl.innerHTML = w.length ? `<div class="kpi warn">⚠ ${w.join("<br>⚠ ")}</div>` : "";

    const lines = [
        ...rows,
        ...improvBreak.map(x => rowLine(x.who, x.delta, x.detail)),
        ...(apx.parts || []).map(x => rowLine(x.who, x.delta, x.detail)),
        rowLine("[Mão]", handPenalty, handPenalty ? `${handPenalty} (–1 por ${Math.abs(handPenalty)} carta(s) na mão)` : "")
    ];
    EXPLAIN.innerHTML = lines.join("");
    if (currentBusFocus) scrollExplainToSeat(currentBusFocus);
}

function rowLine(name, score, detail, seatId, extraCls = "") {
    return `<div class="row ${extraCls}" ${seatId?`id="exp-seat-${seatId}"`:``}>
        <div class="h"><div class="name">${name}</div><div class="score">${
      score>0?`<span class="kpi good">+${score}</span>`: (score<0?`<span class="kpi bad">${score}</span>`:`<span class="kpi neu">${score}</span>`)
    }</div></div>
        ${detail?`<div class="d">${detail}</div>`:""}
      </div>`;
}

function scrollExplainToSeat(n) {
    const el = document.getElementById(`exp-seat-${n}`);
    if (el) {
        el.classList.add("hl");
        setTimeout(() => el.classList.remove("hl"), 1200);
        el.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
}

/* ============================
    Desabilitar opções no select conforme regras
============================= */
function refreshSeatSelects() {
    const state = collectState();

    GRID.querySelectorAll("select.seat-select").forEach(sel => {
        const r = +sel.dataset.row,
            c = +sel.dataset.col;
        const pos = {
            row: r,
            col: c
        };
        const blockedByWilson = isSeatBlockedByWilson(pos);
        const otherHasCobrador = anyCobradorSelected(sel); // outro assento já tem cobrador?

        Array.from(sel.options).forEach(opt => {
            if (!opt.value) {
                opt.disabled = false;
                return;
            }
            const id = opt.value;
            const isDup = getSelectedCardIds().includes(id) && sel.value !== id && !allowDuplicate(id);
            let disable = isDup;

            if (blockedByWilson) disable = true;

            if (!disable) {
                const card = findAnyCard(id);
                if (card) {
                    if (card.isCobrador && otherHasCobrador) disable = true;
                    else {
                        const {
                            ok
                        } = checkCardAllowedAt(card, pos, state);
                        disable = !ok;
                    }
                }
            }
            opt.disabled = disable;
        });

        sel.title = blockedByWilson ? "Bloqueado: Wilson ocupa os 2 lugares desta coluna." : "";
        // Atualizar rótulo do card
        const card = findAnyCard(sel.value);
        const nameEl = sel.parentElement.nextElementSibling;
        if (nameEl) nameEl.textContent = card ? card.nome : " Adicionar ";
    });
}

/* ============================
    Catálogo + Busca (em aba própria)
============================= */
const catalogContentEl = document.getElementById("catalogContent");
const catalogSearchEl = document.getElementById("catalogSearch");
document.getElementById("clearCatalogSearch").onclick = () => {
    catalogSearchEl.value = "";
    buildCatalog("");
};
catalogSearchEl?.addEventListener("input", () => buildCatalog(catalogSearchEl.value));

function norm(s) {
    return String(s || "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function cardMatchesFilter(card, q) {
    if (!q) return true;
    const nq = norm(q);
    const hay = [
        card.nome,
        card.faixa, card.temper, card.comp,
        card.text || "",
        card.isCobrador ? "cobrador" : card.isApaixonado ? "apaixonado" : "passageiro"
    ].join(" ");
    return norm(hay).includes(nq);
}

function buildCatalog(q) {
    const groups = [{
        title: "Motoristas",
        items: DRIVERS.filter(d => d.id),
        render: d => ({
            name: d.nome,
            pts: "+1 por tags",
            tags: d.bonus.join(" • "),
            text: "Concede +1 por cada ocorrência das 3 subcategorias.",
            badges: []
        })
    }, {
        title: "Melhorias",
        items: IMPROVEMENTS,
        render: i => ({
            name: i.nome,
            pts: "+1 por tags",
            tags: i.bonus.join(" • "),
            text: "Soma +1 por ocorrência nas cartas ativas.",
            badges: []
        })
    }, {
        title: "Passageiros",
        items: CARD_DB.filter(c => cardMatchesFilter(c, q)),
        render: c => ({
            name: c.nome,
            pts: `${c.base} pts`,
            tags: `${c.faixa} • ${c.temper} • ${c.comp}`,
            text: c.text || "",
            badges: [
                c.require ? "req" : "", c.penalty && !c.ability ? "pen" : "", c.ability ? "hab" : ""
            ].filter(Boolean)
        })
    }, {
        title: "Cobradores (expansão)",
        items: COBRADORES.filter(c => cardMatchesFilter(c, q)),
        render: c => ({
            name: c.nome,
            pts: "Habilidade",
            tags: "[Cobrador] • +2 por tag correspondente",
            text: c.text || "",
            badges: ["exp", "hab"]
        })
    }, ];

    // Adicionar grupo dos Apaixonados se a expansão estiver ativa
    if (EXP_APX.checked) {
        groups.push({
            title: "Apaixonados (expansão)",
            items: APAIXONADOS.filter(a => cardMatchesFilter(a, q)),
            render: a => ({
                name: a.nome,
                pts: `${a.base} pts`,
                tags: `${a.faixa} • ${a.temper} • ${a.comp} • [Apaixonado]`,
                text: a.text || "",
                badges: ["exp", "hab"]
            })
        });
    }

    const html = groups.map(g => {
        const inner = g.items.map(it => {
            const m = g.render(it);
            const badges = (m.badges || []).map(b => {
                const label = b === "exp" ? "Expansão" : b === "req" ? "Exigência" : b === "pen" ? "Penalidade" : b === "hab" ? "Habilidade" : b;
                const cls = b === "exp" ? "exp" : b === "req" ? "req" : b === "pen" ? "pen" : "hab";
                return `<span class="badge ${cls}">${label}</span>`;
            }).join("");
            return `<div class="cat-item">
          <div class="cat-head"><div class="cat-name">${m.name}</div><div class="cat-pts">${m.pts}</div></div>
          <div class="cat-tags">${badges} ${m.tags}</div>
          ${m.text?`<div class="cat-text">${m.text}</div>`:""}
        </div>`;
        }).join("");
        return `<div class="cat-group"><h3>${g.title}</h3>${inner || `<div class="muted">Nenhum item</div>`}</div>`;
    }).join("");

    catalogContentEl.innerHTML = html;
}

/* ============================
    Picker (modal) — seleção agradável de carta
============================= */
const pickerModal = document.getElementById("pickerModal");
const pickerTitle = document.getElementById("pickerTitle");
const pickerSeatLabel = document.getElementById("pickerSeatLabel");
const pickerSearch = document.getElementById("pickerSearch");
const pickerGrid = document.getElementById("pickerGrid");
const pickerClose = document.getElementById("pickerClose");
const pickerClear = document.getElementById("pickerClear");
const pillPass = document.querySelector('.pill[data-tab="pass"]');
const pillCob = document.querySelector('.pill[data-tab="cob"]');
const pillApx = document.querySelector('.pill[data-tab="apx"]'); // NOVO

let pickerSeatNo = null;
let pickerTab = "pass";

pickerClose.onclick = () => closePicker();
pickerClear.onclick = () => {
    if (pickerSeatNo == null) return;
    const {
        row,
        col
    } = seatNumToRC(pickerSeatNo);
    const sel = GRID.querySelector(`select.seat-select[data-row="${row}"][data-col="${col}"]`);
    if (sel) {
        sel.value = "";
        sel.dispatchEvent(new Event('change'));
    }
    closePicker();
};

pillPass.onclick = () => {
    pickerTab = "pass";
    pillPass.classList.add('act');
    pillCob.classList.remove('act');
    pillApx.classList.remove('act');
    buildPickerList();
};
pillCob.onclick = () => {
    pickerTab = "cob";
    pillCob.classList.add('act');
    pillPass.classList.remove('act');
    pillApx.classList.remove('act');
    buildPickerList();
};
pillApx.onclick = () => {
    pickerTab = "apx";
    pillApx.classList.add('act');
    pillPass.classList.remove('act');
    pillCob.classList.remove('act');
    buildPickerList();
}; // NOVO
pickerSearch.addEventListener("input", buildPickerList);

function openPickerForSeat(seatNo) {
    pickerSeatNo = seatNo;
    pickerTitle.textContent = "Escolher carta para o assento";
    pickerSeatLabel.textContent = `Assento ${seatNo}`;
    pickerSearch.value = "";
    // Aba padrão: Passageiros
    pickerTab = "pass";
    pillPass.classList.add('act');
    pillCob.classList.remove('act');
    pillApx.classList.remove('act');
    buildPickerList();
    pickerModal.classList.add("open");
}

function closePicker() {
    pickerModal.classList.remove("open");
    pickerSeatNo = null;
}

function buildPickerList() {
    const state = collectState();
    const {
        row,
        col
    } = seatNumToRC(pickerSeatNo || 1);
    const pos = {
        row,
        col
    };

    const includeCob = EXP_COB.checked;
    const includeApx = EXP_APX.checked;

    let list = [];
    if (pickerTab === "pass") {
        list = CARD_DB.slice().sort(byName);
    } else if (pickerTab === "cob" && includeCob) {
        list = COBRADORES.slice().sort(byName);
    } else if (pickerTab === "apx" && includeApx) {
        list = APAIXONADOS.slice().sort(byName);
    }

    const q = norm(pickerSearch.value);

    const grid = list
        .filter(c => {
            // filtro de texto
            const hay = norm([c.nome, c.faixa, c.temper, c.comp, c.text || "", c.isCobrador ? "cobrador" : c.isApaixonado ? "apaixonado" : "passageiro"].join(" "));
            return !q || hay.includes(q);
        })
        .map(c => {
            const {
                ok,
                reason
            } = checkCardAllowedAt(c, pos, state);
            const disabled = !ok;
            const tags = c.isCobrador ? "[Cobrador]" : c.isApaixonado ? "[Apaixonado]" : `${c.faixa} • ${c.temper} • ${c.comp}`;
            const extra = c.text ? ` — ${c.text}` : "";
            return {
                c,
                disabled,
                reason,
                tags,
                extra
            };
        });

    pickerGrid.innerHTML = grid.map(item => {
        return `<div class="picker-item ${item.disabled?'disabled':''}" data-id="${item.c.id}" title="${item.disabled? (item.reason||'Indisponível'): 'Selecionar'}">
          <div>
            <div class="picker-name">${item.c.nome}</div>
            <div class="picker-tags">${item.tags}</div>
            ${item.extra? `<div class="muted" style="font-size:12px;margin-top:4px">${item.extra}</div>`:""}
          </div>
        </div>`;
    }).join("");

    // Clicks
    pickerGrid.querySelectorAll(".picker-item").forEach(el => {
        el.onclick = () => {
            const id = el.getAttribute("data-id");
            const card = findAnyCard(id);
            const {
                ok,
                reason
            } = checkCardAllowedAt(card, pos, state);
            if (!ok) {
                alert(reason || "Carta indisponível para esse assento agora.");
                return;
            }
            const sel = GRID.querySelector(`select.seat-select[data-row="${row}"][data-col="${col}"]`);
            if (sel) {
                // bloqueios adicionais (duplicata/cobrador)
                if (id && isSeatBlockedByWilson(pos)) {
                    alert("O Wilson está no ônibus e ocupa os 2 lugares desta coluna. Deixe este assento vazio.");
                    return;
                }
                if (id && isCobradorId(id) && anyCobradorSelected(sel)) {
                    alert("Sô é permitido 1 cobrador por ônibus.");
                    return;
                }
                if (id && isCardSelectedElsewhere(id, sel) && !card.allowDup && !card.isApaixonado) {
                    alert("Você já colocou esta carta em outro assento.");
                    return;
                }
                sel.value = id;
                sel.dispatchEvent(new Event('change'));
                focusGridSeat(pickerSeatNo, true);
                closePicker();
            }
        };
    });
}

/* ============================
    BUS VISUAL seat labels + scroll
============================= */
function scrollExplainToSeat(n) {
    const el = document.getElementById(`exp-seat-${n}`);
    if (el) {
        el.classList.add("hl");
        setTimeout(() => el.classList.remove("hl"), 1200);
        el.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
}

/* ============================
    Melhorias / Regras auxiliares
============================= */
function reqImprovement(ctx, name) {
    const ok = ctx.hasImprovement(name);
    return {
        ok,
        msg: ok ? "" : `Precisa da melhoria ${name}.`
    };
}

/* ============================
    Ranking (mínimo: manter comportamentos existentes)
============================= */
const LS_KEY = "busao_ranking_v1";

function loadRank() {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY) || "[]")
    } catch {
        return []
    }
}

function saveRank(list) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
}

function renderRank() {
    const list = loadRank();
    rankTableBody.innerHTML = list.map((it, i) => `<tr><td>${i+1}</td><td>${it.player||"-"}</td><td>${it.driver||"-"}</td><td>${it.improvements||"-"}</td><td class="right">${it.score}</td></tr>`).join("");
}
btnSaveScore.onclick = () => {
    const st = collectState();
    const score = +totalScoreEl.textContent || 0;
    const improvs = st.improvements.map(i => i.nome).join(", ");
    const driver = st.driver?.nome || "";
    const player = playerNameEl.value || "";
    const list = loadRank();
    list.push({
        player,
        driver,
        improvs,
        score,
        ts: Date.now()
    });
    list.sort((a, b) => b.score - a.score);
    saveRank(list);
    renderRank();
};
btnResetRanking.onclick = () => {
    if (confirm("Zerar ranking salvo no navegador?")) {
        saveRank([]);
        renderRank();
    }
};

/* ============================
    Ações: limpar / nova pontuação
============================= */
btnClearSeats.onclick = () => {
    GRID.querySelectorAll("select.seat-select").forEach(s => {
        s.value = "";
    });
    refreshSeatSelects();
    render();
};
btnNewRound.onclick = () => {
    playerNameEl.value = "";
    playerTagEl.textContent = "";
    DRIVER_SEL.value = "";
    selectedImprovementIds.clear();
    Array.from(IMPROV_BUTTONS_WRAP.children).forEach(b => b.classList.remove("sel"));
    EXP_APX.checked = false; // NOVO: desmarcar expansão dos apaixonados
    handCountEl.value = 0;
    GRID.querySelectorAll("select.seat-select").forEach(s => {
        s.value = "";
    });
    refreshSeatSelects();
    renderDriverInfo();
    render();
};

/* ============================
    Inicialização
============================= */
function mount() {
    mountLeft();
    mountGrid();
    mountBusVisual();
    renderRank();
    buildCatalog("");
    render();
}

// Inicializar tudo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', mount);