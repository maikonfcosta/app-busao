/* ============================
   CameraHandler.js
   Módulo de acesso à câmera.
   Sem dependências externas — opera via getUserMedia.
   Coordenadas de zona lidas de PLAYMAT_COORDINATES (cardDefinitions.js).
============================= */

class CameraHandler {

  /* ============================
     ZONAS DO PLAYMAT
     Referência direta ao PLAYMAT_COORDINATES de cardDefinitions.js,
     que é a fonte de verdade de posições e cores de cada zona.
  ============================= */
  static get ZONES() {
    const fallback = {
      melhorias:   { label: 'Melhorias',   color: '#a855f7', x: 0.02, y: 0.05, w: 0.13, h: 0.88 },
      motorista:   { label: 'Motorista',   color: '#60a5fa', x: 0.17, y: 0.05, w: 0.19, h: 0.88 },
      passageiros: { label: 'Passageiros', color: '#fbbf24', x: 0.38, y: 0.05, w: 0.59, h: 0.88 },
    };
    return typeof PLAYMAT_COORDINATES === 'undefined' ? fallback : PLAYMAT_COORDINATES;
  }

  /** Verdadeiro quando o viewport está em modo paisagem (landscape). */
  static get isLandscape() {
    return globalThis.innerWidth > globalThis.innerHeight;
  }

  /**
   * Retângulo da mira central usado na etapa Motorista.
   * Coordenadas proporcionais (0–1) ao tamanho do overlay/canvas.
   */
  static get _MOTORISTA_MIRA() {
    return Object.freeze({ x: 0.25, y: 0.15, w: 0.5, h: 0.7 });
  }

  /**
   * Etapas do wizard de scan em ordem de captura.
   * • id          — chave salva em wizardGameState
   * • label       — nome exibido na interface
   * • instruction — dica exibida ao usuário
   * Todas as etapas capturam o frame inteiro; o OCR por etapa faz os
   * recortes internos necessários via _cropSubZone.
   */
  static get SCAN_STEPS() {
    return [
      { id: 'rota',        label: 'Rota Diária',  instruction: 'Aponte para a carta de Rota Diária'         },
      { id: 'perrengue',   label: 'Perrengue',    instruction: 'Aponte para a carta de Perrengue'            },
      { id: 'melhorias',   label: 'Melhorias',    instruction: 'Aponte a câmera para a carta de Melhoria'    },
      { id: 'motorista',   label: 'Motorista',    instruction: 'Aponte a câmera para a carta do Motorista'   },
      { id: 'passageiros', label: 'Passageiros',  instruction: 'Aponte a câmera para as cartas de passageiros'},
    ];
  }

  // ── Câmera e elementos DOM ────────────────────────────────────────
  _stream              = null;
  _video               = null;
  _canvas              = null;   // captura (oculto, resolução nativa)
  _ctx2d               = null;
  _overlay             = null;   // overlay de zonas (visível)
  _overlayCtx          = null;
  _resizeObserver      = null;
  _rafId               = null;   // loop de captura de frames
  _orientationHandler  = null;   // listener de resize/orientação no window

  // ── Animação de scan ─────────────────────────────────────────────
  _scanPos        = 0;      // posição 0–1 dentro da altura da zona
  _scanDir        = 1;      // 1 = descendo, -1 = subindo
  _scanActive     = false;
  _scanRafId      = null;
  _scanLastTime   = null;   // timestamp do último frame de animação
  _onFrame        = null;

  // ── Wizard de etapas ─────────────────────────────────────────────
  _wizardActive      = false;
  _stepIndex         = 0;
  _gameState         = {};
  _pendingGameData   = {};     // metadados extras por etapa (pontuação, cor de borda, etc.)
  _overrideSteps     = null;   // etapas filtradas passadas por startWizard(steps)
  _lastCaptureTime   = 0;      // timestamp da última captura OCR (debounce de 1 s)
  _recentlyFound     = new Map(); // cardId → timestamp (deduplicação de 3 s entre leituras)
  _lastConfidence    = 0;      // maior confiança OCR da última captura (0–100)
  _overlayAccent     = '#60a5fa'; // cor do overlay: azul=idle, verde=≥60%, vermelho=<60%
  _stepFuzzyMatches  = [];     // correspondências findClosestCard() acumuladas na etapa atual
  gameConfig         = {};     // { hasImprovements: bool } — passado pelo caller antes do wizard
  onStepChange       = null;   // callback(stepId, partialGameState)
  onWizardDone       = null;   // callback(completeGameState)
  onPreviewCapture   = null;   // callback(dataUrl) — recorte enviado ao OCR
  onDebugPreview     = null;   // callback(enhancedDataUrl) — imagem P&B enviada ao Tesseract

  /* ============================
     INICIALIZAÇÃO
  ============================= */

  /**
   * Solicita acesso à câmera traseira, monta os elementos internos e
   * retorna o elemento <video> pronto para inserção no DOM.
   * Após startCamera(), insira também overlayCanvasElement no mesmo container.
   *
   * @returns {Promise<HTMLVideoElement>}
   * @throws  {CameraError}
   */
  async startCamera() {
    this._buildElements();

    const constraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width:  { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    };

    try {
      this._stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      throw new CameraError(CameraError.reason(err), err);
    }

    this._video.srcObject = this._stream;
    await this._waitForPlay();
    this._syncCapturCanvasSize();
    this._syncOverlaySize();
    this._attachResizeObserver();
    this.startScanAnimation();   // inicia overlay animado imediatamente

    return this._video;
  }

  /* ============================
     OVERLAY (GUIAS VISUAIS + SCAN)
  ============================= */

