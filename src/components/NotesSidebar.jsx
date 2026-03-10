import React, { useState } from 'react';
import { useAppStore } from '../utils/store';
import './NotesSidebar.css';

function NotesSidebar({ isOpen, currentPage, chapterId }) {
  const { notes, addNote } = useAppStore();
  const [noteText, setNoteText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const pageNotes = notes.filter((note) => note.page === currentPage);
  const recentNotes = notes.slice(-3).reverse();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSaveNote = () => {
    if (noteText.trim()) {
      addNote({
        page: currentPage,
        chapterId,
        content: noteText,
        tags,
      });
      setNoteText('');
      setTags([]);
    }
  };

  return (
    <div className={`notes-sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="notes-header">
        <h3>✏️ Page Notes</h3>
      </div>

      <textarea
        className="note-input"
        placeholder="Add your notes for this page..."
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      />

      <div className="tag-input-wrapper">
        <input
          type="text"
          className="tag-input"
          placeholder="Add tag..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
        />
        <button className="add-tag-btn" onClick={handleAddTag}>
          + Add
        </button>
      </div>

      {tags.length > 0 && (
        <div className="note-tags-display">
          {tags.map((tag) => (
            <span key={tag} className={`tag-badge ${tag.toLowerCase().replace(/\s+/g, '-')}`}>
              {tag}{' '}
              <span className="remove-tag" onClick={() => handleRemoveTag(tag)}>
                ×
              </span>
            </span>
          ))}
        </div>
      )}

      <button className="save-note-btn" onClick={handleSaveNote}>
        💾 Save Note
      </button>

      {recentNotes.length > 0 && (
        <div className="recent-notes">
          <h4>Recent Notes</h4>
          {recentNotes.map((note) => (
            <div key={note.id} className="recent-note-item">
              <div className="recent-note-page">Page {note.page}</div>
              <div className="recent-note-text">
                {note.content.substring(0, 60)}
                {note.content.length > 60 ? '...' : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesSidebar;
