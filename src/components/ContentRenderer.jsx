import React, { useState } from 'react';
import { useAppStore } from '../utils/store';
import { getACSInfo } from '../data/acsData';
import { getImageByFigure } from '../data/imageData';
import ACSModal from './ACSModal';
import './ContentRenderer.css';

function GlossaryTooltip({ term, definition, position }) {
  if (!definition) return null;
  
  return (
    <div className="glossary-tooltip" style={{ top: position.top, left: position.left }}>
      <div className="glossary-tooltip-term">{term}</div>
      <div className="glossary-tooltip-definition">{definition}</div>
    </div>
  );
}

function HighlightMenu({ position, onSelectColor, onCreateNote, onClose }) {
  const colors = [
    { name: 'yellow', bg: '#fef3c7', label: 'Yellow' },
    { name: 'green', bg: '#d1fae5', label: 'Green' },
    { name: 'blue', bg: '#dbeafe', label: 'Blue' },
    { name: 'pink', bg: '#fce7f3', label: 'Pink' },
    { name: 'orange', bg: '#ffedd5', label: 'Orange' }
  ];

  return (
    <div className="highlight-menu" style={{ top: position.top, left: position.left }}>
      <div className="highlight-menu-title">Highlight</div>
      <div className="highlight-colors">
        {colors.map(color => (
          <button
            key={color.name}
            className="highlight-color-btn"
            style={{ background: color.bg }}
            onClick={() => onSelectColor(color.name)}
            title={color.label}
          />
        ))}
      </div>
      <button className="highlight-remove" onClick={() => onSelectColor(null)}>
        Remove
      </button>
      <div className="highlight-menu-divider" />
      <div className="highlight-menu-note-label">NOTE</div>
      <button className="highlight-create-note" onClick={onCreateNote}>
        + Create note
      </button>
    </div>
  );
}