  /**
   * Redesenha o overlay inteiro: retângulos de zona + linha de scan (se ativa).
   * Chamado a cada frame pela animação e pelo ResizeObserver.
   */
  drawOverlay() {
    const c  = this._overlay;
    const cx = this._overlayCtx;
    if (!c || !cx) return;

    cx.clearRect(0, 0, c.width, c.height);

    if (!CameraHandler.isLandscape) {
      this._drawPortraitWarning(cx, c);
      return;
    }

    if (this._wizardActive && !this.isWizardDone && this.currentStep?.id === 'motorista') {
      // Mira central dedicada à etapa Motorista
      this._drawMotoristaMira(cx, c);
    } else {
      // Guia de enquadramento: cantos no frame inteiro
      this._drawCorners(cx, 0, 0, c.width, c.height, this._overlayAccent);
      if (this._scanActive) {
        this._drawScanLine(cx, 0, 0, c.width, c.height, this._overlayAccent);
      }
    }

    if (this._wizardActive && !this.isWizardDone) {
      this._drawWizardStrip(cx, c);
    }
  }

  /** Desenha o aviso "Gire o celular" em modo portrait. */
  _drawPortraitWarning(cx, c) {
    const fs = Math.max(14, Math.min(c.width * 0.07, 26));
    cx.save();
    cx.fillStyle    = 'rgba(2,6,23,.75)';
    cx.fillRect(0, 0, c.width, c.height);
    cx.font         = `bold ${fs}px Inter, system-ui`;
    cx.textAlign    = 'center';
    cx.textBaseline = 'middle';
    cx.shadowColor  = 'rgba(0,0,0,.8)';
    cx.shadowBlur   = 6;
    cx.fillStyle    = '#fff';
    cx.fillText('⟳ Gire o celular',   c.width / 2, c.height / 2 - fs * 0.8);
    cx.fillText('para a horizontal',  c.width / 2, c.height / 2 + fs * 0.8);
    cx.restore();
  }

  /** Desenha a faixa de progresso do wizard na parte inferior do overlay. */
  _drawWizardStrip(cx, c) {
    const step   = this.activeSteps[this._stepIndex];
    const total  = this.activeSteps.length;
    const stripH = Math.max(28, c.height * 0.07);
    const fs     = Math.max(11, stripH * 0.38);
    const dotR   = Math.max(4, stripH * 0.15);
    const dotGap = dotR * 3;
    const dotsW  = (total - 1) * dotGap + dotR * 2;
    const dotsX  = c.width - dotsW - 12;
    const dotsY  = c.height - stripH / 2;

    cx.save();
    cx.fillStyle    = 'rgba(2,6,23,.88)';
    cx.fillRect(0, c.height - stripH, c.width, stripH);
    cx.font         = `bold ${fs}px Inter, system-ui`;
    cx.textAlign    = 'left';
    cx.textBaseline = 'middle';
    cx.shadowColor  = 'rgba(0,0,0,.8)';
    cx.shadowBlur   = 3;
    cx.fillStyle    = '#e6f1ff';
    cx.fillText(`Escaneie: ${step.label.toUpperCase()}`, 12, c.height - stripH / 2);

    for (let i = 0; i < total; i++) {
      const x = dotsX + i * dotGap + dotR;
      cx.beginPath();
      cx.arc(x, dotsY, dotR, 0, Math.PI * 2);
      if (i < this._stepIndex)        cx.fillStyle = '#22c55e';
      else if (i === this._stepIndex) cx.fillStyle = '#60a5fa';
      else                            cx.fillStyle = '#334155';
      cx.shadowBlur = 0;
      cx.fill();
    }
    cx.restore();
  }

  /** Desenha a linha de scan animada dentro de um retângulo. */
  _drawScanLine(cx, rx, ry, rw, rh, color) {
    const scanY = ry + this._scanPos * rh;
    const grad  = cx.createLinearGradient(rx, scanY - 6, rx, scanY + 6);
    grad.addColorStop(0,   'transparent');
    grad.addColorStop(0.5, color + 'cc');
    grad.addColorStop(1,   'transparent');
    cx.save();
    cx.fillStyle = grad;
    cx.fillRect(rx + 2, scanY - 6, rw - 4, 12);
    cx.restore();
  }

  /* ============================
     ANIMAÇÃO DE SCAN
  ============================= */

  /**
   * Inicia a linha de scan animada — uma faixa que sobe e desce dentro
   * de cada zona a ~0.4 ciclos por segundo.
   */
  startScanAnimation() {
    if (this._scanActive) return;
    this._scanActive   = true;
    this._scanLastTime = null;

    const tick = (now) => {
      if (!this._scanActive) return;

      const dt = this._scanLastTime ? (now - this._scanLastTime) / 1000 : 0;
      this._scanLastTime = now;

      // Velocidade: 0.4 ciclos/s (ida + volta = 2 × 1/0.4 = 5 s por ciclo completo)
      this._scanPos += this._scanDir * dt * 0.4;
      if (this._scanPos >= 1) { this._scanPos = 1; this._scanDir = -1; }
      if (this._scanPos <= 0) { this._scanPos = 0; this._scanDir =  1; }

      this.drawOverlay();
      this._scanRafId = requestAnimationFrame(tick);
    };

    this._scanRafId = requestAnimationFrame(tick);
  }

  /** Para a animação de scan sem encerrar a câmera. */
  stopScanAnimation() {
    this._scanActive = false;
    if (this._scanRafId !== null) {
      cancelAnimationFrame(this._scanRafId);
      this._scanRafId = null;
    }
    this.drawOverlay();   // redesenha estático sem a linha
  }

  /* ============================
     CAPTURA DE FRAME
  ============================= */

  /**
   * Desenha o frame atual do vídeo no canvas de captura (oculto) e
   * retorna o ImageData de resolução nativa.
   *
   * @returns {ImageData|null}
   */
  captureFrame() {
    if (!this._video || !this._ctx2d) {
      throw new Error('CameraHandler: chame startCamera() antes de captureFrame().');
    }
    const { videoWidth: w, videoHeight: h } = this._video;
    if (w === 0 || h === 0) return null;

    this._canvas.width  = w;
    this._canvas.height = h;
    this._ctx2d.drawImage(this._video, 0, 0, w, h);
    return this._ctx2d.getImageData(0, 0, w, h);
  }

  /* ============================
     EXTRAÇÃO DE ZONAS
  ============================= */

