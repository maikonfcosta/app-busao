/* ============================
   src/utils/stringMatcher.js
   Utilitários de correspondência fuzzy para OCR de cartas.

   Depende de: src/vision/masterCardList.js (ALL_AVAILABLE_CARDS global).
   Expõe: levenshteinDistance, findClosestCard
============================= */

/**
 * Normaliza uma string para comparação OCR mantendo o conteúdo dos parênteses:
 *   "Caio (O Estudante)" → "caio o estudante"
 *
 * @param {string} s
 * @returns {string}
 */
function _normalizeForMatch(s) {
  return s
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')  // remove diacríticos
    .replaceAll(/[()[\]]/g, ' ')         // remove os caracteres de parênteses (mantém conteúdo)
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s]/g, ' ')     // remove pontuação restante
    .replaceAll(/\s+/g, ' ')
    .trim();
}

/**
 * Normaliza uma string descartando o conteúdo entre parênteses:
 *   "Caio (O Estudante)" → "caio"
 *
 * Usado como forma alternativa de comparação para que textos curtos como
 * "CAIO" dêem match com "Caio (O Estudante)" sem penalidade pelo apelido.
 *
 * @param {string} s
 * @returns {string}
 */
function _normalizeNameOnly(s) {
  return s
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')  // remove diacríticos
    .replaceAll(/\(.*?\)/g, ' ')         // remove parênteses E seu conteúdo
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s]/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

/**
 * Extrai e normaliza APENAS o conteúdo dentro dos parênteses (o apelido):
 *   "Charles (O Maromba)" → "o maromba"
 *   "Caio" → ""  (sem parênteses)
 *
 * Permite que "O MAROMBA" dê match com "Charles (O Maromba)".
 *
 * @param {string} s
 * @returns {string}
 */
function _normalizeNicknameOnly(s) {
  const match = (/\(([^)]+)\)/).exec(s);
  if (!match) return '';
  return match[1]
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s]/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

/**
 * Calcula a distância de edição (Levenshtein) entre duas strings.
 *
 * Complexidade: O(|a| × |b|) em tempo, O(|b|) em memória
 * (duas linhas com swap de referência).
 *
 * @param {string} a
 * @param {string} b
 * @returns {number} Número mínimo de inserções, deleções ou substituições
 */
function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,          // inserção
        prev[j]     + 1,          // deleção
        prev[j - 1] + cost        // substituição
      );
    }
    [prev, curr] = [curr, prev];  // troca de referência — O(1)
  }

  return prev[b.length];
}

/**
 * Similaridade (0–1) entre duas strings via Levenshtein.
 * Retorna 0 se ambas forem vazias.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function _similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 0;
  return 1 - levenshteinDistance(a, b) / maxLen;
}

/**
 * Melhor similaridade entre `target` e qualquer janela deslizante de
 * `targetWordCount` palavras consecutivas extraídas de `queryWords`.
 *
 * Isso resolve o problema do OCR retornar um frame inteiro (ex: 40 palavras)
 * enquanto o nome da carta tem apenas 2–4 palavras: a janela encontra a
 * subsequência do texto que mais se aproxima do nome buscado.
 *
 * Exemplos:
 *   query = "caio o estudante ponto por cada silencioso adjacente"
 *   target = "caio o estudante"  →  janela [0..2] → similaridade 1.0
 *
 *   query = "caio"
 *   target = "caio o estudante"  →  query menor que target → comparação direta
 *
 * @param {string[]} queryWords   — palavras do texto OCR normalizado
 * @param {string}   target       — forma normalizada do nome da carta
 * @returns {number}
 */
function _windowSimilarity(queryWords, target) {
  if (!target) return 0;
  const targetWords = target.split(' ').filter(Boolean);
  const windowSize  = targetWords.length;
  if (windowSize === 0) return 0;

  const targetStr = targetWords.join(' ');

  // Se o texto OCR é mais curto ou igual ao nome da carta, comparação direta
  if (queryWords.length <= windowSize) {
    return _similarity(queryWords.join(' '), targetStr);
  }

  // Desliza uma janela de `windowSize` palavras pelo texto OCR
  let best = 0;
  for (let i = 0; i <= queryWords.length - windowSize; i++) {
    const window = queryWords.slice(i, i + windowSize).join(' ');
    const sim = _similarity(window, targetStr);
    if (sim > best) best = sim;
    // Atalho: similaridade perfeita, não precisa continuar
    if (best === 1) break;
  }
  return best;
}

/**
 * Compara o texto OCR com o nome de todas as cartas em ALL_AVAILABLE_CARDS
 * e retorna a carta com maior semelhança, desde que esta seja > 60%.
 *
 * Estratégia de comparação por carta (toma o maior dos três scores):
 *   1. Janela deslizante sobre a forma completa — "caio o estudante"
 *   2. Janela deslizante sobre apenas o nome    — "caio"
 *
 * A janela deslizante é essencial quando o OCR captura um frame inteiro:
 * procura a subsequência de palavras do texto que melhor combina com o nome.
 *
 * @param {string} scannedText  — texto bruto retornado pelo Tesseract
 * @returns {{ card: Object, similarity: number } | null}
 *   Retorna null se nenhuma carta atingir semelhança > 60%, ou se
 *   ALL_AVAILABLE_CARDS ainda não estiver carregado.
 */
function findClosestCard(scannedText) {
  if (!scannedText || typeof ALL_AVAILABLE_CARDS === 'undefined') {
    return null;
  }

  const query = _normalizeForMatch(scannedText);
  if (query.length === 0) return null;

  const queryWords = query.split(' ').filter(Boolean);

  let bestCard       = null;
  let bestSimilarity = 0;

  for (const card of ALL_AVAILABLE_CARDS) {
    const simFull  = _windowSimilarity(queryWords, _normalizeForMatch(card.nome));
    const simShort = _windowSimilarity(queryWords, _normalizeNameOnly(card.nome));
    const simNick  = _windowSimilarity(queryWords, _normalizeNicknameOnly(card.nome));
    const similarity = Math.max(simFull, simShort, simNick);

    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestCard       = card;
    }
  }

  return bestSimilarity > 0.6
    ? { card: bestCard, similarity: bestSimilarity }
    : null;
}
