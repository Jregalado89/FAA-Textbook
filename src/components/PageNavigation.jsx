import React, { useState } from 'react';
import { useAppStore } from '../utils/store';
import './PageNavigation.css';

function PageNavigation({
  currentPage,
  totalPages,
  progress,
  onPrev,
  onNext,
  onJump,
  hasPrev,
  hasNext,
  pageNumber
}) {
  const [jumpValue, setJumpValue] = useState(currentPage);
  const { bookmarks, toggleBookmark } = useAppStore();
  
  const isBookmarked = pageNumber && bookmarks.includes(pageNumber);

  const handleJump = () => {
    const pageNum = parseInt(jumpValue);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onJump(pageNum);
    }
  };

  const handleBookmarkClick = () => {
    if (pageNumber) {
      toggleBookmark(pageNumber);
    }
  };

  return (
    <div className="page-navigation">
      <button
        className="nav-btn"
        onClick={onPrev}
        disabled={!hasPrev}
      >
        ← Previous Page
      </button>

      <div className="page-jump">
        <span className="jump-label">Jump to:</span>
        <input
          type="number"
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleJump()}
          min="1"
          max={totalPages}
        />
        <span className="jump-total">of {totalPages}</span>
      </div>

      <button 
        className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
        onClick={handleBookmarkClick}
        title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {isBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
      </button>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <button
        className="nav-btn"
        onClick={onNext}
        disabled={!hasNext}
      >
        Next Page →
      </button>
    </div>
  );
}

export default PageNavigation;