  /**
   * Captura o frame atual e recorta cada zona definida em ZONES.
   *
   * @returns {{
   *   melhorias:   ZoneResult,
   *   motorista:   ZoneResult,
   *   passageiros: ZoneResult,
   * }}
   *
   * @typedef {{ imageData: ImageData, dataUrl: string, rect: DOMRect }} ZoneResult
   */
  getZonesData() {
    const frame = this.captureFrame();
    if (!frame) return null;

    const vw = this._canvas.width;
    const vh = this._canvas.height;
    const result = {};

    for (const [key, zone] of Object.entries(CameraHandler.ZONES)) {
      const rx = Math.round(zone.x * vw);
      const ry = Math.round(zone.y * vh);
      const rw = Math.round(zone.w * vw);
      const rh = Math.round(zone.h * vh);

      // Canvas temporário para o recorte
      const tmp    = document.createElement('canvas');
      tmp.width    = rw;
      tmp.height   = rh;
      const tmpCtx = tmp.getContext('2d');

      // Copia região da captura para o canvas da zona
      tmpCtx.drawImage(this._canvas, rx, ry, rw, rh, 0, 0, rw, rh);

      result[key] = {
        imageData: tmpCtx.getImageData(0, 0, rw, rh),
        dataUrl:   tmp.toDataURL('image/jpeg', 0.85),
        rect:      { x: rx, y: ry, w: rw, h: rh },
      };
    }

    return result;
  }

  /* ============================
     LOOP DE FRAMES
  ============================= */

  /**
   * Inicia um loop requestAnimationFrame que chama callback(imageData) a cada frame.
   *
   * @param {function(ImageData): void} callback
   */
  startFrameLoop(callback) {
    this._onFrame = callback;
    const tick = () => {
      const frame = this.captureFrame();
      if (frame) this._onFrame(frame);
      this._rafId = requestAnimationFrame(tick);
    };
    this._rafId = requestAnimationFrame(tick);
  }

