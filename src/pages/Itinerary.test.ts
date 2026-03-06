import { describe, it, expect } from 'vitest';
import { isScrambled } from './Itinerary';

describe('isScrambled', () => {
  const march = 2; // JavaScript months are 0-indexed

  describe('Exclusions', () => {
    it('should NOT scramble "Roast and Toast" regardless of date', () => {
      const event = { name: 'Roast and Toast', day: 'Friday' };
      const today = new Date(2026, march, 1);
      expect(isScrambled(event, today)).toBe(false);
    });

    it('should NOT scramble "Drinking Games" regardless of date', () => {
      const event = { name: 'Drinking Games (Pong, Flip Cup, Kings)', day: 'Saturday' };
      const today = new Date(2026, march, 1);
      expect(isScrambled(event, today)).toBe(false);
    });

    it('should NOT scramble "Beerio Kart" regardless of date', () => {
      const event = { name: 'Beerio Kart (Tournament)', day: 'Saturday' };
      const today = new Date(2026, march, 1);
      expect(isScrambled(event, today)).toBe(false);
    });
  });

  describe('Date-based Scrambling (Friday Event - March 6th)', () => {
    const fridayEvent = { name: 'Casino Night', day: 'Friday' };

    it('should scramble before Friday March 6th', () => {
      const today = new Date(2026, march, 5);
      expect(isScrambled(fridayEvent, today)).toBe(true);
    });

    it('should scramble on Friday March 6th before 5:00 PM', () => {
      const today = new Date(2026, march, 6, 16, 59);
      expect(isScrambled(fridayEvent, today)).toBe(true);
    });

    it('should NOT scramble on Friday March 6th at 5:00 PM', () => {
      const today = new Date(2026, march, 6, 17, 0);
      expect(isScrambled(fridayEvent, today)).toBe(false);
    });

    it('should NOT scramble after Friday March 6th', () => {
      const today = new Date(2026, march, 7);
      expect(isScrambled(fridayEvent, today)).toBe(false);
    });
  });

  describe('Date-based Scrambling (Saturday Event - March 7th)', () => {
    const saturdayEvent = { name: 'Escape Room', day: 'Saturday' };

    it('should scramble on Friday March 6th at 11:59 PM', () => {
      const today = new Date(2026, march, 6, 23, 59);
      expect(isScrambled(saturdayEvent, today)).toBe(true);
    });

    it('should NOT scramble on Saturday March 7th at midnight (12:00 AM)', () => {
      const today = new Date(2026, march, 7, 0, 0);
      expect(isScrambled(saturdayEvent, today)).toBe(false);
    });

    it('should NOT scramble on Saturday March 7th during the day', () => {
      const today = new Date(2026, march, 7, 10, 0);
      expect(isScrambled(saturdayEvent, today)).toBe(false);
    });
  });

  describe('Year and Month boundaries', () => {
    const fridayEvent = { name: 'Casino Night', day: 'Friday' };

    it('should scramble if it is February 2026', () => {
      const today = new Date(2026, 1, 28);
      expect(isScrambled(fridayEvent, today)).toBe(true);
    });

    it('should NOT scramble if it is April 2026', () => {
      const today = new Date(2026, 3, 1);
      expect(isScrambled(fridayEvent, today)).toBe(false);
    });

    it('should NOT scramble if it is 2027', () => {
      const today = new Date(2027, 0, 1);
      expect(isScrambled(fridayEvent, today)).toBe(false);
    });
  });
});
