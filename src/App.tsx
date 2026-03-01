import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { ashen, gihan, joel, mrunal, rajat, shounak } from './components/AsssetsLoader';

// Import Swiper styles
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';

import BeerioKart from './pages/BeerioKart';
import Itinerary from './pages/Itinerary';
import Bomb from './pages/Bomb';
import Fireworks from './components/Fireworks';
import beersImg from './assets/beers.jpg';
import seltzerImg from './assets/seltzers.jpg';
import beeriokertImage from './assets/beeriokart.jpg';
import './App.css';

const GROOM = { 
  name: 'Ashen', 
  role: 'The Groom', 
  desc: 'The man of the hour. Taking his final lap as a free man.', 
  funFact: 'Legend has it he can navigate Rainbow Road blindfolded.',
  img:  ashen
};

const HOSTS_DATA = [
  { 
    name: 'Shounak', 
    role: 'Host', 
    desc: 'Tournament Director and master of chaos. If there is a beer, he is near.', 
    funFact: 'Has never lost a Beerio Kart match on a Tuesday.',
    img: shounak
  },
  { 
    name: 'Rajat', 
    role: 'Host', 
    desc: 'Casino Night visionary. Will likely take all your buy-in money.', 
    funFact: 'Banned from 3 major casinos for "knowing too much."',
    img: rajat
  },
  { 
    name: 'Joel', 
    role: 'Host', 
    desc: 'Logistics and "Special Entertainment" specialist. Knows all the best spots.', 
    funFact: 'Once convinced a stranger he was an Olympic Ping Pong champion.',
    img: joel 
  },
  { 
    name: 'Mrunal', 
    role: 'Host', 
    desc: 'The Tech Wizard. Managing VR, Escape Rooms, and the Hot Ones gauntlet.', 
    funFact: 'Can solve a Rubik\'s cube in under 30 seconds while eating a Ghost Pepper.',
    img: mrunal
  },
  { 
    name: 'Gihan', 
    role: 'Host', 
    desc: 'The Game Master. Handling the high-stakes Drinking Jenga challenges.', 
    funFact: 'His Jenga towers have stood through actual earthquakes.',
    img: gihan
  },
  { 
    name: 'Gabriel', 
    role: 'Host', 
    desc: 'The Enforcer. Keeping the energy high and the drinks flowing.', 
    funFact: 'Fluent in five languages, but only when drinking whiskey.',
    img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    name: 'Yash', 
    role: 'Host', 
    desc: 'The Hype Man. Every party needs a Yash to keep the vibe right.', 
    funFact: 'Has an encyclopedic knowledge of early 2000s rap lyrics.',
    img: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    name: 'Mustafa', 
    role: 'Host', 
    desc: 'The Wildcard. You never know what Mustafa is bringing to the table.', 
    funFact: 'Once won a staring contest with a literal mountain goat.',
    img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=800' 
  },
];

function Home() {
  const [shuffledHosts, setShuffledHosts] = useState(HOSTS_DATA);

  useEffect(() => {
    setShuffledHosts([...HOSTS_DATA].sort(() => Math.random() - 0.5));
  }, []);

  return (
    <div className="app landing-page">
      <div className="hero">
        <Fireworks />
        <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="main-title">Ashen's Bachelor Party</h1>
          <p className="subtitle">The Final Lap | March 6 - March 8, 2026</p>
          <div className="hero-actions">
            <Link to="/itinerary">
              <button className="primary hero-btn">View Master Plan</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="hosts-section">
        <h2 className="section-title">The Wolf Pack</h2>
        
        {/* Groom Profile - Top and Centered */}
        <div className="groom-container">
          <div className="host-card groom">
            <div className="host-image-container">
              <img src={GROOM.img} alt={GROOM.name} className="host-image" />
            </div>
            <div className="host-info">
              <h3 className="host-name">{GROOM.name}</h3>
              <span className="host-role">{GROOM.role}</span>
              <p className="host-desc">{GROOM.desc}</p>
              <div className="host-fun-fact">
                <strong>Fun Fact:</strong> {GROOM.funFact}
              </div>
            </div>
          </div>
        </div>

        {/* Shuffled Host Carousel */}
        <div className="hosts-carousel-container">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1440: { slidesPerView: 4 },
            }}
            className="hosts-swiper"
          >
            {shuffledHosts.map((host, i) => (
              <SwiperSlide key={i}>
                <div className="host-card carousel-card">
                  <div className="host-image-container">
                    <img src={host.img} alt={host.name} className="host-image" />
                  </div>
                  <div className="host-info">
                    <h3 className="host-name">{host.name}</h3>
                    <span className="host-role">{host.role}</span>
                    <p className="host-desc">{host.desc}</p>
                    <div className="host-fun-fact">
                      <strong>Fun Fact:</strong> {host.funFact}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="event-details">
        <div className="detail-card">
          <h3>The Mission</h3>
          <p>One final weekend of absolute chaos before the big day. No regrets, just memories (if we survive).</p>
          <img src={beersImg} alt="Cold Beers" className="detail-image" />
        </div>
        <div className="detail-card">
          <h3>The Legend</h3>
          <p>Ashen is finally hanging up his bachelor cape. We're here to make sure he goes out in style.</p>
          <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" alt="Whiskey Sour" className="detail-image" />
        </div>
        <div className="detail-card">
          <h3>The Warmup</h3>
          <p>Getting in the zone with the classics. Red cups out, balls in the air. Let's go.</p>
          <img src={seltzerImg} alt="Beer Pong & Red Cups" className="detail-image" />
        </div>
        <div className="detail-card">
          <h3>The Tournament</h3>
          <p>High stakes, cold beers, and high-speed karts. May the best racer win.</p>
          <img src={beeriokertImage} alt="Beerio Kart Tournament" className="detail-image" />
        </div>
        <div className="detail-card">
          <h3>The Stakes</h3>
          <p>Casino night. Losers are punished, winners take all. Watch your buy-in closely.</p>
          <img src="https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=800" alt="Casino Night" className="detail-image" />
        </div>
        <div className="detail-card">
          <h3>The Gauntlet</h3>
          <p>Hot wings, cold nerves. Survival is the only objective in the final showdown.</p>
          <img src="https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=800" alt="Hot Ones Gauntlet" className="detail-image" />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/beeriokart" element={<BeerioKart />} />
        <Route path="/snd" element={<Bomb />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