  /** Para o loop sem encerrar a câmera. */
  stopFrameLoop() {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  /* ============================
     WIZARD DE ETAPAS
  ============================= */

  /**
   * Inicia (ou reinicia) o wizard de captura passo a passo.
   * @param {Array} [steps]  Subconjunto de SCAN_STEPS a executar; omita para usar todos.
   */
  startWizard(steps = null) {
    this._overrideSteps = steps;
    this._resetWizardState(true);
  }

  /** Interrompe o wizard sem encerrar a câmera. */
  resetWizard() {
    this._overrideSteps = null;
    this._resetWizardState(false);
  }

  _resetWizardState(active) {
    this._wizardActive    = active;
    this._stepIndex       = 0;
    this._gameState       = {};
    this._pendingGameData = {};
    this._recentlyFound   = new Map();
    this._lastConfidence   = 0;
    this._overlayAccent    = '#60a5fa';
    this._stepFuzzyMatches = [];
    this.drawOverlay();
  }

  /**
   * Captura o frame inteiro e processa a etapa atual do wizard via OCR.
   * Aplica debounce de 1 s entre capturas consecutivas.
   * Salva o resultado em wizardGameState mas NÃO avança a etapa automaticamente.
   * Chame advanceStep() após o usuário confirmar o resultado na UI.
   *
   * @param {function(string):void} [onProgress]
   * @param {{ merge?: boolean }} [opts]  Se merge=true, mescla com captura anterior (útil em passageiros/melhorias)
   */
  async captureCurrentStep(onProgress, { merge = false } = {}) {
    if (!this._wizardActive || this.isWizardDone) return { confidence: 0 };

    // ── Debounce de 1 s ──────────────────────────────────────────
    const now = Date.now();
    if (now - this._lastCaptureTime < 1000) {
      throw new Error('Aguarde um momento antes de tentar novamente.');
    }

    // ── Reseta estado da captura ─────────────────────────────────
    this._lastConfidence   = 0;
    this._overlayAccent    = '#60a5fa';
    this._stepFuzzyMatches = [];
    this.drawOverlay();

    if (globalThis.Tesseract === undefined) {
      throw new Error('Tesseract.js não encontrado. Verifique o CDN no index.html.');
    }
    if (globalThis.matchCardsInZone === undefined) {
      throw new Error('matchCardsInZone() não encontrado. Verifique cardDefinitions.js.');
    }

    const step   = this.activeSteps[this._stepIndex];
    const report = (msg) => { if (onProgress) onProgress(msg); };

    // ── Captura frame inteiro ────────────────────────────────────
    const frame = this.captureFrame();
    if (!frame) throw new Error('Nenhum frame disponível.');
    const dataUrl = this._canvas.toDataURL('image/jpeg', 0.85);

    this._lastCaptureTime = now;

    // ── Preview flash (1 s) antes do OCR ───────────────────────
    this.onPreviewCapture?.(dataUrl);

    // ── OCR com processamento específico por etapa ───────────────
    report(`Processando "${step.label}"…`);
    const worker = await Tesseract.createWorker('por', 1, { logger: () => {} });
    try {
      const newResult = await this._runStepOcr(step.id, dataUrl, worker, report);
      this._finaliseStepResult(step.id, newResult, merge);
    } finally {
      await worker.terminate();
    }
    // ── Feedback visual de confiança ─────────────────────────────
    this._overlayAccent = this._lastConfidence >= 60 ? '#22c55e' : '#ef4444';
    this.drawOverlay();

    report('Pronto! Confirme o resultado.');
    // Não avança automaticamente — chame advanceStep() para prosseguir.
    return { confidence: this._lastConfidence };
  }

  /** Maior confiança Tesseract da última captura (0–100). */
  get lastConfidence() { return this._lastConfidence; }

  /**
   * Pós-processamento do resultado OCR de uma etapa:
   * 1. Deduplica contra leituras recentes (janela de 3 s)
   * 2. Enriquece com correspondências fuzzy (findClosestCard)
   * 3. Persiste em _gameState (merge ou substituição)
   */
  _finaliseStepResult(stepId, result, merge) {
    const now = Date.now();
    result.found = this._dedupeFound(result.found, now);
    this._applyFuzzyMatches(result, now, stepId);
    this._commitStepResult(stepId, result, merge);
  }

  /** Filtra `found` removendo cartas vistas nos últimos 3 s. */
  _dedupeFound(found, now) {
    return found.filter(item => {
      const last = this._recentlyFound.get(item.id);
      if (last !== undefined && now - last < 3000) return false;
      this._recentlyFound.set(item.id, now);
      return true;
    });
  }

  /**
   * Tipos de carta aceitos por etapa do wizard.
   * Impede que um passageiro apareça em resultado de melhorias e vice-versa.
   */
  static get _STEP_ALLOWED_TYPES() {
    return Object.freeze({
      motorista:   new Set(['motorista']),
      melhorias:   new Set(['melhoria']),
      passageiros: new Set(['passageiro', 'cobrador']),
      perrengue:   new Set(['perrengue']),
      rota:        new Set(['rota']),
    });
  }

  /**
   * Mescla `_stepFuzzyMatches` em `result.found`, respeitando:
   *   • Tipo de carta esperado para a etapa (evita cross-type)
   *   • Gate de melhoria (gameConfig.hasImprovements)
   *   • Deduplicação por id (não duplica o que matchCardsInZone já achou)
   *   • Janela temporal de 3 s
   */
  _applyFuzzyMatches(result, now, stepId) {
    const allowed = CameraHandler._STEP_ALLOWED_TYPES[stepId] ?? null;
    for (const { card, similarity } of this._stepFuzzyMatches) {
      if (allowed && !allowed.has(card.type)) continue;
      if (card.type === 'melhoria' && !this.gameConfig.hasImprovements) continue;
      if (result.found.some(f => f.id === card.id)) continue;
      const lastSeen = this._recentlyFound.get(card.id);
      if (lastSeen !== undefined && now - lastSeen < 3000) continue;
      this._recentlyFound.set(card.id, now);
      result.found.push({ id: card.id, nome: card.nome, score: similarity });
    }
  }

  /**
   * Tenta identificar o texto OCR via findClosestCard (fuzzy/Levenshtein).
   * Se encontrar correspondência: loga no console e acumula em _stepFuzzyMatches.
   * Não lança erros — é chamado mesmo com textos de baixa qualidade.
   */
  _logFuzzyMatch(text) {
    if (globalThis.findClosestCard === undefined) return;
    const match = findClosestCard(text);
    if (!match) return;
    const pct = Math.round(match.similarity * 100);
    console.log(
      `[OCR] Texto lido: '${text.trim()}' -> Correspondência encontrada: '${match.card.nome}' (Confiança: ${pct}%)`
    );
    this._stepFuzzyMatches.push(match);
  }

  /** Persiste `result` em _gameState: mescla se `merge`, substitui caso contrário. */
  _commitStepResult(stepId, result, merge) {
    if (merge && this._gameState[stepId]?.found) {
      for (const item of result.found) {
        if (!this._gameState[stepId].found.some(e => e.id === item.id)) {
          this._gameState[stepId].found.push(item);
        }
      }
      this._gameState[stepId].raw =
        (this._gameState[stepId].raw + ' ' + result.raw).trim();
    } else {
      this._gameState[stepId] = result;
    }
  }

  /**
   * Avança o wizard para a próxima etapa e dispara onStepChange / onWizardDone.
   * Deve ser invocado pelo UI após o usuário confirmar o resultado da captura.
   */
  advanceStep() {
    if (!this._wizardActive || this.isWizardDone) return;
    const completedStep = this.activeSteps[this._stepIndex];
    this._stepIndex++;   // incrementa antes de notificar para que renderWizardBar() veja o índice correto
    this.drawOverlay();
    if (this.isWizardDone) {
      this.onWizardDone?.({ ...this._gameState });
    } else {
      this.onStepChange?.(completedStep.id, { ...this._gameState });
    }
  }

  // ── Getters do wizard ─────────────────────────────────────────────

  /** Etapa atual (objeto SCAN_STEPS) ou null se concluído. */
  get currentStep() {
    return this.isWizardDone ? null : this.activeSteps[this._stepIndex];
  }

  /** Índice da etapa atual (0-based). */
  get wizardStepIndex() { return this._stepIndex; }

  /** Estado acumulado até o momento. */
  get wizardGameState() { return { ...this._gameState }; }

  /**
   * Filtra os cartões encontrados em uma etapa, mantendo apenas os que passam no predicado.
   * Chamado pela UI após o usuário confirmar/desmarcar checkboxes antes de avançar.
   * @param {string} stepId
   * @param {function({id:string, nome:string, score:number}): boolean} predicate
   */
  filterStepFound(stepId, predicate) {
    if (!this._gameState[stepId]?.found) return;
    this._gameState[stepId] = {
      ...this._gameState[stepId],
      found: this._gameState[stepId].found.filter(predicate),
    };
  }

  /** Metadados extras acumulados por etapa (pontuação detectada, cor de borda, etc.). */
  get pendingGameData() { return { ...this._pendingGameData }; }

  /** Verdadeiro quando todas as etapas foram capturadas. */
  get isWizardDone() {
    return this._stepIndex >= this.activeSteps.length;
  }

  /** Etapas ativas nesta rodada (pode ser subconjunto de SCAN_STEPS). */
  get activeSteps() {
    return this._overrideSteps ?? CameraHandler.SCAN_STEPS;
  }

  /* ============================
     OCR — SCAN DE ZONAS
  ============================= */

  /**
   * Captura o frame atual, executa OCR com Tesseract.js em cada zona do
   * playmat e tenta identificar as cartas presentes via matchCardsInZone().
   *
   * Requer:
   *   • Tesseract.js carregado via CDN (globalThis.Tesseract)
   *   • matchCardsInZone() definido em cardDefinitions.js
   *
   * @param {function(string):void} [onProgress]  callback opcional de progresso
   * @returns {Promise<{
   *   melhorias:   { found: Array<{id:string,nome:string,score:number}>, raw: string },
   *   motorista:   { found: Array<{id:string,nome:string,score:number}>, raw: string },
   *   passageiros: { found: Array<{id:string,nome:string,score:number}>, raw: string },
   * }>}
   */
  async scanZonas(onProgress) {
    if (globalThis.Tesseract === undefined) {
      throw new Error('Tesseract.js não encontrado. Verifique se o CDN está carregado no index.html.');
    }
    if (globalThis.matchCardsInZone === undefined) {
      throw new Error('matchCardsInZone() não encontrado. Verifique se cardDefinitions.js está carregado.');
    }

    const zones = this.getZonesData();
    if (!zones) throw new Error('Nenhum frame disponível. Certifique-se de que a câmera está ativa.');

    const report = (msg) => { if (onProgress) onProgress(msg); };

    report('Inicializando OCR…');
    const worker = await Tesseract.createWorker('por', 1, { logger: () => {} });

    const result = {};
    const keys   = Object.keys(zones);

    for (let i = 0; i < keys.length; i++) {
      const key      = keys[i];
      const zone     = zones[key];
      report(`Pré-processando zona "${key}" (${i + 1}/${keys.length})…`);

      const enhanced = await this._preprocessZone(zone.dataUrl);
      report(`Lendo zona "${key}" (${i + 1}/${keys.length})…`);

      const { data: { text } } = await worker.recognize(enhanced);
      result[key] = matchCardsInZone(text, key);
    }

    await worker.terminate();
    report('Scan concluído.');
    return result;
  }

  /* ============================
     ENCERRAMENTO
  ============================= */

  /** Para a câmera, cancela animação, observers e libera todos os recursos. */
  stopCamera() {
    this.stopScanAnimation();
    this.stopFrameLoop();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._orientationHandler) {
      globalThis.removeEventListener('resize', this._orientationHandler);
      this._orientationHandler = null;
    }
    if (this._stream) {
      this._stream.getTracks().forEach(t => t.stop());
      this._stream = null;
    }
    if (this._video) {
      this._video.srcObject = null;
    }
  }

