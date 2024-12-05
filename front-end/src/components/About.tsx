import React from 'react';
import { Helmet } from 'react-helmet';
import houseIcon from '../assets/icons/house.svg';
import facebookIcon from '../assets/icons/facebook.svg';
import twitterIcon from '../assets/icons/twitter.svg';
import linkedinIcon from '../assets/icons/linkedin.svg';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About - NZ Property Appraisal</title>
        <meta name="description" content="Learn about NZ Property Appraisal's AI-powered valuation technology and our commitment to providing accurate property appraisals in New Zealand." />
      </Helmet>

      <main className="about-container" role="main">
        <article className="about-content">
          <h1 className="about-title">About NZ Property Appraisal</h1>
          
          <section className="about-section" aria-labelledby="ai-technology">
            <h2 id="ai-technology">Powered by AI Technology</h2>
            <div className="about-icon">
              <img src={houseIcon} alt="" aria-hidden="true" />
            </div>
            <p>Developed by Nestech using cutting-edge AI technology, our property appraisal tool brings innovation to New Zealand's real estate market. We combine artificial intelligence with local market expertise to provide accurate and reliable property valuations.</p>
          </section>
          
          <section className="about-section" aria-labelledby="why-choose-us">
            <h2 id="why-choose-us">Why Choose Us?</h2>
            <ul role="list">
              <li>Advanced AI-powered valuation algorithms</li>
              <li>Comprehensive property analysis</li>
              <li>Instant property appraisal reports</li>
              <li>User-friendly interface</li>
              <li>New Zealand market-specific insights</li>
            </ul>
          </section>

          <section className="about-section" aria-labelledby="about-nestech">
            <h2 id="about-nestech">About Nestech</h2>
            <p>Nestech is a leading technology company in New Zealand, specializing in innovative solutions for the real estate industry. We combine local expertise with advanced technology to deliver cutting-edge tools that make property valuation more accessible and accurate.</p>
            <p>For more information about Nestech and our other services, please visit <a href="https://www.nestech.co.nz" target="_blank" rel="noopener noreferrer" className="external-link">www.nestech.co.nz<span className="sr-only">(opens in a new tab)</span></a></p>
          </section>
        </article>

        <footer className="footer" role="contentinfo">
          <div className="footer-content">
            <section className="footer-section">
              <h2 className="footer-heading">Contact</h2>
              <address>
                <p>Email: <a href="mailto:jian@nestech.co.nz">jian@nestech.co.nz</a></p>
                <p>Phone: <a href="tel:+64123456789">+64 123 456 789</a></p>
              </address>
            </section>
            <section className="footer-section">
              <h2 className="footer-heading">Follow Us</h2>
              <div className="social-links" role="list">
                <a href="https://facebook.com/nzappraisal" target="_blank" rel="noopener noreferrer" className="social-link">
                  <img src={facebookIcon} alt="Facebook" />
                </a>
                <a href="https://twitter.com/nzappraisal" target="_blank" rel="noopener noreferrer" className="social-link">
                  <img src={twitterIcon} alt="Twitter" />
                </a>
                <a href="https://linkedin.com/company/nzappraisal" target="_blank" rel="noopener noreferrer" className="social-link">
                  <img src={linkedinIcon} alt="LinkedIn" />
                </a>
              </div>
            </section>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} NZ Property Appraisal. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default About;
