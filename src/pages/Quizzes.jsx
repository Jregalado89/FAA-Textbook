import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import PageNavBar from '../components/PageNavBar';

import './Quizzes.css';

const QUIZZES = [
  // Chapter Quizzes
  {
    id: 'ch1-intro',
    title: 'Introduction to Flying',
    chapter: 1,
    difficulty: 'Easy',
    questions: 15,
    timeEstimate: '10 min',
    description: 'Test your knowledge of aviation history and FAA regulations',
    score: 87,
    completed: true,
    category: 'chapter'
  },
  {
    id: 'ch7-systems',
    title: 'Aircraft Systems',
    chapter: 7,
    difficulty: 'Medium',
    questions: 25,
    timeEstimate: '20 min',
    description: 'Pitot-static system, electrical systems, and more',
    score: 92,
    completed: true,
    category: 'chapter'
  },
  {
    id: 'ch5-aero',
    title: 'Aerodynamics of Flight',
    chapter: 5,
    difficulty: 'Hard',
    questions: 30,
    timeEstimate: '25 min',
    description: 'Forces, lift, drag, and flight characteristics',
    score: null,
    completed: false,
    category: 'chapter'
  },
  {
    id: 'ch12-weather',
    title: 'Weather Theory',
    chapter: 12,
    difficulty: 'Medium',
    questions: 20,
    timeEstimate: '15 min',
    description: 'Atmospheric conditions, clouds, and weather patterns',
    score: null,
    completed: false,
    category: 'chapter'
  },
  
  // Checkride Prep
  {
    id: 'ppl-oral',
    title: 'Private Pilot Oral Exam Prep',
    chapter: null,
    difficulty: 'Hard',
    questions: 50,
    timeEstimate: '45 min',
    description: 'Comprehensive oral exam preparation covering all topics',
    score: 78,
    completed: true,
    category: 'checkride',
    certificate: 'PPL'
  },
  {
    id: 'ppl-written',
    title: 'Private Pilot Written Test Simulator',
    chapter: null,
    difficulty: 'Hard',
    questions: 60,
    timeEstimate: '2.5 hrs',
    description: 'Full-length practice test matching FAA format',
    score: null,
    completed: false,
    category: 'checkride',
    certificate: 'PPL'
  },
  {
    id: 'ifr-prep',
    title: 'Instrument Rating Prep',
    chapter: null,
    difficulty: 'Hard',
    questions: 60,
    timeEstimate: '2 hrs',
    description: 'IFR procedures, regulations, and flight planning',
    score: null,
    completed: false,
    category: 'checkride',
    certificate: 'IFR',
    locked: true
  }
];

function Quizzes() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const filteredQuizzes = QUIZZES.filter(quiz => {
    if (activeTab === 'all') return true;
    if (activeTab === 'chapter') return quiz.category === 'chapter';
    if (activeTab === 'certificate') return quiz.category === 'checkride';
    if (activeTab === 'progress') return quiz.completed;
    return true;
  });

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': '#10b981',
      'Medium': '#f59e0b',
      'Hard': '#ef4444'
    };
    return colors[difficulty] || '#6b7280';
  };

  const handleQuizClick = (quiz) => {
    if (quiz.locked) {
      alert('This quiz will be available after completing Private Pilot certification');
      return;
    }
    // In a real app, this would navigate to quiz interface
    alert(`Starting quiz: ${quiz.title}\n\nQuiz interface coming soon!`);
  };

  const stats = {
    total: QUIZZES.length,
    completed: QUIZZES.filter(q => q.completed).length,
    avgScore: Math.round(
      QUIZZES.filter(q => q.score).reduce((sum, q) => sum + q.score, 0) /
      QUIZZES.filter(q => q.score).length
    )
  };

  return (
    <div className="quizzes-page">
      <PageNavBar />


      <div className="quizzes-container">
        <div className="quizzes-stats">
          <div className="quiz-stat">
            <div className="quiz-stat-value">{stats.total}</div>
            <div className="quiz-stat-label">Total Quizzes</div>
          </div>
          <div className="quiz-stat">
            <div className="quiz-stat-value">{stats.completed}</div>
            <div className="quiz-stat-label">Completed</div>
          </div>
          <div className="quiz-stat">
            <div className="quiz-stat-value">{stats.avgScore}%</div>
            <div className="quiz-stat-label">Avg Score</div>
          </div>
        </div>

        <div className="quizzes-tabs">
          <button
            className={`quiz-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Quizzes
          </button>
          <button
            className={`quiz-tab ${activeTab === 'chapter' ? 'active' : ''}`}
            onClick={() => setActiveTab('chapter')}
          >
            By Chapter
          </button>
          <button
            className={`quiz-tab ${activeTab === 'certificate' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificate')}
          >
            By Certificate
          </button>
          <button
            className={`quiz-tab ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            My Progress
          </button>
        </div>

        <div className="quizzes-grid">
          {filteredQuizzes.map(quiz => (
            <div
              key={quiz.id}
              className={`quiz-card ${quiz.locked ? 'locked' : ''}`}
              onClick={() => handleQuizClick(quiz)}
            >
              {quiz.locked && <div className="quiz-locked-badge">🔒 Locked</div>}
              
              <div className="quiz-card-header">
                <div
                  className="quiz-difficulty"
                  style={{ background: getDifficultyColor(quiz.difficulty) }}
                >
                  {quiz.difficulty}
                </div>
                {quiz.chapter && (
                  <div className="quiz-chapter">Chapter {quiz.chapter}</div>
                )}
                {quiz.certificate && (
                  <div className="quiz-certificate">{quiz.certificate}</div>
                )}
              </div>

              <h3 className="quiz-title">{quiz.title}</h3>
              <p className="quiz-description">{quiz.description}</p>

              <div className="quiz-meta">
                <span className="quiz-questions">📋 {quiz.questions} questions</span>
                <span className="quiz-time">⏱️ {quiz.timeEstimate}</span>
              </div>

              {quiz.completed && quiz.score !== null ? (
                <div className="quiz-progress">
                  <div className="quiz-score">Score: {quiz.score}%</div>
                  <div className="quiz-progress-bar">
                    <div
                      className="quiz-progress-fill"
                      style={{
                        width: `${quiz.score}%`,
                        background: quiz.score >= 80 ? '#10b981' : quiz.score >= 70 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                </div>
              ) : (
                <button className="quiz-start-btn">
                  {quiz.locked ? '🔒 Locked' : 'Start Quiz →'}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="create-custom-quiz">
          <button className="custom-quiz-btn">
            ➕ Create Custom Quiz
          </button>
          <p className="custom-quiz-hint">
            Select chapters and difficulty to create your own practice quiz
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Quizzes;