  /* ============================
     ACESSO AOS ELEMENTOS
  ============================= */

  /** @returns {HTMLVideoElement|null} */
  get videoElement() { return this._video; }

  /**
   * Canvas oculto usado para captura de pixels (resolução nativa).
   * @returns {HTMLCanvasElement|null}
   */
  get canvasElement() { return this._canvas; }

  /**
   * Canvas visível com os guias de zona desenhados.
   * Deve ser inserido no mesmo container do <video>, sobreposto via CSS.
   * @returns {HTMLCanvasElement|null}
   */
  get overlayCanvasElement() { return this._overlay; }

  /* ============================
     OCR POR TIPO DE CARTA
  ============================= */

  /**
   * Despacha o OCR para o método específico de cada etapa do wizard.
   * Cada método usa o worker já criado pelo chamador.
   */
  async _runStepOcr(stepId, dataUrl, worker, report) {
    switch (stepId) {
      case 'rota':      return this._ocrRota(dataUrl, worker, report);
      case 'perrengue': return this._ocrPerrengue(dataUrl, worker, report);
      case 'motorista': return this._ocrNameCard(dataUrl, 'motorista', worker, report);
      case 'melhorias': return this._ocrMelhoriaCard(dataUrl, worker, report);
      default:          return this._ocrPassageiros(dataUrl, worker, report);
    }
  }

  /**
   * OCR para Rota Diária: recorta a zona de foco (carta centralizada) como fonte
   * principal — evita ruído de fundo que confunde rotas de nome curto.
   * Adicionalmente:
   *  • Lê a sub-zona do título (relativa ao crop já feito) para matching mais preciso
   *  • Extrai o número de pontuação do ícone de calendário
   */
  async _ocrRota(dataUrl, worker, report) {
    const fz      = globalThis.FOCUS_ZONES?.rota ?? null;
    const cardUrl = fz ? await this._cropSubZone(dataUrl, fz) : dataUrl;

    report('Lendo texto da Rota Diária…');
    const cardText  = await this._runOcrRelaxed(worker, cardUrl);
    let scoreNumber = globalThis.extractScoreNumber === undefined
      ? null : extractScoreNumber(cardText);

    if (fz?.subZones?.score) {
      scoreNumber = await this._readRotaScore(cardUrl, fz.subZones.score, scoreNumber, worker, report);
    }
    this._pendingGameData.rota = { scoreNumber };

    const cardResult = globalThis.matchCardsInZone === undefined
      ? { found: [], raw: cardText }
      : matchCardsInZone(cardText, 'rota', { scoreNumber });

    if (fz?.subZones?.title) {
      await this._mergeSubZoneOcr(cardUrl, fz.subZones.title, cardResult, worker, report, { zone: 'rota', hints: { scoreNumber }, msg: 'Lendo título da Rota…' });
    }
    return cardResult;
  }

  /** Lê a pontuação do calendário da Rota num sub-recorte dedicado. */
  async _readRotaScore(cardUrl, subZone, fallback, worker, report) {
    report('Lendo pontuação do calendário…');
    const crop = await this._cropSubZone(cardUrl, subZone);
    try {
      const text     = await this._runOcr(worker, crop);
      const detected = globalThis.extractScoreNumber === undefined
        ? null : extractScoreNumber(text);
      return detected === null ? fallback : detected;
    } catch { return fallback; }
  }

  /**
   * OCR para Perrengue: recorta a zona de foco como fonte principal.
   * Adicionalmente:
   *  • Extrai o modificador "+N" do sub-zone de header (para GameLogic)
   *  • Lê a sub-zona do título em negrito para reforçar o matching pelo nome
   */
  async _ocrPerrengue(dataUrl, worker, report) {
    const fz      = globalThis.FOCUS_ZONES?.perrengue ?? null;
    const cardUrl = fz ? await this._cropSubZone(dataUrl, fz) : dataUrl;

    report('Lendo texto do Perrengue…');
    const cardText   = await this._runOcrRelaxed(worker, cardUrl);
    const cardResult = globalThis.matchCardsInZone === undefined
      ? { found: [], raw: cardText }
      : matchCardsInZone(cardText, 'perrengue');

    this._pendingGameData.perrengue = {
      modifier: await this._readPerrengueModifier(cardUrl, fz?.subZones?.header, cardText, worker, report),
    };

    if (fz?.subZones?.title) {
      await this._mergeSubZoneOcr(cardUrl, fz.subZones.title, cardResult, worker, report, { zone: 'perrengue', msg: 'Lendo título do Perrengue…' });
    }
    return cardResult;
  }

