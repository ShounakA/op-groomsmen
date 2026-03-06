import { useState, useEffect } from 'react';
import Fireworks from '../components/Fireworks';
import '../App.css';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const targetDate = new Date(2026, 2, 6, 17, 0, 0).getTime(); // March 6, 2026 5:00 PM
  
  const calculateTimeLeft = (): TimeLeft | null => {
    const now = new Date().getTime();
    const difference = targetDate - now;
    
    if (difference <= 0) return null;
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (!remaining) {
        clearInterval(timer);
        window.location.reload(); // Reload to show the actual app
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="app countdown-page">
      <Fireworks />
      <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
        <h1 className="main-title">Ashen's Bachelor Party</h1>
        <p className="subtitle">Initiating Countdown to Chaos...</p>
        
        <div className="countdown-container">
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.days}</span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.hours}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.minutes}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.seconds}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>
        
        <p className="countdown-footer">March 6 - March 8, 2026</p>
      </div>
    </div>
  );
}
