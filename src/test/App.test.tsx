import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import BeerioKart from '../pages/BeerioKart';

describe('App Component Comprehensive Tests', () => {
  
  const generateTournament = (names: string[]) => {
    const textarea = screen.getByPlaceholderText(/Enter player names/i);
    fireEvent.change(textarea, { target: { value: names.join('\n') } });
    fireEvent.click(screen.getByText(/Generate Bracket/i));
  };

  it('should navigate from home to itinerary and then to beeriokart', () => {
    render(<App />);
    
    // Home -> Itinerary
    const itineraryLink = screen.getByText(/View Master Plan/i);
    fireEvent.click(itineraryLink);
    expect(screen.getByText(/The Master Plan/i)).toBeInTheDocument();
    
    // Itinerary -> BeerioKart
    const bracketLink = screen.getByText(/Go to Bracket →/i);
    fireEvent.click(bracketLink);
    expect(screen.getByText(/Beerio Kart Tournament/i)).toBeInTheDocument();
  });

  it('should show an alert if fewer than 2 names are entered', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<BeerioKart />);
    generateTournament(['OnlyOne']);
    expect(alertMock).toHaveBeenCalledWith('Please enter at least 2 names');
    alertMock.mockRestore();
  });

  it('should handle a 5-player tournament (Odd) from start to finish', () => {
    render(<BeerioKart />);
    const players = ['P1', 'P2', 'P3', 'P4', 'P5'];
    generateTournament(players);

    const round1 = screen.getAllByText(/Round 1/i).find(el => el.classList.contains('round-title'))?.parentElement;
    expect(within(round1!).getByText('P1')).toHaveClass('winner');
    expect(within(round1!).getByText('P2')).toHaveClass('winner');
    expect(within(round1!).getByText('P3')).toHaveClass('winner');
    
    const p4Match = screen.getByText('P4').closest('.match');
    fireEvent.click(p4Match!);
    fireEvent.click(screen.getByText('Winner: P4'));
    
    const semiRound = screen.getByText(/Round 2/i).parentElement;
    expect(within(semiRound!).getByText('P1')).toBeInTheDocument();
    expect(within(semiRound!).getByText('P4')).toBeInTheDocument();
    
    fireEvent.click(within(semiRound!).getByText('P1').closest('.match')!);
    fireEvent.click(screen.getByText('Winner: P1'));
    
    fireEvent.click(within(semiRound!).getByText('P2').closest('.match')!);
    fireEvent.click(screen.getByText('Winner: P2'));
    
    const finalsRound = screen.getAllByText(/Finals/i).find(el => el.classList.contains('round-title'))?.parentElement;
    expect(within(finalsRound!).getByText('P1')).toBeInTheDocument();
    expect(within(finalsRound!).getByText('P2')).toBeInTheDocument();
    
    fireEvent.click(within(finalsRound!).getByText('P1').closest('.match')!);
    fireEvent.click(screen.getByText('Winner: P1'));
    
    expect(within(finalsRound!).getByText('P1')).toHaveClass('winner');
  });

  it('should allow switching the active match by clicking on it', () => {
    render(<BeerioKart />);
    generateTournament(['A', 'B', 'C', 'D']);
    
    expect(screen.getByText(/Round 1 - Match 1/i)).toBeInTheDocument();
    
    const match2 = screen.getByText('B').closest('.match');
    fireEvent.click(match2!);
    
    expect(screen.getByText(/Round 1 - Match 2/i)).toBeInTheDocument();
    expect(match2).toHaveClass('active');
  });

  it('should reset the tournament when clicking the Reset button', () => {
    render(<BeerioKart />);
    generateTournament(['A', 'B']);
    
    expect(screen.getByText(/Reset \/ New Tournament/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Reset \/ New Tournament/i));
    
    expect(screen.getByPlaceholderText(/Enter player names/i)).toBeInTheDocument();
    expect(screen.queryByText(/Round 1/i)).not.toBeInTheDocument();
  });

  it('should clear winners recursively when a selection is toggled off', () => {
    render(<BeerioKart />);
    generateTournament(['A', 'B', 'C', 'D']);
    
    fireEvent.click(screen.getByText('Winner: A'));
    
    const finalsRound = screen.getAllByText(/Finals/i).find(el => el.classList.contains('round-title'))?.parentElement;
    expect(within(finalsRound!).getByText('A')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Winner: A'));
    expect(within(finalsRound!).queryByText('A')).not.toBeInTheDocument();
  });
});