  /** Lê o modificador numérico do cabeçalho da carta de Perrengue. */
  async _readPerrengueModifier(cardUrl, headerSubZone, fallbackText, worker, report) {
    let headerText = fallbackText;
    if (headerSubZone) {
      report('Lendo modificador do Perrengue…');
      const crop = await this._cropSubZone(cardUrl, headerSubZone);
      try { headerText = await this._runOcr(worker, crop); } catch { /* usa raw */ }
    }
    const m = (/[+-]?\d+/).exec(headerText);
    return m ? m[0] : null;
  }

  /**
   * OCR para Motorista ou Melhoria: lê a borda para detectar a cor
   * (azul = motorista, roxo = melhoria) como validação, depois faz OCR do nome.
   */
  async _ocrNameCard(dataUrl, zoneId, worker, report) {
    // Para Motorista, recorta apenas a região da mira central onde o usuário
    // centraliza a carta; isso remove ruído das bordas do frame.
    const targetUrl = zoneId === 'motorista'
      ? await this._cropSubZone(dataUrl, CameraHandler._MOTORISTA_MIRA)
      : dataUrl;

    report(`Detectando cor da borda (${zoneId})…`);
    const borderColor = await this._sampleBorderColor(targetUrl);
    this._pendingGameData[zoneId] = { borderColor };

    // Alerta se a cor detectada não bate com a zona esperada
    const expectedColor = zoneId === 'motorista' ? 'blue' : 'purple';
    if (borderColor !== 'unknown' && borderColor !== expectedColor) {
      report(`Aviso: cor detectada (${borderColor}) não corresponde a ${zoneId}.`);
    }

    report(`Lendo nome do ${zoneId}…`);
    const text = await this._runOcr(worker, targetUrl);
    return globalThis.matchCardsInZone === undefined
      ? { found: [], raw: text }
      : matchCardsInZone(text, zoneId);
  }

  /** OCR para Passageiros: divide o frame em 4 quadrantes e mescla os resultados. */
  async _ocrPassageiros(dataUrl, worker, report) {
    report('Escaneando passageiros (4 quadrantes)…');
    return this._slidingWindowOcr(dataUrl, worker, 'passageiros', report);
  }

  /**
   * OCR para Melhoria: recorta a zona de foco — evita ruído de fundo que causa
   * falsos positivos em cartas de nome curto (ex: "Cortinas" — 1 único token).
   * Adicionalmente lê a sub-zona de nome (topo da carta) para maior precisão.
   */
  async _ocrMelhoriaCard(dataUrl, worker, report) {
    report('Detectando borda da Melhoria…');
    const borderColor = await this._sampleBorderColor(dataUrl);
    this._pendingGameData.melhorias = { borderColor };
    if (borderColor !== 'unknown' && borderColor !== 'purple') {
      report(`Aviso: borda detectada (${borderColor}) — verifique se é uma carta de Melhoria.`);
    }

    const fz      = globalThis.FOCUS_ZONES?.melhorias ?? null;
    const cardUrl = fz ? await this._cropSubZone(dataUrl, fz) : dataUrl;

    report('Lendo texto da Melhoria…');
    const cardText   = await this._runOcrRelaxed(worker, cardUrl);
    const cardResult = globalThis.matchCardsInZone === undefined
      ? { found: [], raw: cardText }
      : matchCardsInZone(cardText, 'melhorias');

    // subZones são relativas ao cardUrl já recortado
    if (fz?.subZones?.name) {
      await this._mergeSubZoneOcr(cardUrl, fz.subZones.name, cardResult, worker, report, { zone: 'melhorias', msg: 'Lendo nome da Melhoria…' });
    }
    return cardResult;
  }

  /**
   * Recorta um sub-zone de `cardUrl`, executa OCR relaxado e mescla novos itens em `result`.
   * Silencia erros — falhas no sub-recorte nunca interrompem o fluxo principal.
   * @param {string}   cardUrl     — dataUrl já recortado ao zone principal
   * @param {object}   subZone     — coordenadas relativas a cardUrl (x,y,w,h em 0-1)
   * @param {object}   result      — resultado a ser enriquecido ({ found, raw })
   * @param {*}        worker      — worker Tesseract
   * @param {function} report
   * @param {object}   opts        — { zone, hints, msg }
   * @param {string}   opts.zone   — zona para matchCardsInZone
   * @param {object}   opts.hints  — hints extras (ex: { scoreNumber })
   * @param {string}   opts.msg    — mensagem de status
   */
  async _mergeSubZoneOcr(cardUrl, subZone, result, worker, report, { zone, hints = {}, msg }) {
    report(msg);
    const crop = await this._cropSubZone(cardUrl, subZone);
    try {
      const text = await this._runOcrRelaxed(worker, crop);
      if (globalThis.matchCardsInZone === undefined) return;
      for (const item of matchCardsInZone(text, zone, hints).found) {
        if (!result.found.some(f => f.id === item.id)) result.found.push(item);
      }
    } catch { /* ignora erros de OCR no sub-recorte */ }
  }

  /* ============================
     OCR — AUXILIARES PRIVADOS
  ============================= */

