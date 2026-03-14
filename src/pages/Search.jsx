import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { phakData } from '../data/phakContent';
import { glossaryData } from '../data/glossaryData';
import { useAppStore } from '../utils/store';
import Footer from '../components/Footer';
import PageNavBar from '../components/PageNavBar';
import './Search.css';

const POPULAR_TOPICS = [
  { label: 'Pitot-static system', icon: '🌡️' },
  { label: 'VFR weather minimums', icon: '☁️' },
  { label: 'Density altitude', icon: '📈' },
  { label: 'Airspace classes', icon: '🗺️' },
  { label: 'Weight and balance', icon: '⚖️' },
  { label: 'Four forces of flight', icon: '✈️' },
  { label: 'Stall speed', icon: '⚠️' },
  { label: 'METAR', icon: '🌦️' },
];

const QUICK_CATEGORIES = [
  { label: 'Aerodynamics',     icon: '🔬', chapter: 5  },
  { label: 'Weather',          icon: '🌤️', chapter: 12 },
  { label: 'Navigation',       icon: '🧭', chapter: 16 },
  { label: 'Aircraft Systems', icon: '⚙️', chapter: 7  },
  { label: 'Regulations',      icon: '📋', chapter: 1  },
  { label: 'Airports',         icon: '🛬', chapter: 14 },
];

const RECENT_KEY = 'phak_recent_searches';

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); }
  catch { return []; }
}