function ContentRenderer({ sections, glossaryData, currentPage }) {
  const [tooltip, setTooltip] = useState(null);
  const [highlightMenu, setHighlightMenu] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const [acsModal, setAcsModal] = useState(null);
  const { highlights, addHighlight, deleteHighlight, toggleRightSidebar } = useAppStore();

  const handleACSClick = (code) => {
    const acsInfo = getACSInfo(code);
    if (acsInfo) {
      setAcsModal({ code, info: acsInfo });
    } else {
      setAcsModal({ 
        code, 
        info: {
          area: code.split('.')[0],
          areaTitle: 'Information not available',
          task: code.split('.')[1],
          taskTitle: 'Click for full ACS standards',
          element: code.split('.')[2],
          elementType: 'Knowledge',
          description: 'Full ACS data coming soon',
          references: ['FAA-S-ACS-6C']
        }
      });
    }
  };

  const handleTextSelection = (e) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedRange({ text, range: range.cloneRange(), selection });
      setHighlightMenu({
        top: rect.bottom + window.scrollY + 8,
        left: Math.min(rect.left + window.scrollX, window.innerWidth - 200)
      });
    } else {
      setHighlightMenu(null);
    }
  };

  const handleHighlightColor = (color) => {
    if (color && selectedRange) {
      // Apply new highlight
      const id = Date.now();
      const span = document.createElement('span');
      span.className = `highlight-${color}`;
      span.setAttribute('data-highlight-id', id);
      
      try {
        selectedRange.range.surroundContents(span);
        addHighlight({
          id,
          text: selectedRange.text,
          color,
          page: currentPage,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.log('Could not apply highlight:', err);
      }
    } else if (color === null && selectedRange) {
      // Remove highlight - find nearest highlight span from the selected range
      let element = selectedRange.range.commonAncestorContainer;
      if (element.nodeType === 3) {
        element = element.parentElement;
      }

      // Walk up the DOM to find a highlight span
      let highlightSpan = null;
      let el = element;
      while (el && el !== document.body) {
        if (el.hasAttribute && el.hasAttribute('data-highlight-id')) {
          highlightSpan = el;
          break;
        }
        el = el.parentElement;
      }

      // Also check if selection starts inside a highlight
      if (!highlightSpan) {
        let startEl = selectedRange.range.startContainer;
        if (startEl.nodeType === 3) startEl = startEl.parentElement;
        let el2 = startEl;
        while (el2 && el2 !== document.body) {
          if (el2.hasAttribute && el2.hasAttribute('data-highlight-id')) {
            highlightSpan = el2;
            break;
          }
          el2 = el2.parentElement;
        }
      }

      if (highlightSpan) {
        const highlightId = parseInt(highlightSpan.getAttribute('data-highlight-id'));
        deleteHighlight(highlightId);
        const parent = highlightSpan.parentNode;
        while (highlightSpan.firstChild) {
          parent.insertBefore(highlightSpan.firstChild, highlightSpan);
        }
        parent.removeChild(highlightSpan);
        parent.normalize();
      }
    }
    
    setHighlightMenu(null);
    setSelectedRange(null);
    window.getSelection().removeAllRanges();
  };

  const handleCreateNoteFromHighlight = () => {
    // Close the highlight menu, open notes sidebar, pass selected text
    if (selectedRange) {
      // Dispatch a custom event so NotesSidebar can pick up the selected text
      const event = new CustomEvent('openNoteWithText', { 
        detail: { text: selectedRange.text, page: currentPage } 
      });
      window.dispatchEvent(event);
      toggleRightSidebar();
    }
    setHighlightMenu(null);
    setSelectedRange(null);
    window.getSelection().removeAllRanges();
  };

  const renderGlossaryTerm = (text, glossaryTerms) => {
    if (!glossaryTerms || glossaryTerms.length === 0) {
      return text;
    }

    const sortedTerms = [...glossaryTerms].sort((a, b) => b.length - a.length);
    const elements = [];

    sortedTerms.forEach((term) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        elements.push({
          start: match.index,
          end: match.index + match[0].length,
          term: match[0],
          termKey: term.toLowerCase(),
          definition: glossaryData[term.toLowerCase()]?.definition,
        });
      }
    });

    elements.sort((a, b) => a.start - b.start);

    const parts = [];
    let currentIndex = 0;

    elements.forEach((el, idx) => {
      if (currentIndex < el.start) {
        parts.push(text.substring(currentIndex, el.start));
      }

      parts.push(
        <span
          key={`term-${idx}`}
          className="glossary-term"
          onMouseEnter={(e) => {
            const rect = e.target.getBoundingClientRect();
            setTooltip({
              term: el.term,
              definition: el.definition,
              position: {
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX
              }
            });
          }}
          onMouseLeave={() => setTooltip(null)}
        >
          {el.term}
        </span>
      );

      currentIndex = el.end;
    });

    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }

    return parts;
  };

  return (
    <div className="content-text" onMouseUp={handleTextSelection}>
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          {/* Render section title as heading with ACS codes */}
          {section.title && (
            <h2>
              {section.title}
              {section.acs_codes && section.acs_codes.map((code) => (
                <span 
                  key={code} 
                  className="acs-badge"
                  onClick={() => handleACSClick(code)}
                >
                  📋 {code}
                </span>
              ))}
            </h2>
          )}

          {/* Show figure if section has one */}
          {section.figure && (
            <div className="content-figure">
              {(() => {
                const imageInfo = getImageByFigure(section.figure);
                return imageInfo ? (
                  <figure>
                    <img 
                      src={`/images/${imageInfo.filename}`} 
                      alt={imageInfo.alt}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                    <figcaption>
                      <strong>Figure {imageInfo.figureNumber}:</strong> {imageInfo.caption}
                    </figcaption>
                  </figure>
                ) : (
                  <figure>
                    <img src="/images/placeholder.png" alt="Figure placeholder" />
                    <figcaption>
                      <strong>Figure {section.figure}:</strong> Image coming soon
                    </figcaption>
                  </figure>
                );
              })()}
            </div>
          )}

          {section.content.map((item, itemIdx) => {
            if (item.type === 'heading') {
              const HeadingTag = `h${item.level}`;
              return (
                <HeadingTag key={itemIdx}>
                  {item.text}
                  {item.acs_codes && item.acs_codes.map((code) => (
                    <span 
                      key={code} 
                      className="acs-badge"
                      onClick={() => handleACSClick(code)}
                    >
                      📋 {code}
                    </span>
                  ))}
                </HeadingTag>
              );
            }

            if (item.type === 'paragraph') {
              return (
                <p key={itemIdx}>
                  {renderGlossaryTerm(item.text, item.glossary_terms)}
                </p>
              );
            }

            if (item.type === 'figure') {
              return (
                <figure key={itemIdx} className="content-figure-inline">
                  {item.image ? (
                    <img
                      src={`/images/ch1/${item.image}`}
                      alt={item.caption}
                      onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                    />
                  ) : null}
                  <figcaption>
                    <strong>Figure {item.figure_number}.</strong> {item.caption}
                  </figcaption>
                </figure>
              );
            }

            if (item.type === 'list') {
              return (
                <ul key={itemIdx} className="content-list">
                  {item.items.map((li, liIdx) => (
                    <li key={liIdx}>{li}</li>
                  ))}
                </ul>
              );
            }

            if (item.type === 'subheading') {
              return (
                <h4 key={itemIdx} className="content-subheading">{item.text}</h4>
              );
            }
          })}
        </div>
      ))}
      
      {tooltip && (
        <GlossaryTooltip
          term={tooltip.term}
          definition={tooltip.definition}
          position={tooltip.position}
        />
      )}

      {highlightMenu && (
        <HighlightMenu
          position={highlightMenu}
          onSelectColor={handleHighlightColor}
          onCreateNote={handleCreateNoteFromHighlight}
          onClose={() => setHighlightMenu(null)}
        />
      )}

      {acsModal && (
        <ACSModal
          acsCode={acsModal.code}
          acsInfo={acsModal.info}
          onClose={() => setAcsModal(null)}
        />
      )}
    </div>
  );
}

export default ContentRenderer;
