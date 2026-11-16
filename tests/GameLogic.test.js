const GameLogic = require('../js/GameLogic');

describe('GameLogic', () => {
  it('should calculate empty bus correctly', () => {
    const logic = new GameLogic();
    const result = logic.calculate([], 0);
    
    expect(result.total).toBe(0);
    expect(result.breakdown.passengers.score).toBe(0);
    expect(result.breakdown.driver.score).toBe(0);
    expect(result.breakdown.improvements.score).toBe(0);
  });

  it('should calculate penalty for hand cards without Isabel', () => {
    const logic = new GameLogic();
    const result = logic.calculate([], 2); // 2 cards in hand
    
    expect(result.total).toBe(-2);
    expect(result.breakdown.hand.score).toBe(-2);
  });

  it('should eliminate hand penalty when Isabel is active', () => {
    const logic = new GameLogic();
    const tableCards = [
      { row: 0, col: 0, card: { id: 'isabel', nome: 'Isabel', base: 0, faixa: 'Adulto', temper: 'Tranquilo', comp: 'Silencioso', impacto: 'final' } }
    ];
    const result = logic.calculate(tableCards, 3);
    expect(result.breakdown.hand.score).toBe(0);
    expect(result.total).toBe(0);
  });
  
  it('should calculate driver bonus correctly', () => {
    const mockDriver = { id: 'test_driver', nome: 'Test Driver', bonus: ['Jovem'] };
    const logic = new GameLogic({ driver: mockDriver });
    
    const tableCards = [
      { row: 0, col: 0, card: { id: 'p1', nome: 'Jovem 1', base: 2, faixa: 'Jovem', temper: 'Tranquilo', comp: 'Silencioso', impacto: 'final' } },
      { row: 0, col: 1, card: { id: 'p2', nome: 'Adulto 1', base: 3, faixa: 'Adulto', temper: 'Tranquilo', comp: 'Silencioso', impacto: 'final' } }
    ];
    
    const result = logic.calculate(tableCards, 0);
    
    // Total: 2 (p1) + 3 (p2) = 5 + 1 driver bonus = 6
    expect(result.total).toBe(6);
    expect(result.breakdown.driver.score).toBe(1);
    expect(result.breakdown.passengers.score).toBe(5);
  });

  describe('Cycle detection in isActiveAt (Achado #1)', () => {
    it('should not throw Maximum Call Stack Size Exceeded when mutually requiring cards are evaluated', () => {
      const logic = new GameLogic();
      const cardA = {
        id: 'cycler_a',
        nome: 'Cycler A',
        base: 2,
        impacto: 'final',
        require: (ctx) => {
          const posB = ctx.grid[0][1];
          return { ok: posB.card ? ctx.isActiveAt({ row: 0, col: 1 }) : false };
        }
      };
      const cardB = {
        id: 'cycler_b',
        nome: 'Cycler B',
        base: 2,
        impacto: 'final',
        require: (ctx) => {
          const posA = ctx.grid[0][0];
          return { ok: posA.card ? ctx.isActiveAt({ row: 0, col: 0 }) : false };
        }
      };

      const tableCards = [
        { row: 0, col: 0, card: cardA },
        { row: 0, col: 1, card: cardB }
      ];

      expect(() => {
        const result = logic.calculate(tableCards, 0);
        expect(result).toBeDefined();
        // Ambas ficam inativas pois ciclo retorna falso
        expect(result.breakdown.passengers.score).toBe(0);
      }).not.toThrow();
    });
  });

  describe('Expansão Grupo de Pagode (Achados #4 e #11)', () => {
    it('should grant +50 bonus only when all 5 distinct pagode members are present and expansion is active', () => {
      const pagodeMembers = [
        { id: 'dudu', nome: 'Dudu', base: 1, impacto: 'final' },
        { id: 'zeca', nome: 'Zeca', base: 1, impacto: 'final' },
        { id: 'thiago', nome: 'Thiago', base: 1, impacto: 'final' },
        { id: 'arlindo', nome: 'Arlindo', base: 1, impacto: 'final' },
        { id: 'xande', nome: 'Xande', base: 1, impacto: 'final' }
      ];

      // 4 membros apenas
      const partialCards = pagodeMembers.slice(0, 4).map((card, i) => ({ row: 0, col: i, card }));
      const logicPartial = new GameLogic({ expansions: { grupoPagode: true } });
      const resPartial = logicPartial.calculate(partialCards, 0);
      expect(resPartial.breakdown.grupoPagode.score).toBe(0);

      // Todos os 5 membros
      const fullCards = pagodeMembers.map((card, i) => ({ row: 0, col: i, card }));
      const logicFull = new GameLogic({ expansions: { grupoPagode: true } });
      const resFull = logicFull.calculate(fullCards, 0);
      expect(resFull.breakdown.grupoPagode.score).toBe(50);
      // 5 cartas de base 1 = 5 + 50 = 55
      expect(resFull.total).toBe(55);
    });
  });

  describe('Motorista Mateus com Vovó Michel e Dona Fausta (Achado #8)', () => {
    it('should double driver bonus with Vovó Michel and nullify improvements with Dona Fausta', () => {
      const mateusDriver = { id: 'mateus', nome: 'Mateus', bonus: ['Idoso'] };
      const vovoMichel = { id: 'vovo_michel', nome: 'Vovó Michel', base: 2, faixa: 'Idoso', temper: 'Tranquilo', comp: 'Silencioso', impacto: 'final' };
      const donaFausta = { id: 'dona_fausta', nome: 'Dona Fausta', base: 0, faixa: 'Idoso', temper: 'Bravo', comp: 'Barulhento', impacto: 'final' };
      const improv = { id: 'ar_condicionado', nome: 'Ar Condicionado', pts: 5 };

      const logic = new GameLogic({
        driver: mateusDriver,
        improvements: [improv]
      });

      const tableCards = [
        { row: 0, col: 0, card: vovoMichel },
        { row: 0, col: 1, card: donaFausta }
      ];

      const result = logic.calculate(tableCards, 0);
      expect(result.breakdown.improvements.score).toBe(0);
      expect(result.breakdown.driver.score).toBe(4);
    });
  });

  describe('Wilson e Santiago (Achados #1, #7, #11)', () => {
    it('should treat Wilson as occupying both seats in its column for countAdjEmpty and Santiago', () => {
      const wilsonCard = { id: 'wilson', nome: 'Wilson', base: 2, impacto: 'final' };
      const santiagoCard = {
        id: 'santiago',
        nome: 'Santiago',
        base: 0,
        impacto: 'final',
        ability: (pos, ctx) => {
          let occupied = 0;
          for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 6; c++) {
              if (ctx.isActiveAt({ row: r, col: c })) occupied++;
            }
          }
          const hasWilson = ctx.existsId('wilson');
          if (occupied === 12 || (occupied === 11 && hasWilson)) {
            return 10;
          }
          return 0;
        }
      };

      const logic = new GameLogic();
      const tableCards = [
        { row: 0, col: 0, card: wilsonCard },
        { row: 1, col: 1, card: santiagoCard }
      ];
      let fillerId = 1;
      for (let c = 1; c < 6; c++) {
        for (let r = 0; r < 2; r++) {
          if (r === 1 && c === 1) continue;
          tableCards.push({
            row: r,
            col: c,
            card: { id: `dummy_${fillerId++}`, nome: 'Dummy', base: 0, impacto: 'final' }
          });
        }
      }

      const result = logic.calculate(tableCards, 0);
      const santiagoDetail = result.breakdown.passengers.details.find(d => d.who.includes('Santiago'));
      expect(santiagoDetail).toBeDefined();
      expect(santiagoDetail.delta).toBe(10);
    });
  });

  describe('Rotas Diárias e Expansões', () => {
    it('should score daily route for matching passengers in designated row', () => {
      const mockRota = {
        id: 'rota_linha1',
        nome: 'Rota Centro',
        condicao: (ctx) => ctx.countBus((c, p) => p.row === 0 && c.faixa === 'Idoso') > 0,
        pontos: 3,
        efeito: 'Bônus Idosos Linha 1'
      };
      const logic = new GameLogic({
        rotasDiarias: [mockRota]
      });

      const tableCards = [
        { row: 0, col: 0, card: { id: 'idoso_1', nome: 'Idoso 1', base: 1, faixa: 'Idoso', impacto: 'final' } },
        { row: 1, col: 0, card: { id: 'idoso_2', nome: 'Idoso 2', base: 1, faixa: 'Idoso', impacto: 'final' } }
      ];

      const result = logic.calculate(tableCards, 0);
      expect(result.breakdown.rotasDiarias.score).toBe(3);
    });
  });

  describe('Radar de Adjacência e Swap de Assentos (V2 Evolution)', () => {
    it('should compute exact neighbor coordinates used by the adjacency radar', () => {
      // Assento 3 (row 0, col 2) deve ter 5 vizinhos no grid 2x6:
      // Mesma fileira: col 1 e col 3
      // Outra fileira (row 1): col 1, col 2, col 3
      const neighbors = GameLogic.neighbors({ row: 0, col: 2 }, 6);
      expect(neighbors).toHaveLength(5);
      expect(neighbors).toEqual(
        expect.arrayContaining([
          { row: 0, col: 1 },
          { row: 0, col: 3 },
          { row: 1, col: 1 },
          { row: 1, col: 2 },
          { row: 1, col: 3 },
        ])
      );
    });

    it('should recalculate adjacency-dependent points accurately when two seats are swapped', () => {
      const logic = new GameLogic();
      const cardA = {
        id: 'admirador',
        nome: 'Admirador',
        base: 0,
        impacto: 'final',
        ability: (pos, ctx) => ctx.countAdj(pos, c => c.id === 'famoso') * 5
      };
      const cardFamoso = { id: 'famoso', nome: 'Famoso', base: 0, impacto: 'final' };
      const cardNeutro = { id: 'neutro', nome: 'Neutro', base: 0, impacto: 'final' };

      // Estado 1: Admirador na col 0, Famoso na col 1 (adjacentes) -> +5 pts
      // Neutro longe na col 5
      const table1 = [
        { row: 0, col: 0, card: cardA },
        { row: 0, col: 1, card: cardFamoso },
        { row: 0, col: 5, card: cardNeutro },
      ];
      const res1 = logic.calculate(table1, 0);
      expect(res1.breakdown.passengers.score).toBe(5);

      // Swap entre col 1 (Famoso) e col 5 (Neutro)
      // Agora Famoso está longe na col 5 -> 0 pts
      const table2 = [
        { row: 0, col: 0, card: cardA },
        { row: 0, col: 1, card: cardNeutro },
        { row: 0, col: 5, card: cardFamoso },
      ];
      const res2 = logic.calculate(table2, 0);
      expect(res2.breakdown.passengers.score).toBe(0);
    });
  });
});
