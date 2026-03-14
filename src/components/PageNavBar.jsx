import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../utils/store';
import './PageNavBar.css';

function PageNavBar({ title, icon }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentBook, currentPage } = useAppStore();

  const links = [
    { path: '/search', label: '🔍 Search' },
    { path: '/glossary', label: '📖 Glossary' },
    { path: '/notes', label: '📝 Notes' },
    { path: '/quizzes', label: '📋 Quizzes' },
    { path: '/trainers', label: '🎮 Trainers' },
  ];

  return (
    <div className="page-nav-bar">
      <div className="page-nav-left">
        <button className="page-nav-back" onClick={() => navigate(-1)} title="Back">
          ← Back
        </button>
        <button className="page-nav-home" onClick={() => navigate(`/reader/${currentBook}/${currentPage}`)} title="Back to Reading">
          📘 Home
        </button>
      </div>
      <div className="page-nav-title" onClick={() => navigate(`/reader/${currentBook}/${currentPage}`)}>
        📘 Pilot's Handbook of Aeronautical Knowledge
      </div>
      <div className="page-nav-links">
        {links.map((link) => (
          <button
            key={link.path}
            className={`page-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PageNavBar;