function saveRecent(query) {
  const prev = getRecent().filter(q => q !== query);
  const next = [query, ...prev].slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

function clearRecent() {
  localStorage.removeItem(RECENT_KEY);
}

function Search() {
  const navigate = useNavigate();
  const { notes } = useAppStore();

  const [searchQuery, setSearchQuery]   = useState('');
  const [results, setResults]           = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy]             = useState('relevance');
  const [recentSearches, setRecentSearches] = useState(getRecent());

  useEffect(() => {
    if (searchQuery.length >= 2) {
      performSearch(searchQuery);
    } else {
      setResults([]);
    }
  }, [searchQuery, activeFilter, sortBy]);

  const performSearch = (query) => {
    const searchResults = [];
    const lowerQuery = query.toLowerCase();

    if (activeFilter === 'all' || activeFilter === 'content') {
      phakData.chapters.forEach((chapter) => {
        chapter.pages.forEach((page) => {
          page.sections.forEach((section) => {
            if (section.title.toLowerCase().includes(lowerQuery)) {
              searchResults.push({ type: 'content', title: section.title, chapter: chapter.chapter_number, chapterTitle: chapter.title, page: page.page_number, snippet: section.title, relevance: 10 });
            }
            section.content.forEach((item) => {
              if (item.type === 'paragraph' && item.text.toLowerCase().includes(lowerQuery)) {
                const snippetStart = Math.max(0, item.text.toLowerCase().indexOf(lowerQuery) - 60);
                const snippet = item.text.substring(snippetStart, snippetStart + 200);
                searchResults.push({ type: 'content', title: section.title, chapter: chapter.chapter_number, chapterTitle: chapter.title, page: page.page_number, snippet, relevance: 5 });
              }
            });
          });
        });
      });
    }

    if (activeFilter === 'all' || activeFilter === 'glossary') {
      Object.entries(glossaryData).forEach(([term, data]) => {
        if (term.includes(lowerQuery) || data.definition.toLowerCase().includes(lowerQuery)) {
          searchResults.push({ type: 'glossary', title: term, snippet: data.definition, relevance: term.includes(lowerQuery) ? 8 : 3 });
        }
      });
    }

    if (activeFilter === 'all' || activeFilter === 'notes') {
      notes.forEach((note) => {
        if (note.content.toLowerCase().includes(lowerQuery)) {
          searchResults.push({ type: 'notes', title: `Note on Page ${note.page}`, snippet: note.content, page: note.page, tags: note.tags || [], relevance: 6 });
        }
      });
    }

    if (sortBy === 'relevance') searchResults.sort((a, b) => b.relevance - a.relevance);
    else if (sortBy === 'chapter') searchResults.sort((a, b) => (a.chapter || 999) - (b.chapter || 999));

    setResults(searchResults);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      saveRecent(query);
      setRecentSearches(getRecent());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.length >= 2) {
      saveRecent(searchQuery);
      setRecentSearches(getRecent());
    }
  };

  const handleClearRecent = () => {
    clearRecent();
    setRecentSearches([]);
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="search-highlight">{part}</mark>
        : part
    );
  };

  const getResultCount = (type) =>
    type === 'all' ? results.length : results.filter(r => r.type === type).length;

  const handleResultClick = (result) => {
    saveRecent(searchQuery);
    setRecentSearches(getRecent());
    if (result.type === 'content') navigate(`/reader/phak/${result.chapter}`);
    else if (result.type === 'glossary') navigate('/glossary');
    else if (result.type === 'notes') navigate('/notes');
  };

  const typeBadgeStyle = (type) => {
    const map = {
      content:  { bg: '#eff6ff', color: '#2563eb' },
      glossary: { bg: '#f0fdf4', color: '#16a34a' },
      notes:    { bg: '#fef9c3', color: '#854d0e' },
    };
    return map[type] || { bg: '#f3f4f6', color: '#374151' };
  };

  const isEmpty = searchQuery.length < 2;

  return (
    <div className="search-page">
      <PageNavBar />

      <div className="search-container">

        {/* Hero search bar */}
        <div className="search-hero">
          <h1 className="search-title">🔍 Search</h1>
          <p className="search-subtitle">Search across all chapters, glossary terms, and your notes</p>
          <div className="search-input-wrapper">
            <span className="search-icon-left">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search across all content, glossary, and notes..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
        </div>

        {/* Empty state — shown when no query */}
        {isEmpty && (
          <div className="search-empty-state">

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="search-section">
                <div className="search-section-header">
                  <h3>🕐 Recent Searches</h3>
                  <button className="search-clear-btn" onClick={handleClearRecent}>Clear all</button>
                </div>
                <div className="recent-searches-list">
                  {recentSearches.map((term, i) => (
                    <button key={i} className="recent-search-item" onClick={() => handleSearch(term)}>
                      <span className="recent-icon">↩</span>
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular topics */}
            <div className="search-section">
              <div className="search-section-header">
                <h3>🔥 Popular Topics</h3>
              </div>
              <div className="popular-topics-grid">
                {POPULAR_TOPICS.map((topic, i) => (
                  <button key={i} className="popular-topic-pill" onClick={() => handleSearch(topic.label)}>
                    <span>{topic.icon}</span>
                    <span>{topic.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick chapter categories */}
            <div className="search-section">
              <div className="search-section-header">
                <h3>📚 Browse by Category</h3>
              </div>
              <div className="quick-categories-grid">
                {QUICK_CATEGORIES.map((cat, i) => (
                  <button key={i} className="quick-category-card" onClick={() => navigate(`/reader/phak/${cat.chapter}`)}>
                    <span className="quick-category-icon">{cat.icon}</span>
                    <span className="quick-category-label">{cat.label}</span>
                    <span className="quick-category-arrow">→</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Search hint — 1 char typed */}
        {searchQuery.length === 1 && (
          <div className="search-hint">Type at least 2 characters to search...</div>
        )}

        {/* Results */}
        {searchQuery.length >= 2 && (
          <>
            <div className="search-filters">
              <div className="filter-chips">
                {['all','content','glossary','notes'].map(f => (
                  <button
                    key={f}
                    className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)} ({getResultCount(f)})
                  </button>
                ))}
              </div>
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="relevance">Sort: Relevance</option>
                <option value="chapter">Sort: Chapter</option>
              </select>
            </div>

            <div className="search-results">
              {results.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <p>No results found for "<strong>{searchQuery}</strong>"</p>
                  <p className="no-results-hint">Try different keywords or check your spelling</p>
                  <div className="no-results-suggestions">
                    <p>Try searching for:</p>
                    <div className="popular-topics-grid" style={{ marginTop: '0.5rem' }}>
                      {POPULAR_TOPICS.slice(0,4).map((t,i) => (
                        <button key={i} className="popular-topic-pill" onClick={() => handleSearch(t.label)}>
                          {t.icon} {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="results-list">
                  {results.map((result, idx) => {
                    const badge = typeBadgeStyle(result.type);
                    return (
                      <div key={idx} className="result-card" onClick={() => handleResultClick(result)}>
                        <div className="result-card-top">
                          <span className="result-type-badge" style={{ background: badge.bg, color: badge.color }}>
                            {result.type}
                          </span>
                          {result.chapterTitle && (
                            <span className="result-breadcrumb">
                              Ch. {result.chapter}: {result.chapterTitle} • Page {result.page}
                            </span>
                          )}
                        </div>
                        <div className="result-title">{highlightText(result.title, searchQuery)}</div>
                        <div className="result-snippet">
                          ...{highlightText(result.snippet.substring(0, 200), searchQuery)}...
                        </div>
                        {result.tags && result.tags.length > 0 && (
                          <div className="result-tags">
                            {result.tags.map(tag => <span key={tag} className="result-tag">{tag}</span>)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Search;
