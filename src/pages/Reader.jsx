import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../utils/store';
import { phakData } from '../data/phakContent';
import { glossaryData } from '../data/glossaryData';
import ChapterSidebar from '../components/ChapterSidebar';
import NotesSidebar from '../components/NotesSidebar';
import ReaderHeader from '../components/ReaderHeader';
import PageNavigation from '../components/PageNavigation';
import ContentRenderer from '../components/ContentRenderer';
import Footer from '../components/Footer';
import './Reader.css';

function Reader() {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    leftSidebarOpen,
    rightSidebarOpen,
    fontSize,
    nightMode,
    toggleLeftSidebar,
    toggleRightSidebar,
    updateReadingProgress,
  } = useAppStore();

  const [currentChapter, setCurrentChapter] = React.useState(null);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);

  useEffect(() => {
    if (nightMode) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
  }, [nightMode]);

  useEffect(() => {
    if (bookId === 'phak') {
      const targetChapter = chapterId ? parseInt(chapterId) : 1;
      const chapter = phakData.chapters.find(
        (ch) => ch.chapter_number === targetChapter
      );
      if (chapter) {
        setCurrentChapter(chapter);
        // Check for ?page=X-Y query param
        const params = new URLSearchParams(location.search);
        const targetPage = params.get('page');
        if (targetPage) {
          const pageIndex = chapter.pages.findIndex(
            (p) => p.page_number === targetPage
          );
          setCurrentPageIndex(pageIndex > -1 ? pageIndex : 0);
        } else {
          setCurrentPageIndex(0);
        }
      } else {
        navigate('/reader/phak/1');
      }
    }
  }, [bookId, chapterId, location.search, navigate]);

  useEffect(() => {
    if (currentChapter) {
      const page = currentChapter.pages[currentPageIndex];
      if (page) {
        updateReadingProgress(currentChapter.chapter_id, page.page_number);
      }
    }
  }, [currentChapter, currentPageIndex, updateReadingProgress]);

  const contentRef = React.useRef(null);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      scrollToTop();
    }
  };

  const handleNextPage = () => {
    if (currentChapter && currentPageIndex < currentChapter.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      scrollToTop();
    }
  };

  const handlePageJump = (pageNum) => {
    const index = parseInt(pageNum) - 1;
    if (index >= 0 && currentChapter && index < currentChapter.pages.length) {
      setCurrentPageIndex(index);
      scrollToTop();
    }
  };

  if (!currentChapter) {
    return (
      <div className="reader-loading">
        <p>Loading...</p>
      </div>
    );
  }

  const currentPage = currentChapter.pages[currentPageIndex];

  if (!currentPage) {
    return (
      <div className="reader-loading">
        <p>Loading page...</p>
      </div>
    );
  }

  const totalPages = currentChapter.pages.length;
  const progress = ((currentPageIndex + 1) / totalPages) * 100;

  return (
    <div className={`reader-page ${nightMode ? 'night-mode' : ''}`}>
      <ReaderHeader />

      <div className="reader-container">
        {/* Left sidebar rail */}
        <div className={`sidebar-rail left ${!leftSidebarOpen ? 'visible' : ''}`}>
          <button className="rail-hamburger" onClick={toggleLeftSidebar} title="Show chapters">☰</button>
          <button className="rail-arrow" onClick={handlePrevPage} disabled={currentPageIndex === 0} title="Previous page">‹</button>
        </div>

        {/* Right sidebar rail */}
        <div className={`sidebar-rail right ${!rightSidebarOpen ? 'visible' : ''}`}>
          <button className="rail-arrow" onClick={handleNextPage} disabled={currentPageIndex >= totalPages - 1} title="Next page">›</button>
          <button className="rail-hamburger" onClick={toggleRightSidebar} title="Show notes">☰</button>
        </div>

        {/* Chapter Sidebar */}
        <ChapterSidebar
          isOpen={leftSidebarOpen}
          chapters={phakData.chapters}
          currentChapterId={currentChapter.chapter_id}
        />

        {/* Main Content — scrolls independently, footer lives inside */}
        <div
          ref={contentRef}
          className={`content-area ${!leftSidebarOpen || !rightSidebarOpen ? 'expanded' : ''}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="content-area-inner">
            <div className="content-top-nav">
              <button className="content-nav-arrow" onClick={handlePrevPage} disabled={currentPageIndex === 0}>← Prev</button>
              <span className="content-nav-label">
                Chapter {currentChapter.chapter_number} &bull; Page {currentPage.page_number.split('-')[1] || currentPage.page_number} of {totalPages}
              </span>
              <button className="content-nav-arrow" onClick={handleNextPage} disabled={currentPageIndex >= totalPages - 1}>Next →</button>
            </div>

            <div className="page-header">
              <h1 className="chapter-title">
                {currentPage.page_title || currentPage.sections[0]?.title || currentChapter.title}
              </h1>
              <div className="page-number">
                Chapter {currentChapter.chapter_number} • Page {currentPage.page_number.split('-')[1] || currentPage.page_number}
              </div>
            </div>

            <ContentRenderer
              sections={currentPage.sections}
              glossaryData={glossaryData}
              currentPage={currentPage.page_number}
            />
          </div>

          <PageNavigation
            currentPage={currentPageIndex + 1}
            totalPages={totalPages}
            progress={progress}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
            onJump={handlePageJump}
            hasPrev={currentPageIndex > 0}
            hasNext={currentPageIndex < totalPages - 1}
            pageNumber={currentPage.page_number}
          />

          <Footer />
        </div>

        {/* Notes Sidebar */}
        <NotesSidebar
          isOpen={rightSidebarOpen}
          currentPage={currentPage.page_number}
          chapterId={currentChapter.chapter_id}
        />
      </div>
    </div>
  );
}

export default Reader;
