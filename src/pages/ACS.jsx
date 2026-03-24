import React from 'react';
import { useNavigate } from 'react-router-dom';
import { acsData, acsStructure } from '../data/acsData';
import { acsMapping, getACSPages } from '../data/acsMapping';
import { phakData } from '../data/phakContent';
import { useAppStore } from '../utils/store';
import Footer from '../components/Footer';
import PageNavBar from '../components/PageNavBar';
import './ACS.css';

const AREA_ORDER = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];

const ELEMENT_TYPE_COLORS = {
  'Knowledge': 'acs-k',
  'Risk Management': 'acs-r',
  'Skill': 'acs-s',
};

function ACS() {
  const navigate = useNavigate();
  const { currentBook, acsState, setACSState } = useAppStore();

  const { activeArea, selectedCode, panelOpen, expandedTasks } = acsState;

  const setActiveArea   = (v) => setACSState({ activeArea: v });
  const setSelectedCode = (v) => setACSState({ selectedCode: v });
  const setPanelOpen    = (v) => setACSState({ panelOpen: v });
  const setExpandedTasks = (fn) =>
    setACSState({ expandedTasks: typeof fn === 'function' ? fn(expandedTasks) : fn });

  const toggleTask = (taskKey) =>
    setExpandedTasks(prev => ({ ...prev, [taskKey]: !prev[taskKey] }));

  const handleCodeClick = (code) => {
    setSelectedCode(code);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedCode(null);
  };

  const navigateToPage = (pageId) => {
    const chapterNum = pageId.split('-')[0];
    navigate(`/reader/${currentBook || 'phak'}/${chapterNum}?page=${pageId}`);
  };

  const selectedInfo = selectedCode ? acsData[selectedCode] : null;

  const getTaskElements = (codes) => ({
    knowledge: codes.filter(c => acsData[c]?.elementType === 'Knowledge'),
    risk:      codes.filter(c => acsData[c]?.elementType === 'Risk Management'),
    skill:     codes.filter(c => acsData[c]?.elementType === 'Skill'),
  });

  const areaInfo = acsStructure[activeArea];

  return (
    <div className="acs-page">
      <PageNavBar />

      <div className={`acs-layout ${panelOpen ? 'panel-open' : ''}`}>

        {/* Left: Area navigation */}
        <div className="acs-area-nav">
          <div className="acs-area-nav-title">Areas</div>
          {AREA_ORDER.map(area => (
            acsStructure[area] && (
              <button
                key={area}
                className={`acs-area-btn ${activeArea === area ? 'active' : ''}`}
                onClick={() => setActiveArea(area)}
              >
                <span className="acs-area-roman">{area}</span>
                <span className="acs-area-label">{acsStructure[area].title}</span>
              </button>
            )
          ))}
        </div>

        {/* Center: Tasks and elements */}
        <div className="acs-content">
          <div className="acs-area-header">
            <div className="acs-area-number">Area {activeArea}</div>
            <h1 className="acs-area-title">{areaInfo?.title}</h1>
            <div className="acs-legend">
              <span className="acs-legend-item acs-k">K Knowledge</span>
              <span className="acs-legend-item acs-r">R Risk Management</span>
              <span className="acs-legend-item acs-s">S Skill</span>
            </div>
          </div>

          {areaInfo && Object.entries(areaInfo.tasks).map(([taskKey, taskInfo]) => {
            const fullTaskKey = `${activeArea}-${taskKey}`;
            const isExpanded = expandedTasks[fullTaskKey] !== false;
            const { knowledge, risk, skill } = getTaskElements(taskInfo.codes);

            return (
              <div key={taskKey} className="acs-task">
                <button
                  className="acs-task-header"
                  onClick={() => toggleTask(fullTaskKey)}
                >
                  <span className="acs-task-label">Task {taskKey}. {taskInfo.title}</span>
                  <span className="acs-task-toggle">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {isExpanded && (
                  <div className="acs-task-body">
                    {taskInfo.codes[0] && acsData[taskInfo.codes[0]]?.references && (
                      <div className="acs-task-refs">
                        <span className="acs-refs-label">References: </span>
                        {acsData[taskInfo.codes[0]].references.join('; ')}
                      </div>
                    )}
                    {taskInfo.codes[0] && acsData[taskInfo.codes[0]]?.objective && (
                      <div className="acs-task-objective">
                        <span className="acs-objective-label">Objective: </span>
                        {acsData[taskInfo.codes[0]].objective}
                      </div>
                    )}

                    {knowledge.length > 0 && (
                      <div className="acs-element-group">
                        <div className="acs-element-group-title">Knowledge</div>
                        <div className="acs-element-subtext">The applicant demonstrates understanding of:</div>
                        {knowledge.map(code => (
                          <button key={code}
                            className={`acs-element acs-k ${selectedCode === code ? 'selected' : ''}`}
                            onClick={() => handleCodeClick(code)}
                          >
                            <span className="acs-element-code">{code}</span>
                            <span className="acs-element-desc">{acsData[code]?.description}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {risk.length > 0 && (
                      <div className="acs-element-group">
                        <div className="acs-element-group-title">Risk Management</div>
                        <div className="acs-element-subtext">The applicant is able to identify, assess, and mitigate risk associated with:</div>
                        {risk.map(code => (
                          <button key={code}
                            className={`acs-element acs-r ${selectedCode === code ? 'selected' : ''}`}
                            onClick={() => handleCodeClick(code)}
                          >
                            <span className="acs-element-code">{code}</span>
                            <span className="acs-element-desc">{acsData[code]?.description}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {skill.length > 0 && (
                      <div className="acs-element-group">
                        <div className="acs-element-group-title">Skills</div>
                        <div className="acs-element-subtext">The applicant exhibits the skill to:</div>
                        {skill.map(code => (
                          <button key={code}
                            className={`acs-element acs-s ${selectedCode === code ? 'selected' : ''}`}
                            onClick={() => handleCodeClick(code)}
                          >
                            <span className="acs-element-code">{code}</span>
                            <span className="acs-element-desc">{acsData[code]?.description}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Notes-style detail panel */}
        <div className={`acs-panel ${panelOpen ? 'open' : ''}`}>
          <div className="acs-panel-header">
            <div className="acs-panel-code">{selectedCode}</div>
            <button className="acs-panel-close" onClick={closePanel}>×</button>
          </div>

          {selectedInfo && (
            <div className="acs-panel-body">
              <div className="acs-panel-section">
                <div className="acs-panel-label">Type</div>
                <div className={`acs-panel-type-badge ${ELEMENT_TYPE_COLORS[selectedInfo.elementType]}`}>
                  {selectedInfo.elementType}
                </div>
              </div>

              <div className="acs-panel-section">
                <div className="acs-panel-label">Area</div>
                <div className="acs-panel-value">{selectedInfo.area} — {selectedInfo.areaTitle}</div>
              </div>

              <div className="acs-panel-section">
                <div className="acs-panel-label">Task</div>
                <div className="acs-panel-value">{selectedInfo.task} — {selectedInfo.taskTitle}</div>
              </div>

              <div className="acs-panel-section">
                <div className="acs-panel-label">Description</div>
                <div className="acs-panel-desc">{selectedInfo.description}</div>
              </div>

              {selectedInfo.objective && (
                <div className="acs-panel-section">
                  <div className="acs-panel-label">Objective</div>
                  <div className="acs-panel-value">{selectedInfo.objective}</div>
                </div>
              )}

              {selectedInfo.references && (
                <div className="acs-panel-section">
                  <div className="acs-panel-label">References</div>
                  <div className="acs-panel-refs">
                    {selectedInfo.references.map((ref, i) => (
                      <span key={i} className="acs-ref-tag">{ref}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="acs-panel-section">
                <div className="acs-panel-label">PHAK Pages</div>
                <div className="acs-panel-pages">
                  {(() => {
                    const pages = getACSPages(selectedCode, phakData);
                    if (pages.length === 0) {
                      return (
                        <div className="acs-no-pages">
                          <div className="acs-no-pages-icon">📄</div>
                          <div className="acs-no-pages-text">
                            {acsMapping[selectedCode] ? 'Page not found' : 'No pages mapped yet'}
                          </div>
                          <div className="acs-no-pages-sub">
                            {acsMapping[selectedCode]
                              ? `Target: page ${acsMapping[selectedCode].join(', ')}`
                              : 'Mapping coming in a future update'}
                          </div>
                        </div>
                      );
                    }
                    return pages.map(p => (
                      <button
                        key={p.page_number}
                        className="acs-page-card"
                        onClick={() => navigateToPage(p.page_number)}
                      >
                        <span className="acs-page-card-num">{p.page_number}</span>
                        <div>
                          <div className="acs-page-card-title">{p.page_title}</div>
                          <div className="acs-page-card-chapter">Ch. {p.chapter_number} — {p.chapter_title}</div>
                        </div>
                      </button>
                    ));
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default ACS;
