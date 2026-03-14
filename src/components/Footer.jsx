import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-disclaimer">
          <p>
            This application provides access to publicly available FAA aviation training materials, 
            including the Pilot's Handbook of Aeronautical Knowledge. It is an independent educational 
            reference tool and is not affiliated with or endorsed by the Federal Aviation Administration. 
            Information is provided for reference purposes only. Users should consult official FAA 
            publications for the most current and authoritative guidance.
          </p>
        </div>
        
        <div className="footer-links">
          <Link to="/terms" className="footer-link">Terms & Conditions</Link>
          <span className="footer-separator">•</span>
          <a 
            href="https://www.faa.gov" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link"
          >
            Official FAA Website
          </a>
        </div>
        
        <div className="footer-copyright">
          © {new Date().getFullYear()} Northbound Aviation, LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
