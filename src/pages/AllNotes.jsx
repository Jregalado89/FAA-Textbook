import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../utils/store';
import Footer from '../components/Footer';
import PageNavBar from '../components/PageNavBar';
import './AllNotes.css';

const TAG_COLORS = {
  'fuel-system':  { bg: '#fef9c3', text: '#854d0e' },
  'instruments':  { bg: '#ede9fe', text: '#5b21b6' },
  'weather':      { bg: '#d1fae5', text: '#065f46' },
  'checkride':    { bg: '#fce7f3', text: '#9d174d' },
  'systems':      { bg: '#e0e7ff', text: '#3730a3' },
  'performance':  { bg: '#ffedd5', text: '#9a3412' },
};

function getTagStyle(tag) {
  const key = tag.toLowerCase().replace(/\s+/g, '-');
  return TAG_COLORS[key] || { bg: '#f3f4f6', text: '#374151' };
}

// Random-ish but deterministic border color per note
const BORDER_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
function getBorderColor(id) {
  return BORDER_COLORS[id % BORDER_COLORS.length];
}

function AllNotes() {
  const navigate = useNavigate();
  const { notes, deleteNote } = useAppStore();

  const [viewMode, setViewMode]       = useState('timeline');
  const [filterTags, setFilterTags]   = useState([]);
  const [filterChapter, setFilterChapter] = useState('all');
  const [filterTime, setFilterTime]   = useState('all');

  const allTags = [...new Set(notes.flatMap(n => n.tags || []))];
  const allChapters = [...new Set(notes.map(n => (n.chapterId || '').split('-')[1]).filter(Boolean))]
    .sort((a, b) => parseInt(a) - parseInt(b));

  const filteredNotes = notes.filter(note => {
    if (filterTags.length > 0 && !filterTags.some(t => (note.tags || []).includes(t))) return false;
    if (filterChapter !== 'all' && (note.chapterId || '').split('-')[1] !== filterChapter) return false;
    if (filterTime !== 'all') {
      const age = Date.now() - new Date(note.timestamp).getTime();
      const day = 86400000;
      if (filterTime === 'today'   && age > day)      return false;
      if (filterTime === 'week'    && age > 7 * day)  return false;
      if (filterTime === 'month'   && age > 30 * day) return false;
    }
    return true;
  });

  const toggleTag = (tag) => {
    setFilterTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const removeTagFilter = (tag) => setFilterTags(prev => prev.filter(t => t !== tag));

  const groupByDate = (notes) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate()-1);
    const groups = {};
    notes.forEach(note => {
      const d = new Date(note.timestamp); d.setHours(0,0,0,0);
      let label = d.getTime() === today.getTime()     ? 'Today'
                : d.getTime() === yesterday.getTime() ? 'Yesterday'
                : d.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
      (groups[label] = groups[label] || []).push(note);
    });
    return groups;
  };

  const chapterLabel = (note) => {
    const ch = (note.chapterId || '').split('-')[1];
    return ch ? `Chapter ${ch}` : '';
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this note?')) deleteNote(id);
  };

  const handleGoToPage = (note) => {
    const ch = (note.chapterId || '').split('-')[1] || '1';
    navigate(`/reader/phak/${ch}`);
  };

  const noteGroups = viewMode === 'timeline' ? groupByDate(filteredNotes) : null;

  const NoteCard = ({ note, idx }) => {
    const borderColor = BORDER_COLORS[idx % BORDER_COLORS.length];
    const timeStr = new Date(note.timestamp).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
    const ch = chapterLabel(note);

    return (
      <div className="anote-card" style={{ borderLeftColor: borderColor }}>
        <div className="anote-top">
          <button className="anote-location" onClick={() => handleGoToPage(note)}>
            {ch && <>{ch}: </>}{note.chapterId?.split('-')[0]?.replace('ch','Chapter ') || ''} • Page {note.page}
          </button>
          <span className="anote-time">{timeStr}</span>
        </div>

        <div className="anote-content">{note.content}</div>

        {note.linkedText && (
          <div className="anote-linked">
            🔗 "{note.linkedText.text?.substring(0, 60)}{note.linkedText.text?.length > 60 ? '...' : ''}"
          </div>
        )}

        <div className="anote-footer">
          {note.tags && note.tags.length > 0 && (
            <div className="anote-tags">
              {note.tags.map(tag => {
                const s = getTagStyle(tag);
                return (
                  <span key={tag} className="anote-tag" style={{ background: s.bg, color: s.text }}>
                    {tag}
                  </span>
                );
              })}
            </div>
          )}
          <div className="anote-actions">
            <button className="anote-btn edit" onClick={() => handleGoToPage(note)}>✏️ Edit</button>
            <button className="anote-btn share">🔗 Share</button>
            <button className="anote-btn delete" onClick={() => handleDelete(note.id)}>🗑️ Delete</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="all-notes-page">
      <PageNavBar />

      {/* Compact toolbar matching mockup */}
      <div className="anotes-toolbar">
        <div className="anotes-toolbar-left">
          <div className="anotes-view-toggle">
            <button className={viewMode === 'timeline' ? 'active' : ''} onClick={() => setViewMode('timeline')}>
              📅 Timeline
            </button>
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
              🔲 Grid
            </button>
          </div>

          {/* Tags bar - always shown if any tags exist */}
          {allTags.length > 0 && (
            <div className="anotes-active-tags">
              <span className="anotes-tags-label">🏷️ Tags:</span>
              {/* Active (selected) tags with × */}
              {filterTags.map(tag => {
                const s = getTagStyle(tag);
                return (
                  <span key={tag} className="anotes-active-tag" style={{ background: s.bg, color: s.text }}>
                    {tag}
                    <button onClick={() => removeTagFilter(tag)}>×</button>
                  </span>
                );
              })}
              {/* Unselected tags as clickable pills */}
              {allTags.filter(t => !filterTags.includes(t)).map(tag => (
                <button key={tag} className="anotes-tag-pill" onClick={() => toggleTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="anotes-toolbar-right">
          <select value={filterChapter} onChange={e => setFilterChapter(e.target.value)} className="anotes-select">
            <option value="all">All Chapters</option>
            {allChapters.map(ch => <option key={ch} value={ch}>Chapter {ch}</option>)}
          </select>
          <select value={filterTime} onChange={e => setFilterTime(e.target.value)} className="anotes-select">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="anotes-container">
        {filteredNotes.length === 0 ? (
          <div className="anotes-empty">
            <p>📝 No notes found</p>
            <p>{notes.length === 0 ? 'Start taking notes while reading!' : 'Try adjusting your filters'}</p>
          </div>
        ) : viewMode === 'timeline' ? (
          <div className="anotes-timeline">
            {Object.entries(noteGroups).map(([date, dateNotes]) => (
              <div key={date} className="anotes-group">
                <div className="anotes-date-header">
                  <span className="anotes-date-dot" />
                  <span className="anotes-date-label">{date}</span>
                </div>
                <div className="anotes-group-cards">
                  {dateNotes.map((note, idx) => <NoteCard key={note.id} note={note} idx={idx} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="anotes-grid">
            {filteredNotes.map((note, idx) => <NoteCard key={note.id} note={note} idx={idx} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default AllNotes;
