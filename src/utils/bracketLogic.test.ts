import { describe, it, expect } from 'vitest';
import { generateBracket } from './bracketLogic';

describe('Bracket Logic', () => {
  it('should generate a correct bracket size for odd number of players', () => {
    const players = ['Alice', 'Bob', 'Charlie']; // 3 players -> 4 slots
    const bracket = generateBracket(players);
    
    expect(bracket.rounds).toHaveLength(2); // Round 1, Finals
    expect(bracket.rounds[0].matches).toHaveLength(2);
  });

  it('should handle byes correctly (automatic promotion)', () => {
    const players = ['Alice', 'Bob', 'Charlie'];
    const bracket = generateBracket(players);
    
    // In a 4-slot bracket, seed 1 vs 4(BYE) and seed 2 vs 3.
    // So 1 match should have a winner (promotion) and one should not.
    const byes = bracket.rounds[0].matches.filter(m => m.isBye);
    expect(byes.length).toBeGreaterThan(0);
    expect(byes[0].winnerId).toBeDefined();
  });

  it('should follow standard seeding (1 vs N, etc.)', () => {
    const players = ['Seed1', 'Seed2', 'Seed3', 'Seed4'];
    const bracket = generateBracket(players);
    const r1 = bracket.rounds[0];
    
    // Seed 1 should be in the first match
    expect(r1.matches[0].player1?.name).toBe('Seed1');
    // Seed 1 vs Seed 4
    expect(r1.matches[0].player2?.name).toBe('Seed4');
    // Seed 2 vs Seed 3
    expect(r1.matches[1].player1?.name).toBe('Seed2');
    expect(r1.matches[1].player2?.name).toBe('Seed3');
  });

  it('should handle large odd numbers (e.g. 11 players)', () => {
    const players = Array.from({ length: 11 }, (_, i) => `Player ${i + 1}`);
    const bracket = generateBracket(players);
    
    // 11 players -> 16 slots -> 8 matches in R1
    expect(bracket.rounds[0].matches).toHaveLength(8);
    // 16 - 11 = 5 Byes
    const byes = bracket.rounds[0].matches.filter(m => m.isBye);
    expect(byes).toHaveLength(5);
  });

  it('should handle even power of 2 (e.g. 8 players) with zero byes', () => {
    const players = Array.from({ length: 8 }, (_, i) => `Player ${i + 1}`);
    const bracket = generateBracket(players);
    
    expect(bracket.rounds[0].matches).toHaveLength(4);
    const byes = bracket.rounds[0].matches.filter(m => m.isBye);
    expect(byes).toHaveLength(0);
  });

  it('should handle even non-power of 2 (e.g. 6 players) with correct byes', () => {
    const players = Array.from({ length: 6 }, (_, i) => `Player ${i + 1}`);
    const bracket = generateBracket(players);
    
    // 6 players -> 8 slots -> 4 matches in R1
    expect(bracket.rounds[0].matches).toHaveLength(4);
    // 8 - 6 = 2 Byes
    const byes = bracket.rounds[0].matches.filter(m => m.isBye);
    expect(byes).toHaveLength(2);
  });

  it('should return empty bracket for empty input', () => {
    const bracket = generateBracket([]);
    expect(bracket.rounds).toHaveLength(0);
  });

  it('should handle a single player (though UI prevents it)', () => {
    const bracket = generateBracket(['Solo']);
    expect(bracket.rounds).toHaveLength(0); // App logic returns empty for 0 or 1 logically
  });
});
