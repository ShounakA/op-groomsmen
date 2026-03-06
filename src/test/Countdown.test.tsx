import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App, { TARGET_DATE } from '../App';
import Itinerary from '../pages/Itinerary';
import BeerioKart from '../pages/BeerioKart';
import Bomb from '../pages/Bomb';

describe('Countdown Logic in App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show countdown if current date is before target date', () => {
    // Set time to 1 hour before target date
    const beforeDate = new Date(TARGET_DATE - 60 * 60 * 1000);
    vi.setSystemTime(beforeDate);

    render(<App />);

    // Should show countdown text
    expect(screen.getByText(/Initiating Countdown to Chaos/i)).toBeInTheDocument();
    // Should NOT show landing page subtitle
    expect(screen.queryByText(/The Final Lap | March 6 - March 8, 2026/i)).not.toBeInTheDocument();
  });

  it('should show landing page if current date is after target date', () => {
    // Set time to 1 second after target date
    const afterDate = new Date(TARGET_DATE + 1000);
    vi.setSystemTime(afterDate);

    render(<App />);

    // Should show landing page subtitle
    expect(screen.getByText(/The Final Lap | March 6 - March 8, 2026/i)).toBeInTheDocument();
    // Should NOT show countdown text
    expect(screen.queryByText(/Initiating Countdown to Chaos/i)).not.toBeInTheDocument();
  });

  it('should switch from countdown to landing page when timer ends', () => {
    // Set time to 5 seconds before target date
    const justBefore = new Date(TARGET_DATE - 5000);
    vi.setSystemTime(justBefore);

    render(<App />);

    // Initially shows countdown
    expect(screen.getByText(/Initiating Countdown to Chaos/i)).toBeInTheDocument();

    // Fast forward 6 seconds
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    // Now should show landing page
    expect(screen.getByText(/The Final Lap | March 6 - March 8, 2026/i)).toBeInTheDocument();
    expect(screen.queryByText(/Initiating Countdown to Chaos/i)).not.toBeInTheDocument();
  });

  it('should show countdown even on nested routes if time is before target', () => {
    const beforeDate = new Date(TARGET_DATE - 60000);
    vi.setSystemTime(beforeDate);

    render(<App />);

    expect(screen.getByText(/Initiating Countdown to Chaos/i)).toBeInTheDocument();
    expect(screen.queryByText(/The Master Plan/i)).not.toBeInTheDocument();
  });

  describe('Post-Countdown Page Access', () => {
    beforeEach(() => {
      // Set time to after target date for all tests in this block
      const afterDate = new Date(TARGET_DATE + 1000);
      vi.setSystemTime(afterDate);
    });

    it('should allow access to Itinerary page after countdown', () => {
      render(
        <MemoryRouter initialEntries={['/itinerary']}>
          <Itinerary />
        </MemoryRouter>
      );
      expect(screen.getByText(/The Master Plan/i)).toBeInTheDocument();
    });

    it('should allow access to Beerio Kart page after countdown', () => {
      render(
        <MemoryRouter initialEntries={['/beeriokart']}>
          <BeerioKart />
        </MemoryRouter>
      );
      expect(screen.getByText(/Beerio Kart Tournament/i)).toBeInTheDocument();
    });

    it('should allow access to Bomb/SND page after countdown', () => {
      render(
        <MemoryRouter initialEntries={['/snd']}>
          <Bomb />
        </MemoryRouter>
      );
      expect(screen.getByText(/TACTICAL DEVICE/i)).toBeInTheDocument();
    });
  });
});
