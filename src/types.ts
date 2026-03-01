export interface Player {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  roundIndex: number;
  matchIndex: number;
  player1: Player | null;
  player2: Player | null;
  isBye: boolean;
  winnerId?: string;
}

export interface Round {
  title: string;
  matches: Match[];
}

export interface Bracket {
  rounds: Round[];
}
