import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import PageNavBar from '../components/PageNavBar';
import './Trainers.css';

const TRAINERS = [
  // Flight Instruments
  {
    id: 'pitot-static',
    title: 'Pitot-Static System Simulator',
    category: 'instruments',
    description: 'Interactive simulation showing how different blockages affect instrument readings. Toggle blockages and see real-time effects.',
    features: [
      { icon: '🎨', label: 'Visual diagrams' },
      { icon: '📊', label: 'Real-time feedback' },
      { icon: '🛠️', label: 'Toggle blockages' },
    ],
    timeEstimate: '10-15 min',
    badge: 'Popular',
    badgeIcon: '🔥',
    badgeType: 'popular',
    type: 'Interactive',
    gradient: 'linear-gradient(135deg, #3b5bdb 0%, #7048e8 100%)',
    icon: '🎯',
  },
  {
    id: 'instrument-scan',
    title: 'Instrument Scan Trainer',
    category: 'instruments',
    description: 'Practice your instrument scan pattern with timed exercises. Identify instrument errors before they become problems.',
    features: [
      { icon: '🔴', label: 'Scan patterns' },
      { icon: '⏱️', label: 'Timed practice' },
      { icon: '📝', label: 'Track progress' },
    ],
    timeEstimate: '5-20 min',
    badge: 'New',
    badgeIcon: '⭐',
    badgeType: 'new',
    type: 'Interactive',
    gradient: 'linear-gradient(135deg, #1971c2 0%, #4c6ef5 100%)',
    icon: '📐',
  },
  {
    id: 'gyro-instruments',
    title: 'Gyroscopic Instruments',
    category: 'instruments',
    description: 'Understand attitude indicators, heading indicators, and turn coordinators through 3D interactive models.',
    features: [
      { icon: '🧊', label: '3D models' },
      { icon: '🎮', label: 'Manipulate axes' },
      { icon: '🌐', label: 'Learn modes' },
    ],
    timeEstimate: '15-25 min',
    badge: null,
    type: 'Interactive',
    gradient: 'linear-gradient(135deg, #0c8599 0%, #3bc9db 100%)',
    icon: '🔴',
  },

  // Navigation
  {
    id: 'vor-trainer',
    title: 'VOR Navigation Trainer',
    category: 'navigation',
    description: 'Learn to intercept and track VOR radials with interactive exercises. Practice wind correction angles.',
    features: [
      { icon: '📡', label: 'Radial tracking' },
      { icon: '💨', label: 'Wind correction' },
      { icon: '🗺️', label: 'Intercept practice' },
    ],
    timeEstimate: '20-30 min',
    badge: 'Popular',
    badgeIcon: '🔥',
    badgeType: 'popular',
    type: 'Interactive',
    gradient: 'linear-gradient(135deg, #c2255c 0%, #e64980 100%)',
    icon: '📡',
  },
  {
    id: 'e6b-computer',
    title: 'E6B Flight Computer',
    category: 'navigation',
    description: 'Digital E6B for time-speed-distance, wind correction, and fuel calculations with step-by-step guidance.',
    features: [
      { icon: '🧮', label: 'All calculations' },
      { icon: '📖', label: 'Step-by-step' },
      { icon: '💾', label: 'Save results' },
    ],
    timeEstimate: '10 min',
    badge: 'New',
    badgeIcon: '⭐',
    badgeType: 'new',
    type: 'Tool',
    gradient: 'linear-gradient(135deg, #2f9e44 0%, #40c057 100%)',
    icon: '🧮',
  },

  // Weather
  {
    id: 'metar-decoder',
    title: 'METAR Decoder Trainer',
    category: 'weather',
    description: 'Practice decoding real-world METAR weather reports with instant feedback and full explanations.',
    features: [
      { icon: '🌦️', label: 'Real METARs' },
      { icon: '✅', label: 'Instant feedback' },
      { icon: '💡', label: 'Explanation mode' },
    ],
    timeEstimate: '15 min',
    badge: null,
    type: 'Interactive',
    gradient: 'linear-gradient(135deg, #e67700 0%, #fcc419 100%)',
    icon: '🌤️',
  },
  {
    id: 'weather-patterns',
    title: 'Weather Pattern Recognition',
    category: 'weather',
    description: 'Identify cloud types, fronts, and weather systems from real aviation images and satellite photos.',
    features: [
      { icon: '📸', label: 'Photo quiz' },
      { icon: '🔍', label: 'Pattern matching' },
      { icon: '📚', label: 'Explanation' },
    ],
    timeEstimate: '20 min',
    badge: null,
    type: 'Quiz',
    gradient: 'linear-gradient(135deg, #7048e8 0%, #da77f2 100%)',
    icon: '🌩️',
  },
];