  /**
   * Divide um dataUrl em 4 quadrantes (2×2), executa OCR em cada um e
   * mescla os resultados. Cada quadrante usa OCR relaxado (sem limite de
   * confiança) para maximizar a cobertura em frames parciais.
   *
   * @param {string} dataUrl
   * @param {*}      worker   — worker Tesseract já inicializado
   * @param {string} zone     — zona para matchCardsInZone
   * @param {function(string):void} report
   */
  async _slidingWindowOcr(dataUrl, worker, zone, report) {
    // Quadrantes com 20% de sobreposição vertical para evitar que banners de nome
    // próximos a y≈50% (ex: "O CLAUSTROFÓBICO") sejam cortados ao meio — o que
    // quebraria palavras longas em fragmentos que não passam pelo matching.
    const quadrants = [
      { x: 0,   y: 0,   w: 0.5, h: 0.6 },   // Q1 topo-esquerda  (y: 0–60%)
      { x: 0.5, y: 0,   w: 0.5, h: 0.6 },   // Q2 topo-direita   (y: 0–60%)
      { x: 0,   y: 0.4, w: 0.5, h: 0.6 },   // Q3 base-esquerda  (y: 40–100%)
      { x: 0.5, y: 0.4, w: 0.5, h: 0.6 },   // Q4 base-direita   (y: 40–100%)
    ];

    let combinedText = '';
    const allFound   = [];

    for (let i = 0; i < quadrants.length; i++) {
      report(`Quadrante ${i + 1}/4…`);
      const crop = await this._cropSubZone(dataUrl, quadrants[i]);
      const text = await this._runOcrRelaxed(worker, crop);
      combinedText += ' ' + text;

      if (globalThis.matchCardsInZone !== undefined) {
        const partial = matchCardsInZone(text, zone);
        for (const item of partial.found) {
          if (!allFound.some(f => f.id === item.id)) allFound.push(item);
        }
      }
    }

    return { found: allFound, raw: combinedText.trim() };
  }

  /**
   * Como _runOcr, mas sem limite de confiança — usado nos quadrantes do
   * sliding window, onde frames parciais podem ter confiança naturalmente baixa.
   * Ainda rastreia a confiança máxima e dispara onDebugPreview.
   */
  async _runOcrRelaxed(worker, dataUrl) {
    const enhanced = await this._preprocessZone(dataUrl);
    this.onDebugPreview?.(enhanced);
    const { data: { text, confidence } } = await worker.recognize(enhanced);
    this._lastConfidence = Math.max(this._lastConfidence, confidence);
    this._logFuzzyMatch(text);
    return text;
  }

  /**
   * Pré-processa e reconhece texto de um dataUrl usando um worker existente.
   * Lança erro apenas se a confiança for < 20% (sinal completamente inútil).
   * Confiança entre 20–59% aceita resultado mas o overlay ficará vermelho.
   */
  async _runOcr(worker, dataUrl) {
    const enhanced = await this._preprocessZone(dataUrl);
    this.onDebugPreview?.(enhanced);
    const { data: { text, confidence } } = await worker.recognize(enhanced);
    this._lastConfidence = Math.max(this._lastConfidence, confidence);
    this._logFuzzyMatch(text);
    if (confidence < 20) {
      throw new Error(`OCR sem sinal (${Math.round(confidence)}%). Melhore a iluminação ou reenquadre a carta.`);
    }
    return text;
  }

  /**
   * Recorta uma sub-região de um dataUrl.
   * Coordenadas em proporções relativas (0–1) ao tamanho da imagem fonte.
   */
  _cropSubZone(dataUrl, sub) {
    return new Promise((resolve) => {
      const img    = new Image();
      img.onload   = () => {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const tmp = document.createElement('canvas');
        tmp.width  = Math.round(sub.w * iw);
        tmp.height = Math.round(sub.h * ih);
        tmp.getContext('2d').drawImage(
          img,
          Math.round(sub.x * iw), Math.round(sub.y * ih),
          tmp.width, tmp.height,
          0, 0, tmp.width, tmp.height
        );
        resolve(tmp.toDataURL('image/jpeg', 0.92));
      };
      img.src = dataUrl;
    });
  }

  /**
   * Amostra pixels na borda esquerda de um dataUrl para detectar a cor dominante.
   * Retorna 'blue' (motorista) | 'purple' (melhoria) | 'unknown'.
   *
   * Referência de cores do jogo:
   *   Motorista:  #60a5fa → r≈96,  g≈165, b≈250
   *   Melhoria:   #a855f7 → r≈168, g≈85,  b≈247
   */
  _sampleBorderColor(dataUrl) {
    return new Promise((resolve) => {
      const img    = new Image();
      img.onload   = () => {
        const w = img.naturalWidth, h = img.naturalHeight;
        const tmp = document.createElement('canvas');
        tmp.width = w; tmp.height = h;
        const ctx = tmp.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Faixa de amostragem: borda esquerda, centro vertical
        const x      = Math.round(w * 0.03);
        const yMin   = Math.round(h * 0.35);
        const yMax   = Math.round(h * 0.65);
        const pixels = ctx.getImageData(0, 0, w, h).data;  // bulk — uma só chamada
        let rS = 0, gS = 0, bS = 0, n = 0;
        for (let y = yMin; y <= yMax; y += 4) {
          const i = (y * w + x) * 4;
          rS += pixels[i]; gS += pixels[i + 1]; bS += pixels[i + 2]; n++;
        }
        const r = rS / n, g = gS / n, b = bS / n;

        // blue: b dominante, g moderado, r baixo
        // purple: b+r dominantes, g baixo
        const isBlue   = b > 180 && g > 100 && r < 130;
        const isPurple = b > 150 && r > 120 && g < 110;
        let borderColor = 'unknown';
        if (isBlue)   borderColor = 'blue';
        else if (isPurple) borderColor = 'purple';
        resolve(borderColor);
      };
      img.src = dataUrl;
    });
  }

  /* ============================
     PRIVADOS
  ============================= */

  _buildElements() {
    // <video> — preview ao vivo
    this._video             = document.createElement('video');
    this._video.autoplay    = true;
    this._video.playsInline = true;
    this._video.muted       = true;
    this._video.setAttribute('playsinline', '');
    this._video.className   = 'camera-preview';

    // <canvas> oculto — captura/processamento (resolução nativa do vídeo)
    this._canvas                = document.createElement('canvas');
    this._canvas.style.display  = 'none';
    this._canvas.setAttribute('aria-hidden', 'true');
    this._ctx2d                 = this._canvas.getContext('2d');

    // <canvas> visível — guias de zona (sobreposto ao vídeo via CSS)
    this._overlay               = document.createElement('canvas');
    this._overlay.className     = 'camera-overlay';
    this._overlay.setAttribute('aria-hidden', 'true');
    this._overlayCtx            = this._overlay.getContext('2d');
  }

  _syncCapturCanvasSize() {
    this._canvas.width  = this._video.videoWidth  || 1280;
    this._canvas.height = this._video.videoHeight || 720;
  }

