import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../utils/store';
import Footer from '../components/Footer';
import PageNavBar from '../components/PageNavBar';
import './Settings.css';

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <div className="confirm-icon">⚠️</div>
        <div className="confirm-message">{message}</div>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className="confirm-ok" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  const navigate = useNavigate();
  const {
    nightMode, toggleNightMode,
    fontSize, increaseFontSize, decreaseFontSize,
    showACSBadges, toggleACSBadges,
    notes, highlights, bookmarks, readingProgress,
    clearNotes, clearHighlights, clearBookmarks,
    clearReadingProgress, clearAllData,
  } = useAppStore();

  const [confirm, setConfirm] = useState(null); // { message, action }
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleClear = (message, action) => {
    setConfirm({ message, action });
  };

  const doConfirm = () => {
    confirm.action();
    setConfirm(null);
    showToast('Done — data cleared.');
  };

  const exportNotes = () => {
    if (notes.length === 0) { showToast('No notes to export.'); return; }
    const lines = notes.map(n =>
      `Page ${n.pageId || '?'}\n${new Date(n.timestamp).toLocaleDateString()}\n${n.tags?.length ? 'Tags: ' + n.tags.join(', ') + '\n' : ''}${n.text}\n`
    );
    const blob = new Blob(['PHAK Reader — My Notes\n' + '='.repeat(40) + '\n\n' + lines.join('\n---\n\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'phak-notes.txt';
    a.click();
    showToast('Notes exported.');
  };

  const noteCount       = notes.length;
  const highlightCount  = highlights.length;
  const bookmarkCount   = bookmarks.length;
  const progressCount   = Object.keys(readingProgress).length;

  return (
    <div className={`settings-page ${nightMode ? 'night-mode' : ''}`}>
      <PageNavBar />

      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={doConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && <div className="settings-toast">{toast}</div>}

      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-title">⚙️ Settings</h1>
          <p className="settings-subtitle">Customize your reading experience</p>
        </div>

        {/* ── Display ─────────────────────────────────────────── */}
        <div className="settings-section">
          <div className="settings-section-title">Display</div>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Night Mode</div>
              <div className="settings-row-desc">Dark theme for low-light reading</div>
            </div>
            <button className={`settings-toggle ${nightMode ? 'on' : ''}`} onClick={toggleNightMode}>
              <span className="settings-toggle-thumb" />
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Text Size</div>
              <div className="settings-row-desc">Adjust the reading font size</div>
            </div>
            <div className="settings-font-controls">
              <button className="settings-font-btn" onClick={decreaseFontSize} disabled={fontSize <= 12}>A−</button>
              <span className="settings-font-value">{fontSize}px</span>
              <button className="settings-font-btn" onClick={increaseFontSize} disabled={fontSize >= 24}>A+</button>
            </div>
          </div>

          <div className="settings-preview">
            <div className="settings-preview-label">Preview</div>
            <div className="settings-preview-text" style={{ fontSize: `${fontSize}px` }}>
              The Pilot's Handbook of Aeronautical Knowledge provides basic knowledge for the student pilot learning to fly, as well as pilots seeking advanced pilot certification.
            </div>
          </div>
        </div>

        {/* ── Study Tools ─────────────────────────────────────── */}
        <div className="settings-section">
          <div className="settings-section-title">Study Tools</div>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Show ACS Badges</div>
              <div className="settings-row-desc">Display ACS certification codes next to section headings in the reader</div>
            </div>
            <button className={`settings-toggle ${showACSBadges ? 'on' : ''}`} onClick={toggleACSBadges}>
              <span className="settings-toggle-thumb" />
            </button>
          </div>
        </div>

        {/* ── Data Management ─────────────────────────────────── */}
        <div className="settings-section">
          <div className="settings-section-title">Data Management</div>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Export Notes</div>
              <div className="settings-row-desc">{noteCount} note{noteCount !== 1 ? 's' : ''} saved — download as a text file</div>
            </div>
            <button className="settings-action-btn export-btn" onClick={exportNotes}>
              ⬇ Export
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Clear Notes</div>
              <div className="settings-row-desc">{noteCount} note{noteCount !== 1 ? 's' : ''} — permanently delete all notes</div>
            </div>
            <button
              className="settings-action-btn danger-btn"
              onClick={() => handleClear(`Delete all ${noteCount} note${noteCount !== 1 ? 's' : ''}? This cannot be undone.`, clearNotes)}
              disabled={noteCount === 0}
            >
              Clear
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Clear Highlights</div>
              <div className="settings-row-desc">{highlightCount} highlight{highlightCount !== 1 ? 's' : ''} — permanently delete all highlights</div>
            </div>
            <button
              className="settings-action-btn danger-btn"
              onClick={() => handleClear(`Delete all ${highlightCount} highlight${highlightCount !== 1 ? 's' : ''}? This cannot be undone.`, clearHighlights)}
              disabled={highlightCount === 0}
            >
              Clear
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Clear Bookmarks</div>
              <div className="settings-row-desc">{bookmarkCount} bookmark{bookmarkCount !== 1 ? 's' : ''} — remove all bookmarks</div>
            </div>
            <button
              className="settings-action-btn danger-btn"
              onClick={() => handleClear(`Remove all ${bookmarkCount} bookmark${bookmarkCount !== 1 ? 's' : ''}?`, clearBookmarks)}
              disabled={bookmarkCount === 0}
            >
              Clear
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Reset Reading Progress</div>
              <div className="settings-row-desc">{progressCount} chapter{progressCount !== 1 ? 's' : ''} tracked — reset all progress markers</div>
            </div>
            <button
              className="settings-action-btn danger-btn"
              onClick={() => handleClear('Reset all reading progress? Your position in each chapter will be cleared.', clearReadingProgress)}
              disabled={progressCount === 0}
            >
              Reset
            </button>
          </div>

          <div className="settings-row settings-row-danger">
            <div className="settings-row-info">
              <div className="settings-row-label">Clear All Data</div>
              <div className="settings-row-desc">Delete all notes, highlights, bookmarks, and reading progress at once</div>
            </div>
            <button
              className="settings-action-btn danger-btn danger-all"
              onClick={() => handleClear('Delete ALL data — notes, highlights, bookmarks, and reading progress? This cannot be undone.', clearAllData)}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* ── About ───────────────────────────────────────────── */}
        <div className="settings-section">
          <div className="settings-section-title">About</div>
          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Handbook</div>
              <div className="settings-row-desc">Pilot's Handbook of Aeronautical Knowledge (FAA-H-8083-25C)</div>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Application</div>
              <div className="settings-row-desc">Northbound Aviation, LLC — Independent educational reference tool</div>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Disclaimer</div>
              <div className="settings-row-desc">Not affiliated with or endorsed by the FAA. Always consult official FAA publications for authoritative guidance.</div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Settings;
