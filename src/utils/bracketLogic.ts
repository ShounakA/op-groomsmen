import type { Player, Match, Round, Bracket } from '../types';

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getSeedOrder = (p: number): number[] => {
  let seeds = [1];
  while (seeds.length < p) {
    const nextSeeds = [];
    const limit = seeds.length * 2 + 1;
    for (const s of seeds) {
      nextSeeds.push(s);
      nextSeeds.push(limit - s);
    }
    seeds = nextSeeds;
  }
  return seeds;
};

export const generateBracket = (playerNames: string[]): Bracket => {
  // We assume the input order is the "Ranking" (Seed 1, Seed 2, etc.)
  const players: Player[] = playerNames
    .filter(name => name.trim() !== '')
    .map((name, index) => ({
      id: `p-${index}`,
      name: name.trim(),
    }));

  const N = players.length;
  if (N < 2) return { rounds: [] };

  let P = 1;
  while (P < N) P *= 2;

  const seedOrder = getSeedOrder(P);
  const rounds: Round[] = [];
  const round1Matches: Match[] = [];

  // Round 1 Setup
  for (let i = 0; i < P / 2; i++) {
    // Standard pairing based on seed order
    // e.g. Match 0: seedOrder[0] vs seedOrder[1]
    const s1 = seedOrder[i * 2];
    const s2 = seedOrder[i * 2 + 1];

    // Subtract 1 because players array is 0-indexed
    const p1 = s1 <= N ? players[s1 - 1] : null;
    const p2 = s2 <= N ? players[s2 - 1] : null;

    const isBye = p1 === null || p2 === null;

    round1Matches.push({
      id: `r0-m${i}`,
      roundIndex: 0,
      matchIndex: i,
      player1: p1,
      player2: p2,
      isBye: isBye,
      // Automatic promotion for Byes
      winnerId: isBye ? (p1?.id || p2?.id) : undefined
    });
  }

  rounds.push({
    title: 'Round 1',
    matches: round1Matches,
  });

  // Subsequent Rounds (Promote Round 1 BYEs immediately)
  let roundIdx = 1;
  while (rounds[rounds.length - 1].matches.length > 1) {
    const prevRound = rounds[rounds.length - 1];
    const nextRoundMatchesCount = prevRound.matches.length / 2;
    const nextRoundMatches: Match[] = [];
    
    for (let i = 0; i < nextRoundMatchesCount; i++) {
      const m1 = prevRound.matches[i * 2];
      const m2 = prevRound.matches[i * 2 + 1];
      
      const p1 = (m1.winnerId && m1.player1 && m1.player1.id === m1.winnerId) ? m1.player1 : (m1.winnerId && m1.player2 && m1.player2.id === m1.winnerId ? m1.player2 : null);
      const p2 = (m2.winnerId && m2.player1 && m2.player1.id === m2.winnerId) ? m2.player1 : (m2.winnerId && m2.player2 && m2.player2.id === m2.winnerId ? m2.player2 : null);

      nextRoundMatches.push({
        id: `r${roundIdx}-m${i}`,
        roundIndex: roundIdx,
        matchIndex: i,
        player1: p1,
        player2: p2,
        isBye: false,
        winnerId: undefined
      });
    }

    rounds.push({
      title: nextRoundMatchesCount === 1 ? 'Finals' : `Round ${roundIdx + 1}`,
      matches: nextRoundMatches,
    });
    roundIdx++;
  }

  return { rounds };
};

