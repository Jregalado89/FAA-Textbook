import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../utils/store';
import './ReaderHeader.css';

function ReaderHeader() {
  const navigate = useNavigate();
  const { nightMode } = useAppStore();

  return (
    <div className={`reader-header ${nightMode ? 'night-mode' : ''}`}>

      {/* Left: Library + Notes */}
      <div className="reader-left">
        <button className="header-icon-btn library-btn" onClick={() => navigate('/')}>
          🏛️ Library
        </button>
        <button className="header-icon-btn" onClick={() => navigate('/notes')}>
          📝 Notes
        </button>
      </div>

      {/* Center: Title */}
      <div className="reader-title">
        📘 Pilot's Handbook of Aeronautical Knowledge
      </div>

      {/* Right: Nav links + Settings */}
      <div className="reader-controls">
        <button className="header-icon-btn" onClick={() => navigate('/search')}>
          🔍 Search
        </button>
        <button className="header-icon-btn" onClick={() => navigate('/glossary')}>
          📖 Glossary
        </button>
        <button className="header-icon-btn" onClick={() => navigate('/acs')}>
          📋 ACS
        </button>
        <button className="header-icon-btn" onClick={() => navigate('/quizzes')}>
          🎯 Quizzes
        </button>
        <button className="header-icon-btn" onClick={() => navigate('/trainers')}>
          🎮 Trainers
        </button>
        <button className="header-icon-btn settings-btn" onClick={() => navigate('/settings')}>
          ⚙️ Settings
        </button>
      </div>

    </div>
  );
}

export default ReaderHeader;
