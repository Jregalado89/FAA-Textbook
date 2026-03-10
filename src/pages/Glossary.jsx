import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { glossaryData } from '../data/glossaryData';
import './Glossary.css';

function Glossary() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('all');

  // Get all letters that have terms
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const availableLetters = useMemo(() => {
    const letters = new Set();
    Object.keys(glossaryData).forEach(term => {
      letters.add(term[0].toUpperCase());
    });
    return letters;
  }, []);

  // Filter and group terms
  const filteredTerms = useMemo(() => {
    let terms = Object.entries(glossaryData);

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      terms = terms.filter(([term, data]) =>
        term.includes(lowerQuery) || data.definition.toLowerCase().includes(lowerQuery)
      );
    }

    // Letter filter
    if (activeLetter !== 'all') {
      terms = terms.filter(([term]) => term[0].toUpperCase() === activeLetter);
    }

    // Sort alphabetically
    terms.sort((a, b) => a[0].localeCompare(b[0]));

    // Group by first letter
    const grouped = {};
    terms.forEach(([term, data]) => {
      const letter = term[0].toUpperCase();
      if (!grouped[letter]) {
        grouped[letter] = [];
      }
      grouped[letter].push({ term, ...data });
    });

    return grouped;
  }, [searchQuery, activeLetter]);

  const scrollToLetter = (letter) => {
    setActiveLetter(letter);
    setTimeout(() => {
      const element = document.getElementById(`letter-${letter}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  const totalTerms = Object.keys(glossaryData).length;
  const filteredCount = Object.values(filteredTerms).reduce((sum, terms) => sum + terms.length, 0);

  return (
    <div className="glossary-page">
      <div className="glossary-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Library
        </button>
        <h1>📖 Aviation Glossary</h1>
      </div>

      <div className="glossary-container">
        <div className="glossary-toolbar">
          <div className="glossary-stats">
            <div className="stat-value">{totalTerms}</div>
            <div className="stat-label">Total Terms</div>
          </div>

          <input
            type="text"
            className="glossary-search"
            placeholder="Search terms or definitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button className="clear-filter" onClick={() => {
            setSearchQuery('');
            setActiveLetter('all');
          }}>
            Clear Filter
          </button>
        </div>

        <div className="alphabet-nav">
          <button
            className={`letter-btn ${activeLetter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveLetter('all')}
          >
            All
          </button>
          {alphabet.map(letter => (
            <button
              key={letter}
              className={`letter-btn ${activeLetter === letter ? 'active' : ''} ${
                !availableLetters.has(letter) ? 'disabled' : ''
              }`}
              onClick={() => availableLetters.has(letter) && scrollToLetter(letter)}
              disabled={!availableLetters.has(letter)}
            >
              {letter}
            </button>
          ))}
        </div>

        {filteredCount === 0 ? (
          <div className="no-results">
            <p>No terms found for "{searchQuery}"</p>
            <p className="no-results-hint">Try different keywords</p>
          </div>
        ) : (
          <div className="glossary-content">
            <div className="results-info">
              Showing {filteredCount} {filteredCount === 1 ? 'term' : 'terms'}
            </div>

            {Object.entries(filteredTerms).map(([letter, terms]) => (
              <div key={letter} id={`letter-${letter}`} className="letter-section">
                <h2 className="letter-header">{letter}</h2>
                <div className="terms-list">
                  {terms.map(({ term, definition, related, references }) => (
                    <div key={term} className="term-card">
                      <div className="term-name">
                        {highlightText(term.charAt(0).toUpperCase() + term.slice(1), searchQuery)}
                      </div>
                      <div className="term-definition">
                        {highlightText(definition, searchQuery)}
                      </div>
                      {related && related.length > 0 && (
                        <div className="term-related">
                          <span className="related-label">See also:</span>
                          {related.map((relTerm, idx) => (
                            <span key={idx}>
                              <button
                                className="related-link"
                                onClick={() => setSearchQuery(relTerm)}
                              >
                                {relTerm}
                              </button>
                              {idx < related.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      )}
                      {references && references.length > 0 && (
                        <div className="term-references">
                          📍 Chapter {references.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Glossary;