import React, { useState } from 'react';
import { useAppStore } from '../utils/store';
import { getACSInfo } from '../data/acsData';
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

function HighlightMenu({ position, onSelectColor, onClose }) {
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
    </div>
  );
}

function ContentRenderer({ sections, glossaryData, currentPage }) {
  const [tooltip, setTooltip] = useState(null);
  const [highlightMenu, setHighlightMenu] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const [acsModal, setAcsModal] = useState(null);
  const { highlights, addHighlight, deleteHighlight } = useAppStore();

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
      
      setSelectedRange({ text, range, selection });
      setHighlightMenu({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
    } else {
      setHighlightMenu(null);
    }
  };

  const handleHighlightColor = (color) => {
    if (selectedRange && color) {
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
    } else if (selectedRange && color === null) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const parentSpan = container.nodeType === 3 
          ? container.parentElement 
          : container;
        
        if (parentSpan && parentSpan.hasAttribute('data-highlight-id')) {
          const highlightId = parseInt(parentSpan.getAttribute('data-highlight-id'));
          deleteHighlight(highlightId);
          
          const parent = parentSpan.parentNode;
          while (parentSpan.firstChild) {
            parent.insertBefore(parentSpan.firstChild, parentSpan);
          }
          parent.removeChild(parentSpan);
        }
      }
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

            return null;
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
