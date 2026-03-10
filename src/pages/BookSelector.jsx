import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../utils/store';
import './BookSelector.css';

const BOOKS = [
  {
    id: 'phak',
    title: "Pilot's Handbook of Aeronautical Knowledge",
    code: 'FAA-H-8083-25C',
    icon: '📘',
    description: 'Essential knowledge for all pilots. Covers aerodynamics, weather, navigation, and flight operations.',
    chapters: 17,
    pages: 584,
    available: true,
  },
  {
    id: 'afh',
    title: 'Airplane Flying Handbook',
    code: 'FAA-H-8083-3C',
    icon: '🛩️',
    description: 'Comprehensive guide to airplane flight maneuvers and procedures.',
    chapters: 15,
    pages: 432,
    available: false,
  },
  {
    id: 'ifh',
    title: 'Instrument Flying Handbook',
    code: 'FAA-H-8083-15B',
    icon: '☁️',
    description: 'Master instrument flight rules and procedures for IMC operations.',
    chapters: 12,
    pages: 398,
    available: false,
  },
  {
    id: 'amh',
    title: 'Aviation Maintenance Handbook',
    code: 'FAA-H-8083-30A',
    icon: '🔧',
    description: 'Comprehensive maintenance practices and procedures for aircraft.',
    chapters: 14,
    pages: 512,
    available: false,
  },
];

function BookSelector() {
  const navigate = useNavigate();
  const { readingProgress, bookmarks } = useAppStore();

  const handleBookClick = (book) => {
    if (!book.available) return;
    
    // Get last read position for this book
    const lastChapter = Object.keys(readingProgress).find(key => key.startsWith(book.id));
    if (lastChapter) {
      navigate(`/reader/${book.id}/${lastChapter.split('-')[1]}`);
    } else {
      navigate(`/reader/${book.id}/1`);
    }
  };

  const calculateProgress = (bookId) => {
    const bookChapters = Object.keys(readingProgress).filter(key => key.startsWith(bookId));
    if (bookChapters.length === 0) return 0;
    
    const book = BOOKS.find(b => b.id === bookId);
    if (!book) return 0;
    
    return Math.round((bookChapters.length / book.chapters) * 100);
  };

  const handleBookmarkClick = (bookmark) => {
    // Extract chapter number from page number (e.g., "7-12" -> chapter 7)
    const chapterNum = bookmark.split('-')[0];
    navigate(`/reader/phak/${chapterNum}`);
  };

  return (
    <div className="book-selector">
      <div className="book-selector-container">
        <header className="book-selector-header">
          <h1>✈️ Aviation Study Library</h1>
          <p>Your complete FAA handbook collection</p>
        </header>

        <div className="book-grid">
          {BOOKS.map((book, index) => {
            const progress = calculateProgress(book.id);
            
            return (
              <div
                key={book.id}
                className={`book-card card-${index + 1} ${!book.available ? 'disabled' : ''}`}
                onClick={() => handleBookClick(book)}
              >
                {book.available ? (
                  <span className="book-badge">Available</span>
                ) : (
                  <span className="book-badge coming-soon">Coming Soon</span>
                )}
                <div className="book-icon">{book.icon}</div>
                <h2>{book.title}</h2>
                <div className="book-code">{book.code}</div>
                <div className="book-description">{book.description}</div>
                <div className="book-stats">
                  <div className="book-stat">
                    <div className="book-stat-value">{book.chapters}</div>
                    <div className="book-stat-label">Chapters</div>
                  </div>
                  <div className="book-stat">
                    <div className="book-stat-value">{book.pages}</div>
                    <div className="book-stat-label">Pages</div>
                  </div>
                  <div className="book-stat">
                    <div className="book-stat-value">
                      {book.available ? `${progress}%` : '--'}
                    </div>
                    <div className="book-stat-label">Complete</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {bookmarks.length > 0 && (
          <div className="bookmarks-section">
            <h3>🔖 Bookmarks</h3>
            <div className="bookmarks-grid">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark}
                  className="bookmark-item"
                  onClick={() => handleBookmarkClick(bookmark)}
                >
                  <span className="bookmark-icon">🔖</span>
                  <div className="bookmark-info">
                    <div className="bookmark-page">Page {bookmark}</div>
                    <div className="bookmark-book">PHAK</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="recent-books">
          <h3>🕒 Recently Accessed</h3>
          <div className="recent-item" onClick={() => navigate('/reader/phak/7')}>
            <div className="recent-item-info">
              <span>📘</span>
              <div>
                <div>Pilot's Handbook of Aeronautical Knowledge</div>
                <div className="recent-item-page">Chapter 7: Aircraft Systems • Page 7-15</div>
              </div>
            </div>
            <div className="recent-time">2 hours ago</div>
          </div>
          <div className="recent-item" onClick={() => navigate('/reader/phak/5')}>
            <div className="recent-item-info">
              <span>📘</span>
              <div>
                <div>Pilot's Handbook of Aeronautical Knowledge</div>
                <div className="recent-item-page">Chapter 5: Aerodynamics • Page 5-8</div>
              </div>
            </div>
            <div className="recent-time">Yesterday</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookSelector;
