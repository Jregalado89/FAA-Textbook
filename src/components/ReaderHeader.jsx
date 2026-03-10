import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../utils/store';
import './ReaderHeader.css';

function ReaderHeader() {
  const navigate = useNavigate();
  const {
    fontSize,
    nightMode,
    increaseFontSize,
    decreaseFontSize,
    toggleNightMode,
  } = useAppStore();

  return (
    <div className="reader-header">
      <div className="reader-title" onClick={() => navigate('/')}>
        📘 Pilot's Handbook of Aeronautical Knowledge
      </div>
      <div className="reader-controls">
        <div className="text-size-btns">
          <button className="text-btn" onClick={decreaseFontSize}>
            A−
          </button>
          <button className="text-btn" onClick={increaseFontSize}>
            A+
          </button>
        </div>
        <button className="header-icon-btn" onClick={() => navigate('/search')}>
          🔍 Search
        </button>
        <button className="header-icon-btn" onClick={() => navigate('/glossary')}>
          📖 Glossary
        </button>
        <button className="header-icon-btn" onClick={() => navigate('/notes')}>
          📝 All Notes
        </button>
        <button className="header-icon-btn" onClick={() => navigate('/quizzes')}>
          📋 Quizzes
        </button>
        <button className="header-icon-btn" onClick={() => navigate('/trainers')}>
          🎮 Trainers
        </button>
        <button
          className="header-icon-btn"
          onClick={toggleNightMode}
          title="Night mode coming soon"
        >
          🌙 Night
        </button>
      </div>
    </div>
  );
}

export default ReaderHeader;
