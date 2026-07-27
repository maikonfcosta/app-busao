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
  
  it('should calculate driver bonus correctly', () => {
    const mockDriver = { id: 'test_driver', nome: 'Test Driver', bonus: ['Jovem'] };
    const logic = new GameLogic({ driver: mockDriver });
    
    const tableCards = [
      { row: 0, col: 0, card: { id: 'p1', nome: 'Jovem 1', base: 2, faixa: 'Jovem', temper: 'Tranquilo', comp: 'Silencioso', impacto: 'final' } },
      { row: 0, col: 1, card: { id: 'p2', nome: 'Adulto 1', base: 3, faixa: 'Adulto', temper: 'Tranquilo', comp: 'Silencioso', impacto: 'final' } }
    ];
    
    const result = logic.calculate(tableCards, 0);
    
    // Total should be: 2 (p1) + 3 (p2) = 5 for passengers
    // Plus 1 for driver bonus (1 Jovem) = 6
    expect(result.total).toBe(6);
    expect(result.breakdown.driver.score).toBe(1);
    expect(result.breakdown.passengers.score).toBe(5);
  });
});
