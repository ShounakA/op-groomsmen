import { useState, useMemo } from 'react';
import '../App.css';
import type { Bracket, Match, Player } from '../types';
import { generateBracket } from '../utils/bracketLogic';

const PlayerSlot = ({ player, isWinner }: { player: Player | null; isWinner: boolean }) => (
  <div className="player-slot">
    <span className={`player-name ${player ? '' : 'bye'} ${isWinner ? 'winner' : ''}`}>
      {player ? player.name : 'BYE'}
    </span>
    {isWinner && <span className="winner-mark">✓</span>}
  </div>
);

const MatchCard = ({ 
  match, 
  isActive, 
  onSelect 
}: { 
  match: Match; 
  isActive: boolean; 
  onSelect: () => void 
}) => {
  const isP1Winner = !!(match.player1 && match.winnerId === match.player1.id);
  const isP2Winner = !!(match.player2 && match.winnerId === match.player2.id);

  return (
    <div 
      className={`match ${isActive ? 'active' : ''}`} 
      onClick={onSelect}
    >
      <PlayerSlot player={match.player1} isWinner={isP1Winner} />
      <PlayerSlot player={match.player2} isWinner={isP2Winner} />
    </div>
  );
};

export default function BeerioKart() {
  const [names, setNames] = useState<string>('Alice\nBob\nCharlie\nDavid\nEve');
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);

  const handleGenerate = () => {
    const nameList = names.split('\n').filter(n => n.trim() !== '');
    if (nameList.length < 2) {
      alert('Please enter at least 2 names');
      return;
    }
    const newBracket = generateBracket(nameList);
    setBracket(newBracket);
    // Find the first match that isn't a Bye and needs a winner
    let firstActiveId = null;
    for (const round of newBracket.rounds) {
      const match = round.matches.find(m => !m.isBye && !m.winnerId);
      if (match) {
        firstActiveId = match.id;
        break;
      }
    }
    setActiveMatchId(firstActiveId || newBracket.rounds[0].matches[0].id);
  };

  const activeMatch = useMemo(() => {
    if (!bracket || !activeMatchId) return null;
    for (const round of bracket.rounds) {
      const match = round.matches.find(m => m.id === activeMatchId);
      if (match) return match;
    }
    return null;
  }, [bracket, activeMatchId]);

  const handleSelectWinner = (playerId: string | null) => {
    if (!bracket || !activeMatch) return;
    
    const newBracket = { ...bracket };
    const { roundIndex, matchIndex } = activeMatch;
    const currentMatch = newBracket.rounds[roundIndex].matches[matchIndex];
    
    // 1. If selecting the same winner, we clear it (toggle behavior) or if playerId is null
    const isClearing = playerId === null || currentMatch.winnerId === playerId;
    currentMatch.winnerId = isClearing ? undefined : playerId;
    
    // 2. Propagate change to all subsequent rounds
    let currentRI = roundIndex + 1;
    let currentMI = Math.floor(matchIndex / 2);
    let wasP1 = matchIndex % 2 === 0;

    const winner = isClearing ? null : (playerId === activeMatch.player1?.id ? activeMatch.player1 : activeMatch.player2);

    while (currentRI < newBracket.rounds.length) {
      const targetMatch = newBracket.rounds[currentRI].matches[currentMI];
      
      if (wasP1) {
        targetMatch.player1 = winner;
      } else {
        targetMatch.player2 = winner;
      }
      
      // If we cleared a player, we MUST clear the winner of the target match too
      // because that winner is now invalid (one of the participants is gone)
      targetMatch.winnerId = undefined;

      // Continue propagating up the tree
      wasP1 = currentMI % 2 === 0;
      currentMI = Math.floor(currentMI / 2);
      currentRI++;
    }
    
    setBracket(newBracket);
  };

  return (
    <div className="app">
      <div className="input-section">
        <h1>Beerio Kart Tournament</h1>
        {!bracket ? (
          <>
            <p>Enter players for the ultimate Beerio Kart showdown</p>
            <textarea
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="Enter player names..."
            />
            <button className="primary" onClick={handleGenerate}>Generate Bracket</button>
          </>
        ) : (
          <div className="button-group">
            <button className="secondary" onClick={() => setBracket(null)}>
              Reset / New Tournament
            </button>
          </div>
        )}
      </div>

      {bracket && (
        <div className="main-layout">
          <div className="bracket-wrapper">
            <div className="controls-panel">
              <h3>Current Match</h3>
              {activeMatch ? (
                <div className="match-selector">
                  <p>{bracket.rounds[activeMatch.roundIndex].title} - Match {activeMatch.matchIndex + 1}</p>
                  
                  <button 
                    className={`winner-btn ${activeMatch.winnerId === activeMatch.player1?.id ? 'selected' : ''}`}
                    disabled={!activeMatch.player1 || !activeMatch.player2}
                    onClick={() => activeMatch.player1 && handleSelectWinner(activeMatch.player1.id)}
                  >
                    Winner: {activeMatch.player1?.name || '???'}
                  </button>
                  
                  <button 
                    className={`winner-btn ${activeMatch.winnerId === activeMatch.player2?.id ? 'selected' : ''}`}
                    disabled={!activeMatch.player1 || !activeMatch.player2}
                    onClick={() => activeMatch.player2 && handleSelectWinner(activeMatch.player2.id)}
                  >
                    Winner: {activeMatch.player2?.name || '???'}
                  </button>

                  {activeMatch.winnerId && (
                    <button 
                      className="secondary" 
                      onClick={() => handleSelectWinner(null)}
                      style={{ marginTop: '10px' }}
                    >
                      Clear Winner
                    </button>
                  )}

                  {(!activeMatch.player1 || !activeMatch.player2) && (
                    <p style={{ fontSize: '12px', color: '#ff4444' }}>
                      Waiting for previous round winners...
                    </p>
                  )}
                </div>
              ) : (
                <p>Select a match in the bracket</p>
              )}
            </div>

            <div className="bracket-container">
              {bracket.rounds.map((round, rIndex) => (
                <div key={rIndex} className="round">
                  <div className="round-title">{round.title}</div>
                  {round.matches.map((match) => (
                    <div key={match.id} className="match-wrapper">
                      <MatchCard 
                        match={match} 
                        isActive={activeMatchId === match.id}
                        onSelect={() => setActiveMatchId(match.id)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
