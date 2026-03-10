import React from 'react';
import './ACSModal.css';

function ACSModal({ acsCode, acsInfo, onClose }) {
  if (!acsInfo) return null;

  return (
    <div className="acs-modal-overlay" onClick={onClose}>
      <div className="acs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="acs-modal-header">
          <div className="acs-modal-code">📋 {acsCode}</div>
          <button className="acs-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="acs-modal-content">
          <div className="acs-modal-section">
            <div className="acs-modal-label">Area</div>
            <div className="acs-modal-value">{acsInfo.area}: {acsInfo.areaTitle}</div>
          </div>

          <div className="acs-modal-section">
            <div className="acs-modal-label">Task</div>
            <div className="acs-modal-value">{acsInfo.task}: {acsInfo.taskTitle}</div>
          </div>

          <div className="acs-modal-section">
            <div className="acs-modal-label">Element</div>
            <div className="acs-modal-value">{acsInfo.element} ({acsInfo.elementType})</div>
          </div>

          <div className="acs-modal-section">
            <div className="acs-modal-label">Description</div>
            <div className="acs-modal-value">{acsInfo.description}</div>
          </div>

          {acsInfo.objectives && acsInfo.objectives.length > 0 && (
            <div className="acs-modal-section">
              <div className="acs-modal-label">Objectives</div>
              <ul className="acs-objectives">
                {acsInfo.objectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {acsInfo.references && acsInfo.references.length > 0 && (
            <div className="acs-modal-section">
              <div className="acs-modal-label">References</div>
              <div className="acs-references">
                {acsInfo.references.map((ref, idx) => (
                  <span key={idx} className="acs-reference">{ref}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="acs-modal-footer">
          <button className="acs-modal-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default ACSModal;
