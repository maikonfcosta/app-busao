/* ============================
   GameLogic.js
   Módulo de cálculo puro do Busão.
   Sem acesso ao DOM — recebe dados, retorna resultados.
============================= */

class GameLogic {
  /**
   * @param {Object}      options
   * @param {Object|null} options.driver       - Objeto motorista (de DRIVERS)
   * @param {Array}       options.improvements - Melhorias ativas
   * @param {Array}       options.perrengues   - Perrengues ativos
   * @param {Array}       options.rotasDiarias - Rotas diárias ativas
   * @param {Object}      options.expansions   - { apaixonados: bool, grupoPagode: bool }
   * @param {number}      options.rows         - Linhas do grid (padrão 2)
   * @param {number}      options.cols         - Colunas do grid (padrão 6)
   */
  constructor({
    driver       = null,
    improvements = [],
    perrengues   = [],
    rotasDiarias = [],
    expansions   = {},
    rows         = 2,
    cols         = 6,
  } = {}) {
    this.driver       = driver;
    this.improvements = improvements;
    this.perrengues   = perrengues;
    this.rotasDiarias = rotasDiarias;
    this.expansions   = expansions;
    this.rows         = rows;
    this.cols         = cols;
  }

  /* ============================
     MÉTODO PRINCIPAL
  ============================= */

  /**
   * Calcula a pontuação total com detalhamento completo.
   * @param {Array} tableCards - Array de { card, row, col } (cartas no tabuleiro)
   * @param {Array|number} handCards - Array de cartas na mão OU número de cartas
   * @returns {{ total, breakdown, warnings }}
   */
  calculate(tableCards, handCards) {
    const state = this._buildState(tableCards, handCards);
    const { ctx, warnings, isActiveAt } = this._buildCtx(state);

    const { passengersScore, details: passengerDetails } = this._scorePassengers(state, ctx, isActiveAt);
    const driverScore = this._scoreDriver(state, ctx);

    const improvDetails = [];
    const { score: improvScore, note: improvNote } = this._scoreImprovements(state, ctx, improvDetails);

    const perrenguesDetails = [];
    const { score: perrenguesScore } = this._scorePerrengues(state, ctx, perrenguesDetails);

    const rotasDiariasDetails = [];
    const { score: rotasDiariasScore } = this._scoreRotasDiarias(state, ctx, rotasDiariasDetails);

    const { score: apaixonadosScore, details: apaixonadosDetails } = this._apaixonadosBonus(state, ctx);
    const { score: pagodeScore, note: pagodeNote } = this._grupoPagodeBonus(state, ctx);
    const { hasIsabel, hasEdio, handPenalty, handDetail } = this._calcHandPenalty(ctx, state);

    const total =
      passengersScore + driverScore + improvScore +
      perrenguesScore + rotasDiariasScore + apaixonadosScore +
      pagodeScore     + handPenalty;

    return {
      total,
      breakdown: {
        passengers:   { score: passengersScore,  details: passengerDetails },
        driver:       { score: driverScore },
        improvements: { score: improvScore, note: improvNote, details: improvDetails },
        perrengues:   { score: perrenguesScore,  details: perrenguesDetails },
        rotasDiarias: { score: rotasDiariasScore, details: rotasDiariasDetails },
        apaixonados:  { score: apaixonadosScore, details: apaixonadosDetails },
        grupoPagode:  { score: pagodeScore, note: pagodeNote },
        hand:         { score: handPenalty, detail: handDetail, hasIsabel, hasEdio },
      },
      warnings,
    };
  }

  /* ============================
     HELPERS INTERNOS
  ============================= */

  _buildState(tableCards, handCards) {
    const grid = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ({ card: null }))
    );
    for (const { card, row, col } of tableCards) {
      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        grid[row][col] = { card };
      }
    }
    const hand = Array.isArray(handCards) ? handCards.length : (handCards || 0);
    return {
      grid,
      driver:       this.driver,
      improvements: this.improvements,
      perrengues:   this.perrengues,
      rotasDiarias: this.rotasDiarias,
      hand,
    };
  }

  _neighbors(pos) {
    const out = [];
    if (pos.col - 1 >= 0)         out.push({ row: pos.row,           col: pos.col - 1 });
    if (pos.col + 1 < this.cols)  out.push({ row: pos.row,           col: pos.col + 1 });
    const other = pos.row === 0 ? 1 : 0;
    for (let dc = -1; dc <= 1; dc++) {
      const cc = pos.col + dc;
      if (cc >= 0 && cc < this.cols) out.push({ row: other, col: cc });
    }
    return out;
  }

  _seatNumber(pos) {
    return pos.row === 0 ? pos.col + 1 : this.cols + pos.col + 1;
  }

  /* ============================
     CONTEXTO DE AVALIAÇÃO
  ============================= */

  _buildCtx(state) {
    const warnings = [];
    const memo = new Map();
    const rows = this.rows, cols = this.cols;
    const key = (r, c) => `${r},${c}`;
    const getPos = (r, c) => state.grid[r][c];
    const neighbors = (pos) => this._neighbors(pos);

    const isActiveAt = (pos) => {
      const k = key(pos.row, pos.col);
      if (memo.has(k)) return memo.get(k);
      const card = getPos(pos.row, pos.col).card;
      let ok = false;
      if (card) {
        if (typeof card.require === 'function') {
          const proxy = {
            grid: state.grid,
            improvements: state.improvements,
            driver: state.driver,
            hasImprovement: (name) => state.improvements.some(i => i.nome === name),
            getPos,
            countBus:            (pred)    => countBusActive(pred),
            countAdj:            (p, pred) => countAdjActive(p, pred),
            countAdjEmpty:       (p)       => countAdjEmptyActive(p),
            countAheadBothRows:  (p)       => countAheadBothRowsActive(p),
            existsId:            (id)      => existsIdActive(id),
            isActiveAt,
          };
          try { ok = !!card.require(proxy, pos)?.ok; } catch { ok = false; }
        } else {
          ok = true;
        }
      }
      memo.set(k, ok);
      return ok;
    };

    const forEachActive = (fn) => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const card = state.grid[r][c].card;
          if (card && isActiveAt({ row: r, col: c })) fn({ row: r, col: c }, card);
        }
      }
    };

    const countBusActive          = (pred)       => { let n = 0; forEachActive((p, c) => { if (pred(c, p)) n++; }); return n; };
    const countAdjActive          = (pos, pred)  => { let n = 0; for (const nb of neighbors(pos)) { const c = state.grid[nb.row][nb.col].card; if (c && isActiveAt(nb) && pred(c, nb)) n++; } return n; };
    const countAdjEmptyActive     = (pos)        => { let n = 0; for (const nb of neighbors(pos)) { const c = state.grid[nb.row][nb.col].card; if (!c || !isActiveAt(nb)) n++; } return n; };
    const countAheadBothRowsActive = (pos)       => {
      let n = 0;
      for (let c = 0; c < pos.col; c++) {
        const a = { row: 0, col: c }, b = { row: 1, col: c };
        if (state.grid[a.row][a.col].card && isActiveAt(a)) n++;
        if (state.grid[b.row][b.col].card && isActiveAt(b)) n++;
      }
      return n;
    };
    const existsIdActive = (id) => { let found = false; forEachActive((_p, c) => { if (c.id === id) found = true; }); return found; };

    const ctx = {
      grid:               state.grid,
      improvements:       state.improvements,
      driver:             state.driver,
      perrengues:         state.perrengues,
      rotasDiarias:       state.rotasDiarias,
      warn:               (msg)       => warnings.push(msg),
      hasImprovement:     (name)      => state.improvements.some(i => i.nome === name),
      existsId:           existsIdActive,
      getPos,
      forEachCard:        forEachActive,
      countBus:           (pred)      => countBusActive(pred),
      countAdj:           (pos, pred) => countAdjActive(pos, pred),
      countAdjEmpty:      (pos)       => countAdjEmptyActive(pos),
      countAheadBothRows: (pos)       => countAheadBothRowsActive(pos),
      neighbors,
      isActiveAt,
    };
    return { ctx, warnings, isActiveAt };
  }

  /* ============================
     PONTUAÇÃO — MOTORISTA
  ============================= */

  _scoreDriver(state, ctx) {
    if (!state.driver) return 0;
    let n = 0;
    state.driver.bonus.forEach(tag => {
      ctx.forEachCard((_p, c) => {
        if (c.isCobrador || c.id === 'mateus') return;
        if (c.faixa === tag || c.temper === tag || c.comp === tag) n++;
      });
    });
    if (ctx.existsId('vovo_michel')) n *= 2;
    return n;
  }

  /* ============================
     PONTUAÇÃO — MELHORIAS
  ============================= */

  /**
   * Bônus somatório: para cada tag em `imp.bonus`, conta quantas cartas ativas
   * no tabuleiro (`faixa`, `temper` ou `comp`) correspondem a ela.
   * Resultado: +1 por correspondência por tag (somado, não multiplicado).
   * Sem lógica de adjacência. Dona Fausta cancela todos os bônus de Melhoria.
   */
  _scoreImprovements(state, ctx, breakdown) {
    if (ctx.existsId('dona_fausta')) {
      return { score: 0, note: 'Dona Fausta presente: melhorias não pontuam.' };
    }
    let s = 0;
    state.improvements.forEach(imp => {
      let k = 0;
      imp.bonus.forEach(tag => {
        ctx.forEachCard((_p, c) => {
          if (c.isCobrador || c.id === 'mateus') return;
          if (c.faixa === tag || c.temper === tag || c.comp === tag) k++;
        });
      });
      breakdown.push({ who: `[Melhoria] ${imp.nome}`, delta: +k, detail: `+${k} por correspondências no busão (somente cartas ativas)` });
      s += k;
    });
    return { score: s };
  }

  /* ============================
     PONTUAÇÃO — MATEUS (CORINGA)
  ============================= */

  _calculateMateusBonus(state) {
    const TAG_CATEGORIES = {
      faixa:  ['Idoso', 'Adulto', 'Jovem'],
      temper: ['Caótico', 'Equilibrado', 'Tranquilo'],
      comp:   ['Barulhento', 'Comunicativo', 'Silencioso'],
    };
    const allTags   = Object.values(TAG_CATEGORIES).flat();
    const tagPoints = Object.fromEntries(allTags.map(tag => [tag, 0]));

    if (state.driver) {
      state.driver.bonus.forEach(tag => { if (tag in tagPoints) tagPoints[tag]++; });
    }
    if (!state.grid.flat().some(cell => cell.card?.id === 'dona_fausta')) {
      state.improvements.forEach(imp => {
        imp.bonus.forEach(tag => { if (tag in tagPoints) tagPoints[tag]++; });
      });
    }

    let totalBonus = 0;
    const breakdownParts = [];
    for (const tags of Object.values(TAG_CATEGORIES)) {
      let bestTag = tags[0], maxPoints = 0;
      tags.forEach(tag => { if (tagPoints[tag] > maxPoints) { maxPoints = tagPoints[tag]; bestTag = tag; } });
      totalBonus += maxPoints;
      breakdownParts.push(`${bestTag} (+${maxPoints})`);
    }
    return { score: totalBonus, breakdown: breakdownParts.join(' • ') };
  }

  /* ============================
     PONTUAÇÃO — PERRENGUES
  ============================= */

  _calcAcidentePontos(state, ctx) {
    if (!state.driver) return { pontos: 0, detalhe: '' };
    const contagens = {};
    state.driver.bonus.forEach(cat => {
      contagens[cat] = ctx.countBus(c =>
        !c.isCobrador && (c.faixa === cat || c.temper === cat || c.comp === cat)
      );
    });
    let categoriaMaior = '', maiorContagem = 0;
    for (const [cat, count] of Object.entries(contagens)) {
      if (count > maiorContagem) { maiorContagem = count; categoriaMaior = cat; }
    }
    const pontos = categoriaMaior ? maiorContagem : 0;
    const detalhe = categoriaMaior ? `Dobrou a categoria ${categoriaMaior} do motorista: +${pontos}` : '';
    return { pontos, detalhe };
  }

  _scorePerrengues(state, ctx, breakdown) {
    let total = 0;
    state.perrengues.forEach(perr => {
      let pontos, detalhe;
      if (perr.id === 'acidente') {
        ({ pontos, detalhe } = this._calcAcidentePontos(state, ctx));
      } else {
        const count = ctx.countBus(c =>
          !c.isCobrador && perr.bonus.some(tag => c.faixa === tag || c.temper === tag || c.comp === tag)
        );
        pontos = count * perr.pontos;
        const sinal = perr.pontos > 0 ? '+' : '';
        detalhe = `${sinal}${perr.pontos} por cada ${perr.bonus.join('/')}: ${count} × ${perr.pontos} = ${pontos}`;
      }
      breakdown.push({ who: `[Perrengue] ${perr.nome}`, delta: pontos, detail: detalhe });
      total += pontos;
    });
    return { score: total };
  }

  /* ============================
     PONTUAÇÃO — ROTAS DIÁRIAS
  ============================= */

  _scoreRotasDiarias(state, ctx, breakdown) {
    let total = 0;
    state.rotasDiarias.forEach(rota => {
      if (rota.condicao(ctx)) {
        breakdown.push({ who: `[Rota Diária] ${rota.nome}`, delta: rota.pontos, detail: rota.efeito });
        total += rota.pontos;
      }
    });
    return { score: total };
  }

  /* ============================
     PONTUAÇÃO — APAIXONADOS
  ============================= */

  _collectApaixonadoGroups(nodes, state, ctx) {
    const visited = new Set();
    const groups  = [];
    const key     = (p) => `${p.row},${p.col}`;
    const isApxAt = (p) => state.grid[p.row][p.col]?.card?.isApaixonado;

    for (const n of nodes) {
      const k = key(n.pos);
      if (visited.has(k)) continue;
      const q = [n.pos]; visited.add(k);
      const group = [];
      while (q.length) {
        const cur  = q.shift();
        const card = state.grid[cur.row][cur.col].card;
        group.push({ pos: cur, card });
        for (const nb of ctx.neighbors(cur)) {
          const kk = key(nb);
          if (!visited.has(kk) && isApxAt(nb)) { visited.add(kk); q.push(nb); }
        }
      }
      groups.push(group);
    }
    return groups;
  }

  _apaixonadosBonus(state, ctx) {
    if (!this.expansions.apaixonados) return { score: 0, details: [] };
    const nodes = [];
    ctx.forEachCard((pos, card) => { if (card.isApaixonado) nodes.push({ pos, card }); });
    if (nodes.length < 2) return { score: 0, details: [] };

    const groups = this._collectApaixonadoGroups(nodes, state, ctx);
    let totalBonus = 0; const details = []; let idx = 1;
    for (const g of groups) {
      if (g.length >= 2) {
        const sumBase = g.reduce((acc, x) => acc + (x.card.base || 0), 0);
        if (sumBase > 0) {
          totalBonus += sumBase;
          const seats = g.map(x => this._seatNumber(x.pos)).sort((a, b) => a - b).join(', ');
          details.push({
            who:    `[Apaixonados] Grupo ${idx} (assentos ${seats})`,
            delta:  sumBase,
            detail: `Bônus de dobro da soma base: ${sumBase} → +${sumBase}`,
          });
          idx++;
        }
      }
    }
    return { score: totalBonus, details };
  }

  /* ============================
     PONTUAÇÃO — GRUPO DE PAGODE
  ============================= */

  _grupoPagodeBonus(state, ctx) {
    if (!this.expansions.grupoPagode) return { score: 0, note: '' };
    const pagodeiros = [];
    // GRUPO_PAGODE é global definida em script.js
    ctx.forEachCard((_p, c) => { if (GRUPO_PAGODE.some(g => g.id === c.id)) pagodeiros.push(c); });
    if (pagodeiros.length === 5) return { score: 50, note: 'Grupo de Pagode completo! +50 pontos extras!' };
    return { score: 0, note: '' };
  }

  /* ============================
     PONTUAÇÃO — PASSAGEIROS
  ============================= */

  _cardLabel(card) {
    if (card.isCobrador)  return 'Habilidade';
    if (card.isApaixonado) return 'Apaixonado';
    if (card.impacto.includes('durante') && card.text && /Ao embarcar/i.test(card.text)) return 'Condição';
    if (card.require && !card.ability && !card.penalty)  return 'Exigência';
    if (card.scoreReq && !card.ability && !card.penalty) return 'Condição de pontuação';
    if (card.penalty && !card.ability) return 'Penalidade';
    if (card.ability) return 'Habilidade';
    return 'Efeito';
  }

  _cardInfo(card) {
    let attrs;
    if      (card.isCobrador)   attrs = '[Cobrador]';
    else if (card.isApaixonado) attrs = '[Apaixonado]';
    else attrs = `${card.faixa}, ${card.temper}, ${card.comp}.`;
    const pts      = `${card.base} ponto${card.base === 1 ? '' : 's'}.`;
    const label    = this._cardLabel(card);
    const textLine = card.text ? `\n${label}: ${card.text}` : '';
    return `${attrs} ${pts}${textLine}`;
  }

  _scorePassengers(state, ctx, isActiveAt) {
    const details = [];
    let passengersScore = 0;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const card = state.grid[r][c].card;
        if (!card) continue;
        const pos    = { row: r, col: c };
        const seatId = this._seatNumber(pos);
        const who    = `Assento ${seatId} — ${card.nome}`;

        // Carta inativa (exigência de embarque não atendida)
        if (!isActiveAt(pos) && typeof card.require === 'function') {
          const rq = card.require(ctx, pos) || { ok: false, msg: 'Exigência não atendida.' };
          details.push({ who, delta: 0, seatId, cardInfo: this._cardInfo(card), inactive: true, requireMsg: rq.msg || '' });
          continue;
        }

        // Mateus (O Coringa)
        if (card.id === 'mateus') {
          const mateusBonus = this._calculateMateusBonus(state);
          const score = card.base + mateusBonus.score;
          details.push({ who, delta: score, seatId, cardInfo: this._cardInfo(card), mateusBonus });
          passengersScore += score;
          continue;
        }

        // Carta regular
        let s = card.base;
        const abilityNotes = [];
        const log = (t) => abilityNotes.push(t);
        if (card.ability) s += (card.ability(pos, ctx, log) || 0);
        if (card.penalty) s += (card.penalty(pos, ctx, log) || 0);

        let scoreSuppressed = false, scoreReqMsg = '';
        if (typeof card.scoreReq === 'function') {
          const sr = card.scoreReq(ctx, pos);
          if (!sr.ok) { s = 0; scoreSuppressed = true; scoreReqMsg = sr.msg || ''; }
        }

        const duringNote = (card.note && card.impacto.includes('durante')) ? card.note : null;
        details.push({ who, delta: s, seatId, cardInfo: this._cardInfo(card), abilityNotes, scoreSuppressed, scoreReqMsg, duringNote });
        passengersScore += s;
      }
    }
    return { passengersScore, details };
  }

  /* ============================
     PONTUAÇÃO — MÃO
  ============================= */

  _calcHandPenalty(ctx, state) {
    const hasIsabel = ctx.existsId('isabel');
    const hasEdio   = ctx.existsId('edio');
    let handPenalty = 0, handDetail;

    if (hasIsabel && hasEdio) {
      handPenalty = state.hand || 0;
      handDetail  = `${handPenalty} (+1 por ${handPenalty} carta(s) na mão, pois Édio e Isabel estão juntos)`;
    } else if (hasIsabel) {
      handDetail = '0 (Isabel presente)';
    } else {
      handPenalty = -(state.hand || 0);
      handDetail  = handPenalty ? `${handPenalty} (–1 por ${Math.abs(handPenalty)} carta(s) na mão)` : '0';
    }
    return { hasIsabel, hasEdio, handPenalty, handDetail };
  }
}

// Export for Node.js (Jest testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameLogic;
}
