import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Trainers.css';

const TRAINERS = [
  // Flight Instruments
  {
    id: 'pitot-static',
    title: 'Pitot-Static System Simulator',
    category: 'instruments',
    description: 'Interactive simulation showing how the pitot-static system responds to different flight conditions',
    features: ['Real-time feedback', 'Failure scenarios', 'Visual indicators'],
    timeEstimate: '15 min',
    difficulty: 'Medium',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'instrument-scan',
    title: 'Instrument Scan Trainer',
    category: 'instruments',
    description: 'Practice the proper scan pattern for the six-pack of flight instruments',
    features: ['Pattern practice', 'Timed drills', 'Scenario-based'],
    timeEstimate: '20 min',
    difficulty: 'Easy',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'gyro-instruments',
    title: 'Gyroscopic Instruments',
    category: 'instruments',
    description: 'Understand how attitude indicator, heading indicator, and turn coordinator work',
    features: ['3D visualization', 'Precession demo', 'Interactive controls'],
    timeEstimate: '25 min',
    difficulty: 'Hard',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },

  // Navigation
  {
    id: 'vor-trainer',
    title: 'VOR Navigation Trainer',
    category: 'navigation',
    description: 'Learn to intercept and track VOR radials with interactive practice',
    features: ['Radial tracking', 'Intercept practice', 'Wind correction'],
    timeEstimate: '30 min',
    difficulty: 'Hard',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 'e6b-computer',
    title: 'E6B Flight Computer',
    category: 'navigation',
    description: 'Digital E6B for time-speed-distance, wind correction, and fuel calculations',
    features: ['All calculations', 'Step-by-step', 'Save results'],
    timeEstimate: '10 min',
    difficulty: 'Easy',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  },

  // Weather
  {
    id: 'metar-decoder',
    title: 'METAR Decoder Trainer',
    category: 'weather',
    description: 'Practice decoding real-world METAR weather reports',
    features: ['Real METARs', 'Instant feedback', 'Explanation mode'],
    timeEstimate: '15 min',
    difficulty: 'Medium',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    id: 'weather-patterns',
    title: 'Weather Pattern Recognition',
    category: 'weather',
    description: 'Identify cloud types, fronts, and weather systems from images',
    features: ['Photo quiz', 'Pattern matching', 'Explanation'],
    timeEstimate: '20 min',
    difficulty: 'Medium',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  }
];

function Trainers() {
  const navigate = useNavigate();

  const categories = {
    instruments: { title: 'Flight Instruments', icon: '🛠️' },
    navigation: { title: 'Navigation', icon: '🧭' },
    weather: { title: 'Weather', icon: '🌦️' }
  };

  const handleTrainerClick = (trainer) => {
    // In a real app, this would launch the trainer
    alert(`Launching trainer: ${trainer.title}\n\nInteractive trainer coming soon!`);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': '#10b981',
      'Medium': '#f59e0b',
      'Hard': '#ef4444'
    };
    return colors[difficulty] || '#6b7280';
  };

  return (
    <div className="trainers-page">
      <div className="trainers-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Library
        </button>
        <h1>🎮 Interactive Trainers</h1>
      </div>

      <div className="trainers-container">
        <div className="trainers-intro">
          <h2>Learn by Doing</h2>
          <p>Interactive simulations and practice tools to master aviation concepts</p>
        </div>

        {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
          const categoryTrainers = TRAINERS.filter(t => t.category === categoryKey);
          
          return (
            <div key={categoryKey} className="trainer-category">
              <h3 className="category-title">
                {categoryInfo.icon} {categoryInfo.title}
              </h3>
              <div className="trainers-grid">
                {categoryTrainers.map(trainer => (
                  <div
                    key={trainer.id}
                    className="trainer-card"
                    onClick={() => handleTrainerClick(trainer)}
                  >
                    <div
                      className="trainer-preview"
                      style={{ background: trainer.gradient }}
                    >
                      <div className="trainer-difficulty"
                        style={{ background: getDifficultyColor(trainer.difficulty) }}
                      >
                        {trainer.difficulty}
                      </div>
                    </div>

                    <div className="trainer-content">
                      <h4 className="trainer-title">{trainer.title}</h4>
                      <p className="trainer-description">{trainer.description}</p>

                      <div className="trainer-features">
                        {trainer.features.map((feature, idx) => (
                          <span key={idx} className="trainer-feature">
                            ✓ {feature}
                          </span>
                        ))}
                      </div>

                      <div className="trainer-meta">
                        <span className="trainer-time">⏱️ {trainer.timeEstimate}</span>
                        <button className="trainer-launch-btn">
                          Launch →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="coming-soon-section">
          <h3>🚀 Coming Soon</h3>
          <div className="coming-soon-grid">
            <div className="coming-soon-card">
              <div className="coming-soon-icon">📐</div>
              <div className="coming-soon-title">Cross-Country Planner</div>
            </div>
            <div className="coming-soon-card">
              <div className="coming-soon-icon">📊</div>
              <div className="coming-soon-title">Weight & Balance Calculator</div>
            </div>
            <div className="coming-soon-card">
              <div className="coming-soon-icon">🎯</div>
              <div className="coming-soon-title">Landing Pattern Simulator</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trainers;