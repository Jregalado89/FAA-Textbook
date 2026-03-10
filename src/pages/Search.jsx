import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { phakData } from '../data/phakContent';
import { glossaryData } from '../data/glossaryData';
import { useAppStore } from '../utils/store';
import './Search.css';

function Search() {
  const navigate = useNavigate();
  const { notes, highlights, bookmarks } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

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

    // Search content
    if (activeFilter === 'all' || activeFilter === 'content') {
      phakData.chapters.forEach((chapter) => {
        chapter.pages.forEach((page) => {
          page.sections.forEach((section) => {
            // Search section titles
            if (section.title.toLowerCase().includes(lowerQuery)) {
              searchResults.push({
                type: 'content',
                title: section.title,
                chapter: chapter.chapter_number,
                chapterTitle: chapter.title,
                page: page.page_number,
                snippet: section.title,
                relevance: 10
              });
            }

            // Search content paragraphs
            section.content.forEach((item) => {
              if (item.type === 'paragraph' && item.text.toLowerCase().includes(lowerQuery)) {
                const snippetStart = Math.max(0, item.text.toLowerCase().indexOf(lowerQuery) - 60);
                const snippetEnd = Math.min(item.text.length, snippetStart + 200);
                const snippet = item.text.substring(snippetStart, snippetEnd);

                searchResults.push({
                  type: 'content',
                  title: section.title,
                  chapter: chapter.chapter_number,
                  chapterTitle: chapter.title,
                  page: page.page_number,
                  snippet: snippet,
                  relevance: 5
                });
              }
            });
          });
        });
      });
    }

    // Search glossary
    if (activeFilter === 'all' || activeFilter === 'glossary') {
      Object.entries(glossaryData).forEach(([term, data]) => {
        if (term.includes(lowerQuery) || data.definition.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            type: 'glossary',
            title: term,
            snippet: data.definition,
            relevance: term.includes(lowerQuery) ? 8 : 3
          });
        }
      });
    }

    // Search notes
    if (activeFilter === 'all' || activeFilter === 'notes') {
      notes.forEach((note) => {
        if (note.content.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            type: 'notes',
            title: `Note on Page ${note.page}`,
            snippet: note.content,
            page: note.page,
            tags: note.tags || [],
            relevance: 6
          });
        }
      });
    }

    // Sort results
    if (sortBy === 'relevance') {
      searchResults.sort((a, b) => b.relevance - a.relevance);
    } else if (sortBy === 'chapter') {
      searchResults.sort((a, b) => (a.chapter || 999) - (b.chapter || 999));
    }

    setResults(searchResults);
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  const getResultCount = (type) => {
    if (type === 'all') return results.length;
    return results.filter(r => r.type === type).length;
  };

  const handleResultClick = (result) => {
    if (result.type === 'content') {
      navigate(`/reader/phak/${result.chapter}`);
    } else if (result.type === 'glossary') {
      navigate('/glossary');
    } else if (result.type === 'notes') {
      navigate('/notes');
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Library
        </button>
        <h1>🔍 Search</h1>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search across all content, glossary, and notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>

        {searchQuery.length >= 2 && (
          <>
            <div className="search-filters">
              <div className="filter-chips">
                <button
                  className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All ({getResultCount('all')})
                </button>
                <button
                  className={`filter-chip ${activeFilter === 'content' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('content')}
                >
                  Content ({getResultCount('content')})
                </button>
                <button
                  className={`filter-chip ${activeFilter === 'glossary' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('glossary')}
                >
                  Glossary ({getResultCount('glossary')})
                </button>
                <button
                  className={`filter-chip ${activeFilter === 'notes' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('notes')}
                >
                  Notes ({getResultCount('notes')})
                </button>
              </div>

              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="chapter">Sort: Chapter</option>
              </select>
            </div>

            <div className="search-results">
              {results.length === 0 ? (
                <div className="no-results">
                  <p>No results found for "{searchQuery}"</p>
                  <p className="no-results-hint">Try different keywords or check your spelling</p>
                </div>
              ) : (
                <div className="results-list">
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      className="result-card"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="result-type-badge">{result.type}</div>
                      <div className="result-title">
                        {highlightText(result.title, searchQuery)}
                      </div>
                      {result.chapterTitle && (
                        <div className="result-breadcrumb">
                          Chapter {result.chapter}: {result.chapterTitle} • Page {result.page}
                        </div>
                      )}
                      <div className="result-snippet">
                        ...{highlightText(result.snippet.substring(0, 200), searchQuery)}...
                      </div>
                      {result.tags && result.tags.length > 0 && (
                        <div className="result-tags">
                          {result.tags.map((tag) => (
                            <span key={tag} className="result-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {searchQuery.length < 2 && searchQuery.length > 0 && (
          <div className="search-hint">
            Type at least 2 characters to search...
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;