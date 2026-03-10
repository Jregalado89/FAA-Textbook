import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../utils/store';
import './AllNotes.css';

function AllNotes() {
  const navigate = useNavigate();
  const { notes, deleteNote, updateNote } = useAppStore();
  
  const [viewMode, setViewMode] = useState('timeline'); // timeline or grid
  const [filterTags, setFilterTags] = useState([]);
  const [filterChapter, setFilterChapter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))];

  // Get all unique chapters
  const allChapters = [...new Set(notes.map(note => {
    const chapterId = note.chapterId || '';
    return chapterId.split('-')[1];
  }).filter(Boolean))].sort((a, b) => parseInt(a) - parseInt(b));

  // Filter notes
  const filteredNotes = notes.filter(note => {
    // Search filter
    if (searchQuery && !note.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Tag filter
    if (filterTags.length > 0) {
      const noteTags = note.tags || [];
      if (!filterTags.some(tag => noteTags.includes(tag))) {
        return false;
      }
    }

    // Chapter filter
    if (filterChapter !== 'all') {
      const noteChapter = (note.chapterId || '').split('-')[1];
      if (noteChapter !== filterChapter) {
        return false;
      }
    }

    return true;
  });

  // Group notes by date for timeline view
  const groupNotesByDate = (notes) => {
    const groups = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notes.forEach(note => {
      const noteDate = new Date(note.timestamp);
      noteDate.setHours(0, 0, 0, 0);
      
      let label;
      if (noteDate.getTime() === today.getTime()) {
        label = 'Today';
      } else if (noteDate.getTime() === yesterday.getTime()) {
        label = 'Yesterday';
      } else {
        label = noteDate.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(note);
    });

    return groups;
  };

  const toggleTag = (tag) => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter(t => t !== tag));
    } else {
      setFilterTags([...filterTags, tag]);
    }
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Delete this note?')) {
      deleteNote(noteId);
    }
  };

  const handleExportNotes = () => {
    const exportData = filteredNotes.map(note => ({
      date: new Date(note.timestamp).toLocaleString(),
      page: note.page,
      chapter: note.chapterId,
      content: note.content,
      tags: note.tags || []
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phak-notes-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const getTagColor = (tag) => {
    const tagMap = {
      'fuel-system': '#fef3c7',
      'instruments': '#ddd6fe',
      'weather': '#d1fae5',
      'checkride': '#fce7f3',
      'systems': '#e0e7ff',
      'performance': '#ffedd5'
    };
    return tagMap[tag.toLowerCase().replace(/\s+/g, '-')] || '#f3f4f6';
  };

  const noteGroups = viewMode === 'timeline' ? groupNotesByDate(filteredNotes) : null;

  return (
    <div className="all-notes-page">
      <div className="notes-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Library
        </button>
        <h1>📝 All Notes</h1>
      </div>

      <div className="notes-container">
        <div className="notes-toolbar">
          <div className="notes-stats">
            <div className="stat-item">
              <div className="stat-value">{notes.length}</div>
              <div className="stat-label">Total Notes</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{filteredNotes.length}</div>
              <div className="stat-label">Filtered</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{allTags.length}</div>
              <div className="stat-label">Unique Tags</div>
            </div>
          </div>

          <div className="view-toggle">
            <button
              className={viewMode === 'timeline' ? 'active' : ''}
              onClick={() => setViewMode('timeline')}
            >
              📅 Timeline
            </button>
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              🔲 Grid
            </button>
          </div>

          <button className="export-btn" onClick={handleExportNotes}>
            💾 Export All
          </button>
        </div>

        <div className="notes-filters">
          <input
            type="text"
            className="notes-search"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {allTags.length > 0 && (
            <div className="tag-filter">
              <span className="filter-label">Filter by tags:</span>
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-filter-btn ${filterTags.includes(tag) ? 'active' : ''}`}
                  style={{ 
                    background: filterTags.includes(tag) ? getTagColor(tag) : '#f3f4f6'
                  }}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {filterTags.includes(tag) && ' ✓'}
                </button>
              ))}
              {filterTags.length > 0 && (
                <button className="clear-filters" onClick={() => setFilterTags([])}>
                  Clear all
                </button>
              )}
            </div>
          )}

          {allChapters.length > 0 && (
            <div className="chapter-filter">
              <span className="filter-label">Filter by chapter:</span>
              <select
                value={filterChapter}
                onChange={(e) => setFilterChapter(e.target.value)}
                className="chapter-select"
              >
                <option value="all">All Chapters</option>
                {allChapters.map(ch => (
                  <option key={ch} value={ch}>Chapter {ch}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {filteredNotes.length === 0 ? (
          <div className="no-notes">
            <p>📝 No notes found</p>
            <p className="no-notes-hint">
              {notes.length === 0 
                ? "Start taking notes while reading!" 
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : viewMode === 'timeline' ? (
          <div className="timeline-view">
            {Object.entries(noteGroups).map(([date, dateNotes]) => (
              <div key={date} className="timeline-group">
                <h2 className="timeline-date">{date}</h2>
                <div className="timeline-notes">
                  {dateNotes.map(note => (
                    <div key={note.id} className="note-card timeline-card">
                      <div className="note-header">
                        <div className="note-meta">
                          <span className="note-page">Page {note.page}</span>
                          <span className="note-time">
                            {new Date(note.timestamp).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="note-actions">
                          <button 
                            className="note-action-btn"
                            onClick={() => navigate(`/reader/phak/${note.chapterId?.split('-')[1] || '1'}`)}
                          >
                            Go to page →
                          </button>
                          <button 
                            className="note-action-btn delete"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="note-content">{note.content}</div>
                      {note.tags && note.tags.length > 0 && (
                        <div className="note-tags">
                          {note.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="note-tag"
                              style={{ background: getTagColor(tag) }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-view">
            {filteredNotes.map(note => (
              <div key={note.id} className="note-card grid-card">
                <div className="note-header">
                  <div className="note-meta">
                    <span className="note-page">Page {note.page}</span>
                    <span className="note-date">
                      {new Date(note.timestamp).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <button 
                    className="note-action-btn delete"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    🗑️
                  </button>
                </div>
                <div className="note-content">{note.content}</div>
                {note.tags && note.tags.length > 0 && (
                  <div className="note-tags">
                    {note.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="note-tag"
                        style={{ background: getTagColor(tag) }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllNotes;