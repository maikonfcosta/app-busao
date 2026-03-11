/* ============================
   cardDefinitions.js
   Fonte de verdade das coordenadas do playmat.
   Usado pelo CameraHandler para renderização e por módulos
   de processamento de imagem para recortar cada zona.
============================= */

/**
 * Proporções relativas (0–1) de cada zona no playmat fotografado.
 * x, y  → canto superior esquerdo da zona (fração da largura/altura total)
 * w, h  → largura e altura da zona (fração)
 *
 * Para obter pixels reais:
 *   const px = Math.round(zone.x * imageWidth);
 *   const pw = Math.round(zone.w * imageWidth);
 *   …
 *
 * @typedef {{ label: string, color: string, x: number, y: number, w: number, h: number }} ZoneDef
 * @type {{ melhorias: ZoneDef, motorista: ZoneDef, passageiros: ZoneDef }}
 */
const PLAYMAT_COORDINATES = Object.freeze({

  /**
   * Espaço para Melhorias — coluna estreita à esquerda do tabuleiro.
   * Cor de referência: Roxo (#a855f7)
   */
  melhorias: Object.freeze({
    label: 'Melhorias',
    color: '#a855f7',
    x: 0.02, y: 0.05,
    w: 0.13, h: 0.88,
  }),

  /**
   * Espaço do Motorista — cabine central-esquerda do busão.
   * Cor de referência: Azul (#60a5fa)
   */
  motorista: Object.freeze({
    label: 'Motorista',
    color: '#60a5fa',
    x: 0.17, y: 0.05,
    w: 0.19, h: 0.88,
  }),

  /**
   * Espaço dos Passageiros — área de assentos (maior, à direita).
   * Cor de referência: Amarelo (#fbbf24)
   */
  passageiros: Object.freeze({
    label: 'Passageiros',
    color: '#fbbf24',
    x: 0.38, y: 0.05,
    w: 0.59, h: 0.88,
  }),
});

/* ============================
   ZONAS DE FOCO — CARTAS INDIVIDUAIS
   Usadas pelo CameraHandler para etapas ROTA e PERRENGUE do wizard,
   onde o usuário aponta a câmera para uma carta única.
============================= */

/**
 * Retângulos de foco centralizados para captura de carta individual.
 * • x, y, w, h  — proporções relativas ao frame completo
 * • color       — cor do guia visual
 * • subZones    — sub-regiões internas para dicas visuais
 *
 * @typedef {{ label:string, color:string, x:number, y:number, w:number, h:number,
 *             subZones: Object.<string, {label:string, x:number, y:number, w:number, h:number}>
 *           }} FocusZoneDef
 */
const FOCUS_ZONES = Object.freeze({

  /**
   * Rota Diária — retângulo centralizado; sub-zona de pontuação no centro.
   * Cor de referência: Verde (#34d399)
   */
  rota: Object.freeze({
    label: 'Rota Diária',
    color: '#34d399',
    x: 0.2, y: 0.08, w: 0.6, h: 0.84,
    subZones: Object.freeze({
      score: Object.freeze({ label: 'Pontuação',       x: 0.25, y: 0.35, w: 0.5, h: 0.28 }),
      // Nome da Rota — topo do frame onde o título aparece centralizado
      title: Object.freeze({ label: 'Título da Rota',  x: 0.1,  y: 0.05, w: 0.8, h: 0.32 }),
    }),
  }),

  /**
   * Melhoria — retângulo centralizado; sub-zona de nome (topo) e ícones de bônus (base).
   * Cor de referência: Roxo (#a855f7) — mesma da borda da carta.
   */
  melhorias: Object.freeze({
    label: 'Melhoria',
    color: '#a855f7',
    x: 0.2, y: 0.08, w: 0.6, h: 0.84,
    subZones: Object.freeze({
      // Nome da melhoria — faixa superior logo abaixo do topo da carta
      name:  Object.freeze({ label: 'Nome',          x: 0.04, y: 0.04, w: 0.92, h: 0.18 }),
      // Ícones de bônus "+1" para tipos de passageiro — base da carta
      icons: Object.freeze({ label: 'Ícones Bônus',  x: 0.04, y: 0.82, w: 0.92, h: 0.15 }),
    }),
  }),

  /**
   * Perrengue — retângulo centralizado; sub-zonas de título e modificador.
   * Cor de referência: Vermelho (#f87171)
   */
  perrengue: Object.freeze({
    label: 'Perrengue',
    color: '#f87171',
    x: 0.2, y: 0.08, w: 0.6, h: 0.84,
    subZones: Object.freeze({
      // Barra do logo "PERRENGUE NEWS" com o modificador "+N : [ícone]"
      header: Object.freeze({ label: 'Logo/Modificador',  x: 0.02, y: 0.01, w: 0.96, h: 0.14 }),
      // Somente o título em negrito — ignora o texto miúdo da notícia
      title:  Object.freeze({ label: 'Título em Negrito', x: 0.04, y: 0.15, w: 0.92, h: 0.22 }),
    }),
  }),
});

/* ============================
   OCR — CORRESPONDÊNCIA DE NOMES
============================= */

/**
 * Remove acentos, converte para minúsculas e normaliza espaços.
 * @param {string} s
 * @returns {string}
 */
function _ocrNormalize(s) {
  return s
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s]/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

/**
 * Distância de edição (Levenshtein) entre duas strings.
 * Complexidade O(|a|·|b|) em tempo, O(|b|) em memória.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function _levenshtein(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = new Array(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev.splice(0, prev.length, ...curr);
  }
  return prev[b.length];
}

/**
 * Palavras excluídas do matching de passageiros para evitar falsos positivos
 * causados por textos de efeito que citam outras cartas pelo apelido:
 * • "busao"  — aparece em quase todos os efeitos ("se X estiver no Busão")
 * • "grandao" — citado literalmente no efeito de O Maromba, causando falso match de Fabão
 *              quando Fabão não está em jogo. Fabão ainda é detectável pelo seu nome "fabao".
 */
const _PASSAGEIRO_STOPWORDS = new Set(['busao', 'grandao']);

/**
 * Pontuação de 0–1: fração de tokens de `normalizedStr` encontrados em `haystack`.
 * Usa fuzzy Levenshtein como fallback (tolerância 25% do token, mínimo 1).
 * @param {string}       normalizedStr
 * @param {string}       haystack
 * @param {Set<string>}  [stopwords] — tokens a ignorar (palavras genéricas do jogo)
 * @returns {number}
 */
function _scoreTokens(normalizedStr, haystack, stopwords = null) {
  const tokens = normalizedStr.split(' ').filter(t => t.length >= 3 && !(stopwords?.has(t)));
  if (tokens.length === 0) return 0;
  const words = haystack.split(' ').filter(w => w.length >= 3);
  const matched = tokens.filter(t => {
    if (haystack.includes(t)) return true;
    const maxDist = Math.max(1, Math.floor(t.length * 0.25));
    return words.some(w => _levenshtein(t, w) <= maxDist);
  });
  return matched.length / tokens.length;
}

/**
 * Pontuação de 0–1 baseada em quantos tokens significativos de `name`
 * estão presentes em `haystack` (texto OCR normalizado).
 * Tokens com 3+ caracteres são considerados significativos.
 *
 * Tenta três formas do nome e toma o maior score:
 *   1. Nome completo  — "caio o estudante"
 *   2. Apenas o nome  — "caio"  (descarta conteúdo dos parênteses)
 *   3. Apenas apelido — "o estudante" (apenas o conteúdo dentro dos parênteses)
 *
 * Isso garante que "CAIO" dê match com "Caio (O Estudante)" e que
 * "O MAROMBA" dê match com "Charles (O Maromba)".
 *
 * @param {string}       name      — nome da carta (ex: "Caio (O Estudante)")
 * @param {string}       haystack  — texto OCR normalizado
 * @param {boolean}      [nickOnly=false] — se true, compara APENAS o apelido dentro dos
 *   parênteses (ou o nome completo quando não há parênteses). Usado para passageiros,
 *   evitando que o texto de efeito de uma carta mencione o nome de outra.
 * @param {Set<string>}  [stopwords=null] — tokens a ignorar no cálculo de score
 * @returns {number}
 */
function _ocrTokenScore(name, haystack, nickOnly = false, stopwords = null) {
  const nickMatch = (/\(([^)]+)\)/).exec(name);

  if (nickOnly) {
    // Usa apenas o apelido dentro dos parênteses; se não houver, usa o nome completo
    const target = nickMatch ? _ocrNormalize(nickMatch[1]) : _ocrNormalize(name);
    return _scoreTokens(target, haystack, stopwords);
  }

  // 1. Nome completo
  const fullScore = _scoreTokens(_ocrNormalize(name), haystack, stopwords);

  // 2. Nome sem parênteses: "Caio (O Estudante)" → "caio"
  const nameOnly  = _ocrNormalize(name.replaceAll(/\(.*?\)/g, ' '));
  const nameScore = _scoreTokens(nameOnly, haystack, stopwords);

  // 3. Apelido dentro dos parênteses: "Charles (O Maromba)" → "o maromba"
  const nickScore = nickMatch ? _scoreTokens(_ocrNormalize(nickMatch[1]), haystack, stopwords) : 0;

  return Math.max(fullScore, nameScore, nickScore);
}

/**
 * Extrai o primeiro número inteiro encontrado no texto OCR.
 * Usado para identificar a pontuação no ícone de calendário das Rotas Diárias.
 *
 * @param {string} ocrText
 * @returns {number|null}
 */
function extractScoreNumber(ocrText) {
  const m = (/\b(\d+)\b/).exec(ocrText);
  return m ? Number.parseInt(m[1], 10) : null;
}

/**
 * Busca itens no pool cujo campo `pontos` bata exatamente com o número detectado.
 * Retorna candidatos com score base 0.6 (pode ser elevado por correspondência de nome).
 *
 * @param {Array}  pool  — array com campo `pontos: number`
 * @param {number} score — pontuação extraída do OCR (ícone de calendário)
 * @returns {Array<{id:string, nome:string, score:number}>}
 */
function _matchByScore(pool, score) {
  return pool
    .filter(item => item.pontos === score)
    .map(item => ({ id: item.id, nome: item.nome, score: 0.6 }));
}

/**
 * Mescla candidatos extras em byName, elevando o score se o item já existir.
 * @param {Array} byName  — lista mutável de {id, nome, score}
 * @param {Array} extras  — novos candidatos a incorporar
 */
function _mergeExtras(byName, extras) {
  for (const extra of extras) {
    const existing = byName.find(b => b.id === extra.id);
    if (existing) {
      existing.score = Math.max(existing.score, extra.score);
    } else {
      byName.push(extra);
    }
  }
}

/**
 * Tenta identificar cartas de uma zona usando os arrays `bonus` dos itens,
 * complementando a correspondência por nome já realizada pelo token-score base.
 * Aplicável tanto a ROTAS_DIARIAS quanto a PERRENGUES.
 *
 * @param {string} haystack — texto OCR normalizado
 * @param {Array}  pool     — array de itens com campo `bonus: string[]`
 * @returns {Array<{id:string, nome:string, score:number}>}
 */
function _matchByBonusTags(haystack, pool) {
  const results = [];
  for (const item of pool) {
    if (!Array.isArray(item.bonus) || item.bonus.length === 0) continue;
    const matched = item.bonus.filter(tag => haystack.includes(_ocrNormalize(tag)));
    if (matched.length === 0) continue;
    results.push({ id: item.id, nome: item.nome, score: 0.45 * matched.length / item.bonus.length });
  }
  return results;
}

/**
 * Identifica cartas no texto OCR retornado pelo Tesseract para uma zona.
 * O pool de candidatos varia por zona:
 *   melhorias   → IMPROVEMENTS
 *   motorista   → DRIVERS (exceto placeholder vazio)
 *   rota        → ROTAS_DIARIAS  (+ correspondência por tags de bônus)
 *   perrengue   → PERRENGUES     (+ correspondência por tags de bônus)
 *   passageiros → todos os arrays de passageiros
 *
 * @param {string} ocrText  — texto bruto do Tesseract
 * @param {'melhorias'|'motorista'|'rota'|'perrengue'|'passageiros'} zone
 * @param {{ scoreNumber?: number }} [hints] — dados extras vindos do OCR especializado
 * @returns {{ found: Array<{id:string, nome:string, score:number}>, raw: string }}
 */
function matchCardsInZone(ocrText, zone, hints = {}) {
  const safe = (name, fallback) =>
    globalThis[name] === undefined ? fallback : globalThis[name];

  const pools = {
    melhorias:   () => safe('IMPROVEMENTS',   []),
    motorista:   () => safe('DRIVERS',        []).filter(d => d.id !== ''),
    rota:        () => safe('ROTAS_DIARIAS',  []),
    perrengue:   () => safe('PERRENGUES',     []),
    passageiros: () => [
      ...safe('CARD_DB',        []),
      ...safe('COBRADORES',     []),
      ...safe('APAIXONADOS',    []),
      ...safe('ESTOU_NO_BUSAO', []),
      ...safe('LENDAS_URBANAS', []),
      ...safe('GRUPO_PAGODE',   []),
    ],
  };

  const pool     = pools[zone] ? pools[zone]() : [];
  const haystack = _ocrNormalize(ocrText);

  // Threshold por zona — ajustado para equilibrar precisão x recall:
  //   passageiros: 0.70 — frame inteiro com fundo gera muito ruído OCR
  //   melhorias/rota/perrengue: 0.55 — evita matches por palavra única ("via", "busão")
  //   motorista: 0.40 — pool pequeno, nome curto, OCR focado na mira central
  const THRESHOLDS = { passageiros: 0.7, melhorias: 0.55, rota: 0.55, perrengue: 0.55 };
  const THRESHOLD  = THRESHOLDS[zone] ?? 0.4;

  // Passageiros: usa matching de 3 vias (nome completo, só nome, só apelido) com stopwords
  // para excluir tokens genéricos que aparecem nos textos de efeito de outras cartas.
  // Exemplo: "grandao" é citado no efeito de O Maromba ("se 'O Grandão' estiver no Busão"),
  // então bloquear "grandao" evita falso positivo de Fabão — mas Fabão ainda detecta via
  // seu nome real "fabao". O matching NÃO é nickOnly: o score máximo entre as 3 vias
  // garante que qualquer texto visível (nome real OU apelido) identifique a carta.
  const nickOnly  = false;
  const stopwords = zone === 'passageiros' ? _PASSAGEIRO_STOPWORDS : null;

  // Pontuação base: toma o maior entre nome principal e altNome (manchete da carta física)
  const byName = pool.map(item => {
    const scoreNome   = _ocrTokenScore(item.nome, haystack, nickOnly, stopwords);
    const scoreAlt    = item.altNome ? _ocrTokenScore(item.altNome, haystack, nickOnly, stopwords) : 0;
    return { id: item.id, nome: item.nome, score: Math.max(scoreNome, scoreAlt) };
  });

  // Para rota e perrengue: reforça via tags de bônus impressas na carta
  if (zone === 'rota' || zone === 'perrengue') {
    _mergeExtras(byName, _matchByBonusTags(haystack, pool));
  }

  // Para rota: reforça via número de pontuação detectado no ícone de calendário
  if (zone === 'rota' && hints.scoreNumber !== undefined) {
    _mergeExtras(byName, _matchByScore(pool, hints.scoreNumber));
  }

  // Limite de resultados por zona: passageiros ≤ 6 para não cortar cartas reais quando
  // falsos positivos de textos de efeito ocupam posições superiores na lista.
  const MAX_RESULTS = zone === 'passageiros' ? 6 : Infinity;

  const found = byName
    .filter(r => r.score >= THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS);

  return { found, raw: ocrText.trim() };
}

// Expõe constantes como propriedades globais (CameraHandler acessa via globalThis)
globalThis.FOCUS_ZONES         = FOCUS_ZONES;
globalThis.PLAYMAT_COORDINATES = PLAYMAT_COORDINATES;