  _syncOverlaySize() {
    // Usa as dimensões CSS do <video> (tamanho exibido, não nativo)
    const w = this._video.clientWidth  || this._video.videoWidth  || 1280;
    const h = this._video.clientHeight || this._video.videoHeight || 720;
    this._overlay.width  = w;
    this._overlay.height = h;
  }

  _attachResizeObserver() {
    if (globalThis.ResizeObserver) {
      this._resizeObserver = new ResizeObserver(() => {
        this._syncOverlaySize();
        this.drawOverlay();
      });
      this._resizeObserver.observe(this._video);
    }

    // Escuta rotação do dispositivo para redesenhar o aviso de orientação
    this._orientationHandler = () => {
      this._syncOverlaySize();
      this.drawOverlay();
    };
    globalThis.addEventListener('resize', this._orientationHandler);
  }

  _waitForPlay() {
    return new Promise((resolve, reject) => {
      if (this._video.readyState >= 2) { resolve(); return; }
      this._video.addEventListener('canplay', resolve, { once: true });
      this._video.addEventListener('error',   reject,  { once: true });
    });
  }

  /**
   * Aplica grayscale 100% + contraste 200% ao dataUrl para melhorar
   * a legibilidade do OCR em condições de iluminação variada.
   */
  _preprocessZone(dataUrl) {
    return new Promise((resolve) => {
      const img  = new Image();
      img.onload = () => {
        const w   = img.naturalWidth;
        const h   = img.naturalHeight;
        const tmp = document.createElement('canvas');
        tmp.width  = w;
        tmp.height = h;
        const ctx = tmp.getContext('2d');
        // 1. Grayscale + 20% contrast boost
        ctx.filter = 'grayscale(1) contrast(1.2)';
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
        // 2. Threshold binarization — each pixel becomes pure black or white
        const imageData = ctx.getImageData(0, 0, w, h);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = d[i] > 128 ? 255 : 0;
          d[i] = d[i + 1] = d[i + 2] = v;
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(tmp.toDataURL('image/png'));
      };
      img.src = dataUrl;
    });
  }

  /**
   * Desenha a mira central para a etapa Motorista:
   *  • Escurece as áreas fora da mira (vinheta)
   *  • Borda tracejada azul com cantos destacados
   *  • Linha de scan animada dentro da mira
   *  • Label "MOTORISTA" acima
   */
  _drawMotoristaMira(cx, c) {
    const m  = CameraHandler._MOTORISTA_MIRA;
    const mx = Math.round(c.width  * m.x);
    const my = Math.round(c.height * m.y);
    const mw = Math.round(c.width  * m.w);
    const mh = Math.round(c.height * m.h);

    // Vinheta: escurece o que fica fora da mira
    cx.save();
    cx.fillStyle = 'rgba(0,0,0,0.52)';
    cx.fillRect(0,        0,         c.width, my);              // topo
    cx.fillRect(0,        my,        mx,      mh);              // esquerda
    cx.fillRect(mx + mw,  my,        c.width - mx - mw, mh);   // direita
    cx.fillRect(0,        my + mh,   c.width, c.height - my - mh); // base
    cx.restore();

    // Borda tracejada — cor reflete confiança (azul=idle, verde=≥60%, vermelho=<60%)
    cx.save();
    cx.strokeStyle = this._overlayAccent;
    cx.lineWidth   = 1.5;
    cx.setLineDash([8, 4]);
    cx.strokeRect(mx, my, mw, mh);
    cx.setLineDash([]);
    cx.restore();

    // Cantos sólidos dentro da mira
    this._drawCorners(cx, mx, my, mw, mh, this._overlayAccent);

    // Linha de scan dentro da mira
    if (this._scanActive) {
      this._drawScanLine(cx, mx, my, mw, mh, this._overlayAccent);
    }

    // Label acima da mira — cor acompanha o acento
    const fs = Math.max(11, Math.min(c.width * 0.022, 16));
    cx.save();
    cx.font         = `bold ${fs}px Inter, system-ui`;
    cx.textAlign    = 'center';
    cx.textBaseline = 'bottom';
    cx.fillStyle    = this._overlayAccent;
    cx.shadowColor  = 'rgba(0,0,0,0.9)';
    cx.shadowBlur   = 5;
    cx.fillText('MOTORISTA — centralize a carta', mx + mw / 2, my - 5);
    cx.restore();
  }

  /**
   * Desenha marcadores de canto sólidos nos quatro vértices de um retângulo.
   */
  _drawCorners(ctx, x, y, w, h, color) {
    const arm = Math.min(w, h) * 0.12;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth   = 3;
    ctx.setLineDash([]);
    const corners = [
      [x,     y,     arm,  0,    0,   arm],   // top-left
      [x + w, y,    -arm,  0,    0,   arm],   // top-right
      [x,     y + h, arm,  0,    0,  -arm],   // bottom-left
      [x + w, y + h,-arm,  0,    0,  -arm],   // bottom-right
    ];
    for (const [ox, oy, hx, hy, vx, vy] of corners) {
      ctx.beginPath();
      ctx.moveTo(ox + hx, oy + hy);
      ctx.lineTo(ox, oy);
      ctx.lineTo(ox + vx, oy + vy);
      ctx.stroke();
    }
    ctx.restore();
  }
}

/* ============================
   ERRO TIPADO
============================= */

class CameraError extends Error {
  constructor(reason, cause) {
    super(reason);
    this.name  = 'CameraError';
    this.cause = cause || null;
  }

  static reason(err) {
    if (!err) return 'Erro desconhecido ao acessar a câmera.';
    const map = {
      NotAllowedError:       'Permissão de câmera negada. Libere o acesso nas configurações do navegador.',
      PermissionDeniedError: 'Permissão de câmera negada. Libere o acesso nas configurações do navegador.',
      NotFoundError:         'Nenhuma câmera encontrada neste dispositivo.',
      NotReadableError:      'A câmera já está em uso por outro aplicativo.',
      OverconstrainedError:  'As configurações de câmera solicitadas não são suportadas.',
      AbortError:            'Acesso à câmera cancelado.',
    };
    return map[err.name] || `Erro ao acessar a câmera: ${err.message}`;
  }
}
