import React, { useState } from 'react';
import { useAppStore } from '../utils/store';
import './NotesSidebar.css';

function NotesSidebar({ isOpen, currentPage, chapterId }) {
  const { notes, addNote, toggleRightSidebar } = useAppStore();
  const [noteText, setNoteText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [linkedText, setLinkedText] = useState(null);

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

  const handleLinkSelectedText = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setLinkedText({
        text: selection.toString().trim(),
        page: currentPage
      });
    }
  };

  const handleClearLinkedText = () => {
    setLinkedText(null);
  };

  const handleSaveNote = () => {
    if (noteText.trim()) {
      addNote({
        page: currentPage,
        chapterId,
        content: noteText,
        tags,
        linkedText: linkedText
      });
      setNoteText('');
      setTags([]);
      setLinkedText(null);
    }
  };

  return (
    <div className={`notes-sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="notes-header">
        <button className="notes-close-btn" onClick={toggleRightSidebar} title="Close notes">
          ☰
        </button>
        <h3>✏️ Page Notes</h3>
      </div>

      <div className="notes-sidebar-inner">
        <textarea
          className="note-input"
          placeholder="Add your notes for this page..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />

        {linkedText && (
          <div className="linked-text-preview">
            <div className="linked-text-header">
              <span className="linked-icon">🔗</span>
              <span>Linked to text:</span>
              <button className="clear-link-btn" onClick={handleClearLinkedText}>✕</button>
            </div>
            <div className="linked-text-content">
              "{linkedText.text.substring(0, 80)}{linkedText.text.length > 80 ? '...' : ''}"
            </div>
          </div>
        )}

        <button className="link-text-btn" onClick={handleLinkSelectedText}>
          🔗 Link Selected Text
        </button>

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
                {note.linkedText && (
                  <div className="note-linked-indicator">
                    🔗 Linked to: "{note.linkedText.text.substring(0, 30)}..."
                  </div>
                )}
                <div className="recent-note-text">
                  {note.content.substring(0, 60)}
                  {note.content.length > 60 ? '...' : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesSidebar;
