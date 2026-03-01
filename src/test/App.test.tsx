import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BeerioKart from '../pages/BeerioKart';
import Bomb from '../pages/Bomb';

describe('App Functional Tests', () => {
  
  const generateTournament = (names: string[]) => {
    const textarea = screen.getByPlaceholderText(/Enter player names/i);
    fireEvent.change(textarea, { target: { value: names.join('\n') } });
    fireEvent.click(screen.getByText(/Generate Bracket/i));
  };

  it('should render the bomb page correctly', () => {
    render(
      <MemoryRouter initialEntries={['/snd']}>
        <Routes>
          <Route path="/snd" element={<Bomb />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/TACTICAL DEVICE/i)).toBeInTheDocument();
    expect(screen.getByText(/HOLD TO PLANT/i)).toBeInTheDocument();
  });

  it('should handle a 5-player tournament (Odd) from start to finish', () => {
    render(
      <MemoryRouter>
        <BeerioKart />
      </MemoryRouter>
    );
    const players = ['P1', 'P2', 'P3', 'P4', 'P5'];
    generateTournament(players);

    const round1 = screen.getAllByText(/Round 1/i).find(el => el.classList.contains('round-title'))?.parentElement;
    expect(within(round1!).getByText('P1')).toHaveClass('winner');
    
    const p4Match = screen.getByText('P4').closest('.match');
    fireEvent.click(p4Match!);
    fireEvent.click(screen.getByText('Winner: P4'));
    
    const semiRound = screen.getByText(/Round 2/i).parentElement;
    expect(within(semiRound!).getByText('P1')).toBeInTheDocument();
  });

  it('should reset the tournament when clicking the Reset button', () => {
    render(
      <MemoryRouter>
        <BeerioKart />
      </MemoryRouter>
    );
    generateTournament(['A', 'B']);
    
    expect(screen.getByText(/Reset \/ New Tournament/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Reset \/ New Tournament/i));
    
    expect(screen.getByPlaceholderText(/Enter player names/i)).toBeInTheDocument();
  });
});
