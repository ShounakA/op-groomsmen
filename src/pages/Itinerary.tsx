import { Link } from 'react-router-dom';
import ScrambledText from '../components/ScrambledText';
import '../App.css';

const EVENTS = [
  { name: 'Casino Night', day: 'Friday', time: 'Night', host: 'Rajat', cost: 'Buy-in', icon: '🎲' },
  { name: 'Roast and Toast', day: 'Friday', time: 'Night', host: 'Shounak', cost: 'Free', icon: '🔥' },
  { name: 'Gai Stripper', day: 'Friday', time: 'Night', host: 'Joel', cost: 'Dignity', icon: '❓' },
  { name: 'Nerf Gun BR / Laser Tag', day: 'Saturday', time: 'Day', host: 'Rajat/Shounak', cost: '$200', icon: '🔫', link: '/snd' },
  { name: 'VR Games', day: 'Saturday', time: 'Day', host: 'Mrunal', cost: '$700 Total', icon: '🥽' },
  { name: 'Escape Room', day: 'Saturday', time: 'Day', host: 'Mrunal', cost: '$31+', icon: '🧩' },
  { name: 'Hot Ones Gauntlet', day: 'Saturday', time: 'Day', host: 'Mrunal', cost: '???', icon: '🌶️' },
  { name: 'Beerio Kart (Tournament)', day: 'Saturday', time: 'Night', host: 'Shounak', cost: 'Free', icon: '🏎️', link: '/beeriokart', linkText: 'Go to Bracket →' },
  { name: 'Drinking Games (Pong, Flip Cup, Kings)', day: 'Saturday', time: 'Night', host: 'Joel/Gihan', cost: 'Free', icon: '🍺' },
  { name: 'Drinking Jenga', day: 'Saturday', time: 'Night', host: 'Gihan', cost: 'Free', icon: '🧱' },
];

export const isScrambled = (event: { name: string; day: string }, today = new Date()) => {
  const exclusions = [
    'Roast and Toast',
    'Drinking Games',
    'Beerio Kart'
  ];
  
  if (exclusions.some(exc => event.name.toLowerCase().includes(exc.toLowerCase()))) return false;
  
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); // 2 is March
  const currentYear = today.getFullYear();
  const currentHour = today.getHours();
  
  // Only apply scrambling logic for 2026
  if (currentYear > 2026) return false;
  if (currentYear === 2026 && currentMonth > 2) return false;
  if (currentYear === 2026 && currentMonth < 2) return true;
  
  const eventDayMap: Record<string, number> = {
    'Friday': 6,
    'Fri/Sat': 6,
    'Saturday': 7,
    'Sunday': 8
  };
  
  const targetDay = eventDayMap[event.day];
  if (!targetDay) return false;
  
  // If it's the target day (March 6th, 2026 is Friday), unscramble after 5 PM
  if (currentDay === targetDay && currentDay === 6 && currentMonth === 2 && currentYear === 2026) {
    return currentHour < 17;
  }
  
  return currentDay < targetDay;
}

export default function Itinerary() {
  const groupedEvents = EVENTS.reduce((acc, event) => {
    if (!acc[event.day]) acc[event.day] = [];
    acc[event.day].push(event);
    return acc;
  }, {} as Record<string, (typeof EVENTS)[0][]>);

  return (
    <div className="app itinerary-page">
      <div className="input-section">
        <h1 className="section-title">The Master Plan</h1>
        <Link to="/">
          <button className="secondary">← Back to Home</button>
        </Link>
      </div>

      <div className="itinerary-section">
        <div className="day-groups-container">
          {Object.entries(groupedEvents).map(([day, events]) => (
            <div key={day} className="day-group">
              <h3 className="day-title">{day}</h3>
              <div className="events-flex">
                {events.map((event, i) => {
                  const shouldScramble = isScrambled(event);
                  return (
                    <div key={i} className="event-card-compact">
                      <div className="event-header">
                        <span className="event-icon">{event.icon}</span>
                        <span className="event-time">
                          {shouldScramble ? <ScrambledText text={event.time} /> : event.time}
                        </span>
                      </div>
                      <h4 className="event-name">
                        {shouldScramble ? <ScrambledText text={event.name} /> : event.name}
                      </h4>
                      <div className="event-footer">
                        <span className="event-host">
                          {shouldScramble ? <ScrambledText text={event.host} /> : event.host}
                        </span>
                        <span className="event-cost">
                          {shouldScramble ? <ScrambledText text={event.cost} /> : event.cost}
                        </span>
                      </div>
                      {event.link && (
                        <Link to={event.link} className="event-link">
                          {shouldScramble ? <ScrambledText text={event.linkText || 'Go to Mission →'} /> : (event.linkText || 'Go to Mission →')}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
