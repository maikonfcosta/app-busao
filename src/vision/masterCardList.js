/* ============================
   masterCardList.js
   Array único com TODAS as cartas do jogo, enriquecidas com `type`.

   Depende de: js/script.js (deve ser carregado antes deste arquivo).
   Expõe: globalThis.ALL_AVAILABLE_CARDS
============================= */

/* eslint-disable no-undef */

/**
 * Todas as cartas disponíveis no jogo, incluindo expansões.
 *
 * Tipos usados:
 *   'motorista'  — cartas de motorista            (DRIVERS)
 *   'melhoria'   — melhorias do ônibus             (IMPROVEMENTS)
 *   'perrengue'  — eventos de perrengue            (PERRENGUES)
 *   'rota'       — rotas diárias                   (ROTAS_DIARIAS)
 *   'passageiro' — passageiros base e expansões    (CARD_DB, APAIXONADOS,
 *                                                   ESTOU_NO_BUSAO, LENDAS_URBANAS,
 *                                                   GRUPO_PAGODE)
 *   'cobrador'   — cobradores (expansão)           (COBRADORES)
 *
 * @type {Array<Object>}
 */
const ALL_AVAILABLE_CARDS = [
  // ── Motoristas ───────────────────────────────────────────────────────────
  // Filtra o placeholder vazio que existe no início de DRIVERS
  ...DRIVERS.filter(d => d.id !== '').map(c => ({ ...c, type: 'motorista' })),

  // ── Melhorias ────────────────────────────────────────────────────────────
  ...IMPROVEMENTS.map(c => ({ ...c, type: 'melhoria' })),

  // ── Expansão: Perrengues ─────────────────────────────────────────────────
  ...PERRENGUES.map(c => ({ ...c, type: 'perrengue' })),

  // ── Expansão: Rotas Diárias ──────────────────────────────────────────────
  ...ROTAS_DIARIAS.map(c => ({ ...c, type: 'rota' })),

  // ── Passageiros base ─────────────────────────────────────────────────────
  ...CARD_DB.map(c => ({ ...c, type: 'passageiro' })),

  // ── Expansão: Cobradores ─────────────────────────────────────────────────
  ...COBRADORES.map(c => ({ ...c, type: 'cobrador' })),

  // ── Expansão: Os Apaixonados ─────────────────────────────────────────────
  ...APAIXONADOS.map(c => ({ ...c, type: 'passageiro' })),

  // ── Expansão: Estou no Busão ─────────────────────────────────────────────
  ...ESTOU_NO_BUSAO.map(c => ({ ...c, type: 'passageiro' })),

  // ── Expansão: Lendas Urbanas ─────────────────────────────────────────────
  ...LENDAS_URBANAS.map(c => ({ ...c, type: 'passageiro' })),

  // ── Expansão: Grupo de Pagode ────────────────────────────────────────────
  ...GRUPO_PAGODE.map(c => ({ ...c, type: 'passageiro' })),
];

globalThis.ALL_AVAILABLE_CARDS = ALL_AVAILABLE_CARDS;
