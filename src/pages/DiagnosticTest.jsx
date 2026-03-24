import React from 'react';
import { phakData } from '../data/phakContent';

function DiagnosticTest() {
  // Find Chapter 7
  const chapter7 = phakData.chapters.find(ch => ch.chapter_number === 7);
  
  if (!chapter7) {
    return <div style={{padding: '2rem'}}>❌ Chapter 7 not found!</div>;
  }

  // Find sections with ACS codes
  const sectionsWithACS = [];
  const sectionsWithFigures = [];
  
  chapter7.pages.forEach(page => {
    page.sections.forEach(section => {
      if (section.acs_codes) {
        sectionsWithACS.push({
          title: section.title,
          codes: section.acs_codes
        });
      }
      if (section.figure) {
        sectionsWithFigures.push({
          title: section.title,
          figure: section.figure
        });
      }
    });
  });

  return (
    <div style={{padding: '2rem', fontFamily: 'sans-serif'}}>
      <h1>🔍 Diagnostic Test</h1>
      
      <div style={{background: '#f0f9ff', padding: '1rem', margin: '1rem 0', borderRadius: '8px'}}>
        <h2>✅ Chapter 7 Found</h2>
        <p>Title: {chapter7.title}</p>
        <p>Pages: {chapter7.pages.length}</p>
      </div>

      <div style={{background: '#fef3c7', padding: '1rem', margin: '1rem 0', borderRadius: '8px'}}>
        <h2>📋 Sections with ACS Codes: {sectionsWithACS.length}</h2>
        {sectionsWithACS.map((section, idx) => (
          <div key={idx} style={{marginBottom: '0.5rem'}}>
            <strong>{section.title}</strong>: {section.codes.join(', ')}
          </div>
        ))}
      </div>

      <div style={{background: '#d1fae5', padding: '1rem', margin: '1rem 0', borderRadius: '8px'}}>
        <h2>🖼️ Sections with Figures: {sectionsWithFigures.length}</h2>
        {sectionsWithFigures.map((section, idx) => (
          <div key={idx} style={{marginBottom: '0.5rem'}}>
            <strong>{section.title}</strong>: Figure {section.figure}
          </div>
        ))}
      </div>

      <div style={{marginTop: '2rem', padding: '1rem', background: '#fee2e2', borderRadius: '8px'}}>
        <h3>🧪 If you see this page:</h3>
        <ul>
          <li>✅ React is working</li>
          <li>✅ Data is loading</li>
          <li>✅ ACS codes are in the data: {sectionsWithACS.length > 0 ? 'YES' : 'NO'}</li>
          <li>✅ Figures are in the data: {sectionsWithFigures.length > 0 ? 'YES' : 'NO'}</li>
        </ul>
        <p><strong>Next:</strong> Go to Chapter 7 in the reader and check if badges/images appear</p>
      </div>
    </div>
  );
}

export default DiagnosticTest;
