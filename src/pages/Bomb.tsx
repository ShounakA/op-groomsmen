import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

// Optimized Sound System using a shared AudioContext
let sharedAudioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return sharedAudioCtx;
};

const playSound = (freq: number, type: OscillatorType, duration: number) => {
  const audioCtx = getAudioContext();
  
  // Browsers require a user gesture to resume the audio context
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

export default function Bomb() {
  const [status, setStatus] = useState<'idle' | 'planting' | 'planted' | 'defusing' | 'defused' | 'detonated'>('idle');
  const [plantProgress, setPlantProgress] = useState(0);
  const [defuseProgress, setDefuseProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45); // 45 seconds after plant
  const timerRef = useRef<any>(null);
  const plantRef = useRef<any>(null);
  const defuseRef = useRef<any>(null);

  // Planting logic
  const startPlanting = () => {
    if (status !== 'idle') return;
    setStatus('planting');
    
    plantRef.current = setInterval(() => {
      setPlantProgress((prev) => {
        if (prev >= 100) {
          completePlant();
          return 100;
        }
        if (prev % 10 === 0) playSound(800, 'square', 0.1);
        return prev + 2; 
      });
    }, 100);
  };

  const stopPlanting = () => {
    if (status === 'planting') {
      clearInterval(plantRef.current!);
      setPlantProgress(0);
      setStatus('idle');
    }
  };

  const completePlant = () => {
    clearInterval(plantRef.current!);
    setStatus('planted');
    playSound(400, 'square', 1.5);
  };

  // Defusing logic
  const startDefusing = () => {
    if (status !== 'planted') return;
    setStatus('defusing');
    
    defuseRef.current = setInterval(() => {
      setDefuseProgress((prev) => {
        if (prev >= 100) {
          completeDefuse();
          return 100;
        }
        // Different beep for defusing
        if (prev % 5 === 0) playSound(600, 'sine', 0.1);
        return prev + 1.25; // ~8 seconds to defuse
      });
    }, 100);
  };

  const stopDefusing = () => {
    if (status === 'defusing') {
      clearInterval(defuseRef.current!);
      setDefuseProgress(0);
      setStatus('planted');
    }
  };

  const completeDefuse = () => {
    clearInterval(defuseRef.current!);
    setStatus('defused');
    playSound(1200, 'sine', 2); // Victory sound
  };

  // Countdown logic
  useEffect(() => {
    if ((status === 'planted' || status === 'defusing') && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // CRITICAL FIX: Clear the defuse interval if it's running
            if (defuseRef.current) {
              clearInterval(defuseRef.current);
              defuseRef.current = null;
              setDefuseProgress(0);
            }
            setStatus('detonated');
            playSound(100, 'sawtooth', 3);
            return 0;
          }
          playSound(1000, 'sine', 0.1);
          return prev - 1;
        });
      }, timeLeft > 10 ? 1000 : 500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status, timeLeft]);

  return (
    <div className={`app bomb-page ${status}`}>
      <div className="input-section">
        <h1 className="bomb-title">TACTICAL DEVICE</h1>
        <Link to="/itinerary">
          <button className="secondary">Abort Mission</button>
        </Link>
      </div>

      <div className="bomb-container">
        <div className="digital-display">
          {status === 'detonated' ? (
            <span className="detonated-text">BOOM</span>
          ) : status === 'defused' ? (
            <span className="defused-text">SECURE</span>
          ) : (
            <span className="timer-text">
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          )}
        </div>

        <div className="bomb-status">
          STATUS: {status.toUpperCase()}
        </div>

        {(status === 'idle' || status === 'planting') && (
          <div className="interaction-zone">
            <button 
              className="plant-btn"
              onMouseDown={startPlanting}
              onMouseUp={stopPlanting}
              onMouseLeave={stopPlanting}
              onTouchStart={startPlanting}
              onTouchEnd={stopPlanting}
            >
              {status === 'planting' ? 'PLANTING...' : 'HOLD TO PLANT'}
            </button>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${plantProgress}%` }}></div>
            </div>
          </div>
        )}

        {(status === 'planted' || status === 'defusing') && (
          <div className="interaction-zone">
            <button 
              className="defuse-btn"
              onMouseDown={startDefusing}
              onMouseUp={stopDefusing}
              onMouseLeave={stopDefusing}
              onTouchStart={startDefusing}
              onTouchEnd={stopDefusing}
            >
              {status === 'defusing' ? 'DEFUSING...' : 'HOLD TO DEFUSE'}
            </button>
            <div className="progress-bar-container defuse">
              <div className="progress-bar defuse" style={{ width: `${defuseProgress}%` }}></div>
            </div>
          </div>
        )}

        {status === 'detonated' || status === 'defused' ? (
          <button className="primary" onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (plantRef.current) clearInterval(plantRef.current);
            if (defuseRef.current) clearInterval(defuseRef.current);
            timerRef.current = null;
            plantRef.current = null;
            defuseRef.current = null;
            setStatus('idle');
            setTimeLeft(45);
            setPlantProgress(0);
            setDefuseProgress(0);
          }}>
            RESET DEVICE
          </button>
        ) : null}
      </div>
    </div>
  );
}
