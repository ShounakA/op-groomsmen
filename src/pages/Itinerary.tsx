import { Link } from 'react-router-dom';
import ScrambledText from '../components/ScrambledText';
import '../App.css';

const EVENTS = [
  { name: 'Casino Night', day: 'Friday', time: 'Night', host: 'Rajat', cost: 'Buy-in', icon: '🎲' },
  { name: 'Roast and Toast', day: 'Friday', time: 'Night', host: 'Shounak', cost: 'Free', icon: '🔥' },
  { name: 'Gai Stripper', day: 'Friday', time: 'Night', host: 'Joel', cost: 'Dignity', icon: '❓', scrambled: true },
  { name: 'Scavenger Hunt', day: 'Fri/Sat', time: 'Day', host: 'Mrunal/Shounak', cost: 'Free', icon: '🔍' },
  { name: 'Nerf Gun BR / Laser Tag', day: 'Saturday', time: 'Day', host: 'Rajat/Shounak', cost: '$200', icon: '🔫' },
  { name: 'VR Games', day: 'Saturday', time: 'Day', host: 'Mrunal', cost: '$700 Total', icon: '🥽' },
  { name: 'Escape Room', day: 'Saturday', time: 'Day', host: 'Mrunal', cost: '$31+', icon: '🧩' },
  { name: 'Hot Ones Gauntlet', day: 'Saturday', time: 'Day', host: 'Mrunal', cost: '???', icon: '🌶️' },
  { name: 'Beerio Kart (Tournament)', day: 'Saturday', time: 'Night', host: 'Shounak', cost: 'Free', icon: '🏎️', link: '/beeriokart' },
  { name: 'Drinking Games (Pong, Flip Cup, Kings)', day: 'Saturday', time: 'Night', host: 'Joel/Gihan', cost: 'Free', icon: '🍺' },
  { name: 'Drinking Jenga', day: 'Saturday', time: 'Night', host: 'Gihan', cost: 'Free', icon: '🧱' },
];

export default function Itinerary() {
  const groupedEvents = EVENTS.reduce((acc, event) => {
    if (!acc[event.day]) acc[event.day] = [];
    acc[event.day].push(event);
    return acc;
  }, {} as Record<string, typeof EVENTS>);

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
                {events.map((event, i) => (
                  <div key={i} className="event-card-compact">
                    <div className="event-header">
                      <span className="event-icon">{event.icon}</span>
                      <span className="event-time">{event.time}</span>
                    </div>
                    <h4 className="event-name">
                      {event.scrambled ? <ScrambledText text={event.name} /> : event.name}
                    </h4>
                    <div className="event-footer">
                      <span className="event-host">{event.host}</span>
                      <span className="event-cost">{event.cost}</span>
                    </div>
                    {event.link && (
                      <Link to={event.link} className="event-link">Go to Bracket →</Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
