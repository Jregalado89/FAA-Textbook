import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChapterSidebar.css';

function ChapterSidebar({ isOpen, chapters, currentChapterId }) {
  const navigate = useNavigate();

  const handleChapterClick = (chapterNum) => {
    navigate(`/reader/phak/${chapterNum}`);
  };

  return (
    <div className={`chapter-sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h3>Chapters</h3>
      </div>
      {chapters.map((chapter) => (
        <div
          key={chapter.chapter_id}
          className={`chapter-item ${
            chapter.chapter_id === currentChapterId ? 'active' : ''
          }`}
          onClick={() => handleChapterClick(chapter.chapter_number)}
        >
          <div className="chapter-number">CHAPTER {chapter.chapter_number}</div>
          <div className="chapter-name">
            {chapter.emoji} {chapter.title}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChapterSidebar;