const CATEGORIES = {
  instruments: { title: 'Flight Instruments', icon: '🛠️' },
  navigation:  { title: 'Navigation',         icon: '🧭' },
  weather:     { title: 'Weather',            icon: '🌦️' },
};

function Trainers() {
  const [activeTab, setActiveTab] = useState('all');

  const handleLaunch = (trainer) => {
    alert(`Launching: ${trainer.title}\n\nInteractive trainer coming soon!`);
  };

  const visibleTrainers = (cat) =>
    TRAINERS.filter(t => t.category === cat);

  return (
    <div className="trainers-page">
      <PageNavBar />

      <div className="trainers-container">
        {/* Hero intro */}
        <div className="trainers-intro">
          <h2>Learn by Doing</h2>
          <p>Interactive simulations and practice tools to master aviation concepts</p>
        </div>

        {/* Tab bar */}
        <div className="trainers-tabs">
          {['all','chapter','category','progress'].map(tab => (
            <button
              key={tab}
              className={`trainer-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all'      ? 'All Trainers'  :
               tab === 'chapter' ? 'By Chapter'    :
               tab === 'category'? 'By Category'   : 'My Progress'}
            </button>
          ))}
        </div>

        {/* Category sections */}
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <div key={key} className="trainer-category">
            <h3 className="category-title">{cat.icon} {cat.title}</h3>
            <div className="trainers-grid">
              {visibleTrainers(key).map(trainer => (
                <div key={trainer.id} className="trainer-card">
                  {/* Gradient image area */}
                  <div className="trainer-preview" style={{ background: trainer.gradient }}>
                    <span className="trainer-preview-icon">{trainer.icon}</span>
                    <span className="trainer-type-badge">{trainer.type}</span>
                  </div>

                  {/* Card body */}
                  <div className="trainer-content">
                    <h4 className="trainer-title">{trainer.title}</h4>
                    <p className="trainer-description">{trainer.description}</p>

                    {/* Feature tag pills */}
                    <div className="trainer-feature-pills">
                      {trainer.features.map((f, i) => (
                        <span key={i} className="trainer-feature-pill">
                          {f.icon} {f.label}
                        </span>
                      ))}
                    </div>

                    {/* Footer: time + badge + launch */}
                    <div className="trainer-meta">
                      <span className="trainer-time">⏱️ {trainer.timeEstimate}</span>
                      {trainer.badge && (
                        <span className={`trainer-badge trainer-badge-${trainer.badgeType}`}>
                          {trainer.badgeIcon} {trainer.badge}
                        </span>
                      )}
                      <button className="trainer-launch-btn" onClick={() => handleLaunch(trainer)}>
                        Launch →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Coming soon */}
        <div className="coming-soon-section">
          <h3>🚀 Coming Soon</h3>
          <div className="coming-soon-grid">
            {[
              { icon: '📐', title: 'Cross-Country Planner' },
              { icon: '📊', title: 'Weight & Balance Calculator' },
              { icon: '🎯', title: 'Landing Pattern Simulator' },
            ].map(item => (
              <div key={item.title} className="coming-soon-card">
                <div className="coming-soon-icon">{item.icon}</div>
                <div className="coming-soon-title">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Trainers;
