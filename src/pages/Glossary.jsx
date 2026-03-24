import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { glossaryData } from '../data/glossaryData';
import Footer from '../components/Footer';
import PageNavBar from '../components/PageNavBar';
import './Glossary.css';

// Build pages: # for numbers, then A-Z
const NUMBER_PAGE = '#';

function buildPages(terms) {
  const grouped = {};
  terms.forEach(({ term, definition }) => {
    const first = term[0];
    const key = /[0-9]/.test(first) ? NUMBER_PAGE : first.toUpperCase();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ term, definition });
  });
  // Sort each group alphabetically
  Object.keys(grouped).forEach(k => {
    grouped[k].sort((a, b) => a.term.localeCompare(b.term));
  });
  return grouped;
}

// Page order: # first, then A-Z
function getPageOrder(grouped) {
  const letters = Object.keys(grouped).filter(k => k !== NUMBER_PAGE).sort();
  return grouped[NUMBER_PAGE] ? [NUMBER_PAGE, ...letters] : letters;
}

function Glossary() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState('all'); // 'all' or a letter key

  const allTerms = useMemo(() => glossaryData, []);

  const grouped = useMemo(() => buildPages(allTerms), [allTerms]);
  const pageOrder = useMemo(() => getPageOrder(grouped), [grouped]);

  // Search — always shows all results flat
  const searchResults = useMemo(() => {
    if (!searchQuery) return null;
    const q = searchQuery.toLowerCase();
    return allTerms.filter(
      ({ term, definition }) =>
        term.toLowerCase().includes(q) || definition.toLowerCase().includes(q)
    ).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, allTerms]);

  // Current page terms (when not searching)
  const currentTerms = useMemo(() => {
    if (activePage === 'all') return null; // handled by grouped view
    return grouped[activePage] || [];
  }, [activePage, grouped]);

  const currentPageIndex = activePage === 'all' ? -1 : pageOrder.indexOf(activePage);
  const totalLetterPages = pageOrder.length;

  const goToPage = (key) => {
    setActivePage(key);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goPrev = () => {
    if (activePage === 'all') return;
    const idx = pageOrder.indexOf(activePage);
    if (idx > 0) goToPage(pageOrder[idx - 1]);
    else goToPage('all');
  };

  const goNext = () => {
    if (activePage === 'all') {
      goToPage(pageOrder[0]);
      return;
    }
    const idx = pageOrder.indexOf(activePage);
    if (idx < pageOrder.length - 1) goToPage(pageOrder[idx + 1]);
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="highlight">{part}</mark>
        : part
    );
  };

  const renderTerms = (terms) =>
    terms.map(({ term, definition }) => (
      <div key={term} className="term-card">
        <div className="term-name">{highlightText(term, searchQuery)}</div>
        <div className="term-definition">{highlightText(definition, searchQuery)}</div>
      </div>
    ));

  const renderGrouped = (data, order) =>
    order.map(key => (
      <div key={key} className="letter-section">
        <h2 className="letter-header">{key}</h2>
        <div className="terms-list">{renderTerms(data[key])}</div>
      </div>
    ));

  const isFirstPage = activePage === 'all';
  const isLastPage = activePage === pageOrder[pageOrder.length - 1];

  return (
    <div className="glossary-page">
      <PageNavBar />

      <div className="glossary-container">
        {/* Toolbar */}
        <div className="glossary-toolbar">
          <div className="glossary-stats">
            <div className="stat-value">{allTerms.length}</div>
            <div className="stat-label">Total Terms</div>
          </div>
          <input
            type="text"
            className="glossary-search"
            placeholder="Search terms or definitions..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setActivePage('all'); }}
          />
          <button className="clear-filter" onClick={() => { setSearchQuery(''); setActivePage('all'); }}>
            Clear Filter
          </button>
        </div>

        {/* Letter nav */}
        <div className="alphabet-nav">
          <button
            className={`letter-btn ${activePage === 'all' ? 'active' : ''}`}
            onClick={() => goToPage('all')}
          >All</button>
          {pageOrder.map(key => (
            <button
              key={key}
              className={`letter-btn ${activePage === key ? 'active' : ''}`}
              onClick={() => goToPage(key)}
            >{key}</button>
          ))}
        </div>

        {/* Content */}
        {searchResults ? (
          <div className="glossary-content">
            <div className="results-info">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
            </div>
            <div className="terms-list">{renderTerms(searchResults)}</div>
          </div>
        ) : activePage === 'all' ? (
          <div className="glossary-content">
            <div className="results-info">All {allTerms.length} terms</div>
            {renderGrouped(grouped, pageOrder)}
          </div>
        ) : (
          <div className="glossary-content">
            <div className="results-info">
              {currentTerms.length} term{currentTerms.length !== 1 ? 's' : ''} — Section &ldquo;{activePage}&rdquo;
            </div>
            <div className="letter-section">
              <h2 className="letter-header">{activePage}</h2>
              <div className="terms-list">{renderTerms(currentTerms)}</div>
            </div>
          </div>
        )}

        {/* Page navigation */}
        {!searchQuery && (
          <div className="glossary-page-nav">
            <button
              className="gloss-nav-btn"
              onClick={goPrev}
              disabled={isFirstPage}
            >← Previous</button>

            <span className="gloss-nav-label">
              {activePage === 'all'
                ? `All Terms (${totalLetterPages} sections)`
                : `Section ${activePage} (${currentPageIndex + 1} of ${totalLetterPages})`
              }
            </span>

            <button
              className="gloss-nav-btn"
              onClick={goNext}
              disabled={isLastPage}
            >Next →</button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Glossary;
