import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './TermsAndConditions.css';

function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div className="terms-page">
      <div className="terms-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Terms & Conditions</h1>
        <div className="terms-company">Northbound Aviation, LLC</div>
      </div>

      <div className="terms-content">
        <div className="terms-updated">Last Updated: {new Date().toLocaleDateString()}</div>

        <section className="terms-section">
          <h2>1. General Information</h2>
          <p>
            This application provides access to aviation reference materials, including publicly available 
            publications issued by the United States Federal Aviation Administration (FAA), such as the 
            Pilot's Handbook of Aeronautical Knowledge (PHAK) and other FAA training materials.
          </p>
          <p>
            FAA publications are works of the United States Government and are generally in the public 
            domain pursuant to 17 U.S.C. §105. Original and official versions of these materials are 
            available directly from the Federal Aviation Administration at www.faa.gov.
          </p>
          <p>
            This application is an independently developed educational reference tool and is not affiliated 
            with, endorsed by, sponsored by, or maintained by the Federal Aviation Administration or any 
            other governmental authority.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Not an Official Aviation Source</h2>
          <p>
            The content provided within this application is not an official FAA publication and should not 
            be relied upon as a substitute for official FAA regulations, publications, advisory circulars, 
            notices, or other authoritative aviation guidance.
          </p>
          <p>
            Users are solely responsible for consulting the most current official FAA publications and 
            regulatory materials when conducting flight training, flight operations, regulatory compliance, 
            or aeronautical decision making.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Educational and Reference Use Only</h2>
          <p>
            This application is intended solely for educational and informational reference purposes for 
            pilots, student pilots, aviation educators, and aviation enthusiasts.
          </p>
          <p>The information provided within the application is not intended to replace:</p>
          <ul>
            <li>Formal flight training</li>
            <li>Certified flight instructor guidance</li>
            <li>Official FAA publications or regulatory materials</li>
            <li>Approved flight manuals or aircraft documentation</li>
            <li>Operational decision-making tools</li>
          </ul>
          <p>Use of this application does not constitute aviation instruction, regulatory guidance, or operational approval.</p>
        </section>

        <section className="terms-section">
          <h2>4. Accuracy, Completeness, and Currency</h2>
          <p>
            While reasonable efforts are made to ensure the accuracy and completeness of the information 
            presented within this application, the developers make no representations or warranties regarding 
            the accuracy, reliability, completeness, or timeliness of the information provided.
          </p>
          <p>
            FAA publications are periodically revised, updated, or replaced. The content presented within 
            this application may not reflect the most recent FAA revisions or regulatory changes.
          </p>
          <p>
            Users should verify critical information directly from official FAA publications and sources 
            prior to relying on it for flight training or operational purposes.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. No Operational Use</h2>
          <p>
            The content contained within this application is not intended for use in real-time flight 
            operations, navigation, flight planning, or aeronautical decision making.
          </p>
          <p>
            Pilots and aviation professionals must rely on official FAA publications, certified navigation 
            products, approved aircraft documentation, and appropriate training when conducting flight operations.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, the developers, contributors, and distributors 
            of this application shall not be liable for any direct, indirect, incidental, consequential, 
            special, or punitive damages arising out of or related to:
          </p>
          <ul>
            <li>Use of the application</li>
            <li>Reliance on information contained within the application</li>
            <li>Errors or omissions in the content</li>
            <li>Inaccurate or outdated information</li>
            <li>Inability to access or use the application</li>
          </ul>
          <p>Use of this application is entirely at the user's own risk.</p>
        </section>

        <section className="terms-section">
          <h2>7. User Responsibility</h2>
          <p>
            Users of this application acknowledge and agree that they are responsible for verifying aviation 
            information through official FAA publications and regulatory sources prior to relying upon it for 
            training, operational, or regulatory purposes.
          </p>
          <p>
            The developers assume no responsibility for decisions made by users based on information contained 
            within the application.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Intellectual Property and Attribution</h2>
          <p>
            FAA publications reproduced or referenced within this application are works of the United States 
            Government and are generally in the public domain.
          </p>
          <p>
            Formatting, indexing, navigation features, software functionality, and design elements of this 
            application may constitute proprietary intellectual property of the application developer.
          </p>
          <p>
            Any trademarks, service marks, or product names referenced within the application remain the 
            property of their respective owners. The inclusion of such names does not imply endorsement, 
            sponsorship, or affiliation.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. External Resources</h2>
          <p>
            This application may contain references or links to external resources, including official FAA 
            publications or other aviation materials.
          </p>
          <p>
            The developers do not control and are not responsible for the content, availability, or accuracy 
            of external websites or resources.
          </p>
        </section>

        <section className="terms-section">
          <h2>10. Changes to Content and Terms</h2>
          <p>
            The developers reserve the right to modify, update, or remove content from the application at 
            any time without notice.
          </p>
          <p>
            These Terms and Conditions may also be updated periodically. Continued use of the application 
            constitutes acceptance of any revised terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>11. Acceptance of Terms</h2>
          <p>
            By using this application, users acknowledge that they have read, understood, and agreed to 
            these Terms and Conditions.
          </p>
          <p>
            If a user does not agree with these terms, they should discontinue use of the application.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default TermsAndConditions;
